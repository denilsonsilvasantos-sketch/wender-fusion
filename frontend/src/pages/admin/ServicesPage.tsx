import { useEffect, useState } from 'react'
import { Plus, Wrench, FileText, Users, Edit2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import type { ServiceOrder, ServiceClient } from '@/types'
import { Button, Card, Badge, Modal, Input, Select, Spinner } from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/utils'

const clientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  document: z.string().optional(),
  document_type: z.enum(['cpf', 'cnpj']).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
})
type ClientForm = z.infer<typeof clientSchema>

const osSchema = z.object({
  client_id: z.string().min(1, 'Selecione o cliente'),
  title: z.string().min(3),
  description: z.string().optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']),
  labor_cost: z.number().min(0).optional(),
  materials_cost: z.number().min(0).optional(),
  notes: z.string().optional(),
})
type OSForm = z.infer<typeof osSchema>

type Tab = 'orders' | 'clients'

export function AdminServicesPage() {
  const [tab, setTab] = useState<Tab>('orders')
  const [orders, setOrders] = useState<ServiceOrder[]>([])
  const [clients, setClients] = useState<ServiceClient[]>([])
  const [loading, setLoading] = useState(true)
  const [clientModal, setClientModal] = useState(false)
  const [osModal, setOsModal] = useState(false)
  const [editingOS, setEditingOS] = useState<ServiceOrder | null>(null)
  const [saving, setSaving] = useState(false)

  const clientForm = useForm<ClientForm>({ resolver: zodResolver(clientSchema) })
  const osForm = useForm<OSForm>({ resolver: zodResolver(osSchema), defaultValues: { priority: 'normal', labor_cost: 0, materials_cost: 0 } })

  async function load() {
    const [{ data: ords }, { data: cls }] = await Promise.all([
      supabase.from('service_orders').select('*, client:service_clients(name, phone)').order('created_at', { ascending: false }),
      supabase.from('service_clients').select('*').order('name'),
    ])
    setOrders((ords || []) as ServiceOrder[])
    setClients((cls || []) as ServiceClient[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function saveClient(data: ClientForm) {
    setSaving(true)
    try {
      await supabase.from('service_clients').insert(data)
      toast.success('Cliente cadastrado!')
      setClientModal(false)
      clientForm.reset()
      load()
    } catch { toast.error('Erro ao salvar cliente') } finally { setSaving(false) }
  }

  async function saveOS(data: OSForm) {
    setSaving(true)
    try {
      const total = (data.labor_cost || 0) + (data.materials_cost || 0)
      if (editingOS) {
        await supabase.from('service_orders').update({ ...data, total_cost: total }).eq('id', editingOS.id)
        toast.success('O.S. atualizada!')
      } else {
        await supabase.from('service_orders').insert({ ...data, total_cost: total, os_number: '' })
        toast.success('O.S. criada!')
      }
      setOsModal(false)
      osForm.reset()
      setEditingOS(null)
      load()
    } catch { toast.error('Erro ao salvar O.S.') } finally { setSaving(false) }
  }

  async function updateOSStatus(id: string, status: string) {
    await supabase.from('service_orders').update({ status, ...(status === 'in_progress' ? { started_at: new Date().toISOString() } : {}), ...(status === 'completed' ? { completed_at: new Date().toISOString() } : {}) }).eq('id', id)
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: status as ServiceOrder['status'] } : o))
    toast.success('Status atualizado!')
  }

  function openEditOS(os: ServiceOrder) {
    setEditingOS(os)
    osForm.reset({ client_id: os.client_id, title: os.title, description: os.description || '', priority: os.priority, labor_cost: os.labor_cost || 0, materials_cost: os.materials_cost || 0, notes: os.notes || '' })
    setOsModal(true)
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'orders', label: `Ordens de Serviço (${orders.length})`, icon: <Wrench size={16} /> },
    { id: 'clients', label: `Clientes (${clients.length})`, icon: <Users size={16} /> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-[var(--color-text)]">Módulo de Serviços</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { clientForm.reset(); setClientModal(true) }} leftIcon={<Plus size={16} />} size="sm">Novo Cliente</Button>
          <Button onClick={() => { setEditingOS(null); osForm.reset({ priority: 'normal', labor_cost: 0, materials_cost: 0 }); setOsModal(true) }} leftIcon={<Plus size={16} />} size="sm">Nova O.S.</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[var(--color-surface)] p-1 rounded-lg w-fit">
        {tabs.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === id ? 'bg-[var(--color-surface-high)] text-[var(--color-text)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}
          >
            {icon}{label}
          </button>
        ))}
      </div>

      {/* Orders Tab */}
      {tab === 'orders' && (
        <Card noPadding>
          {orders.length === 0 ? (
            <div className="text-center py-12"><Wrench size={40} className="text-[var(--color-text-muted)] mx-auto mb-3" /><p className="text-[var(--color-text-muted)]">Nenhuma O.S. criada</p></div>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {orders.map((os) => (
                <div key={os.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-mono text-[var(--color-primary)]">{os.os_number}</span>
                        <Badge status={os.status} />
                        <Badge status={os.priority} />
                      </div>
                      <p className="font-medium text-[var(--color-text)]">{os.title}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{(os.client as any)?.name} • {formatDate(os.created_at)}</p>
                    </div>
                    <div className="text-right">
                      {os.total_cost && os.total_cost > 0 && <p className="font-bold text-[var(--color-primary)]">{formatCurrency(os.total_cost)}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap mt-2">
                    {os.status === 'pending' && <Button size="sm" variant="outline" onClick={() => updateOSStatus(os.id, 'in_progress')}>Iniciar</Button>}
                    {os.status === 'in_progress' && <Button size="sm" onClick={() => updateOSStatus(os.id, 'completed')}>Concluir</Button>}
                    {['pending', 'in_progress'].includes(os.status) && <Button size="sm" variant="ghost" onClick={() => updateOSStatus(os.id, 'cancelled')}>Cancelar</Button>}
                    <Button size="sm" variant="ghost" leftIcon={<Edit2 size={13} />} onClick={() => openEditOS(os)}>Editar</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Clients Tab */}
      {tab === 'clients' && (
        <Card noPadding>
          {clients.length === 0 ? (
            <div className="text-center py-12"><Users size={40} className="text-[var(--color-text-muted)] mx-auto mb-3" /><p className="text-[var(--color-text-muted)]">Nenhum cliente cadastrado</p></div>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {clients.map((c) => (
                <div key={c.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-10 h-10 bg-[var(--color-surface-elevated)] rounded-full flex items-center justify-center text-[var(--color-primary)] font-bold text-sm flex-shrink-0">
                    {c.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--color-text)]">{c.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{c.email || c.phone || '—'}</p>
                    {c.city && <p className="text-xs text-[var(--color-text-muted)]">{c.city}{c.state ? `, ${c.state}` : ''}</p>}
                  </div>
                  {c.document && <p className="text-xs text-[var(--color-text-muted)]">{c.document_type?.toUpperCase()}: {c.document}</p>}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Client Modal */}
      <Modal open={clientModal} onClose={() => setClientModal(false)} title="Novo Cliente" footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setClientModal(false)}>Cancelar</Button>
          <Button loading={saving} onClick={clientForm.handleSubmit(saveClient)}>Salvar</Button>
        </div>
      }>
        <div className="space-y-3">
          <Input label="Nome" error={clientForm.formState.errors.name?.message} {...clientForm.register('name')} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="E-mail" type="email" {...clientForm.register('email')} />
            <Input label="Telefone" {...clientForm.register('phone')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Tipo Documento" options={[{ value: 'cpf', label: 'CPF' }, { value: 'cnpj', label: 'CNPJ' }]} placeholder="Selecione" {...clientForm.register('document_type')} />
            <Input label="Documento" {...clientForm.register('document')} />
          </div>
          <Input label="Endereço" {...clientForm.register('address')} />
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2"><Input label="Cidade" {...clientForm.register('city')} /></div>
            <Input label="UF" maxLength={2} {...clientForm.register('state')} />
          </div>
        </div>
      </Modal>

      {/* O.S. Modal */}
      <Modal open={osModal} onClose={() => setOsModal(false)} title={editingOS ? 'Editar O.S.' : 'Nova Ordem de Serviço'} size="lg" footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOsModal(false)}>Cancelar</Button>
          <Button loading={saving} onClick={osForm.handleSubmit(saveOS)}>Salvar</Button>
        </div>
      }>
        <div className="space-y-4">
          <Select label="Cliente" placeholder="Selecione o cliente" options={clients.map((c) => ({ value: c.id, label: c.name }))} error={osForm.formState.errors.client_id?.message} {...osForm.register('client_id')} />
          <Input label="Título da O.S." error={osForm.formState.errors.title?.message} {...osForm.register('title')} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">Descrição do Serviço</label>
            <textarea rows={3} className="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] resize-none" {...osForm.register('description')} />
          </div>
          <Select label="Prioridade" options={[{ value: 'low', label: 'Baixa' }, { value: 'normal', label: 'Normal' }, { value: 'high', label: 'Alta' }, { value: 'urgent', label: 'Urgente' }]} {...osForm.register('priority')} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Mão de Obra (R$)" type="number" step="0.01" min={0} {...osForm.register('labor_cost', { valueAsNumber: true })} />
            <Input label="Materiais (R$)" type="number" step="0.01" min={0} {...osForm.register('materials_cost', { valueAsNumber: true })} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">Observações</label>
            <textarea rows={2} className="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] resize-none" {...osForm.register('notes')} />
          </div>
        </div>
      </Modal>
    </div>
  )
}
