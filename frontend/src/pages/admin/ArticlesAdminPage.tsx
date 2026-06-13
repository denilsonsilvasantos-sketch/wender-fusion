import { useState, useEffect, type ChangeEvent } from 'react'
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Save } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { RichTextEditor } from '@/components/ui/RichTextEditor'
import { supabase } from '@/lib/supabase'

const TAG_OPTIONS = ['Técnica', 'Mercado', 'Segurança', 'Carreira', 'Certificações', 'Equipamentos']

interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  tag: string
  date: string
  cover_url: string
  published: boolean
  featured: boolean
}

const EMPTY: Omit<Article, 'id'> = {
  title: '', excerpt: '', content: '', tag: 'Técnica',
  date: new Date().toISOString().split('T')[0],
  cover_url: '', published: false, featured: false,
}

const TAG_COLORS: Record<string, string> = {
  'Técnica': '#FF8C00', 'Mercado': '#22C55E', 'Segurança': '#EF4444',
  'Carreira': '#3B82F6', 'Certificações': '#A855F7', 'Equipamentos': '#F59E0B',
}

export function ArticlesAdminPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Article | null>(null)
  const [form, setForm] = useState<Omit<Article, 'id'>>(EMPTY)
  const [search, setSearch] = useState('')

  useEffect(() => { fetchArticles() }, [])

  async function fetchArticles() {
    setLoading(true)
    const { data } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
    setArticles((data ?? []) as Article[])
    setLoading(false)
  }

  function openNew() { setEditing(null); setForm(EMPTY); setModalOpen(true) }
  function openEdit(a: Article) { setEditing(a); setForm({ title: a.title, excerpt: a.excerpt, content: a.content, tag: a.tag, date: a.date, cover_url: a.cover_url, published: a.published, featured: a.featured }); setModalOpen(true) }
  function closeModal() { setModalOpen(false) }

  async function handleCoverUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingCover(true)
    const ext = file.name.split('.').pop()
    const filename = `${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from('article-covers')
      .upload(filename, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('article-covers').getPublicUrl(filename)
      setForm(prev => ({ ...prev, cover_url: data.publicUrl }))
    }
    setUploadingCover(false)
  }

  async function handleSave() {
    if (!form.title.trim()) return
    setSaving(true)
    if (editing) {
      await supabase.from('articles').update({ ...form }).eq('id', editing.id)
    } else {
      await supabase.from('articles').insert({ ...form })
    }
    await fetchArticles()
    setSaving(false)
    setModalOpen(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir este artigo?')) return
    await supabase.from('articles').delete().eq('id', id)
    setArticles(prev => prev.filter(a => a.id !== id))
  }

  async function togglePublished(a: Article) {
    await supabase.from('articles').update({ published: !a.published }).eq('id', a.id)
    setArticles(prev => prev.map(x => x.id === a.id ? { ...x, published: !x.published } : x))
  }

  const filtered = articles.filter(a => !search || a.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Artigos &amp; Notícias</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Gerencie os artigos que aparecem na página pública.</p>
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
            {loading ? (
              <tr><td colSpan={7} className="text-center py-12 text-[var(--color-text-muted)] text-sm">Carregando...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-[var(--color-text-muted)] text-sm">Nenhum artigo encontrado.</td></tr>
            ) : filtered.map(a => (
              <tr key={a.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)] transition-colors">
                <td className="px-4 py-3">
                  {a.cover_url
                    ? <img src={a.cover_url} alt="" className="w-16 h-10 object-cover rounded-md" />
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
                  <button onClick={() => togglePublished(a)}
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

              {/* Upload de capa */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1.5">Foto de Capa</label>
                <div className="flex items-start gap-4">
                  {form.cover_url && (
                    <div className="relative">
                      <img src={form.cover_url} alt="Capa" className="w-32 h-20 object-cover rounded-lg border border-[var(--color-border)]" />
                      <button type="button" onClick={() => setForm(prev => ({ ...prev, cover_url: '' }))}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600">
                        ×
                      </button>
                    </div>
                  )}
                  <label className="flex-1 flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-xl border-2 border-dashed cursor-pointer transition-colors hover:border-[var(--color-primary)]"
                    style={{ borderColor: 'var(--color-border)', opacity: uploadingCover ? 0.6 : 1, pointerEvents: uploadingCover ? 'none' : 'auto' }}>
                    <span className="text-2xl">{uploadingCover ? '⏳' : '🖼️'}</span>
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {uploadingCover ? 'Enviando para o servidor...' : form.cover_url ? 'Trocar imagem' : 'Clique para enviar a capa'}
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)] opacity-60">JPG, PNG, WEBP — máx. 5MB</span>
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" disabled={uploadingCover} onChange={handleCoverUpload} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1.5">Conteúdo</label>
                <RichTextEditor
                  value={form.content}
                  onChange={html => setForm(prev => ({ ...prev, content: html }))}
                  rows={12}
                />
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
              <Button onClick={handleSave} loading={saving} leftIcon={<Save size={15} />}>Salvar Artigo</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
