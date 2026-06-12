import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import type { ServiceOrder } from '@/types'
import { Badge, Spinner } from '@/components/ui'

const statusLabel: Record<string, string> = {
  pending: 'Pendente', in_progress: 'Em andamento', completed: 'Concluída', cancelled: 'Cancelada',
}
const priorityLabel: Record<string, string> = {
  low: 'Baixa', normal: 'Normal', high: 'Alta', urgent: 'Urgente',
}

export function IndustrialServiceOrdersPage() {
  const { profile } = useAuth()
  const [orders, setOrders] = useState<ServiceOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

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
        .from('service_orders')
        .select('*')
        .eq('client_id', client.id)
        .order('created_at', { ascending: false })

      setOrders(data ?? [])
      setLoading(false)
    })()
  }, [profile])

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Ordens de Serviço</h1>
        <p className="text-[var(--color-text-muted)] mt-1">Acompanhe o status das suas O.S.</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 text-[var(--color-text-muted)]">
          Nenhuma ordem de serviço encontrada.
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div key={order.id} className="bg-[var(--color-surface)] rounded-xl border border-white/5">
              <button
                className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div>
                  <p className="text-white font-semibold">{order.os_number}</p>
                  <p className="text-[var(--color-text-muted)] text-sm mt-0.5">{order.title}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={order.status === 'completed' ? 'success' : order.status === 'in_progress' ? 'default' : 'warning'}>
                    {statusLabel[order.status]}
                  </Badge>
                  <svg className={`w-4 h-4 text-[var(--color-text-muted)] transition-transform ${expanded === order.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {expanded === order.id && (
                <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-3">
                  {order.description && (
                    <p className="text-[var(--color-text-muted)] text-sm">{order.description}</p>
                  )}
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    <InfoRow label="Prioridade" value={priorityLabel[order.priority]} />
                    <InfoRow label="Criada em" value={new Date(order.created_at).toLocaleDateString('pt-BR')} />
                    {order.started_at && <InfoRow label="Iniciada em" value={new Date(order.started_at).toLocaleDateString('pt-BR')} />}
                    {order.completed_at && <InfoRow label="Concluída em" value={new Date(order.completed_at).toLocaleDateString('pt-BR')} />}
                    {order.total_cost != null && order.total_cost > 0 && (
                      <InfoRow label="Valor total" value={`R$ ${Number(order.total_cost).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                    )}
                  </div>
                  {order.notes && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-xs text-[var(--color-text-muted)] mb-1">Observações</p>
                      <p className="text-sm text-white">{order.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[var(--color-text-muted)]">{label}: </span>
      <span className="text-white">{value}</span>
    </div>
  )
}
