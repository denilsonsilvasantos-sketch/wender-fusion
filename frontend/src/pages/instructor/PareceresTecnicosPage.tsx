import { useState } from 'react'
import { MessageSquare, Plus, FileText, Send, CheckCircle, Search } from 'lucide-react'
import { Card, Button, Input } from '@/components/ui'

const COLOR = '#6366F1'

const TIPOS = ['Aptidão técnica', 'Qualificação de processo', 'Avaliação de desempenho', 'Laudo de competência']

interface Parecer {
  id: number; aluno: string; tipo: string
  status: 'rascunho' | 'emitido' | 'entregue'
  data: string; validade: string; numero: string
}

const MOCK: Parecer[] = [
  { id: 1, aluno: 'Alexandre Ferreira', tipo: 'Aptidão técnica',         status: 'entregue', data: '2026-05-15', validade: '2027-05-15', numero: 'PT-2026-001' },
  { id: 2, aluno: 'Diego Santos',       tipo: 'Qualificação de processo', status: 'emitido',  data: '2026-06-08', validade: '2027-06-08', numero: 'PT-2026-002' },
  { id: 3, aluno: 'João Pedro Silva',   tipo: 'Aptidão técnica',         status: 'emitido',  data: '2026-06-10', validade: '2027-06-10', numero: 'PT-2026-003' },
  { id: 4, aluno: 'Eduardo Lima',       tipo: 'Avaliação de desempenho', status: 'rascunho', data: '2026-06-14', validade: '—',          numero: '—'           },
  { id: 5, aluno: 'Bruno Carvalho',     tipo: 'Laudo de competência',     status: 'rascunho', data: '2026-06-15', validade: '—',          numero: '—'           },
]

const STATUS_CFG = {
  rascunho: { label: 'Rascunho',  color: '#94A3B8', icon: FileText   },
  emitido:  { label: 'Emitido',   color: '#F59E0B', icon: Send       },
  entregue: { label: 'Entregue',  color: '#10B981', icon: CheckCircle },
}

export function PareceresTecnicosPage() {
  const [q, setQ]         = useState('')
  const [tipo, setTipo]   = useState('Todos')
  const [list, setList]   = useState<Parecer[]>(MOCK)

  const filtered = list.filter(p =>
    (tipo === 'Todos' || p.tipo === tipo) &&
    p.aluno.toLowerCase().includes(q.toLowerCase())
  )

  function emitir(id: number) {
    setList(prev => prev.map(p => p.id === id
      ? { ...p, status: 'emitido', numero: `PT-2026-00${id}`, validade: '2027-06-15' }
      : p))
  }

  const rascunhos = list.filter(p => p.status === 'rascunho').length
  const emitidos  = list.filter(p => p.status === 'emitido').length
  const entregues = list.filter(p => p.status === 'entregue').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Pareceres Técnicos</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Emitir pareceres técnicos individuais para uso externo</p>
        </div>
        <Button leftIcon={<Plus size={15} />} style={{ background: COLOR }}>Novo parecer</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Rascunhos', value: rascunhos, color: '#94A3B8' },
          { label: 'Emitidos',  value: emitidos,  color: '#F59E0B' },
          { label: 'Entregues', value: entregues, color: '#10B981' },
        ].map(s => (
          <Card key={s.label}>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{s.label}</p>
          </Card>
        ))}
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
          {['Todos', ...TIPOS].map(t => (
            <button key={t} onClick={() => setTipo(t)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
              style={tipo === t
                ? { background: COLOR, color: '#fff' }
                : { background: 'var(--color-surface-elevated)', color: 'var(--color-text-muted)' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {['Aluno', 'Tipo', 'Nº', 'Data', 'Validade', 'Status', ''].map(h => (
                  <th key={h} className="text-left pb-3 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filtered.map(p => {
                const cfg = STATUS_CFG[p.status]
                const Icon = cfg.icon
                return (
                  <tr key={p.id} className="hover:bg-[var(--color-surface-elevated)] transition-colors">
                    <td className="py-3 font-medium text-[var(--color-text)]">{p.aluno}</td>
                    <td className="py-3 text-[var(--color-text-muted)]">{p.tipo}</td>
                    <td className="py-3 font-mono text-xs text-[var(--color-text-muted)]">{p.numero}</td>
                    <td className="py-3 text-[var(--color-text-muted)]">
                      {new Date(p.data + 'T12:00').toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 text-[var(--color-text-muted)]">{p.validade !== '—' ? new Date(p.validade + 'T12:00').toLocaleDateString('pt-BR') : '—'}</td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: cfg.color + '15', color: cfg.color }}>
                        <Icon size={12} />{cfg.label}
                      </span>
                    </td>
                    <td className="py-3">
                      {p.status === 'rascunho' && (
                        <Button size="sm" leftIcon={<Send size={12} />} style={{ background: COLOR }} onClick={() => emitir(p.id)}>
                          Emitir
                        </Button>
                      )}
                      {p.status !== 'rascunho' && (
                        <Button size="sm" variant="outline" leftIcon={<MessageSquare size={12} />}>Ver</Button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
