import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen, Award, Trophy, Clock, ArrowRight, TrendingUp, Briefcase,
  AlertTriangle, CheckCircle, Calendar, ChevronRight, Flame, Star,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Card, Badge, Spinner } from '@/components/ui'
import type { Enrollment, Certificate, Payment } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'

const COLOR = '#6366F1'

// Level system
const LEVELS = [
  { nome: 'Iniciante',      min: 0,    max: 99,   color: '#64748B' },
  { nome: 'Aprendiz',       min: 100,  max: 299,  color: '#3B82F6' },
  { nome: 'Operador',       min: 300,  max: 599,  color: '#10B981' },
  { nome: 'Soldador',       min: 600,  max: 999,  color: '#F59E0B' },
  { nome: 'Especialista',   min: 1000, max: 1999, color: '#FF8C00' },
  { nome: 'Mestre Soldador',min: 2000, max: 9999, color: '#8B5CF6' },
]

function getLevel(pts: number) {
  return [...LEVELS].reverse().find(l => pts >= l.min) ?? LEVELS[0]
}

const MOCK_PROXIMAS = [
  { id: 1, hora: '08:00', turma: 'Turma A — TIG', local: 'Lab 1', data: 'Hoje' },
  { id: 2, hora: '13:00', turma: 'Turma A — TIG', local: 'Lab 1', data: 'Amanhã' },
]

const MOCK_AVISOS = [
  { id: 1, tipo: 'warn' as const, texto: 'Sua frequência está em 78%. Mínimo obrigatório: 75%.' },
  { id: 2, tipo: 'ok' as const,   texto: 'Avaliação prática agendada para próxima semana.' },
  { id: 3, tipo: 'info' as const, texto: 'Novas apostilas de soldagem TIG disponíveis.' },
]

const MOCK_VAGAS = [
  { id: 1, empresa: 'Metalúrgica Scherer', cargo: 'Soldador TIG', cidade: 'Itajaí, SC', salario: 'R$ 3.200–4.000' },
  { id: 2, empresa: 'Estaleiro Navship',   cargo: 'Soldador MIG/MAG', cidade: 'Navegantes, SC', salario: 'R$ 3.500–4.500' },
]

export function StudentDashboardPage() {
  const { profile } = useAuth()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [pendingPayments, setPendingPayments] = useState<Payment[]>([])
  const [points, setPoints] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    async function load() {
      const [{ data: enr }, { data: certs }, { data: pays }, { data: pts }] = await Promise.all([
        supabase.from('enrollments').select('*, course:courses(id,title,thumbnail_url,duration_hours)').eq('student_id', profile!.id).order('enrolled_at', { ascending: false }).limit(5),
        supabase.from('certificates').select('*, course:courses(title)').eq('student_id', profile!.id).eq('revoked', false),
        supabase.from('payments').select('*').eq('student_id', profile!.id).in('status', ['pending', 'overdue']),
        supabase.rpc('get_student_points', { p_student_id: profile!.id }),
      ])
      setEnrollments((enr || []) as Enrollment[])
      setCertificates((certs || []) as Certificate[])
      setPendingPayments((pays || []) as Payment[])
      setPoints(pts || 0)
      setLoading(false)
    }
    load()
  }, [profile])

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  const nivel = getLevel(points)
  const nextLevel = LEVELS[LEVELS.indexOf(nivel) + 1]
  const xpPct = nextLevel ? Math.round(((points - nivel.min) / (nivel.max - nivel.min)) * 100) : 100
  const nome = profile?.name?.split(' ')[0] ?? 'Aluno'
  const activeEnrollments = enrollments.filter(e => e.status === 'active')

  return (
    <div className="space-y-8">

      {/* ── Hero greeting ──────────────────────────────────────────── */}
      <div className="rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-5"
        style={{ background: `linear-gradient(135deg, ${COLOR}18 0%, #10B98110 100%)`, border: `1px solid ${COLOR}25` }}>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: nivel.color + '20', color: nivel.color }}>
              ⚡ {nivel.nome}
            </span>
          </div>
          <h1 className="text-2xl font-black text-[var(--color-text)] mb-0.5">Olá, {nome}! 👋</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Continue evoluindo na sua jornada profissional</p>
        </div>
        {/* XP bar */}
        <div className="sm:w-56 flex-shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold" style={{ color: nivel.color }}>{points.toLocaleString()} XP</span>
            {nextLevel && <span className="text-xs text-[var(--color-text-muted)]">→ {nextLevel.nome}</span>}
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: nivel.color + '20' }}>
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${xpPct}%`, background: nivel.color }} />
          </div>
          {nextLevel && (
            <p className="text-[10px] text-[var(--color-text-muted)] mt-1">{nextLevel.min - points} XP para {nextLevel.nome}</p>
          )}
        </div>
      </div>

      {/* ── KPI row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Cursos Ativos',      value: activeEnrollments.length, icon: BookOpen,   color: COLOR,      to: '/aluno/cursos'      },
          { label: 'Certificados',        value: certificates.length,       icon: Award,     color: '#10B981',  to: '/aluno/certificados'},
          { label: 'Pontos XP',           value: points.toLocaleString(),   icon: Trophy,    color: '#F59E0B',  to: '/aluno/gamificacao' },
          { label: 'Pag. Pendentes',      value: pendingPayments.length,    icon: Clock,     color: pendingPayments.length > 0 ? '#EF4444' : '#64748B', to: '/aluno/pagamentos' },
        ].map(kpi => (
          <Link key={kpi.label} to={kpi.to}
            className="rounded-xl border p-4 hover:bg-[var(--color-surface-elevated)] transition-colors group"
            style={{ background: 'var(--color-surface)', borderColor: kpi.color + '20' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: kpi.color + '18' }}>
                <kpi.icon size={15} style={{ color: kpi.color }} />
              </div>
              <ChevronRight size={12} className="text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-2xl font-black" style={{ color: kpi.color }}>{kpi.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{kpi.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Cursos em andamento ─────────────────────────────────── */}
        <Card title="Cursos em Andamento" action={
          <Link to="/aluno/cursos" className="text-xs flex items-center gap-1 hover:underline" style={{ color: COLOR }}>Ver todos <ArrowRight size={11} /></Link>
        }>
          {activeEnrollments.length === 0 ? (
            <div className="py-8 text-center">
              <BookOpen size={28} className="mx-auto mb-3" style={{ color: COLOR + '50' }} />
              <p className="text-sm text-[var(--color-text-muted)] mb-2">Sem cursos ativos</p>
              <Link to="/cursos" className="text-xs font-semibold hover:underline" style={{ color: COLOR }}>Ver cursos disponíveis →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {activeEnrollments.slice(0, 3).map(e => (
                <Link key={e.id} to={`/aluno/cursos/${e.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--color-surface-elevated)] transition-colors group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: COLOR + '15' }}>
                    <BookOpen size={16} style={{ color: COLOR }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-text)] truncate">{(e.course as any)?.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: COLOR + '20' }}>
                        <div className="h-full rounded-full" style={{ width: '45%', background: COLOR }} />
                      </div>
                      <span className="text-[10px] text-[var(--color-text-muted)]">45%</span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* ── Próximas aulas + avisos ─────────────────────────────── */}
        <div className="space-y-4">
          <Card title="Próximas Aulas" noPadding>
            <div className="divide-y divide-[var(--color-border)]">
              {MOCK_PROXIMAS.map(aula => (
                <div key={aula.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="text-center w-12 flex-shrink-0">
                    <p className="text-[10px] font-bold uppercase" style={{ color: COLOR }}>{aula.data}</p>
                    <p className="text-sm font-black text-[var(--color-text)]">{aula.hora}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-text)] truncate">{aula.turma}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{aula.local}</p>
                  </div>
                  <Calendar size={14} className="text-[var(--color-text-muted)] flex-shrink-0" />
                </div>
              ))}
            </div>
          </Card>

          <Card title="Avisos">
            <div className="space-y-2">
              {MOCK_AVISOS.map(a => (
                <div key={a.id} className="flex items-start gap-2.5 p-2.5 rounded-lg border text-sm"
                  style={{
                    background: a.tipo === 'warn' ? '#F59E0B08' : a.tipo === 'ok' ? '#10B98108' : COLOR + '08',
                    borderColor: a.tipo === 'warn' ? '#F59E0B25' : a.tipo === 'ok' ? '#10B98125' : COLOR + '25',
                  }}>
                  {a.tipo === 'warn' ? <AlertTriangle size={13} style={{ color: '#F59E0B' }} className="flex-shrink-0 mt-0.5" />
                    : a.tipo === 'ok' ? <CheckCircle size={13} style={{ color: '#10B981' }} className="flex-shrink-0 mt-0.5" />
                    : <Flame size={13} style={{ color: COLOR }} className="flex-shrink-0 mt-0.5" />}
                  <p className="text-xs text-[var(--color-text)]">{a.texto}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>

      {/* ── Vagas recomendadas ───────────────────────────────────────── */}
      <Card title="💼 Vagas Recomendadas para Você" action={
        <Link to="/aluno/vagas" className="text-xs flex items-center gap-1 hover:underline" style={{ color: '#10B981' }}>Ver todas <ArrowRight size={11} /></Link>
      }>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MOCK_VAGAS.map(vaga => (
            <div key={vaga.id} className="flex items-start gap-3 p-3.5 rounded-xl border"
              style={{ borderColor: '#10B98125', background: '#10B98108' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: '#10B98118' }}>
                <Briefcase size={15} style={{ color: '#10B981' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[var(--color-text)]">{vaga.cargo}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{vaga.empresa} · {vaga.cidade}</p>
                <p className="text-xs font-semibold mt-1" style={{ color: '#10B981' }}>{vaga.salario}</p>
              </div>
              <Link to="/aluno/vagas"
                className="px-3 py-1.5 rounded-lg text-xs font-bold flex-shrink-0"
                style={{ background: '#10B98118', color: '#10B981' }}>
                Ver
              </Link>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Certificados recentes ────────────────────────────────────── */}
      {certificates.length > 0 && (
        <Card title="🎓 Certificados Recentes" action={
          <Link to="/aluno/certificados" className="text-xs flex items-center gap-1 hover:underline" style={{ color: '#F59E0B' }}>Ver todos <ArrowRight size={11} /></Link>
        }>
          <div className="space-y-2">
            {certificates.slice(0, 3).map(c => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#F59E0B08', border: '1px solid #F59E0B25' }}>
                <Award size={18} className="flex-shrink-0" style={{ color: '#F59E0B' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text)] truncate">{(c.course as any)?.title}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">Emitido em {formatDate(c.issued_at)}</p>
                </div>
                <TrendingUp size={14} style={{ color: '#10B981' }} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Alerta pagamentos ──────────────────────────────────────── */}
      {pendingPayments.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl border"
          style={{ background: '#EF444408', borderColor: '#EF444430' }}>
          <AlertTriangle size={16} style={{ color: '#EF4444' }} className="flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-bold text-[var(--color-text)]">
              {pendingPayments.length} pagamento{pendingPayments.length > 1 ? 's' : ''} em aberto
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              Total: {formatCurrency(pendingPayments.reduce((s, p) => s + p.amount, 0))}
            </p>
          </div>
          <Link to="/aluno/pagamentos" className="text-xs font-bold hover:underline" style={{ color: '#EF4444' }}>Regularizar →</Link>
        </div>
      )}

    </div>
  )
}
