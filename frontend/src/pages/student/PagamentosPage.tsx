import { useEffect, useState } from 'react'
import { CreditCard, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Card, Spinner } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'

const COLOR = '#64748B'

interface Payment {
  id: string; amount: number; status: string; due_date: string; paid_at?: string
  description?: string
}

const MOCK: Payment[] = [
  { id: '1', amount: 450,  status: 'paid',    due_date: '2026-05-10', paid_at: '2026-05-08', description: 'Mensalidade Maio/2026' },
  { id: '2', amount: 450,  status: 'paid',    due_date: '2026-04-10', paid_at: '2026-04-09', description: 'Mensalidade Abril/2026' },
  { id: '3', amount: 450,  status: 'pending', due_date: '2026-06-10', description: 'Mensalidade Junho/2026' },
  { id: '4', amount: 1800, status: 'paid',    due_date: '2026-03-05', paid_at: '2026-03-05', description: 'Matrícula — TIG Avançado' },
]

const STATUS_CFG = {
  paid:    { label: 'Pago',     icon: CheckCircle,   color: '#10B981' },
  pending: { label: 'Pendente', icon: Clock,         color: '#F59E0B' },
  overdue: { label: 'Atrasado', icon: AlertTriangle, color: '#EF4444' },
}

export function PagamentosPage() {
  const { profile } = useAuth()
  const [list,    setList]    = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    supabase.from('payments')
      .select('id, amount, status, due_date, paid_at, description')
      .eq('student_id', profile.id)
      .order('due_date', { ascending: false })
      .then(({ data }) => {
        setList((data as Payment[])?.length ? (data as Payment[]) : MOCK)
        setLoading(false)
      })
  }, [profile])

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  const totalPago   = list.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const totalPendente = list.filter(p => p.status !== 'paid').reduce((s, p) => s + p.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Financeiro</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Histórico de pagamentos e mensalidades</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Total pago',     value: formatCurrency(totalPago),     color: '#10B981' },
          { label: 'Pendente',       value: formatCurrency(totalPendente), color: totalPendente > 0 ? '#F59E0B' : '#64748B' },
        ].map(s => (
          <Card key={s.label}>
            <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      {totalPendente > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl"
          style={{ background: '#F59E0B' + '10', border: '1px solid #F59E0B30' }}>
          <AlertTriangle size={17} style={{ color: '#F59E0B' }} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold" style={{ color: '#F59E0B' }}>Você tem pagamentos pendentes</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              Efetue o pagamento até o vencimento para evitar restrições de acesso.
            </p>
          </div>
        </div>
      )}

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <CreditCard size={16} style={{ color: COLOR }} />
          <h2 className="font-semibold text-[var(--color-text)]">Histórico de pagamentos</h2>
        </div>
        <div className="space-y-3">
          {list.map(p => {
            const cfg  = STATUS_CFG[p.status as keyof typeof STATUS_CFG] ?? STATUS_CFG.pending
            const Icon = cfg.icon
            return (
              <div key={p.id} className="flex items-center gap-3 py-2.5 border-b last:border-0"
                style={{ borderColor: 'var(--color-border)' }}>
                <Icon size={17} style={{ color: cfg.color }} className="flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text)]">{p.description ?? 'Pagamento'}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    Vencimento: {new Date(p.due_date).toLocaleDateString('pt-BR')}
                    {p.paid_at && ` · Pago em ${new Date(p.paid_at).toLocaleDateString('pt-BR')}`}
                  </p>
                </div>
                <span className="text-sm font-bold text-right flex-shrink-0" style={{ color: cfg.color }}>
                  {formatCurrency(p.amount)}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: cfg.color + '15', color: cfg.color }}>{cfg.label}</span>
                {p.status !== 'paid' && (
                  <button className="text-xs font-semibold px-3 py-1 rounded-lg flex-shrink-0"
                    style={{ background: '#10B981', color: '#fff' }}>Pagar</button>
                )}
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
