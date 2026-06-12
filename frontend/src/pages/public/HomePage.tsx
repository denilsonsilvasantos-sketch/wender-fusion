import { Link } from 'react-router-dom'
import { ArrowRight, Award, Users, Clock, Flame, Zap, Shield, Star } from 'lucide-react'
import { Button } from '@/components/ui'

export function HomePage() {
  const features = [
    { icon: <Flame size={24} />, title: 'Prática Intensiva', desc: 'Laboratórios equipados com as mais modernas máquinas de soldagem' },
    { icon: <Users size={24} />, title: 'Turmas Reduzidas', desc: 'Acompanhamento personalizado com turmas de no máximo 10 alunos' },
    { icon: <Award size={24} />, title: 'Certificado Reconhecido', desc: 'Certificação profissional aceita pelo mercado nacional' },
    { icon: <Zap size={24} />, title: 'Módulos Atualizados', desc: 'Conteúdo alinhado com as normas técnicas mais recentes' },
    { icon: <Shield size={24} />, title: 'Segurança em 1º Lugar', desc: 'Treinamento completo em NR-9, NR-10 e EPIs específicos' },
    { icon: <Clock size={24} />, title: 'Flexibilidade', desc: 'Turmas manhã, tarde e noite para você encaixar na sua rotina' },
  ]

  const testimonials = [
    { name: 'Carlos Oliveira', role: 'Soldador Industrial', text: 'O curso mudou minha vida. Consegui emprego em 2 semanas após o certificado.', stars: 5 },
    { name: 'Ana Santos', role: 'Caldeireirista', text: 'Excelente estrutura e professores muito dedicados. Recomendo!', stars: 5 },
    { name: 'Rafael Costa', role: 'Técnico em Soldagem', text: 'Aprendi muito mais do que esperava. Conteúdo prático e objetivo.', stars: 5 },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg)] via-[var(--color-surface)] to-[var(--color-bg)]" />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--color-primary) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--color-primary)] opacity-5 rounded-full blur-3xl" />
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-[var(--color-secondary)] opacity-5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-primary-light)] border border-[var(--color-primary)]/30 text-[var(--color-primary)] text-xs font-medium uppercase tracking-wider mb-6">
              <Flame size={12} />
              Escola Profissionalizante de Soldadores
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-6">
              <span className="text-[var(--color-text)]">Solde com</span>
              <br />
              <span className="text-[var(--color-primary)]">Precisão.</span>
              <br />
              <span className="text-[var(--color-text)]">Trabalhe com</span>
              <br />
              <span className="text-[var(--color-secondary)]">Confiança.</span>
            </h1>
            <p className="text-lg text-[var(--color-text-secondary)] mb-8 max-w-xl leading-relaxed">
              Cursos presenciais de soldagem com metodologia prática e instrutores certificados.
              Do iniciante ao profissional avançado.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/cursos">
                <Button size="lg" rightIcon={<ArrowRight size={18} />}>
                  Ver Cursos
                </Button>
              </Link>
              <Link to="/cadastro">
                <Button size="lg" variant="outline">
                  Criar Conta
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-10">
              {[['500+', 'Alunos Formados'], ['15+', 'Cursos Disponíveis'], ['98%', 'Taxa de Empregabilidade']].map(([num, label]) => (
                <div key={label}>
                  <p className="text-2xl font-black text-[var(--color-primary)]">{num}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-[var(--color-text)] mb-3">Por que escolher a Welder & Fusion?</h2>
            <div className="h-1 w-16 bg-[var(--color-primary)] mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="p-6 bg-[var(--color-surface-elevated)] rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-colors group">
                <div className="w-12 h-12 bg-[var(--color-primary-light)] rounded-lg flex items-center justify-center text-[var(--color-primary)] mb-4 group-hover:scale-110 transition-transform">
                  {icon}
                </div>
                <h3 className="font-semibold text-[var(--color-text)] mb-2">{title}</h3>
                <p className="text-sm text-[var(--color-text-muted)]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-[var(--color-text)] mb-3">O que nossos alunos dizem</h2>
            <div className="h-1 w-16 bg-[var(--color-primary)] mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, text, stars }) => (
              <div key={name} className="p-6 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} size={14} className="fill-[var(--color-primary)] text-[var(--color-primary)]" />
                  ))}
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] mb-4 italic">"{text}"</p>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text)]">{name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[var(--color-surface)]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-[var(--color-text)] mb-4">
            Pronto para começar sua jornada?
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-8">
            Vagas limitadas por turma. Garanta a sua agora e transforme sua carreira.
          </p>
          <Link to="/cursos">
            <Button size="lg" rightIcon={<ArrowRight size={18} />}>
              Ver Todos os Cursos
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
