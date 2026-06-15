import { Trophy, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui'

const COLOR = '#F59E0B'

const RANKING = [
  { pos: 1,  nome: 'Ana Carolina S.',    xp: 3850, avg: 96, presenca: 100 },
  { pos: 2,  nome: 'Roberto Mendes',     xp: 3640, avg: 93, presenca: 98  },
  { pos: 3,  nome: 'Fernanda Lima',      xp: 3420, avg: 91, presenca: 95  },
  { pos: 4,  nome: 'Marcos Oliveira',    xp: 3110, avg: 88, presenca: 93  },
  { pos: 5,  nome: 'Juliana Pereira',    xp: 2980, avg: 86, presenca: 90  },
  { pos: 6,  nome: 'Você',              xp: 2750, avg: 83, presenca: 87, isMe: true },
  { pos: 7,  nome: 'Carlos Eduardo',    xp: 2600, avg: 81, presenca: 87  },
  { pos: 8,  nome: 'Larissa Costa',     xp: 2430, avg: 79, presenca: 85  },
  { pos: 9,  nome: 'Diego Santos',      xp: 2200, avg: 77, presenca: 83  },
  { pos: 10, nome: 'Patrícia Alves',    xp: 2050, avg: 74, presenca: 80  },
]

const PODIUM_COLORS = ['#F59E0B', '#9CA3AF', '#B45309']
const MEDAL_ICONS   = ['🥇', '🥈', '🥉']

export function RankingPage() {
  const me = RANKING.find(r => r.isMe)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Ranking</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Classificação da turma por desempenho geral</p>
      </div>

      {/* My position */}
      {me && (
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black"
              style={{ background: COLOR + '15', color: COLOR }}>
              {me.pos}°
            </div>
            <div className="flex-1">
              <p className="font-bold text-[var(--color-text)]">Sua posição atual</p>
              <div className="flex gap-4 mt-1 text-xs text-[var(--color-text-muted)]">
                <span><span className="font-semibold" style={{ color: '#8B5CF6' }}>{me.xp.toLocaleString('pt-BR')} XP</span></span>
                <span>Média: <span className="font-semibold" style={{ color: '#10B981' }}>{me.avg}%</span></span>
                <span>Frequência: <span className="font-semibold" style={{ color: COLOR }}>{me.presenca}%</span></span>
              </div>
            </div>
            <TrendingUp size={20} style={{ color: COLOR }} />
          </div>
        </Card>
      )}

      {/* Podium */}
      <div className="grid grid-cols-3 gap-3">
        {RANKING.slice(0, 3).map((r, i) => (
          <Card key={r.pos}>
            <div className="text-center">
              <div className="text-3xl mb-1">{MEDAL_ICONS[i]}</div>
              <p className="text-xs font-bold text-[var(--color-text)] truncate">{r.nome}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{r.xp.toLocaleString('pt-BR')} XP</p>
              <p className="text-xs font-semibold mt-1" style={{ color: PODIUM_COLORS[i] }}>{r.avg}%</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Full table */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={16} style={{ color: COLOR }} />
          <h2 className="font-semibold text-[var(--color-text)]">Classificação completa</h2>
        </div>
        <div className="space-y-1">
          {RANKING.map(r => (
            <div key={r.pos}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors"
              style={r.isMe
                ? { background: COLOR + '12', border: `1px solid ${COLOR}40` }
                : { background: 'transparent' }}>
              <span className="w-6 text-center font-black text-sm"
                style={{ color: r.pos <= 3 ? PODIUM_COLORS[r.pos - 1] : 'var(--color-text-muted)' }}>
                {r.pos <= 3 ? MEDAL_ICONS[r.pos - 1] : `${r.pos}°`}
              </span>
              <span className="flex-1 text-sm font-medium text-[var(--color-text)]">
                {r.nome}
                {r.isMe && <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full"
                  style={{ background: COLOR + '20', color: COLOR }}>Você</span>}
              </span>
              <span className="text-xs text-[var(--color-text-muted)] w-20 text-right">
                {r.xp.toLocaleString('pt-BR')} XP
              </span>
              <span className="text-xs font-bold w-10 text-right" style={{ color: '#10B981' }}>
                {r.avg}%
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
