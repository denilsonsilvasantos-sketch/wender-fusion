import { useState } from 'react'
import { Download, FileText, FileSpreadsheet, FileImage, Archive } from 'lucide-react'
import { Card } from '@/components/ui'

const COLOR = '#3B82F6'

const ARQUIVOS = [
  { id: 1, nome: 'Ficha de inscrição — Welder & Fusion',    tipo: 'pdf',   cat: 'Formulários', tam: '0.3 MB' },
  { id: 2, nome: 'Modelo de currículo para soldador',        tipo: 'docx',  cat: 'Formulários', tam: '0.2 MB' },
  { id: 3, nome: 'Planilha de parâmetros TIG',               tipo: 'xlsx',  cat: 'Planilhas',   tam: '0.1 MB' },
  { id: 4, nome: 'Planilha de parâmetros MIG/MAG',           tipo: 'xlsx',  cat: 'Planilhas',   tam: '0.1 MB' },
  { id: 5, nome: 'Tabela de consumíveis — Eletrodos SMAW',   tipo: 'pdf',   cat: 'Referência',  tam: '1.4 MB' },
  { id: 6, nome: 'Simbologia de soldagem — AWS A2.4',        tipo: 'pdf',   cat: 'Referência',  tam: '3.1 MB' },
  { id: 7, nome: 'Cartaz de EPIs para soldagem',             tipo: 'png',   cat: 'Segurança',   tam: '2.2 MB' },
  { id: 8, nome: 'Checklist pré-soldagem',                   tipo: 'pdf',   cat: 'Formulários', tam: '0.4 MB' },
  { id: 9, nome: 'Modelo WPS simplificado',                  tipo: 'xlsx',  cat: 'Formulários', tam: '0.3 MB' },
  { id: 10, nome: 'Apostilas do módulo 1 (pacote)',          tipo: 'zip',   cat: 'Apostilas',   tam: '18.5 MB' },
]

const TIPO_ICONS: Record<string, typeof FileText> = {
  pdf: FileText, docx: FileText, xlsx: FileSpreadsheet, png: FileImage, zip: Archive
}
const TIPO_COLORS: Record<string, string> = {
  pdf: '#EF4444', docx: '#3B82F6', xlsx: '#10B981', png: '#F59E0B', zip: '#8B5CF6'
}
const CATS = ['Todos', 'Formulários', 'Planilhas', 'Referência', 'Segurança', 'Apostilas']

export function DownloadsPage() {
  const [cat, setCat] = useState('Todos')
  const lista = ARQUIVOS.filter(a => cat === 'Todos' || a.cat === cat)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Downloads</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Materiais e modelos disponíveis para baixar</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            style={cat === c ? { background: COLOR, color: '#fff' } : { background: 'var(--color-surface-elevated)', color: 'var(--color-text-muted)' }}>
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {lista.map(a => {
          const Icon  = TIPO_ICONS[a.tipo] ?? FileText
          const color = TIPO_COLORS[a.tipo] ?? COLOR
          return (
            <Card key={a.id}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: color + '15' }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text)] truncate">{a.nome}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    <span className="uppercase" style={{ color }}>{a.tipo}</span> · {a.tam} · {a.cat}
                  </p>
                </div>
                <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0"
                  style={{ background: COLOR + '15', color: COLOR }}>
                  <Download size={13} />Baixar
                </button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
