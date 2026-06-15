import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Edit2, Trash2, Search, Building2, Phone, Mail, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import type { ServiceClient } from '@/types'
import { Button, Card, Modal, Input, Select, Spinner, Avatar } from '@/components/ui'
import { formatDate } from '@/lib/utils'

const COLOR = '#3B82F6'

const DOC_OPTIONS = [
  { value: 'cnpj', label: 'CNPJ' },
  { value: 'cpf', label: 'CPF' },
]

const UF_OPTIONS = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO'].map(v => ({ value: v, label: v }))

interface FormState {
  name: string; email: string; phone: string
  document: string; document_type: string
  address: string; city: string; state: string; zip_code: string; notes: string
}
const EMPTY: FormState = { name: '', email: '', phone: '', document: '', document_type: 'cnpj', address: '', city: '', state: '', zip_code: '', notes: '' }

export function IndustrialClientesPage() {
  const [clients, setClients] = useState<ServiceClient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('q') ?? ''
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ServiceClient | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY)

  function updateParam(key: string, value: string) {
    setSearchParams(prev => { const n = new URLSearchParams(prev); value ? n.set(key, value) : n.delete(key); return n }, { replace: true })
  }
  function field(k: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))
  }

  async function load() {
    const { data } = await supabase.from('service_clients').select('*').order('name')
    setClients((data || []) as ServiceClient[])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  function openCreate() { setEditing(null); setForm(EMPTY); setModalOpen(true) }
  function openEdit(c: ServiceClient) {
    setEditing(c)
    setForm({ name: c.name, email: c.email || '', phone: c.phone || '', document: c.document || '', document_type: c.document_type || 'cnpj', address: c.address || '', city: c.city || '', state: c.state || '', zip_code: c.zip_code || '', notes: c.notes || '' })
    setModalOpen(true)
  }
  function closeModal() { setModalOpen(false); setEditing(null) }

  async function save() {
    if (!form.name.trim()) return toast.error('Nome é obrigatório')
    setSaving(true)
    try {
      const payload = { name: form.name.trim(), email: form.email || null, phone: form.phone || null, document: form.document || null, document_type: (form.document_type as 'cpf' | 'cnpj') || null, address: form.address || null, city: form.city || null, state: form.state || null, zip_code: form.zip_code || null, notes: form.notes || null }
      if (editing) {
        await supabase.from('service_clients').update(payload).eq('id', editing.id)
        toast.success('Cliente atualizado!')
      } else {
        await supabase.from('service_clients').insert(payload)
        toast.success('Cliente cadastrado!')
      }
      closeModal(); load()
    } finally { setSaving(false) }
  }

  async function deleteClient(id: string) {
    if (!confirm('Excluir este cliente?')) return
    await supabase.from('service_clients').delete().eq('id', id)
    setClients(prev => prev.filter(c => c.id !== id))
    toast.success('Cliente removido')
  }

  const filtered = clients.filter(c => {
    const s = search.toLowerCase()
    return !search || c.name.toLowerCase().includes(s) || c.email?.toLowerCase().includes(s) || c.document?.includes(s) || c.city?.toLowerCase().includes(s)
  })

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Clientes Industriais</h1>
          <p className="text-sm text-[var(--color-text-muted)]">{clients.length} {clients.length === 1 ? 'cliente cadastrado' : 'clientes cadastrados'}</p>
        </div>
        <Button onClick={openCreate} leftIcon={<Plus size={16} />} style={{ background: COLOR }}>Novo Cliente</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: clients.length, color: COLOR },
          { label: 'Com CNPJ', value: clients.filter(c => c.document_type === 'cnpj').length, color: '#8B5CF6' },
          { label: 'Cidades atendidas', value: new Set(clients.map(c => c.city).filter(Boolean)).size, color: '#22c55e' },
        ].map(s => (
          <div key={s.label} className="rounded-xl border p-4" style={{ borderColor: s.color + '25', background: 'var(--color-surface)' }}>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <Input placeholder="Buscar por nome, e-mail, CNPJ ou cidade..." value={search} onChange={e => updateParam('q', e.target.value)} leftIcon={<Search size={16} />} />

      <Card noPadding>
        {filtered.length === 0
          ? <div className="text-center py-12 text-[var(--color-text-muted)]"><Building2 size={36} className="mx-auto mb-3 opacity-30" /><p>{clients.length === 0 ? 'Nenhum cliente cadastrado ainda' : 'Nenhum cliente encontrado'}</p></div>
          : <div className="divide-y divide-[var(--color-border)]">
            {filtered.map(client => (
              <div key={client.id} className="flex items-center gap-4 px-5 py-3">
                <Avatar name={client.name} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--color-text)] truncate">{client.name}</p>
                  <div className="flex items-center gap-3 flex-wrap mt-0.5">
                    {client.email && <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1"><Mail size={11} />{client.email}</span>}
                    {client.phone && <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1"><Phone size={11} />{client.phone}</span>}
                    {client.city && <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1"><MapPin size={11} />{client.city}{client.state ? ` — ${client.state}` : ''}</span>}
                    {client.document && <span className="text-xs text-[var(--color-text-muted)] font-mono">{client.document_type?.toUpperCase()}: {client.document}</span>}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-[var(--color-text-muted)]">Desde {formatDate(client.created_at)}</p>
                  <div className="flex gap-1 mt-1 justify-end">
                    <button onClick={() => openEdit(client)} className="p-1.5 text-[var(--color-text-muted)] hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"><Edit2 size={14} /></button>
                    <button onClick={() => deleteClient(client.id)} className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-surface-elevated)] rounded transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        }
      </Card>

      <Modal open={modalOpen} onClose={closeModal} title={editing ? 'Editar Cliente' : 'Novo Cliente'} size="xl"
        footer={<div className="flex justify-end gap-2"><Button variant="ghost" onClick={closeModal}>Cancelar</Button><Button loading={saving} onClick={save} style={{ background: COLOR }}>Salvar</Button></div>}>
        <div className="space-y-4">
          <Input label="Razão social / Nome" value={form.name} onChange={field('name')} placeholder="Nome da empresa ou pessoa" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="E-mail" type="email" value={form.email} onChange={field('email')} placeholder="contato@empresa.com" />
            <Input label="Telefone" value={form.phone} onChange={field('phone')} placeholder="(00) 90000-0000" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Select label="Tipo de documento" value={form.document_type} onChange={field('document_type')} options={DOC_OPTIONS} />
            <div className="col-span-2">
              <Input label={form.document_type === 'cnpj' ? 'CNPJ' : 'CPF'} value={form.document} onChange={field('document')} placeholder={form.document_type === 'cnpj' ? '00.000.000/0000-00' : '000.000.000-00'} />
            </div>
          </div>
          <Input label="Endereço" value={form.address} onChange={field('address')} placeholder="Rua, número, complemento" />
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2"><Input label="Cidade" value={form.city} onChange={field('city')} placeholder="Cidade" /></div>
            <Select label="Estado" value={form.state} onChange={field('state')} placeholder="UF" options={UF_OPTIONS} />
          </div>
          <Input label="CEP" value={form.zip_code} onChange={field('zip_code')} placeholder="00000-000" />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">Observações</label>
            <textarea rows={2} className="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] resize-none" value={form.notes} onChange={field('notes')} placeholder="Histórico, contatos, preferências..." />
          </div>
        </div>
      </Modal>
    </div>
  )
}
