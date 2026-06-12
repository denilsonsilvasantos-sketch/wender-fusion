import { Router } from 'express'
import type { Response, NextFunction } from 'express'
import { authenticate, requireAdmin, type AuthRequest } from '../middleware/auth'
import { supabase } from '../config/supabase'

const router = Router()

// GET /api/enrollments/my
router.get('/my', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase
      .from('enrollments')
      .select('*, course:courses(id, title, description, thumbnail_url, duration_hours, level, min_attendance_percentage, min_grade)')
      .eq('student_id', req.userId!)
      .order('enrolled_at', { ascending: false })
    res.json({ data })
  } catch (err) { next(err) }
})

// GET /api/enrollments/my/:courseId/progress
router.get('/my/:courseId/progress', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const [{ data: progress }, { data: attendance }, { data: grade }] = await Promise.all([
      supabase.rpc('get_course_progress', { p_student_id: req.userId!, p_course_id: req.params.courseId }),
      supabase.rpc('get_attendance_percentage', { p_student_id: req.userId!, p_course_id: req.params.courseId }),
      supabase.rpc('get_student_average_grade', { p_student_id: req.userId!, p_course_id: req.params.courseId }),
    ])
    res.json({ progress, attendance_percentage: attendance, average_grade: grade })
  } catch (err) { next(err) }
})

// GET /api/enrollments - admin all
router.get('/', authenticate, requireAdmin, async (_req, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase
      .from('enrollments')
      .select('*, student:user_profiles(name, email), course:courses(title)')
      .order('enrolled_at', { ascending: false })
    res.json({ data })
  } catch (err) { next(err) }
})

// POST /api/enrollments - admin manual enrollment
router.post('/', authenticate, requireAdmin, async (req, res: Response, next: NextFunction) => {
  try {
    const { student_id, course_id } = req.body
    const { data, error } = await supabase.from('enrollments').insert({ student_id, course_id, status: 'active' }).select().single()
    if (error) throw error
    res.status(201).json({ data, message: 'Matrícula criada' })
  } catch (err) { next(err) }
})

// PATCH /api/enrollments/:id/status
router.patch('/:id/status', authenticate, requireAdmin, async (req, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body
    const { data } = await supabase.from('enrollments').update({ status }).eq('id', req.params.id).select().single()
    res.json({ data, message: 'Status atualizado' })
  } catch (err) { next(err) }
})

export default router
