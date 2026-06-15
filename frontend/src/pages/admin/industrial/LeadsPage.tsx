import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Edit2, Trash2, Search, CheckCircle2, Phone, Mail, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import type { Lead, SalesFunnelStage } from '@/types'
import { Button, Card, Badge, Modal, Input, Select, Spinner, Avatar } from '@/components/ui'
import { formatDate } from '@/lib/utils'

const COLOR = '#3B82F6'

const SOURCE_OPTIONS = [
  { value: 'indicacao', label: 'Indicação' },
  { value: 'website', label: 'Site' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'feira', label: 'Feira / Evento' },
  { value: 'outro', label: 'Outro' },
]
const SOURCE_LABELS: Record<string, string> = Object.fromEntries(SOURCE_OPTIONS.map(o => [o.value, o.label]))

interface FormState {
  name: string; company: string; email: string; phone: string
  source: string; stage_id: string; notes: string
}
const EMPTY: FormState = { name: '', company: '', email: '', phone: '', source: '', stage_id: '', notes: '' }
const SS_KEY = 'industrial-leads-draft'

function draftLoad() { try { const v = sessionStorage.getItem(SS_KEY); return v ? JSON.parse(v) : null } catch { return null } }
function draftSave(form: FormState, editingId: string | null) { try { sessionStorage.setItem(SS_KEY, JSON.stringify({ form, editingId })) } catch {} }
function draftClear() { try { sessionStorage.removeItem(SS_KEY) } catch {} }

export function IndustrialLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [stages, setStages] = useState<SalesFunnelStage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('q') ?? ''
  const filterSource = searchParams.get('source') ?? ''
  const filterStage = searchParams.get('stage') ?? ''
  const draft = draftLoad()
  const [modalOpen, setModalOpen] = useState(() => !!draft)
  const [editing, setEditing] = useState<Lead | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<FormState>(draft?.form ?? EMPTY)

  useEffect(() => { if (modalOpen) draftSave(form, editing?.id ?? null) }, [form, modalOpen, editing])

  function updateParam(key: string, value: string) {
    setSearchParams(prev => { const n = new URLSearchParams(prev); value ? n.set(key, value) : n.delete(key); return n }, { replace: true })
  }
  function field(k: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))
  }

  async function load() {
    const [{ data: leadsData }, { data: stagesData }] = await Promise.all([
      supabase.from('leads').select('*, stage:sales_funnel_stages(id,name,color)').order('created_at', { ascending: false }),
      supabase.from('sales_funnel_stages').select('*').order('order_index'),
    ])
    const loadedLeads = (leadsData || []) as Lead[]
    setLeads(loadedLeads)
    setStages((stagesData || []) as SalesFunnelStage[])
    const saved = draftLoad()
    if (saved?.editingId) {
      const lead = loadedLeads.find(l => l.id === saved.editingId)
      if (lead) setEditing(lead)
    }
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  function closeModal() { draftClear(); setModalOpen(false); setEditing(null) }

  function openCreate() {
    setEditing(null)
    setForm({ ...EMPTY, stage_id: stages[0]?.id || '' })
    setModalOpen(true)
  }
  function openEdit(lead: Lead) {
    setEditing(lead)
    setForm({ name: lead.name, company: (lead as any).company || '', email: lead.email || '', phone: lead.phone || '', source: lead.source || '', stage_id: lead.stage_id || '', notes: lead.notes || '' })
    setModalOpen(true)
  }

  async function save() {
    if (!form.name.trim()) return toast.error('Nome é obrigatório')
    setSaving(true)
    try {
      const payload = { name: form.name.trim(), email: form.email || null, phone: form.phone || null, source: form.source || null, stage_id: form.stage_id || null, notes: form.notes ? `[Empresa: ${form.company}]\n${form.notes}` : (form.company ? `[Empresa: ${form.company}]` : null) }
      if (editing) {
        await supabase.from('leads').update(payload).eq('id', editing.id)
        toast.success('Lead atualizado!')
      } else {
        await supabase.from('leads').insert(payload)
        toast.success('Lead criado!')
      }
      closeModal()
      load()
    } finally { setSaving(false) }
  }

  async function deleteLead(id: string) {
    if (!confirm('Excluir este lead?')) return
    await supabase.from('leads').delete().eq('id', id)
    setLeads(prev => prev.filter(l => l.id !== id))
    toast.success('Lead removido')
  }
  async function markConverted(lead: Lead) {
    await supabase.from('leads').update({ converted: true }).eq('id', lead.id)
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, converted: true } : l))
    toast.success('Convertido em cliente!')
  }

  const filtered = leads.filter(l => {
    const matchSearch = !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.email?.toLowerCase().includes(search.toLowerCase())
    const matchSource = !filterSource || l.source === filterSource
    const matchStage = !filterStage || l.stage_id === filterStage
    return matchSearch && matchSource && matchStage
  })

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const converted = leads.filter(l => l.converted).length
  const thisMonth = leads.filter(l => l.created_at >= monthStart).length
  const stageOptions = stages.map(s => ({ value: s.id, label: s.name }))

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Leads Industriais</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Potenciais clientes B2B captados</p>
        </div>
        <Button onClick={openCreate} leftIcon={<Plus size={16} />} style={{ background: COLOR }}>Novo Lead</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[{ label: 'Total', value: leads.length, color: COLOR }, { label: 'Este mês', value: thisMonth, color: '#8B5CF6' }, { label: 'Convertidos', value: converted, color: '#22c55e' }].map(s => (
          <div key={s.label} className="rounded-xl border p-4" style={{ borderColor: s.color + '25', background: 'var(--color-surface)' }}>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input placeholder="Buscar por nome ou e-mail..." value={search} onChange={e => updateParam('q', e.target.value)} leftIcon={<Search size={16} />} className="flex-1" />
        <Select value={filterSource} onChange={e => updateParam('source', e.target.value)} placeholder="Todos os canais" options={SOURCE_OPTIONS} className="sm:w-44" />
        <Select value={filterStage} onChange={e => updateParam('stage', e.target.value)} placeholder="Todos os estágios" options={stageOptions} className="sm:w-44" />
      </div>

      <Card noPadding>
        {filtered.length === 0
          ? <div className="text-center py-12 text-[var(--color-text-muted)]"><Building2 size={36} className="mx-auto mb-3 opacity-30" /><p>{leads.length === 0 ? 'Nenhum lead cadastrado ainda' : 'Nenhum lead encontrado'}</p></div>
          : <div className="divide-y divide-[var(--color-border)]">
            {filtered.map(lead => {
              const stage = (lead as any).stage as SalesFunnelStage | undefined
              return (
                <div key={lead.id} className="flex items-center gap-4 px-5 py-3">
                  <Avatar name={lead.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="font-medium text-[var(--color-text)] truncate">{lead.name}</p>
                      {lead.converted && <Badge variant="success">Convertido</Badge>}
                      {stage && <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: (stage.color || COLOR) + '20', color: stage.color || COLOR }}>{stage.name}</span>}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      {lead.email && <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1"><Mail size={11} />{lead.email}</span>}
                      {lead.phone && <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1"><Phone size={11} />{lead.phone}</span>}
                      {lead.source && <span className="text-xs text-[var(--color-text-muted)]">{SOURCE_LABELS[lead.source] || lead.source}</span>}
                      <span className="text-xs text-[var(--color-text-muted)]">{formatDate(lead.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {!lead.converted && <button onClick={() => markConverted(lead)} className="p-2 text-[var(--color-text-muted)] hover:text-green-400 hover:bg-green-500/10 rounded transition-colors" title="Converter em cliente"><CheckCircle2 size={16} /></button>}
                    <button onClick={() => openEdit(lead)} className="p-2 text-[var(--color-text-muted)] hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"><Edit2 size={16} /></button>
                    <button onClick={() => deleteLead(lead.id)} className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-surface-elevated)] rounded transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
              )
            })}
          </div>
        }
      </Card>

      <Modal open={modalOpen} onClose={closeModal} title={editing ? 'Editar Lead' : 'Novo Lead Industrial'} size="lg"
        footer={<div className="flex justify-end gap-2"><Button variant="ghost" onClick={closeModal}>Cancelar</Button><Button loading={saving} onClick={save} style={{ background: COLOR }}>Salvar</Button></div>}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Nome do contato" value={form.name} onChange={field('name')} placeholder="Nome completo" />
            <Input label="Empresa" value={form.company} onChange={field('company')} placeholder="Razão social" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="E-mail" type="email" value={form.email} onChange={field('email')} placeholder="email@empresa.com" />
            <Input label="Telefone / WhatsApp" value={form.phone} onChange={field('phone')} placeholder="(00) 90000-0000" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Canal de origem" value={form.source} onChange={field('source')} placeholder="Selecionar..." options={SOURCE_OPTIONS} />
            <Select label="Estágio do funil" value={form.stage_id} onChange={field('stage_id')} placeholder="Selecionar..." options={stageOptions} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">Observações</label>
            <textarea rows={3} className="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] resize-none" value={form.notes} onChange={field('notes')} placeholder="Demanda, serviço de interesse, histórico..." />
          </div>
        </div>
      </Modal>
    </div>
  )
}
