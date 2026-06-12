import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Award, Users, Clock, Flame, Zap, Shield, Star, CheckCircle, Briefcase, BookOpen, Phone, MapPin, Mail } from 'lucide-react'
import { Button, WFLogo } from '@/components/ui'
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

            {/* RIGHT — logo hero image */}
            <div className="hidden lg:flex justify-center items-center relative">
              <div className="relative">
                {/* Glow behind image */}
                <div className="absolute inset-0 blur-3xl opacity-30 scale-90"
                  style={{ background: 'radial-gradient(circle, #FF8C00 0%, #00BFFF 60%, transparent 80%)' }} />

                {/* Logo image — save your logo as frontend/public/logo-hero.png */}
                <img
                  src="/logo-hero.png"
                  alt="Welder & Fusion"
                  className="relative w-[460px] drop-shadow-2xl"
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                />

                {/* Fallback shown when image not found */}
                <div className="fallback-logo flex flex-col items-center gap-4 py-8">
                  <WFLogo size="xl" showSubtitle />
                  <p className="text-xs text-center max-w-xs" style={{ color: '#4B5563' }}>
                    Salve o logo em <code className="text-[#FF8C00]">frontend/public/logo-hero.png</code>
                  </p>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-4 -left-6 bg-[#242424] border rounded-xl px-4 py-3 shadow-2xl"
                  style={{ borderColor: '#FF8C0040' }}>
                  <p className="text-2xl font-black" style={{ color: '#FF8C00' }}>500+</p>
                  <p className="text-xs" style={{ color: '#6B7280' }}>Alunos Formados</p>
                </div>
                <div className="absolute -bottom-4 -right-6 bg-[#242424] border rounded-xl px-4 py-3 shadow-2xl"
                  style={{ borderColor: '#00BFFF30' }}>
                  <p className="text-2xl font-black" style={{ color: '#00BFFF' }}>98%</p>
                  <p className="text-xs" style={{ color: '#6B7280' }}>Empregados em 3 meses</p>
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

      {/* ── TÉCNICAS DE SOLDAGEM ─────────────────────────────────────── */}
      <section className="py-24" style={{ background: '#1A1A1A' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#00BFFF' }}>Especialidades</p>
            <h2 className="text-4xl font-black text-white">Processos que você vai dominar</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { code: 'TIG', full: 'GTAW', color: '#00BFFF', desc: 'Soldagem de precisão com eletrodo de tungstênio. Ideal para aço inox, alumínio e titânio.' },
              { code: 'MIG/MAG', full: 'GMAW', color: '#FF8C00', desc: 'Alta produtividade com arame contínuo. O processo mais usado na indústria metal-mecânica.' },
              { code: 'Eletrodo', full: 'SMAW', color: '#FFA500', desc: 'Processo versátil com eletrodo revestido. Fundamental para manutenção e estruturas.' },
              { code: 'Oxicorte', full: 'OFC', color: '#00BFFF', desc: 'Corte e conformação de peças metálicas com chama oxi-acetilênica. Base para caldeiraria.' },
            ].map(({ code, full, color, desc }) => (
              <div key={code} className="group p-6 rounded-2xl border text-center transition-all hover:-translate-y-1 cursor-default"
                style={{ background: '#242424', borderColor: '#ffffff0d' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = color + '50')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#ffffff0d')}>
                <div className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center mx-auto mb-4"
                  style={{ background: color + '15' }}>
                  <span className="text-lg font-black leading-none" style={{ color }}>{code}</span>
                  <span className="text-[9px] font-mono mt-0.5" style={{ color: color + 'aa' }}>{full}</span>
                </div>
                <h3 className="font-bold text-white mb-2">{code}</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOBRE A ESCOLA ───────────────────────────────────────────── */}
      <section className="py-24" style={{ background: '#242424' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#FF8C00' }}>Sobre Nós</p>
              <h2 className="text-4xl font-black text-white mb-6">
                Referência em formação de soldadores no Brasil
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#9CA3AF' }}>
                A Welder & Fusion nasceu da necessidade do mercado por profissionais qualificados
                em soldagem. Com mais de 12 anos formando soldadores, nossa metodologia une teoria,
                prática intensiva e acompanhamento individualizado.
              </p>
              <p className="text-base leading-relaxed mb-8" style={{ color: '#9CA3AF' }}>
                Todos os nossos instrutores possuem certificação AWS CWI (Certified Welding Inspector)
                e experiência comprovada em indústrias como petroquímica, aeronáutica e siderurgia.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Certificação AWS', 'Normas ABNT/ISO', 'Equipamentos de Última Geração', 'Empregabilidade Garantida'].map(tag => (
                  <span key={tag} className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border"
                    style={{ borderColor: '#FF8C0030', color: '#FF8C00', background: '#FF8C0010' }}>
                    <CheckCircle size={12} /> {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '12+', label: 'Anos formando profissionais', color: '#FF8C00' },
                { value: '500+', label: 'Alunos certificados', color: '#00BFFF' },
                { value: '98%', label: 'Taxa de empregabilidade', color: '#FF8C00' },
                { value: '15+', label: 'Empresas parceiras', color: '#00BFFF' },
              ].map(({ value, label, color }) => (
                <div key={label} className="p-6 rounded-2xl text-center"
                  style={{ background: '#1A1A1A', border: `1px solid ${color}20` }}>
                  <p className="text-4xl font-black mb-2" style={{ color }}>{value}</p>
                  <p className="text-sm" style={{ color: '#6B7280' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="py-24" style={{ background: '#1A1A1A' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#FF8C00' }}>Dúvidas Frequentes</p>
            <h2 className="text-4xl font-black text-white">Perguntas Frequentes</h2>
          </div>

          <div className="space-y-3">
            {[
              { q: 'Preciso de experiência prévia para me matricular?', a: 'Não! Temos cursos para todos os níveis, do iniciante absoluto ao técnico avançado. Nossa metodologia é pensada para que qualquer pessoa aprenda soldagem na prática.' },
              { q: 'O certificado é reconhecido pelo mercado?', a: 'Sim. Nossos certificados possuem QR code de validação online e são aceitos pelas principais indústrias do Brasil. Alguns cursos também preparam para as certificações AWS internacionais.' },
              { q: 'Qual a duração dos cursos?', a: 'Varia por modalidade: cursos básicos têm de 40h a 80h; especializações chegam a 200h. Todos com opções de turno manhã, tarde ou noite para encaixar na sua rotina.' },
              { q: 'Como funciona o portal do aluno?', a: 'Após a matrícula você acessa o portal online com material de apoio, agenda de aulas, frequência, notas, pagamentos e seu certificado digital — tudo num só lugar.' },
              { q: 'Vocês têm parceria com empresas para emprego?', a: 'Sim! Mantemos um banco de talentos e parcerias com mais de 15 empresas do setor. Alunos certificados têm acesso exclusivo às vagas e podem cadastrar o currículo no portal.' },
            ].map(({ q, a }, i) => (
              <details key={i} className="group rounded-xl border overflow-hidden" style={{ borderColor: '#ffffff0d', background: '#242424' }}>
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-semibold text-white text-sm select-none">
                  {q}
                  <span className="text-xl leading-none ml-4 flex-shrink-0 transition-transform group-open:rotate-45" style={{ color: '#FF8C00' }}>+</span>
                </summary>
                <div className="px-5 pb-4 text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTATO ──────────────────────────────────────────────────── */}
      <section className="py-24" style={{ background: '#242424' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#FF8C00' }}>Localização</p>
            <h2 className="text-4xl font-black text-white">Venha nos conhecer</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: MapPin, title: 'Endereço', lines: ['Rua das Indústrias, 1450', 'Distrito Industrial — SP', 'CEP 00000-000'], color: '#FF8C00' },
              { icon: Phone, title: 'Telefone / WhatsApp', lines: ['(11) 99999-9999', '(11) 3333-4444', 'Seg a Sex, 8h–18h'], color: '#00BFFF' },
              { icon: Mail, title: 'E-mail', lines: ['contato@welderfusion.com.br', 'matriculas@welderfusion.com.br', ''], color: '#FF8C00' },
            ].map(({ icon: Icon, title, lines, color }) => (
              <div key={title} className="p-6 rounded-2xl text-center border"
                style={{ background: '#1A1A1A', borderColor: '#ffffff0d' }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: color + '15' }}>
                  <Icon size={24} style={{ color }} />
                </div>
                <h3 className="font-bold text-white mb-3">{title}</h3>
                {lines.filter(Boolean).map(l => (
                  <p key={l} className="text-sm" style={{ color: '#9CA3AF' }}>{l}</p>
                ))}
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
