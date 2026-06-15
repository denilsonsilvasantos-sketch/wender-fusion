import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, DollarSign, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { ServiceInvoice, PaymentStatus } from '@/types'
import { Card, Badge, Select, Input, Spinner } from '@/components/ui'
import { formatDate, formatCurrency } from '@/lib/utils'

const COLOR = '#3B82F6'

const STATUS_OPTIONS = [
  { value: 'pending',   label: 'Pendente' },
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'received',  label: 'Recebido' },
  { value: 'overdue',   label: 'Vencido' },
]

const STATUS_META: Record<string, { label: string; icon: React.ElementType; color: string; variant: 'default' | 'success' | 'warning' | 'danger' }> = {
  pending:   { label: 'Pendente',    icon: Clock,        color: '#f59e0b', variant: 'warning' },
  confirmed: { label: 'Confirmado',  icon: CheckCircle2, color: '#3B82F6', variant: 'default' },
  received:  { label: 'Recebido',    icon: CheckCircle2, color: '#22c55e', variant: 'success' },
  overdue:   { label: 'Vencido',     icon: AlertCircle,  color: '#ef4444', variant: 'danger'  },
  refunded:  { label: 'Estornado',   icon: AlertCircle,  color: '#6B7280', variant: 'default' },
  cancelled: { label: 'Cancelado',   icon: AlertCircle,  color: '#6B7280', variant: 'default' },
}

export function IndustrialFinanceiroPage() {
  const [invoices, setInvoices] = useState<ServiceInvoice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const filterStatus = searchParams.get('status') ?? ''

  function updateParam(k: string, v: string) {
    setSearchParams(prev => { const n = new URLSearchParams(prev); v ? n.set(k, v) : n.delete(k); return n }, { replace: true })
  }

  useEffect(() => {
    supabase
      .from('service_invoices')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setInvoices((data || []) as ServiceInvoice[])
        setLoading(false)
      })
  }, [])

  const filtered = invoices.filter(inv => !filterStatus || inv.status === filterStatus)

  const paid    = invoices.filter(i => i.status === 'received' || i.status === 'confirmed')
  const pending = invoices.filter(i => i.status === 'pending')
  const overdue = invoices.filter(i => i.status === 'overdue')
  const totalPaid    = paid.reduce((s, i) => s + i.amount, 0)
  const totalPending = pending.reduce((s, i) => s + i.amount, 0)
  const totalOverdue = overdue.reduce((s, i) => s + i.amount, 0)

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Financeiro Industrial</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Faturas e cobranças de serviços prestados</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Recebido',  value: formatCurrency(totalPaid),    sub: `${paid.length} faturas`,    color: '#22c55e' },
          { label: 'A receber', value: formatCurrency(totalPending),  sub: `${pending.length} faturas`, color: COLOR },
          { label: 'Vencido',   value: formatCurrency(totalOverdue),  sub: `${overdue.length} faturas`, color: '#ef4444' },
        ].map(s => (
          <div key={s.label} className="rounded-xl border p-4" style={{ borderColor: s.color + '25', background: 'var(--color-surface)' }}>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{s.label}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{s.sub}</p>
          </div>
        ))}
      </div>

      <Select
        value={filterStatus}
        onChange={e => updateParam('status', e.target.value)}
        placeholder="Todos os status"
        options={STATUS_OPTIONS}
        className="sm:w-48"
      />

      <Card noPadding>
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-[var(--color-text-muted)]">
            <DollarSign size={36} className="mx-auto mb-3 opacity-30" />
            <p>{invoices.length === 0 ? 'Nenhuma fatura registrada ainda' : 'Nenhuma fatura encontrada'}</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {filtered.map(inv => {
              const meta = STATUS_META[inv.status] ?? STATUS_META.pending
              const Icon = meta.icon
              return (
                <div key={inv.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: meta.color + '15' }}>
                    <Icon size={15} style={{ color: meta.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-[var(--color-text)] truncate">
                        Fatura #{inv.id.slice(0, 8).toUpperCase()}
                      </p>
                      <Badge variant={meta.variant}>{meta.label}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)] flex-wrap">
                      {inv.due_date && <span>Venc. {formatDate(inv.due_date)}</span>}
                      {inv.paid_at  && <span>Pago em {formatDate(inv.paid_at)}</span>}
                      <span>{formatDate(inv.created_at)}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-sm text-[var(--color-text)]">{formatCurrency(inv.amount)}</p>
                    {inv.invoice_url && (
                      <a href={inv.invoice_url} target="_blank" rel="noopener noreferrer"
                        className="text-[11px] mt-0.5 block hover:underline" style={{ color: COLOR }}>
                        Ver fatura
                      </a>
                    )}
                    {inv.bank_slip_url && (
                      <a href={inv.bank_slip_url} target="_blank" rel="noopener noreferrer"
                        className="text-[11px] mt-0.5 block hover:underline" style={{ color: COLOR }}>
                        Boleto
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
