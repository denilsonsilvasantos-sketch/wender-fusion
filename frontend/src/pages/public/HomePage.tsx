import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Award, Users, Clock, Flame, Zap, Shield, Star, CheckCircle, Briefcase, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui'
import { supabase } from '@/lib/supabase'
import type { Course } from '@/types'
import { formatCurrency, LEVEL_LABELS } from '@/lib/utils'
import { getThumbnailUrl } from '@/lib/cloudinary'

const SPARKS = [
  { top: '15%', left: '55%', color: '#FF8C00', size: 4, delay: '0s', dur: '3s' },
  { top: '25%', left: '72%', color: '#00BFFF', size: 3, delay: '0.5s', dur: '2.5s' },
  { top: '40%', left: '62%', color: '#FF8C00', size: 5, delay: '1s', dur: '3.5s' },
  { top: '55%', left: '80%', color: '#FFA500', size: 3, delay: '0.2s', dur: '2.8s' },
  { top: '35%', left: '88%', color: '#00BFFF', size: 4, delay: '1.5s', dur: '3.2s' },
  { top: '65%', left: '68%', color: '#FF8C00', size: 3, delay: '0.8s', dur: '2.6s' },
  { top: '20%', left: '82%', color: '#FFA500', size: 5, delay: '2s', dur: '3s' },
  { top: '75%', left: '75%', color: '#00BFFF', size: 3, delay: '1.2s', dur: '2.4s' },
]

const STATS = [
  { value: '500+', label: 'Alunos Formados' },
  { value: '15+', label: 'Cursos Ativos' },
  { value: '98%', label: 'Empregados em 3 meses' },
  { value: '12+', label: 'Anos de Experiência' },
]

const FEATURES = [
  { icon: Flame, title: 'Prática Intensiva', desc: 'Laboratórios equipados com máquinas profissionais de soldagem TIG, MIG/MAG e Eletrodo.' },
  { icon: Users, title: 'Turmas Reduzidas', desc: 'Máximo 10 alunos por turma para acompanhamento individualizado e foco no aprendizado.' },
  { icon: Award, title: 'Certificado Reconhecido', desc: 'Certificação profissional com QR code de validação, aceita pelo mercado nacional.' },
  { icon: Zap, title: 'Conteúdo Atualizado', desc: 'Módulos alinhados com as normas ABNT, AWS e técnicas mais exigidas pelo mercado.' },
  { icon: Shield, title: 'Segurança em 1º Lugar', desc: 'Treinamento em NR-9, NR-10 e uso correto de EPIs específicos para soldagem.' },
  { icon: Clock, title: 'Flexibilidade Total', desc: 'Turmas manhã, tarde e noite. Escolha o horário que encaixa na sua rotina.' },
]

const STEPS = [
  { n: '01', icon: BookOpen, title: 'Escolha seu Curso', desc: 'Browse nossa grade completa de cursos e encontre o nível ideal para você.' },
  { n: '02', icon: Flame, title: 'Aprenda na Prática', desc: 'Aulas presenciais com instrutores certificados e equipamentos profissionais.' },
  { n: '03', icon: Award, title: 'Receba seu Certificado', desc: 'Certificado digital com QR code de validação, reconhecido em todo o Brasil.' },
  { n: '04', icon: Briefcase, title: 'Entre no Mercado', desc: 'Acesse nossas vagas de emprego e banco de talentos para empresas parceiras.' },
]

const TESTIMONIALS = [
  { name: 'Carlos Oliveira', role: 'Soldador Industrial — Petrobras', text: 'O curso mudou minha vida. Consegui emprego em 2 semanas após o certificado. Instrutores de altíssimo nível.', stars: 5 },
  { name: 'Ana Santos', role: 'Caldeireirista — Vale', text: 'Excelente estrutura e professores muito dedicados. A parte prática é intensa e prepara de verdade para o mercado.', stars: 5 },
  { name: 'Rafael Costa', role: 'Técnico em Soldagem — Embraer', text: 'Aprendi muito mais do que esperava. Conteúdo prático, objetivo e alinhado com o que as empresas exigem.', stars: 5 },
]

export function HomePage() {
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    supabase
      .from('courses')
      .select('id, title, slug, thumbnail_url, level, duration_hours, price, enrolled_count')
      .eq('status', 'published')
      .order('enrolled_count', { ascending: false })
      .limit(3)
      .then(({ data }) => setCourses((data || []) as unknown as Course[]))
  }, [])

  return (
    <>
      <style>{`
        @keyframes spark-float {
          0%   { transform: translateY(0) scale(1); opacity: 0.8; }
          50%  { transform: translateY(-18px) scale(1.4); opacity: 1; }
          100% { transform: translateY(-36px) scale(0.6); opacity: 0; }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.06; }
          50%       { opacity: 0.14; }
        }
        @keyframes arc-flicker {
          0%, 100% { opacity: 1; }
          45%      { opacity: 0.85; }
          50%      { opacity: 1; }
          75%      { opacity: 0.9; }
        }
        .spark { animation: spark-float linear infinite; }
        .glow-orb { animation: glow-pulse 4s ease-in-out infinite; }
        .arc { animation: arc-flicker 0.15s linear infinite; }
      `}</style>

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* BG glows */}
        <div className="glow-orb absolute -top-32 right-[5%] w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, #FF8C00 0%, transparent 70%)' }} />
        <div className="glow-orb absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, #00BFFF 0%, transparent 70%)', animationDelay: '2s' }} />

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        {/* Sparks (right side) */}
        {SPARKS.map((s, i) => (
          <div key={i} className="spark absolute hidden lg:block rounded-full"
            style={{ top: s.top, left: s.left, width: s.size, height: s.size, background: s.color, animationDelay: s.delay, animationDuration: s.dur }} />
        ))}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* LEFT — copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-7 text-xs font-semibold uppercase tracking-widest"
                style={{ borderColor: '#FF8C0033', background: '#FF8C0010', color: '#FF8C00' }}>
                <Flame size={12} />
                Escola Profissionalizante de Soldadores
              </div>

              <h1 className="font-black leading-[1.05] mb-6" style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)' }}>
                <span className="text-white">Solde com</span>{' '}
                <span style={{ color: '#FF8C00' }}>Precisão.</span>
                <br />
                <span className="text-white">Trabalhe com</span>{' '}
                <span style={{ color: '#00BFFF' }}>Confiança.</span>
              </h1>

              <p className="text-lg mb-9 max-w-lg leading-relaxed" style={{ color: '#9CA3AF' }}>
                Cursos presenciais de soldagem com metodologia prática e instrutores certificados.
                Do iniciante ao profissional avançado — com certificado validado por QR code.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Link to="/cursos">
                  <Button size="lg" rightIcon={<ArrowRight size={18} />}>
                    Ver Cursos Disponíveis
                  </Button>
                </Link>
                <Link to="/cadastro">
                  <Button size="lg" variant="outline">Criar Conta Grátis</Button>
                </Link>
              </div>

              {/* Mini stats */}
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                {STATS.slice(0, 3).map(({ value, label }) => (
                  <div key={label}>
                    <p className="text-3xl font-black" style={{ color: '#FF8C00' }}>{value}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — welding arc visual */}
            <div className="hidden lg:flex justify-center items-center relative">
              <div className="relative w-[420px] h-[420px]">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full"
                  style={{ background: 'conic-gradient(from 180deg, #FF8C0022, #00BFFF22, #FF8C0022)', filter: 'blur(2px)' }} />

                {/* Main circle */}
                <div className="absolute inset-4 rounded-full border"
                  style={{ background: '#1a1a1a', borderColor: '#FF8C0030' }} />

                {/* Arc center piece */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Arc glow */}
                    <div className="absolute inset-0 rounded-full blur-2xl" style={{ background: '#FF8C00', opacity: 0.2, width: 160, height: 160, top: -10, left: -10 }} />

                    {/* SVG arc */}
                    <svg width="140" height="140" viewBox="0 0 140 140" className="arc">
                      {/* Electrode */}
                      <line x1="70" y1="10" x2="70" y2="55" stroke="#9CA3AF" strokeWidth="6" strokeLinecap="round"/>
                      {/* Arc rays */}
                      {[...Array(8)].map((_, i) => {
                        const angle = (i * 45) * Math.PI / 180
                        const x1 = 70 + Math.cos(angle) * 20
                        const y1 = 70 + Math.sin(angle) * 20
                        const x2 = 70 + Math.cos(angle) * 50
                        const y2 = 70 + Math.sin(angle) * 50
                        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                          stroke={i % 2 === 0 ? '#FF8C00' : '#00BFFF'}
                          strokeWidth={i % 2 === 0 ? 2 : 1.5}
                          strokeLinecap="round" opacity={0.7} />
                      })}
                      {/* Arc center */}
                      <circle cx="70" cy="70" r="12" fill="#FF8C00" opacity="0.9"/>
                      <circle cx="70" cy="70" r="6" fill="white" opacity="0.95"/>
                      {/* Weld pool */}
                      <ellipse cx="70" cy="88" rx="16" ry="6" fill="#FF8C00" opacity="0.4"/>
                      <ellipse cx="70" cy="88" rx="10" ry="4" fill="#FFA500" opacity="0.6"/>
                    </svg>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-2 -left-8 bg-[#242424] border rounded-xl px-4 py-3 shadow-2xl"
                  style={{ borderColor: '#FF8C0030' }}>
                  <p className="text-2xl font-black" style={{ color: '#FF8C00' }}>500+</p>
                  <p className="text-xs" style={{ color: '#6B7280' }}>Alunos Formados</p>
                </div>
                <div className="absolute -bottom-2 -right-8 bg-[#242424] border rounded-xl px-4 py-3 shadow-2xl"
                  style={{ borderColor: '#00BFFF30' }}>
                  <p className="text-2xl font-black" style={{ color: '#00BFFF' }}>98%</p>
                  <p className="text-xs" style={{ color: '#6B7280' }}>Empregados</p>
                </div>
                <div className="absolute top-1/2 -right-12 -translate-y-1/2 bg-[#242424] border rounded-xl px-4 py-3 shadow-2xl"
                  style={{ borderColor: '#FF8C0030' }}>
                  <div className="flex items-center gap-2">
                    <Award size={16} style={{ color: '#FF8C00' }} />
                    <span className="text-sm font-semibold text-white">Certificado</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>QR Code validado</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────── */}
      <div style={{ background: '#FF8C00' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-black/20">
            {STATS.map(({ value, label }) => (
              <div key={label} className="py-6 px-4 text-center">
                <p className="text-3xl font-black text-black">{value}</p>
                <p className="text-sm text-black/70 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURED COURSES ─────────────────────────────────────────── */}
      {courses.length > 0 && (
        <section className="py-24" style={{ background: '#1A1A1A' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#FF8C00' }}>Grade Curricular</p>
                <h2 className="text-4xl font-black text-white">Cursos em Destaque</h2>
              </div>
              <Link to="/cursos" className="hidden md:flex items-center gap-2 text-sm font-medium transition-colors"
                style={{ color: '#FF8C00' }}>
                Ver todos <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Link key={course.id} to={`/cursos/${course.id}`}
                  className="group rounded-2xl overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-2xl"
                  style={{ background: '#242424', borderColor: '#ffffff0d' }}>
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden" style={{ background: '#1A1A1A' }}>
                    {course.thumbnail_url ? (
                      <img src={getThumbnailUrl(course.thumbnail_url!)} alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Flame size={48} style={{ color: '#FF8C0030' }} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-3 left-3 text-xs font-semibold uppercase px-2 py-1 rounded-md"
                      style={{ background: '#FF8C00', color: '#000' }}>
                      {LEVEL_LABELS[course.level as keyof typeof LEVEL_LABELS] ?? course.level}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-white text-lg mb-2 leading-snug group-hover:text-[#FF8C00] transition-colors">{course.title}</h3>
                    <div className="flex items-center gap-4 text-sm mb-4" style={{ color: '#6B7280' }}>
                      {course.duration_hours && (
                        <span className="flex items-center gap-1"><Clock size={13}/> {course.duration_hours}h</span>
                      )}
                      {course.enrolled_count != null && (
                        <span className="flex items-center gap-1"><Users size={13}/> {course.enrolled_count} alunos</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-black" style={{ color: '#FF8C00' }}>
                        {course.price === 0 ? 'Gratuito' : formatCurrency(course.price)}
                      </span>
                      <span className="text-xs font-medium flex items-center gap-1 transition-colors" style={{ color: '#FF8C00' }}>
                        Ver curso <ArrowRight size={13}/>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10 md:hidden">
              <Link to="/cursos"><Button variant="outline">Ver Todos os Cursos</Button></Link>
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURES ─────────────────────────────────────────────────── */}
      <section className="py-24" style={{ background: '#242424' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#FF8C00' }}>Diferenciais</p>
            <h2 className="text-4xl font-black text-white">Por que escolher a Welder & Fusion?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title}
                className="group p-6 rounded-2xl border cursor-default transition-all hover:-translate-y-1"
                style={{ background: '#1A1A1A', borderColor: '#ffffff0d' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#FF8C0040')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#ffffff0d')}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors"
                  style={{ background: '#FF8C0015' }}>
                  <Icon size={22} style={{ color: '#FF8C00' }} />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="py-24" style={{ background: '#1A1A1A' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#00BFFF' }}>Como Funciona</p>
            <h2 className="text-4xl font-black text-white">Sua jornada do zero ao emprego</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* connecting line */}
            <div className="hidden md:block absolute top-9 left-[12.5%] right-[12.5%] h-px"
              style={{ background: 'linear-gradient(90deg, #FF8C00, #00BFFF)' }} />

            {STEPS.map(({ n, icon: Icon, title, desc }) => (
              <div key={n} className="relative text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 relative z-10"
                  style={{ background: '#242424', border: '2px solid #FF8C00' }}>
                  <Icon size={24} style={{ color: '#FF8C00' }} />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#FF8C00' }}>Passo {n}</p>
                <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="py-24" style={{ background: '#242424' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#FF8C00' }}>Depoimentos</p>
            <h2 className="text-4xl font-black text-white">O que nossos alunos dizem</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, text, stars }) => (
              <div key={name} className="p-7 rounded-2xl border relative"
                style={{ background: '#1A1A1A', borderColor: '#ffffff0d' }}>
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} size={14} style={{ fill: '#FF8C00', color: '#FF8C00' }} />
                  ))}
                </div>
                <p className="text-base italic leading-relaxed mb-6" style={{ color: '#9CA3AF' }}>"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{ background: '#FF8C0020', color: '#FF8C00' }}>
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{name}</p>
                    <p className="text-xs" style={{ color: '#6B7280' }}>{role}</p>
                  </div>
                </div>
                {/* quote mark */}
                <span className="absolute top-5 right-6 text-6xl font-black leading-none select-none"
                  style={{ color: '#FF8C0015' }}>"</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden" style={{ background: '#1A1A1A' }}>
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, #FF8C0012 0%, transparent 70%)' }} />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: '#FF8C00' }}>
            <Flame size={28} className="text-black" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-5">
            Pronto para começar?
          </h2>
          <p className="text-lg mb-8" style={{ color: '#9CA3AF' }}>
            Vagas limitadas por turma. Garanta a sua agora e transforme sua carreira na soldagem.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/cursos">
              <Button size="lg" rightIcon={<ArrowRight size={18} />}>Ver Todos os Cursos</Button>
            </Link>
            <Link to="/cadastro">
              <Button size="lg" variant="outline">Criar Conta Grátis</Button>
            </Link>
          </div>
          <div className="mt-10 flex items-center justify-center gap-6 text-sm" style={{ color: '#6B7280' }}>
            {['Sem taxa de matrícula', 'Certificado incluso', 'Suporte pós-curso'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle size={14} style={{ color: '#FF8C00' }} /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
