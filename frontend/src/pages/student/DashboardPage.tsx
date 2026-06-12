import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Award, Trophy, Clock, ArrowRight, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { StatCard, Card, Badge, Spinner } from '@/components/ui'
import type { Enrollment, Certificate, Payment } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'

export function StudentDashboardPage() {
  const { profile } = useAuth()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [pendingPayments, setPendingPayments] = useState<Payment[]>([])
  const [points, setPoints] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    async function load() {
      const [{ data: enr }, { data: certs }, { data: pays }, { data: pts }] = await Promise.all([
        supabase.from('enrollments').select('*, course:courses(id, title, thumbnail_url, duration_hours)').eq('student_id', profile!.id).order('enrolled_at', { ascending: false }).limit(5),
        supabase.from('certificates').select('*, course:courses(title)').eq('student_id', profile!.id).eq('revoked', false),
        supabase.from('payments').select('*').eq('student_id', profile!.id).in('status', ['pending', 'overdue']),
        supabase.rpc('get_student_points', { p_student_id: profile!.id }),
      ])
      setEnrollments((enr || []) as Enrollment[])
      setCertificates((certs || []) as Certificate[])
      setPendingPayments((pays || []) as Payment[])
      setPoints(pts || 0)
      setLoading(false)
    }
    load()
  }, [profile])

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">
          Olá, {profile?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-[var(--color-text-muted)] text-sm">Continue de onde parou</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Cursos" value={enrollments.filter(e => e.status === 'active').length} icon={<BookOpen size={20} />} />
        <StatCard label="Certificados" value={certificates.length} icon={<Award size={20} />} />
        <StatCard label="Pontos" value={points.toLocaleString()} icon={<Trophy size={20} />} />
        <StatCard label="Pagamentos Pendentes" value={pendingPayments.length} icon={<Clock size={20} />} />
      </div>

      {/* Active courses */}
      <Card title="Meus Cursos" action={
        <Link to="/aluno/cursos" className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1">
          Ver todos <ArrowRight size={12} />
        </Link>
      }>
        {enrollments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[var(--color-text-muted)] text-sm mb-3">Você ainda não está matriculado em nenhum curso.</p>
            <Link to="/cursos" className="text-[var(--color-primary)] text-sm hover:underline">Ver cursos disponíveis →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {enrollments.map((e) => (
              <Link
                key={e.id}
                to={`/aluno/cursos/${e.id}`}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-[var(--color-surface-elevated)] transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-[var(--color-surface-elevated)] flex items-center justify-center text-[var(--color-primary)] flex-shrink-0">
                  <BookOpen size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text)] truncate">{(e.course as any)?.title}</p>
                  <Badge status={e.status} className="mt-0.5" />
                </div>
                <ArrowRight size={16} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
              </Link>
            ))}
          </div>
        )}
      </Card>

      {/* Pending payments alert */}
      {pendingPayments.length > 0 && (
        <Card className="border-[var(--color-warning)]/50 bg-amber-500/5">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Clock size={16} className="text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--color-text)]">
                {pendingPayments.length} pagamento{pendingPayments.length > 1 ? 's' : ''} pendente{pendingPayments.length > 1 ? 's' : ''}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                Total: {formatCurrency(pendingPayments.reduce((s, p) => s + p.amount, 0))}
              </p>
            </div>
            <Link to="/aluno/pagamentos" className="text-xs text-[var(--color-primary)] hover:underline">Ver →</Link>
          </div>
        </Card>
      )}

      {/* Certificates */}
      {certificates.length > 0 && (
        <Card title="Últimos Certificados" action={
          <Link to="/aluno/certificados" className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1">
            Ver todos <ArrowRight size={12} />
          </Link>
        }>
          <div className="space-y-3">
            {certificates.slice(0, 3).map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-surface-elevated)]">
                <Award size={20} className="text-[var(--color-primary)] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text)] truncate">{(c.course as any)?.title}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">Emitido em {formatDate(c.issued_at)}</p>
                </div>
                <TrendingUp size={14} className="text-green-400" />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
