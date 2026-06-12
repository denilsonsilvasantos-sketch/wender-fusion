import { Link } from 'react-router-dom'
import { Flame, Instagram, Youtube, Phone, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 font-bold text-lg mb-3">
              <div className="w-8 h-8 bg-[var(--color-primary)] rounded flex items-center justify-center">
                <Flame size={18} className="text-black" />
              </div>
              <span>Welder <span className="text-[var(--color-primary)]">&amp;</span> Fusion</span>
            </Link>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              Escola profissionalizante de soldadores. Formando profissionais de excelência desde o início.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"><Youtube size={20} /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-4">Navegação</h4>
            <ul className="space-y-2">
              {[{ to: '/', label: 'Início' }, { to: '/cursos', label: 'Cursos' }, { to: '/login', label: 'Entrar' }].map(({ to, label }) => (
                <li key={to}><Link to={to} className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-4">Contato</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                <Phone size={14} className="text-[var(--color-primary)]" />
                <span>(00) 00000-0000</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                <Mail size={14} className="text-[var(--color-primary)]" />
                <span>contato@welderfusion.com.br</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--color-text-muted)]">
            &copy; {new Date().getFullYear()} Welder &amp; Fusion. Todos os direitos reservados.
          </p>
          <div className="h-px flex-1 max-w-32 bg-gradient-to-r from-[var(--color-primary)] to-transparent hidden sm:block" />
        </div>
      </div>
    </footer>
  )
}
