import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Card } from '@/components/ui'
import { Save, Eye, CheckCircle, Flame, Award, Briefcase, User, MapPin, Phone, Mail } from 'lucide-react'

const COLOR = '#10B981'

type NivelHabilidade = 'basico' | 'intermediario' | 'avancado' | 'especialista'
const NIVEL_LABELS: Record<NivelHabilidade, string> = {
  basico: 'Básico', intermediario: 'Intermediário', avancado: 'Avançado', especialista: 'Especialista',
}
const NIVEL_COLORS: Record<NivelHabilidade, string> = {
  basico: '#64748B', intermediario: '#3B82F6', avancado: '#F59E0B', especialista: '#10B981',
}
const NIVEL_PCT: Record<NivelHabilidade, number> = { basico: 25, intermediario: 50, avancado: 75, especialista: 100 }

interface Habilidade { id: string; nome: string; nivel: NivelHabilidade }
interface Experiencia { id: string; empresa: string; cargo: string; inicio: string; fim: string; descricao: string }

const HABILIDADES_DEFAULT: Habilidade[] = [
  { id: '1', nome: 'Soldagem TIG (GTAW)',       nivel: 'basico' },
  { id: '2', nome: 'Soldagem MIG/MAG (GMAW)',   nivel: 'basico' },
  { id: '3', nome: 'Eletrodo Revestido (SMAW)', nivel: 'basico' },
  { id: '4', nome: 'Leitura de Projetos',       nivel: 'basico' },
  { id: '5', nome: 'Normas ABNT de Soldagem',   nivel: 'basico' },
  { id: '6', nome: 'Segurança do Trabalho',     nivel: 'basico' },
]

const CERTIFICADOS_MOCK = [
  { id: '1', curso: 'Soldagem TIG (GTAW)',       data: '—', status: 'pendente' },
  { id: '2', curso: 'Soldagem MIG/MAG (GMAW)',   data: '—', status: 'pendente' },
]

export function MeuCurriculoPage() {
  const { profile } = useAuth()
  const [tab, setTab] = useState<'editar' | 'visualizar'>('editar')
  const [objetivo, setObjetivo] = useState('')
  const [telefone, setTelefone] = useState('')
  const [cidade, setCidade] = useState('Itajaí, SC')
  const [habilidades, setHabilidades] = useState<Habilidade[]>(HABILIDADES_DEFAULT)
  const [experiencias, setExperiencias] = useState<Experiencia[]>([])
  const [visibilidade, setVisibilidade] = useState<'publico' | 'empresas' | 'privado'>('empresas')
  const [saved, setSaved] = useState(false)

  function setNivel(id: string, nivel: NivelHabilidade) {
    setHabilidades(prev => prev.map(h => h.id === id ? { ...h, nivel } : h))
    setSaved(false)
  }

  function addExperiencia() {
    setExperiencias(prev => [...prev, {
      id: Date.now().toString(), empresa: '', cargo: '', inicio: '', fim: '', descricao: '',
    }])
  }

  function updateExp(id: string, field: keyof Experiencia, value: string) {
    setExperiencias(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e))
    setSaved(false)
  }

  function removeExp(id: string) {
    setExperiencias(prev => prev.filter(e => e.id !== id))
  }

  // Profile completeness
  const checks = [objetivo.trim(), telefone.trim(), cidade.trim(), habilidades.some(h => h.nivel !== 'basico')]
  const pct = Math.round((checks.filter(Boolean).length / checks.length) * 100)
  const pctColor = pct < 50 ? '#EF4444' : pct < 75 ? '#F59E0B' : COLOR

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Meu Currículo</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Construa seu perfil profissional para o mercado de trabalho</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTab(tab === 'editar' ? 'visualizar' : 'editar')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all"
            style={{ borderColor: COLOR + '40', color: COLOR }}
          >
            <Eye size={15} />
            {tab === 'editar' ? 'Pré-visualizar' : 'Editar'}
          </button>
          <button
            onClick={() => setSaved(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all"
            style={{ background: COLOR }}
          >
            {saved ? <CheckCircle size={15} /> : <Save size={15} />}
            {saved ? 'Salvo' : 'Salvar'}
          </button>
        </div>
      </div>

      {/* Completude */}
      <div className="rounded-xl border p-4" style={{ background: pctColor + '08', borderColor: pctColor + '25' }}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-bold text-[var(--color-text)]">Perfil {pct}% completo</p>
          <span className="text-xs font-bold" style={{ color: pctColor }}>{pct < 100 ? 'Complete para aparecer nas buscas' : '🎉 Perfil completo!'}</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: pctColor + '20' }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: pctColor }} />
        </div>
      </div>

      {tab === 'editar' ? (
        <div className="space-y-6">

          {/* Dados pessoais */}
          <Card title="Dados de Contato">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wide">Nome completo</label>
                <input readOnly value={profile?.name ?? ''} className="w-full px-3 py-2.5 rounded-lg border bg-[var(--color-surface-elevated)] text-sm text-[var(--color-text-muted)] border-[var(--color-border)] cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wide">E-mail</label>
                <input readOnly value={profile?.email ?? ''} className="w-full px-3 py-2.5 rounded-lg border bg-[var(--color-surface-elevated)] text-sm text-[var(--color-text-muted)] border-[var(--color-border)] cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wide">Telefone / WhatsApp</label>
                <input type="tel" value={telefone} onChange={e => { setTelefone(e.target.value); setSaved(false) }}
                  placeholder="(47) 9 9999-9999"
                  className="w-full px-3 py-2.5 rounded-lg border bg-[var(--color-surface-elevated)] text-sm text-[var(--color-text)] border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wide">Cidade / Estado</label>
                <input type="text" value={cidade} onChange={e => { setCidade(e.target.value); setSaved(false) }}
                  placeholder="Itajaí, SC"
                  className="w-full px-3 py-2.5 rounded-lg border bg-[var(--color-surface-elevated)] text-sm text-[var(--color-text)] border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]" />
              </div>
            </div>
          </Card>

          {/* Objetivo */}
          <Card title="Objetivo Profissional">
            <textarea
              value={objetivo}
              onChange={e => { setObjetivo(e.target.value); setSaved(false) }}
              rows={3}
              placeholder="Ex: Soldador TIG/MIG com formação pela Welder & Fusion, buscando oportunidade em empresas industriais na região de Itajaí/SC. Comprometido com qualidade, segurança e aprendizado contínuo."
              className="w-full px-4 py-3 rounded-xl border bg-[var(--color-surface-elevated)] text-sm text-[var(--color-text)] border-[var(--color-border)] focus:outline-none resize-none"
            />
            <p className="text-xs text-[var(--color-text-muted)] mt-1 text-right">{objetivo.length}/300</p>
          </Card>

          {/* Habilidades técnicas */}
          <Card title="Competências Técnicas de Soldagem">
            <div className="space-y-4">
              {habilidades.map(h => (
                <div key={h.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-[var(--color-text)]">{h.nome}</span>
                    <span className="text-xs font-bold" style={{ color: NIVEL_COLORS[h.nivel] }}>{NIVEL_LABELS[h.nivel]}</span>
                  </div>
                  <div className="flex gap-1.5">
                    {(Object.keys(NIVEL_LABELS) as NivelHabilidade[]).map(n => (
                      <button
                        key={n}
                        onClick={() => setNivel(h.id, n)}
                        className="flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                        style={{
                          background: h.nivel === n ? NIVEL_COLORS[n] : 'transparent',
                          borderColor: h.nivel === n ? NIVEL_COLORS[n] : NIVEL_COLORS[n] + '35',
                          color: h.nivel === n ? 'white' : NIVEL_COLORS[n],
                        }}
                      >{NIVEL_LABELS[n]}</button>
                    ))}
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full overflow-hidden" style={{ background: NIVEL_COLORS[h.nivel] + '20' }}>
                    <div className="h-full rounded-full transition-all duration-300" style={{ width: `${NIVEL_PCT[h.nivel]}%`, background: NIVEL_COLORS[h.nivel] }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Experiência */}
          <Card title="Experiência Profissional" action={
            <button onClick={addExperiencia} className="text-xs font-bold px-3 py-1 rounded-lg" style={{ background: COLOR + '18', color: COLOR }}>
              + Adicionar
            </button>
          }>
            {experiencias.length === 0 ? (
              <div className="py-6 text-center">
                <Briefcase size={28} className="mx-auto mb-2" style={{ color: COLOR + '50' }} />
                <p className="text-sm text-[var(--color-text-muted)] mb-3">Nenhuma experiência cadastrada</p>
                <button onClick={addExperiencia} className="text-xs font-bold px-4 py-2 rounded-xl" style={{ background: COLOR + '18', color: COLOR }}>
                  Adicionar experiência
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {experiencias.map(exp => (
                  <div key={exp.id} className="p-4 rounded-xl border space-y-3" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-[var(--color-text-muted)] mb-1 uppercase">Empresa</label>
                        <input type="text" value={exp.empresa} onChange={e => updateExp(exp.id, 'empresa', e.target.value)}
                          placeholder="Nome da empresa"
                          className="w-full px-3 py-2 rounded-lg border text-sm bg-[var(--color-surface-elevated)] text-[var(--color-text)] border-[var(--color-border)] focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-[var(--color-text-muted)] mb-1 uppercase">Cargo</label>
                        <input type="text" value={exp.cargo} onChange={e => updateExp(exp.id, 'cargo', e.target.value)}
                          placeholder="Ex: Soldador TIG"
                          className="w-full px-3 py-2 rounded-lg border text-sm bg-[var(--color-surface-elevated)] text-[var(--color-text)] border-[var(--color-border)] focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-[var(--color-text-muted)] mb-1 uppercase">Início</label>
                        <input type="month" value={exp.inicio} onChange={e => updateExp(exp.id, 'inicio', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border text-sm bg-[var(--color-surface-elevated)] text-[var(--color-text)] border-[var(--color-border)] focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-[var(--color-text-muted)] mb-1 uppercase">Fim (vazio = atual)</label>
                        <input type="month" value={exp.fim} onChange={e => updateExp(exp.id, 'fim', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border text-sm bg-[var(--color-surface-elevated)] text-[var(--color-text)] border-[var(--color-border)] focus:outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-[var(--color-text-muted)] mb-1 uppercase">Descrição das atividades</label>
                      <textarea value={exp.descricao} onChange={e => updateExp(exp.id, 'descricao', e.target.value)}
                        rows={2} placeholder="Descreva suas principais atividades e realizações..."
                        className="w-full px-3 py-2 rounded-lg border text-sm bg-[var(--color-surface-elevated)] text-[var(--color-text)] border-[var(--color-border)] focus:outline-none resize-none" />
                    </div>
                    <button onClick={() => removeExp(exp.id)} className="text-xs text-[var(--color-danger)] hover:underline">Remover</button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Certificados */}
          <Card title="Certificados (sincronizados da escola)">
            <div className="space-y-2">
              {CERTIFICADOS_MOCK.map(c => (
                <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl border"
                  style={{ borderColor: c.status === 'emitido' ? '#10B98125' : 'var(--color-border)', background: c.status === 'emitido' ? '#10B98108' : 'transparent' }}>
                  <Award size={15} className="flex-shrink-0" style={{ color: c.status === 'emitido' ? '#10B981' : '#64748B' }} />
                  <p className="flex-1 text-sm text-[var(--color-text)]">{c.curso}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: c.status === 'emitido' ? '#10B98120' : '#64748B20', color: c.status === 'emitido' ? '#10B981' : '#64748B' }}>
                    {c.status === 'emitido' ? 'Certificado' : 'Em andamento'}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-3">Certificados emitidos pela escola são adicionados automaticamente ao seu currículo.</p>
          </Card>

          {/* Visibilidade */}
          <Card title="Visibilidade do Perfil">
            <div className="space-y-2">
              {[
                { key: 'empresas',  label: 'Apenas para Empresas Parceiras', desc: 'Seu perfil é visível somente para empresas cadastradas no banco de talentos', color: COLOR },
                { key: 'publico',   label: 'Público',                         desc: 'Qualquer empresa pode encontrar seu perfil', color: '#F59E0B' },
                { key: 'privado',   label: 'Privado',                         desc: 'Seu perfil não aparece em buscas', color: '#64748B' },
              ].map(v => (
                <button
                  key={v.key}
                  onClick={() => { setVisibilidade(v.key as typeof visibilidade); setSaved(false) }}
                  className="w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all"
                  style={{
                    borderColor: visibilidade === v.key ? v.color : v.color + '25',
                    background: visibilidade === v.key ? v.color + '10' : 'transparent',
                  }}
                >
                  <div className="w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0"
                    style={{ borderColor: v.color, background: visibilidade === v.key ? v.color : 'transparent' }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: visibilidade === v.key ? v.color : 'var(--color-text)' }}>{v.label}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{v.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        /* ── Preview card ─────────────────────────────────────── */
        <div className="rounded-2xl border-2 overflow-hidden" style={{ borderColor: COLOR + '30' }}>
          <div className="px-8 py-6" style={{ background: `linear-gradient(135deg, ${COLOR}18, #6366F110)`, borderBottom: `1px solid ${COLOR}25` }}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white flex-shrink-0"
                style={{ background: COLOR }}>
                {profile?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-black text-[var(--color-text)]">{profile?.name}</h2>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  {cidade && <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]"><MapPin size={11} />{cidade}</span>}
                  {telefone && <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]"><Phone size={11} />{telefone}</span>}
                  <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]"><Mail size={11} />{profile?.email}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Flame size={11} style={{ color: COLOR }} />
                  <span className="text-xs font-bold" style={{ color: COLOR }}>Aluno Welder &amp; Fusion — Itajaí, SC</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-6 space-y-6">
            {objetivo && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Objetivo Profissional</p>
                <p className="text-sm text-[var(--color-text)] italic">"{objetivo}"</p>
              </div>
            )}

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">Competências Técnicas</p>
              <div className="space-y-2">
                {habilidades.map(h => (
                  <div key={h.id}>
                    <div className="flex justify-between mb-0.5">
                      <span className="text-sm text-[var(--color-text)]">{h.nome}</span>
                      <span className="text-xs font-bold" style={{ color: NIVEL_COLORS[h.nivel] }}>{NIVEL_LABELS[h.nivel]}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: NIVEL_COLORS[h.nivel] + '20' }}>
                      <div className="h-full rounded-full" style={{ width: `${NIVEL_PCT[h.nivel]}%`, background: NIVEL_COLORS[h.nivel] }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {experiencias.filter(e => e.empresa).length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">Experiência</p>
                <div className="space-y-3">
                  {experiencias.filter(e => e.empresa).map(e => (
                    <div key={e.id} className="border-l-2 pl-3" style={{ borderColor: COLOR }}>
                      <p className="text-sm font-bold text-[var(--color-text)]">{e.cargo || '—'}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{e.empresa} · {e.inicio || '?'} – {e.fim || 'atual'}</p>
                      {e.descricao && <p className="text-xs text-[var(--color-text)] mt-1">{e.descricao}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
              <p className="text-xs text-[var(--color-text-muted)]">Perfil {pct}% completo</p>
              <p className="text-xs font-semibold" style={{ color: COLOR }}>
                {visibilidade === 'publico' ? '🌐 Público' : visibilidade === 'empresas' ? '🏢 Empresas parceiras' : '🔒 Privado'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
