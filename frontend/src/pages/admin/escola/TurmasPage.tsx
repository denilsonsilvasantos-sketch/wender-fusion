import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Users, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Course } from '@/types'
import { Badge, Select, Spinner } from '@/components/ui'
import { LEVEL_LABELS } from '@/lib/utils'

const COLOR = '#FF8C00'

type CourseWithCount = Course & { enrolled_count: number }

export function EscolaTurmasPage() {
  const [courses, setCourses] = useState<CourseWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('published')

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('courses')
        .select('*, enrollments(count)')
        .order('created_at', { ascending: false })

      const parsed = (data || []).map((c: any) => ({
        ...c,
        enrolled_count: c.enrollments?.[0]?.count ?? 0,
      }))
      setCourses(parsed as CourseWithCount[])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = courses.filter((c) => !filterStatus || c.status === filterStatus)

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Turmas</h1>
          <p className="text-sm text-[var(--color-text-muted)]">{filtered.length} turmas encontradas</p>
        </div>
        <Link
          to="/admin/escola/cursos"
          className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          Gerenciar cursos →
        </Link>
      </div>

      <Select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        placeholder="Todos"
        options={[
          { value: 'published', label: 'Publicados' },
          { value: 'draft', label: 'Rascunhos' },
          { value: 'archived', label: 'Arquivados' },
        ]}
        className="w-48"
      />

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-[var(--color-text-muted)]">
          <BookOpen size={36} className="mx-auto mb-3 opacity-30" />
          <p>Nenhuma turma encontrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((course) => (
            <div
              key={course.id}
              className="rounded-xl border p-5 bg-[var(--color-surface)] transition-colors hover:border-[var(--color-primary)]/30"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: COLOR + '15' }}
                >
                  <BookOpen size={18} style={{ color: COLOR }} />
                </div>
                <Badge status={course.status} />
              </div>

              <p className="text-sm font-semibold text-[var(--color-text)] mb-1 line-clamp-2">
                {course.title}
              </p>
              {course.level && (
                <p className="text-xs text-[var(--color-text-muted)] mb-3">
                  {LEVEL_LABELS[course.level] || course.level}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                <div className="flex items-center gap-1">
                  <Users size={12} />
                  <span>{course.enrolled_count} alunos</span>
                </div>
                {course.duration_hours && (
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{course.duration_hours}h</span>
                  </div>
                )}
              </div>

              {course.max_students && course.max_students > 0 && (
                <div className="mt-3">
                  <div className="h-1.5 rounded-full overflow-hidden bg-[var(--color-surface-elevated)]">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (course.enrolled_count / course.max_students) * 100)}%`,
                        background: COLOR,
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-1">
                    {course.enrolled_count}/{course.max_students} vagas
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
