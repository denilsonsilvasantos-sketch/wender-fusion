import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import type { ServiceOrder, Quotation, ServiceInvoice } from '@/types'
import { Badge, Spinner } from '@/components/ui'

const statusLabel: Record<string, string> = {
  pending: 'Pendente', in_progress: 'Em andamento', completed: 'Concluída', cancelled: 'Cancelada',
}
const statusVariant: Record<string, 'default' | 'warning' | 'success' | 'danger'> = {
  pending: 'warning', in_progress: 'info' as 'default', completed: 'success', cancelled: 'danger',
}

export function IndustrialDashboardPage() {
  const { profile } = useAuth()
  const [orders, setOrders] = useState<ServiceOrder[]>([])
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [invoices, setInvoices] = useState<ServiceInvoice[]>([])
  const [clientId, setClientId] = useState<string | null>(null)
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
      setClientId(client.id)

      const [ordersRes, quotationsRes, invoicesRes] = await Promise.all([
        supabase.from('service_orders').select('*').eq('client_id', client.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('quotations').select('*').eq('client_id', client.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('service_invoices').select('*').eq('client_id', client.id).order('created_at', { ascending: false }).limit(5),
      ])
      setOrders(ordersRes.data ?? [])
      setQuotations(quotationsRes.data ?? [])
      setInvoices(invoicesRes.data ?? [])
      setLoading(false)
    })()
  }, [profile])

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>

  if (!clientId) return (
    <div className="text-center py-16 text-[var(--color-text-muted)]">
      Sua conta ainda não está vinculada a um cliente. Entre em contato com a Welder & Fusion.
    </div>
  )

  const pendingInvoices = invoices.filter(i => i.status === 'pending' || i.status === 'overdue')
  const activeOrders = orders.filter(o => o.status === 'in_progress')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Olá, {profile?.name?.split(' ')[0]}</h1>
        <p className="text-[var(--color-text-muted)] mt-1">Resumo do seu portal industrial</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="O.S. em andamento" value={activeOrders.length} color="blue" />
        <KpiCard label="Cotações pendentes" value={quotations.filter(q => q.status === 'sent').length} color="orange" />
        <KpiCard label="Faturas em aberto" value={pendingInvoices.length} color="red" />
        <KpiCard label="Total de O.S." value={orders.length} color="green" />
      </div>

      {/* Recent orders */}
      <div className="bg-[var(--color-surface)] rounded-xl p-5">
        <h2 className="text-white font-semibold mb-4">Últimas Ordens de Serviço</h2>
        {orders.length === 0 ? (
          <p className="text-[var(--color-text-muted)] text-sm">Nenhuma O.S. encontrada.</p>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-white text-sm font-medium">{order.os_number} — {order.title}</p>
                  <p className="text-[var(--color-text-muted)] text-xs mt-0.5">
                    {new Date(order.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <Badge variant={statusVariant[order.status] ?? 'default'}>
                  {statusLabel[order.status]}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function KpiCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    blue: 'text-blue-400 bg-blue-500/10',
    orange: 'text-[var(--color-primary)] bg-[var(--color-primary)]/10',
    red: 'text-red-400 bg-red-500/10',
    green: 'text-green-400 bg-green-500/10',
  }
  return (
    <div className={`rounded-xl p-4 ${colors[color]}`}>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm mt-1 opacity-80">{label}</p>
    </div>
  )
}
