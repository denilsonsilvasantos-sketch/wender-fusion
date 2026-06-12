import { useEffect, useState } from 'react'
import { Award, Plus, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import type { Certificate } from '@/types'
import { Button, Card, Badge, Spinner } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import api from '@/lib/api'

export function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState<string | null>(null)

  async function load() {
    const { data } = await supabase.from('certificates').select('*, student:user_profiles(name), course:courses(title)').order('issued_at', { ascending: false })
    setCertificates((data || []) as Certificate[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function revoke(id: string) {
    if (!confirm('Revogar este certificado?')) return
    await supabase.from('certificates').update({ revoked: true, revoked_at: new Date().toISOString() }).eq('id', id)
    setCertificates((prev) => prev.map((c) => c.id === id ? { ...c, revoked: true } : c))
    toast.success('Certificado revogado')
  }

  async function generateForAll() {
    setGenerating('all')
    try {
      const { data } = await api.post('/certificates/generate-eligible')
      toast.success(`${data.count} certificado(s) gerado(s)!`)
      load()
    } catch { toast.error('Erro ao gerar certificados') } finally { setGenerating(null) }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-[var(--color-text)]">Certificados</h1>
        <Button onClick={generateForAll} loading={generating === 'all'} leftIcon={<Plus size={16} />}>
          Gerar Elegíveis
        </Button>
      </div>

      <Card noPadding>
        {certificates.length === 0 ? (
          <div className="text-center py-12">
            <Award size={40} className="text-[var(--color-text-muted)] mx-auto mb-3" />
            <p className="text-[var(--color-text-muted)]">Nenhum certificado emitido ainda</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {certificates.map((c) => (
              <div key={c.id} className="flex items-center gap-4 px-5 py-4">
                <Award size={20} className={c.revoked ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-primary)]'} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text)]">{(c as any).student?.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{(c as any).course?.title} • {c.certificate_number}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">Emitido: {formatDate(c.issued_at)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {c.revoked ? <Badge variant="danger">Revogado</Badge> : <Badge variant="success">Válido</Badge>}
                  {!c.revoked && (
                    <button onClick={() => revoke(c.id)} className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors">
                      <XCircle size={15} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
