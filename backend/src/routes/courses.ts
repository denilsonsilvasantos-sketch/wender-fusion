import { Router } from 'express'
import { authenticate, requireAdmin, type AuthRequest } from '../middleware/auth'
import { supabase } from '../config/supabase'
import { createError } from '../middleware/errorHandler'
import type { Response, NextFunction } from 'express'

const router = Router()

// GET /api/courses - public, only published
router.get('/', async (_req, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*, instructor:user_profiles(id, name, avatar_url), modules(id, title, order_index, lessons(id, title, duration_minutes, is_free_preview, order_index))')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
    if (error) throw error
    res.json({ data })
  } catch (err) { next(err) }
})

// GET /api/courses/:id - public
router.get('/:id', async (req, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*, instructor:user_profiles(id, name, avatar_url), modules(*, lessons(*))')
      .eq('id', req.params.id)
      .single()
    if (error || !data) return next(createError('Curso não encontrado', 404))
    res.json({ data })
  } catch (err) { next(err) }
})

// Admin routes
router.use(authenticate, requireAdmin)

// GET /api/courses/admin/all - admin only, all statuses
router.get('/admin/all', async (_req, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false })
    if (error) throw error
    res.json({ data })
  } catch (err) { next(err) }
})

// POST /api/courses
router.post('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, description, full_description, price, duration_hours, level, thumbnail_url, min_attendance_percentage, min_grade } = req.body
    const { data, error } = await supabase.from('courses').insert({
      title, description, full_description, price, duration_hours, level, thumbnail_url,
      min_attendance_percentage: min_attendance_percentage || 75,
      min_grade: min_grade || 6,
      instructor_id: req.userId,
      status: 'draft',
    }).select().single()
    if (error) throw error
    res.status(201).json({ data, message: 'Curso criado com sucesso' })
  } catch (err) { next(err) }
})

// PUT /api/courses/:id
router.put('/:id', async (req, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase.from('courses').update(req.body).eq('id', req.params.id).select().single()
    if (error) throw error
    res.json({ data, message: 'Curso atualizado' })
  } catch (err) { next(err) }
})

// DELETE /api/courses/:id
router.delete('/:id', async (req, res: Response, next: NextFunction) => {
  try {
    const { error } = await supabase.from('courses').delete().eq('id', req.params.id)
    if (error) throw error
    res.json({ message: 'Curso excluído' })
  } catch (err) { next(err) }
})

export default router
