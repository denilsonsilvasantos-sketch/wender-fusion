import { useEffect, useState } from 'react'
import { Search, Users } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { UserProfile } from '@/types'
import { Card, Badge, Input, Avatar, Spinner } from '@/components/ui'
import { formatDate } from '@/lib/utils'

export function AdminStudentsPage() {
  const [students, setStudents] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    supabase.from('user_profiles').select('*').eq('role', 'student').order('created_at', { ascending: false })
      .then(({ data }) => { setStudents((data || []) as UserProfile[]); setLoading(false) })
  }, [])

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-[var(--color-text)]">Alunos <span className="text-[var(--color-text-muted)] font-normal text-lg">({students.length})</span></h1>
      </div>

      <Input placeholder="Buscar por nome ou e-mail..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search size={16} />} />

      <Card noPadding>
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Users size={40} className="text-[var(--color-text-muted)] mx-auto mb-3" />
            <p className="text-[var(--color-text-muted)]">Nenhum aluno encontrado</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {filtered.map((s) => (
              <div key={s.id} className="flex items-center gap-4 px-5 py-3">
                <Avatar name={s.name} avatarUrl={s.avatar_url} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--color-text)] truncate">{s.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)] truncate">{s.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[var(--color-text-muted)]">Cadastrado em</p>
                  <p className="text-xs text-[var(--color-text)]">{formatDate(s.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
