import { useState } from 'react'
import { FileText, Download, Search, Filter } from 'lucide-react'
import { Card } from '@/components/ui'

const COLOR = '#6366F1'

const APOSTILAS = [
  { id: 1, titulo: 'Apostila TIG — Módulo 1: Fundamentos',       cat: 'TIG',     tamanho: '4.2 MB', paginas: 72,  data: '10/03/2026', tipo: 'pdf' },
  { id: 2, titulo: 'Apostila TIG — Módulo 2: Materiais',          cat: 'TIG',     tamanho: '5.8 MB', paginas: 91,  data: '10/04/2026', tipo: 'pdf' },
  { id: 3, titulo: 'Apostila TIG — Módulo 3: Posições',           cat: 'TIG',     tamanho: '6.1 MB', paginas: 98,  data: '05/05/2026', tipo: 'pdf' },
  { id: 4, titulo: 'Lista de Exercícios — Parâmetros TIG',        cat: 'TIG',     tamanho: '1.1 MB', paginas: 12,  data: '15/05/2026', tipo: 'pdf' },
  { id: 5, titulo: 'Normas ABNT para Soldagem TIG',               cat: 'Normas',  tamanho: '2.3 MB', paginas: 34,  data: '01/04/2026', tipo: 'pdf' },
  { id: 6, titulo: 'Tabela de Parâmetros por Espessura',          cat: 'Referência', tamanho: '0.4 MB', paginas: 6, data: '12/03/2026', tipo: 'pdf' },
  { id: 7, titulo: 'Manual de Segurança em Soldagem',             cat: 'Segurança', tamanho: '3.0 MB', paginas: 48, data: '10/03/2026', tipo: 'pdf' },
  { id: 8, titulo: 'Gabarito — Avaliação Módulo 1',               cat: 'TIG',     tamanho: '0.2 MB', paginas: 4,   data: '02/04/2026', tipo: 'pdf' },
]

const CATS = ['Todos', 'TIG', 'Normas', 'Referência', 'Segurança']

export function ApostilasPage() {
  const [search, setSearch] = useState('')
  const [cat,    setCat]    = useState('Todos')

  const lista = APOSTILAS.filter(a =>
    (cat === 'Todos' || a.cat === cat) &&
    (!search || a.titulo.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Apostilas</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Material didático dos seus cursos</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar apostila..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border bg-[var(--color-surface)] text-[var(--color-text)]"
            style={{ borderColor: 'var(--color-border)' }} />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Filter size={15} className="self-center text-[var(--color-text-muted)]" />
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              style={cat === c ? { background: COLOR, color: '#fff' } : { background: 'var(--color-surface-elevated)', color: 'var(--color-text-muted)' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {lista.length === 0 ? (
        <Card><div className="text-center py-10 text-[var(--color-text-muted)]">Nenhuma apostila encontrada</div></Card>
      ) : (
        <div className="space-y-3">
          {lista.map(a => (
            <Card key={a.id}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: COLOR + '15' }}>
                  <FileText size={18} style={{ color: COLOR }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--color-text)] text-sm truncate">{a.titulo}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    {a.paginas} páginas · {a.tamanho} · Disponível desde {a.data}
                  </p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: COLOR + '15', color: COLOR }}>{a.cat}</span>
                <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0 transition-colors"
                  style={{ background: '#10B981' + '15', color: '#10B981' }}>
                  <Download size={13} />Baixar
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
