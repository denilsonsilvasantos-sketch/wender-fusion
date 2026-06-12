import { useEffect, useState } from 'react'
import api from '@/lib/api'
import type { ConsultingEngagement, ConsultingReport } from '@/types'
import { Badge, Button, Modal, Input, Spinner } from '@/components/ui'

const typeLabel: Record<string, string> = {
  training: 'Treinamento', audit: 'Auditoria', consulting: 'Consultoria', inspection: 'Inspeção',
}
const statusLabel: Record<string, string> = {
  proposal: 'Proposta', active: 'Ativa', paused: 'Pausada', completed: 'Concluída', cancelled: 'Cancelada',
}
const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
  proposal: 'warning', active: 'success', paused: 'default', completed: 'info' as 'default', cancelled: 'danger',
}

export function AdminConsultingPage() {
  const [engagements, setEngagements] = useState<ConsultingEngagement[]>([])
  const [loading, setLoading] = useState(true)
  const [engagementModal, setEngagementModal] = useState(false)
  const [editing, setEditing] = useState<Partial<ConsultingEngagement>>({})
  const [saving, setSaving] = useState(false)

  // Reports
  const [selectedEngagement, setSelectedEngagement] = useState<ConsultingEngagement | null>(null)
  const [reports, setReports] = useState<ConsultingReport[]>([])
  const [reportModal, setReportModal] = useState(false)
  const [editingReport, setEditingReport] = useState<Partial<ConsultingReport>>({})

  useEffect(() => {
    api.get<{ data: ConsultingEngagement[] }>('/consulting/engagements')
      .then(res => setEngagements(res.data.data ?? []))
      .finally(() => setLoading(false))
  }, [])

  async function openEngagement(eng: ConsultingEngagement) {
    setSelectedEngagement(eng)
    const res = await api.get<{ data: ConsultingReport[] }>(`/consulting/engagements/${eng.id}/reports`)
    setReports(res.data.data ?? [])
  }

  async function saveEngagement() {
    setSaving(true)
    try {
      if (editing.id) {
        const res = await api.patch<{ data: ConsultingEngagement }>(`/consulting/engagements/${editing.id}`, editing)
        setEngagements(prev => prev.map(e => e.id === editing.id ? res.data.data : e))
      } else {
        const res = await api.post<{ data: ConsultingEngagement }>('/consulting/engagements', editing)
        setEngagements(prev => [res.data.data, ...prev])
      }
      setEngagementModal(false)
      setEditing({})
    } finally { setSaving(false) }
  }

  async function saveReport() {
    if (!selectedEngagement) return
    setSaving(true)
    try {
      if (editingReport.id) {
        const res = await api.patch<{ data: ConsultingReport }>(`/consulting/reports/${editingReport.id}`, editingReport)
        setReports(prev => prev.map(r => r.id === editingReport.id ? res.data.data : r))
      } else {
        const res = await api.post<{ data: ConsultingReport }>(`/consulting/engagements/${selectedEngagement.id}/reports`, editingReport)
        setReports(prev => [res.data.data, ...prev])
      }
      setReportModal(false)
      setEditingReport({})
    } finally { setSaving(false) }
  }

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Consultoria Corporativa</h1>
        <Button onClick={() => { setEditing({ status: 'proposal', type: 'consulting' }); setEngagementModal(true) }}>
          Nova Consultoria
        </Button>
      </div>

      {engagements.length === 0 ? (
        <div className="text-center py-16 text-[var(--color-text-muted)]">Nenhuma consultoria cadastrada.</div>
      ) : (
        <div className="space-y-3">
          {engagements.map(eng => (
            <div key={eng.id} className="bg-[var(--color-surface)] rounded-xl p-5 border border-white/5">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-white font-semibold">{eng.title}</h3>
                    <Badge variant={statusVariant[eng.status] ?? 'default'}>{statusLabel[eng.status]}</Badge>
                    <Badge variant="default">{typeLabel[eng.type]}</Badge>
                  </div>
                  <p className="text-[var(--color-text-muted)] text-sm">{eng.client_name}</p>
                  {eng.value && (
                    <p className="text-[var(--color-primary)] text-sm font-medium mt-1">
                      R$ {Number(eng.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  )}
                  {(eng.start_date || eng.end_date) && (
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">
                      {eng.start_date ? new Date(eng.start_date).toLocaleDateString('pt-BR') : '—'}
                      {' '} → {' '}
                      {eng.end_date ? new Date(eng.end_date).toLocaleDateString('pt-BR') : 'Em aberto'}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="ghost" onClick={() => openEngagement(eng)}>Relatórios</Button>
                  <Button size="sm" variant="outline" onClick={() => { setEditing(eng); setEngagementModal(true) }}>Editar</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reports panel */}
      {selectedEngagement && (
        <div className="fixed right-0 top-0 h-full w-96 bg-[var(--color-surface)] border-l border-white/10 z-30 overflow-y-auto p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white font-bold">Relatórios</h2>
              <p className="text-[var(--color-text-muted)] text-sm">{selectedEngagement.title}</p>
            </div>
            <button onClick={() => setSelectedEngagement(null)} className="text-[var(--color-text-muted)] hover:text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <Button size="sm" className="w-full mb-4" onClick={() => { setEditingReport({ status: 'draft' }); setReportModal(true) }}>
            + Novo Relatório
          </Button>

          <div className="space-y-3">
            {reports.length === 0 && (
              <p className="text-[var(--color-text-muted)] text-sm text-center py-4">Nenhum relatório ainda.</p>
            )}
            {reports.map(report => (
              <div key={report.id} className="bg-[var(--color-bg)] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white text-sm font-medium">{report.title}</h4>
                  <Badge variant={report.status === 'published' ? 'success' : 'warning'}>
                    {report.status === 'published' ? 'Publicado' : 'Rascunho'}
                  </Badge>
                </div>
                {report.content && (
                  <p className="text-[var(--color-text-muted)] text-xs line-clamp-3">{report.content}</p>
                )}
                <div className="flex justify-end mt-2">
                  <Button size="sm" variant="ghost" onClick={() => { setEditingReport(report); setReportModal(true) }}>Editar</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Engagement modal */}
      <Modal open={engagementModal} onClose={() => { setEngagementModal(false); setEditing({}) }} title={editing.id ? 'Editar Consultoria' : 'Nova Consultoria'}>
        <div className="space-y-3">
          <Input label="Título" value={editing.title ?? ''} onChange={e => setEditing(p => ({ ...p, title: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-[var(--color-text-muted)] block mb-1">Tipo</label>
              <select value={editing.type ?? 'consulting'} onChange={e => setEditing(p => ({ ...p, type: e.target.value as ConsultingEngagement['type'] }))}
                className="w-full bg-[var(--color-bg)] border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                {Object.entries(typeLabel).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-[var(--color-text-muted)] block mb-1">Status</label>
              <select value={editing.status ?? 'proposal'} onChange={e => setEditing(p => ({ ...p, status: e.target.value as ConsultingEngagement['status'] }))}
                className="w-full bg-[var(--color-bg)] border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                {Object.entries(statusLabel).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
          <Input label="Cliente" value={editing.client_name ?? ''} onChange={e => setEditing(p => ({ ...p, client_name: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="E-mail do cliente" value={editing.client_email ?? ''} onChange={e => setEditing(p => ({ ...p, client_email: e.target.value }))} />
            <Input label="Valor (R$)" type="number" value={editing.value ?? ''} onChange={e => setEditing(p => ({ ...p, value: +e.target.value }))} />
            <Input label="Data início" type="date" value={editing.start_date ?? ''} onChange={e => setEditing(p => ({ ...p, start_date: e.target.value }))} />
            <Input label="Data fim" type="date" value={editing.end_date ?? ''} onChange={e => setEditing(p => ({ ...p, end_date: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm text-[var(--color-text-muted)] block mb-1">Descrição</label>
            <textarea value={editing.description ?? ''} onChange={e => setEditing(p => ({ ...p, description: e.target.value }))}
              rows={3} className="w-full bg-[var(--color-bg)] border border-white/10 rounded-lg p-3 text-white text-sm resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setEngagementModal(false)}>Cancelar</Button>
            <Button onClick={saveEngagement} disabled={saving}>{saving ? <Spinner size="sm" /> : 'Salvar'}</Button>
          </div>
        </div>
      </Modal>

      {/* Report modal */}
      <Modal open={reportModal} onClose={() => { setReportModal(false); setEditingReport({}) }} title={editingReport.id ? 'Editar Relatório' : 'Novo Relatório'}>
        <div className="space-y-3">
          <Input label="Título" value={editingReport.title ?? ''} onChange={e => setEditingReport(p => ({ ...p, title: e.target.value }))} />
          <div>
            <label className="text-sm text-[var(--color-text-muted)] block mb-1">Conteúdo</label>
            <textarea value={editingReport.content ?? ''} onChange={e => setEditingReport(p => ({ ...p, content: e.target.value }))}
              rows={8} className="w-full bg-[var(--color-bg)] border border-white/10 rounded-lg p-3 text-white text-sm resize-none" />
          </div>
          <div>
            <label className="text-sm text-[var(--color-text-muted)] block mb-1">Status</label>
            <select value={editingReport.status ?? 'draft'} onChange={e => setEditingReport(p => ({ ...p, status: e.target.value as ConsultingReport['status'] }))}
              className="w-full bg-[var(--color-bg)] border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
              <option value="draft">Rascunho</option>
              <option value="published">Publicar</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setReportModal(false)}>Cancelar</Button>
            <Button onClick={saveReport} disabled={saving}>{saving ? <Spinner size="sm" /> : 'Salvar'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
