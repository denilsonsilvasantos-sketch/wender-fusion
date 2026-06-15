import { useEffect, useState } from 'react'
import { TrendingUp, Users, CheckCircle2, Target } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Card, Spinner } from '@/components/ui'

const COLOR = '#FF8C00'

const SOURCE_LABELS: Record<string, string> = {
  website: 'Site',
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  facebook: 'Facebook',
  indicacao: 'Indicação',
  outro: 'Outro',
}

const SOURCE_COLORS: Record<string, string> = {
  website: '#FF8C00',
  whatsapp: '#25D366',
  instagram: '#E1306C',
  facebook: '#1877F2',
  indicacao: '#8B5CF6',
  outro: '#6B7280',
}

interface SourceStat {
  source: string
  total: number
  converted: number
}

export function EscolaMarketingPage() {
  const [sourcesStats, setSourcesStats] = useState<SourceStat[]>([])
  const [totalLeads, setTotalLeads] = useState(0)
  const [totalConverted, setTotalConverted] = useState(0)
  const [thisMonth, setThisMonth] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('leads')
        .select('source, converted, created_at')

      if (!data) { setLoading(false); return }

      setTotalLeads(data.length)
      setTotalConverted(data.filter((l) => l.converted).length)

      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      setThisMonth(data.filter((l) => l.created_at >= monthStart).length)

      const bySource: Record<string, { total: number; converted: number }> = {}
      data.forEach((lead) => {
        const s = lead.source || 'outro'
        if (!bySource[s]) bySource[s] = { total: 0, converted: 0 }
        bySource[s].total++
        if (lead.converted) bySource[s].converted++
      })

      const stats = Object.entries(bySource)
        .map(([source, counts]) => ({ source, total: counts.total, converted: counts.converted }))
        .sort((a, b) => b.total - a.total)

      setSourcesStats(stats)
      setLoading(false)
    }
    load()
  }, [])

  const conversionRate = totalLeads > 0 ? ((totalConverted / totalLeads) * 100).toFixed(1) : '0.0'

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Marketing & Captação</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Métricas de captação e performance dos canais</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total de Leads', value: totalLeads, icon: Users },
          { label: 'Leads este mês', value: thisMonth, icon: TrendingUp },
          { label: 'Convertidos', value: totalConverted, icon: CheckCircle2 },
          { label: 'Taxa de Conversão', value: `${conversionRate}%`, icon: Target },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border p-4"
            style={{ borderColor: COLOR + '20', background: 'var(--color-surface)' }}
          >
            <kpi.icon size={14} style={{ color: COLOR }} className="mb-2" />
            <p className="text-2xl font-black" style={{ color: COLOR }}>{kpi.value}</p>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      <Card title="Origem dos leads">
        {sourcesStats.length === 0 ? (
          <div className="text-center py-8 text-[var(--color-text-muted)]">
            <TrendingUp size={32} className="mx-auto mb-3 opacity-30" />
            <p>Nenhum lead cadastrado ainda</p>
            <p className="text-xs mt-1">As métricas aparecerão conforme os leads forem adicionados</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sourcesStats.map((stat) => {
              const color = SOURCE_COLORS[stat.source] || '#6B7280'
              const pct = totalLeads > 0 ? (stat.total / totalLeads) * 100 : 0
              const convPct = stat.total > 0 ? ((stat.converted / stat.total) * 100).toFixed(0) : '0'
              return (
                <div key={stat.source}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                      <span className="text-sm text-[var(--color-text)]">
                        {SOURCE_LABELS[stat.source] || stat.source}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                      <span>{stat.converted} convertidos ({convPct}%)</span>
                      <span className="font-semibold text-[var(--color-text)]">{stat.total} leads</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden bg-[var(--color-surface-elevated)]">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      <Card title="Tendência mensal">
        <div className="text-center py-8">
          <TrendingUp size={32} className="mx-auto mb-3" style={{ color: COLOR + '40' }} />
          <p className="text-sm text-[var(--color-text-muted)]">Gráfico de tendência em desenvolvimento</p>
        </div>
      </Card>
    </div>
  )
}
