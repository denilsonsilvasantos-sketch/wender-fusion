import { useState } from 'react'
import { Clock, Tag, ArrowRight, Search, X } from 'lucide-react'
import { Input } from '@/components/ui'

const TAGS = ['Todos', 'Técnica', 'Mercado', 'Segurança', 'Carreira', 'Certificações', 'Equipamentos']

const TAG_COLORS: Record<string, string> = {
  'Técnica': '#FF8C00',
  'Mercado': '#22C55E',
  'Segurança': '#EF4444',
  'Carreira': '#3B82F6',
  'Certificações': '#F59E0B',
  'Equipamentos': '#8B5CF6',
}

interface Article {
  id: number; slug: string; title: string; excerpt: string; tag: string
  date: string; minutes: number; featured: boolean; author: string
  content: { heading?: string; body: string }[]
}

// ── Ilustrações SVG únicas por artigo ─────────────────────────────────────────
function ThumbTigMig() {
  return (
    <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="arc1" cx="50%" cy="52%" r="30%">
          <stop offset="0%" stopColor="#fffde0" stopOpacity="0.95"/>
          <stop offset="40%" stopColor="#FF8C00" stopOpacity="0.55"/>
          <stop offset="100%" stopColor="#FF4500" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#180800"/>
          <stop offset="100%" stopColor="#0d0d1a"/>
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#bg1)"/>
      {[0,1,2,3].map(r => [0,1,2,3,4,5,6,7].map(c =>
        <circle key={`${r}${c}`} cx={20 + c * 42} cy={20 + r * 52} r="1" fill="#ffffff06"/>
      ))}
      <ellipse cx="160" cy="104" rx="32" ry="20" fill="url(#arc1)"/>
      <ellipse cx="160" cy="104" rx="9" ry="6" fill="#fffde0" opacity="0.98"/>
      {/* TIG torch left */}
      <rect x="18" y="62" width="85" height="13" rx="4" fill="#4a4a4a" transform="rotate(14,80,69)"/>
      <rect x="92" y="76" width="48" height="8" rx="3" fill="#777" transform="rotate(14,116,80)"/>
      <polygon points="131,86 150,97 135,101" fill="#aaa"/>
      {[0,1,2,3,4,5].map(i => {
        const a = (192 + i * 26) * Math.PI / 180
        return <line key={i} x1="149" y1="99" x2={149 + Math.cos(a)*(11+i*4)} y2={99 + Math.sin(a)*(11+i*4)}
          stroke={i%2?'#FF8C00':'#fffde0'} strokeWidth="1.5" strokeLinecap="round" opacity={0.75-i*0.09}/>
      })}
      {/* MIG gun right */}
      <rect x="217" y="62" width="85" height="13" rx="4" fill="#3a3a3a" transform="rotate(-14,240,69)"/>
      <rect x="178" y="76" width="50" height="9" rx="3" fill="#666" transform="rotate(-14,203,80)"/>
      <polygon points="186,87 169,99 184,104" fill="#999"/>
      {[0,1,2,3,4,5].map(i => {
        const a = (-14 + i * 26) * Math.PI / 180
        return <line key={i} x1="170" y1="101" x2={170 + Math.cos(a)*(11+i*4)} y2={101 + Math.sin(a)*(11+i*4)}
          stroke={i%2?'#FFA500':'#fffde0'} strokeWidth="1.5" strokeLinecap="round" opacity={0.75-i*0.09}/>
      })}
      <text x="62" y="172" textAnchor="middle" fill="#FF8C00" fontSize="18" fontWeight="bold" fontFamily="monospace">TIG</text>
      <text x="255" y="172" textAnchor="middle" fill="#FF8C00" fontSize="14" fontWeight="bold" fontFamily="monospace">MIG/MAG</text>
      <text x="160" y="172" textAnchor="middle" fill="#ffffff45" fontSize="12" fontFamily="sans-serif">vs</text>
    </svg>
  )
}

function ThumbMercado() {
  return (
    <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="bg2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#021005"/>
          <stop offset="100%" stopColor="#081208"/>
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#bg2)"/>
      {[0,40,80,120].map(y=><line key={y} x1="38" y1={158-y} x2="282" y2={158-y} stroke="#ffffff09" strokeWidth="1"/>)}
      {[
        {x:68, h:48, yr:'2022'},
        {x:118, h:72, yr:'2023'},
        {x:168, h:96, yr:'2024'},
        {x:218, h:122, yr:'2025'},
        {x:268, h:146, yr:'2026'},
      ].map(({x,h,yr},i)=>(
        <g key={yr}>
          <rect x={x-20} y={158-h} width="40" height={h} rx="4" fill="#22C55E" opacity={0.18+i*0.16}/>
          <rect x={x-20} y={158-h} width="40" height="5" rx="2" fill="#22C55E" opacity={0.5+i*0.12}/>
          <text x={x} y={155-h} textAnchor="middle" fill={i===4?'#22C55E':'#ffffff55'} fontSize="10" fontWeight="bold">{yr}</text>
        </g>
      ))}
      <polyline points="68,148 118,122 168,98 218,72 268,48" stroke="#22C55E" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.75"/>
      <polygon points="268,48 262,60 274,58" fill="#22C55E" opacity="0.75"/>
      <text x="50" y="185" fill="#22C55E80" fontSize="11" fontFamily="sans-serif">Mercado de Soldagem no Brasil</text>
      <text x="270" y="185" textAnchor="end" fill="#22C55E" fontSize="11" fontWeight="bold" fontFamily="sans-serif">2026 →</text>
    </svg>
  )
}

function ThumbSeguranca() {
  return (
    <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="bg3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a0000"/>
          <stop offset="100%" stopColor="#0a0f1a"/>
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#bg3)"/>
      {/* shield center */}
      <path d="M160 25 L215 52 L215 118 Q215 152 160 172 Q105 152 105 118 L105 52 Z"
        fill="#EF444412" stroke="#EF4444" strokeWidth="2.5" strokeLinejoin="round"/>
      <polyline points="132,108 150,126 188,84"
        stroke="#EF4444" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* hard hat left */}
      <ellipse cx="60" cy="88" rx="36" ry="26" fill="#222240" stroke="#EF444460" strokeWidth="1.5"/>
      <rect x="24" y="88" width="72" height="20" rx="3" fill="#1a1a30" stroke="#EF444440" strokeWidth="1"/>
      <rect x="28" y="90" width="64" height="7" rx="2" fill="#EF444415" stroke="#EF444450" strokeWidth="0.8"/>
      {/* lightning bolt right */}
      <polygon points="258,35 242,88 265,88 248,158"
        fill="#EF444415" stroke="#EF4444" strokeWidth="2.5" strokeLinejoin="round"/>
      {/* NR badge */}
      <rect x="85" y="158" width="150" height="22" rx="6" fill="#EF444415" stroke="#EF444440" strokeWidth="1"/>
      <text x="160" y="173" textAnchor="middle" fill="#EF4444" fontSize="11" fontWeight="bold" fontFamily="sans-serif">NR-9 · NR-10 · Segurança</text>
    </svg>
  )
}

function ThumbCarreira() {
  return (
    <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="bg4" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#030d1a"/>
          <stop offset="100%" stopColor="#0a0a12"/>
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#bg4)"/>
      {/* CV paper */}
      <rect x="70" y="22" width="155" height="138" rx="8" fill="#12182a" stroke="#3B82F660" strokeWidth="1.5"/>
      <rect x="70" y="22" width="155" height="32" rx="8" fill="#3B82F618"/>
      <rect x="70" y="46" width="155" height="8" fill="#12182a"/>
      <circle cx="99" cy="40" r="13" fill="#3B82F625" stroke="#3B82F660" strokeWidth="1"/>
      <circle cx="99" cy="36" r="5" fill="#3B82F650"/>
      <path d="M87,51 Q99,44 111,51" stroke="#3B82F650" strokeWidth="1.5" fill="none"/>
      <rect x="118" y="33" width="72" height="5" rx="2" fill="#3B82F660"/>
      <rect x="118" y="43" width="52" height="4" rx="2" fill="#3B82F630"/>
      {[68,82,96,110,122,134].map((y,i)=>(
        <g key={y}>
          <circle cx="88" cy={y+2} r="3.5" fill={i%2===0?"#3B82F625":"#FF8C0025"}
            stroke={i%2===0?"#3B82F650":"#FF8C0050"} strokeWidth="0.8"/>
          <polyline points={`85.5,${y+2} 87.5,${y+4} 90.5,${y}`}
            stroke={i%2===0?"#3B82F6":"#FF8C00"} strokeWidth="1" fill="none" strokeLinecap="round"/>
          <rect x="96" y={y} width={60+(i%3)*18} height="3.5" rx="1.5" fill="#ffffff0e"/>
        </g>
      ))}
      {/* star badge */}
      <polygon points="253,52 259,70 278,70 264,81 270,99 253,88 236,99 242,81 228,70 247,70"
        fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinejoin="round"/>
      <polygon points="253,58 257,70 270,70 261,77 264,89 253,83 242,89 245,77 236,70 249,70"
        fill="#3B82F622"/>
      <text x="160" y="185" textAnchor="middle" fill="#3B82F6" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Currículo · LinkedIn · Certificação</text>
    </svg>
  )
}

function ThumbAluminio() {
  return (
    <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="bg5" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#090920"/>
          <stop offset="100%" stopColor="#101828"/>
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#bg5)"/>
      {/* hexagonal crystal lattice */}
      {[
        [115,68],[160,68],[205,68],
        [92,108],[137,108],[182,108],[227,108],
        [115,148],[160,148],[205,148],
      ].map(([cx,cy],i)=>{
        const pts=[0,60,120,180,240,300].map(a=>{const r=a*Math.PI/180;return `${cx+Math.cos(r)*23},${cy+Math.sin(r)*23}`}).join(' ')
        return <polygon key={i} points={pts} fill="#7799ff04" stroke="#6688ee22" strokeWidth="1"/>
      })}
      {[[115,68],[160,68],[205,68],[92,108],[137,108],[182,108],[227,108],[115,148],[160,148],[205,148]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="4.5" fill="#88aaff35" stroke="#99bbff55" strokeWidth="1"/>
      ))}
      {/* bond lines */}
      {[[115,68,160,68],[160,68,205,68],[92,108,137,108],[137,108,182,108],[182,108,227,108],[115,148,160,148],[160,148,205,148],
        [115,68,92,108],[160,68,137,108],[160,68,182,108],[205,68,182,108],[205,68,227,108],
        [92,108,115,148],[137,108,115,148],[137,108,160,148],[182,108,160,148],[182,108,205,148],[227,108,205,148]
      ].map(([x1,y1,x2,y2],i)=>(
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#5577cc18" strokeWidth="1"/>
      ))}
      {/* TIG torch overlay */}
      <rect x="45" y="50" width="62" height="10" rx="3" fill="#4a4a4a" transform="rotate(28,76,55)"/>
      <rect x="95" y="65" width="36" height="7" rx="2" fill="#777" transform="rotate(28,113,68)"/>
      {/* arc flash on lattice */}
      <ellipse cx="133" cy="90" rx="13" ry="9" fill="#ddeeff" opacity="0.75"/>
      <ellipse cx="133" cy="90" rx="5" ry="3" fill="#ffffff" opacity="0.98"/>
      {[0,45,90,135,180,225,270,315].map((a,i)=>{const r=a*Math.PI/180;return <line key={i}
        x1={133+Math.cos(r)*8} y1={90+Math.sin(r)*8} x2={133+Math.cos(r)*(16+i%3*5)} y2={90+Math.sin(r)*(16+i%3*5)}
        stroke={i%2?'#aaccff':'#ffffff'} strokeWidth="1.2" opacity="0.6" strokeLinecap="round"/>})}
      {/* Al label */}
      <text x="270" y="52" fill="#7799ff20" fontSize="44" fontWeight="900" fontFamily="monospace">Al</text>
      <text x="160" y="185" textAnchor="middle" fill="#8899ff" fontSize="11" fontWeight="bold" fontFamily="sans-serif">TIG CA · Alumínio · Estrutura Hex</text>
    </svg>
  )
}

function ThumbManutencao() {
  return (
    <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="bg6" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a0f00"/>
          <stop offset="100%" stopColor="#0e0e0e"/>
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#bg6)"/>
      {/* large gear */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i)=>{
        const r=a*Math.PI/180, ri=52, ro=66
        return <polygon key={i}
          points={`${160+Math.cos(r-.14)*ri},${100+Math.sin(r-.14)*ri} ${160+Math.cos(r-.14)*ro},${100+Math.sin(r-.14)*ro} ${160+Math.cos(r+.14)*ro},${100+Math.sin(r+.14)*ro} ${160+Math.cos(r+.14)*ri},${100+Math.sin(r+.14)*ri}`}
          fill="#8B5CF635" stroke="#8B5CF655" strokeWidth="1"/>
      })}
      <circle cx="160" cy="100" r="49" fill="none" stroke="#8B5CF635" strokeWidth="1.5"/>
      <circle cx="160" cy="100" r="20" fill="#8B5CF60e" stroke="#8B5CF645" strokeWidth="1.8"/>
      {/* wrench diagonal */}
      <rect x="90" y="62" width="140" height="20" rx="5" fill="#2a2a2a" stroke="#8B5CF6" strokeWidth="1.5"
        transform="rotate(-40,160,72)"/>
      <circle cx="102" cy="55" r="15" fill="#131320" stroke="#8B5CF6" strokeWidth="1.5"/>
      <circle cx="102" cy="55" r="7" fill="#8B5CF618"/>
      <circle cx="218" cy="97" r="15" fill="#131320" stroke="#8B5CF6" strokeWidth="1.5"/>
      <circle cx="218" cy="97" r="7" fill="#8B5CF618"/>
      {/* small gear top-right */}
      {[0,45,90,135,180,225,270,315].map((a,i)=>{const r=a*Math.PI/180, ri=12, ro=17;return <polygon key={i}
        points={`${268+Math.cos(r-.2)*ri},${42+Math.sin(r-.2)*ri} ${268+Math.cos(r-.2)*ro},${42+Math.sin(r-.2)*ro} ${268+Math.cos(r+.2)*ro},${42+Math.sin(r+.2)*ro} ${268+Math.cos(r+.2)*ri},${42+Math.sin(r+.2)*ri}`}
        fill="#8B5CF625" stroke="#8B5CF645" strokeWidth="0.8"/>})}
      <circle cx="268" cy="42" r="10" fill="none" stroke="#8B5CF640" strokeWidth="1"/>
      {/* machine box bottom-left */}
      <rect x="28" y="132" width="82" height="44" rx="5" fill="#1a1a1a" stroke="#8B5CF630" strokeWidth="1"/>
      <rect x="34" y="138" width="28" height="18" rx="2" fill="#8B5CF610"/>
      <circle cx="91" cy="148" r="6" fill="#8B5CF618" stroke="#8B5CF650" strokeWidth="1"/>
      <circle cx="103" cy="148" r="6" fill="#FF8C0018" stroke="#FF8C0040" strokeWidth="1"/>
      <text x="160" y="185" textAnchor="middle" fill="#8B5CF6" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Preventiva · Bico · Alimentador</text>
    </svg>
  )
}

function ThumbSalario() {
  return (
    <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="bg7" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#030d05"/>
          <stop offset="100%" stopColor="#081208"/>
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#bg7)"/>
      {[0,40,80,120].map(y=><line key={y} x1="45" y1={158-y} x2="275" y2={158-y} stroke="#ffffff07" strokeWidth="1"/>)}
      {[
        {x:85, h:44, label:'Eletrodo', val:'R$3.800'},
        {x:160, h:82, label:'MIG/MAG', val:'R$5.500'},
        {x:235, h:130, label:'TIG', val:'R$9.000+'},
      ].map(({x,h,label,val},i)=>(
        <g key={label}>
          <rect x={x-32} y={158-h} width="64" height={h} rx="5" fill="#22C55E" opacity={0.14+i*0.22}/>
          <rect x={x-32} y={158-h} width="64" height="5" rx="2" fill="#22C55E" opacity={0.5+i*0.22}/>
          <text x={x} y={154-h} textAnchor="middle" fill="#22C55E" fontSize="10" fontWeight="bold">{val}</text>
          <text x={x} y="173" textAnchor="middle" fill="#ffffff55" fontSize="10">{label}</text>
        </g>
      ))}
      <polyline points="85,150 160,112 235,64" stroke="#22C55E" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.45"/>
      <polygon points="235,64 229,76 241,74" fill="#22C55E" opacity="0.45"/>
      <text x="262" y="72" fill="#22C55E14" fontSize="62" fontWeight="900" fontFamily="monospace">R$</text>
      <text x="160" y="190" textAnchor="middle" fill="#22C55E" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Salários 2025/2026 — Mercado Brasileiro</text>
    </svg>
  )
}

function ThumbFBTS() {
  return (
    <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="bg8" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a0a00"/>
          <stop offset="100%" stopColor="#0a0a1a"/>
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#bg8)"/>
      {/* certificate */}
      <rect x="60" y="22" width="200" height="130" rx="9" fill="#15122a" stroke="#F59E0B40" strokeWidth="2"/>
      <rect x="60" y="22" width="200" height="30" rx="9" fill="#F59E0B14"/>
      <rect x="60" y="44" width="200" height="8" fill="#15122a"/>
      <text x="160" y="42" textAnchor="middle" fill="#F59E0B" fontSize="11" fontWeight="bold" fontFamily="sans-serif">CERTIFICADO FBTS</text>
      {[68,82,96,110].map((y,i)=>(
        <rect key={y} x="85" y={y} width={100+(i%2)*40} height="4" rx="2" fill="#ffffff0f"/>
      ))}
      {/* seal */}
      {[0,36,72,108,144,180,216,252,288,324].map((a,i)=>{const r=a*Math.PI/180;return <line key={i}
        x1={160+Math.cos(r)*22} y1={118+Math.sin(r)*22} x2={160+Math.cos(r)*34} y2={118+Math.sin(r)*34}
        stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>})}
      <circle cx="160" cy="118" r="22" fill="#F59E0B0e" stroke="#F59E0B" strokeWidth="1.5"/>
      <circle cx="160" cy="118" r="12" fill="#F59E0B15"/>
      <text x="160" y="123" textAnchor="middle" fill="#F59E0B" fontSize="16" fontWeight="900">✓</text>
      {/* ribbon */}
      <path d="M125,152 L160,168 L195,152 L195,158 L160,174 L125,158 Z" fill="#F59E0B22" stroke="#F59E0B45" strokeWidth="1"/>
      {/* laurel branches */}
      {[0,1,2,3].map(i=><ellipse key={i} cx={82-i*7} cy={88+i*9} rx="6" ry="11" fill="none" stroke="#F59E0B28" strokeWidth="1"
        transform={`rotate(${-32+i*14},${82-i*7},${88+i*9})`}/>)}
      {[0,1,2,3].map(i=><ellipse key={i} cx={238+i*7} cy={88+i*9} rx="6" ry="11" fill="none" stroke="#F59E0B28" strokeWidth="1"
        transform={`rotate(${32-i*14},${238+i*7},${88+i*9})`}/>)}
      <text x="160" y="188" textAnchor="middle" fill="#F59E0B" fontSize="11" fontWeight="bold" fontFamily="sans-serif">FBTS N1 · N2 · N3 · Soldador</text>
    </svg>
  )
}

const THUMB_MAP: Record<string, () => React.ReactElement> = {
  'tig-vs-mig-mag': ThumbTigMig,
  'mercado-soldagem-2026': ThumbMercado,
  'nr10-nr9-seguranca-soldagem': ThumbSeguranca,
  'curriculo-soldagem': ThumbCarreira,
  'soldagem-aluminio': ThumbAluminio,
  'manutencao-mig-mag': ThumbManutencao,
  'salario-soldador-2026': ThumbSalario,
  'certificacao-fbts': ThumbFBTS,
}

const ARTICLES: Article[] = [
  {
    id: 1, slug: 'tig-vs-mig-mag', featured: true,
    title: 'TIG vs MIG/MAG: qual processo escolher para cada aplicação?',
    excerpt: 'Com a expansão do setor eólico offshore e da indústria naval em 2025, a escolha certa do processo pode definir sua empregabilidade — e seu salário.',
    tag: 'Técnica', date: '2025-08-10', minutes: 6, author: 'Equipe W&F',
    content: [
      { body: 'A escolha do processo de soldagem certo pode determinar a qualidade, o custo e a produtividade de toda uma linha de produção. TIG (GTAW) e MIG/MAG (GMAW) continuam sendo os dois processos mais empregados no Brasil em 2025 — e a demanda crescente nos setores de energia renovável, naval e automotivo torna essa decisão mais estratégica do que nunca.' },
      { heading: 'Soldagem TIG (GTAW)', body: 'O processo TIG utiliza um eletrodo de tungstênio não-consumível e gás inerte para proteção da poça de fusão. O resultado é uma solda extremamente limpa, com acabamento visual impecável e altíssima integridade estrutural. É o processo preferido para aço inoxidável, alumínio, titânio e ligas especiais. Com a expansão da indústria de hidrogênio verde e tubulações de alta pressão em projetos de biorrefinarias no Brasil, a demanda por soldadores TIG atingiu um novo pico em 2025.' },
      { heading: 'Soldagem MIG/MAG (GMAW)', body: 'O MIG/MAG é o processo mais produtivo para aço carbono. Em 2025, a automação parcial com robôs colaborativos (cobots) de soldagem MIG/MAG tornou-se acessível para pequenas indústrias no Sul do Brasil — mas o soldador humano ainda é essencial para acabamentos, reparos e posições complexas. O mercado paga premium para soldadores que entendem os parâmetros digitais das máquinas inverter modernas.' },
      { heading: 'Quando usar cada um?', body: 'Use TIG quando a qualidade visual é crítica, para materiais nobres ou espessuras finas (< 4mm). Use MIG/MAG quando a produtividade é prioridade e o material é aço carbono em espessura de 2mm ou mais. O TIG exige mais habilidade do soldador; o MIG/MAG é mais fácil de aprender e permite soldagem em posições variadas com mais facilidade.' },
      { heading: 'Perspectiva salarial 2025', body: 'Dados do SINE Santa Catarina (2025) indicam que soldadores TIG no polo metal-mecânico de Itajaí/Joinville recebem entre R$ 5.000 e R$ 10.000/mês, dependendo da qualificação. Soldadores MIG/MAG ficam entre R$ 3.500 e R$ 6.500. Dominar ambos os processos pode aumentar o salário em até 45%.' },
    ],
  },
  {
    id: 2, slug: 'mercado-soldagem-2026', featured: false,
    title: 'Mercado de soldagem em 2026: onde estão as melhores vagas',
    excerpt: 'Com parques eólicos offshore, pré-sal e hidrogênio verde, 2026 promete ser o melhor ano para soldadores qualificados no Brasil. Veja os dados.',
    tag: 'Mercado', date: '2025-11-05', minutes: 5, author: 'Equipe W&F',
    content: [
      { body: 'O mercado de soldagem no Brasil vive um momento histórico. Segundo o Ministério do Trabalho e Emprego (MTE), a ocupação de soldador aparece como uma das 10 profissões com maior dificuldade de preenchimento em 2025, combinando crescimento de demanda com escassez de profissionais qualificados.' },
      { heading: 'Setores em expansão para 2026', body: 'Energia eólica offshore: A Petrobras e consórcios internacionais projetam 8,4 GW de capacidade eólica offshore no Nordeste até 2030. Construção naval: Estaleiros de Itajaí (SC), Niterói (RJ) e Recife (PE) ampliam capacidade. Petroquímica: Comperj (RJ) retoma obras paralisadas. Hidrogênio verde: Projetos no Ceará e Maranhão já licitados para 2026.' },
      { heading: 'Faixas salariais 2025/2026', body: 'Eletrodo Revestido: R$ 2.800–4.500 | MIG/MAG: R$ 3.500–6.500 | TIG: R$ 5.000–10.000+ | TIG multiprocesso + normas: R$ 7.000–14.000 | Inspetor N1 FBTS: R$ 6.000–12.000 | Inspetor N2/N3: R$ 10.000–22.000. Valores referência mercado Sul e Sudeste, regime CLT.' },
      { heading: 'Vale do Itajaí: polo em crescimento', body: 'Santa Catarina concentra o maior número de empresas metal-mecânicas do Sul do Brasil. Em 2025, o setor gerou mais de 4.200 novas vagas formais para soldadores no estado, segundo dados do CAGED. O polo de Itajaí abriga estaleiros de médio e grande porte e fornecedores de montagem industrial.' },
      { heading: 'Como se posicionar para 2026', body: 'Dominar TIG e MIG/MAG, ter certificação FBTS, conhecer normas ABNT NBR e ter noções de leitura de WPS são os diferenciais mais citados pelos RHs industriais em 2025. Investir em qualificação agora significa entrar em 2026 com a melhor posição para negociação salarial da carreira.' },
    ],
  },
  {
    id: 3, slug: 'nr10-nr9-seguranca-soldagem', featured: false,
    title: 'NR-9 e NR-10 atualizadas: o que mudou para soldadores em 2025',
    excerpt: 'O MTE publicou revisões importantes nas normas de saúde ocupacional em 2024-2025. Saiba o que mudou, o que é exigido agora e o que pode multar sua empresa.',
    tag: 'Segurança', date: '2025-07-18', minutes: 8, author: 'Equipe W&F',
    content: [
      { body: 'As Normas Regulamentadoras passaram por revisões significativas em 2024 e 2025 pelo Ministério do Trabalho e Emprego. Para soldadores e empresas do setor metal-mecânico, as mudanças trazem novos requisitos de monitoramento de fumos metálicos e novidades na qualificação elétrica.' },
      { heading: 'NR-9 — Atualização sobre fumos de soldagem', body: 'A revisão da NR-9 (PGR — Programa de Gerenciamento de Riscos) trouxe foco redobrado nos fumos de soldagem. Compostos de manganês em altas concentrações estão associados a doenças neurológicas de longo prazo. A nova norma exige: monitoramento ambiental quantitativo semestral em ambientes fechados; ventilação local exaustora (VLE) com eficiência mínima comprovada; registros documentados de exposição e laudos do SESMT.' },
      { heading: 'NR-10 — Novidades em equipamentos de solda', body: 'A atualização da NR-10 agora aborda explicitamente as fontes de soldagem inversora de alta frequência: aterramento obrigatório com condutor dedicado; proibição de cabos emendados ou com isolamento danificado; GFCI (proteção diferencial) obrigatório em ambientes com umidade; documentação de manutenção preventiva das máquinas de solda.' },
      { heading: 'EPIs atualizados para soldagem em 2025', body: 'Máscara de solda com filtro DIN adequado e CA válido (INMETRO); luvas de raspa de couro com reforço no dorso; avental e mangote de raspa; bota de segurança com biqueira de aço e solado isolante; protetor auricular para processos acima de 90dB; óculos incolor para remoção de escória. A NR-9 exige CA (Certificado de Aprovação) válido em todo EPI — verificar vencimento no site do MTE.' },
      { heading: 'Penalidades e fiscalização em 2025', body: 'O MTE intensificou fiscalizações no setor metal-mecânico em 2025. Multas por NR-9 e NR-10 não conformes variam de R$ 1.500 a R$ 6.700 por trabalhador exposto. Empresas reincidentes sofrem interdição imediata. Para o trabalhador, conhecer as NRs é também uma proteção legal — em caso de acidente, o descumprimento patronal garante indenização integral.' },
    ],
  },
  {
    id: 4, slug: 'curriculo-soldagem', featured: false,
    title: 'Como montar o currículo perfeito para vagas de soldagem em 2025',
    excerpt: 'RHs industriais revelam os 5 elementos que mais pesam na triagem — e o que está desclassificando candidatos imediatamente.',
    tag: 'Carreira', date: '2025-06-22', minutes: 4, author: 'Equipe W&F',
    content: [
      { body: 'Conversamos com recrutadores de 8 indústrias metal-mecânicas do polo de Itajaí, Joinville e Blumenau em 2025 para entender o que realmente pesa na triagem. Os resultados mostram um mercado técnico e exigente — mas com oportunidades claras para quem se posiciona bem.' },
      { heading: 'O que mais pesa na triagem em 2025', body: '1. Processos dominados — listar TIG, MIG/MAG, Eletrodo separadamente com nível. 2. Certificação FBTS — número de registro, processo e validade. 3. Normas trabalhadas — ABNT NBR, Petrobras N-133. 4. Equipamentos operados — marca/modelo (ESAB, Miller, Lincoln, Fronius). 5. Posições qualificadas — 1G, 2G, 3G, 4G: seja específico.' },
      { heading: 'O que desclassifica candidatos', body: '"Soldador de experiência geral" sem processo especificado (descartado em 3 segundos). Ausência de qualquer certificação. CV sem dados de contato profissional. LinkedIn inexistente ou sem foto. Em 2025, recrutadores de grandes indústrias pesquisam LinkedIn antes de ligar.' },
      { heading: 'Como descrever experiência de forma técnica', body: 'Evite: "soldei peças na empresa X". Escreva: "Soldagem de tubulações de aço inox 316L pelo processo GTAW (TIG) conforme ABNT NBR 15.614 em sistema de resfriamento industrial — operação de 12h/dia, posições 5G e 6G." Quanto mais específico e técnico, mais credibilidade.' },
      { heading: 'LinkedIn e portfólio visual', body: 'Em 2025, ter LinkedIn ativo com fotos de soldas realizadas é considerado diferencial top pelos recrutadores. 73% dos entrevistados disseram ter contratado soldadores encontrados diretamente no LinkedIn nos últimos 12 meses. Um vídeo de 30 segundos do seu cordão pode ser o diferencial decisivo.' },
    ],
  },
  {
    id: 5, slug: 'soldagem-aluminio', featured: false,
    title: 'Soldagem de alumínio: a habilidade mais valorizada de 2025',
    excerpt: 'Com EVs e energia solar em expansão, a demanda por soldadores de alumínio cresceu 38% no Brasil em 2024. Técnicas, cuidados e onde há vagas.',
    tag: 'Técnica', date: '2025-05-14', minutes: 9, author: 'Equipe W&F',
    content: [
      { body: 'O alumínio tornou-se o material metálico do momento. Com a expansão da indústria de veículos elétricos (EVs) no Brasil — incluindo a fábrica da BYD na Bahia (inaugurada em 2024) e fornecedores locais — e os projetos de estruturas de painéis solares, a demanda por soldadores qualificados em alumínio cresceu 38% em 2024, segundo dados do CAGED.' },
      { heading: 'Por que o alumínio é desafiador', body: 'O alumínio possui uma camada superficial de óxido (Al₂O₃) com ponto de fusão de 2.050°C — muito acima do metal base (660°C). O arco elétrico precisa quebrar essa camada antes de fundir o alumínio. O processo TIG em corrente alternada (CA/AC) é o mais indicado: o semiciclo positivo faz a limpeza catódica do óxido.' },
      { heading: 'Limpeza: o passo mais crítico', body: 'Use uma escova de aço inoxidável exclusiva para alumínio (nunca reutilizar em outros metais). Limpe com acetona ou álcool isopropílico imediatamente antes de soldar. A contaminação por óleo de corte é causa nº1 de porosidade em peças industriais. Armazene o alumínio em embalagem plástica após a limpeza.' },
      { heading: 'Parâmetros TIG CA para alumínio', body: '1,5mm: eletrodo 1,6mm zirconado, 60-80A CA, argônio 99,99%, 6 L/min | 3mm: eletrodo 2,4mm, 90-120A CA, argônio 8 L/min | 6mm: eletrodo 3,2mm, 150-200A CA, pré-aquecimento 80-100°C | Vareta: ER4043 (fluidez) ou ER5356 (resistência mecânica). A ponta esférica no eletrodo em CA é normal.' },
      { heading: 'Onde há demanda para alumínio em 2026', body: 'Fabricantes de implementos rodoviários (baú frigorífico); estruturas de painéis solares; indústria naval (superestruturas); fabricantes de bicicletas e patinetes elétricos; fornecedores automotivos. Soldadores TIG de alumínio qualificados recebem 25-40% acima da média TIG carbono.' },
    ],
  },
  {
    id: 6, slug: 'manutencao-mig-mag', featured: false,
    title: 'Manutenção preventiva MIG/MAG: o checklist dos melhores soldadores',
    excerpt: 'Equipamentos bem mantidos produzem soldas melhores, consomem menos gás e duram o dobro. Checklist completo incluindo as novas máquinas digitais.',
    tag: 'Equipamentos', date: '2025-04-30', minutes: 6, author: 'Equipe W&F',
    content: [
      { body: 'As novas fontes de soldagem MIG/MAG com interface digital (ESAB Rebel, Lincoln PowerMIG, Fronius TransMig) mudaram a manutenção preventiva. Além dos cuidados mecânicos tradicionais, agora é necessário verificar firmware, salvar parâmetros e monitorar logs de falhas.' },
      { heading: 'Checklist semanal', body: '✓ Inspecionar mangueira da tocha por rachaduras | ✓ Verificar bico de contato — trocar se oval ou com respingos internos | ✓ Limpar difusor de gás com spray anti-respingo | ✓ Verificar tensão de frenagem do carretel | ✓ Inspecionar cabo de retorno e garra de massa (oxidação = alta resistência) | ✓ Testar fluxo de gás com rotâmetro.' },
      { heading: 'Checklist mensal', body: '✓ Soprar internamente a fonte com ar comprimido seco (nunca com umidade) | ✓ Verificar e lubrificar guias do alimentador (graxa de silicone, não WD-40) | ✓ Inspecionar roletes de alimentação — substituir quando há entalhes | ✓ Verificar conexões elétricas internas (fio escurecido = problema) | ✓ Calibrar tensão e velocidade com medidor externo.' },
      { heading: 'Máquinas digitais: novidades em 2024-2025', body: 'As fontes inversora modernas possuem memória de parâmetros, diagnóstico de erros e conectividade. Boas práticas: backup dos programas de solda antes de atualização de firmware; verificar e atualizar firmware anualmente; exportar log de horas — fontes com mais de 2.000h merecem inspeção da placa de potência.' },
      { heading: 'Custo de não fazer manutenção', body: 'Um bico de contato desgastado desperdiça até 15% do gás de proteção. Um cabo de retorno oxidado pode adicionar 20-30V de resistência parasita, causando defeitos e retrabalho. Troca de placa de potência por superaquecimento evitável: R$ 2.500–6.000. Troca de bico de contato preventiva: R$ 3–8 por peça.' },
    ],
  },
  {
    id: 7, slug: 'salario-soldador-2026', featured: false,
    title: 'Quanto ganha um soldador no Brasil em 2025/2026?',
    excerpt: 'Levantamento atualizado com CAGED, SINE e plataformas de emprego. Faixas por processo, estado e nível de qualificação — dados reais.',
    tag: 'Mercado', date: '2025-10-12', minutes: 5, author: 'Equipe W&F',
    content: [
      { body: 'Com base nos dados do CAGED (2024-2025), RAIS, SINE-SC, SINE-SP e plataformas LinkedIn, Indeed e Vagas.com, compilamos as principais referências salariais do mercado de soldagem. Os números mostram crescimento real acima da inflação pelo terceiro ano consecutivo.' },
      { heading: 'Tabela salarial por processo — Sul/Sudeste 2025', body: 'Eletrodo Revestido: R$ 2.800–4.500/mês | MIG/MAG: R$ 3.500–6.500/mês | TIG aço carbono/inox: R$ 5.000–10.000/mês | TIG alumínio especializado: R$ 6.000–12.000/mês | Multiprocesso TIG+MIG: R$ 5.500–14.000/mês | Inspetor N1 FBTS: R$ 6.000–12.000/mês | Inspetor N2/N3: R$ 10.000–22.000+/mês.' },
      { heading: 'Regiões com maiores salários em 2025', body: 'Sul (SC, RS, PR): Polo metal-mecânico catarinense (Itajaí, Joinville, Blumenau) com médias 15-20% acima da nacional. Rio de Janeiro: Petrobras e oil & gas offshore, faixas mais altas do país para soldadores certificados. São Paulo: Volume e diversidade, especialmente automotivo e aeronáutico (São José dos Campos).' },
      { heading: 'Regime de embarque: o multiplicador salarial', body: 'Soldadores em embarque (14x7, 28x28) em plataformas ou estaleiros recebem adicionais de insalubridade e periculosidade que podem dobrar o salário-base. Soldadores TIG qualificados com N-133 Petrobras em embarque chegam a R$ 18.000–25.000/mês. Exige FBTS, processo seletivo rigoroso e boa condição física.' },
      { heading: 'Projeção 2026: tendência de alta', body: 'Com o déficit estimado de 28.000 soldadores qualificados no Brasil até 2027 (FGV/SENAI, 2024), a perspectiva é de crescimento salarial de 8-12% acima da inflação. O investimento em qualificação tem retorno médio de 300-500% em 18 meses para quem migra do Eletrodo para TIG.' },
    ],
  },
  {
    id: 8, slug: 'certificacao-fbts', featured: false,
    title: 'Certificação FBTS 2025: valores, requisitos e como se preparar',
    excerpt: 'A FBTS revisou tabelas de preços e digitalizou processos em 2024. Veja o que mudou, quanto custa e as dicas para ser aprovado em cada nível.',
    tag: 'Certificações', date: '2025-09-08', minutes: 7, author: 'Equipe W&F',
    content: [
      { body: 'A FBTS (Fundação Brasileira de Tecnologia de Soldagem) atualizou suas tabelas de preços e requisitos em 2024. Para 2025, os processos foram parcialmente digitalizados: o registro inicial e documentação agora são enviados online, reduzindo o tempo médio de processamento de 45 para 12 dias úteis.' },
      { heading: 'Certificação de Soldador (CS-FBTS) — 2025', body: 'Emitida por processo (TIG, MIG/MAG, Eletrodo) e posição. O candidato realiza prova prática com análise por inspeção visual e radiografia (RX) ou dobramento. Valores 2025: certificação simples (1 processo, 1 posição) — R$ 420–650 + taxa de laboratório. Renovação (2 anos) — R$ 280–420. Validade: 2 anos, renovável com comprovação de atividade.' },
      { heading: 'Inspetor de Soldagem N1 (IS-1)', body: 'Requisitos: ensino médio completo; treinamento credenciado de 40h e aprovação no exame com 70% mínimo. Conteúdo: processos de soldagem, símbolos ABNT ISO 2553, descontinuidades, normas NBR básicas e EPI. Custo total (curso + exame + registro): R$ 1.800–2.800. Validade: 3 anos.' },
      { heading: 'IS-N2 e IS-N3: o topo da carreira', body: 'N2: experiência mínima de 2 anos como N1 + exame avançado (ASME VIII, IX, AWS D1.1). Diferencial salarial sobre N1: +60-80%. N3: formação técnica/superior em engenharia ou metalurgia, 5 anos de experiência. Habilita a elaborar EPS, PQR e RQPS. Inspetor N3 em offshore pode cobrar R$ 450/hora como PJ.' },
      { heading: 'Como se preparar para a prova prática', body: 'Para a CS-FBTS, pratique as posições exigidas (2G, 3G, 4G para Eletrodo; 2G, 5G para TIG em tubulação) até obter uniformidade e penetração completa sem defeitos visuais. Leia o código aplicável (ASME IX para vasos/tubulações). Na Welder & Fusion, o treinamento é estruturado com os critérios de aprovação da FBTS.' },
    ],
  },
]

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function ArticleThumb({ slug }: { slug: string }) {
  const Comp = THUMB_MAP[slug]
  if (!Comp) return <div className="w-full h-full" style={{ background: '#242424' }}/>
  return <div className="w-full h-full overflow-hidden"><Comp /></div>
}

export function ArticlesPage() {
  const [activeTag, setActiveTag] = useState('Todos')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Article | null>(null)

  const filtered = ARTICLES.filter(a => {
    const matchTag = activeTag === 'Todos' || a.tag === activeTag
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase())
    return matchTag && matchSearch
  })

  const featured = ARTICLES.find(a => a.featured)
  const grid = filtered.filter(a => !(a.featured && activeTag === 'Todos' && !search))

  return (
    <div style={{ background: '#1A1A1A' }}>

      {/* Hero */}
      <section className="py-14 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-5 text-xs font-semibold uppercase tracking-widest"
            style={{ borderColor: '#FF8C0033', background: '#FF8C0010', color: '#FF8C00' }}>
            Conhecimento em Soldagem
          </div>
          <h1 className="text-5xl font-black text-white mb-4">Artigos &amp; Notícias</h1>
          <p className="text-lg text-white">
            Conteúdo técnico, tendências de mercado e dicas de carreira para soldadores profissionais.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-4 mb-10">
          <div className="flex flex-wrap gap-2 flex-1">
            {TAGS.map(t => (
              <button key={t} onClick={() => setActiveTag(t)}
                className="px-3 py-1.5 rounded-full text-sm font-medium border transition-all"
                style={activeTag === t
                  ? { background: '#FF8C00', color: '#000', borderColor: '#FF8C00' }
                  : { background: 'transparent', color: '#d1d5db', borderColor: '#ffffff15' }}>
                {t}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-56">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B7280' }} />
            <Input placeholder="Buscar artigo..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 text-sm" />
          </div>
        </div>

        {/* Destaque */}
        {featured && activeTag === 'Todos' && !search && (
          <div className="mb-10 rounded-3xl overflow-hidden border group cursor-pointer"
            style={{ background: '#242424', borderColor: '#FF8C0025' }}
            onClick={() => setSelected(featured)}>
            <div className="grid lg:grid-cols-5">
              <div className="lg:col-span-2 min-h-[220px] lg:min-h-0">
                <ArticleThumb slug={featured.slug} />
              </div>
              <div className="lg:col-span-3 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{ background: (TAG_COLORS[featured.tag] || '#FF8C00') + '20', color: TAG_COLORS[featured.tag] || '#FF8C00' }}>
                      {featured.tag}
                    </span>
                    <span className="text-xs flex items-center gap-1 text-white"><Clock size={11} /> {featured.minutes} min de leitura</span>
                  </div>
                  <h2 className="text-2xl font-black text-white mb-3 group-hover:text-[#FF8C00] transition-colors leading-snug">{featured.title}</h2>
                  <p className="text-sm leading-relaxed text-white">{featured.excerpt}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t mt-4" style={{ borderColor: '#ffffff0d' }}>
                  <span className="text-xs text-white">{fmtDate(featured.date)}</span>
                  <span className="flex items-center gap-1 text-sm font-semibold" style={{ color: '#FF8C00' }}>
                    Ler artigo <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 rounded-2xl" style={{ background: '#242424' }}>
            <p className="text-white font-semibold mb-1">Nenhum artigo encontrado</p>
            <p className="text-sm text-white">Tente outro filtro ou termo de busca.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {grid.map(article => (
              <article key={article.id}
                className="group rounded-2xl border flex flex-col overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-2xl"
                style={{ background: '#242424', borderColor: '#ffffff0d' }}
                onClick={() => setSelected(article)}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#FF8C0030')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#ffffff0d')}>
                <div className="h-44 overflow-hidden">
                  <ArticleThumb slug={article.slug} />
                </div>
                <div className="h-1" style={{ background: TAG_COLORS[article.tag] || '#FF8C00' }} />
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: TAG_COLORS[article.tag] || '#FF8C00' }}>
                      <Tag size={11} /> {article.tag}
                    </span>
                    <span className="text-xs flex items-center gap-1 text-white"><Clock size={11} /> {article.minutes} min</span>
                  </div>
                  <h3 className="font-bold text-white text-base leading-snug mb-2 group-hover:text-[#FF8C00] transition-colors flex-1">{article.title}</h3>
                  <p className="text-sm leading-relaxed mb-4 text-white">{article.excerpt}</p>
                  <div className="flex items-center justify-between pt-3 border-t mt-auto" style={{ borderColor: '#ffffff08' }}>
                    <span className="text-xs text-white">{fmtDate(article.date)}</span>
                    <span className="text-xs font-semibold flex items-center gap-1" style={{ color: '#FF8C00' }}>
                      Ler <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 rounded-3xl p-10 text-center border" style={{ background: '#242424', borderColor: '#FF8C0020' }}>
          <h3 className="text-2xl font-black text-white mb-2">Quer receber novos artigos?</h3>
          <p className="mb-6 text-white">Fale conosco pelo WhatsApp e fique por dentro de tudo sobre soldagem.</p>
          <a href="https://wa.me/5547988786738" target="_blank" rel="noreferrer">
            <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
              style={{ background: '#FF8C00', color: '#000' }}>
              📲 Acompanhar no WhatsApp
            </button>
          </a>
        </div>
      </div>

      {/* ── MODAL ── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto">
          <div className="absolute inset-0 bg-black/80" onClick={() => setSelected(null)} />
          <div className="relative z-10 w-full max-w-3xl rounded-2xl overflow-hidden mb-8"
            style={{ background: '#1A1A1A', border: '1px solid #FF8C0020' }}>
            <div className="h-52 relative">
              <ArticleThumb slug={selected.slug} />
              <button onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-80"
                style={{ background: 'rgba(0,0,0,0.75)', color: '#fff' }}>
                <X size={18} />
              </button>
            </div>
            <div className="p-8">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: (TAG_COLORS[selected.tag] || '#FF8C00') + '20', color: TAG_COLORS[selected.tag] || '#FF8C00' }}>
                  {selected.tag}
                </span>
                <span className="text-xs flex items-center gap-1 text-white"><Clock size={11} /> {selected.minutes} min</span>
                <span className="text-xs text-white">{fmtDate(selected.date)}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white mb-6 leading-snug">{selected.title}</h1>
              <div className="space-y-5">
                {selected.content.map((block, i) => (
                  <div key={i}>
                    {block.heading && <h2 className="text-lg font-black mb-2" style={{ color: '#FF8C00' }}>{block.heading}</h2>}
                    <p className="text-sm leading-relaxed text-white">{block.body}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t flex items-center justify-between" style={{ borderColor: '#ffffff0d' }}>
                <div>
                  <p className="text-xs text-white">Por {selected.author}</p>
                  <p className="text-xs text-white">{fmtDate(selected.date)}</p>
                </div>
                <button onClick={() => setSelected(null)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                  style={{ background: '#FF8C00', color: '#000' }}>
                  Fechar artigo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
