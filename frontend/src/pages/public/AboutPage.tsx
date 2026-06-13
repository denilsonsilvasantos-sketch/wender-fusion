import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, ArrowRight, MapPin, Phone, Mail, Target, Eye, Heart } from 'lucide-react'
import { Button } from '@/components/ui'

function InstructorAvatar({ name, initial, photo }: { name: string; initial: string; photo: string }) {
  const [src, setSrc] = useState<'jpg' | 'png' | 'failed'>('jpg')
  if (src === 'failed') {
    return (
      <div style={{ width: 100, height: 100, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FF8C0020', border: '3px solid #FF8C0060', fontSize: 32, fontWeight: 900, color: '#FF8C00' }}>
        {initial}
      </div>
    )
  }
  return (
    <div style={{ width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', border: '3px solid #FF8C0060' }}>
      <img
        src={`/${photo}.${src}`}
        alt={name}
        style={{ width: '100px', height: '100px', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
        onError={() => setSrc(s => s === 'jpg' ? 'png' : 'failed')}
      />
    </div>
  )
}

const VALUES = [
  { icon: '🔥', title: 'Excelência', desc: 'Padrão máximo em ensino, infraestrutura e atendimento ao aluno.' },
  { icon: '🤝', title: 'Comprometimento', desc: 'Do primeiro contato ao certificado, estamos com você em cada etapa.' },
  { icon: '🛡️', title: 'Segurança', desc: 'Treinamento rigoroso em NRs e uso correto de EPIs em todas as aulas.' },
  { icon: '⚡', title: 'Inovação', desc: 'Currículo atualizado com as tecnologias e normas mais recentes do mercado.' },
  { icon: '💼', title: 'Empregabilidade', desc: 'Nossa missão não termina no certificado — conectamos você ao mercado.' },
  { icon: '🏆', title: 'Qualidade', desc: 'Instrutores com certificação FBTS e experiência nas maiores indústrias do país.' },
]

const TEAM = [
  {
    name: 'Tiago Andrade',
    role: 'Inspetor de Soldagem N1 — FBTS',
    initial: 'T',
    photo: 'tiago-andrade',
    highlights: ['Certificação FBTS', 'ASME · AWS D1.1 · Normas Petrobras', 'SMAW · GTAW · FCAW'],
    paragraphs: [
      'Tiago Andrade é um profissional com sólida experiência na área de soldagem, atuando atualmente como Inspetor de Soldagem N1, além de possuir vasta trajetória como soldador em equipamentos de pequeno, médio e grande porte na região de São Paulo. Seu trabalho é norteado por altos padrões de qualidade, segurança e conformidade com normas técnicas nacionais e internacionais, como ASME, AWS D1.1 e as normas Petrobras, entre outras.',
      'Especializado em projetos voltados ao setor de óleo e gás, principalmente com foco em equipamentos para a Petrobras, Tiago participou ativamente de operações de soldagem e inspeção em: tanques de armazenamento, vasos de pressão e caldeirarias industriais; tubulações de alta pressão e sistemas críticos; equipamentos e estruturas metálicas para refinarias e projetos navais.',
      'Com domínio técnico em processos como SMAW (Eletrodo Revestido), GTAW (TIG) e FCAW (Arame Tubular), além de qualificação para leitura de EPS e realização de inspeções visuais e dimensionais, Tiago assegura a conformidade das juntas soldadas com os requisitos exigidos por projetos de alta complexidade.',
      'Como Inspetor N1, atua na verificação de procedimentos, controle de qualidade de soldagem, rastreabilidade de materiais e acompanhamento técnico em campo, garantindo a integridade estrutural dos equipamentos e a segurança operacional dos sistemas inspecionados.',
    ],
  },
  {
    name: 'Kleberson Ferreira',
    role: 'Inspetor de Solda N1 — FBTS',
    initial: 'K',
    photo: 'kleberson-ferreira',
    highlights: ['10+ anos de experiência', 'GTAW · SMAW · GMAW · FCAW', 'Caldeiras · Petrobras · Petroquímica'],
    paragraphs: [
      'Kleberson Felipe Soares Ferreira, conhecido como Índio, é atualmente Inspetor de Solda N1 qualificado pela FBTS (Fundação Brasileira de Tecnologia de Soldagem). Atua há mais de 10 anos em vários segmentos industriais, trabalhando com diversas normas e procedimentos. Formado em técnico de mecânica, analista da qualidade, com curso de Líquido Penetrante e Partícula Magnética. Encarregado de solda e montagem em cervejaria e fábrica de caldeiras.',
      'Processos dominados como soldador: GTAW (TIG), SMAW (Eletrodo Revestido), GMAW (Arame Sólido) e FCAW (Arame Tubular). Primeiro emprego na área de solda em 1996, aos 17 anos. Primeiro fechamento como soldador em 1997. Primeiro contato com o processo SMAW e GMAW em fábrica de cama tubular no interior de São Paulo e, em 2000, início com GTAW (TIG) na área alimentícia em cervejaria e Coca-Cola.',
      'Áreas em que já atuou: fabricação de vagão de trem; corrimões soldados em inox em linha alimentícia; fabricação de linha de amônia em cervejaria; tanques de cerveja em dupla fusão inox; usinas de açúcar inox e aço carbono; caldeiras de força e recuperação; tanques e vasos de pressão; fábricas de papel; refinarias de petróleo Petrobras; plataformas estáticas e cilíndricas — como soldador e como Inspetor de Solda N1.',
      '"Conhecimento é tudo, mas nem sempre sabemos tudo — sempre há algo a aprender. Estou pronto para compartilhar meus conhecimentos e aprender com vocês. Com segurança, qualidade e saúde garantidas para você e para seus negócios."',
    ],
  },
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
          <p className="text-xl leading-relaxed max-w-2xl mx-auto text-white">
            A Welder &amp; Fusion é uma escola profissionalizante especializada na formação de
            soldadores, localizada em Itajaí (SC). Fundada em 2024, já formou mais de 60 profissionais
            altamente qualificados e empregáveis.
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
              <p className="text-base leading-relaxed mb-4 text-white">
                A Welder &amp; Fusion surgiu de uma necessidade real: o mercado industrial do Sul do Brasil demandava
                soldadores qualificados, mas faltavam escolas que unissem teoria sólida com prática intensa e
                acompanhamento personalizado.
              </p>
              <p className="text-base leading-relaxed mb-4 text-white">
                Fundada em Itajaí (SC), no coração do polo metal-mecânico catarinense, a escola foi estruturada com
                laboratórios de última geração e um corpo docente formado por inspetores de soldagem com extensa
                experiência nas maiores indústrias do país.
              </p>
              <p className="text-base leading-relaxed mb-8 text-white">
                Completando 1 ano de história, já formamos mais de 60 profissionais com 98% de taxa de empregabilidade,
                consolidando-nos como referência em formação de soldadores TIG, MIG/MAG e Eletrodo Revestido em Itajaí.
              </p>
              <div className="flex flex-wrap gap-3">
                {['1 Ano de escola', '60+ Profissionais formados', '98% Empregabilidade'].map(t => (
                  <span key={t} className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border"
                    style={{ borderColor: '#FF8C0030', color: '#FF8C00', background: '#FF8C0010' }}>
                    <CheckCircle size={12} /> {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { n: '1 Ano', label: 'De escola', color: '#FF8C00' },
                { n: '60+', label: 'Profissionais formados', color: '#ffffff' },
                { n: '98%', label: 'Taxa de empregabilidade', color: '#FF8C00' },
                { n: '3', label: 'Processos de soldagem', color: '#ffffff' },
              ].map(({ n, label, color }) => (
                <div key={label} className="p-6 rounded-2xl text-center"
                  style={{ background: '#1A1A1A', border: `1px solid ${color}20` }}>
                  <p className="text-4xl font-black mb-2" style={{ color }}>{n}</p>
                  <p className="text-sm text-white">{label}</p>
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
                icon: Eye, color: '#FF8C00', title: 'Visão',
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
                <p className="text-sm leading-relaxed" style={{ color: '#ffffff' }}>{text}</p>
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
                <p className="text-sm leading-relaxed" style={{ color: '#e5e7eb' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EQUIPE ── */}
      <section className="py-20" style={{ background: '#242424' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#FF8C00' }}>Fundadores &amp; Instrutores</p>
            <h2 className="text-4xl font-black text-white">Quem faz acontecer</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {TEAM.map(({ name, role, initial, photo, highlights, paragraphs }) => (
              <div key={name} className="p-7 rounded-2xl border"
                style={{ background: '#1A1A1A', borderColor: '#FF8C0020' }}>
                {/* Header */}
                <div className="flex items-center gap-4 mb-5">
                  <InstructorAvatar name={name} initial={initial} photo={photo} />
                  <div>
                    <h3 className="font-black text-white text-xl">{name}</h3>
                    <p className="text-sm font-medium mt-0.5 mb-3" style={{ color: '#FF8C00' }}>{role}</p>
                    <div className="flex flex-wrap gap-2">
                      {highlights.map(h => (
                        <span key={h} className="text-xs px-2.5 py-1 rounded-full border font-medium"
                          style={{ borderColor: '#FF8C0030', color: '#FF8C00', background: '#FF8C0010' }}>
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bio completa */}
                <div className="space-y-4">
                  {paragraphs.map((p, i) => (
                    <p key={i} className="text-sm leading-relaxed text-justify" style={{ color: '#ffffff' }}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOCALIZAÇÃO ── */}
      <section className="py-20" style={{ background: '#1A1A1A' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Onde estamos</h2>
          <p className="text-lg mb-10" style={{ color: '#ffffff' }}>
            Venha conhecer nossa estrutura e conversar com nossa equipe.
          </p>
          <div className="grid sm:grid-cols-3 gap-5 mb-10">
            {[
              { icon: MapPin, title: 'Endereço', lines: ['Rua Cesar Stamm, 55', 'Cordeiros — Itajaí, SC'], color: '#FF8C00' },
              { icon: Phone, title: 'WhatsApp', lines: ['(47) 98878-6738', '(47) 9 8851-1768'], color: '#FF8C00' },
              { icon: Mail, title: 'E-mail', lines: ['escola.welderefusion@gmail.com'], color: '#FF8C00' },
            ].map(({ icon: Icon, title, lines, color }) => (
              <div key={title} className="p-5 rounded-2xl border"
                style={{ background: '#242424', borderColor: '#ffffff0d' }}>
                <Icon size={20} className="mx-auto mb-3" style={{ color }} />
                <p className="font-semibold text-white mb-2">{title}</p>
                {lines.map(l => <p key={l} className="text-sm" style={{ color: '#ffffff' }}>{l}</p>)}
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
