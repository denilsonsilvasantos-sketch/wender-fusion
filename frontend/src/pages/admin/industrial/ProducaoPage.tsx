import { useState } from 'react'
import { Layers, Wrench, CheckCircle2, Clock, Zap, Users } from 'lucide-react'
import { Card } from '@/components/ui'

const COLOR = '#3B82F6'

type EtapaStatus = 'waiting' | 'in_progress' | 'done'

interface OSMock {
  id: string
  os: string
  client: string
  service: string
  technician: string
  etapa: string
  status: EtapaStatus
  progress: number
}

const ETAPAS = [
  { key: 'waiting',     label: 'Aguardando',    icon: Clock,        color: '#6B7280' },
  { key: 'in_progress', label: 'Em execução',   icon: Zap,          color: '#f59e0b' },
  { key: 'done',        label: 'Concluído',      icon: CheckCircle2, color: '#22c55e' },
]

const MOCK_OS: OSMock[] = [
  { id: '1', os: 'OS-2025-041', client: 'Metalúrgica Aço Norte',  service: 'Solda TIG em vaso de pressão',      technician: 'Carlos Silva',   etapa: 'Preparação',  status: 'in_progress', progress: 30 },
  { id: '2', os: 'OS-2025-042', client: 'Indústria Pesada Sul',   service: 'Inspeção por ultrassom',             technician: 'Rafael Souza',   etapa: 'Inspeção',    status: 'in_progress', progress: 65 },
  { id: '3', os: 'OS-2025-043', client: 'Construtora Pinheiro',   service: 'Laudo técnico NR-13',               technician: 'Ana Lima',       etapa: 'Aguardando',  status: 'waiting',     progress: 0  },
  { id: '4', os: 'OS-2025-039', client: 'Petroquímica Leste',     service: 'Manutenção preditiva linha 4',      technician: 'Marcos Oliveira',etapa: 'Finalização', status: 'in_progress', progress: 90 },
  { id: '5', os: 'OS-2025-037', client: 'Metalúrgica Aço Norte',  service: 'Solda MIG em estrutura metálica',   technician: 'Carlos Silva',   etapa: 'Concluído',   status: 'done',        progress: 100 },
  { id: '6', os: 'OS-2025-038', client: 'Siderúrgica Sul',        service: 'Qualificação de procedimento WPQR', technician: 'Ana Lima',       etapa: 'Concluído',   status: 'done',        progress: 100 },
]

export function IndustrialProducaoPage() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban')

  const waiting    = MOCK_OS.filter(o => o.status === 'waiting')
  const inProgress = MOCK_OS.filter(o => o.status === 'in_progress')
  const done       = MOCK_OS.filter(o => o.status === 'done')

  const OSCard = ({ os }: { os: OSMock }) => (
    <div className="rounded-xl border bg-[var(--color-surface)] p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono font-bold" style={{ color: COLOR }}>{os.os}</span>
        <span className="text-[10px] text-[var(--color-text-muted)]">{os.etapa}</span>
      </div>
      <p className="text-xs font-medium text-[var(--color-text)] leading-snug">{os.service}</p>
      <p className="text-[11px] text-[var(--color-text-muted)]">{os.client}</p>
      {os.progress > 0 && os.progress < 100 && (
        <div>
          <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] mb-1">
            <span>Progresso</span><span>{os.progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-[var(--color-surface-elevated)]">
            <div className="h-full rounded-full transition-all" style={{ width: `${os.progress}%`, background: COLOR }} />
          </div>
        </div>
      )}
      <div className="flex items-center gap-1 text-[11px] text-[var(--color-text-muted)]">
        <Users size={10} />{os.technician}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Produção</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Acompanhamento de ordens de serviço em andamento</p>
        </div>
        <div className="flex border border-[var(--color-border)] rounded-lg overflow-hidden text-xs">
          {(['kanban', 'list'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className="px-3 py-1.5 transition-colors font-medium capitalize"
              style={view === v ? { background: COLOR, color: '#fff' } : { color: 'var(--color-text-muted)' }}>
              {v === 'kanban' ? 'Kanban' : 'Lista'}
            </button>
          ))}
        </div>
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl border text-sm" style={{ background: COLOR + '08', borderColor: COLOR + '25', color: COLOR }}>
        <Layers size={15} className="flex-shrink-0 mt-0.5" />
        <span>Produção em desenvolvimento — dados abaixo são ilustrativos. Integração com ordens de serviço em breve.</span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Aguardando', value: waiting.length, color: '#6B7280' },
          { label: 'Em execução', value: inProgress.length, color: '#f59e0b' },
          { label: 'Concluídas hoje', value: done.length, color: '#22c55e' },
        ].map(s => (
          <div key={s.label} className="rounded-xl border p-4" style={{ borderColor: s.color + '25', background: 'var(--color-surface)' }}>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {view === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ETAPAS.map(etapa => {
            const items = MOCK_OS.filter(o => o.status === etapa.key as EtapaStatus)
            const Icon = etapa.icon
            return (
              <div key={etapa.key} className="rounded-xl border overflow-hidden" style={{ borderColor: etapa.color + '30' }}>
                <div className="flex items-center gap-2 px-3 py-2.5" style={{ background: etapa.color + '10' }}>
                  <Icon size={13} style={{ color: etapa.color }} />
                  <span className="font-semibold text-sm text-[var(--color-text)] flex-1">{etapa.label}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: etapa.color + '20', color: etapa.color }}>{items.length}</span>
                </div>
                <div className="p-2 space-y-2 bg-[var(--color-bg)]">
                  {items.length === 0
                    ? <p className="text-center text-xs text-[var(--color-text-muted)] py-4">Vazio</p>
                    : items.map(os => <OSCard key={os.id} os={os} />)
                  }
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <Card noPadding>
          <div className="divide-y divide-[var(--color-border)]">
            {MOCK_OS.map(os => {
              const etapa = ETAPAS.find(e => e.key === os.status)!
              const Icon = etapa.icon
              return (
                <div key={os.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: etapa.color + '15' }}>
                    <Icon size={14} style={{ color: etapa.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[11px] font-mono font-bold" style={{ color: COLOR }}>{os.os}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: etapa.color + '15', color: etapa.color }}>{etapa.label}</span>
                    </div>
                    <p className="text-sm font-medium text-[var(--color-text)] truncate">{os.service}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{os.client} · {os.technician}</p>
                  </div>
                  {os.progress > 0 && os.progress < 100 && (
                    <div className="w-20 flex-shrink-0">
                      <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] mb-1">
                        <span>{os.progress}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[var(--color-surface-elevated)]">
                        <div className="h-full rounded-full" style={{ width: `${os.progress}%`, background: COLOR }} />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}
