import { Router } from 'express'
import type { Response, NextFunction } from 'express'
import { authenticate, requireAdmin, type AuthRequest } from '../middleware/auth'
import { supabase } from '../config/supabase'

const router = Router()

// GET /api/lessons/course/:courseId - for enrolled students
router.get('/course/:courseId', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { data: enrollment } = await supabase
      .from('enrollments').select('id').eq('student_id', req.userId!).eq('course_id', req.params.courseId).eq('status', 'active').single()

    if (!enrollment) return res.status(403).json({ message: 'Não matriculado neste curso' })

    const { data } = await supabase.from('modules').select('*, lessons(*)').eq('course_id', req.params.courseId).order('order_index')
    res.json({ data })
  } catch (err) { next(err) }
})

// POST /api/lessons - admin only
router.post('/', authenticate, requireAdmin, async (req, res: Response, next: NextFunction) => {
  try {
    const { module_id, course_id, title, description, content, pdf_url, order_index, duration_minutes, is_free_preview } = req.body
    const { data, error } = await supabase.from('lessons').insert({ module_id, course_id, title, description, content, pdf_url, order_index: order_index || 0, duration_minutes, is_free_preview: is_free_preview || false }).select().single()
    if (error) throw error
    res.status(201).json({ data })
  } catch (err) { next(err) }
})

// PUT /api/lessons/:id - admin only
router.put('/:id', authenticate, requireAdmin, async (req, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase.from('lessons').update(req.body).eq('id', req.params.id).select().single()
    if (error) throw error
    res.json({ data })
  } catch (err) { next(err) }
})

// DELETE /api/lessons/:id - admin only
router.delete('/:id', authenticate, requireAdmin, async (req, res: Response, next: NextFunction) => {
  try {
    await supabase.from('lessons').delete().eq('id', req.params.id)
    res.json({ message: 'Aula excluída' })
  } catch (err) { next(err) }
})

// POST /api/lessons/:id/progress - mark lesson as complete
router.post('/:id/progress', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { course_id } = req.body
    const { error } = await supabase.from('lesson_progress').upsert({
      student_id: req.userId!, lesson_id: req.params.id, course_id, completed: true, completed_at: new Date().toISOString(),
    })
    if (error) throw error
    res.json({ message: 'Progresso registrado' })
  } catch (err) { next(err) }
})

export default router
