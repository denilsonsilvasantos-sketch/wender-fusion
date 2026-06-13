-- ============================================================
-- ATUALIZAR CREDENCIAIS DE TESTE — Welder & Fusion
-- Use este script se já executou o seed antigo (welderfusion.com.br)
-- e precisa migrar para os novos e-mails (welderefusion.com.br)
-- ============================================================
-- ATENÇÃO: Execute no Supabase SQL Editor como service_role
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ── 1. Atualizar e-mails e senhas em auth.users ──────────────

-- Admin
UPDATE auth.users
SET
  email             = 'admin@welderefusion.com.br',
  encrypted_password = crypt('admin123', gen_salt('bf')),
  updated_at        = now()
WHERE email = 'admin@welderfusion.com.br';

-- Instrutor
UPDATE auth.users
SET
  email             = 'instrutor@welderefusion.com.br',
  encrypted_password = crypt('instrutor123', gen_salt('bf')),
  updated_at        = now()
WHERE email = 'instrutor@welderfusion.com.br';

-- Aluno
UPDATE auth.users
SET
  email             = 'aluno@welderefusion.com.br',
  encrypted_password = crypt('aluno123', gen_salt('bf')),
  updated_at        = now()
WHERE email = 'aluno@welderfusion.com.br';

-- Cliente Industrial
UPDATE auth.users
SET
  email             = 'industrial@welderefusion.com.br',
  encrypted_password = crypt('industrial123', gen_salt('bf')),
  updated_at        = now()
WHERE email = 'industrial@welderfusion.com.br';

-- ── 2. Atualizar e-mails em user_profiles ───────────────────

UPDATE public.user_profiles SET email = 'admin@welderefusion.com.br',       role = 'admin'            WHERE email = 'admin@welderfusion.com.br';
UPDATE public.user_profiles SET email = 'instrutor@welderefusion.com.br',   role = 'instructor'       WHERE email = 'instrutor@welderfusion.com.br';
UPDATE public.user_profiles SET email = 'aluno@welderefusion.com.br',       role = 'student'          WHERE email = 'aluno@welderfusion.com.br';
UPDATE public.user_profiles SET email = 'industrial@welderefusion.com.br',  role = 'industrial_client' WHERE email = 'industrial@welderfusion.com.br';

-- ── 3. Confirmação ──────────────────────────────────────────

SELECT
  u.email        AS auth_email,
  p.email        AS profile_email,
  p.role,
  p.name,
  u.updated_at
FROM auth.users u
JOIN public.user_profiles p ON p.id = u.id
WHERE u.email IN (
  'admin@welderefusion.com.br',
  'instrutor@welderefusion.com.br',
  'aluno@welderefusion.com.br',
  'industrial@welderefusion.com.br'
)
ORDER BY p.role;
