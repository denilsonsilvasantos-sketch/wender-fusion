-- ============================================================
-- WELDER & FUSION PORTAL - SEED DATA (DADOS INICIAIS)
-- Execute após os triggers (03_functions_triggers.sql)
-- ============================================================

-- NOTA: O usuário admin deve ser criado via Supabase Auth primeiro.
-- Substitua 'SEU_USER_ID_AQUI' pelo UUID do usuário criado.

-- Exemplo de atualização de role para admin (execute após criar o usuário):
-- UPDATE user_profiles SET role = 'admin' WHERE email = 'admin@welderfusion.com.br';

-- ============================================================
-- ATIVIDADES DE GAMIFICAÇÃO PADRÃO
-- ============================================================
INSERT INTO gamification_activities (name, description, points, type) VALUES
  ('Completar Aula', 'Assistiu e completou uma aula do curso', 10, 'lesson_complete'),
  ('Solda Correta', 'Realizou uma solda dentro dos parâmetros corretos', 25, 'weld_attempt'),
  ('Solda com Erro', 'Identificou e registrou erro em tentativa de solda', 5, 'weld_attempt'),
  ('Teste de Produto Correto', 'Acertou teste sobre produto de soldagem', 20, 'product_test'),
  ('Aprovado na Avaliação', 'Obteve nota igual ou superior à mínima exigida', 50, 'evaluation_pass'),
  ('Presença Perfeita', 'Presença em todas as aulas da semana', 30, 'perfect_attendance'),
  ('Curso Concluído', 'Concluiu um curso com todos os requisitos', 200, 'course_complete');

-- ============================================================
-- CURSO DE EXEMPLO
-- ============================================================
-- INSERT INTO courses (title, description, price, duration_hours, level, status, min_attendance_percentage, min_grade)
-- VALUES (
--   'Soldagem MIG/MAG - Básico',
--   'Aprenda os fundamentos da soldagem MIG/MAG do zero. Curso presencial com prática intensiva.',
--   1200.00,
--   80,
--   'beginner',
--   'published',
--   75,
--   6.0
-- );
