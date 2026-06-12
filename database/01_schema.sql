-- ============================================================
-- WELDER & FUSION PORTAL - DATABASE SCHEMA
-- Execute este arquivo no SQL Editor do Supabase
-- ============================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- PERFIS DE USUÁRIOS
-- ============================================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  bio TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin', 'industrial_client')),
  asaas_customer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CURSOS
-- ============================================================
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  full_description TEXT,
  thumbnail_url TEXT,
  instructor_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  duration_hours INTEGER,
  level TEXT DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  min_attendance_percentage INTEGER NOT NULL DEFAULT 75 CHECK (min_attendance_percentage BETWEEN 0 AND 100),
  min_grade NUMERIC(4,2) NOT NULL DEFAULT 6.0,
  max_students INTEGER,
  prerequisites TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MÓDULOS DOS CURSOS
-- ============================================================
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- AULAS
-- ============================================================
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  pdf_url TEXT,
  video_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  duration_minutes INTEGER,
  is_free_preview BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MATRÍCULAS
-- ============================================================
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(student_id, course_id)
);

-- ============================================================
-- PROGRESSO NAS AULAS
-- ============================================================
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, lesson_id)
);

-- ============================================================
-- PAGAMENTOS
-- ============================================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE SET NULL,
  asaas_payment_id TEXT UNIQUE,
  asaas_customer_id TEXT,
  amount NUMERIC(10,2) NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('boleto', 'pix', 'credit_card')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'received', 'overdue', 'refunded', 'cancelled')),
  due_date DATE,
  paid_at TIMESTAMPTZ,
  invoice_url TEXT,
  bank_slip_url TEXT,
  pix_code TEXT,
  description TEXT,
  installment_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CERTIFICADOS
-- ============================================================
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  certificate_number TEXT UNIQUE NOT NULL,
  validation_code TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(8), 'hex'),
  qr_code_url TEXT,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  pdf_url TEXT,
  revoked BOOLEAN NOT NULL DEFAULT false,
  revoked_at TIMESTAMPTZ,
  revoked_reason TEXT,
  UNIQUE(student_id, course_id)
);

-- ============================================================
-- MÉTRICAS DE AVALIAÇÃO (configuráveis por curso)
-- ============================================================
CREATE TABLE evaluation_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  max_score NUMERIC(4,2) NOT NULL DEFAULT 10,
  weight NUMERIC(4,2) NOT NULL DEFAULT 1,
  type TEXT NOT NULL DEFAULT 'practical' CHECK (type IN ('theoretical', 'practical')),
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- AVALIAÇÕES
-- ============================================================
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  metric_id UUID NOT NULL REFERENCES evaluation_metrics(id) ON DELETE CASCADE,
  score NUMERIC(4,2) NOT NULL,
  feedback TEXT,
  evaluated_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  evaluated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, metric_id)
);

-- ============================================================
-- CONTROLE DE PRESENÇA
-- ============================================================
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  present BOOLEAN NOT NULL DEFAULT false,
  justification TEXT,
  recorded_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, lesson_id)
);

-- ============================================================
-- GAMIFICAÇÃO - ATIVIDADES
-- ============================================================
CREATE TABLE gamification_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  points INTEGER NOT NULL DEFAULT 0,
  type TEXT NOT NULL CHECK (type IN ('weld_attempt', 'product_test', 'lesson_complete', 'evaluation_pass', 'perfect_attendance', 'course_complete')),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- GAMIFICAÇÃO - LOGS
-- ============================================================
CREATE TABLE gamification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  activity_id UUID NOT NULL REFERENCES gamification_activities(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  points INTEGER NOT NULL DEFAULT 0,
  result TEXT CHECK (result IN ('correct', 'incorrect', 'partial')),
  notes TEXT,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CLIENTES DE SERVIÇO
-- ============================================================
CREATE TABLE service_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  document TEXT,
  document_type TEXT CHECK (document_type IN ('cpf', 'cnpj')),
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  notes TEXT,
  asaas_customer_id TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- COTAÇÕES DE SERVIÇO
-- ============================================================
CREATE TABLE quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES service_clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'approved', 'rejected', 'expired')),
  valid_until DATE,
  total_amount NUMERIC(10,2) DEFAULT 0,
  notes TEXT,
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ITENS DA COTAÇÃO
-- ============================================================
CREATE TABLE quotation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
  unit TEXT DEFAULT 'un',
  unit_price NUMERIC(10,2) NOT NULL,
  total_price NUMERIC(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- ============================================================
-- ORDENS DE SERVIÇO
-- ============================================================
CREATE TABLE service_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES service_clients(id) ON DELETE CASCADE,
  quotation_id UUID REFERENCES quotations(id) ON DELETE SET NULL,
  os_number TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  labor_cost NUMERIC(10,2) DEFAULT 0,
  materials_cost NUMERIC(10,2) DEFAULT 0,
  total_cost NUMERIC(10,2) DEFAULT 0,
  notes TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  assigned_to UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- HISTÓRICO DE ORDENS DE SERVIÇO
-- ============================================================
CREATE TABLE service_order_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_order_id UUID NOT NULL REFERENCES service_orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  notes TEXT,
  changed_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- FATURAS DE SERVIÇO
-- ============================================================
CREATE TABLE service_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_order_id UUID NOT NULL REFERENCES service_orders(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES service_clients(id),
  asaas_payment_id TEXT UNIQUE,
  amount NUMERIC(10,2) NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('boleto', 'pix', 'credit_card')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'received', 'overdue', 'cancelled')),
  due_date DATE,
  paid_at TIMESTAMPTZ,
  invoice_url TEXT,
  bank_slip_url TEXT,
  pix_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================================
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_lesson_progress_student ON lesson_progress(student_id);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_course ON attendance(course_id);
CREATE INDEX idx_payments_student ON payments(student_id);
CREATE INDEX idx_gamification_logs_student ON gamification_logs(student_id);
CREATE INDEX idx_service_orders_client ON service_orders(client_id);
CREATE INDEX idx_service_orders_status ON service_orders(status);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_lessons_course ON lessons(course_id);
CREATE INDEX idx_lessons_module ON lessons(module_id);

-- ============================================================
-- FASE 2 — EMPREGABILIDADE
-- ============================================================

CREATE TABLE partner_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  website TEXT,
  document TEXT,
  document_type TEXT CHECK (document_type IN ('cpf', 'cnpj')),
  industry TEXT,
  city TEXT,
  state TEXT,
  description TEXT,
  logo_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES partner_companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  requirements TEXT,
  benefits TEXT,
  salary_min NUMERIC(10,2),
  salary_max NUMERIC(10,2),
  location TEXT,
  job_type TEXT CHECK (job_type IN ('clt', 'pj', 'temporario', 'estagio')),
  modality TEXT CHECK (modality IN ('presencial', 'remoto', 'hibrido')),
  level TEXT CHECK (level IN ('junior', 'pleno', 'senior', 'especialista')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'paused')),
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'viewed', 'shortlisted', 'hired', 'rejected')),
  cover_letter TEXT,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(job_id, student_id)
);

CREATE TABLE talent_bank (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL UNIQUE REFERENCES user_profiles(id) ON DELETE CASCADE,
  professional_title TEXT,
  summary TEXT,
  skills TEXT[],
  experience_years INTEGER,
  available_for TEXT CHECK (available_for IN ('clt', 'pj', 'both', 'not_available')),
  location TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  resume_url TEXT,
  visible BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- FASE 3 — CRM COMERCIAL
-- ============================================================

CREATE TABLE sales_funnel_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  color TEXT NOT NULL DEFAULT '#FF8C00',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  source TEXT CHECK (source IN ('website', 'whatsapp', 'instagram', 'facebook', 'indicacao', 'outro')),
  stage_id UUID REFERENCES sales_funnel_stages(id) ON DELETE SET NULL,
  course_interest UUID REFERENCES courses(id) ON DELETE SET NULL,
  notes TEXT,
  assigned_to UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  converted BOOLEAN NOT NULL DEFAULT false,
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lead_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('call', 'email', 'whatsapp', 'meeting', 'note')),
  notes TEXT,
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- FASE 4 — CONSULTORIA CORPORATIVA
-- ============================================================

CREATE TABLE consulting_engagements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_document TEXT,
  client_email TEXT,
  client_phone TEXT,
  type TEXT NOT NULL CHECK (type IN ('training', 'audit', 'consulting', 'inspection')),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'proposal' CHECK (status IN ('proposal', 'active', 'paused', 'completed', 'cancelled')),
  contract_url TEXT,
  start_date DATE,
  end_date DATE,
  value NUMERIC(10,2),
  assigned_to UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE consulting_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id UUID NOT NULL REFERENCES consulting_engagements(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  pdf_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ÍNDICES FASES 2-4
-- ============================================================
CREATE INDEX idx_job_postings_company ON job_postings(company_id);
CREATE INDEX idx_job_postings_status ON job_postings(status);
CREATE INDEX idx_job_applications_student ON job_applications(student_id);
CREATE INDEX idx_job_applications_job ON job_applications(job_id);
CREATE INDEX idx_leads_stage ON leads(stage_id);
CREATE INDEX idx_leads_assigned ON leads(assigned_to);
CREATE INDEX idx_lead_interactions_lead ON lead_interactions(lead_id);
CREATE INDEX idx_consulting_engagements_status ON consulting_engagements(status);
CREATE INDEX idx_consulting_reports_engagement ON consulting_reports(engagement_id);
