import { useEffect, useState } from 'react'
import { ClipboardList, MessageSquare } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import type { Evaluation } from '@/types'
import { Card, Spinner } from '@/components/ui'
import { formatDate } from '@/lib/utils'

export function EvaluationsPage() {
  const { profile } = useAuth()
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    supabase
      .from('evaluations')
      .select('*, metric:evaluation_metrics(name, type, max_score), course:courses(title)')
      .eq('student_id', profile.id)
      .order('evaluated_at', { ascending: false })
      .then(({ data }) => { setEvaluations((data || []) as Evaluation[]); setLoading(false) })
  }, [profile])

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-[var(--color-text)] flex items-center gap-2">
        <ClipboardList size={28} className="text-[var(--color-primary)]" />
        Minhas Avaliações
      </h1>

      {evaluations.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <ClipboardList size={48} className="text-[var(--color-text-muted)] mx-auto mb-3" />
            <p className="text-[var(--color-text-secondary)]">Nenhuma avaliação registrada ainda</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {evaluations.map((ev) => {
            const metric = ev.metric as any
            const course = (ev as any).course
            const pct = metric ? Math.round((ev.score / metric.max_score) * 100) : 0
            const color = pct >= 60 ? 'text-green-400' : pct >= 40 ? 'text-amber-400' : 'text-red-400'
            const bgColor = pct >= 60 ? 'bg-green-500/10' : pct >= 40 ? 'bg-amber-500/10' : 'bg-red-500/10'

            return (
              <div key={ev.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="font-semibold text-[var(--color-text)]">{metric?.name || 'Avaliação'}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{course?.title} • {formatDate(ev.evaluated_at)}</p>
                    <span className="text-xs text-[var(--color-text-muted)] capitalize">{metric?.type === 'theoretical' ? 'Teórica' : 'Prática'}</span>
                  </div>
                  <div className={`px-3 py-2 rounded-lg ${bgColor} text-center min-w-[70px]`}>
                    <p className={`text-xl font-black ${color}`}>{ev.score}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">/ {metric?.max_score || 10}</p>
                  </div>
                </div>
                {ev.feedback && (
                  <div className="bg-[var(--color-surface-elevated)] rounded-lg p-3">
                    <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-secondary)] mb-1">
                      <MessageSquare size={13} />Feedback do Instrutor
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">{ev.feedback}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
