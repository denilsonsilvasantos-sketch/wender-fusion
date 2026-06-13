import { useState } from 'react'
import { Clock, Tag, ArrowRight, Search, X } from 'lucide-react'
import { Input } from '@/components/ui'

const TAGS = ['Todos', 'Técnica', 'Mercado', 'Segurança', 'Carreira', 'Certificações', 'Equipamentos']

const TAG_COLORS: Record<string, string> = {
  'Técnica': '#FF8C00', 'Mercado': '#FF8C00', 'Segurança': '#EF4444',
  'Carreira': '#22C55E', 'Certificações': '#F59E0B', 'Equipamentos': '#8B5CF6',
}

interface Article {
  id: number; slug: string; title: string; excerpt: string; tag: string
  date: string; minutes: number; featured: boolean; author: string
  thumbBg: string; thumbIcon: string
  content: { heading?: string; body: string }[]
}

const ARTICLES: Article[] = [
  {
    id: 1, slug: 'tig-vs-mig-mag', featured: true,
    title: 'TIG vs MIG/MAG: qual processo escolher para cada aplicação?',
    excerpt: 'Entenda as diferenças técnicas, vantagens e limitações de cada processo para tomar a melhor decisão no chão de fábrica.',
    tag: 'Técnica', date: '2024-06-05', minutes: 6, author: 'Equipe W&F',
    thumbBg: 'linear-gradient(135deg, #1a0800 0%, #2d1200 50%, #0a0a1a 100%)',
    thumbIcon: '⚡',
    content: [
      { body: 'A escolha do processo de soldagem certo pode determinar a qualidade, o custo e a produtividade de toda uma linha de produção. TIG (GTAW) e MIG/MAG (GMAW) são os dois processos mais empregados na indústria metal-mecânica brasileira, mas cada um tem seu espaço ideal.' },
      { heading: 'Soldagem TIG (GTAW)', body: 'O processo TIG utiliza um eletrodo de tungstênio não-consumível e gás inerte (geralmente argônio puro) para proteger a poça de fusão. O resultado é uma solda extremamente limpa, com acabamento visual impecável e altíssima integridade estrutural. É o processo preferido para aço inoxidável, alumínio, titânio e ligas especiais.' },
      { heading: 'Soldagem MIG/MAG (GMAW)', body: 'O MIG/MAG utiliza um arame contínuo como eletrodo consumível. No MIG, o gás de proteção é inerte (argônio ou mistura Ar+He); no MAG, é ativo (CO₂ ou mistura Ar+CO₂). É o processo mais produtivo para aço carbono em espessuras médias a grossas, amplamente utilizado em construção metálica, naval e automotiva.' },
      { heading: 'Quando usar cada um?', body: 'Use TIG quando a qualidade visual é crítica, para materiais nobres ou espessuras finas (< 4mm). Use MIG/MAG quando a produtividade é prioridade e o material é aço carbono em espessura de 2mm ou mais. O TIG exige mais habilidade do soldador; o MIG/MAG é mais fácil de aprender e permite soldagem em posições variadas com mais facilidade.' },
      { heading: 'E quanto ao salário?', body: 'Segundo dados do CAGED (2024), soldadores TIG recebem em média 40-60% mais que soldadores MIG/MAG generalizados, justamente pela maior complexidade técnica. Dominar ambos os processos é o caminho mais rápido para alcançar as faixas salariais mais altas do setor.' },
    ],
  },
  {
    id: 2, slug: 'mercado-soldagem-2024', featured: false,
    title: 'Mercado de soldagem no Brasil em 2024: onde estão as vagas',
    excerpt: 'O setor de soldagem cresce consistentemente no Brasil. Veja os dados mais recentes sobre demanda, salários e regiões.',
    tag: 'Mercado', date: '2024-05-28', minutes: 5, author: 'Equipe W&F',
    thumbBg: 'linear-gradient(135deg, #0a1a0a 0%, #152815 50%, #1a1a0a 100%)',
    thumbIcon: '📊',
    content: [
      { body: 'O Brasil possui um dos maiores parques industriais da América Latina, e a soldagem é uma das profissões mais essenciais para sustentar esse crescimento. Segundo dados do Ministério do Trabalho e Emprego (MTE), a ocupação de soldador figurou entre as 20 profissões com maior volume de admissões no setor industrial em 2023-2024.' },
      { heading: 'Setores que mais contratam', body: 'Construção naval (estaleiros do Rio de Janeiro, Santa Catarina e Rio Grande do Sul), petroquímica (Petrobras e empresas do Sistema Petrobras), construção metálica e montagem industrial são os maiores empregadores. O polo metal-mecânico do Vale do Itajaí, em Santa Catarina, é um dos mais ativos do país.' },
      { heading: 'Faixas salariais (2024)', body: 'Soldador Eletrodo Revestido: R$ 2.500 – R$ 4.000 | Soldador MIG/MAG: R$ 3.000 – R$ 5.500 | Soldador TIG: R$ 4.500 – R$ 9.000+ | Inspetor de Soldagem N1: R$ 5.000 – R$ 10.000+ | Inspetor N2/N3 (FBTS): R$ 8.000 – R$ 18.000. Soldadores com qualificação em múltiplos processos e normas ASME/AWS chegam ao topo das faixas.' },
      { heading: 'Perspectivas para 2025', body: 'O crescimento da indústria de energia renovável (eólica e solar), expansão do setor naval e os investimentos em infraestrutura prometem manter alta a demanda. Soldadores qualificados com certificação FBTS e domínio de normas terão as melhores oportunidades.' },
    ],
  },
  {
    id: 3, slug: 'nr10-nr9-seguranca-soldagem', featured: false,
    title: 'NR-10 e NR-9: o que todo soldador precisa saber sobre segurança',
    excerpt: 'As normas regulamentadoras mais importantes para soldadores: o que exigem, como se adequar e quais são as penalidades.',
    tag: 'Segurança', date: '2024-05-15', minutes: 8, author: 'Equipe W&F',
    thumbBg: 'linear-gradient(135deg, #1a0505 0%, #2d0808 50%, #0a1a1a 100%)',
    thumbIcon: '🛡️',
    content: [
      { body: 'A soldagem envolve riscos elétricos, químicos e físicos que, sem o devido controle, podem resultar em acidentes graves. As Normas Regulamentadoras (NRs) do Ministério do Trabalho estabelecem os requisitos mínimos de segurança que toda empresa e todo trabalhador deve cumprir.' },
      { heading: 'NR-9 — PPRA (Programa de Prevenção de Riscos Ambientais)', body: 'A NR-9 exige que as empresas identifiquem e avaliem os riscos ambientais no trabalho: fumos metálicos (cádmio, cromo, manganês em alta concentração), ozônio e CO₂ em ambientes fechados, ruído de equipamentos. Recomenda ventilação adequada, uso de EPI respiratório (máscaras de solda com filtro P3) e monitoramento periódico da qualidade do ar.' },
      { heading: 'NR-10 — Segurança em Instalações Elétricas', body: 'A NR-10 regulamenta a segurança em trabalhos com eletricidade, o que inclui diretamente as máquinas de solda. Todo soldador deve conhecer os conceitos básicos de aterramento de equipamentos, tensão de circuito aberto (OCV) máxima (80V CA ou 100V CC), proteção contra choques elétricos em ambientes úmidos e confinados e procedimentos de bloqueio/etiquetagem (lockout/tagout).' },
      { heading: 'EPIs obrigatórios para soldagem', body: 'Máscara de solda com filtro DIN adequado ao processo (DIN 9-11 para TIG/MIG/MAG; DIN 11-13 para eletrodo de maior amperagem), luvas de couro, avental e mangote de raspa, bota de segurança com solado isolante, óculos de proteção contra respingos durante a remoção de escória e protetor auricular quando o nível de ruído exceder 85 dB.' },
      { heading: 'Penalidades', body: 'O não cumprimento das NRs pode gerar multas que variam de R$ 402 a R$ 4.016 por empregado exposto ao risco, além de interdição do local de trabalho e responsabilização criminal em caso de acidente grave. Para o trabalhador, o conhecimento dessas normas é também uma proteção legal.' },
    ],
  },
  {
    id: 4, slug: 'curriculo-soldagem', featured: false,
    title: 'Como montar o currículo perfeito para vagas de soldagem',
    excerpt: 'Dicas práticas de como destacar suas certificações, processos dominados e experiência para se sobressair nas seleções.',
    tag: 'Carreira', date: '2024-05-10', minutes: 4, author: 'Equipe W&F',
    thumbBg: 'linear-gradient(135deg, #0a1a0a 0%, #0a1520 50%, #0a0a1a 100%)',
    thumbIcon: '📋',
    content: [
      { body: 'Um bom currículo para a área de soldagem precisa ir muito além do nome e da experiência genérica. Recrutadores do setor industrial buscam informações técnicas específicas que demonstrem competência prática imediata.' },
      { heading: 'O que colocar no cabeçalho', body: 'Além dos dados pessoais, inclua já no cabeçalho: processos que domina (TIG, MIG/MAG, SMAW), número do registro de qualificação (se possuir FBTS ou similar), e brevíssimo resumo como "Soldador TIG/MIG-MAG com 5 anos de experiência em caldeiraria e tubulações industriais."' },
      { heading: 'Descreva a experiência de forma técnica', body: 'Evite "soldei peças na empresa X". Em vez disso: "Soldagem de tubulações de aço inox 316L pelo processo GTAW (TIG) conforme ASME B31.3, em projeto de plataforma de petróleo — operação de 14h/dia em regime de turnos." Quanto mais específico, mais credibilidade.' },
      { heading: 'Certificações que valem ouro', body: 'A qualificação FBTS (Fundação Brasileira de Tecnologia de Soldagem) é a mais reconhecida no mercado nacional. Coloque nível, processo e data de validade. Se tiver cursos de NR-9, NR-10, NR-12 ou NR-34, liste também, pois são diferenciais em processos seletivos de grandes empresas.' },
      { heading: 'LinkedIn e portfólio', body: 'Monte um LinkedIn com fotos de soldas realizadas (com autorização da empresa), liste os projetos e solicite recomendações de supervisores. Soldadores com perfil ativo no LinkedIn são cada vez mais encontrados por recrutadores das maiores siderúrgicas e estaleiros do Brasil.' },
    ],
  },
  {
    id: 5, slug: 'soldagem-aluminio', featured: false,
    title: 'Soldagem de alumínio: técnicas, desafios e cuidados essenciais',
    excerpt: 'O alumínio exige atenção especial em limpeza, parâmetros e tipo de gás. Veja os erros mais comuns e como evitá-los.',
    tag: 'Técnica', date: '2024-04-22', minutes: 9, author: 'Equipe W&F',
    thumbBg: 'linear-gradient(135deg, #0a0a1a 0%, #15152a 50%, #1a1520 100%)',
    thumbIcon: '🔩',
    content: [
      { body: 'O alumínio é um dos metais mais desafiadores para soldar. Sua camada superficial de óxido (Al₂O₃) tem ponto de fusão muito superior ao do metal base (2.050°C vs. 660°C), o que exige que o arco elétrico quebre essa camada antes de fundir o material. Por isso, o processo TIG em corrente alternada (CA/AC) é o mais indicado para alumínio.' },
      { heading: 'Limpeza é fundamental', body: 'Antes de soldar, a superfície deve estar impecável. Use uma escova de aço inoxidável exclusiva para alumínio (nunca use em outros metais) e limpe com acetona ou álcool isopropílico. A contaminação por óleo, graxa ou óxido excessivo causa porosidade e falta de fusão na solda.' },
      { heading: 'Parâmetros TIG para alumínio', body: 'Use eletrodo de tungstênio puro (cor verde) ou zirconado para CA. Gás: argônio puro (Ar 99,99%). A corrente alternada promove limpeza catódica da camada de óxido no semiciclo positivo. Para chapas de 3mm, uma referência é 90-110A com eletrodo de 2,4mm. A ponta do tungstênio forma uma esfera — isso é normal e correto em CA.' },
      { heading: 'Erros comuns', body: 'Usar CCEN (corrente contínua eletrodo negativo) sem ajuste adequado, não pré-aquecer peças mais espessas (> 6mm), usar vareta de aço carbono por engano (verificar a marcação), e velocidade de soldagem muito lenta que resulta em fusão excessiva e distorção. O alumínio conduz calor muito bem e distorce facilmente.' },
    ],
  },
  {
    id: 6, slug: 'manutencao-mig-mag', featured: false,
    title: 'Guia completo de manutenção preventiva para máquinas MIG/MAG',
    excerpt: 'Equipamentos bem mantidos produzem soldas de maior qualidade e têm vida útil muito maior. Confira o checklist.',
    tag: 'Equipamentos', date: '2024-04-10', minutes: 6, author: 'Equipe W&F',
    thumbBg: 'linear-gradient(135deg, #1a0f00 0%, #2a1800 50%, #0f0f0f 100%)',
    thumbIcon: '🔧',
    content: [
      { body: 'A manutenção preventiva das máquinas de solda MIG/MAG é frequentemente negligenciada, mas é um dos maiores fatores que impactam a qualidade das soldas e os custos operacionais. Uma máquina mal mantida consome mais gás, desperdiça arame e produz soldas irregulares.' },
      { heading: 'Checklist semanal', body: '✓ Inspecionar a mangueira da tocha por rachaduras ou dobras | ✓ Verificar o bico de contato (trocar se desgastado ou com respingos) | ✓ Limpar o difusor de gás com spray anti-respingo | ✓ Verificar a tensão de frenagem do carretel de arame | ✓ Inspecionar o cabo de retorno e a garra de massa.' },
      { heading: 'Checklist mensal', body: '✓ Soprar internamente a fonte de solda com ar comprimido seco | ✓ Verificar e lubrificar as guias do alimentador de arame | ✓ Inspecionar conexões elétricas internas por sinais de aquecimento | ✓ Testar o fluxo de gás com rotâmetro | ✓ Verificar os roletes de alimentação (desgaste, entalhes).' },
      { heading: 'Troca do bico de contato', body: 'O bico de contato é o componente que mais se desgasta. Um bico desgastado aumenta a resistência de contato, gerando calor excessivo e instabilidade no arco. Troque quando: o furo estiver oval, houver respingos internos que não soltam, ou a alimentação do arame estiver irregular. Use bicos de cobre cromado para maior durabilidade.' },
      { heading: 'Regulagem do carretel', body: 'A tensão de frenagem do carretel deve ser mínima para evitar que o arame solte em laços, mas não excessiva para não forçar o motor do alimentador. Teste soltando o arame com o motor: ele deve parar imediatamente, sem dar volta. Regulagem incorreta é causa comum de "birdnesting" (ninho de arame no alimentador).' },
    ],
  },
  {
    id: 7, slug: 'salario-soldador-2024', featured: false,
    title: 'Quanto ganha um soldador no Brasil em 2024? Dados reais por processo',
    excerpt: 'Levantamento dos salários médios por processo, região e nível de qualificação. Saiba onde estão as melhores oportunidades.',
    tag: 'Mercado', date: '2024-03-30', minutes: 5, author: 'Equipe W&F',
    thumbBg: 'linear-gradient(135deg, #0a1a00 0%, #1a2e00 50%, #0a0a0a 100%)',
    thumbIcon: '💰',
    content: [
      { body: 'A remuneração de soldadores varia significativamente de acordo com o processo dominado, a região do país, o setor de atuação e o nível de qualificação. Com base em dados do CAGED, RAIS e plataformas de emprego (LinkedIn, Indeed, Catho) coletados ao longo de 2023-2024, compilamos as principais referências do mercado.' },
      { heading: 'Tabela salarial por processo (faixas médias nacionais)', body: 'Eletrodo Revestido (SMAW): R$ 2.500 – R$ 4.000/mês | MIG/MAG (GMAW): R$ 3.000 – R$ 5.500/mês | TIG (GTAW): R$ 4.500 – R$ 9.000/mês | TIG + MIG/MAG multiprocesso: R$ 5.000 – R$ 10.000/mês. Soldadores com qualificação FBTS e experiência em normas ASME/Petrobras podem ultrapassar R$ 12.000/mês em regime de embarque.' },
      { heading: 'Regiões que mais pagam', body: 'Sul (SC, RS, PR) e Sudeste (SP, RJ, ES) lideram as médias salariais, impulsionados pelo polo naval catarinense, construção metálica gaúcha e petroquímica do Rio de Janeiro. Nordeste (PE, BA) cresce com os projetos da SUAPE e do Polo Petroquímico de Camaçari.' },
      { heading: 'Como aumentar seu salário', body: 'Os maiores saltos salariais vêm de: (1) adicionar um segundo processo ao currículo — de Eletrodo para MIG/MAG é o primeiro passo; (2) qualificação FBTS em qualquer nível; (3) experiência documentada em normas ASME IX ou AWS D1.1; (4) certificação NR-10 e NR-34 para trabalhos em estaleiros e plataformas. Cada etapa representa uma média de 20-40% de aumento salarial.' },
    ],
  },
  {
    id: 8, slug: 'certificacao-fbts', featured: false,
    title: 'Certificação FBTS: o que é, quanto custa e como se preparar',
    excerpt: 'A certificação FBTS é a principal certificação nacional para soldadores e inspetores. Entenda os níveis, custos e como conquistar a sua.',
    tag: 'Certificações', date: '2024-03-18', minutes: 7, author: 'Equipe W&F',
    thumbBg: 'linear-gradient(135deg, #1a0a00 0%, #2a1500 50%, #0a0a1a 100%)',
    thumbIcon: '🏆',
    content: [
      { body: 'A FBTS (Fundação Brasileira de Tecnologia de Soldagem) é a organização responsável pelas principais certificações de soldadores e inspetores de solda no Brasil. Suas certificações são amplamente reconhecidas pela indústria nacional, sendo requisito em processos seletivos das maiores empresas do setor — especialmente petroquímica, siderurgia e construção naval.' },
      { heading: 'Certificação de Soldador (CS-FBTS)', body: 'A certificação de soldador da FBTS é emitida por processo (TIG, MIG/MAG, Eletrodo) e posição de soldagem. O candidato realiza uma prova prática, cujo cupom é analisado por inspeção visual, radiografia (RX) e/ou dobramento. A validade é de 2 anos, renovável mediante comprovação de atividade ou nova prova. Custo aproximado: R$ 300 – R$ 600 por processo/posição.' },
      { heading: 'Inspetor de Soldagem N1 (IS-1)', body: 'O nível N1 é o ponto de entrada para a carreira de inspeção. Exige escolaridade mínima de ensino médio, participação em treinamento de 40h e aprovação em exame teórico sobre processos de soldagem, símbolos de solda, descontinuidades e normas básicas. Validade: 3 anos. Custo: R$ 1.500 – R$ 2.500 (curso + exame).' },
      { heading: 'Níveis N2 e N3', body: 'O IS-N2 exige experiência documentada de ao menos 2 anos como N1 e aprovação em exame mais aprofundado sobre normas ASME, AWS e procedimentos de qualificação. O IS-N3 é o nível máximo, exige formação técnica ou superior em engenharia/metalurgia. N3 habilita a qualificar procedimentos e emitir pareceres técnicos. Salários de inspetores N3 podem superar R$ 18.000/mês em projetos offshore.' },
      { heading: 'Como se preparar', body: 'Para a certificação de soldador, pratique as posições exigidas (2G, 3G, 4G) com o processo desejado até obter uniformidade no cordão. Para o IS-N1, estude a norma NBR ISO 9712, terminologia de descontinuidades, e os principais processos. A Welder & Fusion oferece preparação prática e teórica que alinha com os requisitos da FBTS.' },
    ],
  },
]

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function ArticleThumb({ bg, icon, size = 'full' }: { bg: string; icon: string; size?: 'full' | 'sm' }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: bg }}>
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle, #FF8C00 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />
      <span style={{ fontSize: size === 'sm' ? 32 : 48, filter: 'drop-shadow(0 2px 8px rgba(255,140,0,0.4))' }}>{icon}</span>
    </div>
  )
}

export function ArticlesPage() {
  const [activeTag, setActiveTag] = useState('Todos')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Article | null>(null)

  const filtered = ARTICLES.filter(a => {
    const matchTag = activeTag === 'Todos' || a.tag === activeTag
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase())
    return matchTag && matchSearch
  })

  const featured = ARTICLES.find(a => a.featured)
  const grid = filtered.filter(a => !(a.featured && activeTag === 'Todos' && !search))

  return (
    <div style={{ background: '#1A1A1A' }}>

      {/* Hero */}
      <section className="py-14 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-5 text-xs font-semibold uppercase tracking-widest"
            style={{ borderColor: '#FF8C0033', background: '#FF8C0010', color: '#FF8C00' }}>
            Conhecimento em Soldagem
          </div>
          <h1 className="text-5xl font-black text-white mb-4">Artigos &amp; Notícias</h1>
          <p className="text-lg text-white">
            Conteúdo técnico, tendências de mercado e dicas de carreira para soldadores profissionais.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-4 mb-10">
          <div className="flex flex-wrap gap-2 flex-1">
            {TAGS.map(t => (
              <button key={t} onClick={() => setActiveTag(t)}
                className="px-3 py-1.5 rounded-full text-sm font-medium border transition-all"
                style={activeTag === t
                  ? { background: '#FF8C00', color: '#000', borderColor: '#FF8C00' }
                  : { background: 'transparent', color: '#d1d5db', borderColor: '#ffffff15' }}>
                {t}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-56">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B7280' }} />
            <Input placeholder="Buscar artigo..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 text-sm" />
          </div>
        </div>

        {/* Destaque */}
        {featured && activeTag === 'Todos' && !search && (
          <div className="mb-10 rounded-3xl overflow-hidden border group cursor-pointer"
            style={{ background: '#242424', borderColor: '#FF8C0025' }}
            onClick={() => setSelected(featured)}>
            <div className="grid lg:grid-cols-5">
              <div className="lg:col-span-2 min-h-[200px] lg:min-h-0">
                <ArticleThumb bg={featured.thumbBg} icon={featured.thumbIcon} />
              </div>
              <div className="lg:col-span-3 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{ background: (TAG_COLORS[featured.tag] || '#FF8C00') + '20', color: TAG_COLORS[featured.tag] || '#FF8C00' }}>
                      {featured.tag}
                    </span>
                    <span className="text-xs flex items-center gap-1 text-white"><Clock size={11} /> {featured.minutes} min de leitura</span>
                  </div>
                  <h2 className="text-2xl font-black text-white mb-3 group-hover:text-[#FF8C00] transition-colors leading-snug">{featured.title}</h2>
                  <p className="text-sm leading-relaxed text-white">{featured.excerpt}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t mt-4" style={{ borderColor: '#ffffff0d' }}>
                  <span className="text-xs text-white">{fmtDate(featured.date)}</span>
                  <span className="flex items-center gap-1 text-sm font-semibold" style={{ color: '#FF8C00' }}>
                    Ler artigo <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 rounded-2xl" style={{ background: '#242424' }}>
            <p className="text-white font-semibold mb-1">Nenhum artigo encontrado</p>
            <p className="text-sm text-white">Tente outro filtro ou termo de busca.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {grid.map(article => (
              <article key={article.id}
                className="group rounded-2xl border flex flex-col overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-2xl"
                style={{ background: '#242424', borderColor: '#ffffff0d' }}
                onClick={() => setSelected(article)}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#FF8C0030')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#ffffff0d')}>
                <div className="h-44 overflow-hidden">
                  <ArticleThumb bg={article.thumbBg} icon={article.thumbIcon} size="sm" />
                </div>
                <div className="h-1" style={{ background: TAG_COLORS[article.tag] || '#FF8C00' }} />
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: TAG_COLORS[article.tag] || '#FF8C00' }}>
                      <Tag size={11} /> {article.tag}
                    </span>
                    <span className="text-xs flex items-center gap-1 text-white"><Clock size={11} /> {article.minutes} min</span>
                  </div>
                  <h3 className="font-bold text-white text-base leading-snug mb-2 group-hover:text-[#FF8C00] transition-colors flex-1">{article.title}</h3>
                  <p className="text-sm leading-relaxed mb-4 text-white">{article.excerpt}</p>
                  <div className="flex items-center justify-between pt-3 border-t mt-auto" style={{ borderColor: '#ffffff08' }}>
                    <span className="text-xs text-white">{fmtDate(article.date)}</span>
                    <span className="text-xs font-semibold flex items-center gap-1 transition-colors group-hover:text-white" style={{ color: '#FF8C00' }}>
                      Ler <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 rounded-3xl p-10 text-center border" style={{ background: '#242424', borderColor: '#FF8C0020' }}>
          <h3 className="text-2xl font-black text-white mb-2">Quer receber novos artigos?</h3>
          <p className="mb-6 text-white">Fale conosco pelo WhatsApp e fique por dentro de tudo sobre soldagem.</p>
          <a href="https://wa.me/5547988786738" target="_blank" rel="noreferrer">
            <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
              style={{ background: '#FF8C00', color: '#000' }}>
              📲 Acompanhar no WhatsApp
            </button>
          </a>
        </div>
      </div>

      {/* ── MODAL ARTIGO ── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto">
          <div className="absolute inset-0 bg-black/80" onClick={() => setSelected(null)} />
          <div className="relative z-10 w-full max-w-3xl rounded-2xl overflow-hidden mb-8"
            style={{ background: '#1A1A1A', border: '1px solid #FF8C0020' }}>

            {/* Thumbnail */}
            <div className="h-48 relative">
              <ArticleThumb bg={selected.thumbBg} icon={selected.thumbIcon} />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-80"
                style={{ background: 'rgba(0,0,0,0.7)', color: '#fff' }}>
                <X size={18} />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="p-8">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: (TAG_COLORS[selected.tag] || '#FF8C00') + '20', color: TAG_COLORS[selected.tag] || '#FF8C00' }}>
                  {selected.tag}
                </span>
                <span className="text-xs flex items-center gap-1 text-white"><Clock size={11} /> {selected.minutes} min de leitura</span>
                <span className="text-xs text-white">{fmtDate(selected.date)}</span>
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-white mb-6 leading-snug">{selected.title}</h1>

              <div className="space-y-5">
                {selected.content.map((block, i) => (
                  <div key={i}>
                    {block.heading && (
                      <h2 className="text-lg font-black mb-2" style={{ color: '#FF8C00' }}>{block.heading}</h2>
                    )}
                    <p className="text-sm leading-relaxed text-white">{block.body}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t flex items-center justify-between" style={{ borderColor: '#ffffff0d' }}>
                <div>
                  <p className="text-xs text-white">Por {selected.author}</p>
                  <p className="text-xs text-white">{fmtDate(selected.date)}</p>
                </div>
                <button onClick={() => setSelected(null)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                  style={{ background: '#FF8C00', color: '#000' }}>
                  Fechar artigo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
