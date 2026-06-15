import { useEffect, useState } from 'react'
import { Star, Building2, User } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Card, Spinner } from '@/components/ui'

const COLOR = '#10B981'

interface Recomendacao {
  id: string; empresa: string; cargo: string; status: string; texto?: string; sent_at?: string
  instructor: { name: string }
}

const MOCK: Recomendacao[] = [
  {
    id: '1', empresa: 'Metalúrgica Ferro & Cia', cargo: 'Soldador TIG Senior',
    status: 'aceita', sent_at: '2026-06-01',
    texto: 'O aluno demonstrou excelente domínio da soldagem TIG, com destaque para posições difíceis e acabamento em inox. Recomendo com grande satisfação.',
    instructor: { name: 'Prof. Carlos Menezes' },
  },
  {
    id: '2', empresa: 'Petroquímica Delta', cargo: 'Inspetor de Soldagem',
    status: 'enviada', sent_at: '2026-06-08', texto: null as unknown as string,
    instructor: { name: 'Prof. Carlos Menezes' },
  },
]

const STATUS_CFG = {
  rascunho: { label: 'Rascunho', color: '#64748B' },
  enviada:  { label: 'Enviada',  color: '#F59E0B' },
  aceita:   { label: 'Aceita',   color: '#10B981' },
}

export function RecomendacoesPage() {
  const { profile } = useAuth()
  const [list,    setList]    = useState<Recomendacao[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    supabase.from('instructor_recommendations')
      .select('id, empresa, cargo, status, texto, sent_at, instructor:user_profiles!instructor_id(name)')
      .eq('student_id', profile.id)
      .neq('status', 'rascunho')
      .order('sent_at', { ascending: false })
      .then(({ data }) => {
        setList((data as unknown as Recomendacao[])?.length ? (data as unknown as Recomendacao[]) : MOCK)
        setLoading(false)
      })
  }, [profile])

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Recomendações</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Cartas de recomendação dos seus instrutores</p>
      </div>

      {list.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Star size={36} className="mx-auto mb-3 text-[var(--color-text-muted)]" />
            <p className="font-semibold text-[var(--color-text)]">Nenhuma recomendação ainda</p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              Seu instrutor pode enviar recomendações para empresas parceiras.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {list.map(r => {
            const cfg = STATUS_CFG[r.status as keyof typeof STATUS_CFG] ?? STATUS_CFG.enviada
            return (
              <Card key={r.id}>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: COLOR + '15' }}>
                    <Star size={17} style={{ color: COLOR }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-[var(--color-text)]">{r.cargo}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: cfg.color + '15', color: cfg.color }}>{cfg.label}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-xs text-[var(--color-text-muted)] mt-1">
                      <span className="flex items-center gap-1"><Building2 size={11} />{r.empresa}</span>
                      <span className="flex items-center gap-1"><User size={11} />{r.instructor?.name}</span>
                      {r.sent_at && <span>{new Date(r.sent_at).toLocaleDateString('pt-BR')}</span>}
                    </div>
                  </div>
                </div>
                {r.texto ? (
                  <blockquote className="border-l-2 pl-4 text-sm text-[var(--color-text-muted)] italic"
                    style={{ borderColor: COLOR }}>
                    "{r.texto}"
                  </blockquote>
                ) : (
                  <p className="text-xs text-[var(--color-text-muted)] italic">
                    Carta enviada ao RH da empresa — texto disponível somente para o instrutor.
                  </p>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
