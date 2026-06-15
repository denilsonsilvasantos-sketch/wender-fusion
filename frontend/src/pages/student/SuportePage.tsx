import { useState } from 'react'
import { MessageSquare, Phone, Mail, ChevronDown, ChevronUp, Send, CheckCircle } from 'lucide-react'
import { Card, Button } from '@/components/ui'

const COLOR = '#64748B'

const FAQS = [
  { q: 'Como faço para justificar uma falta?', a: 'Entre em contato com a secretaria pelo WhatsApp ou e-mail informando o motivo e apresentando o atestado ou comprovante no prazo de 5 dias úteis.' },
  { q: 'Como recupero uma avaliação?', a: 'Alunos com nota inferior a 7,0 têm direito a uma avaliação substitutiva. Solicite à secretaria em até 5 dias após a divulgação da nota.' },
  { q: 'Como obtenho meu certificado?', a: 'O certificado é gerado automaticamente ao atingir 75% de frequência e aprovação em todas as avaliações. Acesse a seção "Certificados" no menu.' },
  { q: 'Posso transferir de turma?', a: 'Sim, sujeito à disponibilidade de vagas. Solicite a transferência na secretaria com no mínimo 5 dias de antecedência.' },
  { q: 'Como altero meus dados cadastrais?', a: 'Acesse "Meu Perfil" no menu lateral para atualizar nome, telefone e foto. Para alterar o e-mail, entre em contato com a secretaria.' },
]

export function SuportePage() {
  const [open,    setOpen]    = useState<number | null>(null)
  const [assunto, setAssunto] = useState('')
  const [msg,     setMsg]     = useState('')
  const [sent,    setSent]    = useState(false)

  function send() {
    if (!msg.trim()) return
    setSent(true)
    setMsg('')
    setAssunto('')
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Suporte</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Dúvidas e contato com a secretaria</p>
      </div>

      {/* Contact channels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: Phone,         label: 'WhatsApp',  valor: '(11) 99999-0000', color: '#25D366', action: 'Abrir' },
          { icon: Mail,          label: 'E-mail',    valor: 'secretaria@welder.com', color: '#3B82F6', action: 'Enviar' },
          { icon: MessageSquare, label: 'Chat online', valor: 'Seg–Sex, 8h–18h', color: COLOR, action: 'Iniciar' },
        ].map(c => {
          const Icon = c.icon
          return (
            <Card key={c.label}>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: c.color + '15' }}>
                  <Icon size={18} style={{ color: c.color }} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[var(--color-text)]">{c.label}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{c.valor}</p>
                </div>
                <button className="text-xs font-semibold px-3 py-1 rounded-lg"
                  style={{ background: c.color + '15', color: c.color }}>{c.action}</button>
              </div>
            </Card>
          )
        })}
      </div>

      {/* FAQ */}
      <Card>
        <h2 className="font-semibold text-[var(--color-text)] mb-4">Perguntas frequentes</h2>
        <div className="space-y-1">
          {FAQS.map((f, i) => (
            <div key={i} className="rounded-xl overflow-hidden border"
              style={{ borderColor: open === i ? COLOR + '40' : 'var(--color-border)' }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium"
                style={{ color: 'var(--color-text)', background: open === i ? COLOR + '08' : 'transparent' }}>
                {f.q}
                {open === i ? <ChevronUp size={15} style={{ color: COLOR }} className="flex-shrink-0 ml-2" />
                            : <ChevronDown size={15} className="text-[var(--color-text-muted)] flex-shrink-0 ml-2" />}
              </button>
              {open === i && (
                <div className="px-4 pb-4 text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Contact form */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare size={16} style={{ color: COLOR }} />
          <h2 className="font-semibold text-[var(--color-text)]">Enviar mensagem</h2>
        </div>
        {sent ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle size={36} style={{ color: '#10B981' }} />
            <p className="font-semibold text-[var(--color-text)]">Mensagem enviada!</p>
            <p className="text-sm text-[var(--color-text-muted)]">Retornaremos em até 1 dia útil.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-1.5 block">
                Assunto
              </label>
              <select value={assunto} onChange={e => setAssunto(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl border bg-[var(--color-surface)] text-[var(--color-text)]"
                style={{ borderColor: 'var(--color-border)' }}>
                <option value="">Selecione um assunto</option>
                <option>Dúvida sobre frequência</option>
                <option>Problema com avaliação</option>
                <option>Solicitação de documentos</option>
                <option>Dúvida sobre pagamento</option>
                <option>Outro</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-1.5 block">
                Mensagem
              </label>
              <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={5}
                placeholder="Descreva sua dúvida ou solicitação..."
                className="w-full px-3 py-2.5 text-sm rounded-xl border bg-[var(--color-surface)] text-[var(--color-text)] resize-none"
                style={{ borderColor: 'var(--color-border)' }} />
            </div>
            <Button onClick={send} disabled={!msg.trim() || !assunto}
              style={{ background: COLOR }}>
              <Send size={14} className="mr-2" />Enviar
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
