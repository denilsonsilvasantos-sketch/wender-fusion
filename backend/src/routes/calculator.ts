import { Router } from 'express'
import type { Response } from 'express'

const router = Router()

// GET /api/calculator/params - public, returns welding calculation
router.post('/calculate', (req, res: Response) => {
  const { process, material, thickness, joint_type } = req.body

  if (!process || !material || !thickness) {
    return res.status(400).json({ message: 'Parâmetros obrigatórios: process, material, thickness' })
  }

  const notes: string[] = []
  let ampMin = 0, ampMax = 0, ampRec = 0

  if (process === 'MIG' || process === 'MAG') {
    ampMin = thickness * 25; ampMax = thickness * 45; ampRec = thickness * 35
    if (material === 'Aço Inox') { ampRec *= 0.9; notes.push('Reduza 10% da amperagem para aço inox') }
    if (material === 'Alumínio') { ampRec *= 1.1; notes.push('Aumente 10% para alumínio. Use tocha MIG específica.') }
    notes.push(`Tensão recomendada: ${(14 + thickness * 0.5).toFixed(1)} - ${(18 + thickness * 0.5).toFixed(1)} V`)
  } else if (process === 'TIG') {
    ampMin = thickness * 20; ampMax = thickness * 35; ampRec = thickness * 27
    if (material === 'Alumínio') notes.push('Use corrente alternada (AC) para alumínio')
    else notes.push('Use corrente contínua eletrodo negativo (CCEN)')
    notes.push('Gás de proteção: Argônio 99,99%')
  } else if (process === 'Eletrodo') {
    ampMin = thickness * 30; ampMax = thickness * 55; ampRec = thickness * 40
    notes.push('Varie ±10% conforme posição de soldagem')
    if (joint_type === 'Topo') notes.push('Na posição vertical, reduza a amperagem em 15%')
  } else if (process === 'Arame Tubular') {
    ampMin = thickness * 28; ampMax = thickness * 50; ampRec = thickness * 38
    notes.push('Use gás de proteção CO2 puro ou mistura Ar/CO2 (75/25%)')
  }

  const wireDiameter = thickness <= 2 ? '0.8 mm' : thickness <= 4 ? '1.0 mm' : thickness <= 8 ? '1.2 mm' : '1.6 mm'
  const electrodeDiameter = process === 'Eletrodo' ? (thickness <= 3 ? '2.5 mm (E6013)' : thickness <= 6 ? '3.25 mm (E6013/E7018)' : '4.0 mm (E7018)') : undefined

  res.json({
    data: {
      amperage_min: Math.round(ampMin),
      amperage_max: Math.round(ampMax),
      amperage_recommended: Math.round(ampRec),
      wire_diameter: process !== 'Eletrodo' ? wireDiameter : undefined,
      electrode_diameter: electrodeDiameter,
      travel_speed: `${Math.round(thickness * 15)}-${Math.round(thickness * 25)} cm/min`,
      notes,
    }
  })
})

export default router
