import { useState, useEffect } from 'react'
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, Users, DollarSign, Award, ClipboardList,
  Wrench, LogOut, Menu, ChevronLeft, ChevronDown, ChevronRight, Shield,
  Briefcase, TrendingUp, Building2, Newspaper, Calendar, Folder,
  FileText, Settings, GraduationCap, Globe, UserCheck, Calculator,
  Layers, Zap, Filter, BarChart2, FolderOpen, Megaphone, GitBranch,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Avatar } from '@/components/ui'
import { cn } from '@/lib/utils'

// ── Nav types ─────────────────────────────────────────────────────────────────
interface NavLeaf { type: 'link'; label: string; to: string; icon: React.ElementType; end?: boolean }
interface NavGroup { type: 'group'; key: string; label: string; icon: React.ElementType; children: NavLeaf[] }
type NavItem = NavLeaf | NavGroup
interface NavSection { key: string; emoji: string; label: string; color: string; items: NavItem[] }

// ── Nav data ──────────────────────────────────────────────────────────────────
const NAV_SECTIONS: NavSection[] = [
  {
    key: 'escola', emoji: '🏫', label: 'ESCOLA', color: '#FF8C00',
    items: [
      { type: 'link', label: 'Dashboard', to: '/admin/escola', icon: LayoutDashboard, end: true },
      {
        type: 'group', key: 'ec-comercial', label: 'Comercial', icon: TrendingUp,
        children: [
          { type: 'link', label: 'Leads', to: '/admin/escola/leads', icon: Users },
          { type: 'link', label: 'Funil', to: '/admin/escola/funil', icon: Filter },
          { type: 'link', label: 'Matrículas', to: '/admin/escola/matriculas', icon: ClipboardList },
          { type: 'link', label: 'Campanhas', to: '/admin/escola/campanhas', icon: Megaphone },
        ],
      },
      { type: 'link', label: 'Alunos', to: '/admin/escola/alunos', icon: GraduationCap },
      { type: 'link', label: 'Cursos', to: '/admin/escola/cursos', icon: BookOpen },
      { type: 'link', label: 'Turmas', to: '/admin/escola/turmas', icon: Users },
      { type: 'link', label: 'Instrutores', to: '/admin/escola/instrutores', icon: UserCheck },
      { type: 'link', label: 'Certificados', to: '/admin/escola/certificados', icon: Award },
      { type: 'link', label: 'Empregabilidade', to: '/admin/escola/empregabilidade', icon: Briefcase },
      { type: 'link', label: 'Financeiro', to: '/admin/escola/financeiro', icon: DollarSign },
      { type: 'link', label: 'Marketing', to: '/admin/escola/marketing', icon: Megaphone },
    ],
  },
  {
    key: 'industrial', emoji: '🏭', label: 'SERVIÇOS', color: '#3B82F6',
    items: [
      { type: 'link', label: 'Dashboard', to: '/admin/industrial', icon: LayoutDashboard, end: true },
      {
        type: 'group', key: 'ind-comercial', label: 'Comercial', icon: TrendingUp,
        children: [
          { type: 'link', label: 'Leads', to: '/admin/industrial/leads', icon: Users },
          { type: 'link', label: 'Propostas', to: '/admin/industrial/propostas', icon: FileText },
          { type: 'link', label: 'Contratos', to: '/admin/industrial/contratos', icon: FileText },
          { type: 'link', label: 'CRM', to: '/admin/industrial/crm', icon: GitBranch },
        ],
      },
      { type: 'link', label: 'Clientes', to: '/admin/industrial/clientes', icon: Building2 },
      { type: 'link', label: 'Orçamentos', to: '/admin/industrial/orcamentos', icon: Calculator },
      { type: 'link', label: 'Ordens de Serviço', to: '/admin/industrial/ordens', icon: Wrench },
      { type: 'link', label: 'Produção', to: '/admin/industrial/producao', icon: Layers },
      { type: 'link', label: 'Consultoria', to: '/admin/industrial/consultoria', icon: Zap },
      { type: 'link', label: 'Portal do Cliente', to: '/admin/industrial/portal', icon: Globe },
      { type: 'link', label: 'Financeiro', to: '/admin/industrial/financeiro', icon: DollarSign },
    ],
  },
  {
    key: 'shared', emoji: '🌐', label: 'COMPARTILHADO', color: '#8B5CF6',
    items: [
      { type: 'link', label: 'CRM Geral', to: '/admin/crm', icon: TrendingUp },
      { type: 'link', label: 'Financeiro Geral', to: '/admin/financeiro-geral', icon: BarChart2 },
      { type: 'link', label: 'Agenda', to: '/admin/agenda', icon: Calendar },
      { type: 'link', label: 'Documentos', to: '/admin/documentos', icon: FolderOpen },
      { type: 'link', label: 'Relatórios', to: '/admin/relatorios', icon: Folder },
      { type: 'link', label: 'Artigos', to: '/admin/artigos', icon: Newspaper },
      { type: 'link', label: 'Usuários', to: '/admin/usuarios', icon: Users },
      { type: 'link', label: 'Configurações', to: '/admin/configuracoes', icon: Settings },
    ],
  },
]

// ── Sidebar item renderers ────────────────────────────────────────────────────
function SidebarLink({ item, color }: { item: NavLeaf; color: string }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) => cn(
        'flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors w-full',
        isActive
          ? 'font-semibold'
          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)]'
      )}
      style={({ isActive }) => isActive ? { background: color + '18', color } : {}}
    >
      <item.icon size={13} className="flex-shrink-0" />
      <span className="truncate">{item.label}</span>
    </NavLink>
  )
}

function SidebarGroup({
  item, color, open, onToggle, pathname,
}: { item: NavGroup; color: string; open: boolean; onToggle: () => void; pathname: string }) {
  const hasActive = item.children.some(c => pathname === c.to || pathname.startsWith(c.to + '/'))
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium w-full transition-colors hover:bg-[var(--color-surface-elevated)]"
        style={hasActive ? { color } : { color: 'var(--color-text-secondary)' }}
      >
        <item.icon size={13} className="flex-shrink-0" />
        <span className="flex-1 text-left truncate">{item.label}</span>
        {open ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
      </button>
      {open && (
        <div className="ml-4 mt-0.5 space-y-0.5 border-l pl-2" style={{ borderColor: color + '30' }}>
          {item.children.map(child => (
            <SidebarLink key={child.to} item={child} color={color} />
          ))}
        </div>
      )}
    </div>
  )
}

function SidebarSection({
  section, open, onToggleSection, openGroups, onToggleGroup, pathname,
}: {
  section: NavSection; open: boolean; onToggleSection: () => void
  openGroups: Set<string>; onToggleGroup: (k: string) => void; pathname: string
}) {
  const { key, emoji, label, color, items } = section
  return (
    <div>
      {/* Section header */}
      <button
        onClick={onToggleSection}
        className="flex items-center gap-2 w-full px-2 py-2 rounded-md transition-colors hover:bg-[var(--color-surface-elevated)] mb-0.5"
      >
        <span className="text-sm leading-none">{emoji}</span>
        <span className="flex-1 text-left text-[10px] font-black uppercase tracking-widest" style={{ color }}>{label}</span>
        {open ? <ChevronDown size={11} style={{ color }} /> : <ChevronRight size={11} style={{ color }} />}
      </button>

      {/* Section items */}
      {open && (
        <div className="space-y-0.5 mb-3">
          {items.map(item => {
            if (item.type === 'link') return <SidebarLink key={item.to} item={item} color={color} />
            if (item.type === 'group') return (
              <SidebarGroup
                key={item.key} item={item} color={color}
                open={openGroups.has(item.key)}
                onToggle={() => onToggleGroup(item.key)}
                pathname={pathname}
              />
            )
            return null
          })}
        </div>
      )}
    </div>
  )
}

function ssGet<T>(key: string, fallback: T): T {
  try { const v = sessionStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback }
}
function ssSet(key: string, value: unknown) {
  try { sessionStorage.setItem(key, JSON.stringify(value)) } catch {}
}

// ── Main AdminLayout ──────────────────────────────────────────────────────────
export function AdminLayout() {
  const { profile, signOut } = useAuth()
  const { pathname } = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(ssGet('sidebar-sections', ['escola', 'industrial', 'shared']))
  )
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () => new Set(ssGet('sidebar-groups', []))
  )

  // Auto-open group when navigating to a child
  useEffect(() => {
    for (const sec of NAV_SECTIONS) {
      for (const item of sec.items) {
        if (item.type === 'group') {
          if (item.children.some(c => pathname === c.to || pathname.startsWith(c.to + '/'))) {
            setOpenGroups(prev => {
              if (prev.has(item.key)) return prev
              const n = new Set([...prev, item.key])
              ssSet('sidebar-groups', [...n])
              return n
            })
          }
        }
      }
    }
  }, [pathname])

  useEffect(() => { setSidebarOpen(false) }, [pathname])

  function toggleSection(k: string) {
    setOpenSections(prev => {
      const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k)
      ssSet('sidebar-sections', [...n])
      return n
    })
  }
  function toggleGroup(k: string) {
    setOpenGroups(prev => {
      const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k)
      ssSet('sidebar-groups', [...n])
      return n
    })
  }

  const sidebar = (
    <aside className="w-[268px] h-screen bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col">
      {/* Logo header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-[var(--color-border)] flex-shrink-0">
        <Link to="/admin" className="flex items-center gap-2">
          <img src="/logo-hero3.png" alt="Welder & Fusion" style={{ height: 36, width: 'auto', objectFit: 'contain' }} />
          <span className="flex items-center gap-1">
            <Shield size={10} className="text-[var(--color-secondary)]" />
            <span className="text-[10px] text-[var(--color-secondary)] uppercase tracking-wider">ERP</span>
          </span>
        </Link>
        <button className="md:hidden text-[var(--color-text-muted)]" onClick={() => setSidebarOpen(false)}>
          <ChevronLeft size={18} />
        </button>
      </div>

      {/* Dashboard root link */}
      <div className="px-3 pt-3 pb-1 flex-shrink-0">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) => cn(
            'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors',
            isActive
              ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)]'
          )}
        >
          <LayoutDashboard size={16} />
          Dashboard
        </NavLink>
      </div>

      {/* Separator */}
      <div className="mx-3 my-2 border-t border-[var(--color-border)] flex-shrink-0" />

      {/* Sections (scrollable) */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-0 scrollbar-thin">
        {NAV_SECTIONS.map(section => (
          <SidebarSection
            key={section.key}
            section={section}
            open={openSections.has(section.key)}
            onToggleSection={() => toggleSection(section.key)}
            openGroups={openGroups}
            onToggleGroup={toggleGroup}
            pathname={pathname}
          />
        ))}
      </nav>

      {/* Profile + logout */}
      <div className="px-3 pb-4 border-t border-[var(--color-border)] pt-3 flex-shrink-0">
        {profile && (
          <div className="flex items-center gap-3 px-2 py-2 rounded-md bg-[var(--color-surface-elevated)] mb-2">
            <Avatar name={profile.name} avatarUrl={profile.avatar_url} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[var(--color-text)] truncate">{profile.name}</p>
              <p className="text-xs text-[var(--color-text-muted)] capitalize">{profile.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-xs text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-danger)] transition-colors"
        >
          <LogOut size={14} />
          Sair do sistema
        </button>
      </div>
    </aside>
  )

  return (
    <div className="min-h-screen flex bg-[var(--color-bg)]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar desktop (sticky) */}
      <div className="hidden md:flex sticky top-0 h-screen">
        {sidebar}
      </div>

      {/* Sidebar mobile (fixed drawer) */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-40 md:hidden transition-transform duration-200',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {sidebar}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-20 h-14 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center gap-3 px-4">
          <button onClick={() => setSidebarOpen(true)} className="text-[var(--color-text-secondary)]">
            <Menu size={20} />
          </button>
          <span className="font-semibold text-sm text-[var(--color-text)]">Welder &amp; Fusion ERP</span>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1440px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
