import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { useEffect } from 'react'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
  Heading1, Heading2, Quote, Undo, Redo, Minus,
} from 'lucide-react'

interface ToolbarButtonProps {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}

function ToolbarButton({ onClick, active, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="p-1.5 rounded transition-colors"
      style={{
        color: active ? '#FF8C00' : 'var(--color-text-muted)',
        background: active ? '#FF8C0018' : 'transparent',
      }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--color-surface-elevated)' }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="w-px h-5 mx-1 self-center" style={{ background: 'var(--color-border)' }} />
}

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  rows?: number
}

export function RichTextEditor({ value, onChange, placeholder = 'Escreva o conteúdo aqui...', rows = 10 }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[160px] prose-editor',
        style: `min-height: ${rows * 24}px`,
      },
    },
  })

  // Sync external value changes (e.g. opening edit modal)
  useEffect(() => {
    if (!editor) return
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || '')
    }
  }, [value, editor])

  if (!editor) return null

  const btn = (label: string, icon: React.ReactNode, active: boolean, action: () => void) => (
    <ToolbarButton key={label} title={label} onClick={action} active={active}>{icon}</ToolbarButton>
  )

  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b"
        style={{ background: 'var(--color-surface-elevated)', borderColor: 'var(--color-border)' }}>

        {btn('Título 1', <Heading1 size={15} />, editor.isActive('heading', { level: 1 }),
          () => editor.chain().focus().toggleHeading({ level: 1 }).run())}
        {btn('Título 2', <Heading2 size={15} />, editor.isActive('heading', { level: 2 }),
          () => editor.chain().focus().toggleHeading({ level: 2 }).run())}

        <Divider />

        {btn('Negrito', <Bold size={15} />, editor.isActive('bold'),
          () => editor.chain().focus().toggleBold().run())}
        {btn('Itálico', <Italic size={15} />, editor.isActive('italic'),
          () => editor.chain().focus().toggleItalic().run())}
        {btn('Sublinhado', <UnderlineIcon size={15} />, editor.isActive('underline'),
          () => editor.chain().focus().toggleUnderline().run())}
        {btn('Tachado', <Strikethrough size={15} />, editor.isActive('strike'),
          () => editor.chain().focus().toggleStrike().run())}

        <Divider />

        {btn('Alinhar esquerda', <AlignLeft size={15} />, editor.isActive({ textAlign: 'left' }),
          () => editor.chain().focus().setTextAlign('left').run())}
        {btn('Centralizar', <AlignCenter size={15} />, editor.isActive({ textAlign: 'center' }),
          () => editor.chain().focus().setTextAlign('center').run())}
        {btn('Alinhar direita', <AlignRight size={15} />, editor.isActive({ textAlign: 'right' }),
          () => editor.chain().focus().setTextAlign('right').run())}

        <Divider />

        {btn('Lista com marcadores', <List size={15} />, editor.isActive('bulletList'),
          () => editor.chain().focus().toggleBulletList().run())}
        {btn('Lista numerada', <ListOrdered size={15} />, editor.isActive('orderedList'),
          () => editor.chain().focus().toggleOrderedList().run())}
        {btn('Citação', <Quote size={15} />, editor.isActive('blockquote'),
          () => editor.chain().focus().toggleBlockquote().run())}
        {btn('Linha horizontal', <Minus size={15} />, false,
          () => editor.chain().focus().setHorizontalRule().run())}

        <Divider />

        {btn('Desfazer', <Undo size={15} />, false,
          () => editor.chain().focus().undo().run())}
        {btn('Refazer', <Redo size={15} />, false,
          () => editor.chain().focus().redo().run())}
      </div>

      {/* Editor area */}
      <div className="px-4 py-3 rich-editor" style={{ background: 'var(--color-surface-elevated)', color: 'var(--color-text)' }}>
        {!editor.getText() && (
          <div className="pointer-events-none absolute text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {placeholder}
          </div>
        )}
        <EditorContent editor={editor} />
      </div>

      <style>{`
        .rich-editor .tiptap { outline: none; font-size: 0.875rem; line-height: 1.7; }
        .rich-editor .tiptap p { margin-bottom: 0.75em; }
        .rich-editor .tiptap h1 { font-size: 1.4em; font-weight: 900; margin-bottom: 0.5em; color: var(--color-text); }
        .rich-editor .tiptap h2 { font-size: 1.15em; font-weight: 700; margin-bottom: 0.5em; color: var(--color-text); }
        .rich-editor .tiptap ul { list-style: disc; padding-left: 1.5em; margin-bottom: 0.75em; }
        .rich-editor .tiptap ol { list-style: decimal; padding-left: 1.5em; margin-bottom: 0.75em; }
        .rich-editor .tiptap li { margin-bottom: 0.25em; }
        .rich-editor .tiptap blockquote { border-left: 3px solid #FF8C00; padding-left: 1em; margin: 0.75em 0; opacity: 0.8; font-style: italic; }
        .rich-editor .tiptap hr { border: none; border-top: 1px solid var(--color-border); margin: 1em 0; }
        .rich-editor .tiptap strong { font-weight: 700; }
        .rich-editor .tiptap em { font-style: italic; }
        .rich-editor .tiptap u { text-decoration: underline; }
        .rich-editor .tiptap s { text-decoration: line-through; }
        .rich-editor .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: var(--color-text-muted);
          pointer-events: none;
          float: left;
          height: 0;
        }
      `}</style>
    </div>
  )
}
