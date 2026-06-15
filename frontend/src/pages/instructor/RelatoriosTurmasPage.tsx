import { BarChart2, Download, Users, CheckCircle, TrendingUp } from 'lucide-react'
import { Card, Button } from '@/components/ui'

const COLOR = '#8B5CF6'

const TURMAS = [
  {
    id: 1, nome: 'TIG Avançado', process: 'TIG', alunos: 12,
    presenca: 87, notaMedia: 8.2, aprovacao: 91, aulas: 24, aulasDadas: 16,
    destaques: ['Alexandre Ferreira (9.2)', 'João Pedro Silva (8.8)'],
  },
  {
    id: 2, nome: 'MIG/MAG Industrial', process: 'MIG/MAG', alunos: 10,
    presenca: 92, notaMedia: 7.9, aprovacao: 90, aulas: 20, aulasDadas: 8,
    destaques: ['Diego Santos (9.0)', 'Eduardo Lima (8.5)'],
  },
  {
    id: 3, nome: 'Eletrodo Revestido', process: 'SMAW', alunos: 8,
    presenca: 75, notaMedia: 7.1, aprovacao: 87, aulas: 18, aulasDadas: 15,
    destaques: ['Gabriel Rocha (8.0)', 'Henrique Costa (7.5)'],
  },
]

function Bar({ value, color, max = 100 }: { value: number; color: string; max?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-[var(--color-surface-elevated)]">
        <div className="h-full rounded-full" style={{ width: `${(value / max) * 100}%`, background: color }} />
      </div>
      <span className="text-xs font-semibold w-10 text-right" style={{ color }}>{value}%</span>
    </div>
  )
}

export function RelatoriosTurmasPage() {
  const totalAlunos = TURMAS.reduce((s, t) => s + t.alunos, 0)
  const mediaPresenca = Math.round(TURMAS.reduce((s, t) => s + t.presenca, 0) / TURMAS.length)
  const mediaNota = (TURMAS.reduce((s, t) => s + t.notaMedia, 0) / TURMAS.length).toFixed(1)
  const mediaAprov = Math.round(TURMAS.reduce((s, t) => s + t.aprovacao, 0) / TURMAS.length)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Relatórios de Turmas</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Frequência, notas e taxa de aprovação por turma</p>
        </div>
        <Button leftIcon={<Download size={15} />} style={{ background: COLOR }}>Exportar PDF</Button>
      </div>

      {/* Overall stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total de alunos',   value: totalAlunos,      icon: Users,     color: COLOR      },
          { label: 'Presença média',    value: `${mediaPresenca}%`, icon: CheckCircle, color: '#10B981' },
          { label: 'Nota média geral',  value: mediaNota,         icon: BarChart2, color: '#F59E0B'  },
          { label: 'Taxa de aprovação', value: `${mediaAprov}%`,  icon: TrendingUp, color: '#3B82F6' },
        ].map(s => {
          const Icon = s.icon
          return (
            <Card key={s.label}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: s.color + '15' }}>
                  <Icon size={18} style={{ color: s.color }} />
                </div>
                <div>
                  <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{s.label}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Per-class cards */}
      <div className="space-y-4">
        {TURMAS.map(t => (
          <Card key={t.id}>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-black"
                style={{ background: COLOR + '15', color: COLOR }}>
                {t.process}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-[var(--color-text)]">{t.nome}</h3>
                    <p className="text-xs text-[var(--color-text-muted)]">{t.alunos} alunos · {t.aulasDadas}/{t.aulas} aulas</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black" style={{ color: COLOR }}>{t.notaMedia}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">nota média</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)] mb-1">Presença</p>
                    <Bar value={t.presenca} color={t.presenca >= 85 ? '#10B981' : t.presenca >= 75 ? '#F59E0B' : '#EF4444'} />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)] mb-1">Taxa de aprovação</p>
                    <Bar value={t.aprovacao} color={COLOR} />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)] mb-1">Progresso do curso</p>
                    <Bar value={Math.round((t.aulasDadas / t.aulas) * 100)} color="#3B82F6" />
                  </div>
                </div>

                <div>
                  <p className="text-xs text-[var(--color-text-muted)] mb-1">Destaques da turma</p>
                  <div className="flex gap-2 flex-wrap">
                    {t.destaques.map(d => (
                      <span key={d} className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: COLOR + '12', color: COLOR }}>
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
