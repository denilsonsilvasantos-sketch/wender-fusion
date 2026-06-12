import type { Request, Response, NextFunction } from 'express'
import { supabase } from '../config/supabase'

export interface AuthRequest extends Request {
  userId?: string
  userRole?: string
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido' })
  }

  const token = authHeader.split(' ')[1]
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    return res.status(401).json({ message: 'Token inválido ou expirado' })
  }

  // Get user role from profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  req.userId = user.id
  req.userRole = profile?.role || 'student'
  next()
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.userRole !== 'admin' && req.userRole !== 'instructor') {
    return res.status(403).json({ message: 'Acesso negado. Apenas administradores.' })
  }
  next()
}
