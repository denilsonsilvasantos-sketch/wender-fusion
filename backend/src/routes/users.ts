import { Router } from 'express'
import type { Response, NextFunction } from 'express'
import { authenticate, requireAdmin, type AuthRequest } from '../middleware/auth'
import { supabase } from '../config/supabase'

const router = Router()

// GET /api/users/me
router.get('/me', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase.from('user_profiles').select('*').eq('id', req.userId!).single()
    res.json({ data })
  } catch (err) { next(err) }
})

// PATCH /api/users/me
router.patch('/me', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, phone, bio, avatar_url } = req.body
    const { data, error } = await supabase.from('user_profiles').update({ name, phone, bio, avatar_url }).eq('id', req.userId!).select().single()
    if (error) throw error
    res.json({ data, message: 'Perfil atualizado' })
  } catch (err) { next(err) }
})

// GET /api/users - admin only
router.get('/', authenticate, requireAdmin, async (_req, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase.from('user_profiles').select('*').order('created_at', { ascending: false })
    res.json({ data })
  } catch (err) { next(err) }
})

// PATCH /api/users/:id/role - admin only
router.patch('/:id/role', authenticate, requireAdmin, async (req, res: Response, next: NextFunction) => {
  try {
    const { role } = req.body
    if (!['student', 'instructor', 'admin'].includes(role)) return res.status(400).json({ message: 'Role inválida' })
    const { data } = await supabase.from('user_profiles').update({ role }).eq('id', req.params.id).select().single()
    res.json({ data, message: 'Role atualizada' })
  } catch (err) { next(err) }
})

export default router
