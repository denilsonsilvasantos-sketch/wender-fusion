import { useEffect, useState } from 'react'
import api from '@/lib/api'
import type { TalentBank } from '@/types'
import { Button, Input, Spinner } from '@/components/ui'

const availableOptions = [
  { value: 'clt', label: 'Disponível para CLT' },
  { value: 'pj', label: 'Disponível para PJ' },
  { value: 'both', label: 'Disponível para CLT e PJ' },
  { value: 'not_available', label: 'Não estou procurando emprego' },
]

export function TalentPage() {
  const [profile, setProfile] = useState<Partial<TalentBank>>({
    professional_title: '',
    summary: '',
    skills: [],
    experience_years: 0,
    available_for: 'both',
    location: '',
    linkedin_url: '',
    portfolio_url: '',
    visible: true,
  })
  const [skillInput, setSkillInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.get<{ data: TalentBank | null }>('/empregabilidade/talent-bank/my')
      .then(res => { if (res.data.data) setProfile(res.data.data) })
      .finally(() => setLoading(false))
  }, [])

  function addSkill() {
    const s = skillInput.trim()
    if (!s || profile.skills?.includes(s)) return
    setProfile(p => ({ ...p, skills: [...(p.skills ?? []), s] }))
    setSkillInput('')
  }

  function removeSkill(skill: string) {
    setProfile(p => ({ ...p, skills: p.skills?.filter(s => s !== skill) }))
  }

  async function save() {
    setSaving(true)
    setSaved(false)
    try {
      await api.put('/empregabilidade/talent-bank/my', profile)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>
  )

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Banco de Talentos</h1>
          <p className="text-[var(--color-text-muted)] mt-1 text-sm">
            Seu perfil profissional visível para empresas parceiras
          </p>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-sm text-[var(--color-text-muted)]">Visível</span>
          <div
            onClick={() => setProfile(p => ({ ...p, visible: !p.visible }))}
            className={`w-11 h-6 rounded-full transition-colors ${profile.visible ? 'bg-[var(--color-primary)]' : 'bg-white/10'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white mt-0.5 transition-transform ${profile.visible ? 'translate-x-5.5 ml-0.5' : 'translate-x-0.5 ml-0.5'}`} />
          </div>
        </label>
      </div>

      {saved && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 text-green-400 text-sm">
          Perfil atualizado com sucesso!
        </div>
      )}

      <div className="bg-[var(--color-surface)] rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold">Informações Profissionais</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm text-[var(--color-text-muted)] mb-1">Título profissional</label>
            <Input
              value={profile.professional_title ?? ''}
              onChange={e => setProfile(p => ({ ...p, professional_title: e.target.value }))}
              placeholder="Ex.: Soldador TIG/MIG — Sênior"
            />
          </div>

          <div>
            <label className="block text-sm text-[var(--color-text-muted)] mb-1">Anos de experiência</label>
            <Input
              type="number"
              min={0}
              value={profile.experience_years ?? 0}
              onChange={e => setProfile(p => ({ ...p, experience_years: +e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm text-[var(--color-text-muted)] mb-1">Localização</label>
            <Input
              value={profile.location ?? ''}
              onChange={e => setProfile(p => ({ ...p, location: e.target.value }))}
              placeholder="Ex.: São Paulo, SP"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm text-[var(--color-text-muted)] mb-1">Disponibilidade</label>
            <select
              value={profile.available_for ?? 'both'}
              onChange={e => setProfile(p => ({ ...p, available_for: e.target.value as TalentBank['available_for'] }))}
              className="w-full bg-[var(--color-bg)] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
            >
              {availableOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm text-[var(--color-text-muted)] mb-1">Resumo profissional</label>
            <textarea
              value={profile.summary ?? ''}
              onChange={e => setProfile(p => ({ ...p, summary: e.target.value }))}
              rows={4}
              placeholder="Descreva sua experiência, especialidades e objetivos..."
              className="w-full bg-[var(--color-bg)] border border-white/10 rounded-lg p-3 text-white text-sm resize-none focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-surface)] rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold">Habilidades</h2>
        <div className="flex gap-2">
          <Input
            value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            placeholder="Ex.: Soldagem TIG, MIG/MAG, Eletrodo..."
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            className="flex-1"
          />
          <Button variant="outline" onClick={addSkill}>Adicionar</Button>
        </div>
        {(profile.skills ?? []).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {profile.skills?.map(skill => (
              <span
                key={skill}
                className="flex items-center gap-1.5 bg-[var(--color-primary)]/15 text-[var(--color-primary)] text-sm px-3 py-1 rounded-full"
              >
                {skill}
                <button onClick={() => removeSkill(skill)} className="hover:text-white transition-colors">×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="bg-[var(--color-surface)] rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold">Links</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-[var(--color-text-muted)] mb-1">LinkedIn</label>
            <Input
              value={profile.linkedin_url ?? ''}
              onChange={e => setProfile(p => ({ ...p, linkedin_url: e.target.value }))}
              placeholder="https://linkedin.com/in/seu-perfil"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--color-text-muted)] mb-1">Portfólio</label>
            <Input
              value={profile.portfolio_url ?? ''}
              onChange={e => setProfile(p => ({ ...p, portfolio_url: e.target.value }))}
              placeholder="https://seu-portfolio.com"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={save} disabled={saving}>
          {saving ? <Spinner size="sm" /> : 'Salvar Perfil'}
        </Button>
      </div>
    </div>
  )
}
