import { Router } from 'express'
import type { Response, NextFunction } from 'express'
import { authenticate, requireAdmin, type AuthRequest } from '../middleware/auth'
import { supabase } from '../config/supabase'

const router = Router()

// ============================================================
// ETAPAS DO FUNIL
// ============================================================

router.get('/stages', authenticate, requireAdmin, async (_req, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase
      .from('sales_funnel_stages')
      .select('*')
      .order('order_index')
    res.json({ data })
  } catch (err) { next(err) }
})

router.post('/stages', authenticate, requireAdmin, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('sales_funnel_stages')
      .insert(req.body)
      .select()
      .single()
    if (error) throw error
    res.status(201).json({ data })
  } catch (err) { next(err) }
})

router.patch('/stages/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('sales_funnel_stages')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single()
    if (error) throw error
    res.json({ data })
  } catch (err) { next(err) }
})

router.delete('/stages/:id', authenticate, requireAdmin, async (req, res: Response, next: NextFunction) => {
  try {
    await supabase.from('sales_funnel_stages').delete().eq('id', req.params.id)
    res.json({ message: 'Etapa removida' })
  } catch (err) { next(err) }
})

// ============================================================
// LEADS
// ============================================================

router.get('/leads', authenticate, requireAdmin, async (_req, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase
      .from('leads')
      .select(`
        *,
        stage:sales_funnel_stages(id, name, color),
        course:courses(id, title),
        assigned:user_profiles(id, name)
      `)
      .order('created_at', { ascending: false })
    res.json({ data })
  } catch (err) { next(err) }
})

router.post('/leads', authenticate, requireAdmin, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .insert(req.body)
      .select()
      .single()
    if (error) throw error
    res.status(201).json({ data })
  } catch (err) { next(err) }
})

router.patch('/leads/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single()
    if (error) throw error
    res.json({ data })
  } catch (err) { next(err) }
})

router.delete('/leads/:id', authenticate, requireAdmin, async (req, res: Response, next: NextFunction) => {
  try {
    await supabase.from('leads').delete().eq('id', req.params.id)
    res.json({ message: 'Lead removido' })
  } catch (err) { next(err) }
})

// PATCH /leads/:id/convert — marca como convertido e vincula matrícula
router.patch('/leads/:id/convert', authenticate, requireAdmin, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { enrollment_id } = req.body
    const { data, error } = await supabase
      .from('leads')
      .update({
        converted: true,
        enrollment_id: enrollment_id ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.params.id)
      .select()
      .single()
    if (error) throw error
    res.json({ data, message: 'Lead convertido em matrícula' })
  } catch (err) { next(err) }
})

// ============================================================
// INTERAÇÕES DE LEADS
// ============================================================

router.get('/leads/:id/interactions', authenticate, requireAdmin, async (req, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase
      .from('lead_interactions')
      .select('*, created_by:user_profiles(id, name)')
      .eq('lead_id', req.params.id)
      .order('created_at', { ascending: false })
    res.json({ data })
  } catch (err) { next(err) }
})

router.post('/leads/:id/interactions', authenticate, requireAdmin, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('lead_interactions')
      .insert({
        lead_id: req.params.id,
        type: req.body.type,
        notes: req.body.notes,
        created_by: req.userId,
      })
      .select()
      .single()
    if (error) throw error
    res.status(201).json({ data })
  } catch (err) { next(err) }
})

export default router
