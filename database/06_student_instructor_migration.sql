-- ============================================================
-- MIGRATION 06 — PORTAL DO ALUNO & INSTRUTOR
-- Execute no SQL Editor do Supabase APÓS 01..05
-- ============================================================

-- ============================================================
-- 1. ATTENDANCE — adicionar status de 4 tipos
--    Antes: apenas present BOOLEAN
--    Agora: presente / falta / falta_justificada / atraso
-- ============================================================

ALTER TABLE attendance
  ADD COLUMN IF NOT EXISTS attendance_status TEXT
    DEFAULT 'presente'
    CHECK (attendance_status IN ('presente', 'falta', 'falta_justificada', 'atraso'));

-- Migrar dados existentes (não quebra linhas antigas)
UPDATE attendance
SET attendance_status = CASE WHEN present = true THEN 'presente' ELSE 'falta' END
WHERE attendance_status IS NULL;

-- Trigger para manter present (BOOLEAN) sincronizado com attendance_status
-- presente/atraso = contabiliza presença; falta/justificada = ausência
CREATE OR REPLACE FUNCTION sync_attendance_present()
RETURNS TRIGGER AS $$
BEGIN
  NEW.present := (NEW.attendance_status IN ('presente', 'atraso'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER sync_attendance_present_trigger
  BEFORE INSERT OR UPDATE ON attendance
  FOR EACH ROW EXECUTE FUNCTION sync_attendance_present();

-- ============================================================
-- 2. GAMIFICATION_ACTIVITIES — expandir tipos permitidos
--    Adicionados: certificate_earned, curriculum_complete,
--    application_sent, practical_evaluation, weekly_attendance,
--    module_complete
-- ============================================================

ALTER TABLE gamification_activities
  DROP CONSTRAINT IF EXISTS gamification_activities_type_check;

ALTER TABLE gamification_activities
  ADD CONSTRAINT gamification_activities_type_check
    CHECK (type IN (
      'weld_attempt', 'product_test', 'lesson_complete',
      'evaluation_pass', 'perfect_attendance', 'course_complete',
      'certificate_earned', 'curriculum_complete', 'application_sent',
      'practical_evaluation', 'weekly_attendance', 'module_complete'
    ));

-- Tornar activity_id opcional nos logs (para registros diretos sem
-- atividade pré-cadastrada, ex: "Avaliação Teórica — Nota 8 +24 XP")
ALTER TABLE gamification_logs
  ALTER COLUMN activity_id DROP NOT NULL;

-- ============================================================
-- 3. GAMIFICATION_MEDALS — sistema de medalhas
-- ============================================================

CREATE TABLE IF NOT EXISTS gamification_medals (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code         TEXT UNIQUE NOT NULL,
  nome         TEXT NOT NULL,
  descricao    TEXT,
  emoji        TEXT NOT NULL DEFAULT '🏅',
  color        TEXT NOT NULL DEFAULT '#F59E0B',
  points_reward INTEGER NOT NULL DEFAULT 0,
  condition_type TEXT CHECK (condition_type IN (
    'manual', 'auto_certificate', 'auto_attendance',
    'auto_grade', 'auto_rank', 'auto_application', 'auto_curriculum'
  )),
  condition_value JSONB,
  active       BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_medals (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  medal_id   UUID NOT NULL REFERENCES gamification_medals(id) ON DELETE CASCADE,
  earned_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, medal_id)
);

-- ============================================================
-- 4. TALENT_BANK — expandir campos para Meu Currículo
--    objetivo, telefone, cidade e visibility já expõem no portal
-- ============================================================

ALTER TABLE talent_bank ADD COLUMN IF NOT EXISTS objetivo        TEXT;
ALTER TABLE talent_bank ADD COLUMN IF NOT EXISTS telefone        TEXT;
ALTER TABLE talent_bank ADD COLUMN IF NOT EXISTS cidade          TEXT;
ALTER TABLE talent_bank ADD COLUMN IF NOT EXISTS completion_pct  INTEGER DEFAULT 0
  CHECK (completion_pct BETWEEN 0 AND 100);

-- visibility substituindo o campo visible (mantém retrocompat.)
ALTER TABLE talent_bank ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'empresas'
  CHECK (visibility IN ('publico', 'empresas', 'privado'));

-- Sincronizar: visible=true quando visibility != privado
CREATE OR REPLACE FUNCTION sync_talent_bank_visibility()
RETURNS TRIGGER AS $$
BEGIN
  NEW.visible := (NEW.visibility != 'privado');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER sync_talent_bank_visibility_trigger
  BEFORE INSERT OR UPDATE ON talent_bank
  FOR EACH ROW EXECUTE FUNCTION sync_talent_bank_visibility();

-- ============================================================
-- 5. CURRICULUM_SKILLS — habilidades técnicas estruturadas
--    (skills TEXT[] no talent_bank era genérico demais)
-- ============================================================

CREATE TABLE IF NOT EXISTS curriculum_skills (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  skill_name  TEXT NOT NULL,
  nivel       TEXT NOT NULL DEFAULT 'basico'
    CHECK (nivel IN ('basico', 'intermediario', 'avancado', 'especialista')),
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, skill_name)
);

-- ============================================================
-- 6. CURRICULUM_EXPERIENCE — experiência profissional
-- ============================================================

CREATE TABLE IF NOT EXISTS curriculum_experience (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  empresa     TEXT NOT NULL,
  cargo       TEXT NOT NULL,
  inicio      DATE,
  fim         DATE,    -- NULL = emprego atual
  descricao   TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 7. PRACTICAL_EVALUATIONS — Avaliação Prática de Soldagem
--    (5 grupos, 14 critérios, nota ponderada, laudo PDF)
-- ============================================================

CREATE TABLE IF NOT EXISTS practical_evaluations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  instructor_id   UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  course_id       UUID REFERENCES courses(id) ON DELETE SET NULL,
  enrollment_id   UUID REFERENCES enrollments(id) ON DELETE SET NULL,
  process         TEXT NOT NULL
    CHECK (process IN ('TIG', 'MIG/MAG', 'MIG', 'MAG', 'Eletrodo')),
  evaluation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  final_score     NUMERIC(5,2) NOT NULL CHECK (final_score BETWEEN 0 AND 10),
  recommendation  TEXT NOT NULL
    CHECK (recommendation IN (
      'aprovado', 'aprovado_ressalvas', 'reprovado', 'recomendado_mercado'
    )),
  feedback        TEXT NOT NULL,
  report_code     TEXT UNIQUE NOT NULL DEFAULT '',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS practical_evaluation_scores (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id    UUID NOT NULL REFERENCES practical_evaluations(id) ON DELETE CASCADE,
  criterion_code   TEXT NOT NULL,
  criterion_name   TEXT NOT NULL,
  group_name       TEXT NOT NULL,
  group_weight     NUMERIC(4,2) NOT NULL,
  criterion_weight NUMERIC(4,2) NOT NULL,
  score            INTEGER NOT NULL CHECK (score BETWEEN 1 AND 10),
  UNIQUE(evaluation_id, criterion_code)
);

-- Sequência para código WF-APS-XXXXXX
CREATE SEQUENCE IF NOT EXISTS practical_eval_seq START 1000;

CREATE OR REPLACE FUNCTION generate_report_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.report_code IS NULL OR NEW.report_code = '' THEN
    NEW.report_code := 'WF-APS-' || LPAD(nextval('practical_eval_seq')::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER set_report_code
  BEFORE INSERT ON practical_evaluations
  FOR EACH ROW EXECUTE FUNCTION generate_report_code();

-- ============================================================
-- 8. ÍNDICES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_curriculum_skills_student     ON curriculum_skills(student_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_experience_student ON curriculum_experience(student_id);
CREATE INDEX IF NOT EXISTS idx_practical_evals_student       ON practical_evaluations(student_id);
CREATE INDEX IF NOT EXISTS idx_practical_evals_instructor    ON practical_evaluations(instructor_id);
CREATE INDEX IF NOT EXISTS idx_practical_evals_course        ON practical_evaluations(course_id);
CREATE INDEX IF NOT EXISTS idx_practical_eval_scores_eval    ON practical_evaluation_scores(evaluation_id);
CREATE INDEX IF NOT EXISTS idx_student_medals_student        ON student_medals(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_status_col         ON attendance(attendance_status);

-- ============================================================
-- 9. RLS — habilitar e criar políticas nas novas tabelas
-- ============================================================

ALTER TABLE gamification_medals           ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_medals                ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_skills             ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_experience         ENABLE ROW LEVEL SECURITY;
ALTER TABLE practical_evaluations         ENABLE ROW LEVEL SECURITY;
ALTER TABLE practical_evaluation_scores   ENABLE ROW LEVEL SECURITY;

-- Medalhas (catálogo público)
CREATE POLICY "Medalhas ativas são públicas" ON gamification_medals
  FOR SELECT USING (active = true);
CREATE POLICY "Admins gerenciam medalhas" ON gamification_medals
  FOR ALL USING (public.is_admin());

-- Medalhas do aluno
CREATE POLICY "Alunos veem próprias medalhas" ON student_medals
  FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Admins gerenciam medalhas dos alunos" ON student_medals
  FOR ALL USING (public.is_admin());

-- Habilidades do currículo
CREATE POLICY "Alunos gerenciam próprias habilidades" ON curriculum_skills
  FOR ALL USING (student_id = auth.uid());
CREATE POLICY "Admins veem todas habilidades" ON curriculum_skills
  FOR SELECT USING (public.is_admin());

-- Experiência profissional
CREATE POLICY "Alunos gerenciam própria experiência" ON curriculum_experience
  FOR ALL USING (student_id = auth.uid());
CREATE POLICY "Admins veem toda experiência" ON curriculum_experience
  FOR SELECT USING (public.is_admin());

-- Avaliações práticas — aluno vê as suas, instrutor gerencia as suas
CREATE POLICY "Aluno vê próprias avaliações práticas" ON practical_evaluations
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Instrutor cria avaliações práticas" ON practical_evaluations
  FOR INSERT WITH CHECK (
    instructor_id = auth.uid()
    AND public.user_role() IN ('instructor', 'admin')
  );

CREATE POLICY "Instrutor vê avaliações que criou" ON practical_evaluations
  FOR SELECT USING (instructor_id = auth.uid() OR public.is_admin());

CREATE POLICY "Admins gerenciam avaliações práticas" ON practical_evaluations
  FOR ALL USING (public.is_admin());

-- Scores das avaliações
CREATE POLICY "Acesso a scores de avaliação prática" ON practical_evaluation_scores
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM practical_evaluations pe
      WHERE pe.id = practical_evaluation_scores.evaluation_id
        AND (pe.student_id = auth.uid() OR pe.instructor_id = auth.uid())
    ) OR public.is_admin()
  );

CREATE POLICY "Instrutor insere scores" ON practical_evaluation_scores
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM practical_evaluations pe
      WHERE pe.id = practical_evaluation_scores.evaluation_id
        AND pe.instructor_id = auth.uid()
    )
  );

-- ============================================================
-- 10. TRIGGERS updated_at nas novas tabelas
-- ============================================================

CREATE OR REPLACE TRIGGER update_curriculum_skills_updated_at
  BEFORE UPDATE ON curriculum_skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER update_curriculum_experience_updated_at
  BEFORE UPDATE ON curriculum_experience
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER update_practical_evaluations_updated_at
  BEFORE UPDATE ON practical_evaluations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 11. SEEDS — medalhas padrão do sistema de gamificação
-- ============================================================

INSERT INTO gamification_medals
  (code, nome, descricao, emoji, color, points_reward, condition_type)
VALUES
  ('first_cert',   'Primeiro Certificado', 'Obteve o primeiro certificado da escola',   '🏅', '#F59E0B', 100, 'auto_certificate'),
  ('freq_perfect', 'Frequência Perfeita',  '30 dias consecutivos de presença',          '📅', '#10B981',  50, 'auto_attendance'),
  ('best_grade',   'Nota Máxima',          'Tirou 10 em alguma avaliação',              '💯', '#6366F1',  30, 'auto_grade'),
  ('top3_class',   'Destaque da Turma',    'Ficou no top 3 do ranking da turma',        '🥇', '#FF8C00',  75, 'auto_rank'),
  ('tig_expert',   'TIG Expert',           'Concluiu o curso de soldagem TIG',          '🔵', '#3B82F6',  80, 'auto_certificate'),
  ('mig_expert',   'MIG/MAG Expert',       'Concluiu o curso de soldagem MIG/MAG',      '🟢', '#10B981',  80, 'auto_certificate'),
  ('smaw_expert',  'Eletrodo Expert',      'Concluiu o curso de eletrodo revestido',    '🟡', '#F59E0B',  80, 'auto_certificate'),
  ('employed',     'Empregado!',           'Conseguiu emprego pelo banco de talentos',  '💼', '#8B5CF6', 200, 'manual'),
  ('full_profile', 'Perfil Completo',      'Preencheu 100% do currículo na plataforma', '✅', '#10B981',  20, 'auto_curriculum'),
  ('active_cand',  'Candidato Ativo',      'Enviou 5 ou mais candidaturas',             '🚀', '#6366F1',  50, 'auto_application')
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- RESUMO DO QUE ESTE SCRIPT CRIA/ALTERA
-- ============================================================
-- ALTERADAS:
--   attendance          → +attendance_status (presente/falta/falta_justificada/atraso)
--                         +trigger sincroniza present BOOLEAN
--   gamification_activities → CHECK expandido (8→12 tipos)
--   gamification_logs   → activity_id agora NULLABLE
--   talent_bank         → +objetivo, +telefone, +cidade, +completion_pct, +visibility
--
-- CRIADAS:
--   gamification_medals       (catálogo de medalhas)
--   student_medals            (medalhas conquistadas pelo aluno)
--   curriculum_skills         (habilidades TIG/MIG/etc com nível)
--   curriculum_experience     (histórico profissional)
--   practical_evaluations     (avaliação prática de soldagem — instrutor)
--   practical_evaluation_scores (notas por critério — 14 critérios, 5 grupos)
-- ============================================================
