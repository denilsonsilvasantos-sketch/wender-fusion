import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, CheckCircle, ArrowRight, AlertTriangle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Card, Spinner } from '@/components/ui'

const COLOR = '#6366F1'

interface Enrollment {
  id: string; status: string; progress_pct: number; enrolled_at: string; completed_at?: string
  course: { id: string; title: string; duration_hours: number; thumbnail_url?: string }
}

export function MeusCursosPage() {
  const { profile } = useAuth()
  const [list, setList]     = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    supabase.from('enrollments')
      .select('id, status, progress_pct, enrolled_at, completed_at, course:courses(id,title,duration_hours,thumbnail_url)')
      .eq('student_id', profile.id)
      .order('enrolled_at', { ascending: false })
      .then(({ data }) => { setList((data as unknown as Enrollment[]) ?? []); setLoading(false) })
  }, [profile])

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  const ativos    = list.filter(e => e.status === 'active')
  const concluidos = list.filter(e => e.status === 'completed')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Meus Cursos</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Acompanhe o progresso de cada curso matriculado</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Em andamento', value: ativos.length,     color: COLOR      },
          { label: 'Concluídos',   value: concluidos.length, color: '#10B981'  },
          { label: 'Total',        value: list.length,        color: '#64748B'  },
        ].map(s => (
          <Card key={s.label}>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      {list.length === 0 ? (
        <Card>
          <div className="text-center py-10">
            <BookOpen size={36} className="mx-auto mb-3 text-[var(--color-text-muted)]" />
            <p className="font-semibold text-[var(--color-text)]">Nenhum curso matriculado ainda</p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">Confira os cursos disponíveis e faça sua matrícula.</p>
            <Link to="/cursos" className="inline-flex items-center gap-1 mt-4 text-sm font-semibold"
              style={{ color: COLOR }}>Ver cursos <ArrowRight size={14} /></Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {list.map(e => {
            const completed = e.status === 'completed'
            const pct = e.progress_pct ?? 0
            const atRisk = !completed && pct < 30
            return (
              <Card key={e.id}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: (completed ? '#10B981' : COLOR) + '15' }}>
                    {completed
                      ? <CheckCircle size={22} style={{ color: '#10B981' }} />
                      : <BookOpen    size={22} style={{ color: COLOR }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-[var(--color-text)]">{e.course?.title}</h3>
                      {atRisk && (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500">
                          <AlertTriangle size={11} />Atenção
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] mb-3">
                      {e.course?.duration_hours}h · Matriculado em {new Date(e.enrolled_at).toLocaleDateString('pt-BR')}
                      {completed && e.completed_at && ` · Concluído em ${new Date(e.completed_at).toLocaleDateString('pt-BR')}`}
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-[var(--color-text-muted)]">Progresso</span>
                        <span style={{ color: completed ? '#10B981' : COLOR }}>{pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[var(--color-surface-elevated)]">
                        <div className="h-full rounded-full"
                          style={{ width: `${pct}%`, background: completed ? '#10B981' : COLOR }} />
                      </div>
                    </div>
                  </div>
                  <Link to={`/aluno/cursos/${e.id}`}
                    className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    style={{ background: COLOR + '15', color: COLOR }}>
                    {completed ? 'Ver' : 'Continuar'} <ArrowRight size={13} />
                  </Link>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
