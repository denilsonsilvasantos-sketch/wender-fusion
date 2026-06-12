import { Link, NavLink } from 'react-router-dom'
import { Flame, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

export function PublicHeader() {
  const { user, profile } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'Início' },
    { to: '/cursos', label: 'Cursos' },
  ]

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 bg-[var(--color-primary)] rounded flex items-center justify-center">
              <Flame size={18} className="text-black" />
            </div>
            <span className="text-[var(--color-text)]">Welder <span className="text-[var(--color-primary)]">&amp;</span> Fusion</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cn('text-sm transition-colors', isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]')
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link to={profile?.role === 'admin' || profile?.role === 'instructor' ? '/admin' : '/aluno'}>
                <Button size="sm">Meu Painel</Button>
              </Link>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" size="sm">Entrar</Button></Link>
                <Link to="/cadastro"><Button size="sm">Cadastrar</Button></Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-[var(--color-text-secondary)]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} className="block py-2 text-[var(--color-text-secondary)]" onClick={() => setMobileOpen(false)}>{label}</Link>
            ))}
            {user ? (
              <Link to="/aluno" className="block" onClick={() => setMobileOpen(false)}>
                <Button size="sm" className="w-full">Meu Painel</Button>
              </Link>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">Entrar</Button>
                </Link>
                <Link to="/cadastro" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="w-full">Cadastrar</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
