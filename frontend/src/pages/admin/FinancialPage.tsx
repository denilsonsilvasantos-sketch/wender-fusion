import { useEffect, useState } from 'react'
import { DollarSign, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Payment } from '@/types'
import { StatCard, Card, Badge, Spinner } from '@/components/ui'
import { formatCurrency, formatDate, PAYMENT_METHOD_LABELS } from '@/lib/utils'

export function AdminFinancialPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('payments').select('*, student:user_profiles(name)').order('created_at', { ascending: false })
      .then(({ data }) => { setPayments((data || []) as Payment[]); setLoading(false) })
  }, [])

  const received = payments.filter((p) => ['confirmed', 'received'].includes(p.status))
  const pending = payments.filter((p) => p.status === 'pending')
  const overdue = payments.filter((p) => p.status === 'overdue')

  const totalReceived = received.reduce((s, p) => s + p.amount, 0)
  const totalPending = pending.reduce((s, p) => s + p.amount, 0)

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-[var(--color-text)]">Relatório Financeiro</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Recebido" value={formatCurrency(totalReceived)} icon={<DollarSign size={20} />} />
        <StatCard label="A Receber" value={formatCurrency(totalPending)} icon={<TrendingUp size={20} />} />
        <StatCard label="Pagamentos" value={payments.length} icon={<DollarSign size={20} />} />
        <StatCard label="Inadimplentes" value={overdue.length} icon={<TrendingUp size={20} />} />
      </div>

      <Card title="Pagamentos" noPadding>
        {payments.length === 0 ? (
          <p className="text-center py-8 text-[var(--color-text-muted)]">Nenhum pagamento ainda</p>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center gap-4 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text)] truncate">{(p as any).student?.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {p.payment_method ? PAYMENT_METHOD_LABELS[p.payment_method] : '—'} • {formatDate(p.created_at)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[var(--color-primary)]">{formatCurrency(p.amount)}</p>
                  <Badge status={p.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
