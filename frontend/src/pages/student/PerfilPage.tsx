import { useState, useEffect } from 'react'
import { User, Save, Camera } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Card, Button, Spinner } from '@/components/ui'

const COLOR = '#64748B'

export function PerfilPage() {
  const { profile, profileLoading } = useAuth()

  const [name,  setName]  = useState('')
  const [phone, setPhone] = useState('')
  const [bio,   setBio]   = useState('')
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? '')
      setPhone(profile.phone ?? '')
      setBio(profile.bio ?? '')
    }
  }, [profile])

  async function save() {
    if (!profile) return
    setSaving(true)
    await supabase.from('user_profiles').update({ name, phone, bio }).eq('id', profile.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (profileLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Meu Perfil</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Informações da sua conta</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar */}
        <Card>
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-black"
                style={{ background: COLOR + '20', color: COLOR }}>
                {name ? name[0].toUpperCase() : '?'}
              </div>
              <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center border-2"
                style={{ background: 'var(--color-surface)', borderColor: 'var(--color-bg)' }}>
                <Camera size={13} style={{ color: COLOR }} />
              </button>
            </div>
            <div className="text-center">
              <p className="font-bold text-[var(--color-text)]">{name || '—'}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{profile?.email}</p>
              <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full"
                style={{ background: '#6366F1' + '15', color: '#6366F1' }}>Aluno</span>
            </div>
          </div>
        </Card>

        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center gap-2 mb-5">
              <User size={16} style={{ color: COLOR }} />
              <h2 className="font-semibold text-[var(--color-text)]">Dados pessoais</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-1.5 block">
                    Nome completo
                  </label>
                  <input value={name} onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border bg-[var(--color-surface)] text-[var(--color-text)]"
                    style={{ borderColor: 'var(--color-border)' }} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-1.5 block">
                    Telefone
                  </label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(11) 99999-9999"
                    className="w-full px-3 py-2.5 text-sm rounded-xl border bg-[var(--color-surface)] text-[var(--color-text)]"
                    style={{ borderColor: 'var(--color-border)' }} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-1.5 block">
                  E-mail
                </label>
                <input value={profile?.email ?? ''} readOnly
                  className="w-full px-3 py-2.5 text-sm rounded-xl border bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] cursor-not-allowed"
                  style={{ borderColor: 'var(--color-border)' }} />
                <p className="text-xs text-[var(--color-text-muted)] mt-1">O e-mail não pode ser alterado aqui.</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-1.5 block">
                  Sobre mim
                </label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4}
                  placeholder="Uma breve descrição sobre você..."
                  className="w-full px-3 py-2.5 text-sm rounded-xl border bg-[var(--color-surface)] text-[var(--color-text)] resize-none"
                  style={{ borderColor: 'var(--color-border)' }} />
              </div>
              <Button onClick={save} disabled={saving}
                style={{ background: saved ? '#10B981' : COLOR }}>
                <Save size={15} className="mr-2" />
                {saving ? 'Salvando…' : saved ? 'Salvo!' : 'Salvar alterações'}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <h2 className="font-semibold text-[var(--color-text)] mb-4">Informações da conta</h2>
        <div className="space-y-3 text-sm">
          {[
            { label: 'Membro desde', value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : '—' },
            { label: 'Tipo de conta', value: 'Aluno' },
          ].map(r => (
            <div key={r.label} className="flex justify-between pb-3 border-b last:border-0 last:pb-0"
              style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-[var(--color-text-muted)]">{r.label}</span>
              <span className="font-medium text-[var(--color-text)]">{r.value}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
