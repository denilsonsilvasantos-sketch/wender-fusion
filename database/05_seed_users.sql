-- ============================================================
-- SEED: Usuários de Teste — Welder & Fusion
-- Execute no Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Habilita pgcrypto se não estiver ativo
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  uid_admin       uuid := gen_random_uuid();
  uid_instrutor   uuid := gen_random_uuid();
  uid_aluno       uuid := gen_random_uuid();
  uid_industrial  uuid := gen_random_uuid();
BEGIN

  -- ── ADMIN ─────────────────────────────────────────────────
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@welderfusion.com.br') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role,
      email, encrypted_password,
      email_confirmed_at, last_sign_in_at,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, recovery_token,
      email_change_token_new, email_change
    ) VALUES (
      uid_admin, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'admin@welderfusion.com.br',
      crypt('Wf@Admin2024', gen_salt('bf')),
      now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"name":"Admin Geral"}'::jsonb,
      now(), now(), '', '', '', ''
    );
    INSERT INTO public.user_profiles (id, email, name, role)
    VALUES (uid_admin, 'admin@welderfusion.com.br', 'Admin Geral', 'admin')
    ON CONFLICT (id) DO UPDATE SET role = 'admin', name = 'Admin Geral';
    RAISE NOTICE 'Criado: admin@welderfusion.com.br';
  ELSE
    RAISE NOTICE 'Já existe: admin@welderfusion.com.br';
  END IF;

  -- ── INSTRUTOR ─────────────────────────────────────────────
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'instrutor@welderfusion.com.br') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role,
      email, encrypted_password,
      email_confirmed_at, last_sign_in_at,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, recovery_token,
      email_change_token_new, email_change
    ) VALUES (
      uid_instrutor, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'instrutor@welderfusion.com.br',
      crypt('Wf@Instrutor2024', gen_salt('bf')),
      now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"name":"Carlos Eduardo"}'::jsonb,
      now(), now(), '', '', '', ''
    );
    INSERT INTO public.user_profiles (id, email, name, role)
    VALUES (uid_instrutor, 'instrutor@welderfusion.com.br', 'Carlos Eduardo', 'instructor')
    ON CONFLICT (id) DO UPDATE SET role = 'instructor', name = 'Carlos Eduardo';
    RAISE NOTICE 'Criado: instrutor@welderfusion.com.br';
  ELSE
    RAISE NOTICE 'Já existe: instrutor@welderfusion.com.br';
  END IF;

  -- ── ALUNO ─────────────────────────────────────────────────
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'aluno@welderfusion.com.br') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role,
      email, encrypted_password,
      email_confirmed_at, last_sign_in_at,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, recovery_token,
      email_change_token_new, email_change
    ) VALUES (
      uid_aluno, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'aluno@welderfusion.com.br',
      crypt('Wf@Aluno2024', gen_salt('bf')),
      now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"name":"João Silva"}'::jsonb,
      now(), now(), '', '', '', ''
    );
    INSERT INTO public.user_profiles (id, email, name, role)
    VALUES (uid_aluno, 'aluno@welderfusion.com.br', 'João Silva', 'student')
    ON CONFLICT (id) DO UPDATE SET role = 'student', name = 'João Silva';
    RAISE NOTICE 'Criado: aluno@welderfusion.com.br';
  ELSE
    RAISE NOTICE 'Já existe: aluno@welderfusion.com.br';
  END IF;

  -- ── CLIENTE INDUSTRIAL ────────────────────────────────────
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'industrial@welderfusion.com.br') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role,
      email, encrypted_password,
      email_confirmed_at, last_sign_in_at,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, recovery_token,
      email_change_token_new, email_change
    ) VALUES (
      uid_industrial, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'industrial@welderfusion.com.br',
      crypt('Wf@Industrial2024', gen_salt('bf')),
      now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"name":"Metalúrgica ABC Ltda"}'::jsonb,
      now(), now(), '', '', '', ''
    );
    INSERT INTO public.user_profiles (id, email, name, role)
    VALUES (uid_industrial, 'industrial@welderfusion.com.br', 'Metalúrgica ABC Ltda', 'industrial_client')
    ON CONFLICT (id) DO UPDATE SET role = 'industrial_client', name = 'Metalúrgica ABC Ltda';
    RAISE NOTICE 'Criado: industrial@welderfusion.com.br';
  ELSE
    RAISE NOTICE 'Já existe: industrial@welderfusion.com.br';
  END IF;

END $$;
