import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, FileText, CheckCircle2, XCircle, Send, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Quotation, ServiceClient, QuotationStatus } from '@/types'
import { Card, Select, Input, Spinner } from '@/components/ui'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Link } from 'react-router-dom'

const COLOR = '#3B82F6'

const PIPELINE_STAGES: { status: QuotationStatus; label: string; icon: React.ElementType; color: string }[] = [
  { status: 'sent',     label: 'Em negociação', icon: Send,          color: '#f59e0b' },
  { status: 'approved', label: 'Aprovadas',      icon: CheckCircle2, color: '#22c55e' },
  { status: 'rejected', label: 'Recusadas',      icon: XCircle,      color: '#ef4444' },
]

const FILTER_OPTIONS = [
  { value: 'sent',     label: 'Em negociação' },
  { value: 'approved', label: 'Aprovadas' },
  { value: 'rejected', label: 'Recusadas' },
]

export function IndustrialPropostasPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('q') ?? ''
  const filterStatus = searchParams.get('status') ?? ''

  function updateParam(k: string, v: string) {
    setSearchParams(prev => { const n = new URLSearchParams(prev); v ? n.set(k, v) : n.delete(k); return n }, { replace: true })
  }

  useEffect(() => {
    supabase
      .from('quotations')
      .select('*, client:service_clients(id,name,email,phone)')
      .in('status', ['sent', 'approved', 'rejected'])
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setQuotations((data || []) as Quotation[])
        setLoading(false)
      })
  }, [])

  const filtered = quotations.filter(q => {
    const client = (q as any).client as ServiceClient | undefined
    const matchSearch = !search || q.title.toLowerCase().includes(search.toLowerCase()) || client?.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !filterStatus || q.status === filterStatus
    return matchSearch && matchStatus
  })

  const sent = quotations.filter(q => q.status === 'sent')
  const approved = quotations.filter(q => q.status === 'approved')
  const rejected = quotations.filter(q => q.status === 'rejected')
  const conversionRate = quotations.length > 0 ? Math.round((approved.length / quotations.length) * 100) : 0
  const totalApproved = approved.reduce((s, q) => s + (q.total_amount || 0), 0)

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Propostas Comerciais</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Pipeline de propostas enviadas a clientes</p>
        </div>
        <Link to="/admin/industrial/orcamentos" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)] px-3 py-1.5 rounded-lg transition-colors">
          Gerenciar orçamentos →
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Em negociação', value: sent.length, color: '#f59e0b' },
          { label: 'Aprovadas', value: approved.length, color: '#22c55e' },
          { label: 'Taxa de conversão', value: `${conversionRate}%`, color: COLOR },
          { label: 'Valor contratado', value: formatCurrency(totalApproved), color: '#8B5CF6' },
        ].map(s => (
          <div key={s.label} className="rounded-xl border p-4" style={{ borderColor: s.color + '25', background: 'var(--color-surface)' }}>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input placeholder="Buscar por título ou cliente..." value={search} onChange={e => updateParam('q', e.target.value)} leftIcon={<Search size={16} />} className="flex-1" />
        <Select value={filterStatus} onChange={e => updateParam('status', e.target.value)} placeholder="Todos os status" options={FILTER_OPTIONS} className="sm:w-44" />
      </div>

      {/* Pipeline view or list */}
      {!filterStatus && !search
        ? (
          <div className="space-y-4">
            {PIPELINE_STAGES.map(stage => {
              const stageItems = quotations.filter(q => q.status === stage.status)
              const Icon = stage.icon
              return (
                <div key={stage.status} className="rounded-xl border overflow-hidden" style={{ borderColor: stage.color + '30' }}>
                  <div className="flex items-center gap-3 px-4 py-3" style={{ background: stage.color + '08' }}>
                    <Icon size={14} style={{ color: stage.color }} />
                    <span className="font-semibold text-sm text-[var(--color-text)] flex-1">{stage.label}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: stage.color + '20', color: stage.color }}>{stageItems.length}</span>
                  </div>
                  {stageItems.length === 0
                    ? <div className="px-4 py-4 text-center text-sm text-[var(--color-text-muted)]">Nenhuma proposta neste estágio</div>
                    : <div className="divide-y divide-[var(--color-border)]">
                      {stageItems.map(q => {
                        const client = (q as any).client as ServiceClient | undefined
                        return (
                          <div key={q.id} className="flex items-center gap-4 px-4 py-3 bg-[var(--color-surface)]">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[var(--color-text)] truncate">{q.title}</p>
                              <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)] mt-0.5">
                                {client && <span>{client.name}</span>}
                                {q.valid_until && <span>Válido até {formatDate(q.valid_until)}</span>}
                              </div>
                            </div>
                            {q.total_amount != null && <span className="font-semibold text-sm flex-shrink-0" style={{ color: stage.color }}>{formatCurrency(q.total_amount)}</span>}
                          </div>
                        )
                      })}
                    </div>
                  }
                </div>
              )
            })}
          </div>
        )
        : (
          <Card noPadding>
            {filtered.length === 0
              ? <div className="text-center py-12 text-[var(--color-text-muted)]"><FileText size={36} className="mx-auto mb-3 opacity-30" /><p>Nenhuma proposta encontrada</p></div>
              : <div className="divide-y divide-[var(--color-border)]">
                {filtered.map(q => {
                  const client = (q as any).client as ServiceClient | undefined
                  const stage = PIPELINE_STAGES.find(s => s.status === q.status)
                  return (
                    <div key={q.id} className="flex items-center gap-4 px-5 py-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-medium text-[var(--color-text)] truncate">{q.title}</p>
                          {stage && <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: stage.color + '15', color: stage.color }}>{stage.label}</span>}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                          {client && <span>{client.name}</span>}
                          <span>{formatDate(q.created_at)}</span>
                        </div>
                      </div>
                      {q.total_amount != null && <span className="font-semibold text-sm flex-shrink-0 text-[var(--color-text)]">{formatCurrency(q.total_amount)}</span>}
                    </div>
                  )
                })}
              </div>
            }
          </Card>
        )
      }
    </div>
  )
}
