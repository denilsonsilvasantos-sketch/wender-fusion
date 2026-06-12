import { useEffect, useState } from 'react'
import api from '@/lib/api'
import type { JobPosting, JobApplication } from '@/types'
import { Badge, Button, Modal, Spinner } from '@/components/ui'

const jobTypeLabel: Record<string, string> = {
  clt: 'CLT', pj: 'PJ', temporario: 'Temporário', estagio: 'Estágio',
}
const modalityLabel: Record<string, string> = {
  presencial: 'Presencial', remoto: 'Remoto', hibrido: 'Híbrido',
}
const levelLabel: Record<string, string> = {
  junior: 'Júnior', pleno: 'Pleno', senior: 'Sênior', especialista: 'Especialista',
}

export function JobsPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [myApplications, setMyApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<JobPosting | null>(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [applying, setApplying] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    Promise.all([
      api.get<{ data: JobPosting[] }>('/empregabilidade/jobs'),
      api.get<{ data: JobApplication[] }>('/empregabilidade/applications/my'),
    ]).then(([jobsRes, appsRes]) => {
      setJobs(jobsRes.data.data ?? [])
      setMyApplications(appsRes.data.data ?? [])
    }).finally(() => setLoading(false))
  }, [])

  function hasApplied(jobId: string) {
    return myApplications.some(a => a.job_id === jobId)
  }

  async function apply() {
    if (!selected) return
    setApplying(true)
    try {
      await api.post(`/empregabilidade/jobs/${selected.id}/apply`, { cover_letter: coverLetter })
      setMyApplications(prev => [...prev, { job_id: selected.id } as JobApplication])
      setSuccessMsg('Candidatura enviada com sucesso!')
      setSelected(null)
      setCoverLetter('')
    } finally {
      setApplying(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Vagas de Emprego</h1>
        <p className="text-[var(--color-text-muted)] mt-1">
          Oportunidades das nossas empresas parceiras
        </p>
      </div>

      {successMsg && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-green-400 text-sm">
          {successMsg}
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="text-center py-16 text-[var(--color-text-muted)]">
          Nenhuma vaga disponível no momento.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {jobs.map(job => (
            <div key={job.id} className="bg-[var(--color-surface)] rounded-xl p-5 border border-white/5 hover:border-[var(--color-primary)]/30 transition-colors">
              {job.company?.logo_url && (
                <img src={job.company.logo_url} alt={job.company.name} className="h-8 object-contain mb-3" />
              )}
              <h3 className="text-white font-semibold mb-1">{job.title}</h3>
              <p className="text-[var(--color-text-muted)] text-sm mb-3">
                {job.company?.name} — {job.company?.city}/{job.company?.state}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {job.job_type && <Badge variant="default">{jobTypeLabel[job.job_type]}</Badge>}
                {job.modality && <Badge variant="info">{modalityLabel[job.modality]}</Badge>}
                {job.level && <Badge variant="warning">{levelLabel[job.level]}</Badge>}
              </div>

              {(job.salary_min || job.salary_max) && (
                <p className="text-[var(--color-primary)] text-sm font-medium mb-3">
                  {job.salary_min && job.salary_max
                    ? `R$ ${job.salary_min.toLocaleString('pt-BR')} – ${job.salary_max.toLocaleString('pt-BR')}`
                    : job.salary_min
                    ? `A partir de R$ ${job.salary_min.toLocaleString('pt-BR')}`
                    : `Até R$ ${job.salary_max!.toLocaleString('pt-BR')}`}
                </p>
              )}

              {hasApplied(job.id) ? (
                <Badge variant="success">Candidatura enviada</Badge>
              ) : (
                <Button size="sm" onClick={() => { setSelected(job); setSuccessMsg('') }}>
                  Candidatar-se
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!selected}
        onClose={() => { setSelected(null); setCoverLetter('') }}
        title={`Candidatura — ${selected?.title}`}
      >
        <div className="space-y-4">
          <p className="text-[var(--color-text-muted)] text-sm">
            Empresa: <span className="text-white">{selected?.company?.name}</span>
          </p>
          <div>
            <label className="block text-sm text-[var(--color-text-muted)] mb-1">
              Carta de apresentação (opcional)
            </label>
            <textarea
              value={coverLetter}
              onChange={e => setCoverLetter(e.target.value)}
              rows={5}
              placeholder="Apresente-se e destaque seus diferenciais..."
              className="w-full bg-[var(--color-bg)] border border-white/10 rounded-lg p-3 text-white text-sm resize-none focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setSelected(null)}>Cancelar</Button>
            <Button onClick={apply} disabled={applying}>
              {applying ? <Spinner size="sm" /> : 'Enviar Candidatura'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
