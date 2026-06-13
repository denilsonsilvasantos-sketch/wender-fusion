-- ============================================================
-- MIGRATION 07 — PORTAL INDUSTRIAL (CLIENTE)
-- Execute no SQL Editor do Supabase APÓS 06
-- ============================================================

-- ============================================================
-- 1. QUOTATIONS — expandir para Portal Industrial
--    O cliente agora pode criar orçamentos pelo portal
-- ============================================================

ALTER TABLE quotations ADD COLUMN IF NOT EXISTS service_type TEXT
  CHECK (service_type IN (
    'soldagem', 'montagem', 'caldeiraria',
    'manutencao', 'consultoria', 'treinamento'
  ));

ALTER TABLE quotations ADD COLUMN IF NOT EXISTS location       TEXT;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS deadline       DATE;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS priority       TEXT DEFAULT 'normal'
  CHECK (priority IN ('normal', 'urgente'));

-- Quem abriu o orçamento via portal (user_profiles.role = industrial_client)
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS client_user_id UUID
  REFERENCES user_profiles(id) ON DELETE SET NULL;

-- Aprovação digital pelo cliente no portal
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS approved_by_client BOOLEAN DEFAULT false;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS client_approved_at TIMESTAMPTZ;

-- Expandir status: adiciona 'under_review' e 'cancelled'
ALTER TABLE quotations DROP CONSTRAINT IF EXISTS quotations_status_check;
ALTER TABLE quotations ADD CONSTRAINT quotations_status_check
  CHECK (status IN (
    'draft', 'sent', 'under_review',
    'approved', 'rejected', 'expired', 'cancelled'
  ));

-- ============================================================
-- 2. QUOTATION_ATTACHMENTS — uploads de arquivos ao orçamento
-- ============================================================

CREATE TABLE IF NOT EXISTS quotation_attachments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id    UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  file_name       TEXT NOT NULL,
  file_url        TEXT NOT NULL,
  file_type       TEXT,
  file_size_bytes BIGINT,
  uploaded_by     UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  uploaded_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. SERVICE_ORDERS — expandir status + campos do portal
-- ============================================================

-- Percentual de conclusão para barra de progresso
ALTER TABLE service_orders ADD COLUMN IF NOT EXISTS completion_pct INTEGER DEFAULT 0
  CHECK (completion_pct BETWEEN 0 AND 100);

-- Usuário do portal que originou a OS (via aprovação de orçamento)
ALTER TABLE service_orders ADD COLUMN IF NOT EXISTS client_user_id UUID
  REFERENCES user_profiles(id) ON DELETE SET NULL;

-- Expandir status: mantém valores originais + novos em PT-BR
-- (retrocompatível — dados existentes continuam válidos)
ALTER TABLE service_orders DROP CONSTRAINT IF EXISTS service_orders_status_check;
ALTER TABLE service_orders ADD CONSTRAINT service_orders_status_check
  CHECK (status IN (
    'pending', 'in_progress', 'completed', 'cancelled',
    'aberta', 'planejamento', 'execucao', 'pausada', 'finalizada', 'faturada'
  ));

-- ============================================================
-- 4. SERVICE_ORDER_TEAM — membros da equipe por OS
-- ============================================================

CREATE TABLE IF NOT EXISTS service_order_team (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_order_id UUID NOT NULL REFERENCES service_orders(id) ON DELETE CASCADE,
  user_id          UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  nome             TEXT NOT NULL,
  funcao           TEXT NOT NULL,
  added_by         UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  added_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 5. SERVICE_ORDER_MATERIALS — materiais utilizados por OS
-- ============================================================

CREATE TABLE IF NOT EXISTS service_order_materials (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_order_id UUID NOT NULL REFERENCES service_orders(id) ON DELETE CASCADE,
  item             TEXT NOT NULL,
  quantity         NUMERIC(10,3) NOT NULL DEFAULT 1,
  unit             TEXT NOT NULL DEFAULT 'un',
  notes            TEXT,
  added_by         UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  added_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 6. SERVICE_ORDER_HOURS — registro de horas trabalhadas
-- ============================================================

CREATE TABLE IF NOT EXISTS service_order_hours (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_order_id UUID NOT NULL REFERENCES service_orders(id) ON DELETE CASCADE,
  data             DATE NOT NULL DEFAULT CURRENT_DATE,
  horas            NUMERIC(5,2) NOT NULL CHECK (horas > 0),
  descricao        TEXT NOT NULL,
  recorded_by      UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  recorded_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 7. SERVICE_ORDER_EVIDENCES — fotos/vídeos antes/durante/depois
-- ============================================================

CREATE TABLE IF NOT EXISTS service_order_evidences (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_order_id UUID NOT NULL REFERENCES service_orders(id) ON DELETE CASCADE,
  tipo             TEXT NOT NULL
    CHECK (tipo IN ('antes', 'durante', 'depois')),
  descricao        TEXT NOT NULL,
  file_url         TEXT,
  file_type        TEXT CHECK (file_type IN ('foto', 'video', 'relatorio', 'outro')),
  data             DATE NOT NULL DEFAULT CURRENT_DATE,
  recorded_by      UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 8. SERVICE_INVOICES — expandir campos para o portal
-- ============================================================

ALTER TABLE service_invoices ADD COLUMN IF NOT EXISTS invoice_number   TEXT;
ALTER TABLE service_invoices ADD COLUMN IF NOT EXISTS description       TEXT;
ALTER TABLE service_invoices ADD COLUMN IF NOT EXISTS reference_number  TEXT;
ALTER TABLE service_invoices ADD COLUMN IF NOT EXISTS nf_pdf_url        TEXT;
ALTER TABLE service_invoices ADD COLUMN IF NOT EXISTS nf_xml_url        TEXT;
ALTER TABLE service_invoices ADD COLUMN IF NOT EXISTS receipt_url       TEXT;

-- Número automático FAT-YYYY-NNN
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := 'FAT-' || TO_CHAR(NOW(), 'YYYY') || '-'
                          || LPAD(nextval('invoice_number_seq')::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER set_invoice_number
  BEFORE INSERT ON service_invoices
  FOR EACH ROW EXECUTE FUNCTION generate_invoice_number();

-- ============================================================
-- 9. INDUSTRIAL_COMPANIES — dados formais da empresa do cliente
--    Vinculada via user_profiles.id (role = industrial_client)
-- ============================================================

CREATE TABLE IF NOT EXISTS industrial_companies (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID UNIQUE REFERENCES user_profiles(id) ON DELETE CASCADE,
  razao_social  TEXT NOT NULL,
  nome_fantasia TEXT,
  cnpj          TEXT UNIQUE,
  email         TEXT,
  phone         TEXT,
  website       TEXT,
  address       TEXT,
  city          TEXT DEFAULT 'Itajaí',
  state         TEXT DEFAULT 'SC',
  zip_code      TEXT,
  industry      TEXT,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 10. COMPANY_CONTACTS — responsáveis (comprador/engenheiro/etc)
-- ============================================================

CREATE TABLE IF NOT EXISTS company_contacts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  UUID NOT NULL REFERENCES industrial_companies(id) ON DELETE CASCADE,
  nome        TEXT NOT NULL,
  cargo       TEXT,
  tipo        TEXT NOT NULL DEFAULT 'outro'
    CHECK (tipo IN ('comprador', 'engenheiro', 'supervisor', 'financeiro', 'outro')),
  email       TEXT,
  phone       TEXT,
  is_primary  BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 11. COMPANY_UNITS — filiais e plantas da empresa
-- ============================================================

CREATE TABLE IF NOT EXISTS company_units (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id       UUID NOT NULL REFERENCES industrial_companies(id) ON DELETE CASCADE,
  nome             TEXT NOT NULL,
  address          TEXT,
  city             TEXT,
  state            TEXT,
  zip_code         TEXT,
  phone            TEXT,
  is_headquarters  BOOLEAN NOT NULL DEFAULT false,
  active           BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 12. CONSULTING_AUDITS — auditorias com não conformidades
-- ============================================================

CREATE TABLE IF NOT EXISTS consulting_audits (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id      UUID NOT NULL REFERENCES consulting_engagements(id) ON DELETE CASCADE,
  titulo             TEXT NOT NULL,
  data               DATE NOT NULL,
  nao_conformidades  TEXT,
  plano_acao         TEXT,
  prazo_resolucao    DATE,
  status             TEXT NOT NULL DEFAULT 'aberta'
    CHECK (status IN ('aberta', 'em_andamento', 'encerrada', 'verificada')),
  resolved_at        TIMESTAMPTZ,
  resolved_by        UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_by         UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 13. CONSULTING_TRAINING_PARTICIPANTS — colaboradores em treinamentos
--     corporativos (diferencial da W&F frente à concorrência)
-- ============================================================

CREATE TABLE IF NOT EXISTS consulting_training_participants (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id       UUID NOT NULL REFERENCES consulting_engagements(id) ON DELETE CASCADE,
  nome                TEXT NOT NULL,
  cpf                 TEXT,
  cargo               TEXT,
  email               TEXT,
  presente            BOOLEAN NOT NULL DEFAULT false,
  nota                NUMERIC(4,2),
  certificado_emitido BOOLEAN NOT NULL DEFAULT false,
  certificado_url     TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(engagement_id, cpf)
);

-- ============================================================
-- 14. SUPPORT_TICKETS — chamados de atendimento do portal
-- ============================================================

CREATE TABLE IF NOT EXISTS support_tickets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number   TEXT UNIQUE NOT NULL DEFAULT '',
  company_id      UUID REFERENCES industrial_companies(id) ON DELETE SET NULL,
  client_user_id  UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  categoria       TEXT NOT NULL DEFAULT 'outro'
    CHECK (categoria IN ('comercial', 'tecnico', 'financeiro', 'outro')),
  titulo          TEXT NOT NULL,
  descricao       TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'aberto'
    CHECK (status IN (
      'aberto', 'em_andamento', 'aguardando_cliente', 'resolvido', 'fechado'
    )),
  priority        TEXT NOT NULL DEFAULT 'normal'
    CHECK (priority IN ('baixa', 'normal', 'alta', 'urgente')),
  assigned_to     UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  resolved_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE SEQUENCE IF NOT EXISTS ticket_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
    NEW.ticket_number := 'CHM-' || TO_CHAR(NOW(), 'YYYY') || '-'
                         || LPAD(nextval('ticket_number_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER set_ticket_number
  BEFORE INSERT ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION generate_ticket_number();

-- ============================================================
-- 15. SUPPORT_MESSAGES — mensagens dentro de um chamado
-- ============================================================

CREATE TABLE IF NOT EXISTS support_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id   UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id   UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  message     TEXT NOT NULL,
  is_internal BOOLEAN NOT NULL DEFAULT false, -- true = nota interna (admin only)
  attachments TEXT[],
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 16. ÍNDICES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_quotations_client_user        ON quotations(client_user_id);
CREATE INDEX IF NOT EXISTS idx_quotation_attachments_quot    ON quotation_attachments(quotation_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_client_user    ON service_orders(client_user_id);
CREATE INDEX IF NOT EXISTS idx_service_order_team_os         ON service_order_team(service_order_id);
CREATE INDEX IF NOT EXISTS idx_service_order_materials_os    ON service_order_materials(service_order_id);
CREATE INDEX IF NOT EXISTS idx_service_order_hours_os        ON service_order_hours(service_order_id);
CREATE INDEX IF NOT EXISTS idx_service_order_evidences_os    ON service_order_evidences(service_order_id);
CREATE INDEX IF NOT EXISTS idx_service_invoices_number       ON service_invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_industrial_companies_user     ON industrial_companies(user_id);
CREATE INDEX IF NOT EXISTS idx_industrial_companies_cnpj     ON industrial_companies(cnpj);
CREATE INDEX IF NOT EXISTS idx_company_contacts_company      ON company_contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_company_units_company         ON company_units(company_id);
CREATE INDEX IF NOT EXISTS idx_consulting_audits_engagement  ON consulting_audits(engagement_id);
CREATE INDEX IF NOT EXISTS idx_training_participants_eng     ON consulting_training_participants(engagement_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_company       ON support_tickets(company_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_client_user   ON support_tickets(client_user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status        ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_messages_ticket       ON support_messages(ticket_id);

-- ============================================================
-- 17. RLS — habilitar e criar políticas
-- ============================================================

ALTER TABLE quotation_attachments             ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_order_team                ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_order_materials           ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_order_hours               ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_order_evidences           ENABLE ROW LEVEL SECURITY;
ALTER TABLE industrial_companies              ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_contacts                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_units                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE consulting_audits                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE consulting_training_participants  ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages                  ENABLE ROW LEVEL SECURITY;

-- quotation_attachments
CREATE POLICY "Cliente vê próprios anexos de orçamento" ON quotation_attachments
  FOR SELECT USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM quotations q
      WHERE q.id = quotation_attachments.quotation_id
        AND (q.client_user_id = auth.uid() OR EXISTS (
          SELECT 1 FROM service_clients sc
          WHERE sc.id = q.client_id AND sc.user_id = auth.uid()
        ))
    )
  );
CREATE POLICY "Cliente insere anexos" ON quotation_attachments
  FOR INSERT WITH CHECK (uploaded_by = auth.uid());
CREATE POLICY "Admins gerenciam anexos de orçamento" ON quotation_attachments
  FOR ALL USING (public.is_admin());

-- service_order_team
CREATE POLICY "Cliente vê equipe da OS" ON service_order_team
  FOR SELECT USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM service_orders so
      WHERE so.id = service_order_team.service_order_id
        AND (so.client_user_id = auth.uid() OR EXISTS (
          SELECT 1 FROM service_clients sc
          WHERE sc.id = so.client_id AND sc.user_id = auth.uid()
        ))
    )
  );
CREATE POLICY "Admins gerenciam equipe da OS" ON service_order_team
  FOR ALL USING (public.is_admin());

-- service_order_materials
CREATE POLICY "Cliente vê materiais da OS" ON service_order_materials
  FOR SELECT USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM service_orders so
      WHERE so.id = service_order_materials.service_order_id
        AND (so.client_user_id = auth.uid() OR EXISTS (
          SELECT 1 FROM service_clients sc
          WHERE sc.id = so.client_id AND sc.user_id = auth.uid()
        ))
    )
  );
CREATE POLICY "Admins gerenciam materiais da OS" ON service_order_materials
  FOR ALL USING (public.is_admin());

-- service_order_hours
CREATE POLICY "Cliente vê horas da OS" ON service_order_hours
  FOR SELECT USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM service_orders so
      WHERE so.id = service_order_hours.service_order_id
        AND (so.client_user_id = auth.uid() OR EXISTS (
          SELECT 1 FROM service_clients sc
          WHERE sc.id = so.client_id AND sc.user_id = auth.uid()
        ))
    )
  );
CREATE POLICY "Admins gerenciam horas da OS" ON service_order_hours
  FOR ALL USING (public.is_admin());

-- service_order_evidences
CREATE POLICY "Cliente vê evidências da OS" ON service_order_evidences
  FOR SELECT USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM service_orders so
      WHERE so.id = service_order_evidences.service_order_id
        AND (so.client_user_id = auth.uid() OR EXISTS (
          SELECT 1 FROM service_clients sc
          WHERE sc.id = so.client_id AND sc.user_id = auth.uid()
        ))
    )
  );
CREATE POLICY "Admins gerenciam evidências da OS" ON service_order_evidences
  FOR ALL USING (public.is_admin());

-- industrial_companies
CREATE POLICY "Empresa vê próprios dados cadastrais" ON industrial_companies
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Empresa insere próprios dados" ON industrial_companies
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Empresa atualiza próprios dados" ON industrial_companies
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins gerenciam empresas industriais" ON industrial_companies
  FOR ALL USING (public.is_admin());

-- company_contacts
CREATE POLICY "Empresa vê próprios responsáveis" ON company_contacts
  FOR SELECT USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM industrial_companies ic
      WHERE ic.id = company_contacts.company_id AND ic.user_id = auth.uid()
    )
  );
CREATE POLICY "Empresa gerencia próprios responsáveis" ON company_contacts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM industrial_companies ic
      WHERE ic.id = company_contacts.company_id AND ic.user_id = auth.uid()
    )
  );
CREATE POLICY "Admins gerenciam responsáveis" ON company_contacts
  FOR ALL USING (public.is_admin());

-- company_units
CREATE POLICY "Empresa vê próprias unidades" ON company_units
  FOR SELECT USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM industrial_companies ic
      WHERE ic.id = company_units.company_id AND ic.user_id = auth.uid()
    )
  );
CREATE POLICY "Empresa gerencia próprias unidades" ON company_units
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM industrial_companies ic
      WHERE ic.id = company_units.company_id AND ic.user_id = auth.uid()
    )
  );
CREATE POLICY "Admins gerenciam unidades" ON company_units
  FOR ALL USING (public.is_admin());

-- consulting_audits
CREATE POLICY "Admins gerenciam auditorias de consultoria" ON consulting_audits
  FOR ALL USING (public.is_admin());

-- consulting_training_participants
CREATE POLICY "Admins gerenciam participantes de treinamento" ON consulting_training_participants
  FOR ALL USING (public.is_admin());

-- support_tickets
CREATE POLICY "Cliente vê próprios chamados" ON support_tickets
  FOR SELECT USING (client_user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Cliente abre chamado" ON support_tickets
  FOR INSERT WITH CHECK (client_user_id = auth.uid());
CREATE POLICY "Admins gerenciam chamados" ON support_tickets
  FOR ALL USING (public.is_admin());

-- support_messages (mensagens não internas são visíveis ao cliente)
CREATE POLICY "Participantes veem mensagens do chamado" ON support_messages
  FOR SELECT USING (
    public.is_admin() OR
    (is_internal = false AND EXISTS (
      SELECT 1 FROM support_tickets st
      WHERE st.id = support_messages.ticket_id
        AND st.client_user_id = auth.uid()
    ))
  );
CREATE POLICY "Usuários enviam mensagens" ON support_messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Admins veem todas as mensagens" ON support_messages
  FOR SELECT USING (public.is_admin());

-- ============================================================
-- 18. TRIGGERS updated_at
-- ============================================================

CREATE OR REPLACE TRIGGER update_industrial_companies_updated_at
  BEFORE UPDATE ON industrial_companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER update_consulting_audits_updated_at
  BEFORE UPDATE ON consulting_audits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 19. ATUALIZAR VIEW admin_dashboard_metrics
--     Inclui métricas do portal industrial
-- ============================================================

CREATE OR REPLACE VIEW admin_dashboard_metrics AS
SELECT
  (SELECT COUNT(*) FROM user_profiles WHERE role = 'student')             AS total_students,
  (SELECT COUNT(*) FROM courses WHERE status = 'published')               AS published_courses,
  (SELECT COUNT(*) FROM enrollments WHERE status = 'active')              AS active_enrollments,
  (SELECT COALESCE(SUM(amount), 0)
   FROM payments WHERE status IN ('confirmed', 'received'))               AS total_revenue,
  (SELECT COUNT(*) FROM service_orders
   WHERE status IN ('in_progress', 'execucao', 'planejamento'))           AS active_service_orders,
  (SELECT COUNT(*) FROM service_orders
   WHERE status IN ('pending', 'aberta'))                                 AS pending_service_orders,
  (SELECT COUNT(*) FROM quotations
   WHERE status IN ('sent', 'under_review'))                              AS pending_quotations,
  (SELECT COUNT(*) FROM service_invoices
   WHERE status IN ('pending', 'overdue'))                                AS pending_invoices,
  (SELECT COALESCE(SUM(amount), 0)
   FROM service_invoices WHERE status = 'overdue')                        AS overdue_invoice_amount,
  (SELECT COUNT(*) FROM support_tickets
   WHERE status IN ('aberto', 'em_andamento'))                            AS open_tickets,
  (SELECT COUNT(*) FROM job_postings WHERE status = 'open')               AS open_job_postings,
  (SELECT COUNT(*) FROM leads WHERE converted = false)                    AS open_leads,
  (SELECT COUNT(*) FROM consulting_engagements WHERE status = 'active')   AS active_consultings;

-- ============================================================
-- RESUMO DO QUE ESTE SCRIPT CRIA/ALTERA
-- ============================================================
-- ALTERADAS:
--   quotations         → +service_type, +location, +deadline, +priority,
--                        +client_user_id, +approved_by_client,
--                        +client_approved_at; status CHECK expandido
--   service_orders     → +completion_pct, +client_user_id;
--                        status CHECK expandido (PT-BR + EN)
--   service_invoices   → +invoice_number (auto FAT-YYYY-NNN),
--                        +description, +reference_number,
--                        +nf_pdf_url, +nf_xml_url, +receipt_url
--
-- CRIADAS:
--   quotation_attachments            (PDFs/DWGs do orçamento)
--   service_order_team               (equipe da OS)
--   service_order_materials          (materiais utilizados)
--   service_order_hours              (horas trabalhadas por dia)
--   service_order_evidences          (fotos antes/durante/depois)
--   industrial_companies             (dados formais da empresa cliente)
--   company_contacts                 (responsáveis: comprador/eng/supervisor)
--   company_units                    (filiais e plantas)
--   consulting_audits                (não conformidades e planos de ação)
--   consulting_training_participants (colaboradores em treinamentos)
--   support_tickets                  (chamados: CHM-YYYY-XXXX)
--   support_messages                 (mensagens do chamado)
-- ============================================================
