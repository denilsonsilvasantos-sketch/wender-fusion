import { BookOpen, Calendar, FileText, Video, ClipboardList, CalendarCheck, Award, Star, BarChart2, History, Users, Search, Send, MessageSquare, Calculator, Library, BookMarked, Download, User, FolderOpen, CreditCard, HelpCircle } from 'lucide-react'

const COLOR = '#6366F1'

function StubPage({ icon: Icon, title, desc, color = COLOR }: {
  icon: React.ElementType; title: string; desc: string; color?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: color + '15', border: `2px solid ${color}25` }}>
        <Icon size={28} style={{ color }} />
      </div>
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">{title}</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">{desc}</p>
      </div>
      <div className="px-4 py-2 rounded-lg text-xs font-semibold" style={{ background: color + '12', color }}>
        Em desenvolvimento — disponível em breve
      </div>
    </div>
  )
}

export function MeusCursosPage()       { return <StubPage icon={BookOpen}      color="#6366F1" title="Meus Cursos"          desc="Acompanhe o progresso de cada curso matriculado" /> }
export function CronogramaPage()       { return <StubPage icon={Calendar}      color="#6366F1" title="Cronograma"           desc="Grade de aulas e calendário do semestre" /> }
export function ApostilasPage()        { return <StubPage icon={FileText}      color="#6366F1" title="Apostilas"            desc="Materiais didáticos dos cursos" /> }
export function VideoaulasPage()       { return <StubPage icon={Video}         color="#6366F1" title="Videoaulas"           desc="Conteúdo em vídeo dos módulos teóricos" /> }
export function AvaliacoesPage()       { return <StubPage icon={ClipboardList} color="#6366F1" title="Avaliações"           desc="Provas teóricas e resultados" /> }
export function PresencaPage()         { return <StubPage icon={CalendarCheck} color="#6366F1" title="Frequência"           desc="Registro de presença e faltas" /> }
export function CertificadosPage()     { return <StubPage icon={Award}         color="#6366F1" title="Certificados"         desc="Certificados emitidos pela escola" /> }
export function ConquistasPage()       { return <StubPage icon={Star}          color="#F59E0B" title="Conquistas"           desc="Medalhas e troféus desbloqueados" /> }
export function RankingPage()          { return <StubPage icon={BarChart2}     color="#F59E0B" title="Ranking"              desc="Posição na turma e no geral" /> }
export function HistoricoAcademicoPage(){ return <StubPage icon={History}      color="#F59E0B" title="Histórico Acadêmico"  desc="Todas as notas, frequências e módulos concluídos" /> }
export function BancoTalentosPage()    { return <StubPage icon={Users}         color="#10B981" title="Banco de Talentos"    desc="Seu perfil visível para empresas parceiras" /> }
export function VagasPage()            { return <StubPage icon={Search}        color="#10B981" title="Vagas"                desc="Oportunidades de emprego na área de soldagem" /> }
export function CandidaturasPage()     { return <StubPage icon={Send}          color="#10B981" title="Minhas Candidaturas"  desc="Acompanhe o status das candidaturas enviadas" /> }
export function RecomendacoesPage()    { return <StubPage icon={MessageSquare} color="#10B981" title="Recomendações"        desc="Cartas de recomendação dos instrutores" /> }
export function CalculadoraPage()      { return <StubPage icon={Calculator}    color="#3B82F6" title="Calculadora"          desc="Ferramentas de cálculo para soldagem e materiais" /> }
export function BibliotecaPage()       { return <StubPage icon={Library}       color="#3B82F6" title="Biblioteca Técnica"   desc="Acervo de normas e publicações técnicas" /> }
export function NormasPage()           { return <StubPage icon={BookMarked}    color="#3B82F6" title="Normas"               desc="ABNT e normas técnicas de soldagem" /> }
export function DownloadsPage()        { return <StubPage icon={Download}      color="#3B82F6" title="Downloads"            desc="Arquivos e recursos para download" /> }
export function PerfilPage()           { return <StubPage icon={User}          color="#64748B" title="Meu Perfil"           desc="Dados pessoais e configurações da conta" /> }
export function DocumentosPage()       { return <StubPage icon={FolderOpen}    color="#64748B" title="Documentos"           desc="Contratos, declarações e documentos escolares" /> }
export function PagamentosPage()       { return <StubPage icon={CreditCard}    color="#64748B" title="Financeiro"           desc="Mensalidades, boletos e histórico de pagamentos" /> }
export function SuportePage()          { return <StubPage icon={HelpCircle}    color="#64748B" title="Suporte"              desc="Abra chamados e fale com a secretaria" /> }
