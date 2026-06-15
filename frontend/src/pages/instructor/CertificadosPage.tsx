import { useState } from 'react'
import { Award, CheckCircle, XCircle, Clock, Download, Search } from 'lucide-react'
import { Card, Button, Input } from '@/components/ui'

const COLOR = '#8B5CF6'

interface Certificado {
  id: number; aluno: string; turma: string; matricula: string
  conclusao: string; presenca: number; notaFinal: number
  status: 'pendente' | 'aprovado' | 'rejeitado'
}

const MOCK: Certificado[] = [
  { id:  1, aluno: 'Alexandre Ferreira', turma: 'TIG Avançado',      matricula: 'WF-2025-001', conclusao: '2026-06-10', presenca: 95, notaFinal: 8.8, status: 'aprovado'  },
  { id:  2, aluno: 'Bruno Carvalho',     turma: 'TIG Avançado',      matricula: 'WF-2025-002', conclusao: '2026-06-10', presenca: 82, notaFinal: 7.0, status: 'aprovado'  },
  { id:  3, aluno: 'Carlos Mendes',      turma: 'TIG Avançado',      matricula: 'WF-2025-003', conclusao: '2026-06-10', presenca: 70, notaFinal: 4.5, status: 'rejeitado' },
  { id:  4, aluno: 'Diego Santos',       turma: 'MIG/MAG Industrial', matricula: 'WF-2025-004', conclusao: '2026-06-12', presenca: 100, notaFinal: 9.5, status: 'aprovado' },
  { id:  5, aluno: 'Eduardo Lima',       turma: 'MIG/MAG Industrial', matricula: 'WF-2025-005', conclusao: '2026-06-12', presenca: 88, notaFinal: 7.8, status: 'aprovado'  },
  { id:  6, aluno: 'Felipe Oliveira',    turma: 'MIG/MAG Industrial', matricula: 'WF-2025-006', conclusao: '2026-06-12', presenca: 76, notaFinal: 6.2, status: 'pendente'  },
  { id:  7, aluno: 'Gabriel Rocha',      turma: 'Eletrodo Revestido', matricula: 'WF-2025-007', conclusao: '2026-06-20', presenca: 91, notaFinal: 8.0, status: 'pendente'  },
  { id:  8, aluno: 'Henrique Costa',     turma: 'Eletrodo Revestido', matricula: 'WF-2025-008', conclusao: '2026-06-20', presenca: 85, notaFinal: 7.5, status: 'pendente'  },
]

const STATUS_CFG = {
  aprovado:  { label: 'Aprovado',   icon: CheckCircle, color: COLOR      },
  rejeitado: { label: 'Rejeitado',  icon: XCircle,     color: '#EF4444'  },
  pendente:  { label: 'Pendente',   icon: Clock,       color: '#F59E0B'  },
}

export function CertificadosPage() {
  const [q, setQ] = useState('')
  const [list, setList] = useState<Certificado[]>(MOCK)

  const filtered = list.filter(c =>
    c.aluno.toLowerCase().includes(q.toLowerCase()) ||
    c.turma.toLowerCase().includes(q.toLowerCase())
  )

  function approve(id: number) {
    setList(prev => prev.map(c => c.id === id ? { ...c, status: 'aprovado' } : c))
  }
  function reject(id: number) {
    setList(prev => prev.map(c => c.id === id ? { ...c, status: 'rejeitado' } : c))
  }

  const aprovados  = list.filter(c => c.status === 'aprovado').length
  const pendentes  = list.filter(c => c.status === 'pendente').length
  const rejeitados = list.filter(c => c.status === 'rejeitado').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Certificados</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Aprovar certificados para alunos que concluíram o curso</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Aprovados',  value: aprovados,  color: COLOR,     icon: CheckCircle },
          { label: 'Pendentes',  value: pendentes,  color: '#F59E0B', icon: Clock       },
          { label: 'Rejeitados', value: rejeitados, color: '#EF4444', icon: XCircle     },
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

      {/* Search */}
      <Input
        placeholder="Buscar aluno ou turma..."
        value={q}
        onChange={e => setQ(e.target.value)}
        leftIcon={<Search size={15} className="text-[var(--color-text-muted)]" />}
      />

      {/* Cards */}
      <div className="space-y-3">
        {filtered.map(c => {
          const cfg = STATUS_CFG[c.status]
          const Icon = cfg.icon
          const atingiu = c.presenca >= 75 && c.notaFinal >= 6
          return (
            <Card key={c.id}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: COLOR + '15' }}>
                  <Award size={20} style={{ color: COLOR }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <h3 className="font-bold text-[var(--color-text)]">{c.aluno}</h3>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: cfg.color + '15', color: cfg.color }}>
                      <Icon size={11} />{cfg.label}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mb-1">
                    {c.turma} · {c.matricula} · Conclusão: {new Date(c.conclusao + 'T12:00').toLocaleDateString('pt-BR')}
                  </p>
                  <div className="flex gap-4 text-xs">
                    <span>
                      Presença: <strong style={{ color: c.presenca >= 75 ? COLOR : '#EF4444' }}>{c.presenca}%</strong>
                    </span>
                    <span>
                      Nota final: <strong style={{ color: c.notaFinal >= 6 ? COLOR : '#EF4444' }}>{c.notaFinal}</strong>
                    </span>
                    {!atingiu && (
                      <span className="text-[#EF4444]">Não atinge critérios mínimos</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {c.status === 'aprovado' && (
                    <Button size="sm" leftIcon={<Download size={13} />} style={{ background: COLOR }}>Emitir</Button>
                  )}
                  {c.status === 'pendente' && (
                    <>
                      <Button size="sm" leftIcon={<CheckCircle size={13} />} style={{ background: COLOR }} onClick={() => approve(c.id)}>Aprovar</Button>
                      <Button size="sm" variant="outline" leftIcon={<XCircle size={13} />} onClick={() => reject(c.id)}>Rejeitar</Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
