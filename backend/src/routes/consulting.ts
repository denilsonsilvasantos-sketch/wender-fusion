import { Router } from 'express'
import type { Response, NextFunction } from 'express'
import { authenticate, requireAdmin, type AuthRequest } from '../middleware/auth'
import { supabase } from '../config/supabase'

const router = Router()

// ============================================================
// CONSULTORIAS
// ============================================================

router.get('/engagements', authenticate, requireAdmin, async (_req, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase
      .from('consulting_engagements')
      .select('*, assigned:user_profiles(id, name)')
      .order('created_at', { ascending: false })
    res.json({ data })
  } catch (err) { next(err) }
})

router.post('/engagements', authenticate, requireAdmin, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('consulting_engagements')
      .insert({ ...req.body, created_by: req.userId })
      .select()
      .single()
    if (error) throw error
    res.status(201).json({ data })
  } catch (err) { next(err) }
})

router.patch('/engagements/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('consulting_engagements')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single()
    if (error) throw error
    res.json({ data })
  } catch (err) { next(err) }
})

router.delete('/engagements/:id', authenticate, requireAdmin, async (req, res: Response, next: NextFunction) => {
  try {
    await supabase.from('consulting_engagements').delete().eq('id', req.params.id)
    res.json({ message: 'Consultoria removida' })
  } catch (err) { next(err) }
})

// ============================================================
// RELATÓRIOS DE CONSULTORIA
// ============================================================

router.get('/engagements/:id/reports', authenticate, requireAdmin, async (req, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase
      .from('consulting_reports')
      .select('*, created_by:user_profiles(id, name)')
      .eq('engagement_id', req.params.id)
      .order('created_at', { ascending: false })
    res.json({ data })
  } catch (err) { next(err) }
})

router.post('/engagements/:id/reports', authenticate, requireAdmin, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('consulting_reports')
      .insert({
        ...req.body,
        engagement_id: req.params.id,
        created_by: req.userId,
      })
      .select()
      .single()
    if (error) throw error
    res.status(201).json({ data })
  } catch (err) { next(err) }
})

router.patch('/reports/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const payload: Record<string, unknown> = {
      ...req.body,
      updated_at: new Date().toISOString(),
    }
    if (req.body.status === 'published' && !req.body.published_at) {
      payload.published_at = new Date().toISOString()
    }
    const { data, error } = await supabase
      .from('consulting_reports')
      .update(payload)
      .eq('id', req.params.id)
      .select()
      .single()
    if (error) throw error
    res.json({ data })
  } catch (err) { next(err) }
})

router.delete('/reports/:id', authenticate, requireAdmin, async (req, res: Response, next: NextFunction) => {
  try {
    await supabase.from('consulting_reports').delete().eq('id', req.params.id)
    res.json({ message: 'Relatório removido' })
  } catch (err) { next(err) }
})

export default router
