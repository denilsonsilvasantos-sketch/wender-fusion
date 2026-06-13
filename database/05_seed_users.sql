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
    RAISE NOTICE 'Criado em auth.users: admin@welderfusion.com.br';
  ELSE
    -- Garante que o uid_admin seja o ID real existente
    SELECT id INTO uid_admin FROM auth.users WHERE email = 'admin@welderfusion.com.br';
    RAISE NOTICE 'Já existe em auth.users: admin@welderfusion.com.br (id=%)', uid_admin;
  END IF;
  -- Sempre garante o perfil com role correto (idempotente)
  INSERT INTO public.user_profiles (id, email, name, role)
  VALUES (uid_admin, 'admin@welderfusion.com.br', 'Admin Geral', 'admin')
  ON CONFLICT (id) DO UPDATE SET role = 'admin', name = 'Admin Geral';

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
    RAISE NOTICE 'Criado em auth.users: instrutor@welderfusion.com.br';
  ELSE
    SELECT id INTO uid_instrutor FROM auth.users WHERE email = 'instrutor@welderfusion.com.br';
    RAISE NOTICE 'Já existe em auth.users: instrutor@welderfusion.com.br (id=%)', uid_instrutor;
  END IF;
  INSERT INTO public.user_profiles (id, email, name, role)
  VALUES (uid_instrutor, 'instrutor@welderfusion.com.br', 'Carlos Eduardo', 'instructor')
  ON CONFLICT (id) DO UPDATE SET role = 'instructor', name = 'Carlos Eduardo';

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
    RAISE NOTICE 'Criado em auth.users: aluno@welderfusion.com.br';
  ELSE
    SELECT id INTO uid_aluno FROM auth.users WHERE email = 'aluno@welderfusion.com.br';
    RAISE NOTICE 'Já existe em auth.users: aluno@welderfusion.com.br (id=%)', uid_aluno;
  END IF;
  INSERT INTO public.user_profiles (id, email, name, role)
  VALUES (uid_aluno, 'aluno@welderfusion.com.br', 'João Silva', 'student')
  ON CONFLICT (id) DO UPDATE SET role = 'student', name = 'João Silva';

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
    RAISE NOTICE 'Criado em auth.users: industrial@welderfusion.com.br';
  ELSE
    SELECT id INTO uid_industrial FROM auth.users WHERE email = 'industrial@welderfusion.com.br';
    RAISE NOTICE 'Já existe em auth.users: industrial@welderfusion.com.br (id=%)', uid_industrial;
  END IF;
  INSERT INTO public.user_profiles (id, email, name, role)
  VALUES (uid_industrial, 'industrial@welderfusion.com.br', 'Metalúrgica ABC Ltda', 'industrial_client')
  ON CONFLICT (id) DO UPDATE SET role = 'industrial_client', name = 'Metalúrgica ABC Ltda';

END $$;
