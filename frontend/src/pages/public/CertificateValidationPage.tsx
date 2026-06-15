import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  QrCode, Keyboard, CheckCircle2, XCircle, ShieldCheck, ShieldX,
  User, BookOpen, Clock, Calendar, Hash, ArrowRight, RotateCcw
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button, Spinner } from '@/components/ui'

// ─── Mock data for demo / when Supabase table is not yet seeded ─────────────
const MOCK_CERTS: Record<string, ValidResult> = {
  'WF-2026-001': {
    valid: true, certificate_number: 'WF-2026-001', validation_code: 'WF-2026-001',
    student_name: 'Alexandre Ferreira', course_title: 'Soldagem TIG Avançado',
    course_hours: 160, issued_at: '2026-06-10T12:00:00Z', revoked: false,
  },
  'WF-2026-002': {
    valid: true, certificate_number: 'WF-2026-002', validation_code: 'WF-2026-002',
    student_name: 'Diego Santos', course_title: 'Soldagem MIG/MAG Industrial',
    course_hours: 120, issued_at: '2026-06-12T12:00:00Z', revoked: false,
  },
  'WF-2026-003': {
    valid: true, certificate_number: 'WF-2026-003', validation_code: 'WF-2026-003',
    student_name: 'João Pedro Silva', course_title: 'Soldagem TIG Avançado',
    course_hours: 160, issued_at: '2026-06-10T12:00:00Z', revoked: false,
  },
  'WF-2026-REV': {
    valid: false, certificate_number: 'WF-2026-REV', validation_code: 'WF-2026-REV',
    student_name: 'Carlos Mendes', course_title: 'Soldagem TIG Avançado',
    course_hours: 160, issued_at: '2026-06-10T12:00:00Z',
    revoked: true, revoked_reason: 'Frequência mínima não atingida (70% < 75%)',
  },
}

interface ValidResult {
  valid: boolean
  certificate_number: string
  validation_code: string
  student_name?: string
  course_title?: string
  course_hours?: number
  issued_at: string
  revoked: boolean
  revoked_reason?: string
}

async function fetchCertificate(code: string): Promise<ValidResult | null> {
  const normalized = code.trim().toUpperCase()

  // Try Supabase first
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select(`
        certificate_number, validation_code, issued_at, revoked, revoked_reason,
        course:course_id ( title, duration_hours ),
        student:student_id ( name )
      `)
      .or(`validation_code.eq.${normalized},certificate_number.eq.${normalized}`)
      .single()

    if (!error && data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const d = data as any
      return {
        valid: !d.revoked,
        certificate_number: d.certificate_number,
        validation_code: d.validation_code,
        student_name: d.student?.name,
        course_title: d.course?.title,
        course_hours: d.course?.duration_hours,
        issued_at: d.issued_at,
        revoked: d.revoked,
        revoked_reason: d.revoked_reason,
      }
    }
  } catch {
    // Supabase unavailable — fall through to mock
  }

  // Mock fallback
  return MOCK_CERTS[normalized] ?? null
}

// ─── Main component ──────────────────────────────────────────────────────────

export function CertificateValidationPage() {
  const { code: urlCode } = useParams<{ code?: string }>()
  const navigate = useNavigate()

  const [inputCode, setInputCode] = useState(urlCode ?? '')
  const [loading,   setLoading]   = useState(false)
  const [result,    setResult]    = useState<ValidResult | null>(null)
  const [notFound,  setNotFound]  = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-validate when arriving from a QR code URL
  useEffect(() => {
    if (urlCode) {
      setInputCode(urlCode)
      runValidation(urlCode)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlCode])

  async function runValidation(code: string) {
    const trimmed = code.trim()
    if (!trimmed) return
    setLoading(true)
    setResult(null)
    setNotFound(false)
    const cert = await fetchCertificate(trimmed)
    if (cert) {
      setResult(cert)
      navigate(`/validar/${trimmed.toUpperCase()}`, { replace: true })
    } else {
      setNotFound(true)
    }
    setLoading(false)
  }

  function reset() {
    setResult(null)
    setNotFound(false)
    setInputCode('')
    navigate('/validar', { replace: true })
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const showForm = !result && !loading

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#111111' }}>

      {/* ── Header strip ── */}
      <div className="w-full py-4 px-4 border-b flex items-center justify-between"
        style={{ background: '#1A1A1A', borderColor: '#ffffff0d' }}>
        <a href="/" className="text-sm font-black" style={{ color: '#FF8C00' }}>Welder &amp; Fusion</a>
        <span className="text-xs" style={{ color: '#ffffff60' }}>Portal de Validação</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg">

          {/* ── Loading ── */}
          {loading && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
                style={{ background: '#FF8C0015' }}>
                <Spinner size="lg" />
              </div>
              <p className="text-white font-semibold">Verificando certificado…</p>
              <p className="text-sm" style={{ color: '#ffffff60' }}>Consultando base de dados segura</p>
            </div>
          )}

          {/* ── RESULT: VÁLIDO ── */}
          {result && result.valid && (
            <ValidCard result={result} onReset={reset} />
          )}

          {/* ── RESULT: INVÁLIDO / REVOGADO ── */}
          {result && !result.valid && (
            <InvalidCard result={result} onReset={reset} />
          )}

          {/* ── NOT FOUND ── */}
          {notFound && !loading && (
            <div className="space-y-6">
              <div className="rounded-2xl p-8 text-center border"
                style={{ background: '#1a0a0a', borderColor: '#EF444440' }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: '#EF444415' }}>
                  <ShieldX size={32} style={{ color: '#EF4444' }} />
                </div>
                <p className="text-xl font-black mb-2" style={{ color: '#EF4444' }}>Certificado não encontrado</p>
                <p className="text-sm mb-1" style={{ color: '#ffffff80' }}>
                  O código <span className="font-mono font-bold text-white">{inputCode.toUpperCase()}</span> não existe na nossa base de dados.
                </p>
                <p className="text-xs" style={{ color: '#ffffff50' }}>Verifique se o código foi digitado corretamente.</p>
              </div>
              <button onClick={reset} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors hover:bg-white/5"
                style={{ color: '#FF8C00', border: '1px solid #FF8C0030' }}>
                <RotateCcw size={15} /> Tentar outro código
              </button>
            </div>
          )}

          {/* ── INPUT FORM ── */}
          {showForm && (
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: '#FF8C0015', border: '1.5px solid #FF8C0030' }}>
                  <ShieldCheck size={32} style={{ color: '#FF8C00' }} />
                </div>
                <h1 className="text-3xl font-black text-white mb-2">Validar Certificado</h1>
                <p className="text-sm" style={{ color: '#ffffff80' }}>
                  Confirme a autenticidade de um certificado emitido pela Welder &amp; Fusion
                </p>
              </div>

              {/* Como validar */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl p-4 border text-center"
                  style={{ background: '#1A1A1A', borderColor: '#FF8C0020' }}>
                  <QrCode size={22} className="mx-auto mb-2" style={{ color: '#FF8C00' }} />
                  <p className="text-xs font-semibold text-white mb-1">Com celular</p>
                  <p className="text-xs leading-relaxed" style={{ color: '#ffffff60' }}>
                    Aponte a câmera para o QR Code no certificado. O link abre automaticamente.
                  </p>
                </div>
                <div className="rounded-xl p-4 border text-center"
                  style={{ background: '#1A1A1A', borderColor: '#ffffff10' }}>
                  <Keyboard size={22} className="mx-auto mb-2" style={{ color: '#FF8C00' }} />
                  <p className="text-xs font-semibold text-white mb-1">No computador</p>
                  <p className="text-xs leading-relaxed" style={{ color: '#ffffff60' }}>
                    Digite o código de validação impresso no certificado abaixo.
                  </p>
                </div>
              </div>

              {/* Input */}
              <div className="rounded-2xl p-6 space-y-4"
                style={{ background: '#1A1A1A', border: '1px solid #ffffff0d' }}>
                <label className="block text-sm font-semibold text-white">
                  Código de validação
                </label>
                <input
                  ref={inputRef}
                  value={inputCode}
                  onChange={e => setInputCode(e.target.value.toUpperCase())}
                  placeholder="Ex.: WF-2026-001"
                  onKeyDown={e => e.key === 'Enter' && runValidation(inputCode)}
                  className="w-full px-4 py-3 rounded-xl font-mono text-center text-lg border bg-transparent text-white placeholder-white/30 focus:outline-none focus:border-[#FF8C00] transition-colors"
                  style={{ borderColor: '#ffffff20' }}
                />
                <Button
                  onClick={() => runValidation(inputCode)}
                  disabled={!inputCode.trim()}
                  className="w-full"
                  rightIcon={<ArrowRight size={16} />}
                >
                  Verificar autenticidade
                </Button>
              </div>

              <p className="text-center text-xs" style={{ color: '#ffffff30' }}>
                Welder &amp; Fusion · Sistema de Validação de Certificados · Seguro e gratuito
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Card: Certificado VÁLIDO ────────────────────────────────────────────────

function ValidCard({ result, onReset }: { result: ValidResult; onReset: () => void }) {
  const issued = new Date(result.issued_at)
  return (
    <div className="space-y-4">
      {/* Stamp */}
      <div className="rounded-2xl p-8 text-center border relative overflow-hidden"
        style={{ background: '#061a0f', borderColor: '#10B98150' }}>
        {/* glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, #10B98112 0%, transparent 70%)' }} />
        <div className="relative">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: '#10B98120', border: '2px solid #10B98160' }}>
            <ShieldCheck size={36} style={{ color: '#10B981' }} />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3"
            style={{ background: '#10B98120', border: '1px solid #10B98140' }}>
            <CheckCircle2 size={14} style={{ color: '#10B981' }} />
            <span className="text-sm font-bold uppercase tracking-wider" style={{ color: '#10B981' }}>Certificado Válido</span>
          </div>
          <p className="text-xs" style={{ color: '#10B98180' }}>Autenticidade confirmada · Welder &amp; Fusion</p>
        </div>
      </div>

      {/* Details */}
      <div className="rounded-2xl border overflow-hidden"
        style={{ background: '#1A1A1A', borderColor: '#ffffff0d' }}>
        <div className="px-5 py-3 border-b" style={{ borderColor: '#ffffff0d', background: '#242424' }}>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#ffffff50' }}>Dados do Certificado</p>
        </div>
        <div className="p-5 space-y-3">
          <DetailRow icon={User}     label="Titular"         value={result.student_name}   highlight />
          <DetailRow icon={BookOpen} label="Curso"           value={result.course_title} />
          {result.course_hours && (
            <DetailRow icon={Clock}   label="Carga Horária"  value={`${result.course_hours}h`} />
          )}
          <DetailRow icon={Calendar} label="Data de emissão" value={issued.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })} />
          <DetailRow icon={Hash}     label="Nº do certificado" value={result.certificate_number} mono />
        </div>
      </div>

      <button onClick={onReset}
        className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors hover:bg-white/5"
        style={{ color: '#ffffff60', border: '1px solid #ffffff10' }}>
        <RotateCcw size={14} /> Validar outro certificado
      </button>
    </div>
  )
}

// ─── Card: Certificado REVOGADO / INVÁLIDO ───────────────────────────────────

function InvalidCard({ result, onReset }: { result: ValidResult; onReset: () => void }) {
  const issued = new Date(result.issued_at)
  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-8 text-center border relative overflow-hidden"
        style={{ background: '#1a0505', borderColor: '#EF444450' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, #EF444410 0%, transparent 70%)' }} />
        <div className="relative">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: '#EF444420', border: '2px solid #EF444460' }}>
            <ShieldX size={36} style={{ color: '#EF4444' }} />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3"
            style={{ background: '#EF444420', border: '1px solid #EF444440' }}>
            <XCircle size={14} style={{ color: '#EF4444' }} />
            <span className="text-sm font-bold uppercase tracking-wider" style={{ color: '#EF4444' }}>Certificado Revogado</span>
          </div>
          {result.revoked_reason && (
            <p className="text-xs" style={{ color: '#EF444480' }}>{result.revoked_reason}</p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border overflow-hidden"
        style={{ background: '#1A1A1A', borderColor: '#ffffff0d' }}>
        <div className="px-5 py-3 border-b" style={{ borderColor: '#ffffff0d', background: '#242424' }}>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#ffffff50' }}>Dados do Certificado</p>
        </div>
        <div className="p-5 space-y-3">
          <DetailRow icon={User}     label="Titular"          value={result.student_name} />
          <DetailRow icon={BookOpen} label="Curso"            value={result.course_title} />
          <DetailRow icon={Calendar} label="Data de emissão"  value={issued.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })} />
          <DetailRow icon={Hash}     label="Nº do certificado" value={result.certificate_number} mono />
        </div>
      </div>

      <button onClick={onReset}
        className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors hover:bg-white/5"
        style={{ color: '#ffffff60', border: '1px solid #ffffff10' }}>
        <RotateCcw size={14} /> Validar outro certificado
      </button>
    </div>
  )
}

// ─── Detail row ──────────────────────────────────────────────────────────────

function DetailRow({ icon: Icon, label, value, mono, highlight }: {
  icon: typeof User; label: string; value?: string | null; mono?: boolean; highlight?: boolean
}) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-2 border-b last:border-0" style={{ borderColor: '#ffffff08' }}>
      <Icon size={15} className="flex-shrink-0 mt-0.5" style={{ color: '#FF8C0070' }} />
      <span className="text-sm flex-shrink-0 w-32" style={{ color: '#ffffff50' }}>{label}</span>
      <span className={`text-sm flex-1 text-right font-medium ${mono ? 'font-mono text-xs' : ''} ${highlight ? 'text-white font-bold' : 'text-white'}`}>
        {value}
      </span>
    </div>
  )
}
