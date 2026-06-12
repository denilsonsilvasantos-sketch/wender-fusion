import { Link } from 'react-router-dom'
import { Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer style={{ background: '#111111', borderTop: '1px solid #ffffff08' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/">
              <img
                src="/logo-hero2.png"
                alt="Welder & Fusion"
                style={{ height: 110, width: 'auto', objectFit: 'contain' }}
              />
            </Link>
            <p className="text-sm mt-4 leading-relaxed" style={{ color: '#6B7280' }}>
              Qualificação que Conecta o Seu Futuro.<br />
              Formando soldadores de excelência há mais de 12 anos.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="https://instagram.com/welder.fusion" target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
                style={{ background: '#FF8C0015', color: '#FF8C00' }}>
                <Instagram size={16} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
                style={{ background: '#FF8C0015', color: '#FF8C00' }}>
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Cursos */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#FF8C00' }}>
              Cursos
            </h4>
            <ul className="space-y-2.5">
              {[
                'Soldagem TIG (GTAW)',
                'Soldagem MIG/MAG (GMAW)',
                'Eletrodo Revestido (SMAW)',
                'Oxicorte',
              ].map(label => (
                <li key={label}>
                  <Link to="/cursos"
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: '#6B7280' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navegação */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#FF8C00' }}>
              Portal
            </h4>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Início' },
                { to: '/cursos', label: 'Cursos' },
                { to: '/cadastro', label: 'Criar Conta' },
                { to: '/login', label: 'Entrar' },
                { to: '/validar', label: 'Validar Certificado' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: '#6B7280' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#FF8C00' }}>
              Contato
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm" style={{ color: '#6B7280' }}>
                <MapPin size={15} className="flex-shrink-0 mt-0.5" style={{ color: '#FF8C00' }} />
                <span>Rua Cesar Stamm, 55<br />Cordeiros — Itajaí, SC</span>
              </li>
              <li>
                <a href="https://wa.me/5547988786738" target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 text-sm transition-colors hover:text-white"
                  style={{ color: '#6B7280' }}>
                  <Phone size={15} className="flex-shrink-0" style={{ color: '#FF8C00' }} />
                  (47) 98878-6738
                </a>
              </li>
              <li>
                <a href="mailto:escola.welderefusion@gmail.com"
                  className="flex items-center gap-3 text-sm transition-colors hover:text-white"
                  style={{ color: '#6B7280' }}>
                  <Mail size={15} className="flex-shrink-0" style={{ color: '#FF8C00' }} />
                  escola.welderefusion@gmail.com
                </a>
              </li>
            </ul>

            <a href="https://wa.me/5547988786738" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 mt-6 px-4 py-2.5 rounded-xl text-xs font-bold transition-all hover:opacity-90"
              style={{ background: '#FF8C00', color: '#000' }}>
              📲 WhatsApp — Garanta sua vaga
            </a>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid #ffffff08' }}>
          <p className="text-xs" style={{ color: '#374151' }}>
            &copy; {new Date().getFullYear()} Welder &amp; Fusion — Escola Profissionalizante de Soldadores. Todos os direitos reservados.
          </p>
          <p className="text-xs" style={{ color: '#374151' }}>
            Itajaí, SC — Brasil
          </p>
        </div>
      </div>
    </footer>
  )
}
