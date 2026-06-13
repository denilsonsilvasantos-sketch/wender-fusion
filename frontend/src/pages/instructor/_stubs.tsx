import { Link } from 'react-router-dom'
import {
  Users, Calendar, FileText, BookOpen, Award, Briefcase,
  MessageSquare, BarChart2, User, Star, ChevronLeft,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const COLOR = '#10B981'

interface StubConfig { title: string; icon: LucideIcon; color: string; description: string; back?: string; backLabel?: string }

function StubPage({ config }: { config: StubConfig }) {
  const { title, icon: Icon, color, description, back = '/instrutor', backLabel = 'Dashboard' } = config
  return (
    <div className="space-y-6">
      <Link to={back} className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors w-fit">
        <ChevronLeft size={14} />
        {backLabel}
      </Link>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
          style={{ background: color + '18', border: `2px solid ${color}30` }}>
          <Icon size={36} style={{ color }} />
        </div>
        <h1 className="text-2xl font-black text-[var(--color-text)] mb-2">{title}</h1>
        <p className="text-sm text-[var(--color-text-muted)] mb-4">{description}</p>
        <p className="text-xs px-4 py-2 rounded-full" style={{ background: color + '10', border: `1px solid ${color}25`, color }}>
          Em desenvolvimento
        </p>
      </div>
    </div>
  )
}

export function TurmasPage() {
  return <StubPage config={{ title: 'Minhas Turmas', icon: Users, color: COLOR, description: 'Listagem das suas turmas ativas com alunos, frequência e histórico.' }} />
}
export function AgendaPage() {
  return <StubPage config={{ title: 'Agenda', icon: Calendar, color: COLOR, description: 'Calendário completo com aulas, reuniões e treinamentos.' }} />
}
export function AvaliacoesTeóricasPage() {
  return <StubPage config={{ title: 'Avaliações Teóricas', icon: FileText, color: COLOR, back: '/instrutor/avaliacoes/pratica', backLabel: 'Avaliações', description: 'Criar, aplicar e corrigir avaliações teóricas das turmas.' }} />
}
export function MateriaisPage() {
  return <StubPage config={{ title: 'Materiais', icon: BookOpen, color: COLOR, description: 'Upload de apostilas, normas ABNT e materiais complementares.' }} />
}
export function CertificadosPage() {
  return <StubPage config={{ title: 'Certificados', icon: Award, color: '#8B5CF6', description: 'Aprovação de certificados para alunos que atingiram os critérios.' }} />
}
export function TalentosPage() {
  return <StubPage config={{ title: 'Banco de Talentos', icon: Users, color: '#6366F1', back: '/instrutor/empregabilidade/recomendacoes', backLabel: 'Empregabilidade', description: 'Alunos aptos identificados para oportunidades no mercado.' }} />
}
export function RecomendacoesPage() {
  return <StubPage config={{ title: 'Recomendações', icon: Briefcase, color: '#6366F1', back: '/instrutor/empregabilidade/talentos', backLabel: 'Empregabilidade', description: 'Indicar alunos para vagas e oportunidades industriais.' }} />
}
export function PareceresTecnicosPage() {
  return <StubPage config={{ title: 'Pareceres Técnicos', icon: MessageSquare, color: '#6366F1', back: '/instrutor/empregabilidade/talentos', backLabel: 'Empregabilidade', description: 'Emitir pareceres técnicos individuais para uso externo.' }} />
}
export function RelatoriosTurmasPage() {
  return <StubPage config={{ title: 'Relatórios de Turmas', icon: BarChart2, color: '#8B5CF6', back: '/instrutor/relatorios/alunos', backLabel: 'Relatórios', description: 'Frequência, notas e taxa de aprovação por turma.' }} />
}
export function RelatoriosAlunosPage() {
  return <StubPage config={{ title: 'Relatórios de Alunos', icon: BarChart2, color: '#8B5CF6', back: '/instrutor/relatorios/turmas', backLabel: 'Relatórios', description: 'Histórico individual de cada aluno.' }} />
}
export function RelatoriosDesempenhoPage() {
  return <StubPage config={{ title: 'Desempenho Geral', icon: BarChart2, color: '#8B5CF6', back: '/instrutor/relatorios/turmas', backLabel: 'Relatórios', description: 'Melhores alunos e turmas com maior aproveitamento.' }} />
}
export function PerfilPage() {
  return <StubPage config={{ title: 'Meu Perfil', icon: User, color: '#64748B', description: 'Dados pessoais, certificações FBTS e disponibilidade de horários.' }} />
}
