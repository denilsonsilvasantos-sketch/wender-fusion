import { Link } from 'react-router-dom'
import {
  Users, ClipboardList, Star, Award, Clock, ChevronRight,
  CheckCircle, AlertTriangle, BookOpen, Calendar,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Card } from '@/components/ui'

const COLOR = '#10B981'

const MOCK_PROXIMAS_AULAS = [
  { id: 1, data: 'Hoje', hora: '08:00', turma: 'Turma A — TIG', curso: 'Soldagem TIG (GTAW)', sala: 'Lab 1' },
  { id: 2, data: 'Hoje', hora: '13:00', turma: 'Turma B — MIG', curso: 'Soldagem MIG/MAG (GMAW)', sala: 'Lab 2' },
  { id: 3, data: 'Amanhã', hora: '08:00', turma: 'Turma A — TIG', curso: 'Soldagem TIG (GTAW)', sala: 'Lab 1' },
  { id: 4, data: 'Amanhã', hora: '13:30', turma: 'Turma C — Eletrodo', curso: 'Eletrodo Revestido (SMAW)', sala: 'Lab 1' },
]

const AVISOS = [
  { id: 1, tipo: 'info', texto: 'Reunião pedagógica na sexta-feira às 18h.' },
  { id: 2, tipo: 'warn', texto: '3 alunos com frequência abaixo de 75% na Turma B.' },
  { id: 3, tipo: 'ok', texto: 'Material didático atualizado disponível na biblioteca.' },
]

export function InstructorDashboardPage() {
  const { profile } = useAuth()
  const nome = profile?.name?.split(' ')[0] ?? 'Instrutor'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">
          Olá, {nome} 👋
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Turmas Ativas', value: '3', icon: Users, link: '/instrutor/turmas' },
          { label: 'Alunos Ativos', value: '47', icon: BookOpen, link: '/instrutor/turmas' },
          { label: 'Avaliações Pendentes', value: '8', icon: Star, link: '/instrutor/avaliacoes/teoricas' },
          { label: 'Certificados p/ Aprovar', value: '5', icon: Award, link: '/instrutor/certificados' },
        ].map(kpi => (
          <Link
            key={kpi.label}
            to={kpi.link}
            className="rounded-xl border p-5 hover:bg-[var(--color-surface-elevated)] transition-colors group"
            style={{ background: 'var(--color-surface)', borderColor: COLOR + '20' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: COLOR + '18' }}>
                <kpi.icon size={15} style={{ color: COLOR }} />
              </div>
              <ChevronRight size={12} className="ml-auto text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-2xl font-black" style={{ color: COLOR }}>{kpi.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{kpi.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas aulas */}
        <Card title="Próximas Aulas" noPadding>
          <div className="divide-y divide-[var(--color-border)]">
            {MOCK_PROXIMAS_AULAS.map(aula => (
              <div key={aula.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="text-center w-12 flex-shrink-0">
                  <p className="text-[10px] font-bold uppercase" style={{ color: COLOR }}>{aula.data}</p>
                  <p className="text-sm font-black text-[var(--color-text)]">{aula.hora}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-text)] truncate">{aula.turma}</p>
                  <p className="text-xs text-[var(--color-text-muted)] truncate">{aula.curso} — {aula.sala}</p>
                </div>
                <Link
                  to="/instrutor/presenca"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex-shrink-0"
                  style={{ background: COLOR + '18', color: COLOR }}
                >
                  <ClipboardList size={11} />
                  Chamada
                </Link>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-[var(--color-border)]">
            <Link to="/instrutor/agenda" className="text-xs font-semibold hover:underline" style={{ color: COLOR }}>
              Ver agenda completa →
            </Link>
          </div>
        </Card>

        {/* Avisos */}
        <Card title="Avisos da Coordenação">
          <div className="space-y-3">
            {AVISOS.map(a => (
              <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg border" style={{
                background: a.tipo === 'warn' ? '#F59E0B08' : a.tipo === 'ok' ? '#10B98108' : '#3B82F608',
                borderColor: a.tipo === 'warn' ? '#F59E0B25' : a.tipo === 'ok' ? '#10B98125' : '#3B82F625',
              }}>
                {a.tipo === 'warn' ? (
                  <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" style={{ color: '#F59E0B' }} />
                ) : a.tipo === 'ok' ? (
                  <CheckCircle size={15} className="flex-shrink-0 mt-0.5" style={{ color: COLOR }} />
                ) : (
                  <Calendar size={15} className="flex-shrink-0 mt-0.5" style={{ color: '#3B82F6' }} />
                )}
                <p className="text-sm text-[var(--color-text)]">{a.texto}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Atalhos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Fazer Chamada', to: '/instrutor/presenca', icon: ClipboardList, color: COLOR },
          { label: 'Avaliação Prática', to: '/instrutor/avaliacoes/pratica', icon: Star, color: '#FF8C00' },
          { label: 'Banco de Talentos', to: '/instrutor/empregabilidade/talentos', icon: Users, color: '#6366F1' },
          { label: 'Aprovar Certificados', to: '/instrutor/certificados', icon: Award, color: '#8B5CF6' },
        ].map(item => (
          <Link
            key={item.to}
            to={item.to}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border text-center hover:bg-[var(--color-surface-elevated)] transition-colors"
            style={{ borderColor: item.color + '25' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: item.color + '18' }}>
              <item.icon size={18} style={{ color: item.color }} />
            </div>
            <span className="text-xs font-semibold text-[var(--color-text)]">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
