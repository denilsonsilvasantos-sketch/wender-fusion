import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui'
import { Upload, CheckCircle, FileText, X, AlertCircle } from 'lucide-react'

const COLOR = '#3B82F6'

type Tipo = 'Soldagem' | 'Montagem' | 'Caldeiraria' | 'Manutenção' | 'Consultoria' | 'Treinamento'

const TIPOS: { value: Tipo; desc: string; emoji: string }[] = [
  { value: 'Soldagem',    desc: 'TIG, MIG/MAG, Eletrodo, processos especiais', emoji: '🔥' },
  { value: 'Montagem',    desc: 'Estruturas metálicas e equipamentos',          emoji: '🔩' },
  { value: 'Caldeiraria', desc: 'Vasos, tanques, trocadores de calor',          emoji: '🏭' },
  { value: 'Manutenção',  desc: 'Preventiva e corretiva industrial',            emoji: '🔧' },
  { value: 'Consultoria', desc: 'NR-13, NR-12, auditorias técnicas',            emoji: '📋' },
  { value: 'Treinamento', desc: 'Qualificação de soldadores, cursos in-house',  emoji: '🎓' },
]

interface Arquivo { id: string; nome: string; tamanho: string }

export function SolicitarOrcamentoPage() {
  const navigate = useNavigate()
  const [tipo, setTipo] = useState<Tipo | null>(null)
  const [descricao, setDescricao] = useState('')
  const [local, setLocal] = useState('')
  const [prazo, setPrazo] = useState('')
  const [prioridade, setPrioridade] = useState<'normal' | 'urgente'>('normal')
  const [arquivos, setArquivos] = useState<Arquivo[]>([])
  const [enviado, setEnviado] = useState(false)

  const isValid = tipo && descricao.trim().length >= 20 && local.trim()

  function handleFakeUpload() {
    const fakes = ['projeto_soldagem.pdf', 'desenho_tecnico.dwg', 'foto_equipamento.jpg']
    const fake = fakes[Math.floor(Math.random() * fakes.length)]
    setArquivos(prev => [...prev, { id: Date.now().toString(), nome: fake, tamanho: `${(Math.random() * 4 + 0.5).toFixed(1)} MB` }])
  }

  function handleSubmit() {
    if (!isValid) return
    setEnviado(true)
  }

  if (enviado) return (
    <div className="max-w-lg mx-auto pt-16 text-center space-y-4">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto" style={{ background: '#10B98120' }}>
        <CheckCircle size={36} className="text-[#10B981]" />
      </div>
      <h2 className="text-2xl font-black text-[var(--color-text)]">Solicitação enviada!</h2>
      <p className="text-sm text-[var(--color-text-muted)]">
        Nossa equipe comercial analisará seu pedido e retornará com o orçamento em até <strong>2 dias úteis</strong>.
      </p>
      <div className="p-4 rounded-xl border text-left" style={{ borderColor: '#10B98125', background: '#10B98108' }}>
        <p className="text-xs font-bold text-[#10B981] mb-2">Protocolo gerado</p>
        <p className="text-lg font-black text-[var(--color-text)]">ORC-2024-{String(Math.floor(Math.random() * 90 + 10))}</p>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">Tipo: {tipo} · {prioridade === 'urgente' ? '⚡ Urgente' : 'Normal'}</p>
      </div>
      <div className="flex gap-3 justify-center">
        <button onClick={() => navigate('/industrial/orcamentos')}
          className="px-5 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: COLOR }}>
          Ver meus orçamentos
        </button>
        <button onClick={() => { setEnviado(false); setTipo(null); setDescricao(''); setLocal(''); setPrazo(''); setArquivos([]) }}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold border" style={{ borderColor: COLOR + '40', color: COLOR }}>
          Nova solicitação
        </button>
      </div>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Solicitar Orçamento</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Preencha os dados do serviço desejado. Nossa equipe responderá em até 2 dias úteis.</p>
      </div>

      {/* Tipo de serviço */}
      <Card title="Tipo de Serviço">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TIPOS.map(t => (
            <button
              key={t.value}
              onClick={() => setTipo(t.value)}
              className="p-3 rounded-xl border text-left transition-all"
              style={{
                borderColor: tipo === t.value ? COLOR : COLOR + '20',
                background: tipo === t.value ? COLOR + '12' : 'transparent',
              }}
            >
              <span className="text-2xl">{t.emoji}</span>
              <p className="text-sm font-bold mt-1" style={{ color: tipo === t.value ? COLOR : 'var(--color-text)' }}>{t.value}</p>
              <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5 leading-tight">{t.desc}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Dados */}
      <Card title="Detalhes do Serviço">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wide">
              Descrição <span className="text-[var(--color-danger)]">*</span>
            </label>
            <textarea
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              rows={4}
              placeholder="Descreva o serviço necessário com o máximo de detalhes possível: equipamento, dimensões, material, processo preferido, condições do local, etc."
              className="w-full px-4 py-3 rounded-xl border bg-[var(--color-surface-elevated)] text-sm text-[var(--color-text)] border-[var(--color-border)] focus:outline-none resize-none"
            />
            <div className="flex justify-between mt-1">
              {descricao.length < 20 && descricao.length > 0
                ? <p className="text-xs text-[var(--color-danger)]">Mínimo 20 caracteres ({20 - descricao.length} restantes)</p>
                : <span />}
              <p className="text-xs text-[var(--color-text-muted)] ml-auto">{descricao.length} caracteres</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wide">
                Local de execução <span className="text-[var(--color-danger)]">*</span>
              </label>
              <input
                type="text"
                value={local}
                onChange={e => setLocal(e.target.value)}
                placeholder="Ex: Planta industrial — Rod. SC-108 km 12"
                className="w-full px-3 py-2.5 rounded-lg border bg-[var(--color-surface-elevated)] text-sm text-[var(--color-text)] border-[var(--color-border)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wide">
                Prazo desejado
              </label>
              <input
                type="date"
                value={prazo}
                onChange={e => setPrazo(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border bg-[var(--color-surface-elevated)] text-sm text-[var(--color-text)] border-[var(--color-border)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wide">Prioridade</label>
            <div className="flex gap-3">
              {[
                { key: 'normal',  label: 'Normal',   color: '#64748B', desc: 'Até 2 dias úteis para orçamento' },
                { key: 'urgente', label: '⚡ Urgente', color: '#EF4444', desc: 'Retorno em até 4 horas' },
              ].map(p => (
                <button
                  key={p.key}
                  onClick={() => setPrioridade(p.key as typeof prioridade)}
                  className="flex-1 p-3 rounded-xl border text-left transition-all"
                  style={{
                    borderColor: prioridade === p.key ? p.color : p.color + '25',
                    background: prioridade === p.key ? p.color + '10' : 'transparent',
                  }}
                >
                  <p className="text-sm font-bold" style={{ color: prioridade === p.key ? p.color : 'var(--color-text)' }}>{p.label}</p>
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{p.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Upload */}
      <Card title="Anexos (PDF, DWG, imagens, vídeos)">
        <div className="space-y-3">
          <button
            onClick={handleFakeUpload}
            className="w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-2 transition-all hover:border-[var(--color-primary)] group"
            style={{ borderColor: COLOR + '35' }}
          >
            <Upload size={24} style={{ color: COLOR }} className="group-hover:scale-110 transition-transform" />
            <p className="text-sm font-semibold text-[var(--color-text)]">Clique para adicionar arquivos</p>
            <p className="text-xs text-[var(--color-text-muted)]">PDF, DWG, PNG, JPG, MP4 · Máx. 50 MB por arquivo</p>
          </button>

          {arquivos.length > 0 && (
            <div className="space-y-2">
              {arquivos.map(a => (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg border" style={{ borderColor: COLOR + '20', background: COLOR + '06' }}>
                  <FileText size={15} style={{ color: COLOR }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--color-text)] truncate">{a.nome}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{a.tamanho}</p>
                  </div>
                  <button onClick={() => setArquivos(prev => prev.filter(f => f.id !== a.id))} className="text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: COLOR + '08' }}>
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" style={{ color: COLOR }} />
            <p className="text-xs text-[var(--color-text-muted)]">
              Quanto mais detalhes e documentos você enviar (desenhos, fotos, especificações), mais preciso e rápido será o orçamento.
            </p>
          </div>
        </div>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <button onClick={() => navigate('/industrial')} className="px-5 py-2.5 rounded-xl text-sm font-semibold border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: COLOR }}
        >
          Enviar Solicitação
        </button>
      </div>
    </div>
  )
}
