import { useState } from 'react'
import { Clock, Tag, ArrowRight, Search } from 'lucide-react'
import { Input } from '@/components/ui'

const TAGS = ['Todos', 'Técnica', 'Mercado', 'Segurança', 'Carreira', 'Certificações', 'Equipamentos']

const ARTICLES = [
  {
    id: 1,
    slug: 'tig-vs-mig-mag-qual-processo-escolher',
    title: 'TIG vs MIG/MAG: qual processo escolher para cada aplicação?',
    excerpt: 'Entenda as diferenças técnicas, vantagens e limitações de cada processo para tomar a melhor decisão no chão de fábrica.',
    tag: 'Técnica',
    date: '2024-06-05',
    minutes: 6,
    featured: true,
    author: 'Equipe W&F',
  },
  {
    id: 2,
    slug: 'mercado-soldagem-2024-tendencias',
    title: 'Mercado de soldagem em 2024: oportunidades e tendências',
    excerpt: 'O setor de soldagem cresce 12% ao ano no Brasil. Veja onde estão as maiores oportunidades e como se preparar.',
    tag: 'Mercado',
    date: '2024-05-28',
    minutes: 5,
    featured: false,
    author: 'Equipe W&F',
  },
  {
    id: 3,
    slug: 'nr10-nr9-seguranca-soldagem',
    title: 'NR-10 e NR-9: o que todo soldador precisa saber sobre segurança',
    excerpt: 'As normas regulamentadoras mais importantes para soldadores: o que exigem, como se adequar e quais são as penalidades.',
    tag: 'Segurança',
    date: '2024-05-15',
    minutes: 8,
    featured: false,
    author: 'Equipe W&F',
  },
  {
    id: 4,
    slug: 'curriculo-vagas-soldagem',
    title: 'Como montar o currículo perfeito para vagas de soldagem',
    excerpt: 'Dicas práticas de como destacar suas certificações, processos dominados e experiência para se destacar nas seleções.',
    tag: 'Carreira',
    date: '2024-05-10',
    minutes: 4,
    featured: false,
    author: 'Equipe W&F',
  },
  {
    id: 5,
    slug: 'certificacao-aws-vale-a-pena',
    title: 'Certificação AWS: o que é, quanto custa e por que vale a pena',
    excerpt: 'A certificação AWS é reconhecida internacionalmente e pode triplicar seu salário. Veja como se preparar.',
    tag: 'Certificações',
    date: '2024-04-22',
    minutes: 7,
    featured: false,
    author: 'Equipe W&F',
  },
  {
    id: 6,
    slug: 'soldagem-aluminio-tecnicas-cuidados',
    title: 'Soldagem de alumínio: técnicas, desafios e cuidados essenciais',
    excerpt: 'O alumínio exige atenção especial em limpeza, parâmetros e tipo de gás. Veja os erros mais comuns e como evitá-los.',
    tag: 'Técnica',
    date: '2024-04-10',
    minutes: 9,
    featured: false,
    author: 'Equipe W&F',
  },
  {
    id: 7,
    slug: 'manutencao-maquinas-solda',
    title: 'Guia de manutenção preventiva para máquinas de solda MIG/MAG',
    excerpt: 'Equipamentos bem mantidos produzem soldas de maior qualidade e duram muito mais. Confira o checklist completo.',
    tag: 'Equipamentos',
    date: '2024-03-30',
    minutes: 6,
    featured: false,
    author: 'Equipe W&F',
  },
  {
    id: 8,
    slug: 'salario-soldador-brasil-2024',
    title: 'Quanto ganha um soldador no Brasil em 2024? Dados por processo e região',
    excerpt: 'Levantamento detalhado dos salários médios de soldadores TIG, MIG/MAG e Eletrodo Revestido nas principais regiões.',
    tag: 'Mercado',
    date: '2024-03-18',
    minutes: 5,
    featured: false,
    author: 'Equipe W&F',
  },
]

const TAG_COLORS: Record<string, string> = {
  'Técnica': '#00BFFF', 'Mercado': '#FF8C00', 'Segurança': '#EF4444',
  'Carreira': '#22C55E', 'Certificações': '#A855F7', 'Equipamentos': '#F59E0B',
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export function ArticlesPage() {
  const [activeTag, setActiveTag] = useState('Todos')
  const [search, setSearch] = useState('')

  const filtered = ARTICLES.filter(a => {
    const matchTag = activeTag === 'Todos' || a.tag === activeTag
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase())
    return matchTag && matchSearch
  })

  const featured = ARTICLES.find(a => a.featured)
  const rest = filtered.filter(a => !a.featured || activeTag !== 'Todos' || search)

  return (
    <div style={{ background: '#1A1A1A' }}>

      {/* ── HERO ── */}
      <section className="py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-5 text-xs font-semibold uppercase tracking-widest"
            style={{ borderColor: '#FF8C0033', background: '#FF8C0010', color: '#FF8C00' }}>
            Conhecimento em Soldagem
          </div>
          <h1 className="text-5xl font-black text-white mb-4">Artigos &amp; Notícias</h1>
          <p className="text-lg" style={{ color: '#9CA3AF' }}>
            Conteúdo técnico, tendências de mercado e dicas de carreira para soldadores profissionais.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

        {/* ── Filtros ── */}
        <div className="flex flex-wrap items-center gap-4 mb-10">
          <div className="flex flex-wrap gap-2 flex-1">
            {TAGS.map(t => (
              <button key={t} onClick={() => setActiveTag(t)}
                className="px-3 py-1.5 rounded-full text-sm font-medium border transition-all"
                style={activeTag === t
                  ? { background: '#FF8C00', color: '#000', borderColor: '#FF8C00' }
                  : { background: 'transparent', color: '#9CA3AF', borderColor: '#ffffff15' }}>
                {t}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-56">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B7280' }} />
            <Input
              placeholder="Buscar artigo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 text-sm"
            />
          </div>
        </div>

        {/* ── Artigo destaque ── */}
        {featured && activeTag === 'Todos' && !search && (
          <div className="mb-10 rounded-3xl overflow-hidden border group cursor-pointer"
            style={{ background: '#242424', borderColor: '#FF8C0025' }}>
            <div className="grid lg:grid-cols-5">
              {/* Visual destaque */}
              <div className="lg:col-span-2 relative min-h-[200px] lg:min-h-0 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #1a0800, #2a1500, #0a0a1a)' }}>
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <svg viewBox="0 0 120 120" width="120" height="120" fill="none">
                    {[...Array(8)].map((_, i) => {
                      const a = (i / 8) * 360 * Math.PI / 180
                      return <line key={i} x1={60 + Math.cos(a) * 20} y1={60 + Math.sin(a) * 20}
                        x2={60 + Math.cos(a) * 50} y2={60 + Math.sin(a) * 50}
                        stroke="#FF8C00" strokeWidth="2" strokeLinecap="round" />
                    })}
                    <circle cx="60" cy="60" r="14" fill="#FF8C00" />
                    <circle cx="60" cy="60" r="6" fill="#fff" />
                  </svg>
                </div>
                <div className="relative text-center p-8">
                  <span className="text-5xl">⚙️</span>
                  <p className="text-xs mt-2 font-semibold uppercase tracking-widest" style={{ color: '#FF8C00' }}>
                    Artigo em Destaque
                  </p>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="lg:col-span-3 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{ background: (TAG_COLORS[featured.tag] || '#FF8C00') + '20', color: TAG_COLORS[featured.tag] || '#FF8C00' }}>
                      {featured.tag}
                    </span>
                    <span className="text-xs flex items-center gap-1" style={{ color: '#6B7280' }}>
                      <Clock size={11} /> {featured.minutes} min de leitura
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white mb-3 group-hover:text-[#FF8C00] transition-colors leading-snug">
                    {featured.title}
                  </h2>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: '#9CA3AF' }}>{featured.excerpt}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: '#ffffff0d' }}>
                  <span className="text-xs" style={{ color: '#6B7280' }}>{fmtDate(featured.date)}</span>
                  <span className="flex items-center gap-1 text-sm font-semibold" style={{ color: '#FF8C00' }}>
                    Ler artigo <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Grid de artigos ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 rounded-2xl" style={{ background: '#242424' }}>
            <p className="text-white font-semibold mb-1">Nenhum artigo encontrado</p>
            <p className="text-sm" style={{ color: '#6B7280' }}>Tente outro filtro ou termo de busca.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map(article => (
              <article key={article.id}
                className="group rounded-2xl border flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
                style={{ background: '#242424', borderColor: '#ffffff0d' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#FF8C0030')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#ffffff0d')}>

                {/* Top color bar */}
                <div className="h-1" style={{ background: TAG_COLORS[article.tag] || '#FF8C00' }} />

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="flex items-center gap-1 text-xs font-semibold"
                      style={{ color: TAG_COLORS[article.tag] || '#FF8C00' }}>
                      <Tag size={11} /> {article.tag}
                    </span>
                    <span className="text-xs flex items-center gap-1" style={{ color: '#4B5563' }}>
                      <Clock size={11} /> {article.minutes} min
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base leading-snug mb-2 group-hover:text-[#FF8C00] transition-colors flex-1">
                    {article.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: '#6B7280' }}>{article.excerpt}</p>

                  <div className="flex items-center justify-between pt-4 border-t mt-auto" style={{ borderColor: '#ffffff08' }}>
                    <span className="text-xs" style={{ color: '#4B5563' }}>{fmtDate(article.date)}</span>
                    <span className="text-xs font-semibold flex items-center gap-1 transition-colors group-hover:text-white"
                      style={{ color: '#FF8C00' }}>
                      Ler <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* ── CTA newsletter ── */}
        <div className="mt-16 rounded-3xl p-10 text-center border"
          style={{ background: '#242424', borderColor: '#FF8C0020' }}>
          <h3 className="text-2xl font-black text-white mb-2">Quer receber novos artigos?</h3>
          <p className="mb-6" style={{ color: '#9CA3AF' }}>
            Fale conosco pelo WhatsApp e fique por dentro de tudo sobre soldagem.
          </p>
          <a href="https://wa.me/5547988786738" target="_blank" rel="noreferrer">
            <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
              style={{ background: '#FF8C00', color: '#000' }}>
              📲 Acompanhar no WhatsApp
            </button>
          </a>
        </div>
      </div>
    </div>
  )
}
