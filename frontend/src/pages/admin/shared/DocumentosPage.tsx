import { useState } from 'react'
import { FolderOpen, Search, FileText, File, Download, Eye, GraduationCap, Building2, Briefcase } from 'lucide-react'
import { Card, Input } from '@/components/ui'

const COLOR = '#8B5CF6'

type DocCat  = 'escola' | 'industrial' | 'admin'
type DocType = 'pdf' | 'doc' | 'xls' | 'img'

interface Doc {
  id: string; name: string; category: DocCat; type: DocType
  size: string; date: string; tags: string[]
}

const MOCK_DOCS: Doc[] = [
  { id: '1',  name: 'Apostila TIG Básico v3.pdf',         category: 'escola',     type: 'pdf', size: '4.2 MB', date: '2026-05-10', tags: ['TIG', 'material'] },
  { id: '2',  name: 'Grade Curricular 2026.pdf',           category: 'escola',     type: 'pdf', size: '0.8 MB', date: '2026-01-05', tags: ['currículo'] },
  { id: '3',  name: 'Modelo Certificado.pdf',              category: 'escola',     type: 'pdf', size: '0.3 MB', date: '2026-03-15', tags: ['certificado'] },
  { id: '4',  name: 'Normas ABNT para Soldagem.pdf',       category: 'escola',     type: 'pdf', size: '2.1 MB', date: '2025-11-20', tags: ['normas', 'ABNT'] },
  { id: '5',  name: 'Laudo NR-13 Petroquímica.pdf',        category: 'industrial', type: 'pdf', size: '1.5 MB', date: '2026-06-01', tags: ['laudo', 'NR-13'] },
  { id: '6',  name: 'Relatório WPQR-2026-05.pdf',          category: 'industrial', type: 'pdf', size: '3.0 MB', date: '2026-05-28', tags: ['WPQR', 'relatório'] },
  { id: '7',  name: 'Procedimento PS-TIG-01.pdf',          category: 'industrial', type: 'pdf', size: '0.9 MB', date: '2026-04-10', tags: ['procedimento', 'TIG'] },
  { id: '8',  name: 'Contrato Metalúrgica Norte.pdf',      category: 'industrial', type: 'pdf', size: '0.4 MB', date: '2026-02-14', tags: ['contrato'] },
  { id: '9',  name: 'Contrato Social.pdf',                 category: 'admin',      type: 'pdf', size: '1.2 MB', date: '2022-03-01', tags: ['jurídico'] },
  { id: '10', name: 'Fluxo de Caixa Jun-2026.xls',        category: 'admin',      type: 'xls', size: '0.2 MB', date: '2026-06-01', tags: ['financeiro'] },
  { id: '11', name: 'Política de Qualidade.pdf',           category: 'admin',      type: 'pdf', size: '0.5 MB', date: '2025-09-01', tags: ['qualidade'] },
]

const CAT_META: Record<DocCat, { label: string; color: string; icon: React.ElementType }> = {
  escola:     { label: 'Escola',         color: '#FF8C00', icon: GraduationCap },
  industrial: { label: 'Industrial',     color: '#3B82F6', icon: Building2 },
  admin:      { label: 'Administrativo', color: COLOR,     icon: Briefcase },
}

const TYPE_ICON:  Record<DocType, React.ElementType> = { pdf: FileText, doc: FileText, xls: File, img: File }
const TYPE_COLOR: Record<DocType, string>            = { pdf: '#ef4444', doc: '#3B82F6', xls: '#22c55e', img: '#f59e0b' }

export function SharedDocumentosPage() {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<'todos' | DocCat>('todos')

  const filtered = MOCK_DOCS.filter(d => {
    if (tab !== 'todos' && d.category !== tab) return false
    if (search) {
      const s = search.toLowerCase()
      return d.name.toLowerCase().includes(s) || d.tags.some(t => t.toLowerCase().includes(s))
    }
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Documentos</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Central de documentos, contratos e arquivos técnicos</p>
      </div>

      {/* Category stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {(Object.entries(CAT_META) as [DocCat, typeof CAT_META[DocCat]][]).map(([k, v]) => {
          const count = MOCK_DOCS.filter(d => d.category === k).length
          const Icon  = v.icon
          const isActive = tab === k
          return (
            <div key={k} onClick={() => setTab(isActive ? 'todos' : k)}
              className="rounded-xl border p-4 flex items-center gap-3 cursor-pointer transition-all"
              style={{ borderColor: isActive ? v.color : v.color + '25', background: 'var(--color-surface)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: v.color + '15' }}>
                <Icon size={15} style={{ color: v.color }} />
              </div>
              <div>
                <p className="text-xl font-black" style={{ color: v.color }}>{count}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{v.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex border border-[var(--color-border)] rounded-lg overflow-hidden text-xs">
          {(['todos', 'escola', 'industrial', 'admin'] as const).map(t => {
            const meta   = t === 'todos' ? null : CAT_META[t as DocCat]
            const active = tab === t
            return (
              <button key={t} onClick={() => setTab(t)}
                className="px-3 py-2 font-medium transition-colors"
                style={active ? { background: meta?.color ?? COLOR, color: '#fff' } : { color: 'var(--color-text-muted)' }}>
                {t === 'todos' ? 'Todos' : t === 'admin' ? 'Admin' : meta?.label}
              </button>
            )
          })}
        </div>
        <div className="flex-1">
          <Input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome ou tag…" leftIcon={<Search size={14} />} />
        </div>
      </div>

      <Card noPadding>
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-[var(--color-text-muted)]">
            <FolderOpen size={36} className="mx-auto mb-3 opacity-30" />
            <p>Nenhum documento encontrado</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {filtered.map(doc => {
              const catMeta = CAT_META[doc.category]
              const DocIcon = TYPE_ICON[doc.type]
              return (
                <div key={doc.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: TYPE_COLOR[doc.type] + '15' }}>
                    <DocIcon size={15} style={{ color: TYPE_COLOR[doc.type] }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text)] truncate">{doc.name}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-[10px] px-1.5 py-0.5 rounded"
                        style={{ background: catMeta.color + '15', color: catMeta.color }}>
                        {catMeta.label}
                      </span>
                      {doc.tags.map(t => (
                        <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)]">
                          {t}
                        </span>
                      ))}
                      <span className="text-xs text-[var(--color-text-muted)]">{doc.size}</span>
                      <span className="text-xs text-[var(--color-text-muted)]">{doc.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button className="p-1.5 rounded-lg hover:bg-[var(--color-surface-elevated)] transition-colors" title="Visualizar">
                      <Eye size={14} className="text-[var(--color-text-muted)]" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-[var(--color-surface-elevated)] transition-colors" title="Baixar">
                      <Download size={14} className="text-[var(--color-text-muted)]" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      <div className="flex items-start gap-3 px-4 py-3 rounded-xl border text-sm"
        style={{ background: COLOR + '08', borderColor: COLOR + '25', color: COLOR }}>
        <FolderOpen size={15} className="flex-shrink-0 mt-0.5" />
        <span>Documentos ilustrativos — integração com Supabase Storage em desenvolvimento.</span>
      </div>
    </div>
  )
}
