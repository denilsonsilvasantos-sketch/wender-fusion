import { Link } from 'react-router-dom'
import {
  GraduationCap, Wrench, Users, DollarSign, TrendingUp, Award,
  BarChart2, ChevronRight, Calendar, Newspaper, Clock,
} from 'lucide-react'
import { Card } from '@/components/ui'

interface MiniStat { label: string; value: string; icon: React.ElementType }
interface Module {
  key: string; emoji: string; name: string; subtitle: string
  color: string; to: string; stats: MiniStat[]
  links: { label: string; to: string }[]
}

const MODULES: Module[] = [
  {
    key: 'escola', emoji: '🏫', name: 'Escola', subtitle: 'Welder & Fusion — ensino profissional',
    color: '#FF8C00', to: '/admin/escola',
    stats: [
      { label: 'Alunos ativos', value: '—', icon: GraduationCap },
      { label: 'Matrículas abertas', value: '—', icon: Users },
      { label: 'Taxa empregabilidade', value: '98%', icon: TrendingUp },
      { label: 'Receita mensal', value: '—', icon: DollarSign },
    ],
    links: [
      { label: 'Matrículas', to: '/admin/escola/matriculas' },
      { label: 'Alunos', to: '/admin/escola/alunos' },
      { label: 'Certificados', to: '/admin/escola/certificados' },
      { label: 'Empregabilidade', to: '/admin/escola/empregabilidade' },
    ],
  },
  {
    key: 'industrial', emoji: '🏭', name: 'Serviços Industriais', subtitle: 'Orçamentos, OS e consultoria',
    color: '#3B82F6', to: '/admin/industrial',
    stats: [
      { label: 'Clientes ativos', value: '—', icon: Users },
      { label: 'OS em andamento', value: '—', icon: Wrench },
      { label: 'Orçamentos abertos', value: '—', icon: BarChart2 },
      { label: 'Receita mensal', value: '—', icon: DollarSign },
    ],
    links: [
      { label: 'Ordens de Serviço', to: '/admin/industrial/ordens' },
      { label: 'Orçamentos', to: '/admin/industrial/orcamentos' },
      { label: 'Clientes', to: '/admin/industrial/clientes' },
      { label: 'Consultoria', to: '/admin/industrial/consultoria' },
    ],
  },
]

const SHARED_SHORTCUTS = [
  { icon: BarChart2, label: 'Relatórios', to: '/admin/relatorios', color: '#8B5CF6' },
  { icon: DollarSign, label: 'Financeiro Geral', to: '/admin/financeiro-geral', color: '#8B5CF6' },
  { icon: Calendar, label: 'Agenda', to: '/admin/agenda', color: '#8B5CF6' },
  { icon: Newspaper, label: 'Artigos', to: '/admin/artigos', color: '#8B5CF6' },
  { icon: Award, label: 'Certificados', to: '/admin/escola/certificados', color: '#FF8C00' },
  { icon: Users, label: 'Usuários', to: '/admin/usuarios', color: '#8B5CF6' },
]

export function AdminDashboardPage() {
  const now = new Date()
  const dateStr = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Welder &amp; Fusion ERP</h1>
          <p className="text-sm text-[var(--color-text-muted)] flex items-center gap-1.5 mt-0.5">
            <Clock size={13} />
            {dateStr}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-full border"
            style={{ color: '#FF8C00', borderColor: '#FF8C0030', background: '#FF8C0010' }}>
            Sistema Integrado
          </span>
        </div>
      </div>

      {/* Module cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {MODULES.map(mod => (
          <div key={mod.key}
            className="rounded-2xl border overflow-hidden"
            style={{ borderColor: mod.color + '30', background: 'var(--color-surface)' }}>

            {/* Card header */}
            <div className="px-6 py-5 flex items-start justify-between"
              style={{ background: mod.color + '0c', borderBottom: `1px solid ${mod.color}20` }}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{mod.emoji}</span>
                <div>
                  <h2 className="text-lg font-black text-[var(--color-text)]">{mod.name}</h2>
                  <p className="text-xs text-[var(--color-text-muted)]">{mod.subtitle}</p>
                </div>
              </div>
              <Link
                to={mod.to}
                className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                style={{ color: mod.color, background: mod.color + '18' }}
              >
                Acessar
                <ChevronRight size={13} />
              </Link>
            </div>

            {/* Mini stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y divide-[var(--color-border)]">
              {mod.stats.map(stat => (
                <div key={stat.label} className="px-4 py-4">
                  <div className="flex items-center gap-1.5 mb-1">
                    <stat.icon size={12} style={{ color: mod.color }} />
                    <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wide">{stat.label}</span>
                  </div>
                  <p className="text-xl font-black" style={{ color: mod.color }}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Quick links */}
            <div className="px-6 py-4 flex flex-wrap gap-2"
              style={{ borderTop: `1px solid ${mod.color}15` }}>
              {mod.links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-xs px-3 py-1.5 rounded-lg transition-colors hover:opacity-90"
                  style={{ color: mod.color, background: mod.color + '12', border: `1px solid ${mod.color}25` }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Shared shortcuts */}
      <Card title="🌐 Compartilhado">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {SHARED_SHORTCUTS.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className="flex flex-col items-center gap-2 px-3 py-4 rounded-xl border transition-colors hover:bg-[var(--color-surface-elevated)]"
              style={{ borderColor: item.color + '25' }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: item.color + '18' }}>
                <item.icon size={16} style={{ color: item.color }} />
              </div>
              <span className="text-xs font-medium text-[var(--color-text)] text-center">{item.label}</span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}
