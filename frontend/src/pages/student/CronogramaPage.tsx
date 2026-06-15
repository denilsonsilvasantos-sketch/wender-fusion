import { Calendar, Clock, MapPin } from 'lucide-react'
import { Card } from '@/components/ui'

const COLOR = '#6366F1'

const DIAS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

const AULAS = [
  { dia: 'Segunda', hora: '08:00–12:00', turma: 'TIG Avançado — Módulo 3',    local: 'Lab 1', tipo: 'pratica' },
  { dia: 'Terça',   hora: '08:00–12:00', turma: 'TIG Avançado — Teórico',     local: 'Sala A', tipo: 'teorica' },
  { dia: 'Quarta',  hora: '08:00–12:00', turma: 'TIG Avançado — Módulo 3',    local: 'Lab 1', tipo: 'pratica' },
  { dia: 'Quinta',  hora: '08:00–10:00', turma: 'Avaliação Teórica — TIG',    local: 'Sala A', tipo: 'avaliacao' },
  { dia: 'Sexta',   hora: '08:00–12:00', turma: 'TIG Avançado — Módulo 4',    local: 'Lab 1', tipo: 'pratica' },
]

const TIPO_CFG = {
  pratica:   { label: 'Prática',   color: COLOR      },
  teorica:   { label: 'Teórica',   color: '#3B82F6'  },
  avaliacao: { label: 'Avaliação', color: '#F59E0B'  },
}

const PROXIMOS_EVENTOS = [
  { data: '18/06', evento: 'Avaliação Teórica — TIG Módulo 3', tipo: 'avaliacao' },
  { data: '20/06', evento: 'Entrega de lista de exercícios',    tipo: 'teorica'  },
  { data: '25/06', evento: 'Avaliação Prática — Passe de raiz', tipo: 'avaliacao' },
  { data: '30/06', evento: 'Encerramento do módulo 4',          tipo: 'pratica'  },
]

export function CronogramaPage() {
  const hoje = new Date().getDay() // 0=dom, 1=seg...
  const diaAtual = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'][hoje]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Cronograma</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Grade de aulas e calendário do semestre</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly schedule */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Semana atual</h2>
          {DIAS.map(dia => {
            const aulas = AULAS.filter(a => a.dia === dia)
            const isHoje = dia === diaAtual
            return (
              <div key={dia} className="rounded-xl overflow-hidden border"
                style={{ borderColor: isHoje ? COLOR + '40' : 'var(--color-border)' }}>
                <div className="px-4 py-2 flex items-center justify-between"
                  style={{ background: isHoje ? COLOR + '12' : 'var(--color-surface-elevated)' }}>
                  <span className="text-sm font-bold" style={{ color: isHoje ? COLOR : 'var(--color-text)' }}>
                    {dia} {isHoje && <span className="text-xs font-normal ml-1 opacity-70">(hoje)</span>}
                  </span>
                </div>
                {aulas.length === 0 ? (
                  <div className="px-4 py-3 text-xs text-[var(--color-text-muted)]">Sem aulas</div>
                ) : (
                  <div className="divide-y divide-[var(--color-border)]">
                    {aulas.map((a, i) => {
                      const cfg = TIPO_CFG[a.tipo as keyof typeof TIPO_CFG]
                      return (
                        <div key={i} className="px-4 py-3 flex items-center gap-3">
                          <span className="w-1.5 h-8 rounded-full flex-shrink-0" style={{ background: cfg.color }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[var(--color-text)] truncate">{a.turma}</p>
                            <div className="flex gap-3 mt-0.5 text-xs text-[var(--color-text-muted)]">
                              <span className="flex items-center gap-1"><Clock size={11} />{a.hora}</span>
                              <span className="flex items-center gap-1"><MapPin size={11} />{a.local}</span>
                            </div>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{ background: cfg.color + '15', color: cfg.color }}>{cfg.label}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Upcoming events */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Próximos eventos</h2>
          <Card>
            <div className="space-y-3">
              {PROXIMOS_EVENTOS.map((e, i) => {
                const cfg = TIPO_CFG[e.tipo as keyof typeof TIPO_CFG]
                return (
                  <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0"
                    style={{ borderColor: 'var(--color-border)' }}>
                    <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-xs font-black"
                      style={{ background: cfg.color + '15', color: cfg.color }}>
                      {e.data.split('/')[0]}
                      <span className="font-normal text-[10px] opacity-70">/{e.data.split('/')[1]}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-[var(--color-text)] leading-snug">{e.evento}</p>
                      <span className="text-xs" style={{ color: cfg.color }}>{cfg.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={15} style={{ color: COLOR }} />
              <span className="text-sm font-semibold text-[var(--color-text)]">Resumo do semestre</span>
            </div>
            <div className="space-y-2 text-sm">
              {[
                { label: 'Início',       value: '05/05/2026' },
                { label: 'Término',      value: '30/07/2026' },
                { label: 'Total de aulas', value: '48 aulas' },
                { label: 'Carga horária',  value: '160 h' },
              ].map(r => (
                <div key={r.label} className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">{r.label}</span>
                  <span className="font-medium text-[var(--color-text)]">{r.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
