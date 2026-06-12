import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Clock, Users, ChevronRight, CheckCircle, Flame, ArrowRight, Zap } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Course } from '@/types'
import { Input, Badge, Spinner } from '@/components/ui'
import { formatCurrency, LEVEL_LABELS } from '@/lib/utils'
import { getThumbnailUrl } from '@/lib/cloudinary'

// ── Dados reais dos processos ──────────────────────────────────────────────
const PROCESSES = [
  {
    id: 'tig',
    code: 'TIG',
    norm: 'GTAW',
    color: '#00BFFF',
    colorBg: '#00BFFF12',
    title: 'Soldagem TIG',
    subtitle: 'Tungsten Inert Gas — Precisão como arte',
    description:
      'O processo TIG é considerado o mais preciso e nobre da soldagem. Utiliza um eletrodo de tungstênio não-consumível e gás inerte de proteção, produzindo soldas de altíssima qualidade visual e estrutural. Indispensável em setores que exigem acabamento impecável.',
    audience: 'Soldadores que buscam especialização em materiais nobres e setores de alta exigência técnica.',
    skills: [
      'Controle preciso do arco elétrico e poça de fusão',
      'Soldagem de aço inoxidável e ligas especiais',
      'Soldagem de alumínio e titânio',
      'Aplicação de normas AWS D1.1 e ASME IX',
      'Preparação de juntas e chanfros',
      'Leitura e interpretação de WPS',
    ],
    careers: ['Indústria Petroquímica', 'Fabricação Aeronáutica', 'Indústria Alimentícia', 'Caldeiraria Fina', 'Offshore'],
    hours: '80–120h',
    demand: 'Altíssima',
    icon: (
      <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
        <line x1="20" y1="4" x2="20" y2="18" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="20" cy="22" r="5" fill="currentColor" opacity="0.9"/>
        {[0,60,120,180,240,300].map((a,i) => {
          const r = a * Math.PI / 180
          return <line key={i} x1={20+Math.cos(r)*6} y1={22+Math.sin(r)*6} x2={20+Math.cos(r)*13} y2={22+Math.sin(r)*13}
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity={0.5+i*0.08}/>
        })}
        <ellipse cx="20" cy="30" rx="8" ry="3" fill="currentColor" opacity="0.25"/>
      </svg>
    ),
  },
  {
    id: 'mig-mag',
    code: 'MIG/MAG',
    norm: 'GMAW',
    color: '#FF8C00',
    colorBg: '#FF8C0012',
    title: 'Soldagem MIG/MAG',
    subtitle: 'Gas Metal Arc Welding — Produtividade industrial',
    description:
      'O processo MIG/MAG é o mais utilizado no mundo industrial. Com alimentação automática de arame-eletrodo e proteção gasosa, combina alta velocidade de deposição com versatilidade de materiais. Fundamental para qualquer soldador que quer trabalhar na indústria moderna.',
    audience: 'Iniciantes e profissionais que precisam de alta empregabilidade imediata na indústria metal-mecânica.',
    skills: [
      'Configuração de parâmetros (tensão, corrente, velocidade de arame)',
      'Soldagem de aço carbono e inoxidável',
      'Soldagem de alumínio (MIG pulsado)',
      'Posições plana, horizontal, vertical e sobre-cabeça',
      'Controle de distorção térmica',
      'Inspeção visual de cordão de solda',
    ],
    careers: ['Indústria Automotiva', 'Metalurgia e Siderurgia', 'Construção Metálica', 'Fabricação de Equipamentos', 'Manutenção Industrial'],
    hours: '60–100h',
    demand: 'Muito Alta',
    icon: (
      <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
        <path d="M8 10 L20 28 L32 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="20" cy="28" r="4" fill="currentColor" opacity="0.9"/>
        {[-1,0,1].map((o,i) => <line key={i} x1={16+o*4} y1="32" x2={16+o*4} y2="36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>)}
      </svg>
    ),
  },
  {
    id: 'eletrodo',
    code: 'Eletrodo',
    norm: 'SMAW',
    color: '#FFA500',
    colorBg: '#FFA50012',
    title: 'Eletrodo Revestido',
    subtitle: 'Shielded Metal Arc Welding — A base de todo soldador',
    description:
      'O eletrodo revestido é o processo fundacional da soldagem. Versátil, portátil e aplicável a praticamente qualquer metal ferroso, é o processo mais ensinado mundialmente e o primeiro passo de qualquer soldador profissional. Dominar o SMAW abre as portas para todos os demais processos.',
    audience: 'Quem está começando na soldagem ou quer construir uma base sólida para avançar para TIG e MIG/MAG.',
    skills: [
      'Abertura e manutenção do arco elétrico',
      'Técnica de passe e progressão de solda',
      'Seleção correta de eletrodos (E6010, E6013, E7018)',
      'Soldagem em todas as posições (1G, 2G, 3G, 4G)',
      'Controle de respingos e qualidade do cordão',
      'Tratamento térmico e pré-aquecimento',
    ],
    careers: ['Manutenção Industrial', 'Construção Civil Metálica', 'Estaleiros', 'Petróleo e Gás', 'Serralheria e Estruturas'],
    hours: '40–80h',
    demand: 'Alta',
    icon: (
      <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
        <rect x="17" y="2" width="6" height="22" rx="3" fill="currentColor" opacity="0.8"/>
        <circle cx="20" cy="26" r="6" fill="currentColor" opacity="0.9"/>
        {[45,90,135,180,225,270,315,0].map((a,i) => {
          const r = a * Math.PI / 180
          return <line key={i} x1={20+Math.cos(r)*7} y1={26+Math.sin(r)*7} x2={20+Math.cos(r)*14} y2={26+Math.sin(r)*14}
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity={0.3+i*0.07}/>
        })}
      </svg>
    ),
  },
]

const LEVEL_OPTIONS = [
  { value: '', label: 'Todos os níveis' },
  { value: 'beginner', label: 'Iniciante' },
  { value: 'intermediate', label: 'Intermediário' },
  { value: 'advanced', label: 'Avançado' },
]

export function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('')

  useEffect(() => {
    async function load() {
      let query = supabase
        .from('courses')
        .select('*, instructor:user_profiles(id, name, avatar_url)')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
      if (level) query = query.eq('level', level)
      const { data } = await query
      setCourses((data || []) as Course[])
      setLoading(false)
    }
    load()
  }, [level])

  const filtered = courses.filter(c =>
    !search || c.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative py-20 overflow-hidden" style={{ background: '#1A1A1A' }}>
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute right-0 top-0 w-96 h-96 blur-3xl opacity-10 rounded-full"
          style={{ background: 'radial-gradient(circle, #FF8C00, transparent)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 text-xs font-semibold uppercase tracking-widest"
            style={{ borderColor: '#FF8C0033', background: '#FF8C0010', color: '#FF8C00' }}>
            <Flame size={12} /> Qualificação que Conecta o Seu Futuro
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-5">
            Cursos de <span style={{ color: '#FF8C00' }}>Soldagem</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: '#9CA3AF' }}>
            Do eletrodo revestido ao TIG de precisão — domine os processos mais exigidos
            pela indústria e transforme sua habilidade em oportunidade.
          </p>
        </div>
      </section>

      {/* ── PROCESSOS DETALHADOS ──────────────────────────────────────── */}
      <section className="py-6" style={{ background: '#1A1A1A' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

          {PROCESSES.map((proc, idx) => (
            <div key={proc.id}
              className="rounded-3xl border overflow-hidden"
              style={{ background: '#242424', borderColor: proc.color + '25' }}>

              {/* Header */}
              <div className="p-6 md:p-8 border-b" style={{ borderColor: proc.color + '20', background: proc.colorBg }}>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: proc.color + '20', color: proc.color }}>
                    {proc.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h2 className="text-2xl md:text-3xl font-black text-white">{proc.title}</h2>
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full"
                        style={{ background: proc.color + '20', color: proc.color }}>
                        {proc.norm}
                      </span>
                    </div>
                    <p className="text-sm font-medium" style={{ color: proc.color }}>{proc.subtitle}</p>
                  </div>
                  <div className="flex gap-4 text-center">
                    <div>
                      <p className="text-xl font-black text-white">{proc.hours}</p>
                      <p className="text-xs" style={{ color: '#6B7280' }}>Carga horária</p>
                    </div>
                    <div className="w-px" style={{ background: proc.color + '30' }} />
                    <div>
                      <p className="text-xl font-black" style={{ color: proc.color }}>{proc.demand}</p>
                      <p className="text-xs" style={{ color: '#6B7280' }}>Demanda</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 md:p-8 grid md:grid-cols-3 gap-8">

                {/* Description */}
                <div className="md:col-span-1">
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: proc.color }}>
                    Sobre o Processo
                  </h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: '#9CA3AF' }}>
                    {proc.description}
                  </p>
                  <div className="p-4 rounded-xl text-sm" style={{ background: proc.color + '08', border: `1px solid ${proc.color}20` }}>
                    <p className="font-semibold text-white mb-1">Para quem é?</p>
                    <p style={{ color: '#9CA3AF' }}>{proc.audience}</p>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: proc.color }}>
                    O que você vai aprender
                  </h3>
                  <ul className="space-y-2">
                    {proc.skills.map(skill => (
                      <li key={skill} className="flex items-start gap-2 text-sm" style={{ color: '#9CA3AF' }}>
                        <CheckCircle size={14} className="flex-shrink-0 mt-0.5" style={{ color: proc.color }} />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Careers + CTA */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: proc.color }}>
                    Onde você pode trabalhar
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {proc.careers.map(c => (
                      <span key={c} className="text-xs px-3 py-1.5 rounded-full font-medium"
                        style={{ background: proc.color + '15', color: proc.color }}>
                        {c}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto p-4 rounded-2xl text-center"
                    style={{ background: '#1A1A1A', border: `1px solid ${proc.color}20` }}>
                    <p className="text-sm text-white font-semibold mb-1">Próxima turma</p>
                    <p className="text-xs mb-3" style={{ color: '#6B7280' }}>Vagas limitadas — garanta a sua!</p>
                    <Link to="/cadastro"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                      style={{ background: proc.color, color: '#000' }}>
                      Quero me matricular <ArrowRight size={14} />
                    </Link>
                    <Link to="/login" className="block mt-2 text-xs transition-colors hover:text-white" style={{ color: '#6B7280' }}>
                      Já tenho conta → Entrar
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMPARATIVO ───────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#242424' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#FF8C00' }}>Guia Rápido</p>
            <h2 className="text-3xl font-black text-white">Qual processo escolher?</h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: '#ffffff0d' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#1A1A1A', borderBottom: '1px solid #ffffff0d' }}>
                  <th className="text-left px-5 py-3 font-semibold text-white">Processo</th>
                  <th className="text-center px-4 py-3 font-semibold" style={{ color: '#9CA3AF' }}>Dificuldade</th>
                  <th className="text-center px-4 py-3 font-semibold" style={{ color: '#9CA3AF' }}>Velocidade</th>
                  <th className="text-center px-4 py-3 font-semibold" style={{ color: '#9CA3AF' }}>Qualidade</th>
                  <th className="text-center px-4 py-3 font-semibold" style={{ color: '#9CA3AF' }}>Salário médio</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Eletrodo Revestido', color: '#FFA500', dif: '⭐⭐', vel: '⭐⭐', qual: '⭐⭐⭐', sal: 'R$ 2.500–4.000' },
                  { name: 'MIG/MAG', color: '#FF8C00', dif: '⭐⭐⭐', vel: '⭐⭐⭐⭐', qual: '⭐⭐⭐⭐', sal: 'R$ 3.000–5.500' },
                  { name: 'TIG', color: '#00BFFF', dif: '⭐⭐⭐⭐⭐', vel: '⭐⭐', qual: '⭐⭐⭐⭐⭐', sal: 'R$ 4.500–9.000+' },
                ].map(row => (
                  <tr key={row.name} className="border-t" style={{ borderColor: '#ffffff08' }}>
                    <td className="px-5 py-4">
                      <span className="font-bold text-white">{row.name}</span>
                    </td>
                    <td className="px-4 py-4 text-center text-base">{row.dif}</td>
                    <td className="px-4 py-4 text-center text-base">{row.vel}</td>
                    <td className="px-4 py-4 text-center text-base">{row.qual}</td>
                    <td className="px-4 py-4 text-center font-semibold text-sm" style={{ color: row.color }}>{row.sal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-center mt-3" style={{ color: '#4B5563' }}>
            * Referência mercado nacional 2024. Varia por região e experiência.
          </p>
        </div>
      </section>

      {/* ── CURSOS DISPONÍVEIS (dinâmico do banco) ───────────────────── */}
      <section className="py-20" style={{ background: '#1A1A1A' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest mb-1" style={{ color: '#FF8C00' }}>Grade de Cursos</p>
              <h2 className="text-3xl font-black text-white">Matrículas Abertas</h2>
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B7280' }} />
                <Input
                  placeholder="Buscar curso..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 w-52"
                />
              </div>
              <select
                value={level}
                onChange={e => setLevel(e.target.value)}
                className="text-sm rounded-lg px-3 py-2 border"
                style={{ background: '#242424', borderColor: '#ffffff1a', color: '#fff' }}
              >
                {LEVEL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border"
              style={{ borderColor: '#ffffff0d', background: '#242424' }}>
              <Zap size={36} className="mx-auto mb-3" style={{ color: '#FF8C0030' }} />
              <p className="text-white font-semibold mb-1">Nenhum curso encontrado</p>
              <p className="text-sm" style={{ color: '#6B7280' }}>
                {search ? 'Tente outro termo de busca.' : 'Em breve novos cursos serão adicionados. Fique de olho!'}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(course => (
                <Link key={course.id} to={`/cursos/${course.id}`}
                  className="group rounded-2xl overflow-hidden border flex flex-col transition-all hover:-translate-y-1 hover:shadow-2xl"
                  style={{ background: '#242424', borderColor: '#ffffff0d' }}>
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden flex-shrink-0" style={{ background: '#1A1A1A' }}>
                    {course.thumbnail_url ? (
                      <img src={getThumbnailUrl(course.thumbnail_url!)}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Flame size={48} style={{ color: '#FF8C0025' }} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex gap-2">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: '#FF8C00', color: '#000' }}>
                        {LEVEL_LABELS[course.level as keyof typeof LEVEL_LABELS] ?? course.level}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-white text-lg mb-1 leading-snug group-hover:text-[#FF8C00] transition-colors">
                      {course.title}
                    </h3>
                    {course.description && (
                      <p className="text-sm mb-3 line-clamp-2" style={{ color: '#6B7280' }}>{course.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-xs mb-4" style={{ color: '#6B7280' }}>
                      {course.duration_hours && (
                        <span className="flex items-center gap-1"><Clock size={12} /> {course.duration_hours}h</span>
                      )}
                      {course.enrolled_count != null && (
                        <span className="flex items-center gap-1"><Users size={12} /> {course.enrolled_count} alunos</span>
                      )}
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t" style={{ borderColor: '#ffffff08' }}>
                      <span className="text-xl font-black" style={{ color: '#FF8C00' }}>
                        {course.price === 0 ? 'Gratuito' : formatCurrency(course.price)}
                      </span>
                      <span className="flex items-center gap-1 text-sm font-semibold transition-colors group-hover:text-white"
                        style={{ color: '#FF8C00' }}>
                        Ver detalhes <ChevronRight size={15} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────────────── */}
      <section className="py-20 text-center" style={{ background: '#FF8C00' }}>
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-black text-black mb-4">Poucas vagas! Garanta a sua.</h2>
          <p className="text-black/70 text-lg mb-8">
            Turmas com máximo 10 alunos. Entre em contato agora pelo WhatsApp e garanta sua vaga na próxima turma.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="https://wa.me/5547988786738" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
              style={{ background: '#000', color: '#fff' }}>
              📲 Falar no WhatsApp — (47) 98878-6738
            </a>
            <Link to="/cadastro"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm border-2 border-black transition-all hover:bg-black hover:text-white"
              style={{ color: '#000' }}>
              Criar Conta Gratuita
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
