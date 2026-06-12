import { useEffect, useState } from 'react'
import { CreditCard, ExternalLink, Copy } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import type { Payment } from '@/types'
import { Card, Badge, Spinner } from '@/components/ui'
import { formatCurrency, formatDate, PAYMENT_METHOD_LABELS } from '@/lib/utils'
import toast from 'react-hot-toast'

export function PaymentsPage() {
  const { profile } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    supabase
      .from('payments')
      .select('*')
      .eq('student_id', profile.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setPayments((data || []) as Payment[]); setLoading(false) })
  }, [profile])

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)] flex items-center gap-2">
          <CreditCard size={28} className="text-[var(--color-primary)]" />
          Meus Pagamentos
        </h1>
      </div>

      {payments.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <CreditCard size={48} className="text-[var(--color-text-muted)] mx-auto mb-3" />
            <p className="text-[var(--color-text-secondary)]">Nenhum pagamento encontrado</p>
          </div>
        </Card>
      ) : (
        <Card noPadding>
          <div className="divide-y divide-[var(--color-border)]">
            {payments.map((payment) => (
              <div key={payment.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-[var(--color-text)]">{payment.description || 'Pagamento'}</p>
                    <Badge status={payment.status} />
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-[var(--color-text-muted)]">
                    {payment.payment_method && <span>{PAYMENT_METHOD_LABELS[payment.payment_method]}</span>}
                    {payment.due_date && <span>Vencimento: {formatDate(payment.due_date)}</span>}
                    {payment.paid_at && <span>Pago em: {formatDate(payment.paid_at)}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-[var(--color-primary)]">{formatCurrency(payment.amount)}</span>
                  <div className="flex gap-1.5">
                    {payment.pix_code && (
                      <button
                        onClick={() => { navigator.clipboard.writeText(payment.pix_code!); toast.success('Pix copiado!') }}
                        className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-elevated)] rounded transition-colors"
                        title="Copiar código Pix"
                      >
                        <Copy size={14} />
                      </button>
                    )}
                    {payment.bank_slip_url && (
                      <a href={payment.bank_slip_url} target="_blank" rel="noopener noreferrer"
                        className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-elevated)] rounded transition-colors"
                        title="Ver boleto"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
