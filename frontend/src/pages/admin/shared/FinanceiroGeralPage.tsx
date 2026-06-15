import { useEffect, useState } from 'react'
import { DollarSign, TrendingUp, AlertCircle, Clock, GraduationCap, Building2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { ServiceInvoice } from '@/types'
import { Card, Spinner } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'

const COLOR = '#8B5CF6'

interface EscolaPayment { id: string; amount: number; status: string; created_at: string }

export function SharedFinanceiroGeralPage() {
  const [invoices, setInvoices] = useState<ServiceInvoice[]>([])
  const [payments, setPayments] = useState<EscolaPayment[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'todos' | 'escola' | 'industrial'>('todos')

  useEffect(() => {
    Promise.all([
      supabase.from('service_invoices').select('*'),
      supabase.from('payments').select('id,amount,status,created_at'),
    ]).then(([invRes, payRes]) => {
      setInvoices((invRes.data || []) as ServiceInvoice[])
      setPayments((payRes.data || []) as EscolaPayment[])
      setLoading(false)
    })
  }, [])

  // Industrial
  const invReceived = invoices.filter(i => i.status === 'received' || i.status === 'confirmed')
  const invPending  = invoices.filter(i => i.status === 'pending')
  const invOverdue  = invoices.filter(i => i.status === 'overdue')
  const totalInvReceived = invReceived.reduce((s, i) => s + i.amount, 0)
  const totalInvPending  = invPending.reduce((s, i) => s + i.amount, 0)
  const totalInvOverdue  = invOverdue.reduce((s, i) => s + i.amount, 0)

  // Escola
  const payReceived = payments.filter(p => p.status === 'received' || p.status === 'confirmed')
  const payPending  = payments.filter(p => p.status === 'pending')
  const totalPayReceived = payReceived.reduce((s, p) => s + p.amount, 0)
  const totalPayPending  = payPending.reduce((s, p) => s + p.amount, 0)

  // Consolidado
  const totalReceived = totalInvReceived + totalPayReceived
  const totalPending  = totalInvPending + totalPayPending
  const totalOverdue  = totalInvOverdue

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Financeiro Geral</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Consolidado financeiro das unidades Escola e Serviços Industriais</p>
      </div>

      {/* Tab selector */}
      <div className="flex border border-[var(--color-border)] rounded-lg overflow-hidden text-xs w-fit">
        {(['todos', 'escola', 'industrial'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2 font-medium transition-colors"
            style={tab === t ? { background: t === 'escola' ? '#FF8C00' : t === 'industrial' ? '#3B82F6' : COLOR, color: '#fff' }
              : { color: 'var(--color-text-muted)' }}>
            {t === 'todos' ? 'Consolidado' : t === 'escola' ? 'Escola' : 'Industrial'}
          </button>
        ))}
      </div>

      {/* Consolidated KPIs */}
      {tab === 'todos' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Receita recebida', value: formatCurrency(totalReceived), color: '#22c55e', icon: TrendingUp },
            { label: 'A receber',        value: formatCurrency(totalPending),  color: COLOR,      icon: Clock },
            { label: 'Vencido',          value: formatCurrency(totalOverdue),  color: '#ef4444',  icon: AlertCircle },
          ].map(s => (
            <div key={s.label} className="rounded-xl border p-5"
              style={{ borderColor: s.color + '25', background: 'var(--color-surface)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: s.color + '15' }}>
                <s.icon size={16} style={{ color: s.color }} />
              </div>
              <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Escola breakdown */}
      {(tab === 'todos' || tab === 'escola') && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#FF8C00' + '15' }}>
              <GraduationCap size={14} style={{ color: '#FF8C00' }} />
            </div>
            <h2 className="font-bold text-[var(--color-text)]">Escola de Soldagem</h2>
          </div>
          {payments.length === 0 ? (
            <p className="text-xs text-[var(--color-text-muted)] text-center py-6">Nenhum pagamento registrado ainda</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Recebido', value: formatCurrency(totalPayReceived), sub: `${payReceived.length} pagamentos`, color: '#22c55e' },
                { label: 'A receber', value: formatCurrency(totalPayPending), sub: `${payPending.length} pagamentos`, color: '#FF8C00' },
              ].map(s => (
                <div key={s.label} className="rounded-xl p-4"
                  style={{ background: s.color + '08', border: `1px solid ${s.color}25` }}>
                  <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">{s.label}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{s.sub}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Industrial breakdown */}
      {(tab === 'todos' || tab === 'industrial') && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#3B82F6' + '15' }}>
              <Building2 size={14} style={{ color: '#3B82F6' }} />
            </div>
            <h2 className="font-bold text-[var(--color-text)]">Serviços Industriais</h2>
          </div>
          {invoices.length === 0 ? (
            <p className="text-xs text-[var(--color-text-muted)] text-center py-6">Nenhuma fatura registrada ainda</p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Recebido', value: formatCurrency(totalInvReceived), sub: `${invReceived.length} faturas`, color: '#22c55e' },
                { label: 'A receber', value: formatCurrency(totalInvPending), sub: `${invPending.length} faturas`, color: '#3B82F6' },
                { label: 'Vencido', value: formatCurrency(totalInvOverdue), sub: `${invOverdue.length} faturas`, color: '#ef4444' },
              ].map(s => (
                <div key={s.label} className="rounded-xl p-4"
                  style={{ background: s.color + '08', border: `1px solid ${s.color}25` }}>
                  <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">{s.label}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{s.sub}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      <div className="flex items-start gap-3 px-4 py-3 rounded-xl border text-sm"
        style={{ background: COLOR + '08', borderColor: COLOR + '25', color: COLOR }}>
        <DollarSign size={15} className="flex-shrink-0 mt-0.5" />
        <span>Integração com sistema contábil e emissão de NF em desenvolvimento.</span>
      </div>
    </div>
  )
}
