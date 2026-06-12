import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Flame, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { Input, Button } from '@/components/ui'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    setLoading(false)
    if (error) { toast.error(error.message); return }
    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl mb-4">
            <div className="w-10 h-10 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
              <Flame size={20} className="text-black" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Recuperar senha</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {sent ? 'E-mail enviado com sucesso!' : 'Informe seu e-mail para receber o link de redefinição'}
          </p>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} className="text-green-400" />
              </div>
              <p className="text-sm text-[var(--color-text-secondary)]">Verifique sua caixa de entrada e clique no link recebido.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="E-mail"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail size={16} />}
              />
              <Button type="submit" loading={loading} className="w-full">Enviar Link</Button>
            </form>
          )}
        </div>

        <p className="text-center mt-4">
          <Link to="/login" className="inline-flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline">
            <ArrowLeft size={14} />Voltar ao login
          </Link>
        </p>
      </div>
    </div>
  )
}
