import { useState } from 'react'
import { Globe, Users, FileText, DollarSign, Wrench, Bell, Shield, CheckCircle2 } from 'lucide-react'
import { Card, Button } from '@/components/ui'

const COLOR = '#3B82F6'

interface ModuleToggle {
  key: string
  label: string
  description: string
  icon: React.ElementType
  enabled: boolean
}

const INITIAL_MODULES: ModuleToggle[] = [
  { key: 'orcamentos',  label: 'Orçamentos',      description: 'Cliente pode solicitar e acompanhar orçamentos online',  icon: FileText,    enabled: true  },
  { key: 'ordens',      label: 'Ordens de Serviço',description: 'Visualização do andamento das OS em tempo real',        icon: Wrench,      enabled: true  },
  { key: 'financeiro',  label: 'Financeiro',       description: 'Faturas, boletos e histórico de pagamentos',            icon: DollarSign,  enabled: true  },
  { key: 'documentos',  label: 'Documentos',       description: 'Laudos, relatórios técnicos e certificados',            icon: FileText,    enabled: false },
  { key: 'usuarios',    label: 'Gestão de usuários',description: 'Múltiplos contatos por empresa com níveis de acesso',  icon: Users,       enabled: false },
  { key: 'notificacoes',label: 'Notificações',     description: 'Alertas por e-mail e WhatsApp sobre status das OS',     icon: Bell,        enabled: true  },
]

export function IndustrialPortalPage() {
  const [modules, setModules] = useState(INITIAL_MODULES)
  const [saved, setSaved] = useState(false)

  function toggle(key: string) {
    setModules(prev => prev.map(m => m.key === key ? { ...m, enabled: !m.enabled } : m))
    setSaved(false)
  }

  function save() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const enabledCount = modules.filter(m => m.enabled).length
  const clients = 12 // mock

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Portal do Cliente</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Configure o acesso e os módulos disponíveis para clientes industriais</p>
        </div>
        <Button onClick={save} style={{ background: saved ? '#22c55e' : COLOR }} leftIcon={saved ? <CheckCircle2 size={15} /> : undefined}>
          {saved ? 'Salvo!' : 'Salvar configurações'}
        </Button>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Clientes com acesso', value: clients, color: COLOR, icon: Users },
          { label: 'Módulos ativos', value: enabledCount, color: '#22c55e', icon: CheckCircle2 },
          { label: 'Nível de segurança', value: 'Alto', color: '#8B5CF6', icon: Shield },
        ].map(s => (
          <div key={s.label} className="rounded-xl border p-4 flex items-center gap-3" style={{ borderColor: s.color + '25', background: 'var(--color-surface)' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: s.color + '15' }}>
              <s.icon size={18} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Module toggles */}
      <Card title="Módulos do portal">
        <div className="space-y-1">
          {modules.map(mod => {
            const Icon = mod.icon
            return (
              <div key={mod.key}
                className="flex items-center gap-4 px-3 py-3 rounded-xl transition-colors hover:bg-[var(--color-surface-elevated)]">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: (mod.enabled ? COLOR : '#6B7280') + '15' }}>
                  <Icon size={15} style={{ color: mod.enabled ? COLOR : '#6B7280' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text)]">{mod.label}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{mod.description}</p>
                </div>
                <button
                  onClick={() => toggle(mod.key)}
                  className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
                  style={{ background: mod.enabled ? COLOR : 'var(--color-surface-elevated)' }}
                  aria-label={`${mod.enabled ? 'Desativar' : 'Ativar'} ${mod.label}`}
                >
                  <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
                    style={{ left: mod.enabled ? '24px' : '2px' }} />
                </button>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Access URL */}
      <Card title="URL de acesso">
        <div className="flex items-center gap-3">
          <Globe size={16} style={{ color: COLOR }} className="flex-shrink-0" />
          <div className="flex-1 bg-[var(--color-surface-elevated)] rounded-lg px-3 py-2 font-mono text-sm text-[var(--color-text-muted)] truncate">
            https://welderandfusion.com.br/industrial
          </div>
          <button
            className="text-xs px-3 py-2 rounded-lg border transition-colors hover:bg-[var(--color-surface-elevated)]"
            style={{ borderColor: COLOR + '40', color: COLOR }}
            onClick={() => navigator.clipboard.writeText('https://welderandfusion.com.br/industrial').then(() => {})}
          >
            Copiar
          </button>
        </div>
        <p className="mt-2 text-xs text-[var(--color-text-muted)]">
          Clientes acessam o portal com seu e-mail e senha cadastrados no sistema.
        </p>
      </Card>

      {/* Security notice */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl border text-sm" style={{ background: '#8B5CF6' + '08', borderColor: '#8B5CF6' + '25', color: '#8B5CF6' }}>
        <Shield size={15} className="flex-shrink-0 mt-0.5" />
        <span>Acesso protegido por autenticação Supabase Auth. Cada cliente só vê seus próprios dados.</span>
      </div>
    </div>
  )
}
