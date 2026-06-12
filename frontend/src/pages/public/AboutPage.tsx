import { Link } from 'react-router-dom'
import { CheckCircle, ArrowRight, MapPin, Phone, Mail, Target, Eye, Heart } from 'lucide-react'
import { Button } from '@/components/ui'

const VALUES = [
  { icon: '🔥', title: 'Excelência', desc: 'Padrão máximo em ensino, infraestrutura e atendimento ao aluno.' },
  { icon: '🤝', title: 'Comprometimento', desc: 'Do primeiro contato ao certificado, estamos com você em cada etapa.' },
  { icon: '🛡️', title: 'Segurança', desc: 'Treinamento rigoroso em NRs e uso correto de EPIs em todas as aulas.' },
  { icon: '⚡', title: 'Inovação', desc: 'Currículo atualizado com as tecnologias e normas mais recentes do mercado.' },
  { icon: '💼', title: 'Empregabilidade', desc: 'Nossa missão não termina no certificado — conectamos você ao mercado.' },
  { icon: '🏆', title: 'Qualidade', desc: 'Instrutores com certificação AWS e experiência em grandes indústrias.' },
]

const TEAM = [
  { name: 'Equipe de Instrutores', role: 'Certificados AWS CWI', desc: 'Todos com experiência comprovada em indústrias como petroquímica, aeronáutica e siderurgia.', initial: 'I' },
  { name: 'Coordenação Pedagógica', role: 'Gestão de Aprendizagem', desc: 'Acompanhamento individual de cada aluno, do nivelamento à certificação final.', initial: 'P' },
  { name: 'Núcleo de Empregabilidade', role: 'Oportunidades de Carreira', desc: 'Time dedicado a conectar alunos formados com as empresas parceiras.', initial: 'E' },
]

export function AboutPage() {
  return (
    <div style={{ background: '#1A1A1A' }}>

      {/* ── HERO ── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute right-0 top-0 w-[500px] h-[500px] blur-3xl opacity-10 rounded-full"
          style={{ background: 'radial-gradient(circle, #FF8C00, transparent)' }} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 text-xs font-semibold uppercase tracking-widest"
            style={{ borderColor: '#FF8C0033', background: '#FF8C0010', color: '#FF8C00' }}>
            Institucional
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
            Quem Somos
          </h1>
          <p className="text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: '#9CA3AF' }}>
            A Welder &amp; Fusion é uma escola profissionalizante especializada na formação de
            soldadores, localizada em Itajaí (SC). Há mais de 12 anos transformando talentos
            em profissionais altamente qualificados e empregáveis.
          </p>
        </div>
      </section>

      {/* ── NOSSA HISTÓRIA ── */}
      <section className="py-20" style={{ background: '#242424' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#FF8C00' }}>Nossa História</p>
              <h2 className="text-4xl font-black text-white mb-6">Nascemos para conectar habilidade a oportunidade</h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#9CA3AF' }}>
                A Welder &amp; Fusion surgiu de uma necessidade real: o mercado industrial do Sul do Brasil demandava
                soldadores qualificados, mas faltavam escolas que unissem teoria sólida com prática intensa e
                acompanhamento personalizado.
              </p>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#9CA3AF' }}>
                Fundada em Itajaí (SC), no coração do polo metal-mecânico catarinense, a escola foi estruturada com
                laboratórios de última geração e um corpo docente formado por soldadores com certificação AWS e
                décadas de experiência nas maiores indústrias do país.
              </p>
              <p className="text-base leading-relaxed mb-8" style={{ color: '#9CA3AF' }}>
                Hoje, com mais de 500 alunos formados e 98% de taxa de empregabilidade, somos referência regional
                em formação de soldadores TIG, MIG/MAG e Eletrodo Revestido.
              </p>
              <div className="flex flex-wrap gap-3">
                {['12+ Anos de experiência', '500+ Alunos formados', '98% Empregabilidade', '15+ Empresas parceiras'].map(t => (
                  <span key={t} className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border"
                    style={{ borderColor: '#FF8C0030', color: '#FF8C00', background: '#FF8C0010' }}>
                    <CheckCircle size={12} /> {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { n: '12+', label: 'Anos formando profissionais', color: '#FF8C00' },
                { n: '500+', label: 'Alunos certificados', color: '#00BFFF' },
                { n: '98%', label: 'Taxa de empregabilidade', color: '#FF8C00' },
                { n: '15+', label: 'Empresas parceiras', color: '#00BFFF' },
              ].map(({ n, label, color }) => (
                <div key={label} className="p-6 rounded-2xl text-center"
                  style={{ background: '#1A1A1A', border: `1px solid ${color}20` }}>
                  <p className="text-4xl font-black mb-2" style={{ color }}>{n}</p>
                  <p className="text-sm" style={{ color: '#6B7280' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MISSÃO / VISÃO / VALORES ── */}
      <section className="py-20" style={{ background: '#1A1A1A' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-white">Propósito &amp; Direção</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: Target, color: '#FF8C00', title: 'Missão',
                text: 'Transformar talentos em profissionais qualificados, conectando pessoas às melhores oportunidades no mercado de soldagem através de formação prática, personalizada e alinhada às exigências da indústria.',
              },
              {
                icon: Eye, color: '#00BFFF', title: 'Visão',
                text: 'Ser a escola de soldagem mais reconhecida do Sul do Brasil, referência nacional em qualidade de ensino, inovação pedagógica e empregabilidade dos nossos egressos até 2030.',
              },
              {
                icon: Heart, color: '#FF8C00', title: 'Propósito',
                text: 'Acreditamos que uma profissão bem aprendida transforma vidas. Cada aluno que forma conosco leva consigo não apenas um certificado, mas uma carreira sólida e um futuro digno.',
              },
            ].map(({ icon: Icon, color, title, text }) => (
              <div key={title} className="p-7 rounded-2xl border"
                style={{ background: '#242424', borderColor: color + '25' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: color + '15' }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="text-xl font-black text-white mb-3">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>{text}</p>
              </div>
            ))}
          </div>

          {/* Valores */}
          <div className="text-center mb-10">
            <h3 className="text-3xl font-black text-white">Nossos Valores</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {VALUES.map(({ icon, title, desc }) => (
              <div key={title}
                className="p-5 rounded-2xl border cursor-default transition-all hover:-translate-y-0.5"
                style={{ background: '#242424', borderColor: '#ffffff0d' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#FF8C0030')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#ffffff0d')}>
                <span className="text-3xl mb-3 block">{icon}</span>
                <h4 className="font-bold text-white mb-1">{title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EQUIPE ── */}
      <section className="py-20" style={{ background: '#242424' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#FF8C00' }}>Time</p>
            <h2 className="text-4xl font-black text-white">Quem faz acontecer</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TEAM.map(({ name, role, desc, initial }) => (
              <div key={name} className="p-6 rounded-2xl border text-center"
                style={{ background: '#1A1A1A', borderColor: '#ffffff0d' }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-black"
                  style={{ background: '#FF8C0020', color: '#FF8C00' }}>
                  {initial}
                </div>
                <h3 className="font-bold text-white text-lg mb-1">{name}</h3>
                <p className="text-sm font-medium mb-3" style={{ color: '#FF8C00' }}>{role}</p>
                <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOCALIZAÇÃO ── */}
      <section className="py-20" style={{ background: '#1A1A1A' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Onde estamos</h2>
          <p className="text-lg mb-10" style={{ color: '#9CA3AF' }}>
            Venha conhecer nossa estrutura e conversar com nossa equipe.
          </p>
          <div className="grid sm:grid-cols-3 gap-5 mb-10">
            {[
              { icon: MapPin, title: 'Endereço', lines: ['Rua Cesar Stamm, 55', 'Cordeiros — Itajaí, SC'], color: '#FF8C00' },
              { icon: Phone, title: 'WhatsApp', lines: ['(47) 98878-6738', '(47) 9 8851-1768'], color: '#00BFFF' },
              { icon: Mail, title: 'E-mail', lines: ['escola.welderefusion@gmail.com'], color: '#FF8C00' },
            ].map(({ icon: Icon, title, lines, color }) => (
              <div key={title} className="p-5 rounded-2xl border"
                style={{ background: '#242424', borderColor: '#ffffff0d' }}>
                <Icon size={20} className="mx-auto mb-3" style={{ color }} />
                <p className="font-semibold text-white mb-2">{title}</p>
                {lines.map(l => <p key={l} className="text-sm" style={{ color: '#9CA3AF' }}>{l}</p>)}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="https://wa.me/5547988786738" target="_blank" rel="noreferrer">
              <Button size="lg" rightIcon={<ArrowRight size={18} />}>Falar no WhatsApp</Button>
            </a>
            <Link to="/cursos"><Button size="lg" variant="outline">Ver Cursos</Button></Link>
          </div>
        </div>
      </section>

    </div>
  )
}
