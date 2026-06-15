import { useEffect, useState } from 'react'
import { Award, Download, ExternalLink, QrCode } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Card, Spinner } from '@/components/ui'

const COLOR = '#6366F1'

interface Certificate {
  id: string; certificate_number: string; validation_code: string
  issued_at: string; revoked: boolean
  course: { title: string; duration_hours: number }
}

const MOCK: Certificate[] = [
  {
    id: '1', certificate_number: 'WF-2026-001', validation_code: 'WF-2026-001',
    issued_at: '2026-03-15', revoked: false,
    course: { title: 'Soldagem TIG — Fundamentos', duration_hours: 160 },
  },
]

export function CertificadosPage() {
  const { profile } = useAuth()
  const [list, setList]       = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    supabase.from('certificates')
      .select('id, certificate_number, validation_code, issued_at, revoked, course:courses(title,duration_hours)')
      .eq('student_id', profile.id)
      .order('issued_at', { ascending: false })
      .then(({ data }) => {
        setList((data as unknown as Certificate[])?.length ? (data as unknown as Certificate[]) : MOCK)
        setLoading(false)
      })
  }, [profile])

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  const validos = list.filter(c => !c.revoked)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Meus Certificados</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Certificados emitidos pelos cursos concluídos</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Válidos',    value: validos.length,                color: '#10B981' },
          { label: 'Total',      value: list.length,                   color: COLOR     },
        ].map(s => (
          <Card key={s.label}>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      {list.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Award size={40} className="mx-auto mb-3 text-[var(--color-text-muted)]" />
            <p className="font-semibold text-[var(--color-text)]">Nenhum certificado ainda</p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              Conclua um curso para receber seu certificado.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {list.map(c => {
            const validationUrl = `${window.location.origin}/validar/${c.validation_code}`
            return (
              <div key={c.id} className="rounded-2xl border overflow-hidden"
                style={{ borderColor: c.revoked ? '#EF444430' : '#10B98130', background: 'var(--color-surface)' }}>
                {/* Header */}
                <div className="px-5 py-4 flex items-center gap-3"
                  style={{ background: (c.revoked ? '#EF4444' : '#10B981') + '12' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: (c.revoked ? '#EF4444' : '#10B981') + '20' }}>
                    <Award size={20} style={{ color: c.revoked ? '#EF4444' : '#10B981' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[var(--color-text)] truncate">{c.course?.title}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {c.course?.duration_hours}h · Emitido em {new Date(c.issued_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  {c.revoked
                    ? <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-500 flex-shrink-0">Revogado</span>
                    : <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 flex-shrink-0">Válido</span>}
                </div>

                {/* Body */}
                <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 text-sm">
                    {[
                      { label: 'Número',          value: c.certificate_number },
                      { label: 'Código de validação', value: c.validation_code },
                    ].map(r => (
                      <div key={r.label}>
                        <p className="text-xs text-[var(--color-text-muted)]">{r.label}</p>
                        <p className="font-mono font-bold text-[var(--color-text)]">{r.value}</p>
                      </div>
                    ))}
                    <div>
                      <p className="text-xs text-[var(--color-text-muted)] mb-1">Link de validação</p>
                      <a href={validationUrl} target="_blank" rel="noopener noreferrer"
                        className="text-xs flex items-center gap-1 break-all"
                        style={{ color: COLOR }}>
                        <ExternalLink size={11} className="flex-shrink-0" />
                        {validationUrl}
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-24 h-24 rounded-xl border-2 flex items-center justify-center"
                      style={{ borderColor: 'var(--color-border)' }}>
                      <QrCode size={40} style={{ color: c.revoked ? '#EF4444' : COLOR }} />
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] text-center">
                      Aponte a câmera do celular para validar
                    </p>
                  </div>
                </div>

                {/* Footer */}
                {!c.revoked && (
                  <div className="px-5 py-3 border-t flex gap-3"
                    style={{ borderColor: 'var(--color-border)' }}>
                    <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
                      style={{ background: '#10B981' + '15', color: '#10B981' }}>
                      <Download size={13} />Baixar PDF
                    </button>
                    <a href={validationUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
                      style={{ background: COLOR + '15', color: COLOR }}>
                      <ExternalLink size={13} />Validar online
                    </a>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
