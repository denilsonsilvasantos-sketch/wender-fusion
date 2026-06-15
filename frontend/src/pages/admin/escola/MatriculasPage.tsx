import { useEffect, useState } from 'react'
import { Search, ClipboardList } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Enrollment } from '@/types'
import { Card, Badge, Input, Select, Spinner } from '@/components/ui'
import { formatDate } from '@/lib/utils'

const COLOR = '#FF8C00'

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendente' },
  { value: 'active', label: 'Ativo' },
  { value: 'completed', label: 'Concluído' },
  { value: 'cancelled', label: 'Cancelado' },
]

export function EscolaMatriculasPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    supabase
      .from('enrollments')
      .select('*, student:user_profiles(id, name, email), course:courses(id, title, duration_hours)')
      .order('enrolled_at', { ascending: false })
      .then(({ data }) => {
        setEnrollments((data || []) as Enrollment[])
        setLoading(false)
      })
  }, [])

  const filtered = enrollments.filter((e) => {
    const student = (e as any).student
    const matchSearch =
      !search ||
      student?.name?.toLowerCase().includes(search.toLowerCase()) ||
      student?.email?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !filterStatus || e.status === filterStatus
    return matchSearch && matchStatus
  })

  const active = enrollments.filter((e) => e.status === 'active').length
  const pending = enrollments.filter((e) => e.status === 'pending').length
  const completed = enrollments.filter((e) => e.status === 'completed').length

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Matrículas</h1>
        <p className="text-sm text-[var(--color-text-muted)]">{enrollments.length} matrículas registradas</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Ativas', value: active, color: '#22c55e' },
          { label: 'Pendentes', value: pending, color: '#f59e0b' },
          { label: 'Concluídas', value: completed, color: COLOR },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border p-4"
            style={{ borderColor: stat.color + '25', background: 'var(--color-surface)' }}
          >
            <p className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Buscar aluno..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search size={16} />}
          className="flex-1"
        />
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          placeholder="Todos os status"
          options={STATUS_OPTIONS}
          className="sm:w-44"
        />
      </div>

      <Card noPadding>
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList size={36} className="mx-auto mb-3 opacity-30 text-[var(--color-text-muted)]" />
            <p className="text-[var(--color-text-muted)]">
              {enrollments.length === 0 ? 'Nenhuma matrícula registrada ainda' : 'Nenhuma matrícula encontrada'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {filtered.map((enrollment) => {
              const student = (enrollment as any).student
              const course = (enrollment as any).course
              return (
                <div key={enrollment.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-[var(--color-text)] truncate">
                        {student?.name || '—'}
                      </p>
                      <Badge status={enrollment.status} />
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] truncate">
                      {course?.title || '—'}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      Matriculado em {formatDate(enrollment.enrolled_at)}
                    </p>
                  </div>
                  <div className="text-right text-xs text-[var(--color-text-muted)] flex-shrink-0">
                    {course?.duration_hours && <p>{course.duration_hours}h</p>}
                    {enrollment.completed_at && (
                      <p>Concluído {formatDate(enrollment.completed_at)}</p>
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
