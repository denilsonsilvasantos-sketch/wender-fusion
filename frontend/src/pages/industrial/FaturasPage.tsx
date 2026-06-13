import { useState } from 'react'
import { Card } from '@/components/ui'
import { Receipt, QrCode, Download, CheckCircle, AlertCircle, Clock } from 'lucide-react'

const COLOR = '#10B981'

type StatusFatura = 'Aberta' | 'Vencida' | 'Paga'

const STATUS_COLORS: Record<StatusFatura, string> = {
  'Aberta':  '#3B82F6',
  'Vencida': '#EF4444',
  'Paga':    '#10B981',
}

const STATUS_ICONS: Record<StatusFatura, typeof Clock> = {
  'Aberta':  Clock,
  'Vencida': AlertCircle,
  'Paga':    CheckCircle,
}

interface Fatura {
  id: string
  ref: string
  desc: string
  valor: string
  vencimento: string
  emissao: string
  status: StatusFatura
}

const FATURAS: Fatura[] = [
  { id: 'FAT-2024-033', ref: 'OS-2024-044', desc: 'Montagem de tubulações — Linha de vapor P5',      valor: 'R$ 62.400,00', vencimento: '15/06/2026', emissao: '01/06/2026', status: 'Vencida' },
  { id: 'FAT-2024-030', ref: 'OS-2024-040', desc: 'Soldagem estrutural — Suporte de equipamentos',   valor: 'R$ 28.750,00', vencimento: '30/06/2026', emissao: '10/06/2026', status: 'Aberta'  },
  { id: 'FAT-2024-025', ref: 'ORC-2024-019',desc: 'Treinamento NR-13 — 18 colaboradores',            valor: 'R$ 12.200,00', vencimento: '20/06/2026', emissao: '05/06/2026', status: 'Aberta'  },
  { id: 'FAT-2024-020', ref: 'OS-2024-036', desc: 'Manutenção preventiva — Caldeiras B-01 e B-02',  valor: 'R$ 45.000,00', vencimento: '31/05/2026', emissao: '15/05/2026', status: 'Paga'    },
  { id: 'FAT-2024-014', ref: 'OS-2024-030', desc: 'Caldeiraria — Tanque T-01 fabricação',           valor: 'R$ 118.500,00',vencimento: '30/04/2026', emissao: '01/04/2026', status: 'Paga'    },
]

const ALL_STATUS: (StatusFatura | 'Todas')[] = ['Todas', 'Aberta', 'Vencida', 'Paga']

export function FaturasPage() {
  const [filter, setFilter] = useState<StatusFatura | 'Todas'>('Todas')
  const [pixModal, setPixModal] = useState<string | null>(null)

  const filtered = FATURAS.filter(f => filter === 'Todas' || f.status === filter)

  const totais = {
    pendente: FATURAS.filter(f => f.status !== 'Paga').reduce((sum, f) => sum + parseFloat(f.valor.replace(/[^\d,]/g, '').replace(',', '.')), 0),
    vencido:  FATURAS.filter(f => f.status === 'Vencida').reduce((sum, f) => sum + parseFloat(f.valor.replace(/[^\d,]/g, '').replace(',', '.')), 0),
    pago:     FATURAS.filter(f => f.status === 'Paga').reduce((sum, f) => sum + parseFloat(f.valor.replace(/[^\d,]/g, '').replace(',', '.')), 0),
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Faturas</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Acompanhe e pague suas faturas por PIX, boleto ou transferência</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Em aberto',  value: `R$ ${totais.pendente.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, color: '#3B82F6' },
          { label: 'Vencido',    value: `R$ ${totais.vencido.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`,  color: '#EF4444' },
          { label: 'Pago',       value: `R$ ${totais.pago.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`,    color: '#10B981' },
        ].map(s => (
          <div key={s.label} className="rounded-xl border p-4" style={{ borderColor: s.color + '25', background: s.color + '08' }}>
            <p className="text-xs font-semibold text-[var(--color-text-muted)]">{s.label}</p>
            <p className="text-xl font-black mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {ALL_STATUS.map(s => (
          <button key={s}
            onClick={() => setFilter(s)}
            className="px-3 py-1.5 rounded-full text-xs font-bold border transition-all"
            style={{
              background: filter === s ? (s === 'Todas' ? '#3B82F6' : STATUS_COLORS[s as StatusFatura]) + '20' : 'transparent',
              borderColor: filter === s ? (s === 'Todas' ? '#3B82F6' : STATUS_COLORS[s as StatusFatura]) : 'var(--color-border)',
              color: filter === s ? (s === 'Todas' ? '#3B82F6' : STATUS_COLORS[s as StatusFatura]) : 'var(--color-text-muted)',
            }}>{s}</button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map(f => {
          const sc = STATUS_COLORS[f.status]
          const SIcon = STATUS_ICONS[f.status]
          const isPending = f.status !== 'Paga'

          return (
            <Card key={f.id}>
              <div className="p-1">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: sc + '15' }}>
                    <Receipt size={16} style={{ color: sc }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-xs font-black" style={{ color: '#3B82F6' }}>{f.id}</span>
                      <span className="text-[10px] text-[var(--color-text-muted)]">Ref: {f.ref}</span>
                      <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-auto"
                        style={{ background: sc + '20', color: sc }}>
                        <SIcon size={9} />{f.status}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[var(--color-text)]">{f.desc}</p>
                    <div className="flex items-center gap-4 mt-1 flex-wrap">
                      <p className="text-xs text-[var(--color-text-muted)]">Emissão {f.emissao}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">Vencimento {f.vencimento}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-black" style={{ color: COLOR }}>{f.valor}</p>
                  </div>
                </div>

                {/* Actions */}
                {isPending && (
                  <div className="mt-3 pt-3 border-t border-[var(--color-border)] flex gap-2 flex-wrap">
                    <button
                      onClick={() => setPixModal(f.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                      style={{ background: '#10B981' }}
                    >
                      <QrCode size={12} /> Pagar via PIX
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border"
                      style={{ borderColor: '#3B82F640', color: '#3B82F6' }}>
                      <Download size={12} /> Boleto
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border text-[var(--color-text-muted)]"
                      style={{ borderColor: 'var(--color-border)' }}>
                      <Download size={12} /> NF-e PDF
                    </button>
                    {f.status === 'Vencida' && (
                      <span className="flex items-center gap-1 text-xs text-[#EF4444] font-semibold ml-auto">
                        <AlertCircle size={12} /> Fatura vencida — entre em contato
                      </span>
                    )}
                  </div>
                )}

                {!isPending && (
                  <div className="mt-3 pt-3 border-t border-[var(--color-border)] flex gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border"
                      style={{ borderColor: '#10B98125', color: '#10B981' }}>
                      <Download size={12} /> NF-e PDF
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border text-[var(--color-text-muted)]"
                      style={{ borderColor: 'var(--color-border)' }}>
                      <Download size={12} /> Recibo
                    </button>
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {/* PIX Modal */}
      {pixModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="bg-[var(--color-surface)] rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <h3 className="text-lg font-black text-[var(--color-text)]">Pagamento via PIX</h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              {FATURAS.find(f => f.id === pixModal)?.desc}
            </p>
            <p className="text-2xl font-black" style={{ color: '#10B981' }}>
              {FATURAS.find(f => f.id === pixModal)?.valor}
            </p>

            {/* Mock QR Code */}
            <div className="w-40 h-40 mx-auto bg-white rounded-xl flex items-center justify-center border-2" style={{ borderColor: '#10B98130' }}>
              <QrCode size={80} style={{ color: '#10B981' }} />
            </div>

            <div className="p-3 rounded-xl border text-left" style={{ borderColor: '#10B98120', background: '#10B98108' }}>
              <p className="text-[10px] font-bold text-[var(--color-text-muted)] mb-1">Chave PIX (CNPJ)</p>
              <p className="text-sm font-mono font-bold text-[var(--color-text)]">12.345.678/0001-90</p>
            </div>

            <p className="text-xs text-[var(--color-text-muted)]">
              Após o pagamento, envie o comprovante pelo Atendimento para confirmação em até 2h úteis.
            </p>
            <button
              onClick={() => setPixModal(null)}
              className="w-full py-2.5 rounded-xl text-sm font-bold border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
