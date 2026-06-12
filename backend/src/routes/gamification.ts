import { Router } from 'express'
import type { Response, NextFunction } from 'express'
import { authenticate, requireAdmin, type AuthRequest } from '../middleware/auth'
import { supabase } from '../config/supabase'

const router = Router()

// GET /api/gamification/my-points
router.get('/my-points', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { data: total } = await supabase.rpc('get_student_points', { p_student_id: req.userId! })
    const { data: logs } = await supabase.from('gamification_logs').select('*, activity:gamification_activities(name, type)').eq('student_id', req.userId!).order('logged_at', { ascending: false }).limit(20)
    res.json({ total_points: total || 0, logs })
  } catch (err) { next(err) }
})

// POST /api/gamification/log - admin logs activity for student
router.post('/log', authenticate, requireAdmin, async (req, res: Response, next: NextFunction) => {
  try {
    const { student_id, activity_id, course_id, result, notes } = req.body
    const { data: activity } = await supabase.from('gamification_activities').select('points').eq('id', activity_id).single()
    if (!activity) return res.status(404).json({ message: 'Atividade não encontrada' })
    const { data, error } = await supabase.from('gamification_logs').insert({ student_id, activity_id, course_id, points: activity.points, result, notes }).select().single()
    if (error) throw error
    res.json({ data, message: 'Atividade registrada' })
  } catch (err) { next(err) }
})

// GET /api/gamification/activities
router.get('/activities', authenticate, async (_req, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase.from('gamification_activities').select('*').order('type')
    res.json({ data })
  } catch (err) { next(err) }
})

// GET /api/gamification/leaderboard/:courseId
router.get('/leaderboard/:courseId', authenticate, async (req, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase
      .from('gamification_logs')
      .select('student_id, student:user_profiles(name, avatar_url)')
      .eq('course_id', req.params.courseId)
    // Aggregate points client-side
    const map = new Map<string, { student_id: string; name: string; avatar_url?: string; points: number }>()
    ;(data || []).forEach((log: any) => {
      const existing = map.get(log.student_id) || { student_id: log.student_id, name: log.student?.name, avatar_url: log.student?.avatar_url, points: 0 }
      existing.points += log.points
      map.set(log.student_id, existing)
    })
    const leaderboard = [...map.values()].sort((a, b) => b.points - a.points).slice(0, 10)
    res.json({ data: leaderboard })
  } catch (err) { next(err) }
})

export default router
