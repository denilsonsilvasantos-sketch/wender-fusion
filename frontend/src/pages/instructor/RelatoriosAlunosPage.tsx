import { useState } from 'react'
import { BarChart2, Search, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, Input } from '@/components/ui'

const COLOR = '#8B5CF6'

interface AlunoRelatorio {
  id: number; nome: string; matricula: string; turma: string
  presenca: number; notaMedia: number; avaliacoes: number
  tendencia: 'up' | 'down' | 'stable'
}

const ALUNOS: AlunoRelatorio[] = [
  { id:  1, nome: 'Alexandre Ferreira', matricula: 'WF-2025-001', turma: 'TIG Avançado',      presenca: 95, notaMedia: 9.2, avaliacoes: 3, tendencia: 'up'     },
  { id:  2, nome: 'Bruno Carvalho',     matricula: 'WF-2025-002', turma: 'TIG Avançado',      presenca: 82, notaMedia: 7.0, avaliacoes: 3, tendencia: 'stable' },
  { id:  3, nome: 'Carlos Mendes',      matricula: 'WF-2025-003', turma: 'TIG Avançado',      presenca: 70, notaMedia: 4.5, avaliacoes: 3, tendencia: 'down'   },
  { id:  4, nome: 'Diego Santos',       matricula: 'WF-2025-004', turma: 'MIG/MAG Industrial', presenca: 100, notaMedia: 9.0, avaliacoes: 2, tendencia: 'up'   },
  { id:  5, nome: 'Eduardo Lima',       matricula: 'WF-2025-005', turma: 'MIG/MAG Industrial', presenca: 88, notaMedia: 7.8, avaliacoes: 2, tendencia: 'up'    },
  { id:  6, nome: 'Felipe Oliveira',    matricula: 'WF-2025-006', turma: 'MIG/MAG Industrial', presenca: 76, notaMedia: 6.2, avaliacoes: 2, tendencia: 'stable'},
  { id:  7, nome: 'Gabriel Rocha',      matricula: 'WF-2025-007', turma: 'Eletrodo Revestido', presenca: 91, notaMedia: 8.0, avaliacoes: 1, tendencia: 'up'    },
  { id:  8, nome: 'Henrique Costa',     matricula: 'WF-2025-008', turma: 'Eletrodo Revestido', presenca: 85, notaMedia: 7.5, avaliacoes: 1, tendencia: 'stable'},
  { id:  9, nome: 'Igor Nascimento',    matricula: 'WF-2025-009', turma: 'Eletrodo Revestido', presenca: 78, notaMedia: 6.8, avaliacoes: 1, tendencia: 'up'    },
  { id: 10, nome: 'João Pedro Silva',   matricula: 'WF-2025-010', turma: 'TIG Avançado',      presenca: 98, notaMedia: 8.8, avaliacoes: 3, tendencia: 'stable' },
]

const TENDENCIA_CFG = {
  up:     { icon: TrendingUp,   color: '#10B981', label: 'Melhorando'  },
  down:   { icon: TrendingDown, color: '#EF4444', label: 'Caindo'      },
  stable: { icon: Minus,        color: '#F59E0B', label: 'Estável'     },
}

function MiniBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-20 h-1.5 rounded-full bg-[var(--color-surface-elevated)]">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-xs" style={{ color }}>{value}%</span>
    </div>
  )
}

export function RelatoriosAlunosPage() {
  const [q, setQ]     = useState('')
  const [turma, setTurma] = useState('Todas')

  const turmas = ['Todas', ...Array.from(new Set(ALUNOS.map(a => a.turma)))]
  const filtered = ALUNOS.filter(a =>
    (turma === 'Todas' || a.turma === turma) &&
    a.nome.toLowerCase().includes(q.toLowerCase())
  )

  const mediaPresenca = Math.round(ALUNOS.reduce((s, a) => s + a.presenca, 0) / ALUNOS.length)
  const mediaNota = (ALUNOS.reduce((s, a) => s + a.notaMedia, 0) / ALUNOS.length).toFixed(1)
  const emRisco = ALUNOS.filter(a => a.presenca < 75 || a.notaMedia < 6).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Relatórios de Alunos</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Histórico e desempenho individual de cada aluno</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <p className="text-2xl font-black" style={{ color: COLOR }}>{mediaPresenca}%</p>
          <p className="text-xs text-[var(--color-text-muted)]">Presença média</p>
        </Card>
        <Card>
          <p className="text-2xl font-black" style={{ color: '#10B981' }}>{mediaNota}</p>
          <p className="text-xs text-[var(--color-text-muted)]">Nota média geral</p>
        </Card>
        <Card>
          <p className="text-2xl font-black" style={{ color: emRisco > 0 ? '#EF4444' : '#10B981' }}>{emRisco}</p>
          <p className="text-xs text-[var(--color-text-muted)]">Alunos em risco</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <Input
          className="flex-1 min-w-48"
          placeholder="Buscar aluno..."
          value={q}
          onChange={e => setQ(e.target.value)}
          leftIcon={<Search size={15} className="text-[var(--color-text-muted)]" />}
        />
        <div className="flex gap-2 flex-wrap">
          {turmas.map(t => (
            <button key={t} onClick={() => setTurma(t)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
              style={turma === t
                ? { background: COLOR, color: '#fff' }
                : { background: 'var(--color-surface-elevated)', color: 'var(--color-text-muted)' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {['Aluno', 'Turma', 'Presença', 'Nota média', 'Tendência'].map(h => (
                  <th key={h} className="text-left pb-3 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filtered.map(a => {
                const tend = TENDENCIA_CFG[a.tendencia]
                const TIcon = tend.icon
                const emRiscoAluno = a.presenca < 75 || a.notaMedia < 6
                return (
                  <tr key={a.id} className="hover:bg-[var(--color-surface-elevated)] transition-colors"
                    style={{ background: emRiscoAluno ? '#EF444408' : undefined }}>
                    <td className="py-3">
                      <p className="font-medium text-[var(--color-text)]">{a.nome}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{a.matricula}</p>
                    </td>
                    <td className="py-3 text-[var(--color-text-muted)]">{a.turma}</td>
                    <td className="py-3">
                      <MiniBar value={a.presenca} color={a.presenca >= 75 ? '#10B981' : '#EF4444'} />
                    </td>
                    <td className="py-3">
                      <span className="text-lg font-black"
                        style={{ color: a.notaMedia >= 6 ? COLOR : '#EF4444' }}>
                        {a.notaMedia}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: tend.color + '15', color: tend.color }}>
                        <TIcon size={12} />{tend.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10">
              <BarChart2 size={32} className="mx-auto mb-2 text-[var(--color-text-muted)]" />
              <p className="text-sm text-[var(--color-text-muted)]">Nenhum aluno encontrado.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
