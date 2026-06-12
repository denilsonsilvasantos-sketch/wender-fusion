import { useEffect, useState } from 'react'
import api from '@/lib/api'
import type { Lead, SalesFunnelStage, LeadInteraction } from '@/types'
import { Badge, Button, Modal, Input, Spinner } from '@/components/ui'

const sourceLabel: Record<string, string> = {
  website: 'Site', whatsapp: 'WhatsApp', instagram: 'Instagram',
  facebook: 'Facebook', indicacao: 'Indicação', outro: 'Outro',
}
const interactionLabel: Record<string, string> = {
  call: 'Ligação', email: 'E-mail', whatsapp: 'WhatsApp', meeting: 'Reunião', note: 'Anotação',
}

export function AdminCRMPage() {
  const [stages, setStages] = useState<SalesFunnelStage[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [interactions, setInteractions] = useState<LeadInteraction[]>([])
  const [interactionModal, setInteractionModal] = useState(false)
  const [newInteraction, setNewInteraction] = useState({ type: 'call', notes: '' })
  const [leadModal, setLeadModal] = useState(false)
  const [editingLead, setEditingLead] = useState<Partial<Lead>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get<{ data: SalesFunnelStage[] }>('/crm/stages'),
      api.get<{ data: Lead[] }>('/crm/leads'),
    ]).then(([stagesRes, leadsRes]) => {
      setStages(stagesRes.data.data ?? [])
      setLeads(leadsRes.data.data ?? [])
    }).finally(() => setLoading(false))
  }, [])

  async function openLead(lead: Lead) {
    setSelectedLead(lead)
    const res = await api.get<{ data: LeadInteraction[] }>(`/crm/leads/${lead.id}/interactions`)
    setInteractions(res.data.data ?? [])
  }

  async function addInteraction() {
    if (!selectedLead) return
    setSaving(true)
    try {
      const res = await api.post<{ data: LeadInteraction }>(`/crm/leads/${selectedLead.id}/interactions`, newInteraction)
      setInteractions(prev => [res.data.data, ...prev])
      setNewInteraction({ type: 'call', notes: '' })
      setInteractionModal(false)
    } finally { setSaving(false) }
  }

  async function moveStage(leadId: string, stageId: string) {
    await api.patch(`/crm/leads/${leadId}`, { stage_id: stageId })
    const stage = stages.find(s => s.id === stageId)
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage_id: stageId, stage } : l))
    if (selectedLead?.id === leadId) {
      setSelectedLead(l => l ? { ...l, stage_id: stageId, stage } : l)
    }
  }

  async function saveLead() {
    setSaving(true)
    try {
      if (editingLead.id) {
        const res = await api.patch<{ data: Lead }>(`/crm/leads/${editingLead.id}`, editingLead)
        setLeads(prev => prev.map(l => l.id === editingLead.id ? res.data.data : l))
      } else {
        const res = await api.post<{ data: Lead }>('/crm/leads', editingLead)
        setLeads(prev => [res.data.data, ...prev])
      }
      setLeadModal(false)
      setEditingLead({})
    } finally { setSaving(false) }
  }

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>

  const openLeads = leads.filter(l => !l.converted)
  const convertedLeads = leads.filter(l => l.converted)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">CRM Comercial</h1>
          <p className="text-[var(--color-text-muted)] text-sm mt-1">
            {openLeads.length} leads em aberto · {convertedLeads.length} convertidos
          </p>
        </div>
        <Button onClick={() => { setEditingLead({}); setLeadModal(true) }}>Novo Lead</Button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4">
        {stages.map(stage => {
          const stageLeads = leads.filter(l => l.stage_id === stage.id && !l.converted)
          return (
            <div key={stage.id} className="flex-shrink-0 w-64">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }} />
                <h3 className="text-white font-medium text-sm">{stage.name}</h3>
                <span className="text-[var(--color-text-muted)] text-xs ml-auto">{stageLeads.length}</span>
              </div>
              <div className="space-y-2">
                {stageLeads.map(lead => (
                  <button
                    key={lead.id}
                    onClick={() => openLead(lead)}
                    className="w-full text-left bg-[var(--color-surface)] hover:border-[var(--color-primary)]/30 border border-white/5 rounded-xl p-3 transition-colors"
                  >
                    <p className="text-white text-sm font-medium">{lead.name}</p>
                    {lead.phone && <p className="text-[var(--color-text-muted)] text-xs mt-0.5">{lead.phone}</p>}
                    {lead.source && (
                      <span className="inline-block mt-2 text-xs text-[var(--color-secondary)] bg-[var(--color-secondary)]/10 px-2 py-0.5 rounded-full">
                        {sourceLabel[lead.source]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )
        })}

        {/* Converted column */}
        <div className="flex-shrink-0 w-64">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <h3 className="text-white font-medium text-sm">Convertidos</h3>
            <span className="text-[var(--color-text-muted)] text-xs ml-auto">{convertedLeads.length}</span>
          </div>
          <div className="space-y-2">
            {convertedLeads.map(lead => (
              <div key={lead.id} className="bg-green-500/5 border border-green-500/20 rounded-xl p-3">
                <p className="text-white text-sm font-medium">{lead.name}</p>
                <Badge variant="success" className="mt-1">Matriculado</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lead detail panel */}
      {selectedLead && (
        <div className="fixed right-0 top-0 h-full w-96 bg-[var(--color-surface)] border-l border-white/10 z-30 overflow-y-auto p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-bold">{selectedLead.name}</h2>
            <button onClick={() => setSelectedLead(null)} className="text-[var(--color-text-muted)] hover:text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-2 mb-6 text-sm">
            {selectedLead.email && <p className="text-[var(--color-text-muted)]">✉ {selectedLead.email}</p>}
            {selectedLead.phone && <p className="text-[var(--color-text-muted)]">📞 {selectedLead.phone}</p>}
            {selectedLead.source && <p className="text-[var(--color-text-muted)]">Origem: {sourceLabel[selectedLead.source]}</p>}
          </div>

          <div className="mb-6">
            <label className="text-xs text-[var(--color-text-muted)] block mb-2">Mover para etapa</label>
            <div className="flex flex-wrap gap-2">
              {stages.map(s => (
                <button
                  key={s.id}
                  onClick={() => moveStage(selectedLead.id, s.id)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    selectedLead.stage_id === s.id
                      ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/10'
                      : 'border-white/10 text-[var(--color-text-muted)] hover:border-white/30'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium text-sm">Interações</h3>
            <Button size="sm" variant="outline" onClick={() => setInteractionModal(true)}>+ Adicionar</Button>
          </div>
          <div className="space-y-2">
            {interactions.length === 0 && (
              <p className="text-[var(--color-text-muted)] text-xs">Nenhuma interação registrada.</p>
            )}
            {interactions.map(i => (
              <div key={i.id} className="bg-[var(--color-bg)] rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="default" className="text-xs">{interactionLabel[i.type]}</Badge>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {new Date(i.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                {i.notes && <p className="text-sm text-white">{i.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New lead modal */}
      <Modal open={leadModal} onClose={() => setLeadModal(false)} title="Novo Lead">
        <div className="space-y-3">
          <Input label="Nome" value={editingLead.name ?? ''} onChange={e => setEditingLead(p => ({ ...p, name: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="E-mail" value={editingLead.email ?? ''} onChange={e => setEditingLead(p => ({ ...p, email: e.target.value }))} />
            <Input label="Telefone" value={editingLead.phone ?? ''} onChange={e => setEditingLead(p => ({ ...p, phone: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-[var(--color-text-muted)] block mb-1">Origem</label>
              <select value={editingLead.source ?? ''} onChange={e => setEditingLead(p => ({ ...p, source: e.target.value as Lead['source'] }))}
                className="w-full bg-[var(--color-bg)] border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                <option value="">—</option>
                {Object.entries(sourceLabel).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-[var(--color-text-muted)] block mb-1">Etapa</label>
              <select value={editingLead.stage_id ?? ''} onChange={e => setEditingLead(p => ({ ...p, stage_id: e.target.value }))}
                className="w-full bg-[var(--color-bg)] border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                <option value="">—</option>
                {stages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm text-[var(--color-text-muted)] block mb-1">Anotações</label>
            <textarea value={editingLead.notes ?? ''} onChange={e => setEditingLead(p => ({ ...p, notes: e.target.value }))}
              rows={3} className="w-full bg-[var(--color-bg)] border border-white/10 rounded-lg p-3 text-white text-sm resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setLeadModal(false)}>Cancelar</Button>
            <Button onClick={saveLead} disabled={saving}>{saving ? <Spinner size="sm" /> : 'Salvar'}</Button>
          </div>
        </div>
      </Modal>

      {/* Interaction modal */}
      <Modal open={interactionModal} onClose={() => setInteractionModal(false)} title="Nova Interação">
        <div className="space-y-3">
          <div>
            <label className="text-sm text-[var(--color-text-muted)] block mb-1">Tipo</label>
            <select value={newInteraction.type} onChange={e => setNewInteraction(p => ({ ...p, type: e.target.value }))}
              className="w-full bg-[var(--color-bg)] border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
              {Object.entries(interactionLabel).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-[var(--color-text-muted)] block mb-1">Notas</label>
            <textarea value={newInteraction.notes} onChange={e => setNewInteraction(p => ({ ...p, notes: e.target.value }))}
              rows={4} placeholder="Descreva o que foi tratado..."
              className="w-full bg-[var(--color-bg)] border border-white/10 rounded-lg p-3 text-white text-sm resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setInteractionModal(false)}>Cancelar</Button>
            <Button onClick={addInteraction} disabled={saving}>{saving ? <Spinner size="sm" /> : 'Salvar'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
