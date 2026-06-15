import { Briefcase, Clock, CheckCircle, XCircle, Eye } from 'lucide-react'
import { Card } from '@/components/ui'

const COLOR = '#10B981'

const CANDIDATURAS = [
  { id: 1, cargo: 'Soldador TIG — Aço Inox',     empresa: 'Metalúrgica Ferro & Cia', data: '10/06/2026', status: 'analise',  feedback: null },
  { id: 2, cargo: 'Inspetor de Soldagem Nível I', empresa: 'Petroquímica Delta',      data: '05/06/2026', status: 'aprovado', feedback: 'Perfil aprovado. Aguardando contato do RH.' },
  { id: 3, cargo: 'Soldador MIG/MAG Senior',      empresa: 'Auto Peças Nobre',        data: '01/06/2026', status: 'recusado', feedback: 'Perfil não atende ao requisito de 5 anos de experiência.' },
  { id: 4, cargo: 'Soldador TIG/MIG Automotivo',  empresa: 'Montadora Fortal',        data: '28/05/2026', status: 'analise',  feedback: null },
]

const STATUS_CFG = {
  analise:  { label: 'Em análise',  icon: Clock,         color: '#F59E0B' },
  aprovado: { label: 'Aprovado',    icon: CheckCircle,   color: '#10B981' },
  recusado: { label: 'Recusado',    icon: XCircle,       color: '#EF4444' },
}

export function CandidaturasPage() {
  const analise  = CANDIDATURAS.filter(c => c.status === 'analise').length
  const aprovado = CANDIDATURAS.filter(c => c.status === 'aprovado').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Minhas Candidaturas</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Acompanhe o status das suas candidaturas</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Em análise', value: analise,                    color: '#F59E0B' },
          { label: 'Aprovadas',  value: aprovado,                   color: '#10B981' },
          { label: 'Total',      value: CANDIDATURAS.length,        color: '#64748B' },
        ].map(s => (
          <Card key={s.label}>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="space-y-3">
        {CANDIDATURAS.map(c => {
          const cfg  = STATUS_CFG[c.status as keyof typeof STATUS_CFG]
          const Icon = cfg.icon
          return (
            <Card key={c.id}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: COLOR + '15' }}>
                  <Briefcase size={17} style={{ color: COLOR }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[var(--color-text)]">{c.cargo}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">{c.empresa}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Candidatado em {c.data}</p>
                  {c.feedback && (
                    <div className="mt-2 flex items-start gap-2 p-2.5 rounded-lg text-xs"
                      style={{ background: cfg.color + '10', color: cfg.color }}>
                      <Eye size={12} className="flex-shrink-0 mt-0.5" />
                      {c.feedback}
                    </div>
                  )}
                </div>
                <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg flex-shrink-0"
                  style={{ background: cfg.color + '15', color: cfg.color }}>
                  <Icon size={13} />{cfg.label}
                </span>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
