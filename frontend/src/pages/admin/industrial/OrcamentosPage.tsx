import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Edit2, Search, Calculator, CheckCircle2, XCircle, Clock, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import type { Quotation, ServiceClient, QuotationStatus } from '@/types'
import { Button, Card, Badge, Modal, Input, Select, Spinner } from '@/components/ui'
import { formatDate, formatCurrency } from '@/lib/utils'

const COLOR = '#3B82F6'

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Rascunho' },
  { value: 'sent', label: 'Enviado' },
  { value: 'approved', label: 'Aprovado' },
  { value: 'rejected', label: 'Recusado' },
  { value: 'expired', label: 'Expirado' },
]

const STATUS_META: Record<QuotationStatus, { label: string; icon: React.ElementType; color: string }> = {
  draft:    { label: 'Rascunho', icon: Edit2,         color: '#6B7280' },
  sent:     { label: 'Enviado',  icon: Send,          color: COLOR },
  approved: { label: 'Aprovado', icon: CheckCircle2,  color: '#22c55e' },
  rejected: { label: 'Recusado', icon: XCircle,       color: '#ef4444' },
  expired:  { label: 'Expirado', icon: Clock,         color: '#f59e0b' },
}

interface FormState {
  client_id: string; title: string; description: string
  status: string; valid_until: string; total_amount: string; notes: string
}
const EMPTY: FormState = { client_id: '', title: '', description: '', status: 'draft', valid_until: '', total_amount: '', notes: '' }

export function IndustrialOrcamentosPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [clients, setClients] = useState<ServiceClient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('q') ?? ''
  const filterStatus = searchParams.get('status') ?? ''
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Quotation | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY)

  function updateParam(k: string, v: string) {
    setSearchParams(prev => { const n = new URLSearchParams(prev); v ? n.set(k, v) : n.delete(k); return n }, { replace: true })
  }
  function field(k: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))
  }

  async function load() {
    const [{ data: q }, { data: c }] = await Promise.all([
      supabase.from('quotations').select('*, client:service_clients(id,name,email,phone)').order('created_at', { ascending: false }),
      supabase.from('service_clients').select('id,name').order('name'),
    ])
    setQuotations((q || []) as Quotation[])
    setClients((c || []) as ServiceClient[])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  function openCreate() { setEditing(null); setForm(EMPTY); setModalOpen(true) }
  function openEdit(q: Quotation) {
    setEditing(q)
    setForm({ client_id: q.client_id, title: q.title, description: q.description || '', status: q.status, valid_until: q.valid_until?.split('T')[0] || '', total_amount: q.total_amount?.toString() || '', notes: q.notes || '' })
    setModalOpen(true)
  }
  function closeModal() { setModalOpen(false); setEditing(null) }

  async function save() {
    if (!form.title.trim()) return toast.error('Título é obrigatório')
    if (!form.client_id) return toast.error('Selecione um cliente')
    setSaving(true)
    try {
      const payload = { client_id: form.client_id, title: form.title.trim(), description: form.description || null, status: form.status as QuotationStatus, valid_until: form.valid_until || null, total_amount: form.total_amount ? parseFloat(form.total_amount) : null, notes: form.notes || null }
      if (editing) {
        await supabase.from('quotations').update(payload).eq('id', editing.id)
        toast.success('Orçamento atualizado!')
      } else {
        await supabase.from('quotations').insert(payload)
        toast.success('Orçamento criado!')
      }
      closeModal(); load()
    } finally { setSaving(false) }
  }

  const filtered = quotations.filter(q => {
    const client = (q as any).client as ServiceClient | undefined
    const matchSearch = !search || q.title.toLowerCase().includes(search.toLowerCase()) || client?.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !filterStatus || q.status === filterStatus
    return matchSearch && matchStatus
  })

  const approved = quotations.filter(q => q.status === 'approved').length
  const pending = quotations.filter(q => q.status === 'sent').length
  const totalValue = quotations.filter(q => q.status === 'approved').reduce((s, q) => s + (q.total_amount || 0), 0)
  const clientOptions = clients.map(c => ({ value: c.id, label: c.name }))

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Orçamentos</h1>
          <p className="text-sm text-[var(--color-text-muted)]">{quotations.length} orçamentos registrados</p>
        </div>
        <Button onClick={openCreate} leftIcon={<Plus size={16} />} style={{ background: COLOR }}>Novo Orçamento</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Aprovados', value: approved, color: '#22c55e' },
          { label: 'Aguardando', value: pending, color: '#f59e0b' },
          { label: 'Valor aprovado', value: formatCurrency(totalValue), color: COLOR },
        ].map(s => (
          <div key={s.label} className="rounded-xl border p-4" style={{ borderColor: s.color + '25', background: 'var(--color-surface)' }}>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input placeholder="Buscar por título ou cliente..." value={search} onChange={e => updateParam('q', e.target.value)} leftIcon={<Search size={16} />} className="flex-1" />
        <Select value={filterStatus} onChange={e => updateParam('status', e.target.value)} placeholder="Todos os status" options={STATUS_OPTIONS} className="sm:w-44" />
      </div>

      <Card noPadding>
        {filtered.length === 0
          ? <div className="text-center py-12 text-[var(--color-text-muted)]"><Calculator size={36} className="mx-auto mb-3 opacity-30" /><p>{quotations.length === 0 ? 'Nenhum orçamento registrado ainda' : 'Nenhum orçamento encontrado'}</p></div>
          : <div className="divide-y divide-[var(--color-border)]">
            {filtered.map(q => {
              const client = (q as any).client as ServiceClient | undefined
              const meta = STATUS_META[q.status]
              const Icon = meta.icon
              return (
                <div key={q.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: meta.color + '15' }}>
                    <Icon size={16} style={{ color: meta.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <p className="font-medium text-[var(--color-text)] truncate">{q.title}</p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: meta.color + '15', color: meta.color }}>{meta.label}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)] flex-wrap">
                      {client && <span>{client.name}</span>}
                      {q.valid_until && <span>Válido até {formatDate(q.valid_until)}</span>}
                      <span>{formatDate(q.created_at)}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {q.total_amount != null && <p className="font-semibold text-sm text-[var(--color-text)]">{formatCurrency(q.total_amount)}</p>}
                    <button onClick={() => openEdit(q)} className="mt-1 p-1.5 text-[var(--color-text-muted)] hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"><Edit2 size={14} /></button>
                  </div>
                </div>
              )
            })}
          </div>
        }
      </Card>

      <Modal open={modalOpen} onClose={closeModal} title={editing ? 'Editar Orçamento' : 'Novo Orçamento'} size="lg"
        footer={<div className="flex justify-end gap-2"><Button variant="ghost" onClick={closeModal}>Cancelar</Button><Button loading={saving} onClick={save} style={{ background: COLOR }}>Salvar</Button></div>}>
        <div className="space-y-4">
          <Input label="Título do orçamento" value={form.title} onChange={field('title')} placeholder="Ex: Solda de estrutura metálica" />
          <Select label="Cliente" value={form.client_id} onChange={field('client_id')} placeholder="Selecionar cliente..." options={clientOptions} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Status" value={form.status} onChange={field('status')} options={STATUS_OPTIONS} />
            <Input label="Validade" type="date" value={form.valid_until} onChange={field('valid_until')} />
          </div>
          <Input label="Valor total (R$)" type="number" value={form.total_amount} onChange={field('total_amount')} placeholder="0,00" />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">Descrição / Escopo</label>
            <textarea rows={3} className="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] resize-none" value={form.description} onChange={field('description')} placeholder="Descreva os serviços incluídos..." />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">Observações internas</label>
            <textarea rows={2} className="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] resize-none" value={form.notes} onChange={field('notes')} placeholder="Notas internas..." />
          </div>
        </div>
      </Modal>
    </div>
  )
}
