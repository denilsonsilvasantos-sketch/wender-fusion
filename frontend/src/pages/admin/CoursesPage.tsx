import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import type { Course } from '@/types'
import { Button, Card, Badge, Modal, Input, Select, Spinner } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'
import api from '@/lib/api'

const schema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  price: z.number().min(0),
  duration_hours: z.number().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  min_attendance_percentage: z.number().min(0).max(100),
  min_grade: z.number().min(0).max(10),
})
type FormData = z.infer<typeof schema>

export function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Course | null>(null)
  const [saving, setSaving] = useState(false)
  const [thumbFile, setThumbFile] = useState<File | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { level: 'beginner', min_attendance_percentage: 75, min_grade: 6 },
  })

  async function load() {
    const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false })
    setCourses((data || []) as Course[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openCreate() { setEditing(null); reset({ level: 'beginner', min_attendance_percentage: 75, min_grade: 6, price: 0 }); setModalOpen(true) }
  function openEdit(c: Course) { setEditing(c); reset({ title: c.title, description: c.description || '', price: c.price, duration_hours: c.duration_hours || undefined, level: c.level || 'beginner', min_attendance_percentage: c.min_attendance_percentage, min_grade: c.min_grade }); setModalOpen(true) }

  async function onSubmit(data: FormData) {
    setSaving(true)
    try {
      let thumbnailUrl = editing?.thumbnail_url
      if (thumbFile) {
        const form = new FormData()
        form.append('file', thumbFile)
        form.append('folder', 'courses')
        const { data: uploaded } = await api.post('/upload/image', form, { headers: { 'Content-Type': 'multipart/form-data' } })
        thumbnailUrl = uploaded.public_id
      }
      if (editing) {
        await supabase.from('courses').update({ ...data, thumbnail_url: thumbnailUrl }).eq('id', editing.id)
        toast.success('Curso atualizado!')
      } else {
        await supabase.from('courses').insert({ ...data, thumbnail_url: thumbnailUrl, status: 'draft' })
        toast.success('Curso criado!')
      }
      setModalOpen(false)
      load()
    } catch { toast.error('Erro ao salvar curso') } finally { setSaving(false) }
  }

  async function toggleStatus(course: Course) {
    const newStatus = course.status === 'published' ? 'archived' : 'published'
    await supabase.from('courses').update({ status: newStatus }).eq('id', course.id)
    setCourses((prev) => prev.map((c) => c.id === course.id ? { ...c, status: newStatus } : c))
    toast.success(newStatus === 'published' ? 'Curso publicado!' : 'Curso arquivado!')
  }

  async function deleteCourse(id: string) {
    if (!confirm('Excluir este curso?')) return
    await supabase.from('courses').delete().eq('id', id)
    setCourses((prev) => prev.filter((c) => c.id !== id))
    toast.success('Curso excluído')
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-[var(--color-text)]">Gerenciar Cursos</h1>
        <Button onClick={openCreate} leftIcon={<Plus size={16} />}>Novo Curso</Button>
      </div>

      <Card noPadding>
        {courses.length === 0 ? (
          <div className="text-center py-12 text-[var(--color-text-muted)]">Nenhum curso criado ainda</div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {courses.map((c) => (
              <div key={c.id} className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-[var(--color-text)] truncate">{c.title}</p>
                    <Badge status={c.status} />
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)]">{formatCurrency(c.price)} • {c.duration_hours || 0}h</p>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => toggleStatus(c)} className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-elevated)] rounded transition-colors" title={c.status === 'published' ? 'Arquivar' : 'Publicar'}>
                    {c.status === 'published' ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button onClick={() => openEdit(c)} className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-secondary)] hover:bg-[var(--color-surface-elevated)] rounded transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => deleteCourse(c.id)} className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-surface-elevated)] rounded transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Curso' : 'Novo Curso'} size="lg" footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
          <Button loading={saving} onClick={handleSubmit(onSubmit)}>Salvar</Button>
        </div>
      }>
        <div className="space-y-4">
          <Input label="Título" error={errors.title?.message} {...register('title')} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">Descrição</label>
            <textarea rows={3} className="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] resize-none" {...register('description')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Preço (R$)" type="number" step="0.01" error={errors.price?.message} {...register('price', { valueAsNumber: true })} />
            <Input label="Carga Horária (h)" type="number" {...register('duration_hours', { valueAsNumber: true })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Presença Mínima (%)" type="number" min={0} max={100} error={errors.min_attendance_percentage?.message} {...register('min_attendance_percentage', { valueAsNumber: true })} />
            <Input label="Nota Mínima" type="number" step="0.1" min={0} max={10} error={errors.min_grade?.message} {...register('min_grade', { valueAsNumber: true })} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">Thumbnail</label>
            <input type="file" accept="image/*" onChange={(e) => setThumbFile(e.target.files?.[0] || null)} className="text-sm text-[var(--color-text-secondary)]" />
          </div>
        </div>
      </Modal>
    </div>
  )
}
