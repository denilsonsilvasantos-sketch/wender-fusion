import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import type { Quotation } from '@/types'
import { Badge, Button, Spinner } from '@/components/ui'

const statusLabel: Record<string, string> = {
  draft: 'Rascunho', sent: 'Aguardando aprovação', approved: 'Aprovada', rejected: 'Recusada', expired: 'Expirada',
}

export function IndustrialQuotationsPage() {
  const { profile } = useAuth()
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)

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
        .from('quotations')
        .select('*, items:quotation_items(*)')
        .eq('client_id', client.id)
        .order('created_at', { ascending: false })

      setQuotations(data ?? [])
      setLoading(false)
    })()
  }, [profile])

  async function respond(id: string, action: 'approved' | 'rejected') {
    setActing(id)
    await supabase.from('quotations').update({ status: action }).eq('id', id)
    setQuotations(prev => prev.map(q => q.id === id ? { ...q, status: action } : q))
    setActing(null)
  }

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Cotações</h1>
        <p className="text-[var(--color-text-muted)] mt-1">Aprove ou recuse orçamentos enviados pela Welder & Fusion</p>
      </div>

      {quotations.length === 0 ? (
        <div className="text-center py-16 text-[var(--color-text-muted)]">Nenhuma cotação encontrada.</div>
      ) : (
        <div className="space-y-4">
          {quotations.map(q => (
            <div key={q.id} className="bg-[var(--color-surface)] rounded-xl border border-white/5 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-semibold">{q.title}</h3>
                  {q.description && <p className="text-[var(--color-text-muted)] text-sm mt-1">{q.description}</p>}
                </div>
                <Badge variant={q.status === 'approved' ? 'success' : q.status === 'rejected' ? 'danger' : q.status === 'sent' ? 'warning' : 'default'}>
                  {statusLabel[q.status]}
                </Badge>
              </div>

              {q.valid_until && (
                <p className="text-xs text-[var(--color-text-muted)] mb-3">
                  Válida até: {new Date(q.valid_until).toLocaleDateString('pt-BR')}
                </p>
              )}

              {(q.items ?? []).length > 0 && (
                <div className="mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-[var(--color-text-muted)] text-xs border-b border-white/5">
                        <th className="text-left py-2">Descrição</th>
                        <th className="text-right py-2">Qtd</th>
                        <th className="text-right py-2">Unit.</th>
                        <th className="text-right py-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {q.items!.map(item => (
                        <tr key={item.id} className="border-b border-white/5 last:border-0">
                          <td className="py-2 text-white">{item.description}</td>
                          <td className="py-2 text-right text-[var(--color-text-muted)]">{item.quantity} {item.unit}</td>
                          <td className="py-2 text-right text-[var(--color-text-muted)]">
                            R$ {Number(item.unit_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-2 text-right text-white font-medium">
                            R$ {Number(item.total_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {q.total_amount != null && (
                <p className="text-right text-[var(--color-primary)] font-bold text-lg">
                  Total: R$ {Number(q.total_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              )}

              {q.status === 'sent' && (
                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/5">
                  <Button variant="outline" onClick={() => respond(q.id, 'rejected')} disabled={acting === q.id}>
                    Recusar
                  </Button>
                  <Button onClick={() => respond(q.id, 'approved')} disabled={acting === q.id}>
                    {acting === q.id ? <Spinner size="sm" /> : 'Aprovar Cotação'}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
