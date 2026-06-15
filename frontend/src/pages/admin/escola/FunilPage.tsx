import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import type { Lead, SalesFunnelStage } from '@/types'
import { Button, Card, Badge, Spinner } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import { Phone, Mail, ChevronDown, ChevronRight, ArrowRight } from 'lucide-react'

const SOURCE_LABELS: Record<string, string> = {
  website: 'Site',
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  facebook: 'Facebook',
  indicacao: 'Indicação',
  outro: 'Outro',
}

export function EscolaFunilPage() {
  const [stages, setStages] = useState<SalesFunnelStage[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function load() {
      const [{ data: stagesData }, { data: leadsData }] = await Promise.all([
        supabase.from('sales_funnel_stages').select('*').order('order_index'),
        supabase
          .from('leads')
          .select('id, name, email, phone, source, stage_id, converted, created_at')
          .eq('converted', false)
          .order('created_at', { ascending: false }),
      ])
      const loadedStages = (stagesData || []) as SalesFunnelStage[]
      setStages(loadedStages)
      setLeads((leadsData || []) as Lead[])
      // Expand all stages by default
      setExpandedStages(new Set(loadedStages.map((s) => s.id).concat(['unstaged'])))
      setLoading(false)
    }
    load()
  }, [])

  async function moveToStage(lead: Lead, newStageId: string | null) {
    await supabase.from('leads').update({ stage_id: newStageId }).eq('id', lead.id)
    setLeads((prev) => prev.map((l) => l.id === lead.id ? { ...l, stage_id: newStageId ?? undefined } : l))
  }

  function toggleStage(stageId: string) {
    setExpandedStages((prev) => {
      const next = new Set(prev)
      next.has(stageId) ? next.delete(stageId) : next.add(stageId)
      return next
    })
  }

  const leadsForStage = (stageId: string) => leads.filter((l) => l.stage_id === stageId)
  const unstagedLeads = leads.filter((l) => !l.stage_id)
  const totalLeads = leads.length
  const conversionRate = 0 // leads here are already filtered to converted=false

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  if (stages.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-[var(--color-text)]">Funil de Matrículas</h1>
        <Card>
          <div className="text-center py-12 text-[var(--color-text-muted)]">
            <p className="mb-1">Nenhum estágio do funil configurado.</p>
            <p className="text-xs">
              Adicione registros em{' '}
              <code className="bg-[var(--color-surface-elevated)] px-1 rounded">sales_funnel_stages</code>.
            </p>
          </div>
        </Card>
      </div>
    )
  }

  const allColumns = [
    ...stages.map((s) => ({ id: s.id, name: s.name, color: s.color, leads: leadsForStage(s.id) })),
    ...(unstagedLeads.length > 0
      ? [{ id: 'unstaged', name: 'Sem estágio', color: '#6B7280', leads: unstagedLeads }]
      : []),
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Funil de Matrículas</h1>
          <p className="text-sm text-[var(--color-text-muted)]">{totalLeads} leads ativos no funil</p>
        </div>
        <Link to="/admin/escola/leads">
          <Button variant="outline" size="sm">Gerenciar Leads</Button>
        </Link>
      </div>

      {/* Stage summary pills */}
      <div className="flex flex-wrap gap-2">
        {allColumns.map((col) => (
          <div
            key={col.id}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: col.color + '15', color: col.color, border: `1px solid ${col.color}30` }}
          >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: col.color }} />
            {col.name}
            <span
              className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
              style={{ background: col.color + '25' }}
            >
              {col.leads.length}
            </span>
          </div>
        ))}
      </div>

      {/* Vertical list per stage */}
      <div className="space-y-3">
        {allColumns.map((col) => {
          const isExpanded = expandedStages.has(col.id)
          const otherStages = stages.filter((s) => s.id !== col.id)
          return (
            <div key={col.id} className="rounded-xl border overflow-hidden" style={{ borderColor: col.color + '30' }}>
              {/* Stage header */}
              <button
                onClick={() => toggleStage(col.id)}
                className="w-full flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--color-surface-elevated)]"
                style={{ background: col.color + '08' }}
              >
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: col.color }} />
                <span className="font-semibold text-sm text-[var(--color-text)] flex-1 text-left">
                  {col.name}
                </span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: col.color + '20', color: col.color }}
                >
                  {col.leads.length}
                </span>
                {isExpanded
                  ? <ChevronDown size={14} className="text-[var(--color-text-muted)]" />
                  : <ChevronRight size={14} className="text-[var(--color-text-muted)]" />}
              </button>

              {/* Lead list */}
              {isExpanded && (
                <div className="divide-y divide-[var(--color-border)]">
                  {col.leads.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-[var(--color-text-muted)]">
                      Sem leads neste estágio
                    </div>
                  ) : (
                    col.leads.map((lead) => (
                      <div key={lead.id} className="flex items-center gap-4 px-4 py-3 bg-[var(--color-surface)]">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--color-text)] truncate">{lead.name}</p>
                          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                            {lead.email && (
                              <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                                <Mail size={10} />{lead.email}
                              </span>
                            )}
                            {lead.phone && (
                              <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                                <Phone size={10} />{lead.phone}
                              </span>
                            )}
                            {lead.source && (
                              <span className="text-xs text-[var(--color-text-muted)]">
                                {SOURCE_LABELS[lead.source] || lead.source}
                              </span>
                            )}
                            <span className="text-xs text-[var(--color-text-muted)]">
                              {formatDate(lead.created_at)}
                            </span>
                          </div>
                        </div>

                        {/* Move to stage buttons */}
                        {(otherStages.length > 0 || col.id === 'unstaged') && (
                          <div className="flex items-center gap-1 flex-shrink-0 flex-wrap justify-end">
                            {otherStages.map((s) => (
                              <button
                                key={s.id}
                                onClick={() => moveToStage(lead, s.id)}
                                className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md transition-colors hover:opacity-80 whitespace-nowrap"
                                style={{ background: s.color + '15', color: s.color }}
                                title={`Mover para ${s.name}`}
                              >
                                <ArrowRight size={9} />
                                {s.name}
                              </button>
                            ))}
                            {col.id !== 'unstaged' && (
                              <button
                                onClick={() => moveToStage(lead, null)}
                                className="text-[10px] px-2 py-1 rounded-md transition-colors hover:opacity-80 text-[var(--color-text-muted)]"
                                style={{ background: 'var(--color-surface-elevated)' }}
                                title="Remover do estágio"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
