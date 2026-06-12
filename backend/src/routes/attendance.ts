import { Router } from 'express'
import type { Response, NextFunction } from 'express'
import { authenticate, requireAdmin, type AuthRequest } from '../middleware/auth'
import { supabase } from '../config/supabase'

const router = Router()

// GET /api/attendance/my
router.get('/my', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase
      .from('attendance')
      .select('*, lesson:lessons(title), course:courses(title)')
      .eq('student_id', req.userId!)
      .order('recorded_at', { ascending: false })
    res.json({ data })
  } catch (err) { next(err) }
})

// POST /api/attendance/bulk - admin, save attendance for a lesson
router.post('/bulk', authenticate, requireAdmin, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { lesson_id, course_id, records } = req.body
    const upsertRecords = records.map((r: { student_id: string; present: boolean; justification?: string }) => ({
      student_id: r.student_id, lesson_id, course_id, present: r.present, justification: r.justification, recorded_by: req.userId,
    }))
    const { error } = await supabase.from('attendance').upsert(upsertRecords)
    if (error) throw error
    res.json({ message: 'Presença salva com sucesso' })
  } catch (err) { next(err) }
})

// GET /api/attendance/lesson/:lessonId - admin, attendance for a lesson
router.get('/lesson/:lessonId', authenticate, requireAdmin, async (req, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase.from('attendance').select('*, student:user_profiles(name)').eq('lesson_id', req.params.lessonId)
    res.json({ data })
  } catch (err) { next(err) }
})

export default router
