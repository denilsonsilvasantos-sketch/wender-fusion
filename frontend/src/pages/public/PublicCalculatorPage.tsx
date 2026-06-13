import { useState, useMemo } from 'react'
import { Calculator, Info, ChevronDown } from 'lucide-react'

// ── Tabelas de bitola por processo ──────────────────────────────────────────
const BITOLA_TABLES = {
  TIG: [
    { diam: '1,0 mm', ampMin: 10,  ampMax: 75,  volt: '10–14 V', espMin: 0.5, espMax: 2   },
    { diam: '1,6 mm', ampMin: 60,  ampMax: 130, volt: '11–14 V', espMin: 1.5, espMax: 4   },
    { diam: '2,4 mm', ampMin: 100, ampMax: 220, volt: '12–16 V', espMin: 3,   espMax: 8   },
    { diam: '3,2 mm', ampMin: 180, ampMax: 310, volt: '14–18 V', espMin: 6,   espMax: 999 },
  ],
  'MIG/MAG': [
    { diam: '0,8 mm', ampMin: 60,  ampMax: 130, volt: '16–22 V', espMin: 0.8, espMax: 3   },
    { diam: '1,0 mm', ampMin: 100, ampMax: 200, volt: '18–26 V', espMin: 2,   espMax: 6   },
    { diam: '1,2 mm', ampMin: 150, ampMax: 280, volt: '20–30 V', espMin: 4,   espMax: 12  },
    { diam: '1,6 mm', ampMin: 220, ampMax: 400, volt: '24–36 V', espMin: 8,   espMax: 999 },
  ],
  Eletrodo: [
    { diam: '2,0 mm', ampMin: 45,  ampMax: 75,  volt: '22–25 V', espMin: 1.5, espMax: 3   },
    { diam: '2,5 mm', ampMin: 60,  ampMax: 100, volt: '22–26 V', espMin: 2,   espMax: 4   },
    { diam: '3,25 mm',ampMin: 90,  ampMax: 140, volt: '23–28 V', espMin: 3,   espMax: 8   },
    { diam: '4,0 mm', ampMin: 130, ampMax: 190, volt: '24–30 V', espMin: 5,   espMax: 14  },
    { diam: '5,0 mm', ampMin: 175, ampMax: 250, volt: '25–32 V', espMin: 10,  espMax: 999 },
  ],
}

// ── Lógica de cálculo ────────────────────────────────────────────────────────
interface Params {
  processo: 'TIG' | 'MIG/MAG' | 'Eletrodo'
  material: string
  espessura: number
  bitola: string
  junta: string
  posicao: string
  comprimento: number
}

interface Result {
  ampMin: number
  ampMax: number
  ampRec: number
  volt: string
  bitola: string
  velocidade: string
  consumivel: string
  gas: string
  tempo: string
  notas: string[]
}

function getBitolaParaEspessura(processo: Params['processo'], esp: number) {
  const table = BITOLA_TABLES[processo]
  const row = table.find(r => esp >= r.espMin && esp <= r.espMax) ?? table[table.length - 1]
  return row.diam
}

function calcular(p: Params): Result {
  const table = BITOLA_TABLES[p.processo]
  const row = table.find(r => r.diam === p.bitola) ?? table[0]

  let ampRec = Math.round((row.ampMin + row.ampMax) / 2)
  const notas: string[] = []

  // Ajustes por material
  if (p.material === 'Aço Inox') {
    ampRec = Math.round(ampRec * 0.9)
    notas.push('Reduza 10% da amperagem para aço inox — controle de calor é crítico.')
  }
  if (p.material === 'Alumínio') {
    if (p.processo === 'TIG') notas.push('Use corrente alternada (CA/AC) para alumínio no TIG.')
    else { ampRec = Math.round(ampRec * 1.1); notas.push('Aumente ~10% da amperagem para alumínio.') }
  }
  if (p.material === 'Aço Carbono' && p.processo === 'TIG') {
    notas.push('Use corrente contínua eletrodo negativo (CCEN / DCEN).')
  }

  // Ajuste por posição
  if (p.posicao === 'Vertical') { ampRec = Math.round(ampRec * 0.85); notas.push('Posição vertical: reduza ~15% da amperagem.') }
  if (p.posicao === 'Sobrecabeça') { ampRec = Math.round(ampRec * 0.80); notas.push('Posição sobrecabeça: reduza ~20% da amperagem.') }

  // Ajuste por junta
  if (p.junta === 'Filete' && p.processo !== 'TIG') notas.push('Para filetes, incline a tocha/eletrodo ~45° em relação às peças.')
  if (p.junta === 'Topo' && p.processo === 'Eletrodo') notas.push('Junta de topo: garanta chanfro adequado em chapas > 6 mm.')

  // Velocidade (cm/min)
  const velMin = Math.round(p.espessura * 12)
  const velMax = Math.round(p.espessura * 22)
  const velocidade = `${velMin}–${velMax} cm/min`

  // Consumo por comprimento (se informado)
  let consumivel = '—'
  let gas = '—'
  let tempo = '—'

  if (p.comprimento > 0) {
    const velMedia = (velMin + velMax) / 2 // cm/min
    const tempoMin = (p.comprimento * 100) / velMedia // minutos
    tempo = `${tempoMin < 1 ? '<1' : Math.round(tempoMin)} min`

    if (p.processo === 'Eletrodo') {
      // Taxa de deposição SMAW: ~1-3 kg/h dependendo da amperagem
      const taxaDep = ampRec * 0.0008 // kg/min aprox
      const consKg = taxaDep * tempoMin
      const numEletrodos = Math.ceil(consKg / 0.045) // eletrodo 3.25mm pesa ~45g
      consumivel = `~${consKg.toFixed(2)} kg (aprox. ${numEletrodos} eletrodos)`
      notas.push('Inclua ~25% de perda por bituca ao calcular o estoque.')
    } else if (p.processo === 'MIG/MAG') {
      const taxaDep = ampRec * 0.0007
      const consKg = taxaDep * tempoMin
      consumivel = `~${consKg.toFixed(2)} kg de arame`
      const gasLMin = 14
      gas = `~${Math.round(gasLMin * tempoMin)} L (${gasLMin} L/min)`
      notas.push('Gás recomendado: mistura 75% Ar + 25% CO₂ (C25) para aços carbono.')
    } else if (p.processo === 'TIG') {
      const taxaDep = ampRec * 0.0004
      const consKg = taxaDep * tempoMin
      consumivel = `~${consKg.toFixed(2)} kg de vareta`
      const gasLMin = 10
      gas = `~${Math.round(gasLMin * tempoMin)} L (${gasLMin} L/min)`
      notas.push('Gás recomendado: Argônio puro (99,99%) para aço carbono e inox.')
    }
  }

  return {
    ampMin: row.ampMin, ampMax: row.ampMax, ampRec,
    volt: row.volt, bitola: row.diam, velocidade,
    consumivel, gas, tempo, notas,
  }
}

// ── Componente ───────────────────────────────────────────────────────────────
const PROCESSOS = ['TIG', 'MIG/MAG', 'Eletrodo'] as const
const MATERIAIS = ['Aço Carbono', 'Aço Inox', 'Alumínio', 'Cobre', 'Ferro Fundido']
const JUNTAS = ['Topo', 'Filete', 'Sobreposição', 'Canto']
const POSICOES = ['Plana (1G/1F)', 'Horizontal (2G/2F)', 'Vertical (3G/3F)', 'Sobrecabeça (4G/4F)']

function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#FF8C00' }}>{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl px-4 py-3 pr-10 text-sm font-medium transition-all focus:outline-none"
          style={{ background: '#2a2a2a', border: '1px solid #ffffff15', color: '#ffffff' }}
        >
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#6B7280' }} />
      </div>
    </div>
  )
}

function NumInput({ label, value, onChange, min, max, step, unit }: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; unit?: string
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#FF8C00' }}>{label}</label>
      <div className="relative">
        <input
          type="number" min={min} max={max} step={step ?? 0.5} value={value}
          onChange={e => onChange(parseFloat(e.target.value) || min || 1)}
          className="w-full rounded-xl px-4 py-3 text-sm font-medium focus:outline-none"
          style={{ background: '#2a2a2a', border: '1px solid #ffffff15', color: '#ffffff' }}
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: '#6B7280' }}>{unit}</span>
        )}
      </div>
    </div>
  )
}

export function PublicCalculatorPage() {
  const [processo, setProcesso] = useState<Params['processo']>('MIG/MAG')
  const [material, setMaterial] = useState('Aço Carbono')
  const [espessura, setEspessura] = useState(4)
  const [bitolaManual, setBitolaManual] = useState('')
  const [junta, setJunta] = useState('Topo')
  const [posicao, setPosicao] = useState('Plana (1G/1F)')
  const [comprimento, setComprimento] = useState(1)
  const [calculado, setCalculado] = useState(false)

  const bitolaSugerida = useMemo(() => getBitolaParaEspessura(processo, espessura), [processo, espessura])
  const bitolaAtual = bitolaManual || bitolaSugerida
  const bitolaOptions = BITOLA_TABLES[processo].map(r => r.diam)

  const result = useMemo<Result | null>(() => {
    if (!calculado) return null
    return calcular({ processo, material, espessura, bitola: bitolaAtual, junta, posicao: posicao.split(' ')[0], comprimento })
  }, [calculado, processo, material, espessura, bitolaAtual, junta, posicao, comprimento])

  function handleCalcular() {
    setBitolaManual(prev => prev || bitolaSugerida)
    setCalculado(true)
  }

  function handleReset() { setCalculado(false); setBitolaManual('') }

  return (
    <div style={{ background: '#1A1A1A', minHeight: '100vh' }}>

      {/* Hero */}
      <section className="py-14 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-2xl mx-auto px-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: '#FF8C0015' }}>
            <Calculator size={26} style={{ color: '#FF8C00' }} />
          </div>
          <h1 className="text-4xl font-black text-white mb-3">Calculadora de Soldagem</h1>
          <p className="text-base" style={{ color: '#d1d5db' }}>
            Calcule amperagem, bitola, tensão, consumo de insumos e tempo estimado para o seu processo.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid lg:grid-cols-2 gap-8">

          {/* ── FORMULÁRIO ── */}
          <div className="rounded-2xl p-7 border" style={{ background: '#242424', borderColor: '#ffffff0d' }}>
            <h2 className="text-lg font-black text-white mb-6">Parâmetros de Entrada</h2>

            <div className="space-y-5">
              {/* Processo */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#FF8C00' }}>Processo</label>
                <div className="grid grid-cols-3 gap-2">
                  {PROCESSOS.map(p => (
                    <button key={p} onClick={() => { setProcesso(p); setBitolaManual(''); handleReset() }}
                      className="py-2.5 px-3 rounded-xl text-sm font-bold transition-all"
                      style={processo === p
                        ? { background: '#FF8C00', color: '#000' }
                        : { background: '#1A1A1A', color: '#9ca3af', border: '1px solid #ffffff15' }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <SelectField label="Material Base" value={material} onChange={v => { setMaterial(v); handleReset() }} options={MATERIAIS} />

              <div className="grid grid-cols-2 gap-4">
                <NumInput label="Espessura" value={espessura} onChange={v => { setEspessura(v); setBitolaManual(''); handleReset() }} min={0.5} max={50} unit="mm" />
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#FF8C00' }}>
                    Bitola
                    <span className="ml-1 text-[9px] font-normal" style={{ color: '#6B7280' }}>
                      (sugerida: {bitolaSugerida})
                    </span>
                  </label>
                  <div className="relative">
                    <select
                      value={bitolaManual || bitolaSugerida}
                      onChange={e => { setBitolaManual(e.target.value); handleReset() }}
                      className="w-full appearance-none rounded-xl px-4 py-3 pr-10 text-sm font-medium"
                      style={{ background: '#2a2a2a', border: `1px solid ${bitolaManual ? '#FF8C0060' : '#ffffff15'}`, color: '#ffffff' }}>
                      {bitolaOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#6B7280' }} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <SelectField label="Tipo de Junta" value={junta} onChange={v => { setJunta(v); handleReset() }} options={JUNTAS} />
                <SelectField label="Posição" value={posicao} onChange={v => { setPosicao(v); handleReset() }} options={POSICOES} />
              </div>

              <NumInput label="Comprimento do Cordão (para consumo)" value={comprimento} onChange={v => { setComprimento(v); handleReset() }} min={0.1} max={1000} step={0.1} unit="m" />

              <button
                onClick={handleCalcular}
                className="w-full py-3.5 rounded-xl font-black text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2"
                style={{ background: '#FF8C00', color: '#000' }}>
                <Calculator size={16} /> Calcular Parâmetros
              </button>
            </div>
          </div>

          {/* ── RESULTADO ── */}
          <div className="rounded-2xl border" style={{ background: '#242424', borderColor: '#ffffff0d' }}>
            {!result ? (
              <div className="h-full flex flex-col items-center justify-center p-10 text-center">
                <Calculator size={48} style={{ color: '#FF8C0025', marginBottom: 16 }} />
                <p className="text-white font-semibold mb-1">Preencha os parâmetros</p>
                <p className="text-sm" style={{ color: '#6B7280' }}>Os resultados aparecerão aqui após calcular.</p>
              </div>
            ) : (
              <div className="p-7">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-black text-white">Resultado</h2>
                  <button onClick={handleReset} className="text-xs px-3 py-1.5 rounded-lg" style={{ color: '#6B7280', background: '#1A1A1A' }}>
                    Limpar
                  </button>
                </div>

                {/* Amperagem */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: 'Mínima', value: `${result.ampMin}A` },
                    { label: 'Recomendada', value: `${result.ampRec}A`, highlight: true },
                    { label: 'Máxima', value: `${result.ampMax}A` },
                  ].map(({ label, value, highlight }) => (
                    <div key={label} className="p-3 rounded-xl text-center border"
                      style={highlight
                        ? { background: '#FF8C0015', borderColor: '#FF8C0040' }
                        : { background: '#1A1A1A', borderColor: '#ffffff0d' }}>
                      <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#9ca3af' }}>{label}</p>
                      <p className="text-xl font-black" style={{ color: highlight ? '#FF8C00' : '#ffffff' }}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Detalhes */}
                <div className="space-y-0 mb-5 rounded-xl overflow-hidden border" style={{ borderColor: '#ffffff08' }}>
                  {[
                    { label: 'Bitola', value: result.bitola },
                    { label: 'Tensão', value: result.volt },
                    { label: 'Velocidade', value: result.velocidade },
                    { label: 'Consumo de consumível', value: result.consumivel },
                    ...(result.gas !== '—' ? [{ label: 'Consumo de gás', value: result.gas }] : []),
                    { label: 'Tempo estimado', value: result.tempo },
                  ].map(({ label, value }, i) => (
                    <div key={label} className="flex justify-between px-4 py-3 text-sm"
                      style={{ background: i % 2 === 0 ? '#1e1e1e' : '#1A1A1A' }}>
                      <span style={{ color: '#d1d5db' }}>{label}</span>
                      <span className="font-semibold text-white">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Notas */}
                {result.notas.length > 0 && (
                  <div className="rounded-xl p-4 border" style={{ background: '#1A1A1A', borderColor: '#FF8C0020' }}>
                    <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#FF8C00' }}>
                      <Info size={13} /> Observações Técnicas
                    </p>
                    <ul className="space-y-1.5">
                      {result.notas.map((n, i) => (
                        <li key={i} className="text-xs flex items-start gap-2" style={{ color: '#d1d5db' }}>
                          <span style={{ color: '#FF8C00', flexShrink: 0 }}>•</span> {n}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── TABELA DE REFERÊNCIA ── */}
        <div className="mt-10 rounded-2xl border overflow-hidden" style={{ borderColor: '#ffffff0d' }}>
          <div className="px-6 py-4 border-b" style={{ background: '#242424', borderColor: '#ffffff0d' }}>
            <h3 className="font-black text-white">Tabela de Referência — Bitola × Amperagem ({processo})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#1e1e1e' }}>
                  {['Bitola', 'Amp. Mínima', 'Amp. Máxima', 'Tensão', 'Espessura Indicada'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest" style={{ color: '#FF8C00' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BITOLA_TABLES[processo].map((r, i) => (
                  <tr key={r.diam} className="border-t" style={{ background: i % 2 === 0 ? '#1A1A1A' : '#242424', borderColor: '#ffffff08' }}>
                    <td className="px-5 py-3 font-bold text-white">{r.diam}</td>
                    <td className="px-5 py-3" style={{ color: '#d1d5db' }}>{r.ampMin}A</td>
                    <td className="px-5 py-3" style={{ color: '#d1d5db' }}>{r.ampMax}A</td>
                    <td className="px-5 py-3" style={{ color: '#d1d5db' }}>{r.volt}</td>
                    <td className="px-5 py-3" style={{ color: '#d1d5db' }}>
                      {r.espMax === 999 ? `> ${r.espMin} mm` : `${r.espMin}–${r.espMax} mm`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── AVISO ── */}
        <div className="mt-6 p-4 rounded-xl border text-sm" style={{ background: '#242424', borderColor: '#ffffff08', color: '#9ca3af' }}>
          <span style={{ color: '#FF8C00' }}>⚠ Atenção:</span> Os valores calculados são referências baseadas em parâmetros típicos. Sempre valide os parâmetros reais com o WPS (Welding Procedure Specification) do seu projeto e ajuste conforme as condições reais de soldagem.
        </div>
      </div>
    </div>
  )
}
