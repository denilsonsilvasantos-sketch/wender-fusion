import { useState, useEffect } from 'react'
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, FileText, ClipboardList, Calendar, Camera, FolderOpen,
  BookOpen, FileCheck, Award, Download, Receipt, Banknote, QrCode, FileMinus,
  BarChart2, GraduationCap, ScrollText, CalendarCheck, ShieldCheck, FileBarChart,
  Headphones, MessageSquare, HelpCircle, Building2, Users, MapPin, Settings,
  LogOut, Menu, ChevronLeft, ChevronDown, ChevronRight, Factory, PlusCircle,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Avatar } from '@/components/ui'
import { cn } from '@/lib/utils'

const COLOR = '#3B82F6'

interface NavLeaf { type: 'link'; label: string; to: string; icon: React.ElementType }
interface NavSection { key: string; emoji: string; label: string; color: string; items: NavLeaf[] }

const SECTIONS: NavSection[] = [
  {
    key: 'servicos', emoji: '🏭', label: 'SERVIÇOS', color: '#3B82F6',
    items: [
      { type: 'link', label: 'Solicitar Orçamento', to: '/industrial/orcamento/novo',  icon: PlusCircle    },
      { type: 'link', label: 'Meus Orçamentos',     to: '/industrial/orcamentos',       icon: FileText      },
      { type: 'link', label: 'Ordens de Serviço',   to: '/industrial/ordens',           icon: ClipboardList },
      { type: 'link', label: 'Cronograma',          to: '/industrial/cronograma',       icon: Calendar      },
      { type: 'link', label: 'Evidências',          to: '/industrial/evidencias',       icon: Camera        },
    ],
  },
  {
    key: 'documentos', emoji: '📄', label: 'DOCUMENTOS', color: '#8B5CF6',
    items: [
      { type: 'link', label: 'Projetos',            to: '/industrial/docs/projetos',    icon: FolderOpen    },
      { type: 'link', label: 'Procedimentos',       to: '/industrial/docs/procedimentos',icon: BookOpen     },
      { type: 'link', label: 'Relatórios Técnicos', to: '/industrial/docs/relatorios',  icon: FileBarChart  },
      { type: 'link', label: 'Certificados',        to: '/industrial/docs/certificados',icon: Award         },
      { type: 'link', label: 'Downloads',           to: '/industrial/docs/downloads',   icon: Download      },
    ],
  },
  {
    key: 'financeiro', emoji: '💰', label: 'FINANCEIRO', color: '#10B981',
    items: [
      { type: 'link', label: 'Faturas',             to: '/industrial/financeiro/faturas',    icon: Receipt    },
      { type: 'link', label: 'Boletos',             to: '/industrial/financeiro/boletos',    icon: Banknote   },
      { type: 'link', label: 'PIX',                 to: '/industrial/financeiro/pix',        icon: QrCode     },
      { type: 'link', label: 'Notas Fiscais',       to: '/industrial/financeiro/nf',         icon: FileMinus  },
      { type: 'link', label: 'Extrato',             to: '/industrial/financeiro/extrato',    icon: BarChart2  },
    ],
  },
  {
    key: 'consultorias', emoji: '🎓', label: 'CONSULTORIAS', color: '#F59E0B',
    items: [
      { type: 'link', label: 'Contratos',           to: '/industrial/consultorias/contratos',  icon: ScrollText    },
      { type: 'link', label: 'Agenda',              to: '/industrial/consultorias/agenda',     icon: CalendarCheck },
      { type: 'link', label: 'Auditorias',          to: '/industrial/consultorias/auditorias', icon: ShieldCheck   },
      { type: 'link', label: 'Treinamentos',        to: '/industrial/consultorias/treinamentos',icon: GraduationCap},
      { type: 'link', label: 'Relatórios',          to: '/industrial/consultorias/relatorios', icon: FileCheck     },
    ],
  },
  {
    key: 'atendimento', emoji: '📞', label: 'ATENDIMENTO', color: '#EF4444',
    items: [
      { type: 'link', label: 'Chamados',            to: '/industrial/atendimento/chamados',  icon: Headphones    },
      { type: 'link', label: 'Mensagens',           to: '/industrial/atendimento/mensagens', icon: MessageSquare },
      { type: 'link', label: 'Suporte',             to: '/industrial/atendimento/suporte',   icon: HelpCircle    },
    ],
  },
  {
    key: 'empresa', emoji: '👤', label: 'MINHA EMPRESA', color: '#64748B',
    items: [
      { type: 'link', label: 'Dados Cadastrais',    to: '/industrial/empresa/dados',          icon: Building2  },
      { type: 'link', label: 'Responsáveis',        to: '/industrial/empresa/responsaveis',   icon: Users      },
      { type: 'link', label: 'Unidades',            to: '/industrial/empresa/unidades',       icon: MapPin     },
      { type: 'link', label: 'Configurações',       to: '/industrial/empresa/configuracoes',  icon: Settings   },
    ],
  },
]

function SidebarLink({ item, color }: { item: NavLeaf; color: string }) {
  return (
    <NavLink
      to={item.to}
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

export function IndustrialLayout() {
  const { profile, signOut } = useAuth()
  const { pathname } = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [openSections, setOpenSections] = useState(new Set(SECTIONS.map(s => s.key)))

  useEffect(() => { setSidebarOpen(false) }, [pathname])

  const toggleSection = (k: string) => setOpenSections(prev => {
    const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n
  })

  const sidebar = (
    <aside className="w-[260px] h-screen bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-[var(--color-border)] flex-shrink-0">
        <Link to="/industrial" className="flex items-center gap-2">
          <img src="/logo-hero3.png" alt="Welder & Fusion" style={{ height: 36, width: 'auto', objectFit: 'contain' }} />
          <p className="text-[9px] uppercase tracking-widest leading-tight font-semibold" style={{ color: COLOR }}>Portal Industrial</p>
        </Link>
        <button className="md:hidden text-[var(--color-text-muted)]" onClick={() => setSidebarOpen(false)}>
          <ChevronLeft size={18} />
        </button>
      </div>

      {/* Dashboard root */}
      <div className="px-3 pt-3 pb-1 flex-shrink-0">
        <NavLink
          to="/industrial" end
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
                {section.items.map(item => <SidebarLink key={item.to} item={item} color={section.color} />)}
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
              <p className="text-xs font-semibold" style={{ color: COLOR }}>Cliente Industrial</p>
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
          <span className="font-semibold text-sm text-[var(--color-text)]">Portal Industrial</span>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1440px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
