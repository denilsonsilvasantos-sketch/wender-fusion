import { useState } from 'react'
import { BookOpen, ExternalLink, Search } from 'lucide-react'
import { Card } from '@/components/ui'

const COLOR = '#3B82F6'

const ACERVO = [
  { id: 1, titulo: 'Manual de Soldagem Lincoln Electric',        tipo: 'livro',  cat: 'Referência', ano: 2022, idioma: 'PT' },
  { id: 2, titulo: 'AWS D1.1 — Structural Welding Code (Steel)', tipo: 'norma',  cat: 'AWS',        ano: 2020, idioma: 'EN' },
  { id: 3, titulo: 'ABNT NBR 14842 — Soldagem TIG',              tipo: 'norma',  cat: 'ABNT',       ano: 2018, idioma: 'PT' },
  { id: 4, titulo: 'Soldagem e Metalurgia — M. F. Modenesi',     tipo: 'livro',  cat: 'Teoria',     ano: 2021, idioma: 'PT' },
  { id: 5, titulo: 'Guia Rápido de Defeitos em Soldagem',        tipo: 'artigo', cat: 'Prática',    ano: 2023, idioma: 'PT' },
  { id: 6, titulo: 'Inspeção de Soldas — ASNT Level I',          tipo: 'manual', cat: 'Inspeção',   ano: 2019, idioma: 'EN' },
  { id: 7, titulo: 'Metalurgia da Soldagem — Resistência dos Materiais', tipo: 'livro', cat: 'Teoria', ano: 2020, idioma: 'PT' },
  { id: 8, titulo: 'WPS/PQR — Como elaborar corretamente',       tipo: 'artigo', cat: 'Prática',    ano: 2024, idioma: 'PT' },
  { id: 9, titulo: 'Ergonomia e Segurança em Soldagem — NR-9',   tipo: 'manual', cat: 'Segurança',  ano: 2023, idioma: 'PT' },
]

const TIPO_ICONS: Record<string, string> = { livro: '📚', norma: '📋', artigo: '📄', manual: '📖' }
const CATS = ['Todos', 'Referência', 'AWS', 'ABNT', 'Teoria', 'Prática', 'Inspeção', 'Segurança']

export function BibliotecaPage() {
  const [search, setSearch] = useState('')
  const [cat,    setCat]    = useState('Todos')

  const lista = ACERVO.filter(a =>
    (cat === 'Todos' || a.cat === cat) &&
    (!search || a.titulo.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Biblioteca Técnica</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Acervo de manuais, livros e normas técnicas</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar no acervo..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border bg-[var(--color-surface)] text-[var(--color-text)]"
            style={{ borderColor: 'var(--color-border)' }} />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors"
              style={cat === c ? { background: COLOR, color: '#fff' } : { background: 'var(--color-surface-elevated)', color: 'var(--color-text-muted)' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {lista.map(a => (
          <Card key={a.id}>
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">{TIPO_ICONS[a.tipo]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-text)] leading-snug">{a.titulo}</p>
                <div className="flex gap-2 mt-1.5 flex-wrap">
                  <span className="text-xs px-1.5 py-0.5 rounded"
                    style={{ background: COLOR + '15', color: COLOR }}>{a.cat}</span>
                  <span className="text-xs text-[var(--color-text-muted)]">{a.ano}</span>
                  <span className="text-xs text-[var(--color-text-muted)]">{a.idioma}</span>
                </div>
              </div>
              <button className="flex items-center gap-1 text-xs flex-shrink-0"
                style={{ color: COLOR }}>
                <ExternalLink size={13} />Ver
              </button>
            </div>
          </Card>
        ))}
        {lista.length === 0 && (
          <div className="col-span-2">
            <Card><div className="text-center py-10 text-[var(--color-text-muted)] text-sm">Nenhum item encontrado</div></Card>
          </div>
        )}
      </div>
    </div>
  )
}
