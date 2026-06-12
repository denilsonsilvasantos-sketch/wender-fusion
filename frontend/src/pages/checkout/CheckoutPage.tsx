import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Shield, ArrowLeft, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import type { Course } from '@/types'
import { Button, Spinner, Card } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'
import api from '@/lib/api'

const PAYMENT_METHODS = [
  { id: 'pix', label: 'Pix', desc: 'Aprovação imediata' },
  { id: 'boleto', label: 'Boleto', desc: 'Prazo de 3 dias úteis' },
  { id: 'credit_card', label: 'Cartão de Crédito', desc: 'Parcele em até 12x' },
]

export function CheckoutPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [course, setCourse] = useState<Course | null>(null)
  const [method, setMethod] = useState('pix')
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [installments, setInstallments] = useState(1)

  useEffect(() => {
    if (!courseId) return
    supabase.from('courses').select('*').eq('id', courseId).single()
      .then(({ data }) => { setCourse(data as Course); setLoading(false) })
  }, [courseId])

  if (!user) { navigate('/login'); return null }

  async function handlePayment() {
    if (!course || !profile) return
    setPaying(true)
    try {
      const { data } = await api.post('/payments/create', {
        courseId: course.id,
        paymentMethod: method,
        installments: method === 'credit_card' ? installments : 1,
      })
      toast.success('Cobrança gerada com sucesso!')
      if (data.bankSlipUrl) window.open(data.bankSlipUrl, '_blank')
      navigate('/aluno/pagamentos')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erro ao gerar cobrança')
    } finally {
      setPaying(false)
    }
  }

  if (loading) return <div className="flex justify-center py-32"><Spinner size="lg" /></div>
  if (!course) return <div className="text-center py-32 text-[var(--color-text-muted)]">Curso não encontrado</div>

  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-4">
      <div className="max-w-xl mx-auto py-8">
        <Link to={`/cursos/${course.id}`} className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-6">
          <ArrowLeft size={16} />Voltar
        </Link>

        <h1 className="text-2xl font-black text-[var(--color-text)] mb-2">Finalizar Matrícula</h1>
        <p className="text-sm text-[var(--color-text-muted)] mb-6">Você está se matriculando em:</p>

        <Card className="mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[var(--color-surface-elevated)] rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🔥</div>
            <div>
              <p className="font-semibold text-[var(--color-text)]">{course.title}</p>
              {course.duration_hours && <p className="text-xs text-[var(--color-text-muted)]">{course.duration_hours}h de conteúdo</p>}
              <p className="text-lg font-black text-[var(--color-primary)] mt-1">{formatCurrency(course.price)}</p>
            </div>
          </div>
        </Card>

        <Card title="Forma de Pagamento" className="mb-6">
          <div className="space-y-2">
            {PAYMENT_METHODS.map(({ id, label, desc }) => (
              <button
                key={id}
                onClick={() => setMethod(id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${method === id ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]' : 'border-[var(--color-border)] hover:border-[var(--color-border-light)]'}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${method === id ? 'border-[var(--color-primary)]' : 'border-[var(--color-border)]'}`}>
                  {method === id && <div className="w-2.5 h-2.5 bg-[var(--color-primary)] rounded-full" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">{label}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{desc}</p>
                </div>
                {method === id && <Check size={16} className="ml-auto text-[var(--color-primary)]" />}
              </button>
            ))}
          </div>

          {method === 'credit_card' && (
            <div className="mt-4">
              <label className="text-xs text-[var(--color-text-secondary)] block mb-2">Parcelas</label>
              <select
                value={installments}
                onChange={(e) => setInstallments(Number(e.target.value))}
                className="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}x de {formatCurrency(course.price / n)}{n === 1 ? ' (à vista)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </Card>

        <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-4">
          <Shield size={14} className="text-green-400" />
          Pagamento seguro processado pela Asaas
        </div>

        <Button onClick={handlePayment} loading={paying} className="w-full" size="lg">
          Confirmar Pagamento • {formatCurrency(course.price)}
        </Button>
      </div>
    </div>
  )
}
