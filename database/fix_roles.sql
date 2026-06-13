-- ============================================================
-- CORREÇÃO RÁPIDA: Definir roles corretos para usuários existentes
-- Execute no Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Corrige o admin
UPDATE public.user_profiles
SET role = 'admin', name = 'Admin Geral'
WHERE email = 'admin@welderefusion.com.br';

-- Corrige o instrutor (se existir)
UPDATE public.user_profiles
SET role = 'instructor'
WHERE email = 'instrutor@welderefusion.com.br';

-- Corrige o cliente industrial (se existir)
UPDATE public.user_profiles
SET role = 'industrial_client'
WHERE email = 'industrial@welderefusion.com.br';

-- Confirma os resultados
SELECT id, email, name, role, created_at
FROM public.user_profiles
WHERE email IN (
  'admin@welderefusion.com.br',
  'instrutor@welderefusion.com.br',
  'aluno@welderefusion.com.br',
  'industrial@welderefusion.com.br'
)
ORDER BY role;
