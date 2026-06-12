import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Spinner } from '@/components/ui'

// Layouts
import { PublicLayout } from '@/components/layout/PublicLayout'
import { StudentLayout } from '@/components/layout/StudentLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { IndustrialLayout } from '@/components/layout/IndustrialLayout'

// Public pages
import { HomePage } from '@/pages/public/HomePage'
import { CoursesPage } from '@/pages/public/CoursesPage'
import { CourseDetailPage } from '@/pages/public/CourseDetailPage'
import { CertificateValidationPage } from '@/pages/public/CertificateValidationPage'
import { ArticlesPage } from '@/pages/public/ArticlesPage'
import { AboutPage } from '@/pages/public/AboutPage'

// Auth pages
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'

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

// Admin pages
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

// Industrial portal pages
import { IndustrialDashboardPage } from '@/pages/industrial/DashboardPage'
import { IndustrialServiceOrdersPage } from '@/pages/industrial/ServiceOrdersPage'
import { IndustrialQuotationsPage } from '@/pages/industrial/QuotationsPage'
import { IndustrialFinancialPage } from '@/pages/industrial/FinancialPage'

// Checkout
import { CheckoutPage } from '@/pages/checkout/CheckoutPage'

function ProtectedRoute({ adminOnly = false, industrialOnly = false }: { adminOnly?: boolean; industrialOnly?: boolean }) {
  const { user, profile, loading } = useAuth()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
      <Spinner size="lg" />
    </div>
  )

  if (!user) return <Navigate to="/login" replace />

  if (adminOnly && profile?.role !== 'admin' && profile?.role !== 'instructor') {
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
      { path: '/calculadora', element: <CalculatorPage /> },
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
  { path: '/auth/callback', element: <Navigate to="/aluno" replace /> },

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
          { path: '/aluno/cursos', element: <MyCoursesPage /> },
          { path: '/aluno/cursos/:enrollmentId', element: <CourseViewPage /> },
          { path: '/aluno/perfil', element: <ProfilePage /> },
          { path: '/aluno/pagamentos', element: <PaymentsPage /> },
          { path: '/aluno/certificados', element: <CertificatesPage /> },
          { path: '/aluno/calculadora', element: <CalculatorPage /> },
          { path: '/aluno/avaliacoes', element: <EvaluationsPage /> },
          { path: '/aluno/presenca', element: <AttendancePage /> },
          { path: '/aluno/vagas', element: <JobsPage /> },
          { path: '/aluno/talento', element: <TalentPage /> },
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
          { path: '/admin', element: <AdminDashboardPage /> },
          { path: '/admin/cursos', element: <AdminCoursesPage /> },
          { path: '/admin/alunos', element: <AdminStudentsPage /> },
          { path: '/admin/financeiro', element: <AdminFinancialPage /> },
          { path: '/admin/avaliacoes', element: <AdminEvaluationsPage /> },
          { path: '/admin/presenca', element: <AdminAttendancePage /> },
          { path: '/admin/certificados', element: <AdminCertificatesPage /> },
          { path: '/admin/servicos', element: <AdminServicesPage /> },
          { path: '/admin/empregabilidade', element: <AdminEmpregabilidadePage /> },
          { path: '/admin/crm', element: <AdminCRMPage /> },
          { path: '/admin/consultoria', element: <AdminConsultingPage /> },
        ],
      },
    ],
  },

  // Industrial portal routes
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
