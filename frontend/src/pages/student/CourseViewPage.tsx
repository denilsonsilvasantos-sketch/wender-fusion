import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BookOpen, CheckCircle, FileText, ChevronDown, ChevronUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import type { Enrollment, Module, LessonProgress } from '@/types'
import { Card, Spinner, Button } from '@/components/ui'
import toast from 'react-hot-toast'

export function CourseViewPage() {
  const { enrollmentId } = useParams<{ enrollmentId: string }>()
  const { profile } = useAuth()
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [progress, setProgress] = useState<LessonProgress[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!enrollmentId || !profile) return
    async function load() {
      const { data: enr } = await supabase.from('enrollments').select('*, course:courses(id, title, description)').eq('id', enrollmentId!).single()
      if (!enr) return
      setEnrollment(enr as Enrollment)
      const { data: mods } = await supabase.from('modules').select('*, lessons(*)').eq('course_id', (enr as any).course_id).order('order_index')
      const { data: prog } = await supabase.from('lesson_progress').select('*').eq('student_id', profile!.id).eq('course_id', (enr as any).course_id)
      setModules((mods || []) as Module[])
      setProgress((prog || []) as LessonProgress[])
      setLoading(false)
    }
    load()
  }, [enrollmentId, profile])

  async function markComplete(lessonId: string, courseId: string) {
    const { error } = await supabase.from('lesson_progress').upsert({
      student_id: profile!.id, lesson_id: lessonId, course_id: courseId, completed: true, completed_at: new Date().toISOString(),
    })
    if (!error) {
      setProgress((prev) => {
        const existing = prev.find((p) => p.lesson_id === lessonId)
        if (existing) return prev.map((p) => p.lesson_id === lessonId ? { ...p, completed: true } : p)
        return [...prev, { id: '', student_id: profile!.id, lesson_id: lessonId, course_id: courseId, completed: true, completed_at: new Date().toISOString(), created_at: '' }]
      })
      toast.success('Aula concluída!')
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  if (!enrollment) return <div className="text-center py-20 text-[var(--color-text-muted)]">Matrícula não encontrada</div>

  const course = enrollment.course as any
  const totalLessons = modules.reduce((s, m) => s + (m.lessons?.length || 0), 0)
  const completedCount = progress.filter((p) => p.completed).length
  const progressPct = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">{course?.title}</h1>
        <div className="flex items-center gap-3 mt-3">
          <div className="flex-1 h-2 bg-[var(--color-surface-elevated)] rounded-full overflow-hidden">
            <div className="h-full bg-[var(--color-primary)] rounded-full transition-all" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="text-sm font-medium text-[var(--color-primary)] flex-shrink-0">{progressPct}%</span>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">{completedCount} de {totalLessons} aulas concluídas</p>
      </div>

      <div className="space-y-2">
        {modules.sort((a, b) => a.order_index - b.order_index).map((module) => (
          <div key={module.id} className="border border-[var(--color-border)] rounded-xl overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-4 py-3 bg-[var(--color-surface)] hover:bg-[var(--color-surface-elevated)] transition-colors"
              onClick={() => setExpanded(expanded === module.id ? null : module.id)}
            >
              <span className="font-medium text-sm">{module.title}</span>
              <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                <span className="text-xs">{module.lessons?.length || 0} aulas</span>
                {expanded === module.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </button>
            {expanded === module.id && (
              <ul className="border-t border-[var(--color-border)] divide-y divide-[var(--color-border)]">
                {module.lessons?.sort((a, b) => a.order_index - b.order_index).map((lesson) => {
                  const done = progress.find((p) => p.lesson_id === lesson.id)?.completed
                  return (
                    <li key={lesson.id} className="flex items-center gap-3 px-4 py-3 bg-[var(--color-surface-elevated)]">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-green-500/20 text-green-400' : 'border border-[var(--color-border)]'}`}>
                        {done && <CheckCircle size={14} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${done ? 'text-[var(--color-text-muted)] line-through' : 'text-[var(--color-text)]'}`}>{lesson.title}</p>
                        {lesson.duration_minutes && <p className="text-xs text-[var(--color-text-muted)]">{lesson.duration_minutes} min</p>}
                      </div>
                      <div className="flex gap-2">
                        {lesson.pdf_url && (
                          <a href={lesson.pdf_url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-secondary)] transition-colors" title="Material PDF">
                            <FileText size={15} />
                          </a>
                        )}
                        {!done && (
                          <Button size="sm" variant="ghost" onClick={() => markComplete(lesson.id, lesson.course_id)}>
                            <CheckCircle size={14} />
                          </Button>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
