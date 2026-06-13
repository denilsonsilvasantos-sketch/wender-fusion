import { useState, useEffect } from 'react'
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, Calendar, ClipboardList, FileText,
  Award, Briefcase, BarChart2, User, LogOut, Menu, ChevronLeft,
  ChevronDown, ChevronRight, Flame, Users, Star, MessageSquare,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Avatar } from '@/components/ui'
import { cn } from '@/lib/utils'

const COLOR = '#10B981'

interface NavLeaf { type: 'link'; label: string; to: string; icon: React.ElementType; end?: boolean }
interface NavGroup { type: 'group'; key: string; label: string; icon: React.ElementType; children: NavLeaf[] }
type NavItem = NavLeaf | NavGroup
interface NavSection { key: string; emoji: string; label: string; color: string; items: NavItem[] }

const SECTIONS: NavSection[] = [
  {
    key: 'ensino', emoji: '📚', label: 'ENSINO', color: '#10B981',
    items: [
      { type: 'link', label: 'Minhas Turmas', to: '/instrutor/turmas', icon: Users },
      { type: 'link', label: 'Agenda', to: '/instrutor/agenda', icon: Calendar },
      { type: 'link', label: 'Presença', to: '/instrutor/presenca', icon: ClipboardList },
      {
        type: 'group', key: 'avaliacoes', label: 'Avaliações', icon: Star,
        children: [
          { type: 'link', label: 'Teóricas', to: '/instrutor/avaliacoes/teoricas', icon: FileText },
          { type: 'link', label: 'Prática de Soldagem', to: '/instrutor/avaliacoes/pratica', icon: Flame },
        ],
      },
      { type: 'link', label: 'Materiais', to: '/instrutor/materiais', icon: BookOpen },
      { type: 'link', label: 'Certificados', to: '/instrutor/certificados', icon: Award },
    ],
  },
  {
    key: 'empregabilidade', emoji: '💼', label: 'EMPREGABILIDADE', color: '#6366F1',
    items: [
      { type: 'link', label: 'Banco de Talentos', to: '/instrutor/empregabilidade/talentos', icon: Users },
      { type: 'link', label: 'Recomendações', to: '/instrutor/empregabilidade/recomendacoes', icon: Briefcase },
      { type: 'link', label: 'Pareceres Técnicos', to: '/instrutor/empregabilidade/pareceres', icon: MessageSquare },
    ],
  },
  {
    key: 'relatorios', emoji: '📊', label: 'RELATÓRIOS', color: '#8B5CF6',
    items: [
      { type: 'link', label: 'Turmas', to: '/instrutor/relatorios/turmas', icon: Users },
      { type: 'link', label: 'Alunos', to: '/instrutor/relatorios/alunos', icon: BarChart2 },
      { type: 'link', label: 'Desempenho', to: '/instrutor/relatorios/desempenho', icon: BarChart2 },
    ],
  },
]

function SidebarLink({ item, color }: { item: NavLeaf; color: string }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) => cn(
        'flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors w-full',
        isActive ? 'font-semibold' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)]'
      )}
      style={({ isActive }) => isActive ? { background: color + '18', color } : {}}
    >
      <item.icon size={13} className="flex-shrink-0" />
      <span className="truncate">{item.label}</span>
    </NavLink>
  )
}

function SidebarGroup({ item, color, open, onToggle, pathname }: {
  item: NavGroup; color: string; open: boolean; onToggle: () => void; pathname: string
}) {
  const hasActive = item.children.some(c => pathname.startsWith(c.to))
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
          {item.children.map(child => <SidebarLink key={child.to} item={child} color={color} />)}
        </div>
      )}
    </div>
  )
}

export function InstructorLayout() {
  const { profile, signOut } = useAuth()
  const { pathname } = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [openSections, setOpenSections] = useState(new Set(['ensino', 'empregabilidade', 'relatorios']))
  const [openGroups, setOpenGroups] = useState(new Set<string>())

  useEffect(() => {
    for (const sec of SECTIONS) {
      for (const item of sec.items) {
        if (item.type === 'group') {
          if (item.children.some(c => pathname.startsWith(c.to))) {
            setOpenGroups(prev => prev.has(item.key) ? prev : new Set([...prev, item.key]))
          }
        }
      }
    }
  }, [pathname])

  useEffect(() => { setSidebarOpen(false) }, [pathname])

  const toggleSection = (k: string) => setOpenSections(prev => {
    const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n
  })
  const toggleGroup = (k: string) => setOpenGroups(prev => {
    const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n
  })

  const sidebar = (
    <aside className="w-[252px] h-screen bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-[var(--color-border)] flex-shrink-0">
        <Link to="/instrutor" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: COLOR }}>
            <Flame size={14} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-black text-[var(--color-text)] leading-tight">W&amp;F</p>
            <p className="text-[9px] uppercase tracking-widest leading-tight" style={{ color: COLOR }}>Instrutor</p>
          </div>
        </Link>
        <button className="md:hidden text-[var(--color-text-muted)]" onClick={() => setSidebarOpen(false)}>
          <ChevronLeft size={18} />
        </button>
      </div>

      {/* Dashboard link */}
      <div className="px-3 pt-3 pb-1 flex-shrink-0">
        <NavLink
          to="/instrutor"
          end
          className={({ isActive }) => cn(
            'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors',
            isActive ? 'font-semibold' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)]'
          )}
          style={({ isActive }) => isActive ? { background: COLOR + '18', color: COLOR } : {}}
        >
          <LayoutDashboard size={16} />
          Dashboard
        </NavLink>
      </div>

      <div className="mx-3 my-2 border-t border-[var(--color-border)] flex-shrink-0" />

      {/* Sections */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-0 scrollbar-thin">
        {SECTIONS.map(section => (
          <div key={section.key}>
            <button
              onClick={() => toggleSection(section.key)}
              className="flex items-center gap-2 w-full px-2 py-2 rounded-md transition-colors hover:bg-[var(--color-surface-elevated)] mb-0.5"
            >
              <span className="text-sm leading-none">{section.emoji}</span>
              <span className="flex-1 text-left text-[10px] font-black uppercase tracking-widest" style={{ color: section.color }}>{section.label}</span>
              {openSections.has(section.key) ? <ChevronDown size={11} style={{ color: section.color }} /> : <ChevronRight size={11} style={{ color: section.color }} />}
            </button>
            {openSections.has(section.key) && (
              <div className="space-y-0.5 mb-3">
                {section.items.map(item => {
                  if (item.type === 'link') return <SidebarLink key={item.to} item={item} color={section.color} />
                  if (item.type === 'group') return (
                    <SidebarGroup
                      key={item.key} item={item} color={section.color}
                      open={openGroups.has(item.key)}
                      onToggle={() => toggleGroup(item.key)}
                      pathname={pathname}
                    />
                  )
                  return null
                })}
              </div>
            )}
          </div>
        ))}

        {/* Perfil link */}
        <div>
          <button
            className="flex items-center gap-2 w-full px-2 py-2 rounded-md transition-colors hover:bg-[var(--color-surface-elevated)] mb-0.5"
          >
            <span className="text-sm leading-none">👤</span>
            <span className="flex-1 text-left text-[10px] font-black uppercase tracking-widest" style={{ color: '#64748B' }}>PERFIL</span>
          </button>
          <div className="space-y-0.5 mb-3">
            <SidebarLink item={{ type: 'link', label: 'Meu Perfil', to: '/instrutor/perfil', icon: User }} color="#64748B" />
          </div>
        </div>
      </nav>

      {/* Profile + logout */}
      <div className="px-3 pb-4 border-t border-[var(--color-border)] pt-3 flex-shrink-0">
        {profile && (
          <div className="flex items-center gap-3 px-2 py-2 rounded-md bg-[var(--color-surface-elevated)] mb-2">
            <Avatar name={profile.name} avatarUrl={profile.avatar_url} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[var(--color-text)] truncate">{profile.name}</p>
              <p className="text-xs font-semibold" style={{ color: COLOR }}>Instrutor</p>
            </div>
          </div>
        )}
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-xs text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-danger)] transition-colors"
        >
          <LogOut size={14} />
          Sair
        </button>
      </div>
    </aside>
  )

  return (
    <div className="min-h-screen flex bg-[var(--color-bg)]">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <div className="hidden md:flex sticky top-0 h-screen">{sidebar}</div>
      <div className={cn('fixed inset-y-0 left-0 z-40 md:hidden transition-transform duration-200', sidebarOpen ? 'translate-x-0' : '-translate-x-full')}>
        {sidebar}
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden sticky top-0 z-20 h-14 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center gap-3 px-4">
          <button onClick={() => setSidebarOpen(true)} className="text-[var(--color-text-secondary)]">
            <Menu size={20} />
          </button>
          <span className="font-semibold text-sm text-[var(--color-text)]">Portal do Instrutor</span>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1440px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
