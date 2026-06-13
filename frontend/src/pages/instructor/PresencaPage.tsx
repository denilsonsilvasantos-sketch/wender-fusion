import { useState } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Clock, Save, Users, Calendar } from 'lucide-react'
import { Card } from '@/components/ui'

const COLOR = '#10B981'

type Status = 'presente' | 'falta' | 'justificada' | 'atraso' | null

interface Aluno { id: number; nome: string; matricula: string; status: Status }

const TURMAS = [
  { id: 1, label: 'Turma A — TIG | Manhã' },
  { id: 2, label: 'Turma B — MIG/MAG | Tarde' },
  { id: 3, label: 'Turma C — Eletrodo | Manhã' },
]

const MOCK_ALUNOS: Aluno[] = [
  { id: 1, nome: 'Alexandre Ferreira', matricula: 'WF-2025-001', status: null },
  { id: 2, nome: 'Bruno Carvalho', matricula: 'WF-2025-002', status: null },
  { id: 3, nome: 'Carlos Mendes', matricula: 'WF-2025-003', status: null },
  { id: 4, nome: 'Diego Santos', matricula: 'WF-2025-004', status: null },
  { id: 5, nome: 'Eduardo Lima', matricula: 'WF-2025-005', status: null },
  { id: 6, nome: 'Felipe Oliveira', matricula: 'WF-2025-006', status: null },
  { id: 7, nome: 'Gabriel Rocha', matricula: 'WF-2025-007', status: null },
  { id: 8, nome: 'Henrique Costa', matricula: 'WF-2025-008', status: null },
  { id: 9, nome: 'Igor Nascimento', matricula: 'WF-2025-009', status: null },
  { id: 10, nome: 'João Pedro Silva', matricula: 'WF-2025-010', status: null },
  { id: 11, nome: 'Lucas Barbosa', matricula: 'WF-2025-011', status: null },
  { id: 12, nome: 'Mateus Alves', matricula: 'WF-2025-012', status: null },
]

const STATUS_CONFIG = {
  presente:   { label: 'Presente',         color: '#10B981', icon: CheckCircle  },
  falta:      { label: 'Falta',            color: '#EF4444', icon: XCircle      },
  justificada:{ label: 'Falta Justificada',color: '#F59E0B', icon: AlertTriangle },
  atraso:     { label: 'Atraso',           color: '#6366F1', icon: Clock        },
}

export function PresencaPage() {
  const [turmaSel, setTurmaSel] = useState('')
  const [dataSel, setDataSel] = useState(new Date().toISOString().split('T')[0])
  const [alunos, setAlunos] = useState<Aluno[]>(MOCK_ALUNOS)
  const [saved, setSaved] = useState(false)

  const total = alunos.length
  const presentes = alunos.filter(a => a.status === 'presente').length
  const faltas = alunos.filter(a => a.status === 'falta').length
  const pendentes = alunos.filter(a => a.status === null).length

  function setStatus(id: number, status: Status) {
    setSaved(false)
    setAlunos(prev => prev.map(a => a.id === id ? { ...a, status } : a))
  }

  function marcarTodos(status: Status) {
    setSaved(false)
    setAlunos(prev => prev.map(a => ({ ...a, status })))
  }

  function handleSave() {
    if (pendentes > 0) return
    setSaved(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Presença</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Registre a chamada da aula</p>
      </div>

      {/* Seleção de turma e data */}
      <Card title="Configurar Chamada">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wide">
              Turma
            </label>
            <select
              value={turmaSel}
              onChange={e => setTurmaSel(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border bg-[var(--color-surface-elevated)] text-sm text-[var(--color-text)] border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
            >
              <option value="">— Selecione —</option>
              {TURMAS.map(t => <option key={t.id} value={String(t.id)}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wide">
              Data
            </label>
            <input
              type="date"
              value={dataSel}
              onChange={e => setDataSel(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border bg-[var(--color-surface-elevated)] text-sm text-[var(--color-text)] border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>
        </div>
      </Card>

      {turmaSel && (
        <>
          {/* Resumo */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Total', value: total, color: '#64748B' },
              { label: 'Presentes', value: presentes, color: COLOR },
              { label: 'Faltas', value: faltas, color: '#EF4444' },
              { label: 'Pendentes', value: pendentes, color: '#F59E0B' },
            ].map(s => (
              <div key={s.label} className="rounded-xl border p-3 text-center" style={{ borderColor: s.color + '25', background: s.color + '08' }}>
                <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5 uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Ações rápidas */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[var(--color-text-muted)] mr-1">Marcar todos como:</span>
            {(Object.entries(STATUS_CONFIG) as [Status, typeof STATUS_CONFIG[keyof typeof STATUS_CONFIG]][]).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => marcarTodos(key)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border"
                style={{ color: cfg.color, borderColor: cfg.color + '30', background: cfg.color + '10' }}
              >
                <cfg.icon size={12} />
                {cfg.label}
              </button>
            ))}
          </div>

          {/* Lista de alunos */}
          <Card title={`Alunos — ${TURMAS.find(t => String(t.id) === turmaSel)?.label}`} noPadding>
            <div className="divide-y divide-[var(--color-border)]">
              {alunos.map(aluno => (
                <div key={aluno.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black text-white"
                    style={{ background: COLOR + '80' }}>
                    {aluno.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-text)]">{aluno.nome}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{aluno.matricula}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {(Object.entries(STATUS_CONFIG) as [Status, typeof STATUS_CONFIG[keyof typeof STATUS_CONFIG]][]).map(([key, cfg]) => (
                      <button
                        key={key}
                        onClick={() => setStatus(aluno.id, key)}
                        title={cfg.label}
                        className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all"
                        style={{
                          background: aluno.status === key ? cfg.color : 'transparent',
                          borderColor: aluno.status === key ? cfg.color : cfg.color + '30',
                          color: aluno.status === key ? 'white' : cfg.color,
                        }}
                      >
                        <cfg.icon size={14} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Salvar */}
          <div className="flex items-center justify-between">
            {pendentes > 0 && (
              <p className="text-xs text-[var(--color-text-muted)]">
                <span style={{ color: '#F59E0B' }}>{pendentes} aluno{pendentes > 1 ? 's' : ''}</span> ainda sem status
              </p>
            )}
            {saved && (
              <p className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: COLOR }}>
                <CheckCircle size={14} /> Chamada salva com sucesso
              </p>
            )}
            <div className="ml-auto">
              <button
                onClick={handleSave}
                disabled={pendentes > 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: COLOR }}
              >
                <Save size={15} />
                {saved ? 'Chamada Salva' : 'Salvar Chamada'}
              </button>
            </div>
          </div>
        </>
      )}

      {!turmaSel && (
        <div className="py-16 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: COLOR + '18' }}>
            <Users size={28} style={{ color: COLOR }} />
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">Selecione a turma e a data para iniciar a chamada</p>
        </div>
      )}
    </div>
  )
}
