import { Router } from 'express'
import type { Response, NextFunction } from 'express'
import { authenticate, requireAdmin, type AuthRequest } from '../middleware/auth'
import { supabase } from '../config/supabase'

const router = Router()

// GET /api/evaluations/my
router.get('/my', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase
      .from('evaluations')
      .select('*, metric:evaluation_metrics(name, type, max_score), course:courses(title)')
      .eq('student_id', req.userId!)
      .order('evaluated_at', { ascending: false })
    res.json({ data })
  } catch (err) { next(err) }
})

// GET /api/evaluations/metrics/:courseId - metrics for a course
router.get('/metrics/:courseId', authenticate, async (_req, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase.from('evaluation_metrics').select('*').eq('course_id', _req.params.courseId).order('order_index')
    res.json({ data })
  } catch (err) { next(err) }
})

// POST /api/evaluations/metrics - admin, create metric
router.post('/metrics', authenticate, requireAdmin, async (req, res: Response, next: NextFunction) => {
  try {
    const { course_id, name, description, max_score, weight, type, order_index } = req.body
    const { data, error } = await supabase.from('evaluation_metrics').insert({ course_id, name, description, max_score: max_score || 10, weight: weight || 1, type: type || 'practical', order_index: order_index || 0 }).select().single()
    if (error) throw error
    res.status(201).json({ data })
  } catch (err) { next(err) }
})

// POST /api/evaluations - admin, register evaluation
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { student_id, course_id, metric_id, score, feedback } = req.body
    const { data: enrollment } = await supabase.from('enrollments').select('id').eq('student_id', student_id).eq('course_id', course_id).single()
    if (!enrollment) return res.status(400).json({ message: 'Aluno não matriculado' })
    const { data, error } = await supabase.from('evaluations').upsert({
      student_id, course_id, metric_id, enrollment_id: enrollment.id, score, feedback, evaluated_by: req.userId, evaluated_at: new Date().toISOString(),
    }).select().single()
    if (error) throw error
    res.json({ data, message: 'Avaliação registrada' })
  } catch (err) { next(err) }
})

// GET /api/evaluations - admin all
router.get('/', authenticate, requireAdmin, async (_req, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase.from('evaluations').select('*, student:user_profiles(name), course:courses(title), metric:evaluation_metrics(name, type, max_score)').order('evaluated_at', { ascending: false })
    res.json({ data })
  } catch (err) { next(err) }
})

export default router
