import { useEffect, useState } from 'react'
import { ClipboardList, TrendingUp, CheckCircle, XCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Card, Spinner } from '@/components/ui'

const COLOR = '#6366F1'

interface Evaluation {
  id: string; score: number; max_score: number; type: string
  evaluated_at: string; notes?: string
  course: { title: string }
}

const MOCK: Evaluation[] = [
  { id: '1', score: 85, max_score: 100, type: 'teorica',  evaluated_at: '2026-04-02', course: { title: 'TIG Avançado' } },
  { id: '2', score: 92, max_score: 100, type: 'pratica',  evaluated_at: '2026-04-16', course: { title: 'TIG Avançado' } },
  { id: '3', score: 78, max_score: 100, type: 'teorica',  evaluated_at: '2026-05-07', course: { title: 'TIG Avançado' } },
  { id: '4', score: 88, max_score: 100, type: 'pratica',  evaluated_at: '2026-05-21', course: { title: 'TIG Avançado' } },
  { id: '5', score: 65, max_score: 100, type: 'teorica',  evaluated_at: '2026-06-04', course: { title: 'TIG Avançado' }, notes: 'Refazer cálculo de ciclo de trabalho' },
]

const TIPO_LABEL: Record<string, string> = { teorica: 'Teórica', pratica: 'Prática', parcial: 'Parcial' }

export function AvaliacoesPage() {
  const { profile } = useAuth()
  const [list, setList]     = useState<Evaluation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    supabase.from('evaluations')
      .select('id, score, max_score, type, evaluated_at, notes, course:courses(title)')
      .eq('student_id', profile.id)
      .order('evaluated_at', { ascending: false })
      .then(({ data }) => {
        setList((data as unknown as Evaluation[])?.length ? (data as unknown as Evaluation[]) : MOCK)
        setLoading(false)
      })
  }, [profile])

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  const media   = list.length ? list.reduce((s, e) => s + (e.score / e.max_score) * 100, 0) / list.length : 0
  const aprovados = list.filter(e => (e.score / e.max_score) >= 0.7).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Avaliações</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Histórico de notas e desempenho</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Média geral',  value: `${media.toFixed(1)}`,   color: media >= 70 ? '#10B981' : '#F59E0B', unit: '%' },
          { label: 'Aprovações',   value: aprovados,                color: '#10B981' },
          { label: 'Total',        value: list.length,              color: '#64748B' },
        ].map(s => (
          <Card key={s.label}>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}<span className="text-sm">{s.unit}</span></p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <ClipboardList size={16} style={{ color: COLOR }} />
          <h2 className="font-semibold text-[var(--color-text)]">Todas as avaliações</h2>
        </div>
        {list.length === 0 ? (
          <div className="text-center py-8 text-[var(--color-text-muted)] text-sm">Nenhuma avaliação registrada ainda.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                  {['Data', 'Curso', 'Tipo', 'Nota', 'Status', 'Obs.'].map(h => (
                    <th key={h} className="text-left py-2 pr-4 text-xs font-semibold text-[var(--color-text-muted)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {list.map(e => {
                  const pct  = (e.score / e.max_score) * 100
                  const ok   = pct >= 70
                  return (
                    <tr key={e.id}>
                      <td className="py-3 pr-4 text-[var(--color-text-muted)] whitespace-nowrap">
                        {new Date(e.evaluated_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 pr-4 text-[var(--color-text)] font-medium">{e.course?.title}</td>
                      <td className="py-3 pr-4">
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: COLOR + '15', color: COLOR }}>
                          {TIPO_LABEL[e.type] ?? e.type}
                        </span>
                      </td>
                      <td className="py-3 pr-4 font-bold" style={{ color: ok ? '#10B981' : '#EF4444' }}>
                        {e.score}/{e.max_score}
                      </td>
                      <td className="py-3 pr-4">
                        {ok
                          ? <span className="flex items-center gap-1 text-xs text-[#10B981]"><CheckCircle size={13} />Aprovado</span>
                          : <span className="flex items-center gap-1 text-xs text-[#EF4444]"><XCircle    size={13} />Reprovado</span>}
                      </td>
                      <td className="py-3 text-xs text-[var(--color-text-muted)]">{e.notes ?? '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} style={{ color: COLOR }} />
          <h2 className="font-semibold text-[var(--color-text)]">Evolução de notas</h2>
        </div>
        <div className="space-y-2">
          {[...list].reverse().map((e, i) => {
            const pct = (e.score / e.max_score) * 100
            return (
              <div key={e.id} className="flex items-center gap-3">
                <span className="text-xs text-[var(--color-text-muted)] w-6 text-right">{i + 1}</span>
                <div className="flex-1 h-2 rounded-full bg-[var(--color-surface-elevated)]">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: pct >= 70 ? '#10B981' : '#EF4444' }} />
                </div>
                <span className="text-xs font-bold w-10 text-right" style={{ color: pct >= 70 ? '#10B981' : '#EF4444' }}>
                  {pct.toFixed(0)}%
                </span>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
