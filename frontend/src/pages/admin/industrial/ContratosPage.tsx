import { useState } from 'react'
import { Plus, FileText, CheckCircle2, Clock, AlertCircle, Download } from 'lucide-react'
import { Button, Card } from '@/components/ui'

const COLOR = '#3B82F6'

type ContratoStatus = 'active' | 'pending' | 'expired'

interface ContratoMock {
  id: string
  client: string
  title: string
  value: number
  start: string
  end: string
  status: ContratoStatus
}

const STATUS_META: Record<ContratoStatus, { label: string; icon: React.ElementType; color: string }> = {
  active:  { label: 'Ativo',    icon: CheckCircle2, color: '#22c55e' },
  pending: { label: 'Pendente', icon: Clock,        color: '#f59e0b' },
  expired: { label: 'Expirado', icon: AlertCircle,  color: '#ef4444' },
}

const MOCK: ContratoMock[] = [
  { id: '1', client: 'Metalúrgica Aço Norte', title: 'Contrato de manutenção anual', value: 48000, start: '2025-01-01', end: '2025-12-31', status: 'active' },
  { id: '2', client: 'Indústria Pesada Sul', title: 'Solda em estrutura portuária', value: 120000, start: '2025-03-01', end: '2025-08-31', status: 'active' },
  { id: '3', client: 'Construtora Pinheiro', title: 'Inspeção e laudo técnico', value: 8500, start: '2025-05-10', end: '2025-06-10', status: 'expired' },
  { id: '4', client: 'Petroquímica Leste', title: 'Consultoria NR-34', value: 22000, start: '2025-07-01', end: '2026-06-30', status: 'pending' },
]

export function IndustrialContratosPage() {
  const [filter, setFilter] = useState<ContratoStatus | ''>('')

  const filtered = filter ? MOCK.filter(c => c.status === filter) : MOCK

  const active  = MOCK.filter(c => c.status === 'active').length
  const pending = MOCK.filter(c => c.status === 'pending').length
  const totalValue = MOCK.filter(c => c.status === 'active').reduce((s, c) => s + c.value, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Contratos</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Gestão de contratos de prestação de serviços</p>
        </div>
        <Button leftIcon={<Plus size={16} />} style={{ background: COLOR }} disabled title="Em breve">
          Novo Contrato
        </Button>
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl border text-sm" style={{ background: COLOR + '08', borderColor: COLOR + '25', color: COLOR }}>
        <FileText size={15} className="flex-shrink-0 mt-0.5" />
        <span>Módulo de contratos em desenvolvimento. Os dados abaixo são ilustrativos — integração com Supabase em breve.</span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Ativos', value: active, color: '#22c55e' },
          { label: 'Pendentes', value: pending, color: '#f59e0b' },
          { label: 'Valor mensal', value: `R$ ${(totalValue / 12).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`, color: COLOR },
        ].map(s => (
          <div key={s.label} className="rounded-xl border p-4" style={{ borderColor: s.color + '25', background: 'var(--color-surface)' }}>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap">
        {([['', 'Todos'], ['active', 'Ativos'], ['pending', 'Pendentes'], ['expired', 'Expirados']] as [ContratoStatus | '', string][]).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className="text-xs px-3 py-1.5 rounded-full border transition-colors font-medium"
            style={filter === val
              ? { background: COLOR, color: '#fff', borderColor: COLOR }
              : { borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card noPadding>
        <div className="divide-y divide-[var(--color-border)]">
          {filtered.map(contrato => {
            const meta = STATUS_META[contrato.status]
            const Icon = meta.icon
            return (
              <div key={contrato.id} className="flex items-center gap-4 px-5 py-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: meta.color + '15' }}>
                  <Icon size={16} style={{ color: meta.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="font-medium text-[var(--color-text)] truncate">{contrato.title}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: meta.color + '15', color: meta.color }}>{meta.label}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)] flex-wrap">
                    <span>{contrato.client}</span>
                    <span>{contrato.start} → {contrato.end}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-sm text-[var(--color-text)]">
                    R$ {contrato.value.toLocaleString('pt-BR')}
                  </p>
                  <button className="mt-1 p-1.5 text-[var(--color-text-muted)] hover:text-blue-400 rounded transition-colors" title="Baixar contrato">
                    <Download size={13} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
