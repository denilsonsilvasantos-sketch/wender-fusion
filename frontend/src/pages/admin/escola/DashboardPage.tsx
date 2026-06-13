import { Link } from 'react-router-dom'
import {
  GraduationCap, Users, TrendingUp, DollarSign, Award,
  ClipboardList, UserCheck, BookOpen, Filter, Megaphone, ChevronRight,
} from 'lucide-react'
import { Card } from '@/components/ui'

interface KPI { label: string; value: string; sub?: string; icon: React.ElementType; delta?: string; up?: boolean }

const KPIS: KPI[] = [
  { label: 'Alunos ativos', value: '—', icon: GraduationCap, sub: 'Matrículas vigentes' },
  { label: 'Leads do mês', value: '—', icon: Users, sub: 'Captações novas' },
  { label: 'Taxa de conversão', value: '—', icon: TrendingUp, sub: 'Leads → matrícula' },
  { label: 'Receita mensal', value: '—', icon: DollarSign, sub: 'Mensalidades + taxas' },
  { label: 'Certificados emitidos', value: '—', icon: Award, sub: 'Total acumulado' },
  { label: 'Empregabilidade', value: '98%', icon: UserCheck, sub: 'Em 90 dias' },
]

const QUICK_LINKS = [
  { label: 'Matrículas', to: '/admin/escola/matriculas', icon: ClipboardList },
  { label: 'Alunos', to: '/admin/escola/alunos', icon: GraduationCap },
  { label: 'Turmas', to: '/admin/escola/turmas', icon: Users },
  { label: 'Instrutores', to: '/admin/escola/instrutores', icon: UserCheck },
  { label: 'Cursos', to: '/admin/escola/cursos', icon: BookOpen },
  { label: 'Leads & Funil', to: '/admin/escola/leads', icon: Filter },
  { label: 'Campanhas', to: '/admin/escola/campanhas', icon: Megaphone },
  { label: 'Certificados', to: '/admin/escola/certificados', icon: Award },
  { label: 'Empregabilidade', to: '/admin/escola/empregabilidade', icon: TrendingUp },
  { label: 'Financeiro', to: '/admin/escola/financeiro', icon: DollarSign },
]

const COLOR = '#FF8C00'

export function EscolaDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏫</span>
          <div>
            <h1 className="text-2xl font-black text-[var(--color-text)]">Escola</h1>
            <p className="text-sm text-[var(--color-text-muted)]">Welder & Fusion — ensino profissional de soldagem</p>
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
              <span className="text-xs font-medium text-[var(--color-text)] group-hover:text-[var(--color-text)] truncate">{item.label}</span>
              <ChevronRight size={12} className="ml-auto flex-shrink-0 text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </Card>

      {/* Placeholder sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Últimas matrículas">
          <div className="py-8 text-center">
            <ClipboardList size={32} className="mx-auto mb-3" style={{ color: COLOR + '50' }} />
            <p className="text-sm text-[var(--color-text-muted)]">Integração com Supabase em breve</p>
          </div>
        </Card>
        <Card title="Leads recentes">
          <div className="py-8 text-center">
            <Users size={32} className="mx-auto mb-3" style={{ color: COLOR + '50' }} />
            <p className="text-sm text-[var(--color-text-muted)]">Integração com Supabase em breve</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
