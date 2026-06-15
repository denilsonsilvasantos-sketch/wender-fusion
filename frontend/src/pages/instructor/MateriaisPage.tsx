import { useState } from 'react'
import { BookOpen, Upload, FileText, Film, FileSpreadsheet, Image, Download, Eye, Search } from 'lucide-react'
import { Card, Button, Input } from '@/components/ui'

const COLOR = '#10B981'

const TIPO_CFG = {
  pdf:   { icon: FileText,        color: '#EF4444', label: 'PDF'           },
  video: { icon: Film,            color: '#8B5CF6', label: 'Vídeo'         },
  xls:   { icon: FileSpreadsheet, color: '#22c55e', label: 'Planilha'      },
  img:   { icon: Image,           color: '#F59E0B', label: 'Imagem'        },
}

const CATEGORIAS = ['Todos', 'TIG', 'MIG/MAG', 'SMAW', 'Normas ABNT', 'Exercícios']

interface Material { id: number; nome: string; tipo: keyof typeof TIPO_CFG; categoria: string; tamanho: string; atualizado: string }

const MATERIAIS: Material[] = [
  { id:  1, nome: 'Apostila TIG Avançado — Módulo 1',     tipo: 'pdf',   categoria: 'TIG',        tamanho: '4.2 MB', atualizado: '2026-05-10' },
  { id:  2, nome: 'Apostila TIG Avançado — Módulo 2',     tipo: 'pdf',   categoria: 'TIG',        tamanho: '3.8 MB', atualizado: '2026-05-15' },
  { id:  3, nome: 'Norma ABNT NBR 14842 — TIG',           tipo: 'pdf',   categoria: 'Normas ABNT', tamanho: '1.1 MB', atualizado: '2025-11-01' },
  { id:  4, nome: 'Exercícios práticos TIG',               tipo: 'xls',   categoria: 'TIG',        tamanho: '280 KB', atualizado: '2026-04-20' },
  { id:  5, nome: 'Apostila MIG/MAG Industrial',           tipo: 'pdf',   categoria: 'MIG/MAG',    tamanho: '5.6 MB', atualizado: '2026-06-01' },
  { id:  6, nome: 'Norma ABNT NBR 14681 — MIG/MAG',       tipo: 'pdf',   categoria: 'Normas ABNT', tamanho: '980 KB', atualizado: '2025-09-14' },
  { id:  7, nome: 'Lista de exercícios MIG/MAG',           tipo: 'xls',   categoria: 'MIG/MAG',    tamanho: '340 KB', atualizado: '2026-05-28' },
  { id:  8, nome: 'Apostila Eletrodo Revestido',           tipo: 'pdf',   categoria: 'SMAW',       tamanho: '3.1 MB', atualizado: '2026-03-12' },
  { id:  9, nome: 'Defeitos de soldagem — galeria',        tipo: 'img',   categoria: 'Normas ABNT', tamanho: '12 MB',  atualizado: '2025-12-05' },
  { id: 10, nome: 'Vídeo: Técnica de passe de raiz TIG',  tipo: 'video', categoria: 'TIG',        tamanho: '210 MB', atualizado: '2026-02-18' },
  { id: 11, nome: 'Exercícios SMAW — junta em T',          tipo: 'xls',   categoria: 'SMAW',       tamanho: '190 KB', atualizado: '2026-04-30' },
]

export function MateriaisPage() {
  const [q, setQ]     = useState('')
  const [cat, setCat] = useState('Todos')

  const filtered = MATERIAIS.filter(m =>
    (cat === 'Todos' || m.categoria === cat) &&
    m.nome.toLowerCase().includes(q.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Materiais</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Apostilas, normas ABNT e materiais complementares</p>
        </div>
        <Button leftIcon={<Upload size={15} />} style={{ background: COLOR }}>Upload de material</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(TIPO_CFG).map(([k, v]) => {
          const count = MATERIAIS.filter(m => m.tipo === k).length
          const Icon = v.icon
          return (
            <Card key={k}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: v.color + '15' }}>
                  <Icon size={18} style={{ color: v.color }} />
                </div>
                <div>
                  <p className="text-xl font-black" style={{ color: v.color }}>{count}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{v.label}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Filters + search */}
      <div className="flex gap-3 flex-wrap items-center">
        <Input
          className="flex-1 min-w-48"
          placeholder="Buscar material..."
          value={q}
          onChange={e => setQ(e.target.value)}
          leftIcon={<Search size={15} className="text-[var(--color-text-muted)]" />}
        />
        <div className="flex gap-2 flex-wrap">
          {CATEGORIAS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
              style={cat === c
                ? { background: COLOR, color: '#fff' }
                : { background: 'var(--color-surface-elevated)', color: 'var(--color-text-muted)' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <Card>
        <div className="space-y-1">
          {filtered.map(m => {
            const cfg = TIPO_CFG[m.tipo]
            const Icon = cfg.icon
            return (
              <div key={m.id}
                className="flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-[var(--color-surface-elevated)] transition-colors">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: cfg.color + '15' }}>
                  <Icon size={18} style={{ color: cfg.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text)] truncate">{m.nome}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{m.categoria} · {m.tamanho} · {new Date(m.atualizado + 'T12:00').toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--color-border)] transition-colors">
                    <Eye size={15} className="text-[var(--color-text-muted)]" />
                  </button>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--color-border)] transition-colors">
                    <Download size={15} className="text-[var(--color-text-muted)]" />
                  </button>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div className="text-center py-10">
              <BookOpen size={32} className="mx-auto mb-2 text-[var(--color-text-muted)]" />
              <p className="text-sm text-[var(--color-text-muted)]">Nenhum material encontrado.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
