-- ============================================================
-- WELDER & FUSION — MIGRATION 09
-- Validação pública de certificados + tabelas do modo instrutor
-- Execute no Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- ============================================================
-- 0. FUNÇÃO AUXILIAR updated_at (idempotente — já existe no 03_functions_triggers.sql)
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ============================================================
-- 1. FUNÇÃO PÚBLICA DE VALIDAÇÃO DE CERTIFICADO
-- ============================================================
-- SECURITY DEFINER: executa como owner (bypassa RLS) mas só
-- retorna os campos necessários para validação pública.
-- Permite que usuários anônimos validem certificados sem
-- expor dados sensíveis da tabela certificates.

CREATE OR REPLACE FUNCTION public.validate_certificate(p_code TEXT)
RETURNS TABLE (
  valid            BOOLEAN,
  certificate_number TEXT,
  validation_code  TEXT,
  student_name     TEXT,
  course_title     TEXT,
  course_hours     INTEGER,
  issued_at        TIMESTAMPTZ,
  revoked          BOOLEAN,
  revoked_reason   TEXT
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    NOT c.revoked                           AS valid,
    c.certificate_number,
    c.validation_code,
    p.name                                  AS student_name,
    co.title                                AS course_title,
    co.duration_hours                       AS course_hours,
    c.issued_at,
    c.revoked,
    c.revoked_reason
  FROM  certificates  c
  JOIN  user_profiles p  ON p.id  = c.student_id
  JOIN  courses       co ON co.id = c.course_id
  WHERE c.validation_code   = UPPER(TRIM(p_code))
     OR c.certificate_number = UPPER(TRIM(p_code))
  LIMIT 1;
END;
$$;

-- Concede permissão de execução a usuários anônimos e autenticados
GRANT EXECUTE ON FUNCTION public.validate_certificate(TEXT) TO anon, authenticated;


-- ============================================================
-- 2. POLÍTICA RLS DE LEITURA PARA INSTRUTORES
-- ============================================================
-- Instrutores precisam ver todos os certificados de suas turmas
-- (além da policy de admin que já existe)

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'certificates'
      AND policyname = 'Instrutores veem certificados das turmas'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Instrutores veem certificados das turmas"
        ON certificates FOR SELECT
        USING (
          public.user_role() = 'instructor'
          AND EXISTS (
            SELECT 1 FROM enrollments e
            JOIN courses co ON co.id = e.course_id
            WHERE e.id = certificates.enrollment_id
              AND co.instructor_id = auth.uid()
          )
        )
    $policy$;
  END IF;
END $$;


-- ============================================================
-- 3. TABELA: PARECERES TÉCNICOS DO INSTRUTOR
-- ============================================================
-- Documentos técnicos emitidos pelo instrutor para um aluno,
-- destinados a uso externo (contratantes, inspetorias, etc.)

CREATE TABLE IF NOT EXISTS instructor_technical_opinions (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID       NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  student_id    UUID       NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  type          TEXT       NOT NULL CHECK (type IN (
                             'aptidao_tecnica',
                             'qualificacao_processo',
                             'avaliacao_desempenho',
                             'laudo_competencia'
                           )),
  status        TEXT       NOT NULL DEFAULT 'rascunho'
                           CHECK (status IN ('rascunho', 'emitido', 'entregue')),
  numero        TEXT       UNIQUE,                  -- ex.: PT-2026-001
  conteudo      TEXT,                               -- texto do parecer
  issued_at     TIMESTAMPTZ,
  valid_until   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE instructor_technical_opinions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Instrutor gerencia próprios pareceres"
  ON instructor_technical_opinions FOR ALL
  USING (instructor_id = auth.uid());

CREATE POLICY "Aluno vê próprios pareceres"
  ON instructor_technical_opinions FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Admins gerenciam pareceres"
  ON instructor_technical_opinions FOR ALL
  USING (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_ito_instructor ON instructor_technical_opinions(instructor_id);
CREATE INDEX IF NOT EXISTS idx_ito_student    ON instructor_technical_opinions(student_id);

-- Auto-update updated_at
CREATE OR REPLACE TRIGGER update_ito_updated_at
  BEFORE UPDATE ON instructor_technical_opinions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
-- 4. TABELA: RECOMENDAÇÕES DO INSTRUTOR
-- ============================================================
-- Cartas/indicações escritas pelo instrutor para vagas de emprego

CREATE TABLE IF NOT EXISTS instructor_recommendations (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id  UUID       NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  student_id     UUID       NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  empresa        TEXT       NOT NULL,
  cargo          TEXT       NOT NULL,
  status         TEXT       NOT NULL DEFAULT 'rascunho'
                            CHECK (status IN ('rascunho', 'enviada', 'aceita')),
  texto          TEXT,
  sent_at        TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE instructor_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Instrutor gerencia próprias recomendações"
  ON instructor_recommendations FOR ALL
  USING (instructor_id = auth.uid());

CREATE POLICY "Aluno vê próprias recomendações"
  ON instructor_recommendations FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Admins gerenciam recomendações"
  ON instructor_recommendations FOR ALL
  USING (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_ir_instructor ON instructor_recommendations(instructor_id);
CREATE INDEX IF NOT EXISTS idx_ir_student    ON instructor_recommendations(student_id);

CREATE OR REPLACE TRIGGER update_ir_updated_at
  BEFORE UPDATE ON instructor_recommendations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
-- 5. SEED: CERTIFICADOS DE DEMONSTRAÇÃO
-- ============================================================
-- Insere certificados com códigos memoráveis para testar
-- a página /validar. Executa apenas se existirem alunos e
-- cursos cadastrados (não falha se o banco estiver vazio).

DO $$
DECLARE
  v_student_id  UUID;
  v_course_id   UUID;
  v_enroll_id   UUID;
  v_student2_id UUID;
  v_course2_id  UUID;
  v_enroll2_id  UUID;
BEGIN

  -- Busca o primeiro aluno e curso disponíveis
  SELECT id INTO v_student_id FROM user_profiles WHERE role = 'student'  LIMIT 1;
  SELECT id INTO v_course_id  FROM courses        WHERE status = 'published' LIMIT 1;

  IF v_student_id IS NOT NULL AND v_course_id IS NOT NULL THEN

    -- Garante matrícula concluída para o certificado demo
    INSERT INTO enrollments (student_id, course_id, status, progress_pct, completed_at)
    VALUES (v_student_id, v_course_id, 'completed', 100, NOW())
    ON CONFLICT (student_id, course_id) DO UPDATE
      SET status = 'completed', completed_at = COALESCE(enrollments.completed_at, NOW())
    RETURNING id INTO v_enroll_id;

    IF v_enroll_id IS NULL THEN
      SELECT id INTO v_enroll_id FROM enrollments
      WHERE student_id = v_student_id AND course_id = v_course_id LIMIT 1;
    END IF;

    -- Certificado de demonstração #1 (VÁLIDO)
    INSERT INTO certificates (
      student_id, course_id, enrollment_id,
      certificate_number, validation_code, issued_at
    )
    VALUES (
      v_student_id, v_course_id, v_enroll_id,
      'WF-2026-001', 'WF-2026-001', NOW() - INTERVAL '5 days'
    )
    ON CONFLICT (certificate_number) DO NOTHING;

  END IF;

  -- Busca segundo aluno para segundo certificado (REVOGADO)
  SELECT id INTO v_student2_id FROM user_profiles WHERE role = 'student' OFFSET 1 LIMIT 1;
  SELECT id INTO v_course2_id  FROM courses WHERE status = 'published' OFFSET 1 LIMIT 1;

  IF v_student2_id IS NULL THEN
    v_student2_id := v_student_id;  -- reusa o mesmo aluno se só tiver um
  END IF;
  IF v_course2_id IS NULL THEN
    v_course2_id := v_course_id;
  END IF;

  IF v_student2_id IS NOT NULL AND v_course2_id IS NOT NULL THEN

    INSERT INTO enrollments (student_id, course_id, status, progress_pct, completed_at)
    VALUES (v_student2_id, v_course2_id, 'completed', 100, NOW())
    ON CONFLICT (student_id, course_id) DO UPDATE
      SET status = 'completed', completed_at = COALESCE(enrollments.completed_at, NOW())
    RETURNING id INTO v_enroll2_id;

    IF v_enroll2_id IS NULL THEN
      SELECT id INTO v_enroll2_id FROM enrollments
      WHERE student_id = v_student2_id AND course_id = v_course2_id LIMIT 1;
    END IF;

    -- Certificado de demonstração #REV (REVOGADO — para testar fluxo inválido)
    INSERT INTO certificates (
      student_id, course_id, enrollment_id,
      certificate_number, validation_code,
      issued_at, revoked, revoked_at, revoked_reason
    )
    VALUES (
      v_student2_id, v_course2_id, v_enroll2_id,
      'WF-2026-REV', 'WF-2026-REV',
      NOW() - INTERVAL '10 days',
      TRUE, NOW() - INTERVAL '2 days',
      'Frequência mínima não atingida (70% < 75%)'
    )
    ON CONFLICT (certificate_number) DO NOTHING;

  END IF;

END $$;


-- ============================================================
-- 6. ÍNDICES PARA PERFORMANCE DE VALIDAÇÃO
-- ============================================================
-- A busca por validation_code e certificate_number precisa
-- ser rápida mesmo com milhares de certificados.

CREATE INDEX IF NOT EXISTS idx_certificates_validation_code
  ON certificates(validation_code);

CREATE INDEX IF NOT EXISTS idx_certificates_number
  ON certificates(certificate_number);


-- ============================================================
-- RESUMO DO QUE ESTA MIGRATION FAZ
-- ============================================================
--
-- ✅ validate_certificate(p_code) — função pública SECURITY DEFINER
--    Chamada pelo frontend via supabase.rpc('validate_certificate', {p_code})
--    Aceita tanto validation_code quanto certificate_number
--    Retorna: valid, student_name, course_title, course_hours, issued_at,
--             certificate_number, validation_code, revoked, revoked_reason
--
-- ✅ RLS: instrutores podem ver certificados de suas turmas
--
-- ✅ instructor_technical_opinions — pareceres técnicos emitidos pelo instrutor
--
-- ✅ instructor_recommendations — cartas de recomendação do instrutor
--
-- ✅ Seed: WF-2026-001 (válido) e WF-2026-REV (revogado) para testes
--
-- ✅ Índices em validation_code e certificate_number para busca rápida
--
-- COMO TESTAR APÓS RODAR:
--   SELECT * FROM public.validate_certificate('WF-2026-001');
--   SELECT * FROM public.validate_certificate('WF-2026-REV');
-- ============================================================
