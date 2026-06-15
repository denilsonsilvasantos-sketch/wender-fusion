import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Users, Search, Shield, GraduationCap, Wrench, Building2, UserCog } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { UserProfile, UserRole } from '@/types'
import { Card, Badge, Input, Select, Spinner } from '@/components/ui'
import { formatDate } from '@/lib/utils'

const COLOR = '#8B5CF6'

const ROLE_META: Record<UserRole, {
  label: string; color: string; icon: React.ElementType
  variant: 'default' | 'success' | 'warning' | 'danger'
}> = {
  admin:             { label: 'Admin',             color: COLOR,     icon: Shield,        variant: 'default' },
  instructor:        { label: 'Instrutor',          color: '#FF8C00', icon: Wrench,        variant: 'warning' },
  student:           { label: 'Aluno',              color: '#22c55e', icon: GraduationCap, variant: 'success' },
  industrial_client: { label: 'Cliente Industrial', color: '#3B82F6', icon: Building2,     variant: 'default' },
}

const ROLE_OPTIONS = [
  { value: 'student',           label: 'Aluno' },
  { value: 'instructor',        label: 'Instrutor' },
  { value: 'admin',             label: 'Admin' },
  { value: 'industrial_client', label: 'Cliente Industrial' },
]

export function SharedUsuariosPage() {
  const [users, setUsers]   = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const search     = searchParams.get('q')    ?? ''
  const filterRole = searchParams.get('role') ?? ''
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editRole, setEditRole]   = useState<UserRole>('student')
  const [saving, setSaving]       = useState(false)

  function updateParam(k: string, v: string) {
    setSearchParams(p => { const n = new URLSearchParams(p); v ? n.set(k, v) : n.delete(k); return n }, { replace: true })
  }

  useEffect(() => {
    supabase.from('profiles').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setUsers((data || []) as UserProfile[]); setLoading(false) })
  }, [])

  async function saveRole(userId: string) {
    setSaving(true)
    const { data } = await supabase.from('profiles').update({ role: editRole }).eq('id', userId).select().single()
    if (data) setUsers(prev => prev.map(u => u.id === userId ? data as UserProfile : u))
    setSaving(false)
    setEditingId(null)
  }

  const filtered = users.filter(u => {
    if (filterRole && u.role !== filterRole) return false
    if (search) {
      const s = search.toLowerCase()
      return u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s)
    }
    return true
  })

  const roleCounts = Object.fromEntries(
    (Object.keys(ROLE_META) as UserRole[]).map(r => [r, users.filter(u => u.role === r).length])
  )

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Usuários</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Gestão de usuários e permissões do portal</p>
      </div>

      {/* Role stat chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(Object.entries(ROLE_META) as [UserRole, typeof ROLE_META[UserRole]][]).map(([role, meta]) => {
          const Icon     = meta.icon
          const isActive = filterRole === role
          return (
            <div key={role} onClick={() => updateParam('role', isActive ? '' : role)}
              className="rounded-xl border p-4 flex items-center gap-3 cursor-pointer transition-all"
              style={{ borderColor: isActive ? meta.color : meta.color + '25', background: 'var(--color-surface)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: meta.color + '15' }}>
                <Icon size={15} style={{ color: meta.color }} />
              </div>
              <div>
                <p className="text-xl font-black" style={{ color: meta.color }}>{roleCounts[role] ?? 0}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{meta.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Search + role filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input value={search} onChange={e => updateParam('q', e.target.value)}
            placeholder="Buscar por nome ou e-mail…" leftIcon={<Search size={14} />} />
        </div>
        <Select value={filterRole} onChange={e => updateParam('role', e.target.value)}
          placeholder="Todos os perfis" options={ROLE_OPTIONS} className="sm:w-52" />
      </div>

      <Card noPadding>
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-[var(--color-text-muted)]">
            <Users size={36} className="mx-auto mb-3 opacity-30" />
            <p>{users.length === 0 ? 'Nenhum usuário cadastrado' : 'Nenhum usuário encontrado'}</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {filtered.map(user => {
              const meta      = ROLE_META[user.role] ?? ROLE_META.student
              const Icon      = meta.icon
              const isEditing = editingId === user.id
              return (
                <div key={user.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                    style={{ background: meta.color + '20', color: meta.color }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-[var(--color-text)] truncate">{user.name}</p>
                      <Badge variant={meta.variant}>{meta.label}</Badge>
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)]">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isEditing ? (
                      <>
                        <select value={editRole} onChange={e => setEditRole(e.target.value as UserRole)}
                          className="text-xs border border-[var(--color-border)] rounded-lg px-2 py-1.5 bg-[var(--color-surface)] text-[var(--color-text)]">
                          {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                        </select>
                        <button onClick={() => saveRole(user.id)} disabled={saving}
                          className="text-xs px-2.5 py-1.5 rounded-lg font-medium"
                          style={{ background: COLOR, color: '#fff' }}>
                          {saving ? '…' : 'Salvar'}
                        </button>
                        <button onClick={() => setEditingId(null)}
                          className="text-xs px-2 py-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)]">
                          ✕
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="text-xs text-[var(--color-text-muted)]">{formatDate(user.created_at)}</span>
                        <button onClick={() => { setEditingId(user.id); setEditRole(user.role) }}
                          className="p-1.5 rounded-lg hover:bg-[var(--color-surface-elevated)] transition-colors"
                          title="Editar perfil">
                          <UserCog size={14} className="text-[var(--color-text-muted)]" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
