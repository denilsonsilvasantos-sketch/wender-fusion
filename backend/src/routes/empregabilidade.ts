import { Router } from 'express'
import type { Response, NextFunction } from 'express'
import { authenticate, requireAdmin, type AuthRequest } from '../middleware/auth'
import { supabase } from '../config/supabase'

const router = Router()

// ============================================================
// EMPRESAS PARCEIRAS
// ============================================================

router.get('/companies', authenticate, requireAdmin, async (_req, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase
      .from('partner_companies')
      .select('*')
      .order('name')
    res.json({ data })
  } catch (err) { next(err) }
})

router.post('/companies', authenticate, requireAdmin, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('partner_companies')
      .insert(req.body)
      .select()
      .single()
    if (error) throw error
    res.status(201).json({ data })
  } catch (err) { next(err) }
})

router.patch('/companies/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('partner_companies')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single()
    if (error) throw error
    res.json({ data })
  } catch (err) { next(err) }
})

router.delete('/companies/:id', authenticate, requireAdmin, async (req, res: Response, next: NextFunction) => {
  try {
    await supabase.from('partner_companies').delete().eq('id', req.params.id)
    res.json({ message: 'Empresa removida' })
  } catch (err) { next(err) }
})

// ============================================================
// VAGAS
// ============================================================

router.get('/jobs', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let query = supabase
      .from('job_postings')
      .select('*, company:partner_companies(id, name, logo_url, city, state)')
      .order('created_at', { ascending: false })

    if (req.userRole !== 'admin' && req.userRole !== 'instructor') {
      query = query.eq('status', 'open')
    }

    const { data } = await query
    res.json({ data })
  } catch (err) { next(err) }
})

router.post('/jobs', authenticate, requireAdmin, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('job_postings')
      .insert({ ...req.body, created_by: req.userId })
      .select()
      .single()
    if (error) throw error
    res.status(201).json({ data })
  } catch (err) { next(err) }
})

router.patch('/jobs/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('job_postings')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single()
    if (error) throw error
    res.json({ data })
  } catch (err) { next(err) }
})

router.delete('/jobs/:id', authenticate, requireAdmin, async (req, res: Response, next: NextFunction) => {
  try {
    await supabase.from('job_postings').delete().eq('id', req.params.id)
    res.json({ message: 'Vaga removida' })
  } catch (err) { next(err) }
})

// GET /jobs/:id/applications — admin only
router.get('/jobs/:id/applications', authenticate, requireAdmin, async (req, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase
      .from('job_applications')
      .select('*, student:user_profiles(id, name, email, phone)')
      .eq('job_id', req.params.id)
      .order('applied_at', { ascending: false })
    res.json({ data })
  } catch (err) { next(err) }
})

// ============================================================
// CANDIDATURAS
// ============================================================

router.get('/applications/my', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase
      .from('job_applications')
      .select('*, job:job_postings(id, title, company:partner_companies(name, logo_url))')
      .eq('student_id', req.userId!)
      .order('applied_at', { ascending: false })
    res.json({ data })
  } catch (err) { next(err) }
})

router.post('/jobs/:id/apply', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .insert({
        job_id: req.params.id,
        student_id: req.userId,
        cover_letter: req.body.cover_letter,
      })
      .select()
      .single()
    if (error) throw error
    res.status(201).json({ data, message: 'Candidatura enviada com sucesso' })
  } catch (err) { next(err) }
})

router.patch('/applications/:id/status', authenticate, requireAdmin, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .update({ status: req.body.status })
      .eq('id', req.params.id)
      .select()
      .single()
    if (error) throw error
    res.json({ data })
  } catch (err) { next(err) }
})

// ============================================================
// BANCO DE TALENTOS
// ============================================================

router.get('/talent-bank', authenticate, requireAdmin, async (_req, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase
      .from('talent_bank')
      .select('*, student:user_profiles(id, name, email, avatar_url)')
      .eq('visible', true)
      .order('updated_at', { ascending: false })
    res.json({ data })
  } catch (err) { next(err) }
})

router.get('/talent-bank/my', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase
      .from('talent_bank')
      .select('*')
      .eq('student_id', req.userId!)
      .maybeSingle()
    res.json({ data })
  } catch (err) { next(err) }
})

router.put('/talent-bank/my', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('talent_bank')
      .upsert({ ...req.body, student_id: req.userId, updated_at: new Date().toISOString() })
      .select()
      .single()
    if (error) throw error
    res.json({ data, message: 'Perfil atualizado no banco de talentos' })
  } catch (err) { next(err) }
})

export default router
