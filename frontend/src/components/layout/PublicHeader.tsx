import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Calculator, Newspaper, Info, BookOpen, Home } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

const navLinks = [
  { to: '/',             label: 'Início',       icon: Home,       end: true  },
  { to: '/cursos',       label: 'Cursos',        icon: BookOpen,   end: false },
  { to: '/calculadora',  label: 'Calculadora',   icon: Calculator, end: false },
  { to: '/artigos',      label: 'Artigos',       icon: Newspaper,  end: false },
  { to: '/sobre',        label: 'Sobre',         icon: Info,       end: false },
]

export function PublicHeader() {
  const { user, profile } = useAuth()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  // Fecha menu ao navegar
  useEffect(() => { setOpen(false) }, [pathname])

  // Bloqueia scroll quando menu mobile aberto
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-md border-b"
        style={{ background: 'rgba(26,26,26,0.92)', borderColor: '#ffffff0d' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 gap-8">

            {/* ── Nav principal (desktop) — lado esquerdo ── */}
            <nav className="hidden md:flex items-center gap-1 flex-1">
              {navLinks.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) => cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'text-[#FF8C00] bg-[#FF8C0012]'
                      : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
                  )}
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* ── Auth (desktop) — lado direito ── */}
            <div className="hidden md:flex items-center gap-3 ml-auto">
              {user ? (
                <Link to={profile?.role === 'admin' || profile?.role === 'instructor' ? '/admin' : '/aluno'}>
                  <Button size="sm">Meu Painel</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">Entrar</Button>
                  </Link>
                  <Link to="/cadastro">
                    <Button size="sm">Cadastrar</Button>
                  </Link>
                </>
              )}
            </div>

            {/* ── Hamburger (mobile) ── */}
            <div className="flex md:hidden items-center justify-between w-full">
              <span className="text-sm font-bold" style={{ color: '#FF8C00' }}>W&amp;F</span>
              <button
                onClick={() => setOpen(v => !v)}
                className="p-2 rounded-lg transition-colors hover:bg-white/5"
                style={{ color: '#9CA3AF' }}
                aria-label="Menu"
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ── Drawer mobile ── */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />

          {/* Panel */}
          <div className="absolute left-0 top-0 bottom-0 w-72 flex flex-col"
            style={{ background: '#1A1A1A', borderRight: '1px solid #ffffff0d' }}>

            {/* Cabeçalho do drawer */}
            <div className="flex items-center justify-between px-5 h-14 border-b" style={{ borderColor: '#ffffff0d' }}>
              <span className="font-black text-lg">
                <span style={{ color: '#fff' }}>Welder </span>
                <span style={{ color: '#FF8C00' }}>&amp;</span>
                <span style={{ color: '#FF8C00' }}> Fusion</span>
              </span>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: '#9CA3AF' }}>
                <X size={20} />
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {navLinks.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) => cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    isActive
                      ? 'bg-[#FF8C0015] text-[#FF8C00]'
                      : 'text-[#9CA3AF] hover:bg-white/5 hover:text-white'
                  )}
                >
                  <Icon size={17} />
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Auth buttons */}
            <div className="p-4 border-t space-y-2" style={{ borderColor: '#ffffff0d' }}>
              {user ? (
                <Link to={profile?.role === 'admin' || profile?.role === 'instructor' ? '/admin' : '/aluno'}
                  className="block">
                  <Button className="w-full">Meu Painel</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" className="block">
                    <Button variant="outline" className="w-full">Entrar</Button>
                  </Link>
                  <Link to="/cadastro" className="block">
                    <Button className="w-full">Cadastrar</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
