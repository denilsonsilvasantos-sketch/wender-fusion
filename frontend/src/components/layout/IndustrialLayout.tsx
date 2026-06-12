import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Avatar } from '@/components/ui'

const navItems = [
  { to: '/industrial', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { to: '/industrial/ordens', label: 'Ordens de Serviço', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { to: '/industrial/cotacoes', label: 'Cotações', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { to: '/industrial/financeiro', label: 'Financeiro', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
]

export function IndustrialLayout() {
  const { profile, signOut } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--color-surface)] border-r border-white/5 flex flex-col hidden lg:flex">
        <div className="p-6 border-b border-white/5">
          <Link to="/industrial" className="flex items-center gap-2">
            <span className="text-[var(--color-primary)] font-bold text-lg">W&F</span>
            <span className="text-white text-sm font-medium">Portal Industrial</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            const active = pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-[var(--color-primary)]/15 text-[var(--color-primary)]'
                    : 'text-[var(--color-text-muted)] hover:bg-white/5 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <Avatar name={profile?.name ?? 'Cliente'} avatarUrl={profile?.avatar_url} size="sm" />
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{profile?.name}</p>
              <p className="text-[var(--color-text-muted)] text-xs">Portal Industrial</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full text-left text-sm text-[var(--color-text-muted)] hover:text-white transition-colors px-2 py-1"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-[var(--color-surface)] border-b border-white/5 flex items-center justify-between px-4 h-14">
        <span className="text-[var(--color-primary)] font-bold">W&F Industrial</span>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-white p-1">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60" onClick={() => setMenuOpen(false)}>
          <div className="bg-[var(--color-surface)] w-64 h-full p-4 space-y-1" onClick={e => e.stopPropagation()}>
            {navItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-muted)] hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 pt-20 lg:pt-6 max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
