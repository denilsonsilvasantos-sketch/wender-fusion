-- ============================================================
-- WELDER & FUSION PORTAL - ROW LEVEL SECURITY POLICIES
-- Execute após o schema (01_schema.sql)
-- ============================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_order_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_invoices ENABLE ROW LEVEL SECURITY;

-- Funções helper no schema public (Supabase não permite criar no schema auth)
CREATE OR REPLACE FUNCTION public.user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.user_profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('admin', 'instructor'));
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ============================================================
-- USER_PROFILES
-- ============================================================
CREATE POLICY "Usuários veem próprio perfil" ON user_profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Admins veem todos os perfis" ON user_profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Usuários atualizam próprio perfil" ON user_profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admins atualizam qualquer perfil" ON user_profiles
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Sistema insere perfil" ON user_profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- ============================================================
-- COURSES
-- ============================================================
CREATE POLICY "Cursos publicados são públicos" ON courses
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins gerenciam cursos" ON courses
  FOR ALL USING (public.is_admin());

-- ============================================================
-- MODULES
-- ============================================================
CREATE POLICY "Módulos de cursos publicados são públicos" ON modules
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM courses c WHERE c.id = course_id AND c.status = 'published')
  );

CREATE POLICY "Admins gerenciam módulos" ON modules
  FOR ALL USING (public.is_admin());

-- ============================================================
-- LESSONS
-- ============================================================
CREATE POLICY "Alunos matriculados acessam aulas" ON lessons
  FOR SELECT USING (
    is_free_preview = true OR
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM enrollments e
      WHERE e.student_id = auth.uid()
      AND e.course_id = lessons.course_id
      AND e.status = 'active'
    )
  );

CREATE POLICY "Admins gerenciam aulas" ON lessons
  FOR ALL USING (public.is_admin());

-- ============================================================
-- ENROLLMENTS
-- ============================================================
CREATE POLICY "Alunos veem próprias matrículas" ON enrollments
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Admins veem todas as matrículas" ON enrollments
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Alunos criam própria matrícula" ON enrollments
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Admins gerenciam matrículas" ON enrollments
  FOR ALL USING (public.is_admin());

-- ============================================================
-- LESSON_PROGRESS
-- ============================================================
CREATE POLICY "Alunos veem/atualizam próprio progresso" ON lesson_progress
  FOR ALL USING (student_id = auth.uid());

CREATE POLICY "Admins veem todo progresso" ON lesson_progress
  FOR SELECT USING (public.is_admin());

-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE POLICY "Alunos veem próprios pagamentos" ON payments
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Admins veem todos pagamentos" ON payments
  FOR ALL USING (public.is_admin());

-- ============================================================
-- CERTIFICATES
-- ============================================================
CREATE POLICY "Alunos veem próprios certificados" ON certificates
  FOR SELECT USING (student_id = auth.uid() AND revoked = false);

CREATE POLICY "Admins gerenciam certificados" ON certificates
  FOR ALL USING (public.is_admin());

-- ============================================================
-- EVALUATION_METRICS
-- ============================================================
CREATE POLICY "Métricas são visíveis para matriculados" ON evaluation_metrics
  FOR SELECT USING (
    public.is_admin() OR
    EXISTS (SELECT 1 FROM enrollments e WHERE e.student_id = auth.uid() AND e.course_id = evaluation_metrics.course_id)
  );

CREATE POLICY "Admins gerenciam métricas" ON evaluation_metrics
  FOR ALL USING (public.is_admin());

-- ============================================================
-- EVALUATIONS
-- ============================================================
CREATE POLICY "Alunos veem próprias avaliações" ON evaluations
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Admins gerenciam avaliações" ON evaluations
  FOR ALL USING (public.is_admin());

-- ============================================================
-- ATTENDANCE
-- ============================================================
CREATE POLICY "Alunos veem própria presença" ON attendance
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Admins gerenciam presença" ON attendance
  FOR ALL USING (public.is_admin());

-- ============================================================
-- GAMIFICATION
-- ============================================================
CREATE POLICY "Atividades são públicas" ON gamification_activities
  FOR SELECT USING (true);

CREATE POLICY "Admins gerenciam atividades" ON gamification_activities
  FOR ALL USING (public.is_admin());

CREATE POLICY "Alunos veem próprios logs" ON gamification_logs
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Admins gerenciam logs" ON gamification_logs
  FOR ALL USING (public.is_admin());

-- ============================================================
-- MÓDULO DE SERVIÇOS (apenas admins)
-- ============================================================
CREATE POLICY "Admins gerenciam clientes de serviço" ON service_clients
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins gerenciam cotações" ON quotations
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins gerenciam itens de cotação" ON quotation_items
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins gerenciam O.S." ON service_orders
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins veem histórico de O.S." ON service_order_history
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins gerenciam faturas de serviço" ON service_invoices
  FOR ALL USING (public.is_admin());

-- ============================================================
-- PORTAL INDUSTRIAL — clientes vinculados via user_id
-- ============================================================
CREATE POLICY "Cliente industrial vê própria O.S." ON service_orders
  FOR SELECT USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM service_clients sc
      WHERE sc.id = service_orders.client_id AND sc.user_id = auth.uid()
    )
  );

CREATE POLICY "Cliente industrial vê próprias cotações" ON quotations
  FOR SELECT USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM service_clients sc
      WHERE sc.id = quotations.client_id AND sc.user_id = auth.uid()
    )
  );

CREATE POLICY "Cliente industrial vê próprias faturas" ON service_invoices
  FOR SELECT USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM service_clients sc
      WHERE sc.id = service_invoices.client_id AND sc.user_id = auth.uid()
    )
  );

-- ============================================================
-- FASE 2 — EMPREGABILIDADE
-- ============================================================
ALTER TABLE partner_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_bank ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Empresas ativas são públicas" ON partner_companies
  FOR SELECT USING (active = true);

CREATE POLICY "Admins gerenciam empresas parceiras" ON partner_companies
  FOR ALL USING (public.is_admin());

CREATE POLICY "Vagas abertas são públicas" ON job_postings
  FOR SELECT USING (status = 'open');

CREATE POLICY "Admins gerenciam vagas" ON job_postings
  FOR ALL USING (public.is_admin());

CREATE POLICY "Alunos veem próprias candidaturas" ON job_applications
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Alunos criam candidaturas" ON job_applications
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Admins gerenciam candidaturas" ON job_applications
  FOR ALL USING (public.is_admin());

CREATE POLICY "Aluno gerencia próprio perfil no banco de talentos" ON talent_bank
  FOR ALL USING (student_id = auth.uid());

CREATE POLICY "Admins veem banco de talentos" ON talent_bank
  FOR SELECT USING (public.is_admin());

-- ============================================================
-- FASE 3 — CRM COMERCIAL
-- ============================================================
ALTER TABLE sales_funnel_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins gerenciam funil de vendas" ON sales_funnel_stages
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins gerenciam leads" ON leads
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins gerenciam interações de leads" ON lead_interactions
  FOR ALL USING (public.is_admin());

-- ============================================================
-- FASE 4 — CONSULTORIA CORPORATIVA
-- ============================================================
ALTER TABLE consulting_engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE consulting_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins gerenciam consultorias" ON consulting_engagements
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins gerenciam relatórios de consultoria" ON consulting_reports
  FOR ALL USING (public.is_admin());
