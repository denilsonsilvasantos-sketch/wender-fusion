import { useState } from 'react'
import { Outlet, NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, User, CreditCard, Award, Calculator,
  ClipboardList, CalendarCheck, LogOut, Menu, X, ChevronLeft,
  Briefcase, Star
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Avatar, WFLogo } from '@/components/ui'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/aluno', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/aluno/cursos', label: 'Meus Cursos', icon: BookOpen },
  { to: '/aluno/avaliacoes', label: 'Avaliações', icon: ClipboardList },
  { to: '/aluno/presenca', label: 'Presença', icon: CalendarCheck },
  { to: '/aluno/certificados', label: 'Certificados', icon: Award },
  { to: '/aluno/pagamentos', label: 'Pagamentos', icon: CreditCard },
  { to: '/aluno/calculadora', label: 'Calculadora', icon: Calculator },
  { to: '/aluno/vagas', label: 'Vagas de Emprego', icon: Briefcase },
  { to: '/aluno/talento', label: 'Banco de Talentos', icon: Star },
  { to: '/aluno/perfil', label: 'Perfil', icon: User },
]

export function StudentLayout() {
  const { profile, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-[var(--color-bg)]">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed md:sticky top-0 h-screen w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col z-40 transition-transform duration-200',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-[var(--color-border)]">
          <Link to="/"><WFLogo size="sm" showSubtitle /></Link>
          <button className="md:hidden text-[var(--color-text-muted)]" onClick={() => setSidebarOpen(false)}>
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] font-medium'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)]'
              )}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 pb-4 border-t border-[var(--color-border)] pt-3">
          {profile && (
            <div className="flex items-center gap-3 px-2 py-2 rounded-md bg-[var(--color-surface-elevated)] mb-2">
              <Avatar name={profile.name} avatarUrl={profile.avatar_url} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[var(--color-text)] truncate">{profile.name}</p>
                <p className="text-xs text-[var(--color-text-muted)] truncate">{profile.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-danger)] transition-colors"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="md:hidden sticky top-0 z-20 h-14 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center gap-3 px-4">
          <button onClick={() => setSidebarOpen(true)} className="text-[var(--color-text-secondary)]">
            <Menu size={20} />
          </button>
          <span className="font-semibold text-sm">Portal do Aluno</span>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
