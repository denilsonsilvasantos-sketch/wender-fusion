import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import type { ServiceInvoice } from '@/types'
import { Badge, Spinner } from '@/components/ui'

const statusLabel: Record<string, string> = {
  pending: 'Aguardando pagamento',
  confirmed: 'Confirmado',
  received: 'Recebido',
  overdue: 'Vencido',
  cancelled: 'Cancelado',
}
const methodLabel: Record<string, string> = {
  boleto: 'Boleto', pix: 'Pix', credit_card: 'Cartão',
}

export function IndustrialFinancialPage() {
  const { profile } = useAuth()
  const [invoices, setInvoices] = useState<ServiceInvoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    ;(async () => {
      const { data: client } = await supabase
        .from('service_clients')
        .select('id')
        .eq('user_id', profile.id)
        .maybeSingle()

      if (!client) { setLoading(false); return }

      const { data } = await supabase
        .from('service_invoices')
        .select('*')
        .eq('client_id', client.id)
        .order('created_at', { ascending: false })

      setInvoices(data ?? [])
      setLoading(false)
    })()
  }, [profile])

  const totalPaid = invoices
    .filter(i => i.status === 'confirmed' || i.status === 'received')
    .reduce((sum, i) => sum + Number(i.amount), 0)
  const totalPending = invoices
    .filter(i => i.status === 'pending' || i.status === 'overdue')
    .reduce((sum, i) => sum + Number(i.amount), 0)

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Financeiro</h1>
        <p className="text-[var(--color-text-muted)] mt-1">Faturas e histórico de pagamentos</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-500/10 rounded-xl p-4">
          <p className="text-green-400 text-2xl font-bold">
            R$ {totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-green-400/70 text-sm mt-1">Total pago</p>
        </div>
        <div className="bg-yellow-500/10 rounded-xl p-4">
          <p className="text-yellow-400 text-2xl font-bold">
            R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-yellow-400/70 text-sm mt-1">Em aberto</p>
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className="text-center py-16 text-[var(--color-text-muted)]">Nenhuma fatura encontrada.</div>
      ) : (
        <div className="bg-[var(--color-surface)] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-white/5">
              <tr className="text-[var(--color-text-muted)] text-xs">
                <th className="text-left px-5 py-3">Descrição</th>
                <th className="text-left px-5 py-3">Vencimento</th>
                <th className="text-left px-5 py-3">Método</th>
                <th className="text-right px-5 py-3">Valor</th>
                <th className="text-right px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3 text-white">
                    Fatura #{inv.id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-5 py-3 text-[var(--color-text-muted)]">
                    {inv.due_date ? new Date(inv.due_date).toLocaleDateString('pt-BR') : '—'}
                  </td>
                  <td className="px-5 py-3 text-[var(--color-text-muted)]">
                    {inv.payment_method ? methodLabel[inv.payment_method] : '—'}
                  </td>
                  <td className="px-5 py-3 text-right text-white font-medium">
                    R$ {Number(inv.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Badge variant={
                      inv.status === 'confirmed' || inv.status === 'received' ? 'success' :
                      inv.status === 'overdue' ? 'danger' :
                      inv.status === 'pending' ? 'warning' : 'default'
                    }>
                      {statusLabel[inv.status]}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
