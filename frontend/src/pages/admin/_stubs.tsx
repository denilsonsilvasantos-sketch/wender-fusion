import type { LucideIcon } from 'lucide-react'
import {
  Users, BarChart2, Calendar,
  FolderOpen, Folder, Settings,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

interface StubConfig { title: string; icon: LucideIcon; color: string; description: string; back: string; backLabel: string }

function StubPage({ config }: { config: StubConfig }) {
  const { title, icon: Icon, color, description, back, backLabel } = config
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to={back}
          className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          <ChevronLeft size={14} />
          {backLabel}
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
          style={{ background: color + '18', border: `2px solid ${color}30` }}>
          <Icon size={36} style={{ color }} />
        </div>
        <h1 className="text-2xl font-black text-[var(--color-text)] mb-2">{title}</h1>
        <p className="text-sm text-[var(--color-text-muted)] mb-1">{description}</p>
        <p className="text-xs text-[var(--color-text-muted)] px-4 py-2 rounded-full mt-4"
          style={{ background: color + '10', border: `1px solid ${color}25`, color }}>
          Módulo em desenvolvimento
        </p>
      </div>
    </div>
  )
}

// ── Compartilhado ─────────────────────────────────────────────────────────────

export function FinanceiroGeralPage() {
  return <StubPage config={{
    title: 'Financeiro Geral', icon: BarChart2, color: '#8B5CF6', back: '/admin',
    backLabel: 'Dashboard', description: 'Consolidado financeiro das duas unidades de negócio.',
  }} />
}

export function AgendaPage() {
  return <StubPage config={{
    title: 'Agenda', icon: Calendar, color: '#8B5CF6', back: '/admin',
    backLabel: 'Dashboard', description: 'Agenda compartilhada de turmas, visitas e consultorias.',
  }} />
}

export function DocumentosPage() {
  return <StubPage config={{
    title: 'Documentos', icon: FolderOpen, color: '#8B5CF6', back: '/admin',
    backLabel: 'Dashboard', description: 'Gestão de documentos, contratos e certificações.',
  }} />
}

export function RelatoriosPage() {
  return <StubPage config={{
    title: 'Relatórios', icon: Folder, color: '#8B5CF6', back: '/admin',
    backLabel: 'Dashboard', description: 'Relatórios gerenciais e analíticos do sistema.',
  }} />
}

export function UsuariosPage() {
  return <StubPage config={{
    title: 'Usuários', icon: Users, color: '#8B5CF6', back: '/admin',
    backLabel: 'Dashboard', description: 'Gerenciar usuários, funções e permissões de acesso.',
  }} />
}

export function ConfiguracoesPage() {
  return <StubPage config={{
    title: 'Configurações', icon: Settings, color: '#8B5CF6', back: '/admin',
    backLabel: 'Dashboard', description: 'Configurações gerais do portal e integrações.',
  }} />
}
