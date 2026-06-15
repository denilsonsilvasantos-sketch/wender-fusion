import { useState } from 'react'
import { Briefcase, MapPin, DollarSign, Clock, Filter, Search } from 'lucide-react'
import { Card } from '@/components/ui'

const COLOR = '#10B981'

const VAGAS = [
  { id: 1, cargo: 'Soldador TIG — Aço Inox',        empresa: 'Metalúrgica Ferro & Cia',  cidade: 'São Paulo – SP', salario: '4.500–5.500', processo: 'TIG',     tipo: 'CLT',      urgente: true  },
  { id: 2, cargo: 'Soldador MIG/MAG Senior',         empresa: 'Auto Peças Nobre',         cidade: 'Campinas – SP',  salario: '5.000–6.500', processo: 'MIG/MAG', tipo: 'CLT',      urgente: false },
  { id: 3, cargo: 'Inspetor de Soldagem Nível I',    empresa: 'Petroquímica Delta',        cidade: 'Santos – SP',    salario: '7.000–9.000', processo: 'Multi',   tipo: 'CLT',      urgente: true  },
  { id: 4, cargo: 'Soldador SMAW — Tubulação',       empresa: 'Construtora Horizonte',    cidade: 'Santo André – SP', salario: '4.000–4.800', processo: 'SMAW', tipo: 'PJ',       urgente: false },
  { id: 5, cargo: 'Operador de Soldagem Submersa',   empresa: 'Navios do Brasil S/A',     cidade: 'Santos – SP',    salario: '6.000–7.500', processo: 'SAW',     tipo: 'CLT',      urgente: false },
  { id: 6, cargo: 'Soldador TIG/MIG Automotivo',     empresa: 'Montadora Fortal',         cidade: 'São Paulo – SP', salario: '4.200–5.000', processo: 'TIG',     tipo: 'Temporário', urgente: true },
]

const PROCESSOS = ['Todos', 'TIG', 'MIG/MAG', 'SMAW', 'FCAW', 'SAW', 'Multi']
const TIPO_COLORS: Record<string, string> = { CLT: '#10B981', PJ: '#3B82F6', Temporário: '#F59E0B' }

export function VagasPage() {
  const [search,   setSearch]   = useState('')
  const [processo, setProcesso] = useState('Todos')
  const [applied,  setApplied]  = useState<Set<number>>(new Set())

  const lista = VAGAS.filter(v =>
    (processo === 'Todos' || v.processo === processo) &&
    (!search || v.cargo.toLowerCase().includes(search.toLowerCase()) || v.empresa.toLowerCase().includes(search.toLowerCase()))
  )

  function apply(id: number) {
    setApplied(prev => new Set(prev).add(id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Vagas</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Oportunidades para soldadores qualificados</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por cargo ou empresa..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border bg-[var(--color-surface)] text-[var(--color-text)]"
            style={{ borderColor: 'var(--color-border)' }} />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Filter size={15} className="self-center text-[var(--color-text-muted)]" />
          {PROCESSOS.map(p => (
            <button key={p} onClick={() => setProcesso(p)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              style={processo === p ? { background: COLOR, color: '#fff' } : { background: 'var(--color-surface-elevated)', color: 'var(--color-text-muted)' }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {lista.map(v => {
          const isApplied = applied.has(v.id)
          const tipoCor   = TIPO_COLORS[v.tipo] ?? '#64748B'
          return (
            <Card key={v.id}>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: COLOR + '15' }}>
                  <Briefcase size={19} style={{ color: COLOR }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <h3 className="font-bold text-[var(--color-text)]">{v.cargo}</h3>
                    {v.urgente && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-500">Urgente</span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)]">{v.empresa}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-[var(--color-text-muted)]">
                    <span className="flex items-center gap-1"><MapPin size={11} />{v.cidade}</span>
                    <span className="flex items-center gap-1"><DollarSign size={11} />R$ {v.salario}</span>
                    <span className="flex items-center gap-1"><Clock size={11} />
                      <span style={{ color: tipoCor }}>{v.tipo}</span>
                    </span>
                    <span className="px-1.5 py-0.5 rounded-full"
                      style={{ background: '#6366F1' + '15', color: '#6366F1' }}>{v.processo}</span>
                  </div>
                </div>
                <button
                  onClick={() => !isApplied && apply(v.id)}
                  disabled={isApplied}
                  className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  style={isApplied
                    ? { background: '#10B981' + '15', color: '#10B981', cursor: 'default' }
                    : { background: COLOR, color: '#fff' }}>
                  {isApplied ? 'Candidatado' : 'Candidatar'}
                </button>
              </div>
            </Card>
          )
        })}
        {lista.length === 0 && (
          <Card><div className="text-center py-10 text-[var(--color-text-muted)] text-sm">Nenhuma vaga encontrada</div></Card>
        )}
      </div>
    </div>
  )
}
