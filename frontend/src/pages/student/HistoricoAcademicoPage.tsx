import { useEffect, useState } from 'react'
import { GraduationCap, BookOpen, CheckCircle, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Card, Spinner } from '@/components/ui'

const COLOR = '#F59E0B'

interface HistEntry {
  id: string; status: string; enrolled_at: string; completed_at?: string; progress_pct: number
  course: { title: string; duration_hours: number; category?: string }
}

const MOCK: HistEntry[] = [
  { id: '1', status: 'completed', enrolled_at: '2025-08-10', completed_at: '2025-12-20', progress_pct: 100, course: { title: 'Soldagem SMAW — Iniciante', duration_hours: 80, category: 'SMAW' } },
  { id: '2', status: 'completed', enrolled_at: '2026-01-15', completed_at: '2026-04-30', progress_pct: 100, course: { title: 'Soldagem MIG/MAG — Intermediário', duration_hours: 120, category: 'MIG/MAG' } },
  { id: '3', status: 'active',    enrolled_at: '2026-05-05', progress_pct: 62,           course: { title: 'Soldagem TIG — Avançado', duration_hours: 160, category: 'TIG' } },
]

const CAT_COLORS: Record<string, string> = { TIG: '#6366F1', 'MIG/MAG': '#3B82F6', SMAW: '#F59E0B', FCAW: '#10B981' }

export function HistoricoAcademicoPage() {
  const { profile } = useAuth()
  const [list,    setList]    = useState<HistEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    supabase.from('enrollments')
      .select('id, status, enrolled_at, completed_at, progress_pct, course:courses(title,duration_hours,category)')
      .eq('student_id', profile.id)
      .order('enrolled_at', { ascending: true })
      .then(({ data }) => {
        setList((data as unknown as HistEntry[])?.length ? (data as unknown as HistEntry[]) : MOCK)
        setLoading(false)
      })
  }, [profile])

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  const horas    = list.filter(e => e.status === 'completed').reduce((s, e) => s + e.course.duration_hours, 0)
  const concluidos = list.filter(e => e.status === 'completed').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Histórico Acadêmico</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Todos os cursos matriculados e concluídos</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Concluídos',    value: concluidos, color: '#10B981' },
          { label: 'Horas totais',  value: `${horas}h`, color: COLOR   },
          { label: 'Matrículas',    value: list.length, color: '#64748B' },
        ].map(s => (
          <Card key={s.label}>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Timeline */}
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <GraduationCap size={16} style={{ color: COLOR }} />
          <h2 className="font-semibold text-[var(--color-text)]">Trajetória de formação</h2>
        </div>
        {list.length === 0 ? (
          <div className="text-center py-8 text-[var(--color-text-muted)] text-sm">Nenhum histórico encontrado.</div>
        ) : (
          <div className="relative pl-6">
            <div className="absolute left-2 top-2 bottom-2 w-px" style={{ background: 'var(--color-border)' }} />
            <div className="space-y-6">
              {list.map(e => {
                const done  = e.status === 'completed'
                const catColor = CAT_COLORS[e.course.category ?? ''] ?? COLOR
                return (
                  <div key={e.id} className="relative">
                    <div className="absolute -left-6 top-0 w-4 h-4 rounded-full border-2"
                      style={{
                        background: done ? '#10B981' : 'var(--color-bg)',
                        borderColor: done ? '#10B981' : COLOR,
                      }} />
                    <div className="rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
                      <div className="flex items-start gap-3 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-bold text-[var(--color-text)]">{e.course.title}</h3>
                            {e.course.category && (
                              <span className="text-xs px-2 py-0.5 rounded-full"
                                style={{ background: catColor + '20', color: catColor }}>
                                {e.course.category}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-4 text-xs text-[var(--color-text-muted)]">
                            <span className="flex items-center gap-1">
                              <Clock size={11} />{e.course.duration_hours}h
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen size={11} />
                              Início: {new Date(e.enrolled_at).toLocaleDateString('pt-BR')}
                            </span>
                            {done && e.completed_at && (
                              <span className="flex items-center gap-1">
                                <CheckCircle size={11} style={{ color: '#10B981' }} />
                                Conclusão: {new Date(e.completed_at).toLocaleDateString('pt-BR')}
                              </span>
                            )}
                          </div>
                        </div>
                        {done
                          ? <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
                              style={{ background: '#10B981' + '15', color: '#10B981' }}>
                              <CheckCircle size={12} />Concluído
                            </span>
                          : (
                            <div className="text-right">
                              <p className="text-xs font-bold" style={{ color: COLOR }}>{e.progress_pct}%</p>
                              <p className="text-xs text-[var(--color-text-muted)]">Em andamento</p>
                            </div>
                          )}
                      </div>
                      {!done && (
                        <div className="mt-3 h-1.5 rounded-full bg-[var(--color-surface-elevated)]">
                          <div className="h-full rounded-full" style={{ width: `${e.progress_pct}%`, background: COLOR }} />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
