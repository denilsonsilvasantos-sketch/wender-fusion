import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import type { Lead, SalesFunnelStage } from '@/types'
import { Button, Card, Spinner } from '@/components/ui'
import { formatDate } from '@/lib/utils'

const COLOR = '#FF8C00'

const SOURCE_SHORT: Record<string, string> = {
  website: 'Site',
  whatsapp: 'WA',
  instagram: 'IG',
  facebook: 'FB',
  indicacao: 'Ind.',
  outro: 'Outro',
}

export function EscolaFunilPage() {
  const [stages, setStages] = useState<SalesFunnelStage[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

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
      setStages((stagesData || []) as SalesFunnelStage[])
      setLeads((leadsData || []) as Lead[])
      setLoading(false)
    }
    load()
  }, [])

  async function moveToStage(lead: Lead, newStageId: string) {
    await supabase.from('leads').update({ stage_id: newStageId }).eq('id', lead.id)
    setLeads((prev) => prev.map((l) => l.id === lead.id ? { ...l, stage_id: newStageId } : l))
  }

  const leadsForStage = (stageId: string) => leads.filter((l) => l.stage_id === stageId)
  const unstagedLeads = leads.filter((l) => !l.stage_id)

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  if (stages.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-[var(--color-text)]">Funil de Matrículas</h1>
        <Card>
          <div className="text-center py-12 text-[var(--color-text-muted)]">
            <p className="mb-1">Nenhum estágio configurado.</p>
            <p className="text-xs">Adicione registros na tabela <code className="bg-[var(--color-surface-elevated)] px-1 rounded">sales_funnel_stages</code> para ver o kanban.</p>
          </div>
        </Card>
      </div>
    )
  }

  const columns = [...stages, ...(unstagedLeads.length > 0 ? [null] : [])]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Funil de Matrículas</h1>
          <p className="text-sm text-[var(--color-text-muted)]">{leads.length} leads ativos</p>
        </div>
        <Link to="/admin/escola/leads">
          <Button variant="outline" size="sm">Gerenciar Leads</Button>
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageLeads = leadsForStage(stage.id)
          const nextStages = stages.filter((s) => s.id !== stage.id)
          return (
            <div key={stage.id} className="flex-shrink-0 w-60">
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: stage.color || COLOR }} />
                <span className="text-sm font-semibold text-[var(--color-text)] truncate">{stage.name}</span>
                <span className="ml-auto text-xs text-[var(--color-text-muted)] bg-[var(--color-surface-elevated)] px-2 py-0.5 rounded-full flex-shrink-0">
                  {stageLeads.length}
                </span>
              </div>
              <div className="space-y-2 min-h-20">
                {stageLeads.length === 0 && (
                  <div
                    className="border border-dashed rounded-xl p-4 text-center text-xs text-[var(--color-text-muted)]"
                    style={{ borderColor: (stage.color || COLOR) + '30' }}
                  >
                    Sem leads
                  </div>
                )}
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="rounded-xl border p-3 bg-[var(--color-surface)]"
                    style={{ borderColor: (stage.color || COLOR) + '35' }}
                  >
                    <p className="text-sm font-medium text-[var(--color-text)] mb-1 truncate">{lead.name}</p>
                    <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                      {lead.source && (
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                          style={{ background: (stage.color || COLOR) + '15', color: stage.color || COLOR }}
                        >
                          {SOURCE_SHORT[lead.source] || lead.source}
                        </span>
                      )}
                      <span className="text-[10px] text-[var(--color-text-muted)]">{formatDate(lead.created_at)}</span>
                    </div>
                    {nextStages.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {nextStages.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => moveToStage(lead, s.id)}
                            className="text-[10px] px-1.5 py-0.5 rounded transition-opacity hover:opacity-70 truncate max-w-24"
                            style={{ background: (s.color || '#888') + '20', color: s.color || '#888' }}
                            title={`Mover para ${s.name}`}
                          >
                            → {s.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {unstagedLeads.length > 0 && (
          <div className="flex-shrink-0 w-60">
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-[var(--color-text-muted)]" />
              <span className="text-sm font-semibold text-[var(--color-text)]">Sem estágio</span>
              <span className="ml-auto text-xs text-[var(--color-text-muted)] bg-[var(--color-surface-elevated)] px-2 py-0.5 rounded-full flex-shrink-0">
                {unstagedLeads.length}
              </span>
            </div>
            <div className="space-y-2">
              {unstagedLeads.map((lead) => (
                <div key={lead.id} className="rounded-xl border border-[var(--color-border)] p-3 bg-[var(--color-surface)]">
                  <p className="text-sm font-medium text-[var(--color-text)] mb-1 truncate">{lead.name}</p>
                  <div className="flex items-center gap-1.5 mb-2">
                    {lead.source && (
                      <span className="text-[10px] text-[var(--color-text-muted)]">
                        {SOURCE_SHORT[lead.source] || lead.source}
                      </span>
                    )}
                    <span className="text-[10px] text-[var(--color-text-muted)]">{formatDate(lead.created_at)}</span>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {stages.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => moveToStage(lead, s.id)}
                        className="text-[10px] px-1.5 py-0.5 rounded transition-opacity hover:opacity-70 truncate max-w-24"
                        style={{ background: (s.color || '#888') + '20', color: s.color || '#888' }}
                        title={`Mover para ${s.name}`}
                      >
                        → {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
