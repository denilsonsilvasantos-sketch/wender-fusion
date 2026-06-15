import { useEffect, useState } from 'react'
import { CalendarCheck, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Card, Spinner } from '@/components/ui'

const COLOR = '#6366F1'

interface AttendanceRecord {
  id: string; date: string; status: 'present' | 'absent' | 'justified'; lesson?: string
}

const MOCK: AttendanceRecord[] = [
  { id: '1',  date: '2026-05-05', status: 'present',   lesson: 'Introdução ao TIG' },
  { id: '2',  date: '2026-05-07', status: 'present',   lesson: 'Equipamentos e EPI' },
  { id: '3',  date: '2026-05-12', status: 'present',   lesson: 'Parâmetros elétricos' },
  { id: '4',  date: '2026-05-14', status: 'absent',    lesson: 'Posições 1G e 2G' },
  { id: '5',  date: '2026-05-19', status: 'present',   lesson: 'Tocha e eletrodo' },
  { id: '6',  date: '2026-05-21', status: 'present',   lesson: 'Materiais de adição' },
  { id: '7',  date: '2026-05-26', status: 'justified', lesson: 'Juntas — tipos e prep.' },
  { id: '8',  date: '2026-05-28', status: 'present',   lesson: 'Prática 1G' },
  { id: '9',  date: '2026-06-02', status: 'present',   lesson: 'Prática 2G' },
  { id: '10', date: '2026-06-04', status: 'present',   lesson: 'Avaliação Módulo 1' },
  { id: '11', date: '2026-06-09', status: 'present',   lesson: 'Módulo 2 — Ligas' },
  { id: '12', date: '2026-06-11', status: 'absent',    lesson: 'Aço inox — prep.' },
]

const ST = {
  present:   { label: 'Presente',   icon: CheckCircle,   color: '#10B981' },
  absent:    { label: 'Falta',      icon: XCircle,       color: '#EF4444' },
  justified: { label: 'Justificada', icon: AlertTriangle, color: '#F59E0B' },
}

export function PresencaPage() {
  const { profile } = useAuth()
  const [list, setList]     = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    supabase.from('attendance')
      .select('id, date, status, lesson')
      .eq('student_id', profile.id)
      .order('date', { ascending: false })
      .then(({ data }) => {
        setList((data as AttendanceRecord[])?.length ? (data as AttendanceRecord[]) : MOCK)
        setLoading(false)
      })
  }, [profile])

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  const total      = list.length
  const presencas  = list.filter(r => r.status === 'present').length
  const faltas     = list.filter(r => r.status === 'absent').length
  const justif     = list.filter(r => r.status === 'justified').length
  const pct        = total ? Math.round(((presencas + justif) / total) * 100) : 0
  const minPct     = 75
  const ok         = pct >= minPct

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Frequência</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Controle de presença nas aulas</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Frequência',  value: `${pct}%`,    color: ok ? '#10B981' : '#EF4444' },
          { label: 'Presenças',   value: presencas,     color: '#10B981' },
          { label: 'Faltas',      value: faltas,        color: '#EF4444' },
          { label: 'Justificadas',value: justif,        color: '#F59E0B' },
        ].map(s => (
          <Card key={s.label}>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Frequência bar */}
      <Card>
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold text-[var(--color-text)]">Frequência acumulada</span>
          <span className="font-bold" style={{ color: ok ? '#10B981' : '#EF4444' }}>{pct}%</span>
        </div>
        <div className="h-3 rounded-full bg-[var(--color-surface-elevated)] relative overflow-hidden">
          <div className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, background: ok ? '#10B981' : '#EF4444' }} />
          <div className="absolute top-0 bottom-0 w-px" style={{ left: `${minPct}%`, background: '#F59E0B' }} />
        </div>
        <div className="flex justify-between text-xs mt-1.5 text-[var(--color-text-muted)]">
          <span>0%</span>
          <span style={{ color: '#F59E0B' }}>Mínimo: {minPct}%</span>
          <span>100%</span>
        </div>
        {!ok && (
          <div className="flex items-center gap-2 mt-3 p-3 rounded-xl text-sm"
            style={{ background: '#EF444415', color: '#EF4444' }}>
            <AlertTriangle size={15} />
            <span>Frequência abaixo do mínimo exigido. Você precisa de mais {Math.ceil((minPct * total / 100) - presencas - justif)} presenças.</span>
          </div>
        )}
      </Card>

      {/* List */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <CalendarCheck size={16} style={{ color: COLOR }} />
          <h2 className="font-semibold text-[var(--color-text)]">Registro de aulas</h2>
        </div>
        <div className="space-y-2">
          {list.map(r => {
            const cfg = ST[r.status]
            const Icon = cfg.icon
            return (
              <div key={r.id} className="flex items-center gap-3 py-2.5 border-b last:border-0"
                style={{ borderColor: 'var(--color-border)' }}>
                <Icon size={15} style={{ color: cfg.color }} className="flex-shrink-0" />
                <span className="text-sm text-[var(--color-text-muted)] w-24 flex-shrink-0">
                  {new Date(r.date).toLocaleDateString('pt-BR')}
                </span>
                <span className="text-sm text-[var(--color-text)] flex-1 min-w-0 truncate">
                  {r.lesson ?? 'Aula'}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: cfg.color + '15', color: cfg.color }}>{cfg.label}</span>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
