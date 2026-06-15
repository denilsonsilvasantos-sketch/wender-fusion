import { useEffect, useState } from 'react'
import { BarChart2, Download, GraduationCap, Building2, DollarSign, Users } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Card, Button, Spinner } from '@/components/ui'

const COLOR = '#8B5CF6'

type ReportCat = 'escola' | 'industrial' | 'financeiro' | 'geral'

const CAT_META: Record<ReportCat, { label: string; color: string; icon: React.ElementType }> = {
  escola:     { label: 'Escola',     color: '#FF8C00', icon: GraduationCap },
  industrial: { label: 'Industrial', color: '#3B82F6', icon: Building2 },
  financeiro: { label: 'Financeiro', color: '#22c55e', icon: DollarSign },
  geral:      { label: 'Geral',      color: COLOR,     icon: Users },
}

export function SharedRelatoriosPage() {
  const [counts, setCounts] = useState({ leads: 0, enrollments: 0, invoices: 0, clients: 0 })
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'todos' | ReportCat>('todos')
  const [generating, setGenerating] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      supabase.from('leads').select('id', { count: 'exact', head: true }),
      supabase.from('enrollments').select('id', { count: 'exact', head: true }),
      supabase.from('service_invoices').select('id', { count: 'exact', head: true }),
      supabase.from('service_clients').select('id', { count: 'exact', head: true }),
    ]).then(([l, e, i, c]) => {
      setCounts({ leads: l.count ?? 0, enrollments: e.count ?? 0, invoices: i.count ?? 0, clients: c.count ?? 0 })
      setLoading(false)
    })
  }, [])

  function generate(id: string) {
    setGenerating(id)
    setTimeout(() => setGenerating(null), 1800)
  }

  const REPORTS = [
    // Escola
    { id: 'r1', title: 'Leads e Funil de Matrículas',     description: `${counts.leads} leads — taxa de conversão por etapa`, category: 'escola' as ReportCat, period: 'Junho 2026' },
    { id: 'r2', title: 'Matrículas por Curso',            description: `${counts.enrollments} matrículas — distribuição por curso e status`, category: 'escola' as ReportCat, period: 'Junho 2026' },
    { id: 'r3', title: 'Desempenho de Turmas',            description: 'Frequência, avaliações e taxa de conclusão por turma', category: 'escola' as ReportCat, period: 'Junho 2026' },
    { id: 'r4', title: 'Emissão de Certificados',         description: 'Certificados emitidos e válidos por período', category: 'escola' as ReportCat, period: '2025–2026' },
    // Industrial
    { id: 'r5', title: 'Pipeline Comercial Industrial',   description: `${counts.clients} clientes — orçamentos e propostas em andamento`, category: 'industrial' as ReportCat, period: 'Junho 2026' },
    { id: 'r6', title: 'Ordens de Serviço',               description: 'OS por status, técnico e cliente no período', category: 'industrial' as ReportCat, period: 'Junho 2026' },
    { id: 'r7', title: 'Consultorias e Laudos',           description: 'Laudos emitidos, auditorias e treinamentos realizados', category: 'industrial' as ReportCat, period: '2026' },
    // Financeiro
    { id: 'r8', title: 'Receita Consolidada',             description: 'Faturamento total Escola + Industrial por mês', category: 'financeiro' as ReportCat, period: 'Junho 2026' },
    { id: 'r9', title: `Faturas Industriais`,             description: `${counts.invoices} faturas — recebido, pendente e vencido`, category: 'financeiro' as ReportCat, period: 'Junho 2026' },
    { id: 'r10', title: 'DRE Simplificado',               description: 'Demonstrativo de resultado consolidado', category: 'financeiro' as ReportCat, period: '1º Sem. 2026' },
    // Geral
    { id: 'r11', title: 'Dashboard Executivo',            description: 'KPIs de todas as unidades em uma visão', category: 'geral' as ReportCat, period: 'Junho 2026' },
    { id: 'r12', title: 'Usuários e Acessos',             description: 'Atividade de usuários no portal administrativo', category: 'geral' as ReportCat, period: 'Junho 2026' },
  ]

  const filtered = tab === 'todos' ? REPORTS : REPORTS.filter(r => r.category === tab)

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Relatórios</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Relatórios gerenciais e analíticos de todas as unidades</p>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {(['todos', 'escola', 'industrial', 'financeiro', 'geral'] as const).map(t => {
          const meta   = t === 'todos' ? null : CAT_META[t]
          const active = tab === t
          return (
            <button key={t} onClick={() => setTab(t)}
              className="text-xs px-3 py-1.5 rounded-lg font-medium border transition-colors"
              style={active
                ? { background: meta?.color ?? COLOR, color: '#fff', borderColor: meta?.color ?? COLOR }
                : { color: 'var(--color-text-muted)', borderColor: 'var(--color-border)' }}>
              {t === 'todos' ? 'Todos' : meta!.label}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map(report => {
          const meta  = CAT_META[report.category]
          const Icon  = meta.icon
          const isGen = generating === report.id
          return (
            <Card key={report.id}>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: meta.color + '15' }}>
                  <Icon size={15} style={{ color: meta.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-sm font-semibold text-[var(--color-text)]">{report.title}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded flex-shrink-0"
                      style={{ background: meta.color + '15', color: meta.color }}>
                      {meta.label}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mb-3">{report.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--color-text-muted)]">{report.period}</span>
                    <Button size="sm" variant="outline" onClick={() => generate(report.id)}
                      leftIcon={isGen ? undefined : <Download size={12} />}
                      disabled={!!generating}>
                      {isGen ? 'Gerando…' : 'Exportar PDF'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="flex items-start gap-3 px-4 py-3 rounded-xl border text-sm"
        style={{ background: COLOR + '08', borderColor: COLOR + '25', color: COLOR }}>
        <BarChart2 size={15} className="flex-shrink-0 mt-0.5" />
        <span>Exportação de relatórios em desenvolvimento — geração de PDF e Excel em breve.</span>
      </div>
    </div>
  )
}
