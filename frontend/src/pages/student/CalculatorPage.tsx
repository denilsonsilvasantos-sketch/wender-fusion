import { useState } from 'react'
import { Calculator, Info } from 'lucide-react'
import { Card, Button, Select } from '@/components/ui'
import type { WeldingParams, WeldingCalculationResult } from '@/types'

function calculateWelding(params: WeldingParams): WeldingCalculationResult {
  const { process, material, thickness, joint_type } = params
  const notes: string[] = []
  let ampMin = 0, ampMax = 0, ampRec = 0

  // Simplified welding calculation formulas
  if (process === 'MIG' || process === 'MAG') {
    ampMin = thickness * 25
    ampMax = thickness * 45
    ampRec = thickness * 35
    if (material === 'Aço Inox') { ampRec *= 0.9; notes.push('Reduza 10% da amperagem para aço inox') }
    if (material === 'Alumínio') { ampRec *= 1.1; notes.push('Aumente 10% da amperagem para alumínio') }
    if (joint_type === 'Filete') notes.push('Para filetes, incline a tocha 45° em relação às peças')
    notes.push('Velocidade de alimentação: ajuste conforme tensão do arco')
  } else if (process === 'TIG') {
    ampMin = thickness * 20
    ampMax = thickness * 35
    ampRec = thickness * 27
    if (material === 'Alumínio') { notes.push('Use corrente alternada (AC) para alumínio') }
    else notes.push('Use corrente contínua eletrodo negativo (CCEN)')
  } else if (process === 'Eletrodo') {
    ampMin = thickness * 30
    ampMax = thickness * 55
    ampRec = thickness * 40
    notes.push('Varie ±10% conforme posição de soldagem')
    if (joint_type === 'Topo') notes.push('Na posição vertical, reduza a amperagem em 15%')
  } else if (process === 'Arame Tubular') {
    ampMin = thickness * 28
    ampMax = thickness * 50
    ampRec = thickness * 38
    notes.push('Use gás de proteção CO2 ou mistura Ar/CO2')
  }

  // Electrode/wire diameter recommendation
  let wire_diameter = ''
  if (thickness <= 2) wire_diameter = '0.8 mm'
  else if (thickness <= 4) wire_diameter = '1.0 mm'
  else if (thickness <= 8) wire_diameter = '1.2 mm'
  else wire_diameter = '1.6 mm'

  let electrode_diameter = ''
  if (process === 'Eletrodo') {
    if (thickness <= 3) electrode_diameter = '2.5 mm (E6013)'
    else if (thickness <= 6) electrode_diameter = '3.25 mm (E6013/E7018)'
    else electrode_diameter = '4.0 mm (E7018)'
  }

  return { amperage_min: Math.round(ampMin), amperage_max: Math.round(ampMax), amperage_recommended: Math.round(ampRec), wire_diameter: process !== 'Eletrodo' ? wire_diameter : undefined, electrode_diameter: process === 'Eletrodo' ? electrode_diameter : undefined, travel_speed: `${Math.round(thickness * 15)}-${Math.round(thickness * 25)} cm/min`, notes }
}

const PROCESSES = ['MIG', 'MAG', 'TIG', 'Eletrodo', 'Arame Tubular'] as const
const MATERIALS = ['Aço Carbono', 'Aço Inox', 'Alumínio'] as const
const JOINTS = ['Topo', 'Filete', 'Sobreposição', 'Canto'] as const

export function CalculatorPage() {
  const [params, setParams] = useState<WeldingParams>({
    process: 'MIG', material: 'Aço Carbono', thickness: 3, joint_type: 'Topo',
  })
  const [result, setResult] = useState<WeldingCalculationResult | null>(null)

  function handleCalculate() {
    setResult(calculateWelding(params))
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)] flex items-center gap-2">
          <Calculator size={28} className="text-[var(--color-primary)]" />
          Calculadora de Soldagem
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Calcule os parâmetros ideais para o seu processo de soldagem</p>
      </div>

      <Card title="Parâmetros">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Processo"
            value={params.process}
            onChange={(e) => setParams({ ...params, process: e.target.value as WeldingParams['process'] })}
            options={PROCESSES.map((p) => ({ value: p, label: p }))}
          />
          <Select
            label="Material"
            value={params.material}
            onChange={(e) => setParams({ ...params, material: e.target.value as WeldingParams['material'] })}
            options={MATERIALS.map((m) => ({ value: m, label: m }))}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
              Espessura (mm)
            </label>
            <input
              type="number"
              min={0.5}
              max={50}
              step={0.5}
              value={params.thickness}
              onChange={(e) => setParams({ ...params, thickness: parseFloat(e.target.value) || 1 })}
              className="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          <Select
            label="Tipo de Junta"
            value={params.joint_type}
            onChange={(e) => setParams({ ...params, joint_type: e.target.value as WeldingParams['joint_type'] })}
            options={JOINTS.map((j) => ({ value: j, label: j }))}
          />
        </div>
        <Button className="mt-5 w-full" onClick={handleCalculate} leftIcon={<Calculator size={16} />}>
          Calcular Parâmetros
        </Button>
      </Card>

      {result && (
        <Card title="Resultado">
          <div className="grid grid-cols-3 gap-4 mb-5">
            {[
              { label: 'Mínima', value: `${result.amperage_min}A` },
              { label: 'Recomendada', value: `${result.amperage_recommended}A`, highlight: true },
              { label: 'Máxima', value: `${result.amperage_max}A` },
            ].map(({ label, value, highlight }) => (
              <div key={label} className={`p-3 rounded-lg text-center ${highlight ? 'bg-[var(--color-primary-light)] border border-[var(--color-primary)]/30' : 'bg-[var(--color-surface-elevated)]'}`}>
                <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-1">{label}</p>
                <p className={`text-xl font-black ${highlight ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]'}`}>{value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2 mb-4 text-sm">
            {result.wire_diameter && (
              <div className="flex justify-between py-2 border-b border-[var(--color-border)]">
                <span className="text-[var(--color-text-muted)]">Diâmetro do Arame</span>
                <span className="font-medium text-[var(--color-text)]">{result.wire_diameter}</span>
              </div>
            )}
            {result.electrode_diameter && (
              <div className="flex justify-between py-2 border-b border-[var(--color-border)]">
                <span className="text-[var(--color-text-muted)]">Eletrodo Recomendado</span>
                <span className="font-medium text-[var(--color-text)]">{result.electrode_diameter}</span>
              </div>
            )}
            {result.travel_speed && (
              <div className="flex justify-between py-2 border-b border-[var(--color-border)]">
                <span className="text-[var(--color-text-muted)]">Velocidade de Soldagem</span>
                <span className="font-medium text-[var(--color-text)]">{result.travel_speed}</span>
              </div>
            )}
          </div>

          {result.notes.length > 0 && (
            <div className="bg-[var(--color-surface-elevated)] rounded-lg p-3">
              <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-secondary)] mb-2">
                <Info size={14} />Observações Técnicas
              </p>
              <ul className="space-y-1">
                {result.notes.map((note, i) => (
                  <li key={i} className="text-xs text-[var(--color-text-secondary)]">• {note}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
