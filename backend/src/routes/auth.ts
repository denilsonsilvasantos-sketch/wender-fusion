import { Router } from 'express'
import type { Response, NextFunction } from 'express'
import { authenticate, type AuthRequest } from '../middleware/auth'
import { supabase } from '../config/supabase'

const router = Router()

// GET /api/auth/me - get current user profile
router.get('/me', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', req.userId!)
      .single()
    if (error) throw error
    res.json({ data })
  } catch (err) { next(err) }
})

export default router
