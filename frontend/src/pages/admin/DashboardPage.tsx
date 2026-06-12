import { useEffect, useState } from 'react'
import { Users, BookOpen, DollarSign, Wrench, TrendingUp, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { StatCard, Card, Badge, Spinner } from '@/components/ui'
import type { AdminDashboardMetrics } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'

export function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null)
  const [recentEnrollments, setRecentEnrollments] = useState<unknown[]>([])
  const [recentOS, setRecentOS] = useState<unknown[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: metricsData }, { data: enrollments }, { data: orders }] = await Promise.all([
        supabase.from('admin_dashboard_metrics').select('*').single(),
        supabase.from('enrollments').select('*, student:user_profiles(name), course:courses(title)').order('enrolled_at', { ascending: false }).limit(5),
        supabase.from('service_orders').select('*, client:service_clients(name)').order('created_at', { ascending: false }).limit(5),
      ])
      setMetrics(metricsData as AdminDashboardMetrics)
      setRecentEnrollments(enrollments || [])
      setRecentOS(orders || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Dashboard</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Visão geral do sistema</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Alunos" value={metrics?.total_students || 0} icon={<Users size={20} />} />
        <StatCard label="Cursos Ativos" value={metrics?.published_courses || 0} icon={<BookOpen size={20} />} />
        <StatCard label="Matrículas Ativas" value={metrics?.active_enrollments || 0} icon={<TrendingUp size={20} />} />
        <StatCard label="Receita Total" value={formatCurrency(metrics?.total_revenue || 0)} icon={<DollarSign size={20} />} />
        <StatCard label="O.S. Em Andamento" value={metrics?.active_service_orders || 0} icon={<Wrench size={20} />} />
        <StatCard label="O.S. Pendentes" value={metrics?.pending_service_orders || 0} icon={<AlertCircle size={20} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Últimas Matrículas" noPadding>
          {recentEnrollments.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)] p-5">Nenhuma matrícula recente</p>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {recentEnrollments.map((e: any) => (
                <div key={e.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text)] truncate">{e.student?.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)] truncate">{e.course?.title}</p>
                  </div>
                  <div className="text-right">
                    <Badge status={e.status} />
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{formatDate(e.enrolled_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Últimas O.S." noPadding>
          {recentOS.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)] p-5">Nenhuma O.S. recente</p>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {recentOS.map((os: any) => (
                <div key={os.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text)] truncate">{os.title}</p>
                    <p className="text-xs text-[var(--color-text-muted)] truncate">{os.client?.name} • {os.os_number}</p>
                  </div>
                  <div className="text-right">
                    <Badge status={os.status} />
                    <Badge status={os.priority} className="mt-0.5 ml-1" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
