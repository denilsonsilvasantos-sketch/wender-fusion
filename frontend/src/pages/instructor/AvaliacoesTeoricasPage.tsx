import { useState } from 'react'
import { FileText, Plus, CheckCircle, XCircle, Clock, Search } from 'lucide-react'
import { Card, Badge, Button, Input } from '@/components/ui'

const COLOR = '#10B981'

interface Avaliacao {
  id: number; aluno: string; turma: string; nota: number | null
  data: string; status: 'aprovado' | 'reprovado' | 'pendente'
}

const MOCK: Avaliacao[] = [
  { id:  1, aluno: 'Alexandre Ferreira', turma: 'TIG Avançado',      nota: 8.5, data: '2026-06-10', status: 'aprovado'  },
  { id:  2, aluno: 'Bruno Carvalho',     turma: 'TIG Avançado',      nota: 6.0, data: '2026-06-10', status: 'aprovado'  },
  { id:  3, aluno: 'Carlos Mendes',      turma: 'TIG Avançado',      nota: 4.5, data: '2026-06-10', status: 'reprovado' },
  { id:  4, aluno: 'Diego Santos',       turma: 'MIG/MAG Industrial', nota: 9.0, data: '2026-06-11', status: 'aprovado'  },
  { id:  5, aluno: 'Eduardo Lima',       turma: 'MIG/MAG Industrial', nota: 7.5, data: '2026-06-11', status: 'aprovado'  },
  { id:  6, aluno: 'Felipe Oliveira',    turma: 'MIG/MAG Industrial', nota: 5.5, data: '2026-06-11', status: 'aprovado'  },
  { id:  7, aluno: 'Gabriel Rocha',      turma: 'Eletrodo Revestido', nota: null, data: '2026-06-18', status: 'pendente' },
  { id:  8, aluno: 'Henrique Costa',     turma: 'Eletrodo Revestido', nota: null, data: '2026-06-18', status: 'pendente' },
  { id:  9, aluno: 'Igor Nascimento',    turma: 'Eletrodo Revestido', nota: null, data: '2026-06-18', status: 'pendente' },
  { id: 10, aluno: 'João Pedro Silva',   turma: 'TIG Avançado',      nota: 9.5, data: '2026-06-10', status: 'aprovado'  },
]

const STATUS_CFG = {
  aprovado:  { label: 'Aprovado',  icon: CheckCircle, color: COLOR      },
  reprovado: { label: 'Reprovado', icon: XCircle,     color: '#EF4444'  },
  pendente:  { label: 'Pendente',  icon: Clock,       color: '#F59E0B'  },
}

export function AvaliacoesTeoricasPage() {
  const [q, setQ] = useState('')

  const filtered = MOCK.filter(a =>
    a.aluno.toLowerCase().includes(q.toLowerCase()) ||
    a.turma.toLowerCase().includes(q.toLowerCase())
  )

  const aprovados = MOCK.filter(a => a.status === 'aprovado').length
  const reprovados = MOCK.filter(a => a.status === 'reprovado').length
  const pendentes = MOCK.filter(a => a.status === 'pendente').length
  const notasValidas = MOCK.filter(a => a.nota !== null).map(a => a.nota as number)
  const media = notasValidas.length
    ? (notasValidas.reduce((s, n) => s + n, 0) / notasValidas.length).toFixed(1)
    : '—'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Avaliações Teóricas</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Aplicar e corrigir avaliações escritas das turmas</p>
        </div>
        <Button leftIcon={<Plus size={15} />} style={{ background: COLOR }}>Nova avaliação</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Nota média',  value: media,      color: COLOR      },
          { label: 'Aprovados',   value: aprovados,  color: COLOR      },
          { label: 'Reprovados',  value: reprovados, color: '#EF4444'  },
          { label: 'Pendentes',   value: pendentes,  color: '#F59E0B'  },
        ].map(s => (
          <Card key={s.label}>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Input
        placeholder="Buscar aluno ou turma..."
        value={q}
        onChange={e => setQ(e.target.value)}
        leftIcon={<Search size={15} className="text-[var(--color-text-muted)]" />}
      />

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {['Aluno', 'Turma', 'Nota', 'Data', 'Status'].map(h => (
                  <th key={h} className="text-left pb-3 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filtered.map(a => {
                const cfg = STATUS_CFG[a.status]
                const Icon = cfg.icon
                return (
                  <tr key={a.id} className="hover:bg-[var(--color-surface-elevated)] transition-colors">
                    <td className="py-3 font-medium text-[var(--color-text)]">{a.aluno}</td>
                    <td className="py-3 text-[var(--color-text-muted)]">{a.turma}</td>
                    <td className="py-3">
                      {a.nota !== null
                        ? <span className="font-black text-lg" style={{ color: a.nota >= 6 ? COLOR : '#EF4444' }}>{a.nota}</span>
                        : <span className="text-[var(--color-text-muted)]">—</span>}
                    </td>
                    <td className="py-3 text-[var(--color-text-muted)]">
                      {new Date(a.data + 'T12:00').toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: cfg.color + '15', color: cfg.color }}>
                        <Icon size={12} />
                        {cfg.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10">
              <FileText size={32} className="mx-auto mb-2 text-[var(--color-text-muted)]" />
              <p className="text-sm text-[var(--color-text-muted)]">Nenhuma avaliação encontrada.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
