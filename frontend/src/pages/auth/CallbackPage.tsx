import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Spinner } from '@/components/ui'

export function CallbackPage() {
  const { profile, profileLoading, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Aguarda user autenticado e profile carregado
    if (!profileLoading && user) {
      const role = profile?.role
      if (role === 'admin') navigate('/admin', { replace: true })
      else if (role === 'instructor') navigate('/instrutor', { replace: true })
      else if (role === 'industrial_client') navigate('/industrial', { replace: true })
      else navigate('/aluno', { replace: true })
    }
  }, [profileLoading, user, profile, navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[var(--color-bg)]">
      <Spinner size="lg" />
      <p className="text-sm text-[var(--color-text-muted)]">Redirecionando...</p>
    </div>
  )
}
