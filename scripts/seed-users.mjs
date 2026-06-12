/**
 * Cria os 4 usuários de teste no Supabase.
 * Execute: npm run seed:users
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dir, '..', 'backend', '.env')

function parseEnv(filePath) {
  const lines = readFileSync(filePath, 'utf8').split('\n')
  const env = {}
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim()
  }
  return env
}

const env = parseEnv(envPath)

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const USERS = [
  {
    email: 'admin@welderfusion.com.br',
    password: 'Wf@Admin2024',
    name: 'Admin Geral',
    role: 'admin',
  },
  {
    email: 'instrutor@welderfusion.com.br',
    password: 'Wf@Instrutor2024',
    name: 'Carlos Eduardo — Instrutor',
    role: 'instructor',
  },
  {
    email: 'aluno@welderfusion.com.br',
    password: 'Wf@Aluno2024',
    name: 'João Silva — Aluno Demo',
    role: 'student',
  },
  {
    email: 'industrial@welderfusion.com.br',
    password: 'Wf@Industrial2024',
    name: 'Metalúrgica ABC Ltda',
    role: 'industrial_client',
  },
]

async function seed() {
  console.log('\n🔧  Welder & Fusion — Criando usuários de teste\n')

  const { data: existing } = await supabase.auth.admin.listUsers()
  const existingEmails = new Set((existing?.users ?? []).map(u => u.email))

  for (const u of USERS) {
    if (existingEmails.has(u.email)) {
      console.log(`⏭   ${u.email}  (já existe)`)
      continue
    }

    // 1. Criar no Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { name: u.name },
    })

    if (error) {
      console.error(`❌  ${u.email}:`, error.message)
      continue
    }

    // 2. Aguardar trigger criar o perfil
    await new Promise(r => setTimeout(r, 600))

    // 3. Atualizar role e nome no perfil
    const { error: upErr } = await supabase
      .from('user_profiles')
      .update({ role: u.role, name: u.name })
      .eq('id', data.user.id)

    if (upErr) {
      // Trigger pode não ter rodado — inserir manualmente
      await supabase.from('user_profiles').insert({
        id: data.user.id,
        email: u.email,
        name: u.name,
        role: u.role,
      })
    }

    console.log(`✅  ${u.email}`)
    console.log(`    Senha : ${u.password}`)
    console.log(`    Perfil: ${u.role}\n`)
  }

  console.log('─────────────────────────────────────────')
  console.log('Credenciais de acesso:\n')
  for (const u of USERS) {
    console.log(`  [${u.role.padEnd(16)}]  ${u.email}  /  ${u.password}`)
  }
  console.log()
}

seed().catch(err => {
  console.error('Erro fatal:', err)
  process.exit(1)
})
