import { Link } from 'react-router-dom'
import { Users, BookOpen, ClipboardCheck, Award, BarChart2 } from 'lucide-react'
import { Card, Button } from '@/components/ui'

const COLOR = '#10B981'

const TURMAS = [
  { id: 1, nome: 'TIG Avançado',      process: 'TIG',     period: 'Manhã (08h–12h)',  room: 'Lab 1', alunos: 12, max: 15, presenca: 87, progresso: 65, proxima: 'Seg, 16/06' },
  { id: 2, nome: 'MIG/MAG Industrial', process: 'MIG/MAG', period: 'Tarde (13h–17h)',  room: 'Lab 2', alunos: 10, max: 12, presenca: 92, progresso: 40, proxima: 'Ter, 17/06' },
  { id: 3, nome: 'Eletrodo Revestido', process: 'SMAW',    period: 'Manhã (08h–12h)', room: 'Lab 3', alunos:  8, max: 15, presenca: 75, progresso: 85, proxima: 'Qua, 18/06' },
]

export function TurmasPage() {
  const totalAlunos  = TURMAS.reduce((s, t) => s + t.alunos, 0)
  const mediaPresenca = Math.round(TURMAS.reduce((s, t) => s + t.presenca, 0) / TURMAS.length)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]">Minhas Turmas</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Turmas ativas sob sua responsabilidade</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Turmas ativas',  value: TURMAS.length, icon: Users },
          { label: 'Total de alunos', value: totalAlunos,  icon: BookOpen },
          { label: 'Presença média', value: `${mediaPresenca}%`, icon: ClipboardCheck },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: COLOR + '15' }}>
                <Icon size={18} style={{ color: COLOR }} />
              </div>
              <div>
                <p className="text-2xl font-black" style={{ color: COLOR }}>{value}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {TURMAS.map(t => {
          const presencaColor = t.presenca >= 85 ? COLOR : t.presenca >= 75 ? '#F59E0B' : '#EF4444'
          return (
            <Card key={t.id}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-black"
                  style={{ background: COLOR + '15', color: COLOR }}>
                  {t.process}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold text-[var(--color-text)]">{t.nome}</h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: COLOR + '15', color: COLOR }}>{t.period}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)]">{t.room}</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mb-3">
                    {t.alunos}/{t.max} alunos · Próx. aula: {t.proxima}
                  </p>
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-[var(--color-text-muted)]">Progresso do curso</span>
                      <span style={{ color: COLOR }}>{t.progresso}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--color-surface-elevated)]">
                      <div className="h-full rounded-full" style={{ width: `${t.progresso}%`, background: COLOR }} />
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Link to="/instrutor/presenca">
                      <Button size="sm" leftIcon={<ClipboardCheck size={13} />} style={{ background: COLOR }}>Chamada</Button>
                    </Link>
                    <Link to="/instrutor/avaliacoes/teoricas">
                      <Button size="sm" variant="outline" leftIcon={<BookOpen size={13} />}>Avaliações</Button>
                    </Link>
                    <Link to="/instrutor/materiais">
                      <Button size="sm" variant="outline" leftIcon={<Award size={13} />}>Materiais</Button>
                    </Link>
                    <Link to="/instrutor/relatorios/turmas">
                      <Button size="sm" variant="outline" leftIcon={<BarChart2 size={13} />}>Relatório</Button>
                    </Link>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-black" style={{ color: presencaColor }}>{t.presenca}%</p>
                  <p className="text-xs text-[var(--color-text-muted)]">presença</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
