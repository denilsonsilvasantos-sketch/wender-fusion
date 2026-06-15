import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { Card } from '@/components/ui'

const COLOR = '#10B981'

const TIPOS = {
  aula:      { label: 'Aula',          bg: COLOR,     text: '#fff' },
  avaliacao: { label: 'Avaliação',     bg: '#F59E0B', text: '#fff' },
  reuniao:   { label: 'Reunião',       bg: '#6366F1', text: '#fff' },
  reposicao: { label: 'Reposição',     bg: '#3B82F6', text: '#fff' },
  evento:    { label: 'Evento',        bg: '#8B5CF6', text: '#fff' },
}

type TipoEvento = keyof typeof TIPOS

interface Evento { id: number; date: string; title: string; type: TipoEvento; time: string; turma?: string }

const MOCK_EVENTS: Evento[] = [
  { id:  1, date: '2026-06-16', title: 'TIG Avançado',         type: 'aula',      time: '08:00–12:00', turma: 'Lab 1' },
  { id:  2, date: '2026-06-16', title: 'MIG/MAG Industrial',   type: 'aula',      time: '13:00–17:00', turma: 'Lab 2' },
  { id:  3, date: '2026-06-17', title: 'MIG/MAG Industrial',   type: 'aula',      time: '13:00–17:00', turma: 'Lab 2' },
  { id:  4, date: '2026-06-17', title: 'Reunião pedagógica',   type: 'reuniao',   time: '09:00–10:00' },
  { id:  5, date: '2026-06-18', title: 'Eletrodo Revestido',   type: 'aula',      time: '08:00–12:00', turma: 'Lab 3' },
  { id:  6, date: '2026-06-18', title: 'Avaliação Teórica — TIG', type: 'avaliacao', time: '08:00–10:00' },
  { id:  7, date: '2026-06-19', title: 'TIG Avançado',         type: 'aula',      time: '08:00–12:00', turma: 'Lab 1' },
  { id:  8, date: '2026-06-20', title: 'Reposição MIG/MAG',    type: 'reposicao', time: '08:00–12:00', turma: 'Lab 2' },
  { id:  9, date: '2026-06-23', title: 'TIG Avançado',         type: 'aula',      time: '08:00–12:00', turma: 'Lab 1' },
  { id: 10, date: '2026-06-23', title: 'MIG/MAG Industrial',   type: 'aula',      time: '13:00–17:00', turma: 'Lab 2' },
  { id: 11, date: '2026-06-24', title: 'Avaliação Prática — SMAW', type: 'avaliacao', time: '08:00–12:00' },
  { id: 12, date: '2026-06-25', title: 'Eletrodo Revestido',   type: 'aula',      time: '08:00–12:00', turma: 'Lab 3' },
  { id: 13, date: '2026-06-27', title: 'Dia de campo industrial', type: 'evento', time: '09:00–16:00' },
  { id: 14, date: '2026-06-30', title: 'TIG Avançado — Formatura', type: 'evento', time: '18:00–21:00' },
]

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

export function AgendaPage() {
  const today = new Date()
  const [year,  setYear]  = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate())

  const firstDay    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  function prevMonth() { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1); setSelectedDay(null) }
  function nextMonth() { if (month === 11) { setMonth(0);  setYear(y => y + 1) } else setMonth(m => m + 1); setSelectedDay(null) }

  function pad(n: number) { return String(n).padStart(2, '0') }
  function dateKey(d: number) { return `${year}-${pad(month + 1)}-${pad(d)}` }

  const eventsMap: Record<string, Evento[]> = {}
  MOCK_EVENTS.forEach(e => { if (!eventsMap[e.date]) eventsMap[e.date] = []; eventsMap[e.date].push(e) })

  const selectedDate = selectedDay ? dateKey(selectedDay) : null
  const selectedEvents = selectedDate ? (eventsMap[selectedDate] ?? []) : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Agenda</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Calendário de aulas, avaliações e eventos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            {/* Month nav */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-[var(--color-surface-elevated)] transition-colors">
                <ChevronLeft size={18} className="text-[var(--color-text-muted)]" />
              </button>
              <h2 className="font-bold text-[var(--color-text)]">{MESES[month]} {year}</h2>
              <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-[var(--color-surface-elevated)] transition-colors">
                <ChevronRight size={18} className="text-[var(--color-text-muted)]" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {DIAS_SEMANA.map(d => (
                <div key={d} className="text-center text-xs font-semibold text-[var(--color-text-muted)] py-1">{d}</div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-px">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                const key = dateKey(d)
                const evts = eventsMap[key] ?? []
                const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear()
                const isSel   = d === selectedDay
                return (
                  <button key={d} onClick={() => setSelectedDay(d === selectedDay ? null : d)}
                    className="flex flex-col items-center rounded-xl py-1.5 transition-colors hover:bg-[var(--color-surface-elevated)]"
                    style={{ background: isSel ? COLOR + '18' : undefined }}>
                    <span className="text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full"
                      style={{
                        background: isToday ? COLOR : undefined,
                        color: isToday ? '#fff' : isSel ? COLOR : 'var(--color-text)',
                        fontWeight: isToday || isSel ? 700 : 400,
                      }}>
                      {d}
                    </span>
                    {evts.length > 0 && (
                      <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                        {evts.slice(0, 3).map(e => (
                          <span key={e.id} className="w-1.5 h-1.5 rounded-full" style={{ background: TIPOS[e.type].bg }} />
                        ))}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex gap-3 flex-wrap mt-4 pt-4 border-t border-[var(--color-border)]">
              {Object.entries(TIPOS).map(([k, v]) => (
                <div key={k} className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                  <span className="w-2 h-2 rounded-full" style={{ background: v.bg }} />
                  {v.label}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Event panel */}
        <div>
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={16} style={{ color: COLOR }} />
              <h3 className="font-bold text-[var(--color-text)]">
                {selectedDay
                  ? `${selectedDay} de ${MESES[month]}`
                  : 'Selecione um dia'}
              </h3>
            </div>
            {selectedEvents.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)] text-center py-8">
                {selectedDay ? 'Nenhum evento neste dia.' : 'Clique em um dia para ver os eventos.'}
              </p>
            ) : (
              <div className="space-y-3">
                {selectedEvents.map(e => {
                  const tipo = TIPOS[e.type]
                  return (
                    <div key={e.id} className="rounded-xl p-3 space-y-1"
                      style={{ background: tipo.bg + '12', borderLeft: `3px solid ${tipo.bg}` }}>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md" style={{ background: tipo.bg, color: tipo.text }}>
                          {tipo.label}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-[var(--color-text)]">{e.title}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{e.time}{e.turma ? ` · ${e.turma}` : ''}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
