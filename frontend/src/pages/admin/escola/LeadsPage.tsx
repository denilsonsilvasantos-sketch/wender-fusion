import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Edit2, Trash2, Search, CheckCircle2, Phone, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import type { Lead, SalesFunnelStage, Course } from '@/types'
import { Button, Card, Badge, Modal, Input, Select, Spinner, Avatar } from '@/components/ui'
import { formatDate } from '@/lib/utils'

const COLOR = '#FF8C00'

const SOURCE_LABELS: Record<string, string> = {
  website: 'Site',
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  facebook: 'Facebook',
  indicacao: 'Indicação',
  outro: 'Outro',
}

const SOURCE_OPTIONS = [
  { value: 'website', label: 'Site' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'indicacao', label: 'Indicação' },
  { value: 'outro', label: 'Outro' },
]

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendente' },
  { value: 'active', label: 'Ativo' },
  { value: 'completed', label: 'Concluído' },
  { value: 'cancelled', label: 'Cancelado' },
]

interface FormState {
  name: string
  email: string
  phone: string
  source: string
  stage_id: string
  course_interest: string
  notes: string
}

const EMPTY_FORM: FormState = {
  name: '', email: '', phone: '', source: '', stage_id: '', course_interest: '', notes: '',
}

export function EscolaLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [stages, setStages] = useState<SalesFunnelStage[]>([])
  const [courses, setCourses] = useState<Pick<Course, 'id' | 'title'>[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('q') ?? ''
  const filterSource = searchParams.get('source') ?? ''
  const filterStage = searchParams.get('stage') ?? ''
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Lead | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  function updateParam(key: string, value: string) {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (value) next.set(key, value)
      else next.delete(key)
      return next
    }, { replace: true })
  }

  async function load() {
    const [{ data: leadsData }, { data: stagesData }, { data: coursesData }] = await Promise.all([
      supabase
        .from('leads')
        .select('*, stage:sales_funnel_stages(id, name, color), course:courses(id, title)')
        .order('created_at', { ascending: false }),
      supabase.from('sales_funnel_stages').select('*').order('order_index'),
      supabase.from('courses').select('id, title').eq('status', 'published').order('title'),
    ])
    setLeads((leadsData || []) as Lead[])
    setStages((stagesData || []) as SalesFunnelStage[])
    setCourses((coursesData || []) as Pick<Course, 'id' | 'title'>[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openCreate() {
    setEditing(null)
    setForm({ ...EMPTY_FORM, stage_id: stages[0]?.id || '' })
    setModalOpen(true)
  }

  function openEdit(lead: Lead) {
    setEditing(lead)
    setForm({
      name: lead.name,
      email: lead.email || '',
      phone: lead.phone || '',
      source: lead.source || '',
      stage_id: lead.stage_id || '',
      course_interest: lead.course_interest || '',
      notes: lead.notes || '',
    })
    setModalOpen(true)
  }

  async function save() {
    if (!form.name.trim()) return toast.error('Nome é obrigatório')
    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email || null,
        phone: form.phone || null,
        source: form.source || null,
        stage_id: form.stage_id || null,
        course_interest: form.course_interest || null,
        notes: form.notes || null,
      }
      if (editing) {
        await supabase.from('leads').update(payload).eq('id', editing.id)
        toast.success('Lead atualizado!')
      } else {
        await supabase.from('leads').insert(payload)
        toast.success('Lead criado!')
      }
      setModalOpen(false)
      load()
    } catch {
      toast.error('Erro ao salvar lead')
    } finally {
      setSaving(false)
    }
  }

  async function deleteLead(id: string) {
    if (!confirm('Excluir este lead?')) return
    await supabase.from('leads').delete().eq('id', id)
    setLeads((prev) => prev.filter((l) => l.id !== id))
    toast.success('Lead removido')
  }

  async function markConverted(lead: Lead) {
    await supabase.from('leads').update({ converted: true }).eq('id', lead.id)
    setLeads((prev) => prev.map((l) => l.id === lead.id ? { ...l, converted: true } : l))
    toast.success('Marcado como convertido!')
  }

  const filtered = leads.filter((l) => {
    const matchSearch = !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email?.toLowerCase().includes(search.toLowerCase())
    const matchSource = !filterSource || l.source === filterSource
    const matchStage = !filterStage || l.stage_id === filterStage
    return matchSearch && matchSource && matchStage
  })

  const stageOptions = stages.map((s) => ({ value: s.id, label: s.name }))
  const courseOptions = courses.map((c) => ({ value: c.id, label: c.title }))

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const converted = leads.filter((l) => l.converted).length
  const thisMonth = leads.filter((l) => l.created_at >= monthStart).length

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Leads</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Potenciais alunos captados</p>
        </div>
        <Button onClick={openCreate} leftIcon={<Plus size={16} />}>Novo Lead</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: leads.length, color: COLOR },
          { label: 'Este mês', value: thisMonth, color: '#8B5CF6' },
          { label: 'Convertidos', value: converted, color: '#22c55e' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border p-4" style={{ borderColor: stat.color + '25', background: 'var(--color-surface)' }}>
            <p className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Buscar por nome ou e-mail..."
          value={search}
          onChange={(e) => updateParam('q', e.target.value)}
          leftIcon={<Search size={16} />}
          className="flex-1"
        />
        <Select
          value={filterSource}
          onChange={(e) => updateParam('source', e.target.value)}
          placeholder="Todos os canais"
          options={SOURCE_OPTIONS}
          className="sm:w-44"
        />
        <Select
          value={filterStage}
          onChange={(e) => updateParam('stage', e.target.value)}
          placeholder="Todos os estágios"
          options={stageOptions}
          className="sm:w-44"
        />
      </div>

      <Card noPadding>
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-[var(--color-text-muted)]">
            <Search size={36} className="mx-auto mb-3 opacity-30" />
            <p>{leads.length === 0 ? 'Nenhum lead cadastrado ainda' : 'Nenhum lead encontrado'}</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {filtered.map((lead) => {
              const stage = (lead as any).stage as SalesFunnelStage | undefined
              return (
                <div key={lead.id} className="flex items-center gap-4 px-5 py-3">
                  <Avatar name={lead.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="font-medium text-[var(--color-text)] truncate">{lead.name}</p>
                      {lead.converted && <Badge variant="success">Convertido</Badge>}
                      {stage && (
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                          style={{ background: (stage.color || COLOR) + '20', color: stage.color || COLOR }}
                        >
                          {stage.name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      {lead.email && (
                        <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                          <Mail size={11} />{lead.email}
                        </span>
                      )}
                      {lead.phone && (
                        <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                          <Phone size={11} />{lead.phone}
                        </span>
                      )}
                      {lead.source && (
                        <span className="text-xs text-[var(--color-text-muted)]">
                          {SOURCE_LABELS[lead.source] || lead.source}
                        </span>
                      )}
                      <span className="text-xs text-[var(--color-text-muted)]">{formatDate(lead.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {!lead.converted && (
                      <button
                        onClick={() => markConverted(lead)}
                        className="p-2 text-[var(--color-text-muted)] hover:text-green-400 hover:bg-green-500/10 rounded transition-colors"
                        title="Marcar como convertido"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => openEdit(lead)}
                      className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-secondary)] hover:bg-[var(--color-surface-elevated)] rounded transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteLead(lead.id)}
                      className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-surface-elevated)] rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar Lead' : 'Novo Lead'}
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button loading={saving} onClick={save}>Salvar</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input label="Nome" value={form.name} onChange={set('name')} placeholder="Nome completo" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="E-mail" type="email" value={form.email} onChange={set('email')} placeholder="email@exemplo.com" />
            <Input label="Telefone / WhatsApp" value={form.phone} onChange={set('phone')} placeholder="(00) 90000-0000" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Canal de origem"
              value={form.source}
              onChange={set('source')}
              placeholder="Selecionar..."
              options={SOURCE_OPTIONS}
            />
            <Select
              label="Estágio do funil"
              value={form.stage_id}
              onChange={set('stage_id')}
              placeholder="Selecionar..."
              options={stageOptions}
            />
          </div>
          <Select
            label="Interesse em curso"
            value={form.course_interest}
            onChange={set('course_interest')}
            placeholder="Nenhum específico"
            options={courseOptions}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
              Observações
            </label>
            <textarea
              rows={3}
              className="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] resize-none"
              value={form.notes}
              onChange={set('notes')}
              placeholder="Notas sobre o lead..."
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
