import { useState } from 'react'
import { Settings, GraduationCap, Building2, Bell, Shield, CheckCircle2 } from 'lucide-react'
import { Card, Button, Input } from '@/components/ui'

const COLOR = '#8B5CF6'

interface Toggle { key: string; label: string; description: string; enabled: boolean }
interface TextField { key: string; label: string; value: string; placeholder: string }

function ToggleRow({ s, onToggle, color }: { s: Toggle; onToggle: () => void; color: string }) {
  return (
    <div className="flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-[var(--color-surface-elevated)] transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--color-text)]">{s.label}</p>
        <p className="text-xs text-[var(--color-text-muted)]">{s.description}</p>
      </div>
      <button onClick={onToggle}
        className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
        style={{ background: s.enabled ? color : 'var(--color-surface-elevated)' }}>
        <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
          style={{ left: s.enabled ? '22px' : '2px' }} />
      </button>
    </div>
  )
}

export function SharedConfiguracoesPage() {
  const [saved, setSaved] = useState(false)

  const [gerais, setGerais] = useState<TextField[]>([
    { key: 'empresa',       label: 'Nome da empresa',   value: 'Welder & Fusion',        placeholder: 'Nome da empresa' },
    { key: 'cnpj',          label: 'CNPJ',              value: '00.000.000/0001-00',      placeholder: '00.000.000/0001-00' },
    { key: 'telefone',      label: 'Telefone',          value: '',                         placeholder: '(00) 00000-0000' },
    { key: 'email_contato', label: 'E-mail de contato', value: '',                         placeholder: 'contato@empresa.com.br' },
  ])

  const [escola, setEscola] = useState<Toggle[]>([
    { key: 'cert_auto',      label: 'Certificado automático',          description: 'Gerar certificado ao concluir curso',              enabled: true  },
    { key: 'presenca_obrig', label: 'Controle de presença obrigatório', description: 'Exigir 75% de frequência para conclusão',         enabled: true  },
    { key: 'gamif',          label: 'Gamificação',                     description: 'Ativar sistema de pontos e conquistas para alunos', enabled: false },
    { key: 'portal_emp',     label: 'Portal de empregabilidade',       description: 'Exibir vagas e banco de talentos para alunos',     enabled: true  },
  ])

  const [industrial, setIndustrial] = useState<Toggle[]>([
    { key: 'portal_cliente', label: 'Portal do cliente',          description: 'Permitir acesso dos clientes ao portal industrial', enabled: true  },
    { key: 'assinatura_dig', label: 'Assinatura digital de laudos', description: 'Exigir assinatura digital nos laudos emitidos',    enabled: false },
    { key: 'notif_os',       label: 'Notificações de OS',         description: 'Notificar cliente sobre mudanças de status da OS', enabled: true  },
  ])

  const [notifs, setNotifs] = useState<Toggle[]>([
    { key: 'lead_novo',  label: 'Novo lead',            description: 'Receber alerta quando um novo lead for cadastrado',     enabled: true  },
    { key: 'matricula',  label: 'Nova matrícula',        description: 'Notificar quando uma matrícula for confirmada',        enabled: true  },
    { key: 'vencimento', label: 'Vencimento de fatura', description: 'Alertar sobre faturas próximas ao vencimento',         enabled: true  },
    { key: 'relatorio',  label: 'Relatório semanal',    description: 'Enviar resumo semanal de métricas por e-mail',          enabled: false },
  ])

  function toggle(set: React.Dispatch<React.SetStateAction<Toggle[]>>, key: string) {
    set(prev => prev.map(n => n.key === key ? { ...n, enabled: !n.enabled } : n))
    setSaved(false)
  }
  function updateGeral(key: string, value: string) {
    setGerais(prev => prev.map(g => g.key === key ? { ...g, value } : g))
    setSaved(false)
  }

  function save() { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Configurações</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Configurações gerais do portal e suas integrações</p>
        </div>
        <Button onClick={save}
          style={{ background: saved ? '#22c55e' : COLOR }}
          leftIcon={saved ? <CheckCircle2 size={15} /> : <Settings size={15} />}>
          {saved ? 'Salvo!' : 'Salvar configurações'}
        </Button>
      </div>

      {/* Dados da empresa */}
      <Card title="Dados da empresa">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {gerais.map(g => (
            <Input key={g.key} label={g.label} value={g.value} placeholder={g.placeholder}
              onChange={e => updateGeral(g.key, e.target.value)} />
          ))}
        </div>
      </Card>

      {/* Escola */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#FF8C00' + '15' }}>
            <GraduationCap size={14} style={{ color: '#FF8C00' }} />
          </div>
          <h2 className="font-bold text-[var(--color-text)]">Escola de Soldagem</h2>
        </div>
        <div className="space-y-1">
          {escola.map(s => <ToggleRow key={s.key} s={s} onToggle={() => toggle(setEscola, s.key)} color="#FF8C00" />)}
        </div>
      </Card>

      {/* Industrial */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#3B82F6' + '15' }}>
            <Building2 size={14} style={{ color: '#3B82F6' }} />
          </div>
          <h2 className="font-bold text-[var(--color-text)]">Serviços Industriais</h2>
        </div>
        <div className="space-y-1">
          {industrial.map(s => <ToggleRow key={s.key} s={s} onToggle={() => toggle(setIndustrial, s.key)} color="#3B82F6" />)}
        </div>
      </Card>

      {/* Notificações */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: COLOR + '15' }}>
            <Bell size={14} style={{ color: COLOR }} />
          </div>
          <h2 className="font-bold text-[var(--color-text)]">Notificações</h2>
        </div>
        <div className="space-y-1">
          {notifs.map(s => <ToggleRow key={s.key} s={s} onToggle={() => toggle(setNotifs, s.key)} color={COLOR} />)}
        </div>
      </Card>

      {/* Security notice */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl border text-sm"
        style={{ background: COLOR + '08', borderColor: COLOR + '25', color: COLOR }}>
        <Shield size={15} className="flex-shrink-0 mt-0.5" />
        <span>Configurações avançadas de segurança, integrações e API estão disponíveis via painel Supabase.</span>
      </div>
    </div>
  )
}
