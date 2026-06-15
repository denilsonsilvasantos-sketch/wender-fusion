import { Trophy, TrendingUp, Star, Award, Users } from 'lucide-react'
import { Card } from '@/components/ui'

const COLOR = '#8B5CF6'

const MELHORES_ALUNOS = [
  { pos: 1, nome: 'Diego Santos',       turma: 'MIG/MAG Industrial', nota: 9.0, presenca: 100 },
  { pos: 2, nome: 'Alexandre Ferreira', turma: 'TIG Avançado',       nota: 9.2, presenca: 95  },
  { pos: 3, nome: 'João Pedro Silva',   turma: 'TIG Avançado',       nota: 8.8, presenca: 98  },
]

const MAIS_MELHORADOS = [
  { nome: 'Eduardo Lima',    turma: 'MIG/MAG Industrial', melhora: '+1.8 pts', de: 6.0, para: 7.8 },
  { nome: 'Gabriel Rocha',   turma: 'Eletrodo Revestido', melhora: '+1.5 pts', de: 6.5, para: 8.0 },
  { nome: 'Igor Nascimento',  turma: 'Eletrodo Revestido', melhora: '+1.2 pts', de: 5.6, para: 6.8 },
]

const RANKING_TURMAS = [
  { nome: 'MIG/MAG Industrial', presenca: 92, notaMedia: 7.9, aprovacao: 90 },
  { nome: 'TIG Avançado',       presenca: 87, notaMedia: 8.2, aprovacao: 91 },
  { nome: 'Eletrodo Revestido', presenca: 75, notaMedia: 7.1, aprovacao: 87 },
]

const medalColors = ['#F59E0B', '#94A3B8', '#CD7F32']

function ScoreBar({ value, max = 10, color }: { value: number; max?: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-[var(--color-surface-elevated)]">
        <div className="h-full rounded-full" style={{ width: `${(value / max) * 100}%`, background: color }} />
      </div>
      <span className="text-xs font-bold w-8 text-right" style={{ color }}>{value}</span>
    </div>
  )
}

export function RelatoriosDesempenhoPage() {
  const totalAlunos = 30
  const mediaGeral  = 7.8
  const taxaAprov   = 89

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Desempenho Geral</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Visão consolidada do desempenho de todas as turmas</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total de alunos',   value: totalAlunos, icon: Users,     color: COLOR      },
          { label: 'Nota média geral',  value: mediaGeral,  icon: Star,      color: '#F59E0B'  },
          { label: 'Taxa de aprovação', value: `${taxaAprov}%`, icon: Award, color: '#10B981'  },
        ].map(s => {
          const Icon = s.icon
          return (
            <Card key={s.label}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: s.color + '15' }}>
                  <Icon size={18} style={{ color: s.color }} />
                </div>
                <div>
                  <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{s.label}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Melhores alunos */}
        <Card title="Melhores Alunos">
          <div className="space-y-3 mt-1">
            {MELHORES_ALUNOS.map(a => (
              <div key={a.nome} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-black text-sm"
                  style={{ background: medalColors[a.pos - 1] + '20', color: medalColors[a.pos - 1] }}>
                  {a.pos}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-text)] truncate">{a.nome}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{a.turma}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-black" style={{ color: medalColors[a.pos - 1] }}>{a.nota}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{a.presenca}% presença</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Mais melhorados */}
        <Card title="Mais Melhorados">
          <div className="space-y-3 mt-1">
            {MAIS_MELHORADOS.map(a => (
              <div key={a.nome} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: '#10B98115' }}>
                  <TrendingUp size={18} style={{ color: '#10B981' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-text)] truncate">{a.nome}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{a.turma}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-black text-sm" style={{ color: '#10B981' }}>{a.melhora}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{a.de} → {a.para}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Ranking de turmas */}
      <Card title="Ranking de Turmas">
        <div className="space-y-4 mt-2">
          {RANKING_TURMAS.map((t, i) => (
            <div key={t.nome}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                  style={{ background: medalColors[i] + '20', color: medalColors[i] }}>
                  {i + 1}
                </div>
                <h4 className="font-semibold text-[var(--color-text)]">{t.nome}</h4>
                {i === 0 && (
                  <Trophy size={14} style={{ color: '#F59E0B' }} />
                )}
              </div>
              <div className="pl-10 grid grid-cols-3 gap-3">
                <div>
                  <p className="text-xs text-[var(--color-text-muted)] mb-1">Presença</p>
                  <ScoreBar value={t.presenca} max={100} color={t.presenca >= 85 ? '#10B981' : '#F59E0B'} />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)] mb-1">Nota média</p>
                  <ScoreBar value={t.notaMedia} max={10} color={COLOR} />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)] mb-1">Aprovação</p>
                  <ScoreBar value={t.aprovacao} max={100} color="#3B82F6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
