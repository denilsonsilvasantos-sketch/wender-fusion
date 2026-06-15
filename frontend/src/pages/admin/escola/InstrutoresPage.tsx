import { useEffect, useState } from 'react'
import { UserCheck, Search, Mail, Phone } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { UserProfile } from '@/types'
import { Card, Input, Avatar, Spinner } from '@/components/ui'
import { formatDate } from '@/lib/utils'

export function EscolaInstrutoresPage() {
  const [instructors, setInstructors] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    supabase
      .from('user_profiles')
      .select('*')
      .eq('role', 'instructor')
      .order('name')
      .then(({ data }) => {
        setInstructors((data || []) as UserProfile[])
        setLoading(false)
      })
  }, [])

  const filtered = instructors.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.email.toLowerCase().includes(search.toLowerCase()),
  )

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">
          Instrutores{' '}
          <span className="text-[var(--color-text-muted)] font-normal text-lg">({instructors.length})</span>
        </h1>
        <p className="text-sm text-[var(--color-text-muted)]">Equipe de instrutores da escola</p>
      </div>

      <Input
        placeholder="Buscar instrutor..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        leftIcon={<Search size={16} />}
      />

      <Card noPadding>
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <UserCheck size={36} className="mx-auto mb-3 opacity-30 text-[var(--color-text-muted)]" />
            <p className="text-[var(--color-text-muted)]">
              {instructors.length === 0 ? 'Nenhum instrutor cadastrado' : 'Nenhum resultado'}
            </p>
            {instructors.length === 0 && (
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Cadastre usuários com role <code className="bg-[var(--color-surface-elevated)] px-1 rounded">instructor</code> no Supabase
              </p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {filtered.map((inst) => (
              <div key={inst.id} className="flex items-center gap-4 px-5 py-4">
                <Avatar name={inst.name} avatarUrl={inst.avatar_url} size="lg" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--color-text)]">{inst.name}</p>
                  <div className="flex items-center gap-4 mt-0.5 flex-wrap">
                    <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                      <Mail size={11} />{inst.email}
                    </span>
                    {inst.phone && (
                      <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                        <Phone size={11} />{inst.phone}
                      </span>
                    )}
                  </div>
                  {inst.bio && (
                    <p className="text-xs text-[var(--color-text-muted)] mt-1 truncate">{inst.bio}</p>
                  )}
                </div>
                <div className="text-right text-xs text-[var(--color-text-muted)] flex-shrink-0">
                  <p>Desde</p>
                  <p>{formatDate(inst.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
