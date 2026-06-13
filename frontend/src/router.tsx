import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Spinner } from '@/components/ui'

// Layouts
import { PublicLayout } from '@/components/layout/PublicLayout'
import { StudentLayout } from '@/components/layout/StudentLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { IndustrialLayout } from '@/components/layout/IndustrialLayout'
import { InstructorLayout } from '@/components/layout/InstructorLayout'

// Public pages
import { HomePage } from '@/pages/public/HomePage'
import { CoursesPage } from '@/pages/public/CoursesPage'
import { CourseDetailPage } from '@/pages/public/CourseDetailPage'
import { CertificateValidationPage } from '@/pages/public/CertificateValidationPage'
import { ArticlesPage } from '@/pages/public/ArticlesPage'
import { AboutPage } from '@/pages/public/AboutPage'
import { PublicCalculatorPage } from '@/pages/public/PublicCalculatorPage'

// Auth pages
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { CallbackPage } from '@/pages/auth/CallbackPage'

// Student pages
import { StudentDashboardPage } from '@/pages/student/DashboardPage'
import { MyCoursesPage } from '@/pages/student/MyCoursesPage'
import { CourseViewPage } from '@/pages/student/CourseViewPage'
import { ProfilePage } from '@/pages/student/ProfilePage'
import { PaymentsPage } from '@/pages/student/PaymentsPage'
import { CertificatesPage } from '@/pages/student/CertificatesPage'
import { CalculatorPage } from '@/pages/student/CalculatorPage'
import { EvaluationsPage } from '@/pages/student/EvaluationsPage'
import { AttendancePage } from '@/pages/student/AttendancePage'
import { JobsPage } from '@/pages/student/JobsPage'
import { TalentPage } from '@/pages/student/TalentPage'
import { GamificacaoPage } from '@/pages/student/GamificacaoPage'
import { MeuCurriculoPage } from '@/pages/student/MeuCurriculoPage'
import {
  MeusCursosPage, CronogramaPage, ApostilasPage, VideoaulasPage, AvaliacoesPage,
  PresencaPage as StudentPresencaPage, CertificadosPage as StudentCertificadosPage,
  ConquistasPage, RankingPage, HistoricoAcademicoPage,
  BancoTalentosPage, VagasPage, CandidaturasPage, RecomendacoesPage as StudentRecomendacoesPage,
  CalculadoraPage, BibliotecaPage, NormasPage, DownloadsPage,
  PerfilPage as StudentPerfilPage, DocumentosPage as StudentDocumentosPage,
  PagamentosPage, SuportePage,
} from '@/pages/student/_stubs'

// Admin — core pages
import { AdminDashboardPage } from '@/pages/admin/DashboardPage'
import { AdminCoursesPage } from '@/pages/admin/CoursesPage'
import { AdminStudentsPage } from '@/pages/admin/StudentsPage'
import { AdminFinancialPage } from '@/pages/admin/FinancialPage'
import { AdminEvaluationsPage } from '@/pages/admin/EvaluationsPage'
import { AdminAttendancePage } from '@/pages/admin/AttendancePage'
import { AdminServicesPage } from '@/pages/admin/ServicesPage'
import { AdminCertificatesPage } from '@/pages/admin/CertificatesPage'
import { AdminEmpregabilidadePage } from '@/pages/admin/EmpregabilidadePage'
import { AdminCRMPage } from '@/pages/admin/CRMPage'
import { AdminConsultingPage } from '@/pages/admin/ConsultingPage'
import { ArticlesAdminPage } from '@/pages/admin/ArticlesAdminPage'

// Instructor pages
import { InstructorDashboardPage } from '@/pages/instructor/DashboardPage'
import { PresencaPage } from '@/pages/instructor/PresencaPage'
import { AvaliacaoPraticaPage } from '@/pages/instructor/AvaliacaoPraticaPage'
import {
  TurmasPage, AgendaPage as InstrAgendaPage, AvaliacoesTeóricasPage, MateriaisPage,
  CertificadosPage as InstrCertificadosPage, TalentosPage, RecomendacoesPage,
  PareceresTecnicosPage, RelatoriosTurmasPage, RelatoriosAlunosPage,
  RelatoriosDesempenhoPage, PerfilPage as InstrPerfilPage,
} from '@/pages/instructor/_stubs'

// Admin — Escola dashboards
import { EscolaDashboardPage } from '@/pages/admin/escola/DashboardPage'

// Admin — Industrial dashboards
import { IndustrialDashboardPage as AdminIndustrialDashboardPage } from '@/pages/admin/industrial/DashboardPage'

// Admin — Stubs (all "em desenvolvimento" pages)
import {
  EscolaLeadsPage, EscolaFunilPage, EscolaMatriculasPage, EscolaCampanhasPage,
  EscolaTurmasPage, EscolaInstrutoresPage, EscolaMarketingPage,
  IndustrialLeadsPage, IndustrialPropostasPage, IndustrialContratosPage,
  IndustrialClientesPage, IndustrialOrcamentosPage, IndustrialProducaoPage,
  IndustrialPortalPage, IndustrialFinanceiroPage,
  FinanceiroGeralPage, AgendaPage, DocumentosPage, RelatoriosPage,
  UsuariosPage, ConfiguracoesPage,
} from '@/pages/admin/_stubs'

// Industrial portal pages
import { IndustrialDashboardPage } from '@/pages/industrial/DashboardPage'
import { IndustrialServiceOrdersPage } from '@/pages/industrial/ServiceOrdersPage'
import { IndustrialQuotationsPage } from '@/pages/industrial/QuotationsPage'
import { IndustrialFinancialPage } from '@/pages/industrial/FinancialPage'

// Checkout
import { CheckoutPage } from '@/pages/checkout/CheckoutPage'

function ProtectedRoute({
  adminOnly = false,
  instructorOnly = false,
  industrialOnly = false,
}: { adminOnly?: boolean; instructorOnly?: boolean; industrialOnly?: boolean }) {
  const { user, profile, loading, profileLoading } = useAuth()

  // Aguarda sessão inicial E carregamento do profile
  if (loading || (user && profileLoading)) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
      <Spinner size="lg" />
    </div>
  )

  if (!user) return <Navigate to="/login" replace />

  // Admin: somente role 'admin'
  if (adminOnly && profile?.role !== 'admin') {
    return <Navigate to="/aluno" replace />
  }

  // Instrutor: role 'instructor' OU 'admin' (admin pode supervisionar)
  if (instructorOnly && profile?.role !== 'instructor' && profile?.role !== 'admin') {
    return <Navigate to="/aluno" replace />
  }

  if (industrialOnly && profile?.role !== 'industrial_client' && profile?.role !== 'admin') {
    return <Navigate to="/aluno" replace />
  }

  return <Outlet />
}

export const router = createBrowserRouter([
  // Public routes
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/cursos', element: <CoursesPage /> },
      { path: '/cursos/:id', element: <CourseDetailPage /> },
      { path: '/calculadora', element: <PublicCalculatorPage /> },
      { path: '/artigos', element: <ArticlesPage /> },
      { path: '/sobre', element: <AboutPage /> },
    ],
  },

  // Certificate validation (public, no layout)
  { path: '/validar', element: <CertificateValidationPage /> },
  { path: '/validar/:code', element: <CertificateValidationPage /> },

  // Auth routes
  { path: '/login', element: <LoginPage /> },
  { path: '/cadastro', element: <RegisterPage /> },
  { path: '/recuperar-senha', element: <ForgotPasswordPage /> },
  { path: '/auth/callback', element: <CallbackPage /> },

  // Checkout
  { path: '/checkout/:courseId', element: <CheckoutPage /> },

  // Student routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <StudentLayout />,
        children: [
          { path: '/aluno', element: <StudentDashboardPage /> },

          // Minha Formação
          { path: '/aluno/cursos', element: <MeusCursosPage /> },
          { path: '/aluno/cursos/:enrollmentId', element: <CourseViewPage /> },
          { path: '/aluno/cronograma', element: <CronogramaPage /> },
          { path: '/aluno/apostilas', element: <ApostilasPage /> },
          { path: '/aluno/videoaulas', element: <VideoaulasPage /> },
          { path: '/aluno/avaliacoes', element: <AvaliacoesPage /> },
          { path: '/aluno/presenca', element: <StudentPresencaPage /> },
          { path: '/aluno/certificados', element: <StudentCertificadosPage /> },

          // Desenvolvimento
          { path: '/aluno/gamificacao', element: <GamificacaoPage /> },
          { path: '/aluno/conquistas', element: <ConquistasPage /> },
          { path: '/aluno/ranking', element: <RankingPage /> },
          { path: '/aluno/historico', element: <HistoricoAcademicoPage /> },

          // Empregabilidade
          { path: '/aluno/curriculo', element: <MeuCurriculoPage /> },
          { path: '/aluno/talento', element: <BancoTalentosPage /> },
          { path: '/aluno/vagas', element: <VagasPage /> },
          { path: '/aluno/candidaturas', element: <CandidaturasPage /> },
          { path: '/aluno/recomendacoes', element: <StudentRecomendacoesPage /> },

          // Ferramentas
          { path: '/aluno/calculadora', element: <CalculadoraPage /> },
          { path: '/aluno/biblioteca', element: <BibliotecaPage /> },
          { path: '/aluno/normas', element: <NormasPage /> },
          { path: '/aluno/downloads', element: <DownloadsPage /> },

          // Conta
          { path: '/aluno/perfil', element: <StudentPerfilPage /> },
          { path: '/aluno/documentos', element: <StudentDocumentosPage /> },
          { path: '/aluno/pagamentos', element: <PagamentosPage /> },
          { path: '/aluno/suporte', element: <SuportePage /> },

          // Legacy aliases (used by old code)
          { path: '/aluno/meus-cursos', element: <MyCoursesPage /> },
          { path: '/aluno/meu-certificado', element: <CertificatesPage /> },
          { path: '/aluno/financeiro', element: <PaymentsPage /> },
          { path: '/aluno/calcular', element: <CalculatorPage /> },
          { path: '/aluno/empregabilidade', element: <TalentPage /> },
          { path: '/aluno/notas', element: <EvaluationsPage /> },
          { path: '/aluno/frequencia', element: <AttendancePage /> },
          { path: '/aluno/jobs', element: <JobsPage /> },
        ],
      },
    ],
  },

  // Admin routes
  {
    element: <ProtectedRoute adminOnly />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          // ── ERP Root ──────────────────────────────────────────────────────
          { path: '/admin', element: <AdminDashboardPage /> },

          // ── 🏫 ESCOLA ────────────────────────────────────────────────────
          { path: '/admin/escola', element: <EscolaDashboardPage /> },
          // Comercial
          { path: '/admin/escola/leads', element: <EscolaLeadsPage /> },
          { path: '/admin/escola/funil', element: <EscolaFunilPage /> },
          { path: '/admin/escola/matriculas', element: <EscolaMatriculasPage /> },
          { path: '/admin/escola/campanhas', element: <EscolaCampanhasPage /> },
          // Módulos (apontam para páginas existentes)
          { path: '/admin/escola/alunos', element: <AdminStudentsPage /> },
          { path: '/admin/escola/cursos', element: <AdminCoursesPage /> },
          { path: '/admin/escola/turmas', element: <EscolaTurmasPage /> },
          { path: '/admin/escola/instrutores', element: <EscolaInstrutoresPage /> },
          { path: '/admin/escola/certificados', element: <AdminCertificatesPage /> },
          { path: '/admin/escola/empregabilidade', element: <AdminEmpregabilidadePage /> },
          { path: '/admin/escola/financeiro', element: <AdminFinancialPage /> },
          { path: '/admin/escola/marketing', element: <EscolaMarketingPage /> },

          // ── 🏭 SERVIÇOS INDUSTRIAIS ───────────────────────────────────────
          { path: '/admin/industrial', element: <AdminIndustrialDashboardPage /> },
          // Comercial
          { path: '/admin/industrial/leads', element: <IndustrialLeadsPage /> },
          { path: '/admin/industrial/propostas', element: <IndustrialPropostasPage /> },
          { path: '/admin/industrial/contratos', element: <IndustrialContratosPage /> },
          { path: '/admin/industrial/crm', element: <AdminCRMPage /> },
          // Módulos
          { path: '/admin/industrial/clientes', element: <IndustrialClientesPage /> },
          { path: '/admin/industrial/orcamentos', element: <IndustrialOrcamentosPage /> },
          { path: '/admin/industrial/ordens', element: <AdminServicesPage /> },
          { path: '/admin/industrial/producao', element: <IndustrialProducaoPage /> },
          { path: '/admin/industrial/consultoria', element: <AdminConsultingPage /> },
          { path: '/admin/industrial/portal', element: <IndustrialPortalPage /> },
          { path: '/admin/industrial/financeiro', element: <IndustrialFinanceiroPage /> },

          // ── 🌐 COMPARTILHADO ─────────────────────────────────────────────
          { path: '/admin/crm', element: <AdminCRMPage /> },
          { path: '/admin/financeiro-geral', element: <FinanceiroGeralPage /> },
          { path: '/admin/agenda', element: <AgendaPage /> },
          { path: '/admin/documentos', element: <DocumentosPage /> },
          { path: '/admin/relatorios', element: <RelatoriosPage /> },
          { path: '/admin/artigos', element: <ArticlesAdminPage /> },
          { path: '/admin/usuarios', element: <UsuariosPage /> },
          { path: '/admin/configuracoes', element: <ConfiguracoesPage /> },

          // ── Rotas legadas mantidas ────────────────────────────────────────
          { path: '/admin/cursos', element: <AdminCoursesPage /> },
          { path: '/admin/alunos', element: <AdminStudentsPage /> },
          { path: '/admin/financeiro', element: <AdminFinancialPage /> },
          { path: '/admin/avaliacoes', element: <AdminEvaluationsPage /> },
          { path: '/admin/presenca', element: <AdminAttendancePage /> },
          { path: '/admin/certificados', element: <AdminCertificatesPage /> },
          { path: '/admin/servicos', element: <AdminServicesPage /> },
          { path: '/admin/empregabilidade', element: <AdminEmpregabilidadePage /> },
          { path: '/admin/consultoria', element: <AdminConsultingPage /> },
        ],
      },
    ],
  },

  // Instructor routes
  {
    element: <ProtectedRoute instructorOnly />,
    children: [
      {
        element: <InstructorLayout />,
        children: [
          { path: '/instrutor', element: <InstructorDashboardPage /> },
          // Ensino
          { path: '/instrutor/turmas', element: <TurmasPage /> },
          { path: '/instrutor/agenda', element: <InstrAgendaPage /> },
          { path: '/instrutor/presenca', element: <PresencaPage /> },
          { path: '/instrutor/avaliacoes/teoricas', element: <AvaliacoesTeóricasPage /> },
          { path: '/instrutor/avaliacoes/pratica', element: <AvaliacaoPraticaPage /> },
          { path: '/instrutor/materiais', element: <MateriaisPage /> },
          { path: '/instrutor/certificados', element: <InstrCertificadosPage /> },
          // Empregabilidade
          { path: '/instrutor/empregabilidade/talentos', element: <TalentosPage /> },
          { path: '/instrutor/empregabilidade/recomendacoes', element: <RecomendacoesPage /> },
          { path: '/instrutor/empregabilidade/pareceres', element: <PareceresTecnicosPage /> },
          // Relatórios
          { path: '/instrutor/relatorios/turmas', element: <RelatoriosTurmasPage /> },
          { path: '/instrutor/relatorios/alunos', element: <RelatoriosAlunosPage /> },
          { path: '/instrutor/relatorios/desempenho', element: <RelatoriosDesempenhoPage /> },
          // Perfil
          { path: '/instrutor/perfil', element: <InstrPerfilPage /> },
        ],
      },
    ],
  },

  // Industrial portal routes (external client portal)
  {
    element: <ProtectedRoute industrialOnly />,
    children: [
      {
        element: <IndustrialLayout />,
        children: [
          { path: '/industrial', element: <IndustrialDashboardPage /> },
          { path: '/industrial/ordens', element: <IndustrialServiceOrdersPage /> },
          { path: '/industrial/cotacoes', element: <IndustrialQuotationsPage /> },
          { path: '/industrial/financeiro', element: <IndustrialFinancialPage /> },
        ],
      },
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> },
])
