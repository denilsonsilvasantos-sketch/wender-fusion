import { useState } from 'react'
import { Briefcase, Plus, Send, FileText, Clock, CheckCircle, Search } from 'lucide-react'
import { Card, Button, Input } from '@/components/ui'

const COLOR = '#6366F1'

interface Recomendacao {
  id: number; aluno: string; empresa: string; cargo: string
  status: 'rascunho' | 'enviada' | 'aceita'
  data: string; texto: string
}

const MOCK: Recomendacao[] = [
  {
    id: 1, aluno: 'Alexandre Ferreira', empresa: 'Petrobras',         cargo: 'Soldador TIG Sênior',
    status: 'aceita',    data: '2026-05-20',
    texto: 'Alexandre demonstrou excelência técnica em soldagem TIG, com domínio de passe de raiz em aço inox e alumínio.',
  },
  {
    id: 2, aluno: 'Diego Santos',       empresa: 'Embraer',           cargo: 'Soldador MIG/MAG',
    status: 'enviada',   data: '2026-06-05',
    texto: 'Diego se destacou com produtividade acima da média e qualidade consistente em juntas estruturais.',
  },
  {
    id: 3, aluno: 'Eduardo Lima',       empresa: 'Vallourec',         cargo: 'Operador de Solda Industrial',
    status: 'enviada',   data: '2026-06-10',
    texto: 'Eduardo apresenta aptidão para automação industrial e controle de robôs de soldagem.',
  },
  {
    id: 4, aluno: 'João Pedro Silva',   empresa: 'Braskem',           cargo: 'Inspetor de Solda Jr.',
    status: 'rascunho',  data: '2026-06-14',
    texto: '',
  },
  {
    id: 5, aluno: 'Bruno Carvalho',     empresa: 'Confab Industrial', cargo: 'Soldador Pleno',
    status: 'rascunho',  data: '2026-06-15',
    texto: '',
  },
]

const STATUS_CFG = {
  rascunho: { label: 'Rascunho',  icon: FileText,    color: '#94A3B8' },
  enviada:  { label: 'Enviada',   icon: Send,        color: '#F59E0B' },
  aceita:   { label: 'Aceita',    icon: CheckCircle, color: '#10B981' },
}

export function RecomendacoesPage() {
  const [q, setQ] = useState('')
  const filtered = MOCK.filter(r =>
    r.aluno.toLowerCase().includes(q.toLowerCase()) ||
    r.empresa.toLowerCase().includes(q.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Recomendações</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Cartas de recomendação para alunos em processos seletivos</p>
        </div>
        <Button leftIcon={<Plus size={15} />} style={{ background: COLOR }}>Nova recomendação</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(STATUS_CFG).map(([k, v]) => {
          const count = MOCK.filter(r => r.status === k).length
          const Icon = v.icon
          return (
            <Card key={k}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: v.color + '15' }}>
                  <Icon size={18} style={{ color: v.color }} />
                </div>
                <div>
                  <p className="text-2xl font-black" style={{ color: v.color }}>{count}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{v.label}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Input
        placeholder="Buscar aluno ou empresa..."
        value={q}
        onChange={e => setQ(e.target.value)}
        leftIcon={<Search size={15} className="text-[var(--color-text-muted)]" />}
      />

      <div className="space-y-3">
        {filtered.map(r => {
          const cfg = STATUS_CFG[r.status]
          const Icon = cfg.icon
          return (
            <Card key={r.id}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: COLOR + '15' }}>
                  <Briefcase size={18} style={{ color: COLOR }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <h3 className="font-bold text-[var(--color-text)]">{r.aluno}</h3>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: cfg.color + '15', color: cfg.color }}>
                      <Icon size={11} />{cfg.label}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mb-2">
                    {r.empresa} · {r.cargo} · {new Date(r.data + 'T12:00').toLocaleDateString('pt-BR')}
                  </p>
                  {r.texto && (
                    <p className="text-xs text-[var(--color-text-muted)] italic line-clamp-2">{r.texto}</p>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {r.status === 'rascunho' && (
                    <>
                      <Button size="sm" variant="outline" leftIcon={<FileText size={13} />}>Editar</Button>
                      <Button size="sm" leftIcon={<Send size={13} />} style={{ background: COLOR }}>Enviar</Button>
                    </>
                  )}
                  {r.status !== 'rascunho' && (
                    <Button size="sm" variant="outline" leftIcon={<Clock size={13} />}>Ver histórico</Button>
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
