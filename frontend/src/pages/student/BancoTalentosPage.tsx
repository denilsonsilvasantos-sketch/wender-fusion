import { useState } from 'react'
import { Briefcase, Eye, EyeOff, Save, Star } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Card, Button } from '@/components/ui'

const COLOR = '#10B981'

const PROCESSOS = ['TIG', 'MIG/MAG', 'SMAW', 'FCAW', 'SAW', 'PAW']
const CIDADES   = ['São Paulo – SP', 'Campinas – SP', 'Santos – SP', 'Santo André – SP', 'Remoto']

export function BancoTalentosPage() {
  const { profile } = useAuth()

  const [visible,   setVisible]   = useState(true)
  const [processos, setProcessos] = useState<string[]>(['TIG'])
  const [cidade,    setCidade]    = useState('São Paulo – SP')
  const [pretensao, setPretensao] = useState('')
  const [bio,       setBio]       = useState('')
  const [saved,     setSaved]     = useState(false)

  function toggle(p: string) {
    setProcessos(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  }

  function save() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Banco de Talentos</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Seu perfil para empresas parceiras</p>
      </div>

      {/* Visibility toggle */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: (visible ? COLOR : '#64748B') + '15' }}>
              {visible ? <Eye size={18} style={{ color: COLOR }} /> : <EyeOff size={18} className="text-[var(--color-text-muted)]" />}
            </div>
            <div>
              <p className="font-semibold text-[var(--color-text)]">Perfil {visible ? 'visível' : 'oculto'}</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {visible ? 'Empresas podem visualizar seu perfil' : 'Seu perfil está oculto para empresas'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setVisible(v => !v)}
            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            style={{ background: visible ? COLOR : '#64748B' }}>
            <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
              style={{ transform: visible ? 'translateX(1.25rem)' : 'translateX(0.25rem)' }} />
          </button>
        </div>
      </Card>

      {/* Profile form */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Star size={16} style={{ color: COLOR }} />
          <h2 className="font-semibold text-[var(--color-text)]">Meu perfil profissional</h2>
        </div>

        <div className="space-y-4">
          {/* Processos */}
          <div>
            <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-2 block">
              Processos de soldagem
            </label>
            <div className="flex flex-wrap gap-2">
              {PROCESSOS.map(p => (
                <button key={p} onClick={() => toggle(p)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                  style={processos.includes(p)
                    ? { background: COLOR, color: '#fff' }
                    : { background: 'var(--color-surface-elevated)', color: 'var(--color-text-muted)' }}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Cidade */}
          <div>
            <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-2 block">
              Cidade / disponibilidade
            </label>
            <div className="flex flex-wrap gap-2">
              {CIDADES.map(c => (
                <button key={c} onClick={() => setCidade(c)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                  style={cidade === c
                    ? { background: COLOR, color: '#fff' }
                    : { background: 'var(--color-surface-elevated)', color: 'var(--color-text-muted)' }}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Pretensão */}
          <div>
            <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-2 block">
              Pretensão salarial (R$/mês)
            </label>
            <input value={pretensao} onChange={e => setPretensao(e.target.value)}
              placeholder="Ex: 4.500"
              className="w-full sm:w-48 px-3 py-2 text-sm rounded-xl border bg-[var(--color-surface)] text-[var(--color-text)]"
              style={{ borderColor: 'var(--color-border)' }} />
          </div>

          {/* Bio */}
          <div>
            <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-2 block">
              Sobre mim
            </label>
            <textarea value={bio || profile?.bio || ''} onChange={e => setBio(e.target.value)} rows={4}
              placeholder="Descreva sua experiência, habilidades e objetivos profissionais..."
              className="w-full px-3 py-2 text-sm rounded-xl border bg-[var(--color-surface)] text-[var(--color-text)] resize-none"
              style={{ borderColor: 'var(--color-border)' }} />
          </div>

          <Button onClick={save} style={{ background: saved ? '#10B981' : COLOR }}>
            <Save size={15} className="mr-2" />
            {saved ? 'Salvo!' : 'Salvar perfil'}
          </Button>
        </div>
      </Card>

      {/* Preview */}
      <Card>
        <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-3">
          Pré-visualização do perfil para empresas
        </p>
        <div className="rounded-xl border p-4" style={{ borderColor: COLOR + '30', background: COLOR + '05' }}>
          <p className="font-bold text-[var(--color-text)]">{profile?.name ?? 'Seu nome'}</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{cidade}</p>
          {processos.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {processos.map(p => (
                <span key={p} className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: COLOR + '20', color: COLOR }}>{p}</span>
              ))}
            </div>
          )}
          {(bio || profile?.bio) && (
            <p className="text-sm text-[var(--color-text-muted)] mt-2 line-clamp-2">{bio || profile?.bio}</p>
          )}
          <div className="flex items-center gap-1 mt-3 text-xs" style={{ color: COLOR }}>
            <Briefcase size={11} />
            {pretensao ? `Pretensão: R$ ${pretensao}/mês` : 'Pretensão não informada'}
          </div>
        </div>
      </Card>
    </div>
  )
}
