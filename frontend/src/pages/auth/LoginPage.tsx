import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, Flame } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { Input, Button } from '@/components/ui'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo de 6 caracteres'),
})

type FormData = z.infer<typeof schema>

function roleToPath(role?: string): string {
  if (role === 'admin') return '/admin'
  if (role === 'instructor') return '/instrutor'
  if (role === 'industrial_client') return '/industrial'
  return '/aluno'
}

export function LoginPage() {
  const { signIn, signInWithGoogle, profile, profileLoading } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

  // Redireciona após profile carregado
  useEffect(() => {
    if (submitted && !profileLoading) {
      navigate(roleToPath(profile?.role), { replace: true })
    }
  }, [submitted, profileLoading, profile, navigate])

  async function onSubmit(data: FormData) {
    setLoading(true)
    try {
      await signIn(data.email, data.password)
      setSubmitted(true)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erro ao entrar')
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
    } catch {
      toast.error('Erro ao entrar com Google')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl mb-4">
            <div className="w-10 h-10 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
              <Flame size={20} className="text-black" />
            </div>
            <span>Welder <span className="text-[var(--color-primary)]">&amp;</span> Fusion</span>
          </Link>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Bem-vindo de volta</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Entre na sua conta para continuar</p>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-[var(--color-border)] rounded-md text-sm text-[var(--color-text)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-surface-elevated)] transition-colors mb-5 disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.96L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
            {googleLoading ? 'Entrando...' : 'Continuar com Google'}
          </button>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--color-border)]" /></div>
            <div className="relative flex justify-center text-xs text-[var(--color-text-muted)] bg-[var(--color-surface)] px-2">ou</div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="E-mail" type="email" placeholder="seu@email.com" leftIcon={<Mail size={16} />} error={errors.email?.message} {...register('email')} />
            <Input label="Senha" type="password" placeholder="••••••••" leftIcon={<Lock size={16} />} error={errors.password?.message} {...register('password')} />
            <div className="flex justify-end">
              <Link to="/recuperar-senha" className="text-xs text-[var(--color-primary)] hover:underline">Esqueci minha senha</Link>
            </div>
            <Button type="submit" loading={loading} className="w-full">Entrar</Button>
          </form>
        </div>

        <p className="text-center text-sm text-[var(--color-text-muted)] mt-4">
          Não tem conta?{' '}
          <Link to="/cadastro" className="text-[var(--color-primary)] hover:underline font-medium">Cadastre-se</Link>
        </p>
      </div>
    </div>
  )
}
