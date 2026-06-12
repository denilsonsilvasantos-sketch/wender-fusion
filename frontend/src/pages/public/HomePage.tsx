import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Award, Users, Clock, Flame, Zap, Shield, Star, CheckCircle, Briefcase, BookOpen, Phone, MapPin, Mail } from 'lucide-react'
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
  const [logoFailed, setLogoFailed] = useState(false)

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
      <section className="relative min-h-[92vh] flex items-end overflow-hidden">

        {/* ── Foto de fundo (salve como frontend/public/welder-bg.jpg) ── */}
        <div className="absolute inset-0">
          {!logoFailed ? (
            <img
              src="/welder-bg.jpg"
              alt=""
              className="w-full h-full object-cover object-center"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            /* Fallback CSS quando a foto não existe */
            <div className="w-full h-full" style={{
              background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a00 40%, #2a1000 60%, #0f1520 100%)',
            }}>
              {/* Simula arco de solda no centro-direito */}
              <div className="absolute" style={{ right: '15%', top: '30%', width: 320, height: 320 }}>
                <div className="absolute inset-0 rounded-full blur-3xl"
                  style={{ background: 'radial-gradient(circle, #FF8C00 0%, #FF4500 30%, transparent 70%)', opacity: 0.35 }} />
                <div className="absolute inset-8 rounded-full blur-xl"
                  style={{ background: 'radial-gradient(circle, #fff 0%, #00BFFF 40%, transparent 70%)', opacity: 0.5 }} />
                {/* Spark rays */}
                {[...Array(14)].map((_, i) => {
                  const a = (i / 14) * 360
                  const r = a * Math.PI / 180
                  const len = 60 + (i % 3) * 30
                  return (
                    <div key={i} className="spark absolute rounded-full"
                      style={{
                        width: 3 + (i % 2), height: 3 + (i % 2),
                        left: `calc(50% + ${Math.cos(r) * (80 + len)}px)`,
                        top: `calc(50% + ${Math.sin(r) * (80 + len)}px)`,
                        background: i % 3 === 0 ? '#FF8C00' : i % 3 === 1 ? '#FFA500' : '#00BFFF',
                        animationDelay: `${(i * 0.22).toFixed(2)}s`,
                        animationDuration: `${(2 + i * 0.18).toFixed(2)}s`,
                      }} />
                  )
                })}
              </div>
              {/* Silhueta soldador estilizada */}
              <div className="absolute" style={{ right: '18%', bottom: '8%', opacity: 0.12 }}>
                <svg viewBox="0 0 200 340" width="200" height="340" fill="#FF8C00">
                  {/* Helmet */}
                  <ellipse cx="100" cy="60" rx="55" ry="55" />
                  <rect x="55" y="85" width="90" height="30" rx="4" fill="#000" opacity="0.6"/>
                  {/* Body */}
                  <path d="M55 115 Q30 160 25 240 L175 240 Q170 160 145 115 Z" />
                  {/* Arms */}
                  <path d="M55 130 Q20 160 15 200 L35 205 Q45 175 65 148 Z" />
                  <path d="M145 130 Q180 160 185 200 L165 205 Q155 175 135 148 Z" />
                  {/* Legs */}
                  <rect x="65" y="238" width="30" height="100" rx="8" />
                  <rect x="105" y="238" width="30" height="100" rx="8" />
                </svg>
              </div>
            </div>
          )}

          {/* Gradiente overlay: escuro à esquerda, transparente à direita */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to right, rgba(0,0,0,0.93) 0%, rgba(0,0,0,0.80) 35%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.15) 100%)',
          }} />
          {/* Gradiente inferior */}
          <div className="absolute inset-x-0 bottom-0 h-40" style={{
            background: 'linear-gradient(to top, #1A1A1A, transparent)',
          }} />
        </div>

        {/* Sparks animadas sobre a foto */}
        {SPARKS.map((s, i) => (
          <div key={i} className="spark absolute hidden lg:block rounded-full"
            style={{ top: s.top, left: s.left, width: s.size, height: s.size, background: s.color, animationDelay: s.delay, animationDuration: s.dur }} />
        ))}

        {/* ── Conteúdo ── */}
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-10">
          <div className="max-w-2xl">

            {/* Logo da escola acima do badge */}
            <div className="mb-5">
              <img
                src="/logo-hero.png"
                alt="Welder & Fusion"
                style={{ height: 200, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 2px 24px rgba(255,140,0,0.45))' }}
              />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 text-xs font-semibold uppercase tracking-widest"
              style={{ borderColor: '#FF8C0050', background: '#FF8C0018', color: '#FF8C00' }}>
              <Flame size={12} />
              Qualificação que Conecta o Seu Futuro
            </div>

            <h1 className="font-black leading-[1.05] mb-6 drop-shadow-2xl"
              style={{ fontSize: 'clamp(2.6rem, 6vw, 5rem)' }}>
              <span className="text-white">Transforme sua</span>
              <br />
              <span style={{ color: '#FF8C00' }}>Habilidade</span>
              <span className="text-white"> em</span>
              <br />
              <span style={{ color: '#FF8C00' }}>Oportunidades!</span>
            </h1>

            <p className="text-lg mb-8 max-w-xl leading-relaxed" style={{ color: '#D1D5DB' }}>
              Aprenda na prática com profissionais qualificados. Cursos de TIG, MIG/MAG e
              Eletrodo Revestido — com certificado reconhecido pelo mercado nacional.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link to="/cursos">
                <Button size="lg" rightIcon={<ArrowRight size={18} />}>
                  Ver Cursos Disponíveis
                </Button>
              </Link>
              <a href="https://wa.me/5547988786738" target="_blank" rel="noreferrer">
                <Button size="lg" variant="outline">
                  📲 Falar no WhatsApp
                </Button>
              </a>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-x-8 gap-y-4 pt-6 border-t" style={{ borderColor: '#ffffff15' }}>
              {STATS.map(({ value, label }) => (
                <div key={label}>
                  <p className="text-3xl font-black drop-shadow" style={{ color: '#FF8C00' }}>{value}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{label}</p>
                </div>
              ))}
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
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#fff' }}>Como Funciona</p>
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
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#fff' }}>Especialidades</p>
            <h2 className="text-4xl font-black text-white">Processos que você vai dominar</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { code: 'TIG', full: 'GTAW', color: '#FF8C00', desc: 'Soldagem de precisão com eletrodo de tungstênio. Ideal para aço inox, alumínio e titânio.' },
              { code: 'MIG/MAG', full: 'GMAW', color: '#FF8C00', desc: 'Alta produtividade com arame contínuo. O processo mais usado na indústria metal-mecânica.' },
              { code: 'Eletrodo', full: 'SMAW', color: '#FF8C00', desc: 'Processo versátil com eletrodo revestido. Fundamental para manutenção e estruturas.' },
              { code: 'Oxicorte', full: 'OFC', color: '#FF8C00', desc: 'Corte e conformação de peças metálicas com chama oxi-acetilênica. Base para caldeiraria.' },
            ].map(({ code, full, color, desc }) => (
              <div key={code} className="group p-6 rounded-2xl border text-center transition-all hover:-translate-y-1 cursor-default"
                style={{ background: '#242424', borderColor: '#ffffff0d' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = color + '50')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#ffffff0d')}>
                <div className="inline-flex flex-col items-center justify-center px-4 py-3 rounded-2xl mx-auto mb-4 min-w-[72px]"
                  style={{ background: color + '15' }}>
                  <span className="text-base font-black leading-none whitespace-nowrap" style={{ color }}>{code}</span>
                  <span className="text-[9px] font-mono mt-0.5" style={{ color: color + 'aa' }}>{full}</span>
                </div>
                <h3 className="font-bold text-white mb-2">{code}</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>{desc}</p>
              </div>
            ))}
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
              { icon: MapPin, title: 'Endereço', lines: ['Rua Cesar Stamm, 55', 'Cordeiros — Itajaí, SC'], color: '#FF8C00' },
              { icon: Phone, title: 'WhatsApp', lines: ['(47) 98878-6738', '(47) 9 8851-1768', 'Seg a Sex, 8h–18h'], color: '#25D366' },
              { icon: Mail, title: 'E-mail', lines: ['escola.welderefusion@gmail.com', ''], color: '#FF8C00' },
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
