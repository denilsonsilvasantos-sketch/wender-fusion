import { useEffect, useState } from 'react'
import { CalendarCheck } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import type { Attendance } from '@/types'
import { Card, Spinner } from '@/components/ui'
import { formatDate } from '@/lib/utils'

export function AttendancePage() {
  const { profile } = useAuth()
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [courses, setCourses] = useState<{ id: string; title: string; pct: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    async function load() {
      const { data } = await supabase
        .from('attendance')
        .select('*, lesson:lessons(title), course:courses(id, title)')
        .eq('student_id', profile!.id)
        .order('recorded_at', { ascending: false })
      const att = (data || []) as Attendance[]
      setAttendance(att)

      // Group by course
      const courseMap = new Map<string, { id: string; title: string; total: number; present: number }>()
      att.forEach((a) => {
        const course = (a as any).course
        if (!course) return
        const existing = courseMap.get(course.id) || { id: course.id, title: course.title, total: 0, present: 0 }
        existing.total++
        if (a.present) existing.present++
        courseMap.set(course.id, existing)
      })
      setCourses([...courseMap.values()].map((c) => ({ id: c.id, title: c.title, pct: c.total ? Math.round((c.present / c.total) * 100) : 0 })))
      setLoading(false)
    }
    load()
  }, [profile])

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-[var(--color-text)] flex items-center gap-2">
        <CalendarCheck size={28} className="text-[var(--color-primary)]" />
        Minha Presença
      </h1>

      {courses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((c) => (
            <div key={c.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5">
              <p className="font-semibold text-[var(--color-text)] mb-3">{c.title}</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-[var(--color-surface-elevated)] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${c.pct >= 75 ? 'bg-green-500' : c.pct >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${c.pct}%` }}
                  />
                </div>
                <span className={`text-sm font-bold ${c.pct >= 75 ? 'text-green-400' : c.pct >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                  {c.pct}%
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Mínimo exigido: 75%</p>
            </div>
          ))}
        </div>
      )}

      <Card title="Histórico de Presenças" noPadding>
        {attendance.length === 0 ? (
          <div className="text-center py-12">
            <CalendarCheck size={40} className="text-[var(--color-text-muted)] mx-auto mb-3" />
            <p className="text-[var(--color-text-secondary)] text-sm">Nenhum registro de presença ainda</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {attendance.map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-5 py-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${a.present ? 'bg-green-500' : 'bg-red-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--color-text)] truncate">{(a.lesson as any)?.title}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{formatDate(a.recorded_at)}</p>
                </div>
                <span className={`text-xs font-medium ${a.present ? 'text-green-400' : 'text-red-400'}`}>
                  {a.present ? 'Presente' : 'Ausente'}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
