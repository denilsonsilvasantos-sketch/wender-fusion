import { useAuth } from '@/hooks/useAuth'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui'
import {
  ClipboardList, FileText, DollarSign, GraduationCap, AlertCircle, Headphones,
  CheckCircle, Clock, ArrowRight, ChevronRight, TrendingUp, Factory,
} from 'lucide-react'

const COLOR = '#3B82F6'

const MOCK_OS = [
  { id: 'OS-2024-047', descricao: 'Soldagem estrutural — Caldeirão Tanque T-03',  status: 'Execução',     responsavel: 'Eng. Ricardo Lima',  prev: '20/06/2026', pct: 65  },
  { id: 'OS-2024-046', descricao: 'Manutenção preventiva — Trocadores de calor',  status: 'Planejamento', responsavel: 'Téc. André Costa',   prev: '30/06/2026', pct: 15  },
  { id: 'OS-2024-044', descricao: 'Montagem de tubulações — Linha de vapor P5',   status: 'Concluída',    responsavel: 'Eng. Ricardo Lima',  prev: '01/06/2026', pct: 100 },
]

const MOCK_ORCAMENTOS = [
  { id: 'ORC-2024-021', descricao: 'Reparo em vaso de pressão VP-08',        valor: 'R$ 38.500', status: 'Aguardando Aprovação' },
  { id: 'ORC-2024-019', descricao: 'Treinamento NR-13 — 18 colaboradores',  valor: 'R$ 12.200', status: 'Aprovado'             },
]

const MOCK_FATURAS = [
  { id: 'FAT-2024-033', valor: 'R$ 62.400', venc: '15/06/2026', status: 'Vencida' },
  { id: 'FAT-2024-030', valor: 'R$ 28.750', venc: '30/06/2026', status: 'Aberta'  },
]

const TIMELINE = [
  { label: 'Orçamento enviado', done: true  },
  { label: 'Aprovado',          done: true  },
  { label: 'OS aberta',         done: true  },
  { label: 'Em execução',       done: true  },
  { label: 'Concluído',         done: false },
  { label: 'Faturado',          done: false },
]

const STATUS_COLORS: Record<string, string> = {
  'Execução':             '#3B82F6',
  'Planejamento':         '#F59E0B',
  'Concluída':            '#10B981',
  'Faturada':             '#8B5CF6',
  'Pausada':              '#EF4444',
  'Aberta':               '#64748B',
  'Aguardando Aprovação': '#F59E0B',
  'Aprovado':             '#10B981',
  'Vencida':              '#EF4444',
}

export function IndustrialDashboardPage() {
  const { profile } = useAuth()
  const empresa = profile?.name ?? 'Empresa'

  const kpis = [
    { label: 'Serviços em Andamento', value: '2',        icon: Factory,       color: '#3B82F6', sub: 'OS abertas',           to: '/industrial/ordens'                 },
    { label: 'Orçamentos Pendentes',  value: '1',        icon: FileText,      color: '#F59E0B', sub: 'Aguardando aprovação',  to: '/industrial/orcamentos'             },
    { label: 'Valor Contratado',      value: 'R$ 103k',  icon: DollarSign,    color: '#10B981', sub: 'em execução',           to: '/industrial/financeiro/faturas'     },
    { label: 'Consultorias Ativas',   value: '1',        icon: GraduationCap, color: '#8B5CF6', sub: 'NR-13 em andamento',    to: '/industrial/consultorias/contratos' },
    { label: 'Faturas Pendentes',     value: 'R$ 91k',   icon: AlertCircle,   color: '#EF4444', sub: '2 faturas em aberto',   to: '/industrial/financeiro/faturas'     },
    { label: 'Chamados Abertos',      value: '0',        icon: Headphones,    color: '#64748B', sub: 'Nenhum pendente',       to: '/industrial/atendimento/chamados'   },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest font-bold mb-1" style={{ color: COLOR }}>Portal Industrial</p>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Olá, {empresa}</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Acompanhe serviços, documentos e financeiro em um só lugar.</p>
        </div>
        <Link
          to="/industrial/orcamento/novo"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow hover:opacity-90 transition-all"
          style={{ background: COLOR }}
        >
          + Solicitar Orçamento
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map(k => (
          <Link key={k.label} to={k.to}
            className="group rounded-xl border p-4 flex flex-col gap-2 transition-all hover:shadow-md"
            style={{ background: k.color + '08', borderColor: k.color + '25' }}>
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: k.color + '18' }}>
                <k.icon size={15} style={{ color: k.color }} />
              </div>
              <ChevronRight size={12} className="text-[var(--color-text-muted)] group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-2xl font-black" style={{ color: k.color }}>{k.value}</p>
            <div>
              <p className="text-xs font-semibold text-[var(--color-text)] leading-tight">{k.label}</p>
              <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{k.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* OS list */}
        <div className="xl:col-span-2">
          <Card title="Ordens de Serviço Ativas" action={
            <Link to="/industrial/ordens" className="text-xs font-bold flex items-center gap-1" style={{ color: COLOR }}>
              Ver todas <ArrowRight size={12} />
            </Link>
          }>
            <div className="space-y-3">
              {MOCK_OS.map(os => (
                <div key={os.id} className="p-3 rounded-xl border" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-black" style={{ color: COLOR }}>{os.id}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                          style={{ background: (STATUS_COLORS[os.status] ?? '#64748B') + '20', color: STATUS_COLORS[os.status] ?? '#64748B' }}>
                          {os.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-[var(--color-text)] truncate">{os.descricao}</p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{os.responsavel} · Prev: {os.prev}</p>
                    </div>
                    <Link to="/industrial/ordens" className="flex-shrink-0 text-xs font-bold px-2 py-1 rounded-lg" style={{ background: COLOR + '12', color: COLOR }}>
                      Detalhes
                    </Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: (STATUS_COLORS[os.status] ?? '#64748B') + '20' }}>
                      <div className="h-full rounded-full" style={{ width: `${os.pct}%`, background: STATUS_COLORS[os.status] ?? '#64748B' }} />
                    </div>
                    <span className="text-[10px] font-bold flex-shrink-0" style={{ color: STATUS_COLORS[os.status] ?? '#64748B' }}>{os.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Side column */}
        <div className="space-y-4">
          {/* Timeline */}
          <Card title="Andamento — OS-2024-047">
            <div className="space-y-1">
              {TIMELINE.map((step, i) => (
                <div key={step.label} className="flex items-start gap-3">
                  <div className="flex flex-col items-center flex-shrink-0 pt-0.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: step.done ? '#10B981' : 'var(--color-surface-elevated)', border: step.done ? 'none' : '2px solid var(--color-border)' }}>
                      {step.done
                        ? <CheckCircle size={11} className="text-white" />
                        : <Clock size={9} className="text-[var(--color-text-muted)]" />}
                    </div>
                    {i < TIMELINE.length - 1 && (
                      <div className="w-px flex-1 mt-0.5 mb-0.5 min-h-[14px]" style={{ background: step.done ? '#10B981' : 'var(--color-border)' }} />
                    )}
                  </div>
                  <p className="text-xs py-0.5 pb-2" style={{ color: step.done ? 'var(--color-text)' : 'var(--color-text-muted)' }}>{step.label}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Orçamentos */}
          <Card title="Orçamentos" action={<Link to="/industrial/orcamentos" className="text-xs font-bold" style={{ color: '#F59E0B' }}>Ver todos</Link>}>
            <div className="space-y-2">
              {MOCK_ORCAMENTOS.map(o => (
                <div key={o.id} className="p-2.5 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] font-black text-[var(--color-text-muted)]">{o.id}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: (STATUS_COLORS[o.status] ?? '#64748B') + '20', color: STATUS_COLORS[o.status] ?? '#64748B' }}>
                      {o.status}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text)] leading-tight">{o.descricao}</p>
                  <p className="text-sm font-bold mt-1" style={{ color: '#10B981' }}>{o.valor}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Faturas */}
          <Card title="Faturas" action={<Link to="/industrial/financeiro/faturas" className="text-xs font-bold" style={{ color: '#10B981' }}>Ver todas</Link>}>
            <div className="space-y-2">
              {MOCK_FATURAS.map(f => (
                <div key={f.id} className="p-2.5 rounded-lg border"
                  style={{ borderColor: f.status === 'Vencida' ? '#EF444430' : 'var(--color-border)', background: f.status === 'Vencida' ? '#EF444408' : 'transparent' }}>
                  <div className="flex justify-between mb-0.5">
                    <span className="text-[10px] font-black text-[var(--color-text-muted)]">{f.id}</span>
                    <span className="text-[10px] font-bold" style={{ color: STATUS_COLORS[f.status] }}>{f.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-bold" style={{ color: '#10B981' }}>{f.valor}</span>
                    <span className="text-[10px] text-[var(--color-text-muted)]">Venc. {f.venc}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Novo Orçamento', to: '/industrial/orcamento/novo',        icon: FileText,   color: '#3B82F6' },
          { label: 'Pagar Fatura',   to: '/industrial/financeiro/faturas',    icon: DollarSign, color: '#10B981' },
          { label: 'Ver Documentos', to: '/industrial/docs/projetos',         icon: TrendingUp, color: '#8B5CF6' },
          { label: 'Abrir Chamado',  to: '/industrial/atendimento/chamados',  icon: Headphones, color: '#EF4444' },
        ].map(a => (
          <Link key={a.label} to={a.to}
            className="flex items-center gap-3 p-4 rounded-xl border transition-all hover:shadow-md"
            style={{ borderColor: a.color + '30', background: a.color + '08' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: a.color + '18' }}>
              <a.icon size={15} style={{ color: a.color }} />
            </div>
            <span className="text-sm font-semibold text-[var(--color-text)]">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
