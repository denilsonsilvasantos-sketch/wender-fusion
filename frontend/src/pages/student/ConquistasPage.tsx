import { Trophy, Lock, Star, Zap } from 'lucide-react'
import { Card } from '@/components/ui'

const COLOR = '#F59E0B'

const CONQUISTAS = [
  { id: 1, nome: 'Primeiro Arco',       desc: 'Completou a primeira aula prática',          xp: 50,  conquistada: true,  data: '05/05/2026', icon: '⚡' },
  { id: 2, nome: 'Estudante Dedicado',  desc: 'Completou 10 aulas sem faltas',               xp: 100, conquistada: true,  data: '02/06/2026', icon: '📚' },
  { id: 3, nome: 'Nota 100',            desc: 'Tirou nota máxima em uma avaliação',          xp: 150, conquistada: true,  data: '16/04/2026', icon: '🏆' },
  { id: 4, nome: 'Sem Faltas',          desc: 'Frequência 100% em um módulo completo',       xp: 200, conquistada: false, data: null,          icon: '✅' },
  { id: 5, nome: 'Mestre do TIG',       desc: 'Aprovado no módulo TIG Avançado',             xp: 300, conquistada: false, data: null,          icon: '🔥' },
  { id: 6, nome: 'Colecionador',        desc: 'Obteve 3 ou mais certificados',               xp: 400, conquistada: false, data: null,          icon: '🎖' },
  { id: 7, nome: 'Pontualidade',        desc: 'Chegou pontualmente por 20 dias seguidos',    xp: 100, conquistada: true,  data: '10/05/2026', icon: '⏰' },
  { id: 8, nome: 'Top 10',             desc: 'Entrou no ranking dos top 10 da turma',        xp: 250, conquistada: false, data: null,          icon: '🥇' },
  { id: 9, nome: 'Missioneiro',         desc: 'Completou 5 missões semanais seguidas',       xp: 150, conquistada: false, data: null,          icon: '🎯' },
  { id: 10, nome: 'Talento em Destaque', desc: 'Destacado pelo instrutor no banco de talentos', xp: 200, conquistada: false, data: null,       icon: '⭐' },
]

export function ConquistasPage() {
  const earned = CONQUISTAS.filter(c => c.conquistada)
  const xpTotal = earned.reduce((s, c) => s + c.xp, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Conquistas</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Suas medalhas e recompensas</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Obtidas',   value: earned.length,                   color: COLOR    },
          { label: 'Total',     value: CONQUISTAS.length,               color: '#64748B' },
          { label: 'XP total',  value: `${xpTotal.toLocaleString('pt-BR')} XP`, color: '#8B5CF6' },
        ].map(s => (
          <Card key={s.label}>
            <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-1">
          {earned.length}/{CONQUISTAS.length} desbloqueadas
        </h2>
        <div className="h-2 rounded-full bg-[var(--color-surface-elevated)]">
          <div className="h-full rounded-full" style={{ width: `${(earned.length / CONQUISTAS.length) * 100}%`, background: COLOR }} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CONQUISTAS.map(c => (
          <div key={c.id} className="rounded-xl border p-4 flex items-start gap-3"
            style={{
              borderColor: c.conquistada ? COLOR + '40' : 'var(--color-border)',
              background: c.conquistada ? COLOR + '08' : 'var(--color-surface)',
              opacity: c.conquistada ? 1 : 0.7,
            }}>
            <div className="text-2xl w-10 text-center flex-shrink-0">{c.conquistada ? c.icon : '🔒'}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-bold text-[var(--color-text)]">{c.nome}</p>
                {c.conquistada
                  ? <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full"
                      style={{ background: COLOR + '20', color: COLOR }}><Star size={10} />{c.xp} XP</span>
                  : <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)]">
                      <Lock size={10} />{c.xp} XP
                    </span>}
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{c.desc}</p>
              {c.conquistada && c.data && (
                <p className="text-xs mt-1" style={{ color: COLOR }}>
                  <Zap size={10} className="inline mr-0.5" />Obtida em {c.data}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
