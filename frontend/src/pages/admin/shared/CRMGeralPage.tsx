import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Users, Search, Mail, Phone, Building2, GraduationCap } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Lead } from '@/types'
import { Card, Badge, Input, Spinner } from '@/components/ui'
import { formatDate } from '@/lib/utils'

const COLOR = '#8B5CF6'

const SOURCE_LABELS: Record<string, string> = {
  website: 'Site', whatsapp: 'WhatsApp', instagram: 'Instagram',
  facebook: 'Facebook', indicacao: 'Indicação', linkedin: 'LinkedIn',
  feira_evento: 'Feira', outro: 'Outro',
}

function getContext(lead: Lead): 'industrial' | 'escola' {
  return lead.notes?.includes('[Empresa:') ? 'industrial' : 'escola'
}

function getCompany(lead: Lead): string | null {
  const m = lead.notes?.match(/\[Empresa: ([^\]]+)\]/)
  return m ? m[1] : null
}

export function SharedCRMGeralPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('q') ?? ''
  const tab    = searchParams.get('tab') ?? 'todos'

  function updateParam(k: string, v: string) {
    setSearchParams(p => { const n = new URLSearchParams(p); v ? n.set(k, v) : n.delete(k); return n }, { replace: true })
  }

  useEffect(() => {
    supabase.from('leads').select('*, stage:stage_id(*)').order('created_at', { ascending: false })
      .then(({ data }) => { setLeads((data || []) as Lead[]); setLoading(false) })
  }, [])

  const filtered = leads.filter(l => {
    const ctx = getContext(l)
    if (tab === 'escola' && ctx !== 'escola') return false
    if (tab === 'industrial' && ctx !== 'industrial') return false
    if (search) {
      const s = search.toLowerCase()
      return l.name.toLowerCase().includes(s) || l.email?.toLowerCase().includes(s) || l.phone?.includes(s)
    }
    return true
  })

  const escola     = leads.filter(l => getContext(l) === 'escola')
  const industrial = leads.filter(l => getContext(l) === 'industrial')
  const converted  = leads.filter(l => l.converted)

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">CRM Geral</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Visão consolidada de leads de todos os segmentos</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total leads',  value: leads.length,      color: COLOR,      icon: Users },
          { label: 'Escola',       value: escola.length,     color: '#FF8C00',  icon: GraduationCap },
          { label: 'Industrial',   value: industrial.length,  color: '#3B82F6',  icon: Building2 },
          { label: 'Convertidos',  value: converted.length,   color: '#22c55e',  icon: Users },
        ].map(s => (
          <div key={s.label} className="rounded-xl border p-4 flex items-center gap-3"
            style={{ borderColor: s.color + '25', background: 'var(--color-surface)' }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: s.color + '15' }}>
              <s.icon size={16} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex border border-[var(--color-border)] rounded-lg overflow-hidden text-xs">
          {(['todos', 'escola', 'industrial'] as const).map(t => (
            <button key={t} onClick={() => updateParam('tab', t === 'todos' ? '' : t)}
              className="px-3 py-2 font-medium transition-colors"
              style={(tab === t || (t === 'todos' && !searchParams.get('tab')))
                ? { background: t === 'escola' ? '#FF8C00' : t === 'industrial' ? '#3B82F6' : COLOR, color: '#fff' }
                : { color: 'var(--color-text-muted)' }}>
              {t === 'todos' ? 'Todos' : t === 'escola' ? 'Escola' : 'Industrial'}
            </button>
          ))}
        </div>
        <div className="flex-1">
          <Input value={search} onChange={e => updateParam('q', e.target.value)}
            placeholder="Buscar por nome, e-mail ou telefone…" leftIcon={<Search size={14} />} />
        </div>
      </div>

      <Card noPadding>
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-[var(--color-text-muted)]">
            <Users size={36} className="mx-auto mb-3 opacity-30" />
            <p>{leads.length === 0 ? 'Nenhum lead cadastrado ainda' : 'Nenhum lead encontrado'}</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {filtered.map(lead => {
              const ctx       = getContext(lead)
              const company   = getCompany(lead)
              const ctxColor  = ctx === 'escola' ? '#FF8C00' : '#3B82F6'
              const CtxIcon   = ctx === 'escola' ? GraduationCap : Building2
              return (
                <div key={lead.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: ctxColor + '15' }}>
                    <CtxIcon size={15} style={{ color: ctxColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-[var(--color-text)] truncate">{lead.name}</p>
                      {lead.converted && <Badge variant="success">Convertido</Badge>}
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0"
                        style={{ background: ctxColor + '15', color: ctxColor }}>
                        {ctx === 'escola' ? 'Escola' : 'Industrial'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)] flex-wrap">
                      {company && <span className="flex items-center gap-1"><Building2 size={10} />{company}</span>}
                      {lead.email && <span className="flex items-center gap-1"><Mail size={10} />{lead.email}</span>}
                      {lead.phone && <span className="flex items-center gap-1"><Phone size={10} />{lead.phone}</span>}
                      {lead.source && <span>{SOURCE_LABELS[lead.source] ?? lead.source}</span>}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    {lead.stage && (
                      <p className="text-xs text-[var(--color-text-muted)]">{(lead.stage as any).name}</p>
                    )}
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{formatDate(lead.created_at)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
