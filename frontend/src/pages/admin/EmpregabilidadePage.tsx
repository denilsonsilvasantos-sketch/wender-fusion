import { useEffect, useState } from 'react'
import api from '@/lib/api'
import type { JobPosting, PartnerCompany, JobApplication } from '@/types'
import { Badge, Button, Modal, Input, Spinner } from '@/components/ui'

type Tab = 'jobs' | 'companies' | 'applications'

const statusLabel: Record<string, string> = {
  applied: 'Candidatado', viewed: 'Visualizado', shortlisted: 'Selecionado', hired: 'Contratado', rejected: 'Recusado',
}
const jobStatusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
  open: 'success', closed: 'danger', paused: 'warning',
}

export function AdminEmpregabilidadePage() {
  const [tab, setTab] = useState<Tab>('jobs')
  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [companies, setCompanies] = useState<PartnerCompany[]>([])
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)

  // Modals
  const [jobModal, setJobModal] = useState(false)
  const [companyModal, setCompanyModal] = useState(false)
  const [editingJob, setEditingJob] = useState<Partial<JobPosting> | null>(null)
  const [editingCompany, setEditingCompany] = useState<Partial<PartnerCompany> | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get<{ data: JobPosting[] }>('/empregabilidade/jobs'),
      api.get<{ data: PartnerCompany[] }>('/empregabilidade/companies'),
    ]).then(([jobsRes, companiesRes]) => {
      setJobs(jobsRes.data.data ?? [])
      setCompanies(companiesRes.data.data ?? [])
    }).finally(() => setLoading(false))
  }, [])

  async function loadApplications(jobId: string) {
    const res = await api.get<{ data: JobApplication[] }>(`/empregabilidade/jobs/${jobId}/applications`)
    setApplications(res.data.data ?? [])
    setTab('applications')
  }

  async function saveJob() {
    if (!editingJob) return
    setSaving(true)
    try {
      if (editingJob.id) {
        const res = await api.patch<{ data: JobPosting }>(`/empregabilidade/jobs/${editingJob.id}`, editingJob)
        setJobs(prev => prev.map(j => j.id === editingJob.id ? res.data.data : j))
      } else {
        const res = await api.post<{ data: JobPosting }>('/empregabilidade/jobs', editingJob)
        setJobs(prev => [res.data.data, ...prev])
      }
      setJobModal(false)
      setEditingJob(null)
    } finally { setSaving(false) }
  }

  async function saveCompany() {
    if (!editingCompany) return
    setSaving(true)
    try {
      if (editingCompany.id) {
        const res = await api.patch<{ data: PartnerCompany }>(`/empregabilidade/companies/${editingCompany.id}`, editingCompany)
        setCompanies(prev => prev.map(c => c.id === editingCompany.id ? res.data.data : c))
      } else {
        const res = await api.post<{ data: PartnerCompany }>('/empregabilidade/companies', editingCompany)
        setCompanies(prev => [res.data.data, ...prev])
      }
      setCompanyModal(false)
      setEditingCompany(null)
    } finally { setSaving(false) }
  }

  async function updateAppStatus(appId: string, status: string) {
    await api.patch(`/empregabilidade/applications/${appId}/status`, { status })
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: status as JobApplication['status'] } : a))
  }

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Empregabilidade</h1>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={() => { setEditingCompany({}); setCompanyModal(true) }}>
            Nova Empresa
          </Button>
          <Button size="sm" onClick={() => { setEditingJob({ status: 'open' }); setJobModal(true) }}>
            Nova Vaga
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/10">
        {(['jobs', 'companies', 'applications'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-[var(--color-text-muted)] hover:text-white'
            }`}
          >
            {t === 'jobs' ? `Vagas (${jobs.length})` : t === 'companies' ? `Empresas (${companies.length})` : `Candidaturas (${applications.length})`}
          </button>
        ))}
      </div>

      {/* Jobs tab */}
      {tab === 'jobs' && (
        <div className="space-y-3">
          {jobs.map(job => (
            <div key={job.id} className="bg-[var(--color-surface)] rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{job.title}</p>
                <p className="text-[var(--color-text-muted)] text-sm">{job.company?.name} • {job.location}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={jobStatusVariant[job.status] ?? 'default'}>
                  {job.status === 'open' ? 'Aberta' : job.status === 'closed' ? 'Encerrada' : 'Pausada'}
                </Badge>
                <Button size="sm" variant="ghost" onClick={() => loadApplications(job.id)}>Candidaturas</Button>
                <Button size="sm" variant="outline" onClick={() => { setEditingJob(job); setJobModal(true) }}>Editar</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Companies tab */}
      {tab === 'companies' && (
        <div className="grid gap-3 md:grid-cols-2">
          {companies.map(company => (
            <div key={company.id} className="bg-[var(--color-surface)] rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{company.name}</p>
                <p className="text-[var(--color-text-muted)] text-sm">{company.city}/{company.state} • {company.industry}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={company.active ? 'success' : 'default'}>{company.active ? 'Ativa' : 'Inativa'}</Badge>
                <Button size="sm" variant="outline" onClick={() => { setEditingCompany(company); setCompanyModal(true) }}>Editar</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Applications tab */}
      {tab === 'applications' && (
        <div className="space-y-3">
          {applications.length === 0 ? (
            <p className="text-[var(--color-text-muted)] text-center py-8">Selecione uma vaga para ver candidaturas.</p>
          ) : (
            applications.map(app => (
              <div key={app.id} className="bg-[var(--color-surface)] rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{app.student?.name}</p>
                  <p className="text-[var(--color-text-muted)] text-sm">{app.student?.email}</p>
                  {app.cover_letter && <p className="text-[var(--color-text-muted)] text-xs mt-1 line-clamp-2">{app.cover_letter}</p>}
                </div>
                <select
                  value={app.status}
                  onChange={e => updateAppStatus(app.id, e.target.value)}
                  className="bg-[var(--color-bg)] border border-white/10 rounded-lg px-2 py-1.5 text-white text-sm"
                >
                  {Object.entries(statusLabel).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
            ))
          )}
        </div>
      )}

      {/* Job Modal */}
      <Modal open={jobModal} onClose={() => { setJobModal(false); setEditingJob(null) }} title={editingJob?.id ? 'Editar Vaga' : 'Nova Vaga'}>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-[var(--color-text-muted)] block mb-1">Empresa</label>
            <select
              value={editingJob?.company_id ?? ''}
              onChange={e => setEditingJob(p => ({ ...p!, company_id: e.target.value }))}
              className="w-full bg-[var(--color-bg)] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="">Selecione...</option>
              {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <Input label="Título da vaga" value={editingJob?.title ?? ''} onChange={e => setEditingJob(p => ({ ...p!, title: e.target.value }))} />
          <Input label="Localização" value={editingJob?.location ?? ''} onChange={e => setEditingJob(p => ({ ...p!, location: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-[var(--color-text-muted)] block mb-1">Tipo</label>
              <select value={editingJob?.job_type ?? ''} onChange={e => setEditingJob(p => ({ ...p!, job_type: e.target.value as JobPosting['job_type'] }))}
                className="w-full bg-[var(--color-bg)] border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                <option value="">—</option>
                <option value="clt">CLT</option><option value="pj">PJ</option>
                <option value="temporario">Temporário</option><option value="estagio">Estágio</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-[var(--color-text-muted)] block mb-1">Status</label>
              <select value={editingJob?.status ?? 'open'} onChange={e => setEditingJob(p => ({ ...p!, status: e.target.value as JobPosting['status'] }))}
                className="w-full bg-[var(--color-bg)] border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                <option value="open">Aberta</option><option value="paused">Pausada</option><option value="closed">Encerrada</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm text-[var(--color-text-muted)] block mb-1">Descrição</label>
            <textarea value={editingJob?.description ?? ''} onChange={e => setEditingJob(p => ({ ...p!, description: e.target.value }))}
              rows={4} className="w-full bg-[var(--color-bg)] border border-white/10 rounded-lg p-3 text-white text-sm resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setJobModal(false)}>Cancelar</Button>
            <Button onClick={saveJob} disabled={saving}>{saving ? <Spinner size="sm" /> : 'Salvar'}</Button>
          </div>
        </div>
      </Modal>

      {/* Company Modal */}
      <Modal open={companyModal} onClose={() => { setCompanyModal(false); setEditingCompany(null) }} title={editingCompany?.id ? 'Editar Empresa' : 'Nova Empresa'}>
        <div className="space-y-3">
          <Input label="Nome da empresa" value={editingCompany?.name ?? ''} onChange={e => setEditingCompany(p => ({ ...p!, name: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="E-mail" value={editingCompany?.email ?? ''} onChange={e => setEditingCompany(p => ({ ...p!, email: e.target.value }))} />
            <Input label="Telefone" value={editingCompany?.phone ?? ''} onChange={e => setEditingCompany(p => ({ ...p!, phone: e.target.value }))} />
            <Input label="Cidade" value={editingCompany?.city ?? ''} onChange={e => setEditingCompany(p => ({ ...p!, city: e.target.value }))} />
            <Input label="Estado" value={editingCompany?.state ?? ''} onChange={e => setEditingCompany(p => ({ ...p!, state: e.target.value }))} />
          </div>
          <Input label="Setor / Indústria" value={editingCompany?.industry ?? ''} onChange={e => setEditingCompany(p => ({ ...p!, industry: e.target.value }))} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setCompanyModal(false)}>Cancelar</Button>
            <Button onClick={saveCompany} disabled={saving}>{saving ? <Spinner size="sm" /> : 'Salvar'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
