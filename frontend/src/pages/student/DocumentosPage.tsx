import { useState } from 'react'
import { FileText, Download, Upload, CheckCircle, Clock } from 'lucide-react'
import { Card } from '@/components/ui'

const COLOR = '#64748B'

const DOCUMENTOS_ESCOLA = [
  { id: 1, nome: 'Contrato de matrícula',               status: 'ok',      data: '05/05/2026', tipo: 'pdf' },
  { id: 2, nome: 'Declaração de matrícula',              status: 'ok',      data: '05/05/2026', tipo: 'pdf' },
  { id: 3, nome: 'Declaração de frequência',             status: 'ok',      data: '01/06/2026', tipo: 'pdf' },
  { id: 4, nome: 'Histórico de pagamentos',              status: 'ok',      data: '01/06/2026', tipo: 'pdf' },
  { id: 5, nome: 'Certificado de conclusão — SMAW',      status: 'ok',      data: '20/12/2025', tipo: 'pdf' },
]

const DOCUMENTOS_PESSOAIS = [
  { id: 10, nome: 'CPF',                                  status: 'ok',       data: '05/05/2026' },
  { id: 11, nome: 'RG / CNH',                             status: 'ok',       data: '05/05/2026' },
  { id: 12, nome: 'Comprovante de residência',             status: 'pendente', data: null },
  { id: 13, nome: 'Foto 3×4',                             status: 'pendente', data: null },
]

const STATUS_CFG = {
  ok:       { label: 'Enviado',  icon: CheckCircle, color: '#10B981' },
  pendente: { label: 'Pendente', icon: Clock,       color: '#F59E0B' },
}

export function DocumentosPage() {
  const [uploading, setUploading] = useState<number | null>(null)

  function fakeUpload(id: number) {
    setUploading(id)
    setTimeout(() => setUploading(null), 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Documentos</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Documentos da escola e da sua matrícula</p>
      </div>

      {/* Documentos da escola */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-3">
          Documentos escolares
        </h2>
        <div className="space-y-2">
          {DOCUMENTOS_ESCOLA.map(d => (
            <Card key={d.id}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: '#10B981' + '15' }}>
                  <FileText size={16} style={{ color: '#10B981' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text)] truncate">{d.nome}</p>
                  {d.data && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Disponível desde {d.data}</p>}
                </div>
                <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0"
                  style={{ background: '#10B981' + '15', color: '#10B981' }}>
                  <Download size={13} />Baixar
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Documentos pessoais */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-3">
          Documentos pessoais
        </h2>
        <div className="space-y-2">
          {DOCUMENTOS_PESSOAIS.map(d => {
            const cfg  = STATUS_CFG[d.status as keyof typeof STATUS_CFG]
            const Icon = cfg.icon
            const isLoading = uploading === d.id
            return (
              <Card key={d.id}>
                <div className="flex items-center gap-3">
                  <Icon size={18} style={{ color: cfg.color }} className="flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text)]">{d.nome}</p>
                    {d.data
                      ? <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Enviado em {d.data}</p>
                      : <p className="text-xs mt-0.5" style={{ color: '#F59E0B' }}>Envio pendente</p>}
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: cfg.color + '15', color: cfg.color }}>{cfg.label}</span>
                  {d.status === 'pendente' && (
                    <button onClick={() => fakeUpload(d.id)} disabled={isLoading}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0"
                      style={{ background: COLOR + '15', color: COLOR }}>
                      <Upload size={13} />{isLoading ? 'Enviando…' : 'Enviar'}
                    </button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
