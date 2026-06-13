import { useState, useEffect } from 'react'
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, Calendar, FileText, Video, ClipboardList,
  CalendarCheck, Award, Trophy, Star, BarChart2, History, Briefcase,
  Users, Search, Send, MessageSquare, Calculator, Library, BookMarked,
  Download, User, FolderOpen, CreditCard, HelpCircle,
  LogOut, Menu, ChevronLeft, ChevronDown, ChevronRight, GraduationCap,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Avatar } from '@/components/ui'
import { cn } from '@/lib/utils'

interface NavLeaf { type: 'link'; label: string; to: string; icon: React.ElementType; end?: boolean }
interface NavGroup { type: 'group'; key: string; label: string; icon: React.ElementType; children: NavLeaf[] }
type NavItem = NavLeaf | NavGroup
interface NavSection { key: string; emoji: string; label: string; color: string; items: NavItem[] }

const SECTIONS: NavSection[] = [
  {
    key: 'formacao', emoji: '📚', label: 'MINHA FORMAÇÃO', color: '#6366F1',
    items: [
      { type: 'link', label: 'Meus Cursos',        to: '/aluno/cursos',      icon: BookOpen      },
      { type: 'link', label: 'Cronograma',          to: '/aluno/cronograma',  icon: Calendar      },
      { type: 'link', label: 'Apostilas',           to: '/aluno/apostilas',   icon: FileText      },
      { type: 'link', label: 'Videoaulas',          to: '/aluno/videoaulas',  icon: Video         },
      { type: 'link', label: 'Avaliações',          to: '/aluno/avaliacoes',  icon: ClipboardList },
      { type: 'link', label: 'Frequência',          to: '/aluno/presenca',    icon: CalendarCheck },
      { type: 'link', label: 'Certificados',        to: '/aluno/certificados',icon: Award         },
    ],
  },
  {
    key: 'desenvolvimento', emoji: '🏆', label: 'DESENVOLVIMENTO', color: '#F59E0B',
    items: [
      { type: 'link', label: 'Gamificação',         to: '/aluno/gamificacao', icon: Trophy        },
      { type: 'link', label: 'Conquistas',          to: '/aluno/conquistas',  icon: Star          },
      { type: 'link', label: 'Ranking',             to: '/aluno/ranking',     icon: BarChart2     },
      { type: 'link', label: 'Histórico Acadêmico', to: '/aluno/historico',   icon: History       },
    ],
  },
  {
    key: 'empregabilidade', emoji: '💼', label: 'EMPREGABILIDADE', color: '#10B981',
    items: [
      { type: 'link', label: 'Meu Currículo',       to: '/aluno/curriculo',      icon: User          },
      { type: 'link', label: 'Banco de Talentos',   to: '/aluno/talento',         icon: Users         },
      { type: 'link', label: 'Vagas',               to: '/aluno/vagas',           icon: Search        },
      { type: 'link', label: 'Minhas Candidaturas', to: '/aluno/candidaturas',    icon: Send          },
      { type: 'link', label: 'Recomendações',       to: '/aluno/recomendacoes',   icon: MessageSquare },
    ],
  },
  {
    key: 'ferramentas', emoji: '🔧', label: 'FERRAMENTAS', color: '#3B82F6',
    items: [
      { type: 'link', label: 'Calculadora',         to: '/aluno/calculadora',  icon: Calculator   },
      { type: 'link', label: 'Biblioteca Técnica',  to: '/aluno/biblioteca',   icon: Library      },
      { type: 'link', label: 'Normas',              to: '/aluno/normas',       icon: BookMarked   },
      { type: 'link', label: 'Downloads',           to: '/aluno/downloads',    icon: Download     },
    ],
  },
  {
    key: 'conta', emoji: '👤', label: 'CONTA', color: '#64748B',
    items: [
      { type: 'link', label: 'Meu Perfil',          to: '/aluno/perfil',      icon: User          },
      { type: 'link', label: 'Documentos',          to: '/aluno/documentos',  icon: FolderOpen    },
      { type: 'link', label: 'Financeiro',          to: '/aluno/pagamentos',  icon: CreditCard    },
      { type: 'link', label: 'Suporte',             to: '/aluno/suporte',     icon: HelpCircle    },
    ],
  },
]

const COLOR = '#6366F1'

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

export function StudentLayout() {
  const { profile, signOut } = useAuth()
  const { pathname } = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [openSections, setOpenSections] = useState(new Set(['formacao', 'desenvolvimento', 'empregabilidade', 'ferramentas', 'conta']))

  useEffect(() => { setSidebarOpen(false) }, [pathname])

  const toggleSection = (k: string) => setOpenSections(prev => {
    const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n
  })

  const sidebar = (
    <aside className="w-[252px] h-screen bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-[var(--color-border)] flex-shrink-0">
        <Link to="/aluno" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: COLOR }}>
            <GraduationCap size={14} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-black text-[var(--color-text)] leading-tight">W&amp;F</p>
            <p className="text-[9px] uppercase tracking-widest leading-tight" style={{ color: COLOR }}>Portal do Aluno</p>
          </div>
        </Link>
        <button className="md:hidden text-[var(--color-text-muted)]" onClick={() => setSidebarOpen(false)}>
          <ChevronLeft size={18} />
        </button>
      </div>

      {/* Dashboard root */}
      <div className="px-3 pt-3 pb-1 flex-shrink-0">
        <NavLink
          to="/aluno" end
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
      <nav className="flex-1 overflow-y-auto px-3 pb-4 scrollbar-thin">
        {SECTIONS.map(section => (
          <div key={section.key}>
            <button
              onClick={() => toggleSection(section.key)}
              className="flex items-center gap-2 w-full px-2 py-2 rounded-md transition-colors hover:bg-[var(--color-surface-elevated)] mb-0.5"
            >
              <span className="text-sm leading-none">{section.emoji}</span>
              <span className="flex-1 text-left text-[10px] font-black uppercase tracking-widest" style={{ color: section.color }}>{section.label}</span>
              {openSections.has(section.key)
                ? <ChevronDown size={11} style={{ color: section.color }} />
                : <ChevronRight size={11} style={{ color: section.color }} />}
            </button>
            {openSections.has(section.key) && (
              <div className="space-y-0.5 mb-3">
                {section.items.map(item =>
                  item.type === 'link'
                    ? <SidebarLink key={item.to} item={item} color={section.color} />
                    : null
                )}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Profile + logout */}
      <div className="px-3 pb-4 border-t border-[var(--color-border)] pt-3 flex-shrink-0">
        {profile && (
          <div className="flex items-center gap-3 px-2 py-2 rounded-md bg-[var(--color-surface-elevated)] mb-2">
            <Avatar name={profile.name} avatarUrl={profile.avatar_url} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[var(--color-text)] truncate">{profile.name}</p>
              <p className="text-xs font-semibold" style={{ color: COLOR }}>Aluno</p>
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
          <span className="font-semibold text-sm text-[var(--color-text)]">Portal do Aluno</span>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1440px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
