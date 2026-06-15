import { Video, Clock, Bell } from 'lucide-react'
import { Card } from '@/components/ui'

const COLOR = '#6366F1'

const PREVIEW_MODULES = [
  { titulo: 'TIG — Módulo 1: Fundamentos',       aulas: 8, horas: '12h' },
  { titulo: 'TIG — Módulo 2: Materiais e Ligas', aulas: 6, horas: '9h'  },
  { titulo: 'TIG — Módulo 3: Posições de Solda', aulas: 7, horas: '10h' },
  { titulo: 'Segurança em Soldagem',              aulas: 4, horas: '6h'  },
]

export function VideoaulasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Videoaulas</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Conteúdo em vídeo dos seus cursos</p>
      </div>

      <Card>
        <div className="text-center py-10">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: COLOR + '15' }}>
            <Video size={36} style={{ color: COLOR }} />
          </div>
          <h2 className="text-xl font-black text-[var(--color-text)] mb-2">Em breve</h2>
          <p className="text-sm text-[var(--color-text-muted)] max-w-md mx-auto leading-relaxed">
            As videoaulas estão sendo produzidas e serão disponibilizadas em breve.
            Você será notificado quando o conteúdo estiver disponível para seu curso.
          </p>
          <button className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{ background: COLOR, color: '#fff' }}>
            <Bell size={15} />Quero ser avisado
          </button>
        </div>
      </Card>

      <div>
        <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-3">
          Módulos previstos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PREVIEW_MODULES.map((m, i) => (
            <div key={i} className="rounded-xl border p-4 opacity-60"
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: COLOR + '15' }}>
                  <Video size={15} style={{ color: COLOR }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">{m.titulo}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5 flex items-center gap-1">
                    <Clock size={11} />{m.aulas} aulas · {m.horas}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
