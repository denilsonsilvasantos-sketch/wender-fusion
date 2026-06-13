import { useState, useRef } from 'react'
import {
  Flame, ChevronDown, ChevronUp, CheckCircle, FileText,
  Shield, Wrench, Star, Eye, Layers, BookOpen, Printer,
} from 'lucide-react'
import { Card } from '@/components/ui'
import { cn } from '@/lib/utils'

// ── Types ──────────────────────────────────────────────────────────────────────
type Processo = 'TIG' | 'MIG' | 'SMAW'
type Recomendacao = 'aprovado' | 'aprovado_ressalvas' | 'reprovado' | 'recomendado'

interface Criterio {
  id: string
  label: string
  descricao: string
  peso: number
  nota: number | null
  observacao: string
}

interface Grupo {
  id: string
  label: string
  icon: React.ElementType
  color: string
  criterios: Criterio[]
}

// ── Dados dos critérios ────────────────────────────────────────────────────────
function buildGrupos(): Grupo[] {
  return [
    {
      id: 'seguranca', label: 'Segurança e EPI', icon: Shield, color: '#EF4444',
      criterios: [
        { id: 'epi_uso', label: 'Uso correto do EPI', descricao: 'Máscara, luvas, avental, protetor auricular', peso: 10, nota: null, observacao: '' },
        { id: 'posto_org', label: 'Organização do posto', descricao: 'Área limpa e livre de riscos', peso: 5, nota: null, observacao: '' },
        { id: 'risco_id', label: 'Identificação de riscos', descricao: 'Consciência dos perigos envolvidos', peso: 5, nota: null, observacao: '' },
      ],
    },
    {
      id: 'preparacao', label: 'Preparação do Material', icon: Wrench, color: '#F59E0B',
      criterios: [
        { id: 'limpeza', label: 'Limpeza da peça', descricao: 'Remoção de óxidos, tinta, gordura', peso: 5, nota: null, observacao: '' },
        { id: 'junta', label: 'Preparação da junta', descricao: 'Abertura, alinhamento e chanfro corretos', peso: 5, nota: null, observacao: '' },
        { id: 'posicao', label: 'Posicionamento', descricao: 'Fixação e alinhamento do conjunto', peso: 5, nota: null, observacao: '' },
      ],
    },
    {
      id: 'execucao', label: 'Execução Técnica', icon: Flame, color: '#FF8C00',
      criterios: [
        { id: 'regulagem', label: 'Regulagem do equipamento', descricao: 'Corrente, tensão, gás e velocidade corretos', peso: 8, nota: null, observacao: '' },
        { id: 'tecnica', label: 'Técnica de soldagem', descricao: 'Postura, ângulo e movimento do eletrodo/tocha', peso: 8, nota: null, observacao: '' },
        { id: 'arco', label: 'Controle do arco / poça', descricao: 'Estabilidade e controle da poça de fusão', peso: 7, nota: null, observacao: '' },
        { id: 'velocidade', label: 'Velocidade e consistência', descricao: 'Uniformidade ao longo do cordão', peso: 7, nota: null, observacao: '' },
      ],
    },
    {
      id: 'qualidade', label: 'Qualidade do Cordão', icon: Eye, color: '#10B981',
      criterios: [
        { id: 'penetracao', label: 'Penetração adequada', descricao: 'Fusão completa sem falta ou excesso', peso: 7, nota: null, observacao: '' },
        { id: 'uniformidade', label: 'Uniformidade', descricao: 'Largura e reforço homogêneos', peso: 6, nota: null, observacao: '' },
        { id: 'acabamento', label: 'Acabamento visual', descricao: 'Ausência de irregularidades, respingos', peso: 6, nota: null, observacao: '' },
        { id: 'defeitos', label: 'Ausência de defeitos', descricao: 'Porosidade, trincas, mordedura', peso: 6, nota: null, observacao: '' },
      ],
    },
    {
      id: 'projeto', label: 'Leitura de Projeto', icon: BookOpen, color: '#6366F1',
      criterios: [
        { id: 'desenho', label: 'Interpretação do desenho', descricao: 'Lê e interpreta o projeto corretamente', peso: 5, nota: null, observacao: '' },
        { id: 'simbologia', label: 'Simbologia de soldagem', descricao: 'ABNT NBR, AWS — identificação dos símbolos', peso: 5, nota: null, observacao: '' },
      ],
    },
  ]
}

const TURMAS = [
  { id: '1', label: 'Turma A — TIG' },
  { id: '2', label: 'Turma B — MIG/MAG' },
  { id: '3', label: 'Turma C — Eletrodo' },
]

const ALUNOS = [
  { id: '1', nome: 'Alexandre Ferreira', matricula: 'WF-2025-001' },
  { id: '2', nome: 'Bruno Carvalho', matricula: 'WF-2025-002' },
  { id: '3', nome: 'Carlos Mendes', matricula: 'WF-2025-003' },
  { id: '4', nome: 'Diego Santos', matricula: 'WF-2025-004' },
  { id: '5', nome: 'Eduardo Lima', matricula: 'WF-2025-005' },
]

const REC_CONFIG: Record<Recomendacao, { label: string; color: string; desc: string }> = {
  aprovado:          { label: 'Aprovado',                  color: '#10B981', desc: 'Aluno atingiu os requisitos mínimos' },
  aprovado_ressalvas:{ label: 'Aprovado com Ressalvas',    color: '#F59E0B', desc: 'Aprovado, mas requer atenção em pontos específicos' },
  reprovado:         { label: 'Reprovado',                 color: '#EF4444', desc: 'Não atingiu os requisitos mínimos' },
  recomendado:       { label: 'Recomendado para Mercado',  color: '#6366F1', desc: 'Excelência técnica — indicado para vagas industriais' },
}

// ── Nota button ────────────────────────────────────────────────────────────────
function NotaButton({ n, current, onChange, color }: {
  n: number; current: number | null; onChange: (v: number) => void; color: string
}) {
  const active = current === n
  const low = n <= 4
  const med = n >= 5 && n <= 6
  const bg = active ? (low ? '#EF4444' : med ? '#F59E0B' : color) : 'transparent'
  const border = active ? bg : (low ? '#EF444440' : med ? '#F59E0B40' : color + '35')
  const text = active ? 'white' : low ? '#EF4444' : med ? '#F59E0B' : color
  return (
    <button
      onClick={() => onChange(n)}
      className="w-8 h-8 rounded-lg text-xs font-black transition-all border"
      style={{ background: bg, borderColor: border, color: text }}
    >
      {n}
    </button>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export function AvaliacaoPraticaPage() {
  const [turmaSel, setTurmaSel] = useState('')
  const [alunoSel, setAlunoSel] = useState('')
  const [processo, setProcesso] = useState<Processo>('TIG')
  const [data, setData] = useState(new Date().toISOString().split('T')[0])
  const [grupos, setGrupos] = useState<Grupo[]>(buildGrupos())
  const [openGrupos, setOpenGrupos] = useState(new Set(['seguranca', 'preparacao', 'execucao', 'qualidade', 'projeto']))
  const [feedback, setFeedback] = useState('')
  const [recomendacao, setRecomendacao] = useState<Recomendacao | null>(null)
  const [finalizado, setFinalizado] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  // ── Score calc ───────────────────────────────────────────────────────────────
  const allCriterios = grupos.flatMap(g => g.criterios)
  const totalPeso = allCriterios.reduce((s, c) => s + c.peso, 0)
  const notaFinal = allCriterios.every(c => c.nota !== null)
    ? allCriterios.reduce((s, c) => s + (c.nota! * c.peso), 0) / totalPeso
    : null

  function grupoMedia(grupo: Grupo) {
    const itens = grupo.criterios.filter(c => c.nota !== null)
    if (itens.length === 0) return null
    const pesoTotal = itens.reduce((s, c) => s + c.peso, 0)
    return itens.reduce((s, c) => s + (c.nota! * c.peso), 0) / pesoTotal
  }

  function setNota(grupoId: string, criterioId: string, nota: number) {
    setGrupos(prev => prev.map(g =>
      g.id !== grupoId ? g : {
        ...g,
        criterios: g.criterios.map(c =>
          c.id !== criterioId ? c : { ...c, nota }
        ),
      }
    ))
    setFinalizado(false)
  }

  function setObs(grupoId: string, criterioId: string, obs: string) {
    setGrupos(prev => prev.map(g =>
      g.id !== grupoId ? g : {
        ...g,
        criterios: g.criterios.map(c =>
          c.id !== criterioId ? c : { ...c, observacao: obs }
        ),
      }
    ))
  }

  function handleFinalizar() {
    if (!alunoSel || !turmaSel || !feedback || !recomendacao) return
    if (allCriterios.some(c => c.nota === null)) return
    setFinalizado(true)
  }

  function handleImprimir() {
    window.print()
  }

  const notaColor = notaFinal === null ? '#64748B' : notaFinal >= 9 ? '#6366F1' : notaFinal >= 7 ? '#10B981' : notaFinal >= 5 ? '#F59E0B' : '#EF4444'
  const aluno = ALUNOS.find(a => a.id === alunoSel)
  const turma = TURMAS.find(t => t.id === turmaSel)
  const pendentes = allCriterios.filter(c => c.nota === null).length

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#FF8C0018' }}>
              <Flame size={14} style={{ color: '#FF8C00' }} />
            </div>
            <h1 className="text-2xl font-black text-[var(--color-text)]">Avaliação Prática de Soldagem</h1>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">
            Avaliação técnica por critérios — gera relatório automático para certificados e banco de talentos
          </p>
        </div>
        {finalizado && (
          <button
            onClick={handleImprimir}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all flex-shrink-0"
            style={{ background: '#6366F1' }}
          >
            <Printer size={15} />
            Imprimir Relatório
          </button>
        )}
      </div>

      {/* Config */}
      <Card title="Identificação">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wide">Turma</label>
            <select value={turmaSel} onChange={e => setTurmaSel(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border bg-[var(--color-surface-elevated)] text-sm text-[var(--color-text)] border-[var(--color-border)] focus:outline-none">
              <option value="">— Selecione —</option>
              {TURMAS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wide">Aluno</label>
            <select value={alunoSel} onChange={e => setAlunoSel(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border bg-[var(--color-surface-elevated)] text-sm text-[var(--color-text)] border-[var(--color-border)] focus:outline-none">
              <option value="">— Selecione —</option>
              {ALUNOS.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wide">Processo</label>
            <div className="flex gap-2">
              {(['TIG', 'MIG', 'SMAW'] as Processo[]).map(p => (
                <button
                  key={p}
                  onClick={() => setProcesso(p)}
                  className="flex-1 py-2.5 rounded-lg text-xs font-bold border transition-all"
                  style={{
                    background: processo === p ? '#FF8C00' : 'transparent',
                    borderColor: processo === p ? '#FF8C00' : '#FF8C0040',
                    color: processo === p ? 'white' : '#FF8C00',
                  }}
                >{p}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wide">Data</label>
            <input type="date" value={data} onChange={e => setData(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border bg-[var(--color-surface-elevated)] text-sm text-[var(--color-text)] border-[var(--color-border)] focus:outline-none" />
          </div>
        </div>
      </Card>

      {alunoSel && turmaSel && (
        <>
          {/* Score summary top */}
          <div className="rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center gap-4"
            style={{ background: 'var(--color-surface)', borderColor: notaColor + '30' }}>
            <div className="flex items-center gap-4 flex-1">
              <div className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center border-2 flex-shrink-0"
                style={{ borderColor: notaColor, background: notaColor + '12' }}>
                <span className="text-3xl font-black" style={{ color: notaColor }}>
                  {notaFinal !== null ? notaFinal.toFixed(1) : '—'}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[var(--color-text-muted)]">Nota</span>
              </div>
              <div>
                <p className="font-black text-[var(--color-text)] text-lg">{aluno?.nome}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{turma?.label} · {processo} · {new Date(data + 'T12:00:00').toLocaleDateString('pt-BR')}</p>
                {pendentes > 0 && (
                  <p className="text-xs mt-1" style={{ color: '#F59E0B' }}>{pendentes} critério{pendentes > 1 ? 's' : ''} não avaliado{pendentes > 1 ? 's' : ''}</p>
                )}
                {pendentes === 0 && notaFinal !== null && (
                  <p className="text-xs mt-1 font-semibold" style={{ color: notaColor }}>
                    {notaFinal >= 9 ? '★ Desempenho excepcional' : notaFinal >= 7 ? '✓ Aprovado' : notaFinal >= 5 ? '⚠ Aprovado com ressalvas' : '✗ Reprovado'} — mínimo 7,0
                  </p>
                )}
              </div>
            </div>
            {/* Barra visual por grupo */}
            <div className="grid grid-cols-5 gap-2 sm:w-64 flex-shrink-0">
              {grupos.map(g => {
                const media = grupoMedia(g)
                const pct = media !== null ? (media / 10) * 100 : 0
                return (
                  <div key={g.id} className="flex flex-col items-center gap-1">
                    <div className="w-full h-16 rounded-lg overflow-hidden flex flex-col-reverse border" style={{ borderColor: g.color + '25' }}>
                      <div className="w-full transition-all duration-500" style={{ height: `${pct}%`, background: g.color }} />
                    </div>
                    <span className="text-[9px] text-center text-[var(--color-text-muted)] leading-tight">{g.label.split(' ')[0]}</span>
                    <span className="text-[10px] font-black" style={{ color: g.color }}>
                      {media !== null ? media.toFixed(1) : '—'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Grupos de critérios */}
          {grupos.map(grupo => (
            <div key={grupo.id} className="rounded-xl border overflow-hidden" style={{ borderColor: grupo.color + '25' }}>
              <button
                onClick={() => setOpenGrupos(prev => {
                  const n = new Set(prev); n.has(grupo.id) ? n.delete(grupo.id) : n.add(grupo.id); return n
                })}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[var(--color-surface-elevated)] transition-colors"
                style={{ background: grupo.color + '08' }}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: grupo.color + '20' }}>
                  <grupo.icon size={13} style={{ color: grupo.color }} />
                </div>
                <span className="flex-1 text-left font-bold text-sm text-[var(--color-text)]">{grupo.label}</span>
                <span className="text-xs font-black mr-2" style={{ color: grupo.color }}>
                  {grupoMedia(grupo) !== null ? grupoMedia(grupo)!.toFixed(1) : '—'}
                </span>
                <span className="text-[10px] text-[var(--color-text-muted)] mr-2">
                  {grupo.criterios.filter(c => c.nota !== null).length}/{grupo.criterios.length} avaliados
                </span>
                {openGrupos.has(grupo.id) ? <ChevronUp size={14} className="text-[var(--color-text-muted)]" /> : <ChevronDown size={14} className="text-[var(--color-text-muted)]" />}
              </button>

              {openGrupos.has(grupo.id) && (
                <div className="divide-y divide-[var(--color-border)]">
                  {grupo.criterios.map(criterio => (
                    <div key={criterio.id} className="px-5 py-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-sm font-semibold text-[var(--color-text)]">{criterio.label}</p>
                            <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold" style={{ background: grupo.color + '15', color: grupo.color }}>
                              peso {criterio.peso}%
                            </span>
                          </div>
                          <p className="text-xs text-[var(--color-text-muted)]">{criterio.descricao}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {[1,2,3,4,5,6,7,8,9,10].map(n => (
                            <NotaButton
                              key={n} n={n}
                              current={criterio.nota}
                              onChange={v => setNota(grupo.id, criterio.id, v)}
                              color={grupo.color}
                            />
                          ))}
                        </div>
                      </div>
                      {criterio.nota !== null && (
                        <div className="mt-2">
                          <input
                            type="text"
                            value={criterio.observacao}
                            onChange={e => setObs(grupo.id, criterio.id, e.target.value)}
                            placeholder="Observação (opcional)..."
                            className="w-full px-3 py-1.5 rounded-lg border text-xs bg-[var(--color-surface-elevated)] text-[var(--color-text)] border-[var(--color-border)] focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Feedback e recomendação */}
          <Card title="Parecer Técnico Final">
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-2 uppercase tracking-wide">
                  Feedback Técnico <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <textarea
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  rows={4}
                  placeholder={`Ex: Aluno demonstrou bom controle da poça de fusão em soldagem ${processo}. Apresentou dificuldade na regulagem inicial do equipamento, mas corrigiu com orientação. Recomendável praticar a uniformidade do cordão em posição vertical...`}
                  className="w-full px-4 py-3 rounded-xl border bg-[var(--color-surface-elevated)] text-sm text-[var(--color-text)] border-[var(--color-border)] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-2 uppercase tracking-wide">
                  Recomendação Final <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(Object.entries(REC_CONFIG) as [Recomendacao, typeof REC_CONFIG[Recomendacao]][]).map(([key, cfg]) => (
                    <button
                      key={key}
                      onClick={() => setRecomendacao(key)}
                      className={cn(
                        'flex items-start gap-3 p-3 rounded-xl border text-left transition-all',
                      )}
                      style={{
                        background: recomendacao === key ? cfg.color + '15' : 'transparent',
                        borderColor: recomendacao === key ? cfg.color : cfg.color + '30',
                      }}
                    >
                      <div className="w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0"
                        style={{ borderColor: cfg.color, background: recomendacao === key ? cfg.color : 'transparent' }} />
                      <div>
                        <p className="text-sm font-bold" style={{ color: recomendacao === key ? cfg.color : 'var(--color-text)' }}>{cfg.label}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{cfg.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Finalizar */}
          {!finalizado ? (
            <div className="flex items-center justify-between">
              <div className="text-xs text-[var(--color-text-muted)] space-y-0.5">
                {pendentes > 0 && <p style={{ color: '#F59E0B' }}>• {pendentes} critério(s) sem nota</p>}
                {!feedback && <p style={{ color: '#F59E0B' }}>• Feedback obrigatório</p>}
                {!recomendacao && <p style={{ color: '#F59E0B' }}>• Selecione a recomendação final</p>}
              </div>
              <button
                onClick={handleFinalizar}
                disabled={pendentes > 0 || !feedback || !recomendacao}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: '#FF8C00' }}
              >
                <CheckCircle size={16} />
                Finalizar e Gerar Relatório
              </button>
            </div>
          ) : (
            /* Relatório Técnico */
            <div ref={reportRef} className="rounded-2xl border-2 overflow-hidden" style={{ borderColor: '#FF8C0040' }}>
              <div className="px-8 py-6" style={{ background: '#FF8C0010', borderBottom: '1px solid #FF8C0025' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Flame size={18} style={{ color: '#FF8C00' }} />
                      <span className="font-black text-lg text-[var(--color-text)]">WELDER &amp; FUSION</span>
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)]">Escola Profissionalizante de Soldadores — Itajaí, SC</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#FF8C00' }}>Relatório Técnico</p>
                    <p className="text-xs text-[var(--color-text-muted)]">Avaliação Prática de Soldagem</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{new Date(data + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 space-y-6">
                {/* Cabeçalho aluno */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl" style={{ background: 'var(--color-surface-elevated)' }}>
                  {[
                    { label: 'Aluno', value: aluno?.nome },
                    { label: 'Matrícula', value: aluno?.matricula },
                    { label: 'Turma', value: turma?.label },
                    { label: 'Processo Avaliado', value: processo },
                  ].map(item => (
                    <div key={item.label}>
                      <p className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)] mb-0.5">{item.label}</p>
                      <p className="text-sm font-bold text-[var(--color-text)]">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Nota final destaque */}
                <div className="flex items-center gap-6 p-5 rounded-2xl border-2" style={{ borderColor: notaColor + '40', background: notaColor + '08' }}>
                  <div className="w-24 h-24 rounded-2xl flex flex-col items-center justify-center border-2 flex-shrink-0"
                    style={{ borderColor: notaColor, background: notaColor + '15' }}>
                    <span className="text-4xl font-black" style={{ color: notaColor }}>{notaFinal!.toFixed(1)}</span>
                    <span className="text-[9px] uppercase tracking-widest text-[var(--color-text-muted)]">Nota Final</span>
                  </div>
                  <div>
                    <p className="font-black text-xl" style={{ color: notaColor }}>
                      {recomendacao ? REC_CONFIG[recomendacao].label : ''}
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">
                      {recomendacao ? REC_CONFIG[recomendacao].desc : ''}
                    </p>
                  </div>
                </div>

                {/* Notas por grupo */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">Detalhamento por Categoria</p>
                  <div className="space-y-3">
                    {grupos.map(g => {
                      const media = grupoMedia(g)!
                      const pct = (media / 10) * 100
                      return (
                        <div key={g.id}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <g.icon size={13} style={{ color: g.color }} />
                              <span className="text-xs font-semibold text-[var(--color-text)]">{g.label}</span>
                            </div>
                            <span className="text-sm font-black" style={{ color: g.color }}>{media.toFixed(1)}</span>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden" style={{ background: g.color + '20' }}>
                            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: g.color }} />
                          </div>
                          <div className="mt-1 space-y-0.5">
                            {g.criterios.filter(c => c.observacao).map(c => (
                              <p key={c.id} className="text-[10px] text-[var(--color-text-muted)]">
                                • {c.label}: {c.observacao}
                              </p>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Parecer */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Parecer Técnico do Instrutor</p>
                  <div className="p-4 rounded-xl border italic text-sm text-[var(--color-text)]" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-elevated)' }}>
                    "{feedback}"
                  </div>
                </div>

                {/* Assinatura */}
                <div className="flex items-end justify-between pt-4 border-t border-[var(--color-border)]">
                  <div>
                    <div className="w-48 border-b border-[var(--color-text-muted)] mb-1" />
                    <p className="text-xs font-semibold text-[var(--color-text)]">Assinatura do Instrutor</p>
                    <p className="text-[10px] text-[var(--color-text-muted)]">Certificação FBTS N1</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText size={14} style={{ color: '#FF8C00' }} />
                    <span className="text-xs font-bold" style={{ color: '#FF8C00' }}>WF-APS-{Date.now().toString().slice(-6)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {(!alunoSel || !turmaSel) && (
        <div className="py-16 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#FF8C0018' }}>
            <Layers size={28} style={{ color: '#FF8C00' }} />
          </div>
          <p className="text-base font-bold text-[var(--color-text)]">Avaliação Técnica por Critérios</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Selecione turma e aluno para iniciar</p>
        </div>
      )}
    </div>
  )
}
