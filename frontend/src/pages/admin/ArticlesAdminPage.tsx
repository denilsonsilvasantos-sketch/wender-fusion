import { useState, type ChangeEvent } from 'react'
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Save } from 'lucide-react'
import { Button, Input } from '@/components/ui'

const TAG_OPTIONS = ['Técnica', 'Mercado', 'Segurança', 'Carreira', 'Certificações', 'Equipamentos']

interface Article {
  id: number
  title: string
  excerpt: string
  content: string
  tag: string
  date: string
  coverUrl: string
  published: boolean
  featured: boolean
}

const INITIAL: Article[] = [
  { id: 1, title: 'TIG vs MIG/MAG: qual processo escolher para cada aplicação?', excerpt: 'Entenda as diferenças técnicas, vantagens e limitações de cada processo.', content: '', tag: 'Técnica', date: '2024-06-05', coverUrl: '', published: true, featured: true },
  { id: 2, title: 'Mercado de soldagem em 2024: oportunidades e tendências', excerpt: 'O setor de soldagem no Brasil em dados.', content: '', tag: 'Mercado', date: '2024-05-28', coverUrl: '', published: true, featured: false },
]

const EMPTY: Omit<Article, 'id'> = { title: '', excerpt: '', content: '', tag: 'Técnica', date: new Date().toISOString().split('T')[0], coverUrl: '', published: false, featured: false }

const TAG_COLORS: Record<string, string> = {
  'Técnica': '#FF8C00', 'Mercado': '#FF8C00', 'Segurança': '#EF4444',
  'Carreira': '#22C55E', 'Certificações': '#A855F7', 'Equipamentos': '#F59E0B',
}

export function ArticlesAdminPage() {
  const [articles, setArticles] = useState<Article[]>(INITIAL)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Article | null>(null)
  const [form, setForm] = useState<Omit<Article, 'id'>>(EMPTY)
  const [search, setSearch] = useState('')

  function openNew() { setEditing(null); setForm(EMPTY); setModalOpen(true) }
  function openEdit(a: Article) { setEditing(a); setForm({ ...a }); setModalOpen(true) }

  function handleCoverUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setForm(prev => ({ ...prev, coverUrl: URL.createObjectURL(file) }))
  }
  function closeModal() { setModalOpen(false) }

  function handleSave() {
    if (!form.title.trim()) return
    if (editing) {
      setArticles(prev => prev.map(a => a.id === editing.id ? { ...form, id: editing.id } : a))
    } else {
      setArticles(prev => [...prev, { ...form, id: Date.now() }])
    }
    setModalOpen(false)
  }

  function handleDelete(id: number) {
    if (confirm('Excluir este artigo?')) setArticles(prev => prev.filter(a => a.id !== id))
  }

  function togglePublished(id: number) {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, published: !a.published } : a))
  }

  const filtered = articles.filter(a => !search || a.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Artigos &amp; Notícias</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Gerencie os artigos que aparecem na página pública de Artigos.</p>
        </div>
        <Button onClick={openNew} leftIcon={<Plus size={15} />}>Novo Artigo</Button>
      </div>

      {/* Busca */}
      <div className="flex gap-4">
        <Input placeholder="Buscar artigo..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />
        <span className="text-sm text-[var(--color-text-muted)] self-center">
          {filtered.length} {filtered.length === 1 ? 'artigo' : 'artigos'}
        </span>
      </div>

      {/* Tabela */}
      <div className="rounded-xl border overflow-hidden border-[var(--color-border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
              {['Capa', 'Título', 'Tag', 'Data', 'Status', 'Destaque', 'Ações'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-[var(--color-text-muted)] text-sm">Nenhum artigo encontrado.</td></tr>
            ) : filtered.map((a, i) => (
              <tr key={a.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)] transition-colors">
                <td className="px-4 py-3">
                  {a.coverUrl
                    ? <img src={a.coverUrl} alt="" className="w-16 h-10 object-cover rounded-md" />
                    : <div className="w-16 h-10 rounded-md flex items-center justify-center text-xs text-[var(--color-text-muted)]" style={{ background: 'var(--color-surface-elevated)' }}>—</div>
                  }
                </td>
                <td className="px-4 py-3 font-medium text-[var(--color-text)] max-w-xs">
                  <p className="truncate">{a.title}</p>
                  <p className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">{a.excerpt}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: (TAG_COLORS[a.tag] || '#FF8C00') + '20', color: TAG_COLORS[a.tag] || '#FF8C00' }}>
                    {a.tag}
                  </span>
                </td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">{new Date(a.date).toLocaleDateString('pt-BR')}</td>
                <td className="px-4 py-3">
                  <button onClick={() => togglePublished(a.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all"
                    style={a.published
                      ? { background: '#22C55E20', color: '#22C55E' }
                      : { background: '#6B728020', color: '#6B7280' }}>
                    {a.published ? <><Eye size={11} /> Publicado</> : <><EyeOff size={11} /> Rascunho</>}
                  </button>
                </td>
                <td className="px-4 py-3">
                  {a.featured && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#FF8C0020', color: '#FF8C00' }}>★ Destaque</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(a)} className="p-1.5 rounded-md hover:bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded-md hover:bg-red-500/10 text-[var(--color-text-muted)] hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── MODAL ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={closeModal} />
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
              <h2 className="font-black text-[var(--color-text)]">{editing ? 'Editar Artigo' : 'Novo Artigo'}</h2>
              <button onClick={closeModal} className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text)]"><X size={18} /></button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1.5">Título *</label>
                <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Título do artigo" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1.5">Resumo</label>
                <Input value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="Resumo breve (exibido no card)" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1.5">Categoria</label>
                  <select value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })}
                    className="w-full rounded-md px-3 py-2 text-sm bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)]">
                    {TAG_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1.5">Data</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                    className="w-full rounded-md px-3 py-2 text-sm bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1.5">Foto de Capa</label>
                <div className="flex items-start gap-4">
                  {form.coverUrl && (
                    <img src={form.coverUrl} alt="Capa" className="w-32 h-20 object-cover rounded-lg border border-[var(--color-border)]" />
                  )}
                  <label className="flex-1 flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-xl border-2 border-dashed cursor-pointer transition-colors hover:border-[var(--color-primary)]"
                    style={{ borderColor: 'var(--color-border)' }}>
                    <span className="text-2xl">🖼️</span>
                    <span className="text-xs text-[var(--color-text-muted)]">{form.coverUrl ? 'Trocar imagem' : 'Clique para enviar a capa'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1.5">Conteúdo</label>
                <textarea rows={10} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                  placeholder="Escreva o conteúdo completo do artigo aqui..."
                  className="w-full rounded-xl px-4 py-3 text-sm bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)] resize-y" />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 accent-[var(--color-primary)]" />
                  <span className="text-sm text-[var(--color-text)]">Publicar no site</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-[var(--color-primary)]" />
                  <span className="text-sm text-[var(--color-text)]">Artigo em destaque</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-[var(--color-border)]">
              <Button variant="ghost" onClick={closeModal}>Cancelar</Button>
              <Button onClick={handleSave} leftIcon={<Save size={15} />}>Salvar Artigo</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
