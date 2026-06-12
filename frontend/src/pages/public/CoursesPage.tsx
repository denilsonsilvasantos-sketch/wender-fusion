import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Clock, Users, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Course } from '@/types'
import { Input, Badge, Spinner } from '@/components/ui'
import { formatCurrency, LEVEL_LABELS } from '@/lib/utils'
import { getThumbnailUrl } from '@/lib/cloudinary'

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

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[var(--color-text)] mb-2">Cursos Disponíveis</h1>
        <div className="h-1 w-16 bg-[var(--color-primary)]" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input
            placeholder="Buscar cursos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={16} />}
          />
        </div>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
        >
          <option value="">Todos os níveis</option>
          <option value="beginner">Iniciante</option>
          <option value="intermediate">Intermediário</option>
          <option value="advanced">Avançado</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-[var(--color-text-muted)]">
          <p className="text-lg">Nenhum curso encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <Link
              key={course.id}
              to={`/cursos/${course.id}`}
              className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:border-[var(--color-primary)]/50 transition-all hover:shadow-[var(--shadow-md)]"
            >
              <div className="aspect-video bg-[var(--color-surface-elevated)] overflow-hidden">
                {course.thumbnail_url ? (
                  <img src={getThumbnailUrl(course.thumbnail_url)} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]">
                    <span className="text-4xl">🔥</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                {course.level && <Badge status={course.level}>{LEVEL_LABELS[course.level]}</Badge>}
                <h3 className="font-semibold text-[var(--color-text)] mt-2 mb-1 group-hover:text-[var(--color-primary)] transition-colors">{course.title}</h3>
                {course.description && <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 mb-3">{course.description}</p>}
                <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)] mb-4">
                  {course.duration_hours && (
                    <span className="flex items-center gap-1"><Clock size={12} />{course.duration_hours}h</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-[var(--color-primary)]">
                    {course.price === 0 ? 'Gratuito' : formatCurrency(course.price)}
                  </span>
                  <span className="text-[var(--color-primary)] group-hover:translate-x-1 transition-transform">
                    <ChevronRight size={18} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
