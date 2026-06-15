import { useState } from 'react'
import { FileCheck, Search, ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui'

const COLOR = '#3B82F6'

const NORMAS = [
  { num: 'ABNT NBR 14842',   titulo: 'Soldagem — Soldagem TIG e plasma de arco',               org: 'ABNT', area: 'TIG',        ano: 2018 },
  { num: 'ABNT NBR 14984',   titulo: 'Soldagem e técnicas afins — Terminologia',                org: 'ABNT', area: 'Geral',      ano: 2003 },
  { num: 'ABNT NBR ISO 9692-1', titulo: 'Soldagem — Preparação de juntas para aço carbono',    org: 'ABNT/ISO', area: 'Projeto', ano: 2016 },
  { num: 'AWS D1.1',          titulo: 'Structural Welding Code — Steel',                         org: 'AWS',  area: 'Estrutural', ano: 2020 },
  { num: 'AWS D1.6',          titulo: 'Structural Welding Code — Stainless Steel',               org: 'AWS',  area: 'Inox',       ano: 2017 },
  { num: 'AWS B2.1',          titulo: 'Specification for Welding Procedure and Performance',     org: 'AWS',  area: 'WPS/PQR',   ano: 2021 },
  { num: 'ASME IX',           titulo: 'Welding, Brazing, and Fusing Qualifications',             org: 'ASME', area: 'WPS/PQR',   ano: 2021 },
  { num: 'NR 9',              titulo: 'Avaliação e controle de riscos ambientais no trabalho',   org: 'MTE',  area: 'Segurança', ano: 2022 },
  { num: 'NR 10',             titulo: 'Segurança em instalações e serviços em eletricidade',     org: 'MTE',  area: 'Segurança', ano: 2021 },
  { num: 'ISO 9606-1',        titulo: 'Qualification testing of welders — Fusion welding',        org: 'ISO',  area: 'Qualificação', ano: 2017 },
  { num: 'FBTS / S-1',       titulo: 'Qualificação de soldadores pela FBTS',                     org: 'FBTS', area: 'Qualificação', ano: 2023 },
]

const ORGS  = ['Todos', 'ABNT', 'AWS', 'ASME', 'ISO', 'MTE', 'FBTS']
const AREAS = ['Todos', 'TIG', 'Geral', 'Projeto', 'Estrutural', 'Inox', 'WPS/PQR', 'Segurança', 'Qualificação']

const ORG_COLORS: Record<string, string> = {
  ABNT: '#3B82F6', AWS: '#8B5CF6', ASME: '#F59E0B', ISO: '#10B981', MTE: '#EF4444', FBTS: '#FF8C00'
}

export function NormasPage() {
  const [search, setSearch] = useState('')
  const [org,    setOrg]    = useState('Todos')

  const lista = NORMAS.filter(n =>
    (org === 'Todos' || n.org === org || n.org.startsWith(org)) &&
    (!search || n.num.toLowerCase().includes(search.toLowerCase()) || n.titulo.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Normas Técnicas</h1>
        <p className="text-sm text-[var(--color-text-muted)]">ABNT, AWS, ASME, ISO e demais normas relevantes</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar norma..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border bg-[var(--color-surface)] text-[var(--color-text)]"
            style={{ borderColor: 'var(--color-border)' }} />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {ORGS.map(o => (
            <button key={o} onClick={() => setOrg(o)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors"
              style={org === o ? { background: COLOR, color: '#fff' } : { background: 'var(--color-surface-elevated)', color: 'var(--color-text-muted)' }}>
              {o}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {lista.map(n => {
          const orgColor = ORG_COLORS[n.org] ?? COLOR
          return (
            <Card key={n.num}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: orgColor + '15' }}>
                  <FileCheck size={16} style={{ color: orgColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-[var(--color-text)]">{n.num}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded"
                      style={{ background: orgColor + '15', color: orgColor }}>{n.org}</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5 truncate">{n.titulo}</p>
                </div>
                <span className="text-xs text-[var(--color-text-muted)] flex-shrink-0">{n.ano}</span>
                <button className="flex-shrink-0 flex items-center gap-1 text-xs"
                  style={{ color: COLOR }}>
                  <ExternalLink size={12} />Ver
                </button>
              </div>
            </Card>
          )
        })}
        {lista.length === 0 && (
          <Card><div className="text-center py-10 text-[var(--color-text-muted)] text-sm">Nenhuma norma encontrada</div></Card>
        )}
      </div>
    </div>
  )
}
