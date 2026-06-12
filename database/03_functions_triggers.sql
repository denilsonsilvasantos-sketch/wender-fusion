-- ============================================================
-- WELDER & FUSION PORTAL - FUNCTIONS & TRIGGERS
-- Execute após as policies (02_rls_policies.sql)
-- ============================================================

-- ============================================================
-- TRIGGER: Criar perfil automaticamente ao registrar usuário
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    'student'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- TRIGGER: Atualizar updated_at automaticamente
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER update_service_clients_updated_at
  BEFORE UPDATE ON service_clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER update_quotations_updated_at
  BEFORE UPDATE ON quotations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER update_service_orders_updated_at
  BEFORE UPDATE ON service_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER update_partner_companies_updated_at
  BEFORE UPDATE ON partner_companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER update_job_postings_updated_at
  BEFORE UPDATE ON job_postings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER update_talent_bank_updated_at
  BEFORE UPDATE ON talent_bank
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER update_consulting_engagements_updated_at
  BEFORE UPDATE ON consulting_engagements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER update_consulting_reports_updated_at
  BEFORE UPDATE ON consulting_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- TRIGGER: Gerar número de O.S. automático
-- ============================================================
CREATE SEQUENCE IF NOT EXISTS os_number_seq START 1000;

CREATE OR REPLACE FUNCTION generate_os_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.os_number IS NULL OR NEW.os_number = '' THEN
    NEW.os_number = 'OS-' || LPAD(nextval('os_number_seq')::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER set_os_number
  BEFORE INSERT ON service_orders
  FOR EACH ROW EXECUTE FUNCTION generate_os_number();

-- ============================================================
-- TRIGGER: Registrar histórico ao alterar status de O.S.
-- ============================================================
CREATE OR REPLACE FUNCTION log_os_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO service_order_history (service_order_id, status, changed_by)
    VALUES (NEW.id, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_service_order_status_change
  AFTER UPDATE ON service_orders
  FOR EACH ROW EXECUTE FUNCTION log_os_status_change();

-- ============================================================
-- FUNÇÃO: Calcular progresso do aluno no curso
-- ============================================================
CREATE OR REPLACE FUNCTION get_course_progress(p_student_id UUID, p_course_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_lessons
  FROM lessons WHERE course_id = p_course_id;

  SELECT COUNT(*) INTO completed_lessons
  FROM lesson_progress
  WHERE student_id = p_student_id
    AND course_id = p_course_id
    AND completed = true;

  IF total_lessons = 0 THEN RETURN 0; END IF;
  RETURN ROUND((completed_lessons::NUMERIC / total_lessons::NUMERIC) * 100, 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================
-- FUNÇÃO: Calcular percentual de presença
-- ============================================================
CREATE OR REPLACE FUNCTION get_attendance_percentage(p_student_id UUID, p_course_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  total_lessons INTEGER;
  present_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_lessons
  FROM lessons WHERE course_id = p_course_id;

  SELECT COUNT(*) INTO present_count
  FROM attendance
  WHERE student_id = p_student_id
    AND course_id = p_course_id
    AND present = true;

  IF total_lessons = 0 THEN RETURN 0; END IF;
  RETURN ROUND((present_count::NUMERIC / total_lessons::NUMERIC) * 100, 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================
-- FUNÇÃO: Calcular nota média ponderada do aluno
-- ============================================================
CREATE OR REPLACE FUNCTION get_student_average_grade(p_student_id UUID, p_course_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  avg_grade NUMERIC;
BEGIN
  SELECT
    SUM(e.score * em.weight) / NULLIF(SUM(em.weight), 0)
  INTO avg_grade
  FROM evaluations e
  JOIN evaluation_metrics em ON em.id = e.metric_id
  WHERE e.student_id = p_student_id AND e.course_id = p_course_id;

  RETURN COALESCE(ROUND(avg_grade, 2), 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================
-- FUNÇÃO: Verificar elegibilidade para certificado
-- ============================================================
CREATE OR REPLACE FUNCTION check_certificate_eligibility(p_student_id UUID, p_course_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_min_attendance INTEGER;
  v_min_grade NUMERIC;
  v_attendance NUMERIC;
  v_grade NUMERIC;
BEGIN
  SELECT min_attendance_percentage, min_grade
  INTO v_min_attendance, v_min_grade
  FROM courses WHERE id = p_course_id;

  v_attendance := get_attendance_percentage(p_student_id, p_course_id);
  v_grade := get_student_average_grade(p_student_id, p_course_id);

  RETURN v_attendance >= v_min_attendance AND v_grade >= v_min_grade;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================
-- FUNÇÃO: Total de pontos de gamificação do aluno
-- ============================================================
CREATE OR REPLACE FUNCTION get_student_points(p_student_id UUID, p_course_id UUID DEFAULT NULL)
RETURNS INTEGER AS $$
DECLARE
  total_points INTEGER;
BEGIN
  IF p_course_id IS NOT NULL THEN
    SELECT COALESCE(SUM(points), 0) INTO total_points
    FROM gamification_logs
    WHERE student_id = p_student_id AND course_id = p_course_id;
  ELSE
    SELECT COALESCE(SUM(points), 0) INTO total_points
    FROM gamification_logs
    WHERE student_id = p_student_id;
  END IF;
  RETURN total_points;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================
-- VIEW: Dashboard do admin (métricas gerais)
-- ============================================================
CREATE OR REPLACE VIEW admin_dashboard_metrics AS
SELECT
  (SELECT COUNT(*) FROM user_profiles WHERE role = 'student') AS total_students,
  (SELECT COUNT(*) FROM courses WHERE status = 'published') AS published_courses,
  (SELECT COUNT(*) FROM enrollments WHERE status = 'active') AS active_enrollments,
  (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status IN ('confirmed', 'received')) AS total_revenue,
  (SELECT COUNT(*) FROM service_orders WHERE status = 'in_progress') AS active_service_orders,
  (SELECT COUNT(*) FROM service_orders WHERE status = 'pending') AS pending_service_orders,
  (SELECT COUNT(*) FROM job_postings WHERE status = 'open') AS open_job_postings,
  (SELECT COUNT(*) FROM leads WHERE converted = false) AS open_leads,
  (SELECT COUNT(*) FROM consulting_engagements WHERE status = 'active') AS active_consultings;

-- ============================================================
-- FUNÇÃO: Sementes do funil de vendas (etapas padrão)
-- ============================================================
CREATE OR REPLACE FUNCTION seed_default_funnel_stages()
RETURNS VOID AS $$
BEGIN
  INSERT INTO sales_funnel_stages (name, description, order_index, color) VALUES
    ('Novo Lead',      'Lead recém-captado, sem contato ainda',         0, '#6B7280'),
    ('Contato Feito',  'Primeiro contato realizado',                     1, '#3B82F6'),
    ('Proposta',       'Proposta de matrícula ou curso enviada',         2, '#F59E0B'),
    ('Negociação',     'Em negociação de valores ou condições',          3, '#8B5CF6'),
    ('Matriculado',    'Lead convertido em matrícula efetiva',           4, '#10B981'),
    ('Perdido',        'Lead encerrado sem conversão',                   5, '#EF4444')
  ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql;

SELECT seed_default_funnel_stages();
