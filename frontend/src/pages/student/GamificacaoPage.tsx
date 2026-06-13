import { useState } from 'react'
import { Trophy, Star, Zap, Award, Users, CheckCircle, Lock } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Card } from '@/components/ui'

// ── Level system ──────────────────────────────────────────────────────────────
const LEVELS = [
  { nome: 'Iniciante',       emoji: '🔩', min: 0,    max: 99,   color: '#64748B', desc: 'Começo de jornada' },
  { nome: 'Aprendiz',        emoji: '🔧', min: 100,  max: 299,  color: '#3B82F6', desc: 'Aprendendo os fundamentos' },
  { nome: 'Operador',        emoji: '⚡', min: 300,  max: 599,  color: '#10B981', desc: 'Opera equipamentos com segurança' },
  { nome: 'Soldador',        emoji: '🔥', min: 600,  max: 999,  color: '#F59E0B', desc: 'Executa soldas com qualidade' },
  { nome: 'Especialista',    emoji: '⭐', min: 1000, max: 1999, color: '#FF8C00', desc: 'Domínio técnico avançado' },
  { nome: 'Mestre Soldador', emoji: '👑', min: 2000, max: 9999, color: '#8B5CF6', desc: 'Excelência reconhecida no mercado' },
]

// ── Points sources ────────────────────────────────────────────────────────────
const FONTES = [
  { label: 'Presença em aula',              pts: 5,   icon: CheckCircle, color: '#10B981' },
  { label: 'Frequência perfeita na semana', pts: 15,  icon: Star,        color: '#F59E0B' },
  { label: 'Avaliação teórica (por ponto)', pts: 3,   icon: Trophy,      color: '#6366F1' },
  { label: 'Avaliação prática (por ponto)', pts: 5,   icon: Zap,         color: '#FF8C00' },
  { label: 'Completar um módulo',           pts: 50,  icon: Award,       color: '#3B82F6' },
  { label: 'Certificado obtido',            pts: 100, icon: Award,       color: '#8B5CF6' },
  { label: 'Currículo 100% preenchido',     pts: 20,  icon: Users,       color: '#10B981' },
  { label: 'Candidatura enviada',           pts: 10,  icon: Zap,         color: '#6366F1' },
]

// ── Medals ────────────────────────────────────────────────────────────────────
interface Medal { id: string; emoji: string; nome: string; desc: string; color: string; earned: boolean }

const MEDALS: Medal[] = [
  { id: 'first_cert',    emoji: '🏅', nome: 'Primeiro Certificado', desc: 'Obteve o primeiro certificado da escola',      color: '#F59E0B', earned: false },
  { id: 'freq_perfect',  emoji: '📅', nome: 'Frequência Perfeita',   desc: '30 dias consecutivos de presença',             color: '#10B981', earned: false },
  { id: 'best_grade',    emoji: '💯', nome: 'Nota Máxima',           desc: 'Tirou 10 em alguma avaliação',                 color: '#6366F1', earned: false },
  { id: 'top3_class',    emoji: '🥇', nome: 'Destaque da Turma',     desc: 'Ficou no top 3 do ranking da turma',           color: '#FF8C00', earned: false },
  { id: 'tig_expert',    emoji: '🔵', nome: 'TIG Expert',            desc: 'Concluiu o curso de soldagem TIG',             color: '#3B82F6', earned: false },
  { id: 'mig_expert',    emoji: '🟢', nome: 'MIG/MAG Expert',        desc: 'Concluiu o curso de soldagem MIG/MAG',         color: '#10B981', earned: false },
  { id: 'smaw_expert',   emoji: '🟡', nome: 'Eletrodo Expert',       desc: 'Concluiu o curso de eletrodo revestido',       color: '#F59E0B', earned: false },
  { id: 'employed',      emoji: '💼', nome: 'Empregado!',            desc: 'Conseguiu emprego pelo banco de talentos',     color: '#8B5CF6', earned: false },
  { id: 'full_profile',  emoji: '✅', nome: 'Perfil Completo',       desc: 'Preencheu 100% do currículo na plataforma',    color: '#10B981', earned: false },
  { id: 'active_cand',   emoji: '🚀', nome: 'Candidato Ativo',       desc: 'Enviou 5 ou mais candidaturas',                color: '#6366F1', earned: false },
]

// ── Mock data (replace with Supabase later) ───────────────────────────────────
const MOCK_POINTS = 340
const MOCK_HISTORY = [
  { id: 1, desc: 'Presença — Aula 12 (TIG)',    pts: +5,  data: '12/06/2026' },
  { id: 2, desc: 'Avaliação Teórica — Nota 8',  pts: +24, data: '11/06/2026' },
  { id: 3, desc: 'Presença — Aula 11 (TIG)',    pts: +5,  data: '10/06/2026' },
  { id: 4, desc: 'Frequência perfeita semana',   pts: +15, data: '07/06/2026' },
  { id: 5, desc: 'Presença — Aula 10 (TIG)',    pts: +5,  data: '05/06/2026' },
]

function getLevel(pts: number) {
  return [...LEVELS].reverse().find(l => pts >= l.min) ?? LEVELS[0]
}

export function GamificacaoPage() {
  const { profile } = useAuth()
  const points = MOCK_POINTS
  const nivel = getLevel(points)
  const nivelIdx = LEVELS.indexOf(nivel)
  const nextLevel = LEVELS[nivelIdx + 1]
  const xpPct = nextLevel ? Math.round(((points - nivel.min) / (nivel.max - nivel.min)) * 100) : 100
  const [tab, setTab] = useState<'medalhas' | 'historico' | 'fontes'>('medalhas')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Gamificação</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Sua jornada de evolução na Welder &amp; Fusion</p>
      </div>

      {/* ── Level card ───────────────────────────────────────────────── */}
      <div className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${nivel.color}20 0%, ${nivel.color}08 100%)`, border: `2px solid ${nivel.color}30` }}>
        {/* Background decoration */}
        <div className="absolute right-0 top-0 text-[160px] leading-none opacity-[0.05] select-none pointer-events-none" style={{ color: nivel.color }}>
          {nivel.emoji}
        </div>
        <div className="relative">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center border-2 flex-shrink-0 text-4xl"
              style={{ borderColor: nivel.color, background: nivel.color + '20' }}>
              {nivel.emoji}
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-widest font-bold mb-0.5" style={{ color: nivel.color }}>Nível atual</p>
              <h2 className="text-3xl font-black" style={{ color: nivel.color }}>{nivel.nome}</h2>
              <p className="text-sm text-[var(--color-text-muted)]">{nivel.desc}</p>
              <p className="text-2xl font-black mt-2 text-[var(--color-text)]">{points.toLocaleString()} <span className="text-sm font-normal text-[var(--color-text-muted)]">XP</span></p>
            </div>
          </div>

          {/* XP progress */}
          {nextLevel && (
            <div className="mt-5">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold" style={{ color: nivel.color }}>{points} XP</span>
                <span className="text-[var(--color-text-muted)]">{nextLevel.min} XP — {nextLevel.emoji} {nextLevel.nome}</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: nivel.color + '25' }}>
                <div className="h-full rounded-full transition-all duration-700 relative"
                  style={{ width: `${xpPct}%`, background: `linear-gradient(90deg, ${nivel.color}, ${nextLevel.color})` }}>
                  <div className="absolute inset-0 bg-white/20 rounded-full" />
                </div>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">{nextLevel.min - points} XP restante para {nextLevel.nome}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Level ladder ─────────────────────────────────────────────── */}
      <Card title="Escala de Níveis">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {LEVELS.map((lvl, i) => {
            const isCurrentOrPast = points >= lvl.min
            const isCurrent = nivelIdx === i
            return (
              <div key={lvl.nome}
                className="flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all"
                style={{
                  borderColor: isCurrent ? lvl.color : isCurrentOrPast ? lvl.color + '40' : 'var(--color-border)',
                  background: isCurrent ? lvl.color + '15' : isCurrentOrPast ? lvl.color + '08' : 'transparent',
                  opacity: isCurrentOrPast ? 1 : 0.45,
                }}>
                <span className="text-3xl">{lvl.emoji}</span>
                <p className="text-xs font-bold" style={{ color: isCurrent ? lvl.color : 'var(--color-text)' }}>{lvl.nome}</p>
                <p className="text-[9px] text-[var(--color-text-muted)]">{lvl.min.toLocaleString()}+ XP</p>
                {isCurrent && <span className="text-[9px] font-black px-2 py-0.5 rounded-full" style={{ background: lvl.color, color: 'white' }}>Você</span>}
                {!isCurrentOrPast && <Lock size={12} className="text-[var(--color-text-muted)]" />}
              </div>
            )
          })}
        </div>
      </Card>

      {/* ── Tabs: Medalhas / Histórico / Como ganhar ─────────────────── */}
      <div>
        <div className="flex gap-1 mb-4 p-1 rounded-xl border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          {[
            { key: 'medalhas',  label: '🏅 Medalhas'       },
            { key: 'historico', label: '📜 Histórico XP'   },
            { key: 'fontes',    label: '⚡ Como Ganhar XP' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as typeof tab)}
              className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
              style={tab === t.key ? { background: '#6366F1', color: 'white' } : { color: 'var(--color-text-secondary)' }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'medalhas' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {MEDALS.map(m => (
              <div key={m.id}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border text-center relative overflow-hidden"
                style={{
                  borderColor: m.earned ? m.color + '40' : 'var(--color-border)',
                  background: m.earned ? m.color + '10' : 'var(--color-surface)',
                  opacity: m.earned ? 1 : 0.5,
                }}>
                {!m.earned && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'var(--color-surface)80' }}>
                    <Lock size={20} className="text-[var(--color-text-muted)]" />
                  </div>
                )}
                <span className="text-3xl">{m.emoji}</span>
                <p className="text-xs font-bold text-[var(--color-text)]">{m.nome}</p>
                <p className="text-[10px] text-[var(--color-text-muted)] leading-tight">{m.desc}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'historico' && (
          <Card noPadding>
            <div className="divide-y divide-[var(--color-border)]">
              {MOCK_HISTORY.map(h => (
                <div key={h.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: '#F59E0B18' }}>
                    <Zap size={14} style={{ color: '#F59E0B' }} />
                  </div>
                  <p className="flex-1 text-sm text-[var(--color-text)]">{h.desc}</p>
                  <span className="font-black text-sm flex-shrink-0" style={{ color: '#10B981' }}>+{h.pts} XP</span>
                  <span className="text-xs text-[var(--color-text-muted)] flex-shrink-0 w-20 text-right">{h.data}</span>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-[var(--color-border)] text-center">
              <p className="text-xs text-[var(--color-text-muted)]">Total acumulado: <strong style={{ color: '#F59E0B' }}>{points} XP</strong></p>
            </div>
          </Card>
        )}

        {tab === 'fontes' && (
          <Card title="Como ganhar XP">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FONTES.map(f => (
                <div key={f.label} className="flex items-center gap-3 p-3 rounded-xl border"
                  style={{ borderColor: f.color + '25', background: f.color + '08' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: f.color + '18' }}>
                    <f.icon size={14} style={{ color: f.color }} />
                  </div>
                  <p className="flex-1 text-sm text-[var(--color-text)]">{f.label}</p>
                  <span className="font-black text-sm flex-shrink-0" style={{ color: f.color }}>+{f.pts}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
