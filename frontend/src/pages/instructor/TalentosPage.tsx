import { useState } from 'react'
import { Star, Plus, Briefcase, Search } from 'lucide-react'
import { Card, Button, Input } from '@/components/ui'

const COLOR = '#6366F1'

interface Talento {
  id: number; aluno: string; turma: string; nota: number
  estrelas: number; habilidades: string[]; disponivel: boolean
  adicionadoEm: string; observacao: string
}

const TALENTOS: Talento[] = [
  {
    id: 1, aluno: 'Alexandre Ferreira', turma: 'TIG Avançado', nota: 9.2, estrelas: 5,
    habilidades: ['TIG', 'Aço inox', 'Passe de raiz'], disponivel: true,
    adicionadoEm: '2026-06-10', observacao: 'Excelente precisão no passe de raiz. Apto para trabalhos de alta responsabilidade.',
  },
  {
    id: 2, aluno: 'Diego Santos', turma: 'MIG/MAG Industrial', nota: 9.0, estrelas: 5,
    habilidades: ['MIG/MAG', 'Aço carbono', 'Estrutura metálica'], disponivel: true,
    adicionadoEm: '2026-06-12', observacao: 'Destaque da turma. Alta produtividade e qualidade constante.',
  },
  {
    id: 3, aluno: 'João Pedro Silva', turma: 'TIG Avançado', nota: 8.8, estrelas: 4,
    habilidades: ['TIG', 'Alumínio', 'Soldagem orbital'], disponivel: false,
    adicionadoEm: '2026-06-10', observacao: 'Aptidão para soldagem orbital e peças de precisão.',
  },
  {
    id: 4, aluno: 'Eduardo Lima', turma: 'MIG/MAG Industrial', nota: 8.5, estrelas: 4,
    habilidades: ['MIG/MAG', 'Solda robotizada', 'Controle CNC'], disponivel: true,
    adicionadoEm: '2026-06-11', observacao: 'Interesse em automação. Candidato a vagas na indústria 4.0.',
  },
  {
    id: 5, aluno: 'Bruno Carvalho', turma: 'TIG Avançado', nota: 7.8, estrelas: 3,
    habilidades: ['TIG', 'Aço inox'], disponivel: true,
    adicionadoEm: '2026-06-10', observacao: 'Bom domínio técnico. Recomendado para vagas de nível pleno.',
  },
]

export function TalentosPage() {
  const [q, setQ] = useState('')
  const filtered = TALENTOS.filter(t =>
    t.aluno.toLowerCase().includes(q.toLowerCase()) ||
    t.habilidades.some(h => h.toLowerCase().includes(q.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Banco de Talentos</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Alunos indicados para oportunidades no mercado de trabalho</p>
        </div>
        <Button leftIcon={<Plus size={15} />} style={{ background: COLOR }}>Indicar aluno</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <p className="text-2xl font-black" style={{ color: COLOR }}>{TALENTOS.length}</p>
          <p className="text-xs text-[var(--color-text-muted)]">No banco de talentos</p>
        </Card>
        <Card>
          <p className="text-2xl font-black" style={{ color: '#10B981' }}>{TALENTOS.filter(t => t.disponivel).length}</p>
          <p className="text-xs text-[var(--color-text-muted)]">Disponíveis agora</p>
        </Card>
        <Card>
          <p className="text-2xl font-black" style={{ color: '#F59E0B' }}>
            {(TALENTOS.reduce((s, t) => s + t.nota, 0) / TALENTOS.length).toFixed(1)}
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">Nota média do grupo</p>
        </Card>
      </div>

      <Input
        placeholder="Buscar aluno ou habilidade..."
        value={q}
        onChange={e => setQ(e.target.value)}
        leftIcon={<Search size={15} className="text-[var(--color-text-muted)]" />}
      />

      <div className="space-y-4">
        {filtered.map(t => (
          <Card key={t.id}>
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-white text-sm"
                style={{ background: COLOR }}>
                {t.aluno.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-bold text-[var(--color-text)]">{t.aluno}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${t.disponivel ? '' : 'opacity-60'}`}
                    style={{ background: t.disponivel ? '#10B98115' : '#94A3B815', color: t.disponivel ? '#10B981' : '#64748B' }}>
                    {t.disponivel ? 'Disponível' : 'Indisponível'}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mb-2">
                  {t.turma} · Nota {t.nota} · Adicionado em {new Date(t.adicionadoEm + 'T12:00').toLocaleDateString('pt-BR')}
                </p>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={14} fill={i < t.estrelas ? '#F59E0B' : 'none'} stroke={i < t.estrelas ? '#F59E0B' : 'var(--color-border)'} />
                  ))}
                </div>
                <div className="flex gap-1.5 flex-wrap mb-2">
                  {t.habilidades.map(h => (
                    <span key={h} className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: COLOR + '12', color: COLOR }}>
                      {h}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-[var(--color-text-muted)] italic">{t.observacao}</p>
              </div>
              <Button size="sm" leftIcon={<Briefcase size={13} />} variant="outline">Indicar vaga</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
