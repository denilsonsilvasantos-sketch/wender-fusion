import { Megaphone, TrendingUp, MessageCircle, Instagram, Facebook, Globe, Plus } from 'lucide-react'
import { Card, Button, Badge } from '@/components/ui'

const COLOR = '#FF8C00'

interface Channel {
  id: string
  name: string
  icon: React.ElementType
  color: string
  description: string
}

const CHANNELS: Channel[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    icon: MessageCircle,
    color: '#25D366',
    description: 'Disparos e fluxos automatizados via API',
  },
  {
    id: 'instagram',
    name: 'Instagram Ads',
    icon: Instagram,
    color: '#E1306C',
    description: 'Anúncios e posts patrocinados no feed e stories',
  },
  {
    id: 'facebook',
    name: 'Facebook Ads',
    icon: Facebook,
    color: '#1877F2',
    description: 'Campanhas de captação via Meta Ads Manager',
  },
  {
    id: 'google',
    name: 'Google Ads',
    icon: Globe,
    color: '#4285F4',
    description: 'Anúncios em pesquisa e rede de display',
  },
  {
    id: 'site',
    name: 'Site / SEO',
    icon: Globe,
    color: COLOR,
    description: 'Landing pages, blog e tráfego orgânico',
  },
]

export function EscolaCampanhasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Campanhas de Marketing</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Captação e relacionamento com potenciais alunos</p>
        </div>
        <Button leftIcon={<Plus size={16} />} disabled title="Em breve">Nova Campanha</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Campanhas Ativas', value: '—' },
          { label: 'Leads este mês', value: '—' },
          { label: 'Taxa de Conversão', value: '—' },
          { label: 'Custo por Lead', value: '—' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border p-4"
            style={{ borderColor: COLOR + '20', background: 'var(--color-surface)' }}
          >
            <TrendingUp size={14} style={{ color: COLOR }} className="mb-2" />
            <p className="text-xl font-black" style={{ color: COLOR }}>{stat.value}</p>
            <p className="text-[10px] text-[var(--color-text-muted)]">{stat.label}</p>
          </div>
        ))}
      </div>

      <Card title="Canais de captação">
        <div className="space-y-3">
          {CHANNELS.map((channel) => (
            <div
              key={channel.id}
              className="flex items-center gap-4 p-3 rounded-xl border"
              style={{ borderColor: channel.color + '25' }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: channel.color + '15' }}
              >
                <channel.icon size={18} style={{ color: channel.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-[var(--color-text)]">{channel.name}</p>
                  <Badge variant="default">Não iniciado</Badge>
                </div>
                <p className="text-xs text-[var(--color-text-muted)]">{channel.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div
        className="rounded-xl border border-dashed p-6 text-center"
        style={{ borderColor: COLOR + '30' }}
      >
        <Megaphone size={32} className="mx-auto mb-3" style={{ color: COLOR + '50' }} />
        <p className="text-sm text-[var(--color-text-muted)]">
          Módulo de campanhas com tracking de UTM e integração à API de leads em desenvolvimento
        </p>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">
          Os leads captados pelos canais acima já aparecem em <strong>Leads</strong>
        </p>
      </div>
    </div>
  )
}
