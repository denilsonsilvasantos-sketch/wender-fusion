-- ============================================================
-- MIGRATION 08 — ARTIGOS & STORAGE DE CAPAS
-- Execute no SQL Editor do Supabase APÓS 01..07
-- ============================================================

-- ============================================================
-- 1. BUCKET DE IMAGENS — Capas de Artigos (público)
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'article-covers',
  'article-covers',
  true,
  5242880,   -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Leitura pública
CREATE POLICY IF NOT EXISTS "Capas de artigo são públicas"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'article-covers');

-- Upload apenas por admin
CREATE POLICY IF NOT EXISTS "Admins enviam capas de artigo"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'article-covers'
    AND (SELECT role FROM public.user_profiles WHERE id = auth.uid()) = 'admin'
  );

-- Substituição apenas por admin
CREATE POLICY IF NOT EXISTS "Admins atualizam capas de artigo"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'article-covers'
    AND (SELECT role FROM public.user_profiles WHERE id = auth.uid()) = 'admin'
  );

-- Exclusão apenas por admin
CREATE POLICY IF NOT EXISTS "Admins deletam capas de artigo"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'article-covers'
    AND (SELECT role FROM public.user_profiles WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================
-- 2. TABELA ARTICLES
-- ============================================================

CREATE TABLE IF NOT EXISTS articles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  excerpt     TEXT,
  content     TEXT,
  tag         TEXT NOT NULL DEFAULT 'Técnica'
    CHECK (tag IN ('Técnica', 'Mercado', 'Segurança', 'Carreira', 'Certificações', 'Equipamentos')),
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  cover_url   TEXT,
  published   BOOLEAN NOT NULL DEFAULT false,
  featured    BOOLEAN NOT NULL DEFAULT false,
  author_id   UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa lê artigos publicados
CREATE POLICY "Artigos publicados são públicos" ON articles
  FOR SELECT USING (published = true);

-- Admin lê todos (incluindo rascunhos)
CREATE POLICY "Admins veem todos os artigos" ON articles
  FOR SELECT
  USING ((SELECT role FROM public.user_profiles WHERE id = auth.uid()) = 'admin');

-- Admin cria, atualiza e deleta
CREATE POLICY "Admins gerenciam artigos" ON articles
  FOR ALL
  USING ((SELECT role FROM public.user_profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM public.user_profiles WHERE id = auth.uid()) = 'admin');

-- Trigger updated_at
CREATE OR REPLACE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 3. ÍNDICES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);
CREATE INDEX IF NOT EXISTS idx_articles_featured  ON articles(featured);
CREATE INDEX IF NOT EXISTS idx_articles_tag       ON articles(tag);
CREATE INDEX IF NOT EXISTS idx_articles_date      ON articles(date DESC);

-- ============================================================
-- RESUMO
-- ============================================================
-- STORAGE:
--   article-covers  → bucket público, max 5MB, JPEG/PNG/WEBP/GIF
--                     admins: upload/update/delete
--
-- TABELA:
--   articles → title, excerpt, content (TEXT), tag, date,
--              cover_url (URL pública do Storage), published, featured
--              RLS: SELECT público (published=true) + ALL para admin
-- ============================================================
