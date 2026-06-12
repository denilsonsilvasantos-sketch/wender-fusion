import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Clock, Users, Award, ChevronDown, ChevronUp, ArrowRight, BookOpen } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Course } from '@/types'
import { Button, Badge, Spinner } from '@/components/ui'
import { formatCurrency, LEVEL_LABELS } from '@/lib/utils'
import { getThumbnailUrl } from '@/lib/cloudinary'

export function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedModule, setExpandedModule] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    async function load() {
      const { data } = await supabase
        .from('courses')
        .select(`*, instructor:user_profiles(id, name, avatar_url), modules(*, lessons(id, title, duration_minutes, is_free_preview, order_index))`)
        .eq('id', id)
        .eq('status', 'published')
        .single()
      setCourse(data as Course)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div className="flex justify-center py-32"><Spinner size="lg" /></div>
  if (!course) return <div className="text-center py-32 text-[var(--color-text-muted)]">Curso não encontrado.</div>

  const totalLessons = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2">
          {course.thumbnail_url && (
            <div className="rounded-xl overflow-hidden mb-6 aspect-video bg-[var(--color-surface-elevated)]">
              <img src={getThumbnailUrl(course.thumbnail_url)} alt={course.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 mb-3">
            {course.level && <Badge>{LEVEL_LABELS[course.level]}</Badge>}
          </div>

          <h1 className="text-3xl font-black text-[var(--color-text)] mb-4">{course.title}</h1>

          {course.full_description && (
            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">{course.full_description}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-[var(--color-text-muted)] mb-8 pb-8 border-b border-[var(--color-border)]">
            {course.duration_hours && <span className="flex items-center gap-1.5"><Clock size={16} className="text-[var(--color-primary)]" />{course.duration_hours} horas</span>}
            <span className="flex items-center gap-1.5"><BookOpen size={16} className="text-[var(--color-primary)]" />{totalLessons} aulas</span>
            <span className="flex items-center gap-1.5"><Award size={16} className="text-[var(--color-primary)]" />Certificado incluso</span>
          </div>

          {/* Curriculum */}
          {course.modules && course.modules.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-[var(--color-text)] mb-4">Conteúdo do Curso</h2>
              <div className="space-y-2">
                {course.modules.sort((a, b) => a.order_index - b.order_index).map((module) => (
                  <div key={module.id} className="border border-[var(--color-border)] rounded-lg overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between px-4 py-3 bg-[var(--color-surface)] hover:bg-[var(--color-surface-elevated)] transition-colors text-left"
                      onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                    >
                      <span className="font-medium text-sm text-[var(--color-text)]">{module.title}</span>
                      <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                        <span className="text-xs">{module.lessons?.length || 0} aulas</span>
                        {expandedModule === module.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>
                    {expandedModule === module.id && (
                      <ul className="border-t border-[var(--color-border)]">
                        {module.lessons?.sort((a, b) => a.order_index - b.order_index).map((lesson) => (
                          <li key={lesson.id} className="flex items-center justify-between px-4 py-2.5 text-sm text-[var(--color-text-secondary)] border-b border-[var(--color-border)] last:border-0 bg-[var(--color-surface-elevated)]">
                            <span>{lesson.title}</span>
                            {lesson.duration_minutes && <span className="text-xs text-[var(--color-text-muted)]">{lesson.duration_minutes}min</span>}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
            <div className="text-3xl font-black text-[var(--color-primary)] mb-1">
              {course.price === 0 ? 'Gratuito' : formatCurrency(course.price)}
            </div>
            {course.price > 0 && <p className="text-xs text-[var(--color-text-muted)] mb-4">ou em parcelas via cartão</p>}

            <Link to={`/checkout/${course.id}`} className="block">
              <Button className="w-full mb-3" size="lg" rightIcon={<ArrowRight size={16} />}>
                Matricular-se
              </Button>
            </Link>
            <Link to="/login" className="block">
              <Button variant="outline" className="w-full" size="lg">
                Já tenho conta
              </Button>
            </Link>

            <div className="mt-5 pt-5 border-t border-[var(--color-border)] space-y-2 text-sm text-[var(--color-text-secondary)]">
              <p className="flex items-center gap-2"><Award size={14} className="text-[var(--color-primary)]" />Certificado ao concluir</p>
              <p className="flex items-center gap-2"><Clock size={14} className="text-[var(--color-primary)]" />Acesso ao material do curso</p>
              <p className="flex items-center gap-2"><Users size={14} className="text-[var(--color-primary)]" />Turmas reduzidas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
