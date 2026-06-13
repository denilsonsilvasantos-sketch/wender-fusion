import { useState } from 'react'
import { Card } from '@/components/ui'
import { ClipboardList, Users, Package, Clock, Camera, ChevronDown, ChevronUp } from 'lucide-react'

const COLOR = '#3B82F6'

type StatusOS = 'Aberta' | 'Planejamento' | 'Execução' | 'Pausada' | 'Finalizada' | 'Faturada'

const STATUS_COLORS: Record<StatusOS, string> = {
  'Aberta':      '#64748B',
  'Planejamento':'#F59E0B',
  'Execução':    '#3B82F6',
  'Pausada':     '#EF4444',
  'Finalizada':  '#10B981',
  'Faturada':    '#8B5CF6',
}

interface Membro { nome: string; funcao: string }
interface Material { item: string; qtd: string; unit: string }
interface RegistroHora { data: string; horas: number; desc: string }
interface Evidencia { tipo: 'antes' | 'durante' | 'depois'; desc: string; data: string }

interface OrdemServico {
  id: string
  descricao: string
  status: StatusOS
  responsavel: string
  inicio: string
  previsao: string
  pct: number
  equipe: Membro[]
  materiais: Material[]
  horas: RegistroHora[]
  evidencias: Evidencia[]
}

const ORDENS: OrdemServico[] = [
  {
    id: 'OS-2024-047',
    descricao: 'Soldagem estrutural — Caldeirão Tanque T-03 (Aço carbono ASTM A516 Gr.70)',
    status: 'Execução',
    responsavel: 'Eng. Ricardo Lima',
    inicio: '02/06/2026',
    previsao: '20/06/2026',
    pct: 65,
    equipe: [
      { nome: 'Ricardo Lima',  funcao: 'Engenheiro Responsável' },
      { nome: 'Carlos Silva',  funcao: 'Soldador TIG — N2'      },
      { nome: 'João Martins',  funcao: 'Caldeireiro'             },
      { nome: 'Ana Costa',     funcao: 'Inspeção END'            },
    ],
    materiais: [
      { item: 'Eletrodo ER70S-6 ø3,2mm', qtd: '12',  unit: 'kg'  },
      { item: 'Gás Argônio 99,9%',        qtd: '3',   unit: 'cil' },
      { item: 'Disco de desbaste 7"',     qtd: '20',  unit: 'un'  },
      { item: 'EPI — Conjunto completo',  qtd: '4',   unit: 'kit' },
    ],
    horas: [
      { data: '10/06/2026', horas: 8, desc: 'Preparação e limpeza de juntas'     },
      { data: '11/06/2026', horas: 8, desc: 'Soldagem passes de raiz — T-03'     },
      { data: '12/06/2026', horas: 6, desc: 'Passes de enchimento + inspeção END' },
    ],
    evidencias: [
      { tipo: 'antes',   desc: 'Condição inicial do tanque T-03 antes da intervenção', data: '02/06/2026' },
      { tipo: 'durante', desc: 'Execução da soldagem — passes de raiz',                 data: '11/06/2026' },
      { tipo: 'durante', desc: 'Inspeção por líquido penetrante LP',                    data: '12/06/2026' },
    ],
  },
  {
    id: 'OS-2024-046',
    descricao: 'Manutenção preventiva — Trocadores de calor TC-01 e TC-02',
    status: 'Planejamento',
    responsavel: 'Téc. André Costa',
    inicio: '10/06/2026',
    previsao: '30/06/2026',
    pct: 15,
    equipe: [
      { nome: 'André Costa',   funcao: 'Técnico Responsável'    },
      { nome: 'Paulo Rocha',   funcao: 'Soldador MIG — N1'      },
    ],
    materiais: [
      { item: 'Arame ER309L ø1,2mm', qtd: '5',  unit: 'kg' },
      { item: 'Gás misto CO2/Ar',    qtd: '2',  unit: 'cil'},
    ],
    horas: [],
    evidencias: [],
  },
  {
    id: 'OS-2024-044',
    descricao: 'Montagem de tubulações — Linha de vapor P5 (DN50, Sch 40, ASTM A53)',
    status: 'Finalizada',
    responsavel: 'Eng. Ricardo Lima',
    inicio: '10/05/2026',
    previsao: '01/06/2026',
    pct: 100,
    equipe: [
      { nome: 'Ricardo Lima', funcao: 'Engenheiro Responsável' },
      { nome: 'Carlos Silva', funcao: 'Soldador TIG — N3'      },
      { nome: 'Marcos Dias',  funcao: 'Montador de Tubulações' },
    ],
    materiais: [
      { item: 'Tubo 2" Sch 40 ASTM A53', qtd: '24', unit: 'm'  },
      { item: 'Eletrodo E6010 ø3,2mm',   qtd: '5',  unit: 'kg' },
      { item: 'Flanges slip-on 2" 150#',  qtd: '8',  unit: 'un' },
    ],
    horas: [
      { data: '10/05/2026', horas: 8,  desc: 'Levantamento de campo e isométrico'  },
      { data: '15/05/2026', horas: 8,  desc: 'Montagem de suportes e spools'        },
      { data: '20/05/2026', horas: 8,  desc: 'Soldagem de juntas — processo SMAW'  },
      { data: '25/05/2026', horas: 6,  desc: 'Teste hidrostático e liberação'       },
    ],
    evidencias: [
      { tipo: 'antes',  desc: 'Linha de vapor P5 antes da montagem',     data: '10/05/2026' },
      { tipo: 'durante',desc: 'Soldagem de juntas — processo SMAW',       data: '20/05/2026' },
      { tipo: 'depois', desc: 'Linha instalada e aprovada no teste hidro', data: '01/06/2026' },
    ],
  },
]

const TIPO_EVIDENCIA = {
  antes:   { label: 'Antes',   color: '#64748B' },
  durante: { label: 'Durante', color: '#3B82F6' },
  depois:  { label: 'Depois',  color: '#10B981' },
}

const ALL_STATUS: (StatusOS | 'Todos')[] = ['Todos', 'Aberta', 'Planejamento', 'Execução', 'Pausada', 'Finalizada', 'Faturada']

export function OrdensServicoPage() {
  const [expanded, setExpanded] = useState<string | null>('OS-2024-047')
  const [activeTab, setActiveTab] = useState<Record<string, 'equipe' | 'materiais' | 'horas' | 'evidencias'>>({})
  const [filterStatus, setFilterStatus] = useState<StatusOS | 'Todos'>('Todos')

  function getTab(id: string) { return activeTab[id] ?? 'equipe' }
  function setTab(id: string, tab: typeof activeTab[string]) { setActiveTab(prev => ({ ...prev, [id]: tab })) }

  const filtered = ORDENS.filter(o => filterStatus === 'Todos' || o.status === filterStatus)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Ordens de Serviço</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Acompanhe a execução, equipe, materiais e evidências de cada OS</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {ALL_STATUS.map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className="px-3 py-1.5 rounded-full text-xs font-bold border transition-all"
            style={{
              background: filterStatus === s ? (s === 'Todos' ? COLOR : STATUS_COLORS[s as StatusOS]) + '20' : 'transparent',
              borderColor: filterStatus === s ? (s === 'Todos' ? COLOR : STATUS_COLORS[s as StatusOS]) : 'var(--color-border)',
              color: filterStatus === s ? (s === 'Todos' ? COLOR : STATUS_COLORS[s as StatusOS]) : 'var(--color-text-muted)',
            }}
          >{s}</button>
        ))}
      </div>

      {/* OS cards */}
      <div className="space-y-4">
        {filtered.map(os => {
          const statusColor = STATUS_COLORS[os.status]
          const isExpanded = expanded === os.id
          const tab = getTab(os.id)
          const totalHoras = os.horas.reduce((a, h) => a + h.horas, 0)

          return (
            <Card key={os.id}>
              <div className="p-1">
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: statusColor + '15' }}>
                    <ClipboardList size={16} style={{ color: statusColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-xs font-black" style={{ color: COLOR }}>{os.id}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                        style={{ background: statusColor + '20', color: statusColor }}>{os.status}</span>
                    </div>
                    <p className="text-sm font-semibold text-[var(--color-text)]">{os.descricao}</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{os.responsavel} · Início {os.inicio} · Prev. {os.previsao}</p>
                  </div>
                  <button onClick={() => setExpanded(isExpanded ? null : os.id)}
                    className="flex-shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                {/* Progress */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: statusColor + '20' }}>
                    <div className="h-full rounded-full" style={{ width: `${os.pct}%`, background: statusColor }} />
                  </div>
                  <span className="text-xs font-bold flex-shrink-0" style={{ color: statusColor }}>{os.pct}%</span>
                </div>

                {/* Detail tabs */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                    {/* Tab bar */}
                    <div className="flex gap-1 mb-4 p-1 rounded-xl border" style={{ background: 'var(--color-surface-elevated)', borderColor: 'var(--color-border)' }}>
                      {([
                        { key: 'equipe',     label: '👥 Equipe',    count: os.equipe.length    },
                        { key: 'materiais',  label: '📦 Materiais', count: os.materiais.length },
                        { key: 'horas',      label: '⏱ Horas',     count: totalHoras + 'h'    },
                        { key: 'evidencias', label: '📸 Evidências',count: os.evidencias.length},
                      ] as const).map(t => (
                        <button
                          key={t.key}
                          onClick={() => setTab(os.id, t.key)}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold transition-all"
                          style={tab === t.key ? { background: COLOR, color: 'white' } : { color: 'var(--color-text-muted)' }}
                        >
                          {t.label}
                          <span className="text-[10px] opacity-70">({t.count})</span>
                        </button>
                      ))}
                    </div>

                    {/* Equipe */}
                    {tab === 'equipe' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {os.equipe.map((m, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: COLOR + '20', background: COLOR + '06' }}>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                              style={{ background: COLOR }}>
                              {m.nome.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[var(--color-text)]">{m.nome}</p>
                              <p className="text-xs text-[var(--color-text-muted)]">{m.funcao}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Materiais */}
                    {tab === 'materiais' && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-[var(--color-border)]">
                              <th className="text-left py-2 text-xs font-bold uppercase text-[var(--color-text-muted)]">Item</th>
                              <th className="text-right py-2 text-xs font-bold uppercase text-[var(--color-text-muted)]">Qtd</th>
                              <th className="text-right py-2 text-xs font-bold uppercase text-[var(--color-text-muted)] pr-1">Un</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--color-border)]">
                            {os.materiais.map((m, i) => (
                              <tr key={i}>
                                <td className="py-2.5 text-[var(--color-text)] flex items-center gap-2">
                                  <Package size={13} style={{ color: COLOR }} className="flex-shrink-0" />
                                  {m.item}
                                </td>
                                <td className="py-2.5 text-right font-bold text-[var(--color-text)]">{m.qtd}</td>
                                <td className="py-2.5 text-right text-[var(--color-text-muted)] pr-1">{m.unit}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Horas */}
                    {tab === 'horas' && (
                      <div className="space-y-2">
                        {os.horas.length === 0
                          ? <p className="text-sm text-[var(--color-text-muted)] py-4 text-center">Nenhuma hora registrada ainda</p>
                          : os.horas.map((h, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: 'var(--color-border)' }}>
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: COLOR + '15' }}>
                                <Clock size={14} style={{ color: COLOR }} />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-bold text-[var(--color-text-muted)]">{h.data}</p>
                                <p className="text-sm text-[var(--color-text)]">{h.desc}</p>
                              </div>
                              <span className="font-black text-sm flex-shrink-0" style={{ color: COLOR }}>{h.horas}h</span>
                            </div>
                          ))
                        }
                        {os.horas.length > 0 && (
                          <div className="flex justify-end pt-1">
                            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: COLOR + '15', color: COLOR }}>
                              Total: {totalHoras}h
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Evidências */}
                    {tab === 'evidencias' && (
                      <div className="space-y-2">
                        {os.evidencias.length === 0
                          ? <p className="text-sm text-[var(--color-text-muted)] py-4 text-center">Nenhuma evidência registrada ainda</p>
                          : os.evidencias.map((e, i) => {
                              const tipo = TIPO_EVIDENCIA[e.tipo]
                              return (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-xl border"
                                  style={{ borderColor: tipo.color + '25', background: tipo.color + '06' }}>
                                  <Camera size={14} style={{ color: tipo.color }} className="flex-shrink-0 mt-0.5" />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-0.5">
                                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                                        style={{ background: tipo.color + '20', color: tipo.color }}>{tipo.label}</span>
                                      <span className="text-[10px] text-[var(--color-text-muted)]">{e.data}</span>
                                    </div>
                                    <p className="text-sm text-[var(--color-text)]">{e.desc}</p>
                                  </div>
                                  <button className="text-xs font-semibold flex-shrink-0" style={{ color: tipo.color }}>
                                    Ver foto
                                  </button>
                                </div>
                              )
                            })
                        }
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
