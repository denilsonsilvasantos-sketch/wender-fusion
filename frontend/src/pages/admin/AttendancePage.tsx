import { useEffect, useState } from 'react'
import { CalendarCheck, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import type { Course } from '@/types'
import { Button, Card, Select, Spinner } from '@/components/ui'

export function AdminAttendancePage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [lessons, setLessons] = useState<{ id: string; title: string }[]>([])
  const [selectedLesson, setSelectedLesson] = useState('')
  const [enrollments, setEnrollments] = useState<{ student_id: string; student: { name: string } }[]>([])
  const [attendance, setAttendance] = useState<Record<string, boolean>>({})
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('courses').select('id, title').eq('status', 'published')
      .then(({ data }) => { setCourses((data || []) as Course[]); setLoading(false) })
  }, [])

  useEffect(() => {
    if (!selectedCourse) return
    supabase.from('lessons').select('id, title').eq('course_id', selectedCourse).order('order_index')
      .then(({ data }) => setLessons(data || []))
    supabase.from('enrollments').select('student_id, student:user_profiles(name)').eq('course_id', selectedCourse).eq('status', 'active')
      .then(({ data }) => setEnrollments((data || []) as any))
  }, [selectedCourse])

  useEffect(() => {
    if (!selectedLesson || enrollments.length === 0) return
    supabase.from('attendance').select('student_id, present').eq('lesson_id', selectedLesson)
      .then(({ data }) => {
        const map: Record<string, boolean> = {}
        enrollments.forEach((e) => { map[e.student_id] = false })
        ;(data || []).forEach((a: any) => { map[a.student_id] = a.present })
        setAttendance(map)
      })
  }, [selectedLesson, enrollments])

  async function saveAttendance() {
    if (!selectedLesson || !selectedCourse) return
    setSaving(true)
    try {
      const records = Object.entries(attendance).map(([student_id, present]) => ({
        student_id, lesson_id: selectedLesson, course_id: selectedCourse, present,
      }))
      await supabase.from('attendance').upsert(records)
      toast.success('Presença salva!')
    } catch { toast.error('Erro ao salvar presença') } finally { setSaving(false) }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-[var(--color-text)] flex items-center gap-2">
        <CalendarCheck size={28} className="text-[var(--color-primary)]" />
        Controle de Presença
      </h1>

      <Card title="Selecionar Aula">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Curso"
            placeholder="Selecione o curso"
            value={selectedCourse}
            onChange={(e) => { setSelectedCourse(e.target.value); setSelectedLesson('') }}
            options={courses.map((c) => ({ value: c.id, label: c.title }))}
          />
          <Select
            label="Aula"
            placeholder="Selecione a aula"
            value={selectedLesson}
            onChange={(e) => setSelectedLesson(e.target.value)}
            options={lessons.map((l) => ({ value: l.id, label: l.title }))}
            disabled={!selectedCourse}
          />
        </div>
      </Card>

      {selectedLesson && enrollments.length > 0 && (
        <Card title={`Chamada (${enrollments.length} alunos)`} action={
          <Button size="sm" loading={saving} onClick={saveAttendance}>Salvar Chamada</Button>
        } noPadding>
          <div className="divide-y divide-[var(--color-border)]">
            {enrollments.map((e) => (
              <div key={e.student_id} className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-[var(--color-text)]">{e.student?.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAttendance((prev) => ({ ...prev, [e.student_id]: true }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${attendance[e.student_id] ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] hover:bg-green-500/10 hover:text-green-400'}`}
                  >
                    <Check size={12} />Presente
                  </button>
                  <button
                    onClick={() => setAttendance((prev) => ({ ...prev, [e.student_id]: false }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${!attendance[e.student_id] ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] hover:bg-red-500/10 hover:text-red-400'}`}
                  >
                    <X size={12} />Ausente
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {selectedLesson && enrollments.length === 0 && (
        <Card><p className="text-center text-[var(--color-text-muted)] py-4">Nenhum aluno ativo neste curso</p></Card>
      )}
    </div>
  )
}
