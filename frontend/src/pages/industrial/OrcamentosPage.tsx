import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui'
import { CheckCircle, XCircle, FileText, ChevronDown, ChevronUp, Plus } from 'lucide-react'

const COLOR = '#3B82F6'

type StatusOrc = 'Rascunho' | 'Enviado' | 'Em análise' | 'Aprovado' | 'Rejeitado' | 'Cancelado'

const STATUS_COLORS: Record<StatusOrc, string> = {
  'Rascunho':   '#64748B',
  'Enviado':    '#3B82F6',
  'Em análise': '#F59E0B',
  'Aprovado':   '#10B981',
  'Rejeitado':  '#EF4444',
  'Cancelado':  '#64748B',
}

interface Orcamento {
  id: string
  tipo: string
  descricao: string
  local: string
  data: string
  prazo: string
  valor: string
  status: StatusOrc
  escopo: string[]
  validade: string
}

const ORCAMENTOS: Orcamento[] = [
  {
    id: 'ORC-2024-021',
    tipo: 'Caldeiraria',
    descricao: 'Reparo em vaso de pressão VP-08 — inspeção e soldagem',
    local: 'Planta A — Rod. SC-108 km 12, Itajaí',
    data: '05/06/2026',
    prazo: '30/06/2026',
    valor: 'R$ 38.500,00',
    status: 'Em análise',
    validade: '05/07/2026',
    escopo: [
      'Inspeção visual e dimensional do VP-08',
      'Soldagem conforme WPS-TIG-001 em aço inox 316L',
      'Ensaio por líquido penetrante após soldagem',
      'Relatório técnico e ART',
    ],
  },
  {
    id: 'ORC-2024-019',
    tipo: 'Treinamento',
    descricao: 'Treinamento NR-13 — Vasos de Pressão (18 colaboradores)',
    local: 'Instalações da empresa contratante',
    data: '28/05/2026',
    prazo: '20/06/2026',
    valor: 'R$ 12.200,00',
    status: 'Aprovado',
    validade: '28/06/2026',
    escopo: [
      'Carga horária: 16h (2 dias)',
      'Teoria: NR-13 completa + avaliação escrita',
      'Prática: Identificação de não conformidades',
      'Certificados individuais + ART',
    ],
  },
  {
    id: 'ORC-2024-015',
    tipo: 'Soldagem',
    descricao: 'Qualificação de 4 soldadores — processo TIG',
    local: 'Escola Welder & Fusion — Itajaí',
    data: '10/05/2026',
    prazo: '—',
    valor: 'R$ 8.800,00',
    status: 'Rejeitado',
    validade: '—',
    escopo: [
      'Qualificação conforme ASME IX',
      '4 soldadores processo GTAW (TIG)',
      'Emissão de CQMO individual',
      'Relatório de ensaios',
    ],
  },
]

export function OrcamentosPage() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<StatusOrc | 'Todos'>('Todos')
  const [approving, setApproving] = useState<string | null>(null)
  const [localStatus, setLocalStatus] = useState<Record<string, StatusOrc>>({})

  const allStatuses: (StatusOrc | 'Todos')[] = ['Todos', 'Enviado', 'Em análise', 'Aprovado', 'Rejeitado', 'Cancelado']

  const filtered = ORCAMENTOS.filter(o => {
    const s = localStatus[o.id] ?? o.status
    return filterStatus === 'Todos' || s === filterStatus
  })

  function approve(id: string) {
    setLocalStatus(prev => ({ ...prev, [id]: 'Aprovado' }))
    setApproving(null)
  }

  function reject(id: string) {
    setLocalStatus(prev => ({ ...prev, [id]: 'Rejeitado' }))
    setApproving(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Meus Orçamentos</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Histórico e aprovação de propostas comerciais</p>
        </div>
        <Link to="/industrial/orcamento/novo"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white" style={{ background: COLOR }}>
          <Plus size={15} /> Novo Orçamento
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {allStatuses.map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className="px-3 py-1.5 rounded-full text-xs font-bold border transition-all"
            style={{
              background: filterStatus === s ? (s === 'Todos' ? COLOR : STATUS_COLORS[s as StatusOrc]) + '20' : 'transparent',
              borderColor: filterStatus === s ? (s === 'Todos' ? COLOR : STATUS_COLORS[s as StatusOrc]) : 'var(--color-border)',
              color: filterStatus === s ? (s === 'Todos' ? COLOR : STATUS_COLORS[s as StatusOrc]) : 'var(--color-text-muted)',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map(orc => {
          const status = localStatus[orc.id] ?? orc.status
          const statusColor = STATUS_COLORS[status] ?? '#64748B'
          const isExpanded = expanded === orc.id
          const canApprove = status === 'Em análise' || status === 'Enviado'

          return (
            <Card key={orc.id}>
              <div className="p-1">
                {/* Header row */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: COLOR + '15' }}>
                    <FileText size={16} style={{ color: COLOR }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-xs font-black" style={{ color: COLOR }}>{orc.id}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{ background: statusColor + '20', color: statusColor }}>{status}</span>
                      <span className="text-xs text-[var(--color-text-muted)] ml-auto">{orc.data}</span>
                    </div>
                    <p className="text-sm font-semibold text-[var(--color-text)]">{orc.descricao}</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{orc.tipo} · {orc.local}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-black" style={{ color: '#10B981' }}>{orc.valor}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)]">Válido até {orc.validade}</p>
                  </div>
                </div>

                {/* Expandable */}
                <div className="mt-3 flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => setExpanded(isExpanded ? null : orc.id)}
                    className="text-xs font-semibold flex items-center gap-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                  >
                    {isExpanded ? <><ChevronUp size={12} /> Ocultar detalhes</> : <><ChevronDown size={12} /> Ver escopo</>}
                  </button>

                  {canApprove && approving !== orc.id && (
                    <button
                      onClick={() => setApproving(orc.id)}
                      className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                      style={{ background: '#10B981' }}
                    >
                      <CheckCircle size={12} /> Aprovar / Rejeitar
                    </button>
                  )}

                  {canApprove && approving === orc.id && (
                    <div className="ml-auto flex items-center gap-2">
                      <p className="text-xs text-[var(--color-text-muted)]">Confirme sua decisão:</p>
                      <button onClick={() => approve(orc.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white" style={{ background: '#10B981' }}>
                        <CheckCircle size={12} /> Aprovar
                      </button>
                      <button onClick={() => reject(orc.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white" style={{ background: '#EF4444' }}>
                        <XCircle size={12} /> Rejeitar
                      </button>
                      <button onClick={() => setApproving(null)} className="text-xs text-[var(--color-text-muted)] hover:underline">
                        Cancelar
                      </button>
                    </div>
                  )}

                  {status === 'Aprovado' && (
                    <div className="ml-auto flex items-center gap-1 text-xs font-bold" style={{ color: '#10B981' }}>
                      <CheckCircle size={12} /> Aprovado
                    </div>
                  )}
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)] mb-2">Escopo do serviço</p>
                        <ul className="space-y-1.5">
                          {orc.escopo.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-[var(--color-text)]">
                              <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-black text-white" style={{ background: COLOR }}>{i + 1}</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)] mb-1">Prazo de execução</p>
                          <p className="text-sm text-[var(--color-text)]">{orc.prazo}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)] mb-1">Local</p>
                          <p className="text-sm text-[var(--color-text)]">{orc.local}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)] mb-1">Valor total</p>
                          <p className="text-lg font-black" style={{ color: '#10B981' }}>{orc.valor}</p>
                        </div>
                        <button className="text-xs font-bold flex items-center gap-1" style={{ color: COLOR }}>
                          ↓ Baixar proposta PDF
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )
        })}

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <FileText size={32} className="mx-auto mb-3" style={{ color: COLOR + '40' }} />
            <p className="text-sm text-[var(--color-text-muted)]">Nenhum orçamento com esse status</p>
          </div>
        )}
      </div>
    </div>
  )
}
