import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { Input, Button, Avatar, Card } from '@/components/ui'
import api from '@/lib/api'

const schema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  phone: z.string().optional(),
  bio: z.string().max(300, 'Máximo 300 caracteres').optional(),
})

type FormData = z.infer<typeof schema>

export function ProfilePage() {
  const { profile, updateProfile } = useAuth()
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: profile?.name || '', phone: profile?.phone || '', bio: profile?.bio || '' },
  })

  async function onSubmit(data: FormData) {
    setSaving(true)
    try {
      await updateProfile(data)
      toast.success('Perfil atualizado!')
    } catch {
      toast.error('Erro ao atualizar perfil')
    } finally {
      setSaving(false)
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Imagem muito grande (máx 5MB)'); return }
    setUploadingAvatar(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const { data } = await api.post('/users/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      await updateProfile({ avatar_url: data.avatar_url })
      toast.success('Avatar atualizado!')
    } catch {
      toast.error('Erro ao enviar imagem')
    } finally {
      setUploadingAvatar(false)
    }
  }

  if (!profile) return null

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-black text-[var(--color-text)]">Meu Perfil</h1>

      <Card title="Foto de Perfil">
        <div className="flex items-center gap-5">
          <div className="relative">
            <Avatar name={profile.name} avatarUrl={profile.avatar_url} size="xl" />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-black hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50"
            >
              <Camera size={13} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--color-text)]">{profile.name}</p>
            <p className="text-xs text-[var(--color-text-muted)] capitalize">{profile.role}</p>
            {uploadingAvatar && <p className="text-xs text-[var(--color-primary)] mt-1">Enviando...</p>}
          </div>
        </div>
      </Card>

      <Card title="Informações Pessoais">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Nome completo" error={errors.name?.message} {...register('name')} />
          <Input label="E-mail" value={profile.email} disabled hint="O e-mail não pode ser alterado" />
          <Input label="Telefone" placeholder="(00) 00000-0000" {...register('phone')} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">Sobre mim</label>
            <textarea
              rows={3}
              placeholder="Conte um pouco sobre você..."
              className="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] resize-none"
              {...register('bio')}
            />
            {errors.bio && <p className="text-xs text-[var(--color-danger)]">{errors.bio.message}</p>}
          </div>
          <Button type="submit" loading={saving} leftIcon={<Save size={16} />}>Salvar Alterações</Button>
        </form>
      </Card>
    </div>
  )
}
