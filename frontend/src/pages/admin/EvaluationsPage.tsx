import { useEffect, useState } from 'react'
import { Plus, ClipboardList } from 'lucide-react'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import type { Course, Evaluation, EvaluationMetric } from '@/types'
import { Button, Card, Modal, Input, Select, Spinner } from '@/components/ui'
import { formatDate } from '@/lib/utils'

const evalSchema = z.object({
  student_id: z.string().min(1),
  course_id: z.string().min(1),
  metric_id: z.string().min(1),
  score: z.number().min(0),
  feedback: z.string().optional(),
})
type EvalForm = z.infer<typeof evalSchema>

export function AdminEvaluationsPage() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [students, setStudents] = useState<{ id: string; name: string }[]>([])
  const [metrics, setMetrics] = useState<EvaluationMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<EvalForm>({ resolver: zodResolver(evalSchema) })
  const selectedCourse = watch('course_id')

  async function load() {
    const [{ data: evs }, { data: crs }, { data: studs }] = await Promise.all([
      supabase.from('evaluations').select('*, student:user_profiles(name), course:courses(title), metric:evaluation_metrics(name, max_score, type)').order('evaluated_at', { ascending: false }),
      supabase.from('courses').select('id, title').eq('status', 'published'),
      supabase.from('user_profiles').select('id, name').eq('role', 'student'),
    ])
    setEvaluations((evs || []) as Evaluation[])
    setCourses((crs || []) as Course[])
    setStudents(studs || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    if (!selectedCourse) return
    supabase.from('evaluation_metrics').select('*').eq('course_id', selectedCourse)
      .then(({ data }) => setMetrics((data || []) as EvaluationMetric[]))
  }, [selectedCourse])

  async function onSubmit(data: EvalForm) {
    setSaving(true)
    try {
      const { data: enrollment } = await supabase.from('enrollments').select('id').eq('student_id', data.student_id).eq('course_id', data.course_id).single()
      if (!enrollment) { toast.error('Aluno não está matriculado neste curso'); setSaving(false); return }
      await supabase.from('evaluations').upsert({ ...data, enrollment_id: enrollment.id, evaluated_at: new Date().toISOString() })
      toast.success('Avaliação registrada!')
      setModalOpen(false)
      reset()
      load()
    } catch { toast.error('Erro ao registrar avaliação') } finally { setSaving(false) }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-[var(--color-text)]">Avaliações</h1>
        <Button onClick={() => { reset(); setModalOpen(true) }} leftIcon={<Plus size={16} />}>Registrar Avaliação</Button>
      </div>

      <Card noPadding>
        {evaluations.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList size={40} className="text-[var(--color-text-muted)] mx-auto mb-3" />
            <p className="text-[var(--color-text-muted)]">Nenhuma avaliação registrada</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {evaluations.map((ev) => {
              const metric = ev.metric as any
              const pct = metric ? Math.round((ev.score / metric.max_score) * 100) : 0
              return (
                <div key={ev.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text)]">{(ev as any).student?.name}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{(ev as any).course?.title} • {metric?.name}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{formatDate(ev.evaluated_at)}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-sm font-bold ${pct >= 60 ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'}`}>
                      {ev.score} / {metric?.max_score}
                    </div>
                  </div>
                  {ev.feedback && <p className="text-xs text-[var(--color-text-secondary)] bg-[var(--color-surface-elevated)] rounded-lg px-3 py-2 mt-2">{ev.feedback}</p>}
                </div>
              )
            })}
          </div>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Registrar Avaliação" footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
          <Button loading={saving} onClick={handleSubmit(onSubmit)}>Registrar</Button>
        </div>
      }>
        <div className="space-y-4">
          <Select label="Aluno" placeholder="Selecione o aluno" options={students.map((s) => ({ value: s.id, label: s.name }))} {...register('student_id')} />
          <Select label="Curso" placeholder="Selecione o curso" options={courses.map((c) => ({ value: c.id, label: c.title }))} {...register('course_id')} />
          <Select label="Métrica" placeholder="Selecione a métrica" options={metrics.map((m) => ({ value: m.id, label: `${m.name} (máx ${m.max_score})` }))} disabled={!selectedCourse} {...register('metric_id')} />
          <Input label="Nota" type="number" step="0.1" min={0} error={errors.score?.message} {...register('score', { valueAsNumber: true })} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">Feedback do Instrutor</label>
            <textarea rows={3} placeholder="Descreva pontos de melhoria e destaques..." className="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] resize-none" {...register('feedback')} />
          </div>
        </div>
      </Modal>
    </div>
  )
}
