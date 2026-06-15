import { useState } from 'react'
import { User, Mail, Phone, MapPin, Award, CheckCircle, Edit2, Save } from 'lucide-react'
import { Card, Button, Input } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'

const COLOR = '#64748B'

interface Certificacao { id: number; nome: string; entidade: string; numero: string; validade: string }

const CERTIFICACOES: Certificacao[] = [
  { id: 1, nome: 'Soldador Certificado — TIG',    entidade: 'FBTS',     numero: 'FBTS-TIG-2024-0892', validade: '2027-03-15' },
  { id: 2, nome: 'Inspetor de Soldagem Nível 1',   entidade: 'FBTS',     numero: 'FBTS-INS1-2023-0445', validade: '2026-08-20' },
  { id: 3, nome: 'NR-10 Segurança Elétrica',       entidade: 'Senai',    numero: 'NR10-2025-3341',      validade: '2027-01-10' },
  { id: 4, nome: 'NR-35 Trabalho em Altura',       entidade: 'Senai',    numero: 'NR35-2025-1129',      validade: '2027-01-10' },
]

export function PerfilPage() {
  const { profile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [saved,   setSaved]   = useState(false)

  const [form, setForm] = useState({
    nome:        profile?.name ?? 'Instrutor Welder & Fusion',
    email:       profile?.email     ?? 'instrutor@welderfusion.com.br',
    telefone:    '(11) 99876-5432',
    cidade:      'São Paulo, SP',
    bio:         'Soldador certificado FBTS com 12 anos de experiência em TIG e MIG/MAG. Atuação em projetos industriais para petróleo, gás e geração de energia.',
    especialidade: 'TIG, MIG/MAG, Inspeção',
  })

  function update(key: keyof typeof form, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  function save() {
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const initials = form.nome.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Meu Perfil</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Dados pessoais, certificações e disponibilidade</p>
        </div>
        {editing ? (
          <Button leftIcon={<Save size={15} />} onClick={save} style={{ background: COLOR }}>Salvar alterações</Button>
        ) : (
          <Button leftIcon={saved ? <CheckCircle size={15} /> : <Edit2 size={15} />}
            onClick={() => setEditing(true)}
            style={{ background: saved ? '#10B981' : COLOR }}>
            {saved ? 'Salvo!' : 'Editar perfil'}
          </Button>
        )}
      </div>

      {/* Avatar + header */}
      <Card>
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-2xl text-white flex-shrink-0"
            style={{ background: COLOR }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-black text-[var(--color-text)]">{form.nome}</h2>
            <p className="text-sm text-[var(--color-text-muted)]">Instrutor · {form.especialidade}</p>
            <div className="flex gap-4 mt-2 text-xs text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1"><MapPin size={12} />{form.cidade}</span>
              <span className="flex items-center gap-1"><Mail size={12} />{form.email}</span>
              <span className="flex items-center gap-1"><Phone size={12} />{form.telefone}</span>
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ background: '#10B98115', color: '#10B981' }}>
              <CheckCircle size={13} />
              Ativo
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">3 turmas ativas</p>
          </div>
        </div>
      </Card>

      {/* Form */}
      <Card title="Dados pessoais">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          {[
            { key: 'nome'  as const, label: 'Nome completo', icon: User  },
            { key: 'email' as const, label: 'E-mail',        icon: Mail  },
            { key: 'telefone' as const, label: 'Telefone',   icon: Phone },
            { key: 'cidade' as const, label: 'Cidade',       icon: MapPin},
          ].map(({ key, label, icon: Icon }) => (
            editing
              ? <Input key={key} label={label} value={form[key]} onChange={e => update(key, e.target.value)}
                  leftIcon={<Icon size={14} className="text-[var(--color-text-muted)]" />} />
              : (
                <div key={key}>
                  <p className="text-xs font-semibold text-[var(--color-text-muted)] mb-1">{label}</p>
                  <div className="flex items-center gap-2 text-sm text-[var(--color-text)]">
                    <Icon size={14} className="text-[var(--color-text-muted)]" />
                    {form[key]}
                  </div>
                </div>
              )
          ))}
        </div>
        <div className="mt-4">
          <p className="text-xs font-semibold text-[var(--color-text-muted)] mb-1">Especialidades</p>
          {editing
            ? <Input value={form.especialidade} onChange={e => update('especialidade', e.target.value)} />
            : <p className="text-sm text-[var(--color-text)]">{form.especialidade}</p>}
        </div>
        <div className="mt-4">
          <p className="text-xs font-semibold text-[var(--color-text-muted)] mb-1">Biografia profissional</p>
          {editing
            ? <textarea rows={3} value={form.bio} onChange={e => update('bio', e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-sm border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] resize-none focus:outline-none focus:border-[color:var(--color-border)]" />
            : <p className="text-sm text-[var(--color-text)] leading-relaxed">{form.bio}</p>}
        </div>
      </Card>

      {/* Certifications */}
      <Card title="Certificações">
        <div className="space-y-3 mt-2">
          {CERTIFICACOES.map(c => {
            const vencida = new Date(c.validade) < new Date()
            return (
              <div key={c.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--color-surface-elevated)] transition-colors">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: vencida ? '#EF444415' : '#10B98115' }}>
                  <Award size={18} style={{ color: vencida ? '#EF4444' : '#10B981' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-text)] truncate">{c.nome}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{c.entidade} · {c.numero}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-semibold" style={{ color: vencida ? '#EF4444' : '#10B981' }}>
                    {vencida ? 'Vencida' : 'Válida'}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    até {new Date(c.validade + 'T12:00').toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
