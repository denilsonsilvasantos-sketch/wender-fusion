import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Plus, Clock, MapPin } from 'lucide-react'
import { Card, Button } from '@/components/ui'

const COLOR = '#8B5CF6'

type EventType = 'aula' | 'visita' | 'os' | 'consultoria' | 'reuniao'

interface CalEvent {
  id: string
  title: string
  date: string
  time: string
  type: EventType
  location?: string
}

const TYPE_META: Record<EventType, { label: string; color: string }> = {
  aula:        { label: 'Aula',              color: '#FF8C00' },
  visita:      { label: 'Visita técnica',    color: '#3B82F6' },
  os:          { label: 'Ordem de serviço',  color: '#22c55e' },
  consultoria: { label: 'Consultoria',       color: COLOR     },
  reuniao:     { label: 'Reunião',           color: '#f59e0b' },
}

const MOCK_EVENTS: CalEvent[] = [
  { id: '1',  title: 'Turma TIG Básico',              date: '2026-06-16', time: '08:00', type: 'aula',        location: 'Sala A' },
  { id: '2',  title: 'Inspeção NR-13 — Petroquímica', date: '2026-06-16', time: '14:00', type: 'os',          location: 'Cliente' },
  { id: '3',  title: 'Turma MIG Intermediário',        date: '2026-06-17', time: '08:00', type: 'aula',        location: 'Sala B' },
  { id: '4',  title: 'Visita técnica — Metal Norte',   date: '2026-06-18', time: '10:00', type: 'visita' },
  { id: '5',  title: 'Consultoria WPQR',               date: '2026-06-19', time: '09:00', type: 'consultoria', location: 'Online' },
  { id: '6',  title: 'Reunião de equipe',              date: '2026-06-20', time: '15:00', type: 'reuniao' },
  { id: '7',  title: 'Turma Eletrodo',                 date: '2026-06-23', time: '08:00', type: 'aula',        location: 'Sala A' },
  { id: '8',  title: 'OS Solda TIG — Indústria Sul',   date: '2026-06-24', time: '07:00', type: 'os' },
  { id: '9',  title: 'Consultoria ISO — Auditoria',    date: '2026-06-26', time: '14:00', type: 'consultoria' },
  { id: '10', title: 'Turma Inspeção Visual',          date: '2026-06-27', time: '08:00', type: 'aula',        location: 'Sala C' },
]

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const DAY_HEADERS = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

export function SharedAgendaPage() {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate())

  const year     = currentDate.getFullYear()
  const month    = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`

  const eventsThisMonth = MOCK_EVENTS.filter(e => e.date.startsWith(monthStr))
  const eventsForDay    = selectedDay
    ? MOCK_EVENTS.filter(e => e.date === `${monthStr}-${String(selectedDay).padStart(2, '0')}`)
    : []

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Agenda</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Calendário de aulas, ordens de serviço e consultorias</p>
        </div>
        <Button style={{ background: COLOR }} leftIcon={<Plus size={15} />}>Novo evento</Button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {Object.entries(TYPE_META).map(([k, v]) => (
          <span key={k} className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: v.color }} />
            {v.label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Calendar grid */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-5">
              <button onClick={() => { setCurrentDate(new Date(year, month - 1, 1)); setSelectedDay(null) }}
                className="p-1.5 rounded-lg hover:bg-[var(--color-surface-elevated)] transition-colors">
                <ChevronLeft size={16} className="text-[var(--color-text-muted)]" />
              </button>
              <h2 className="font-bold text-[var(--color-text)]">{MONTHS[month]} {year}</h2>
              <button onClick={() => { setCurrentDate(new Date(year, month + 1, 1)); setSelectedDay(null) }}
                className="p-1.5 rounded-lg hover:bg-[var(--color-surface-elevated)] transition-colors">
                <ChevronRight size={16} className="text-[var(--color-text-muted)]" />
              </button>
            </div>

            <div className="grid grid-cols-7 mb-2">
              {DAY_HEADERS.map(d => (
                <div key={d} className="text-center text-xs font-medium text-[var(--color-text-muted)] py-1">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (!day) return <div key={i} />
                const dateStr    = `${monthStr}-${String(day).padStart(2, '0')}`
                const dayEvents  = MOCK_EVENTS.filter(e => e.date === dateStr)
                const isToday    = year === today.getFullYear() && month === today.getMonth() && day === today.getDate()
                const isSelected = day === selectedDay
                return (
                  <button key={i} onClick={() => setSelectedDay(day)}
                    className="flex flex-col items-center py-2 px-1 rounded-xl transition-colors min-h-[52px]"
                    style={isSelected
                      ? { background: COLOR, color: '#fff' }
                      : isToday
                        ? { background: COLOR + '15', color: COLOR }
                        : { color: 'var(--color-text)' }
                    }>
                    <span className="text-sm font-semibold">{day}</span>
                    {dayEvents.length > 0 && (
                      <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                        {dayEvents.slice(0, 3).map(e => (
                          <span key={e.id} className="w-1.5 h-1.5 rounded-full"
                            style={{ background: isSelected ? '#fff' : TYPE_META[e.type].color }} />
                        ))}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Event list panel */}
        <div>
          <Card>
            <h3 className="font-bold text-[var(--color-text)] mb-3 flex items-center gap-2">
              <Calendar size={15} style={{ color: COLOR }} />
              {selectedDay
                ? `${selectedDay} de ${MONTHS[month]}`
                : `${eventsThisMonth.length} evento${eventsThisMonth.length !== 1 ? 's' : ''} no mês`
              }
            </h3>
            {eventsForDay.length === 0 && selectedDay ? (
              <p className="text-sm text-[var(--color-text-muted)] text-center py-8">Nenhum evento neste dia</p>
            ) : (
              <div className="space-y-2">
                {(selectedDay ? eventsForDay : eventsThisMonth).map(e => {
                  const meta = TYPE_META[e.type]
                  return (
                    <div key={e.id} className="flex gap-3 p-3 rounded-xl"
                      style={{ background: 'var(--color-surface-elevated)' }}>
                      <div className="w-1 rounded-full flex-shrink-0 self-stretch" style={{ background: meta.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--color-text)] leading-snug">{e.title}</p>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--color-text-muted)]">
                          <span className="flex items-center gap-0.5"><Clock size={10} />{e.time}</span>
                          {e.location && <span className="flex items-center gap-0.5"><MapPin size={10} />{e.location}</span>}
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded mt-1 inline-block"
                          style={{ background: meta.color + '15', color: meta.color }}>
                          {meta.label}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </div>
      </div>

      <div className="flex items-start gap-3 px-4 py-3 rounded-xl border text-sm"
        style={{ background: COLOR + '08', borderColor: COLOR + '25', color: COLOR }}>
        <Calendar size={15} className="flex-shrink-0 mt-0.5" />
        <span>Agenda em desenvolvimento — eventos ilustrativos. Integração com turmas e OS do sistema em breve.</span>
      </div>
    </div>
  )
}
