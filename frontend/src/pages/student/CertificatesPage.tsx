import { useEffect, useState } from 'react'
import { Award, Download, ExternalLink } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import type { Certificate } from '@/types'
import { Card, Badge, Spinner } from '@/components/ui'
import { formatDate } from '@/lib/utils'

export function CertificatesPage() {
  const { profile } = useAuth()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    supabase
      .from('certificates')
      .select('*, course:courses(title)')
      .eq('student_id', profile.id)
      .order('issued_at', { ascending: false })
      .then(({ data }) => {
        setCertificates((data || []) as Certificate[])
        setLoading(false)
      })
  }, [profile])

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)] flex items-center gap-2">
          <Award size={28} className="text-[var(--color-primary)]" />
          Meus Certificados
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">{certificates.length} certificado{certificates.length !== 1 ? 's' : ''} emitido{certificates.length !== 1 ? 's' : ''}</p>
      </div>

      {certificates.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Award size={48} className="text-[var(--color-text-muted)] mx-auto mb-3" />
            <p className="text-[var(--color-text-secondary)] font-medium">Nenhum certificado ainda</p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">Complete um curso para receber seu certificado</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map((cert) => (
            <div key={cert.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 hover:border-[var(--color-primary)]/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[var(--color-primary-light)] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award size={24} className="text-[var(--color-primary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--color-text)] truncate">{(cert.course as any)?.title}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Nº: {cert.certificate_number}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">Emitido em {formatDate(cert.issued_at)}</p>
                  {cert.revoked && <Badge variant="danger" className="mt-1">Revogado</Badge>}
                </div>
              </div>
              {cert.pdf_url && !cert.revoked && (
                <div className="flex gap-2 mt-4">
                  <a href={cert.pdf_url} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs bg-[var(--color-surface-elevated)] hover:bg-[var(--color-surface-high)] rounded-lg text-[var(--color-text-secondary)] transition-colors">
                    <ExternalLink size={13} /> Visualizar
                  </a>
                  <a href={cert.pdf_url} download className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs bg-[var(--color-primary-light)] hover:bg-[var(--color-primary)]/20 rounded-lg text-[var(--color-primary)] transition-colors">
                    <Download size={13} /> Baixar PDF
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
