import { Link } from 'react-router-dom'
import {
  Building2, Wrench, DollarSign, BarChart2, Users,
  FileText, Calculator, Layers, Zap, Globe, ChevronRight,
  TrendingUp, GitBranch,
} from 'lucide-react'
import { Card } from '@/components/ui'

interface KPI { label: string; value: string; sub?: string; icon: React.ElementType }

const KPIS: KPI[] = [
  { label: 'Clientes ativos', value: '—', icon: Building2, sub: 'Base atual' },
  { label: 'OS em andamento', value: '—', icon: Wrench, sub: 'Em execução' },
  { label: 'Orçamentos abertos', value: '—', icon: Calculator, sub: 'Aguardando aprovação' },
  { label: 'Propostas enviadas', value: '—', icon: FileText, sub: 'Último mês' },
  { label: 'Receita mensal', value: '—', icon: DollarSign, sub: 'Serviços faturados' },
  { label: 'Taxa de conversão', value: '—', icon: TrendingUp, sub: 'Orçamento → OS' },
]

const QUICK_LINKS = [
  { label: 'Ordens de Serviço', to: '/admin/industrial/ordens', icon: Wrench },
  { label: 'Orçamentos', to: '/admin/industrial/orcamentos', icon: Calculator },
  { label: 'Clientes', to: '/admin/industrial/clientes', icon: Building2 },
  { label: 'Propostas', to: '/admin/industrial/propostas', icon: FileText },
  { label: 'Contratos', to: '/admin/industrial/contratos', icon: FileText },
  { label: 'Leads', to: '/admin/industrial/leads', icon: Users },
  { label: 'CRM', to: '/admin/industrial/crm', icon: GitBranch },
  { label: 'Produção', to: '/admin/industrial/producao', icon: Layers },
  { label: 'Consultoria', to: '/admin/industrial/consultoria', icon: Zap },
  { label: 'Financeiro', to: '/admin/industrial/financeiro', icon: DollarSign },
]

const COLOR = '#3B82F6'

export function IndustrialDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏭</span>
          <div>
            <h1 className="text-2xl font-black text-[var(--color-text)]">Serviços Industriais</h1>
            <p className="text-sm text-[var(--color-text-muted)]">Orçamentos, ordens de serviço e consultoria técnica</p>
          </div>
        </div>
        <Link
          to="/admin"
          className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors flex items-center gap-1"
        >
          ← Voltar ao ERP
        </Link>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {KPIS.map(kpi => (
          <div
            key={kpi.label}
            className="rounded-xl border p-4"
            style={{ background: 'var(--color-surface)', borderColor: COLOR + '20' }}
          >
            <div className="flex items-center gap-1.5 mb-3">
              <kpi.icon size={13} style={{ color: COLOR }} />
              <span className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">{kpi.label}</span>
            </div>
            <p className="text-2xl font-black" style={{ color: COLOR }}>{kpi.value}</p>
            {kpi.sub && <p className="text-[10px] text-[var(--color-text-muted)] mt-1">{kpi.sub}</p>}
          </div>
        ))}
      </div>

      {/* Quick links */}
      <Card title="Acesso rápido">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {QUICK_LINKS.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-2.5 px-3 py-3 rounded-xl border transition-colors hover:bg-[var(--color-surface-elevated)] group"
              style={{ borderColor: COLOR + '25' }}
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: COLOR + '15' }}>
                <item.icon size={14} style={{ color: COLOR }} />
              </div>
              <span className="text-xs font-medium text-[var(--color-text)] truncate">{item.label}</span>
              <ChevronRight size={12} className="ml-auto flex-shrink-0 text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </Card>

      {/* Placeholder sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Ordens de serviço recentes">
          <div className="py-8 text-center">
            <Wrench size={32} className="mx-auto mb-3" style={{ color: COLOR + '50' }} />
            <p className="text-sm text-[var(--color-text-muted)]">Integração com Supabase em breve</p>
          </div>
        </Card>
        <Card title="Orçamentos em aberto">
          <div className="py-8 text-center">
            <BarChart2 size={32} className="mx-auto mb-3" style={{ color: COLOR + '50' }} />
            <p className="text-sm text-[var(--color-text-muted)]">Integração com Supabase em breve</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
