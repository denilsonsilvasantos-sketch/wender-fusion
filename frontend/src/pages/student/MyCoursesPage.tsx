import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ArrowRight, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import type { Enrollment } from '@/types'
import { Card, Badge, Spinner, Button } from '@/components/ui'

export function MyCoursesPage() {
  const { profile } = useAuth()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    supabase
      .from('enrollments')
      .select('*, course:courses(id, title, description, thumbnail_url, duration_hours, level)')
      .eq('student_id', profile.id)
      .order('enrolled_at', { ascending: false })
      .then(({ data }) => { setEnrollments((data || []) as Enrollment[]); setLoading(false) })
  }, [profile])

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-[var(--color-text)]">Meus Cursos</h1>

      {enrollments.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <BookOpen size={48} className="text-[var(--color-text-muted)] mx-auto mb-3" />
            <p className="text-[var(--color-text-secondary)] font-medium">Você ainda não está matriculado</p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1 mb-4">Explore nossos cursos e comece sua jornada</p>
            <Link to="/cursos"><Button>Ver Cursos Disponíveis</Button></Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enrollments.map((e) => {
            const course = e.course as any
            return (
              <Link key={e.id} to={`/aluno/cursos/${e.id}`} className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:border-[var(--color-primary)]/50 transition-all">
                <div className="aspect-video bg-[var(--color-surface-elevated)] flex items-center justify-center">
                  {course?.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen size={40} className="text-[var(--color-text-muted)]" />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge status={e.status} />
                    {course?.duration_hours && (
                      <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                        <Clock size={12} />{course.duration_hours}h
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">{course?.title}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-[var(--color-text-muted)]">Ver aulas</span>
                    <ArrowRight size={16} className="text-[var(--color-primary)]" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
