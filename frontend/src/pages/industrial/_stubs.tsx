import {
  Calendar, Camera, FolderOpen, BookOpen, FileBarChart, Award, Download,
  Receipt, Banknote, QrCode, FileMinus, BarChart2, GraduationCap, ScrollText,
  CalendarCheck, ShieldCheck, FileCheck, Headphones, MessageSquare, HelpCircle,
  Building2, Users, MapPin, Settings, ClipboardList,
} from 'lucide-react'

const COLORS = {
  blue:   '#3B82F6',
  purple: '#8B5CF6',
  green:  '#10B981',
  amber:  '#F59E0B',
  red:    '#EF4444',
  slate:  '#64748B',
}

function StubPage({ icon: Icon, title, desc, color }: {
  icon: React.ElementType; title: string; desc: string; color: string
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: color + '15', border: `2px solid ${color}25` }}>
        <Icon size={28} style={{ color }} />
      </div>
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">{title}</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">{desc}</p>
      </div>
      <div className="px-4 py-2 rounded-lg text-xs font-semibold" style={{ background: color + '12', color }}>
        Em desenvolvimento — disponível em breve
      </div>
    </div>
  )
}

// Serviços
export function CronogramaPage()       { return <StubPage icon={Calendar}      color={COLORS.blue}   title="Cronograma"          desc="Visualização estilo Gantt das fases do serviço" /> }
export function EvidenciasPage()       { return <StubPage icon={Camera}        color={COLORS.blue}   title="Evidências"          desc="Fotos, vídeos e relatórios de campo — antes/durante/depois" /> }

// Documentos
export function ProjetosPage()         { return <StubPage icon={FolderOpen}    color={COLORS.purple} title="Projetos"            desc="Arquivos PDF e DWG dos projetos contratados" /> }
export function ProcedimentosPage()    { return <StubPage icon={BookOpen}      color={COLORS.purple} title="Procedimentos"       desc="WPS, PQR e demais procedimentos técnicos" /> }
export function RelatoriosTecPage()    { return <StubPage icon={FileBarChart}  color={COLORS.purple} title="Relatórios Técnicos" desc="Relatórios de inspeção, ensaios e campo" /> }
export function CertificadosDocPage()  { return <StubPage icon={Award}        color={COLORS.purple} title="Certificados"        desc="Certificados de qualificação e soldadores" /> }
export function DownloadsPage()        { return <StubPage icon={Download}      color={COLORS.purple} title="Downloads"           desc="Central de arquivos para download" /> }

// Financeiro
export function BoletosPage()          { return <StubPage icon={Banknote}      color={COLORS.green}  title="Boletos"             desc="Geração e download de boletos bancários" /> }
export function PixPage()              { return <StubPage icon={QrCode}        color={COLORS.green}  title="PIX"                 desc="QR Code e chave PIX para pagamentos" /> }
export function NotasFiscaisPage()     { return <StubPage icon={FileMinus}     color={COLORS.green}  title="Notas Fiscais"       desc="Download de NF-e em PDF e XML" /> }
export function ExtratoPage()          { return <StubPage icon={BarChart2}     color={COLORS.green}  title="Extrato Financeiro"  desc="Histórico completo de pagamentos e transações" /> }

// Consultorias
export function ContratosPage()        { return <StubPage icon={ScrollText}    color={COLORS.amber}  title="Contratos"           desc="Contratos de consultoria ativos e histórico" /> }
export function AgendaPage()           { return <StubPage icon={CalendarCheck} color={COLORS.amber}  title="Agenda"              desc="Visitas técnicas e treinamentos agendados" /> }
export function AuditoriasPage()       { return <StubPage icon={ShieldCheck}   color={COLORS.amber}  title="Auditorias"          desc="Não conformidades e planos de ação" /> }
export function TreinamentosPage()     { return <StubPage icon={GraduationCap} color={COLORS.amber}  title="Treinamentos"        desc="Cursos corporativos, frequência e certificados" /> }
export function RelatoriosConsPage()   { return <StubPage icon={FileCheck}     color={COLORS.amber}  title="Relatórios"          desc="Relatórios de consultoria em PDF" /> }

// Atendimento
export function ChamadosPage()         { return <StubPage icon={Headphones}    color={COLORS.red}    title="Chamados"            desc="Abertura e acompanhamento de chamados de suporte" /> }
export function MensagensPage()        { return <StubPage icon={MessageSquare} color={COLORS.red}    title="Mensagens"           desc="Chat interno com a equipe Welder & Fusion" /> }
export function SuportePage()          { return <StubPage icon={HelpCircle}    color={COLORS.red}    title="Suporte"             desc="WhatsApp e canais de atendimento direto" /> }

// Empresa
export function DadosCadastraisPage()  { return <StubPage icon={Building2}     color={COLORS.slate}  title="Dados Cadastrais"    desc="Razão social, CNPJ, endereço e contatos" /> }
export function ResponsaveisPage()     { return <StubPage icon={Users}         color={COLORS.slate}  title="Responsáveis"        desc="Comprador, engenheiro e supervisores cadastrados" /> }
export function UnidadesPage()         { return <StubPage icon={MapPin}        color={COLORS.slate}  title="Unidades"            desc="Filiais e plantas industriais cadastradas" /> }
export function ConfiguracoesTPage()   { return <StubPage icon={Settings}      color={COLORS.slate}  title="Configurações"       desc="Preferências de notificação e acesso" /> }
