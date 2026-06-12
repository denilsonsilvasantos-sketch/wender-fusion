import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import type { CertificateValidation } from '@/types'
import { Button, Input, Spinner } from '@/components/ui'

export function CertificateValidationPage() {
  const { code } = useParams<{ code?: string }>()
  const navigate = useNavigate()
  const [inputCode, setInputCode] = useState(code ?? '')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CertificateValidation | null>(null)
  const [error, setError] = useState('')

  async function validate(codeToCheck: string) {
    if (!codeToCheck.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await api.get<{ data: CertificateValidation }>(
        `/certificates/validate/${codeToCheck.trim()}`
      )
      setResult(res.data.data)
      navigate(`/validar/${codeToCheck.trim()}`, { replace: true })
    } catch {
      setError('Certificado não encontrado. Verifique o código e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  // Auto-validate if code comes from URL
  useState(() => {
    if (code) validate(code)
  })

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-primary)]/10 mb-4">
            <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Validação de Certificado</h1>
          <p className="text-[var(--color-text-muted)]">
            Digite o código de validação ou escaneie o QR Code do certificado
          </p>
        </div>

        {/* Search form */}
        <div className="bg-[var(--color-surface)] rounded-2xl p-6 mb-6">
          <div className="flex gap-3">
            <Input
              value={inputCode}
              onChange={e => setInputCode(e.target.value)}
              placeholder="Ex.: a1b2c3d4e5f6g7h8"
              onKeyDown={e => e.key === 'Enter' && validate(inputCode)}
              className="flex-1"
            />
            <Button onClick={() => validate(inputCode)} disabled={loading || !inputCode.trim()}>
              {loading ? <Spinner size="sm" /> : 'Validar'}
            </Button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center text-red-400 mb-6">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className={`rounded-2xl p-6 border ${
            result.valid
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="flex items-center gap-3 mb-6">
              {result.valid ? (
                <>
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-green-400 font-semibold">Certificado Válido</p>
                    <p className="text-sm text-[var(--color-text-muted)]">Autenticidade confirmada</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-red-400 font-semibold">Certificado Revogado</p>
                    <p className="text-sm text-[var(--color-text-muted)]">{result.revoked_reason ?? 'Revogado pela instituição'}</p>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-3">
              <InfoRow label="Aluno" value={result.student_name} />
              <InfoRow label="Curso" value={result.course_title} />
              {result.course_hours && (
                <InfoRow label="Carga Horária" value={`${result.course_hours}h`} />
              )}
              <InfoRow label="Emitido em" value={new Date(result.issued_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })} />
              <InfoRow label="Nº do Certificado" value={result.certificate_number} mono />
              <InfoRow label="Código de Validação" value={result.validation_code} mono />
            </div>
          </div>
        )}

        <p className="text-center text-xs text-[var(--color-text-muted)] mt-6">
          Welder & Fusion — Portal de Validação de Certificados
        </p>
      </div>
    </div>
  )
}

function InfoRow({ label, value, mono }: { label: string; value?: string | null; mono?: boolean }) {
  if (!value) return null
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
      <span className="text-sm text-[var(--color-text-muted)]">{label}</span>
      <span className={`text-sm text-white font-medium ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
    </div>
  )
}
