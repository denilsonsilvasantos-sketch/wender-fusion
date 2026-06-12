import { Router } from 'express'
import type { Response, NextFunction } from 'express'
import { authenticate, requireAdmin, type AuthRequest } from '../middleware/auth'
import { supabase } from '../config/supabase'

const router = Router()

function generateCertNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `WF-${year}-${random}`
}

// GET /api/certificates/my
router.get('/my', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase
      .from('certificates')
      .select('*, course:courses(title)')
      .eq('student_id', req.userId!)
      .eq('revoked', false)
      .order('issued_at', { ascending: false })
    res.json({ data })
  } catch (err) { next(err) }
})

// POST /api/certificates/generate-eligible - admin, auto-generate for all eligible
router.post('/generate-eligible', authenticate, requireAdmin, async (_req, res: Response, next: NextFunction) => {
  try {
    const { data: completedEnrollments } = await supabase
      .from('enrollments')
      .select('id, student_id, course_id')
      .eq('status', 'active')

    if (!completedEnrollments) return res.json({ count: 0 })

    let count = 0
    for (const enrollment of completedEnrollments) {
      // Check if already has certificate
      const { data: existing } = await supabase
        .from('certificates')
        .select('id')
        .eq('student_id', enrollment.student_id)
        .eq('course_id', enrollment.course_id)
        .single()
      if (existing) continue

      // Check eligibility
      const { data: eligible } = await supabase
        .rpc('check_certificate_eligibility', {
          p_student_id: enrollment.student_id,
          p_course_id: enrollment.course_id,
        })

      if (eligible) {
        const { error } = await supabase.from('certificates').insert({
          student_id: enrollment.student_id,
          course_id: enrollment.course_id,
          enrollment_id: enrollment.id,
          certificate_number: generateCertNumber(),
        })
        if (!error) {
          count++
          await supabase.from('enrollments').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('id', enrollment.id)
        }
      }
    }

    res.json({ count, message: `${count} certificado(s) gerado(s)` })
  } catch (err) { next(err) }
})

// GET /api/certificates - admin all
router.get('/', authenticate, requireAdmin, async (_req, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase
      .from('certificates')
      .select('*, student:user_profiles(name), course:courses(title)')
      .order('issued_at', { ascending: false })
    res.json({ data })
  } catch (err) { next(err) }
})

// PATCH /api/certificates/:id/revoke
router.patch('/:id/revoke', authenticate, requireAdmin, async (req, res: Response, next: NextFunction) => {
  try {
    const { reason } = req.body
    await supabase.from('certificates').update({
      revoked: true, revoked_at: new Date().toISOString(), revoked_reason: reason,
    }).eq('id', req.params.id)
    res.json({ message: 'Certificado revogado' })
  } catch (err) { next(err) }
})

// GET /api/certificates/validate/:code — público, sem auth
router.get('/validate/:code', async (req, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select(`
        id,
        certificate_number,
        validation_code,
        issued_at,
        revoked,
        revoked_reason,
        student:user_profiles(name),
        course:courses(title, duration_hours)
      `)
      .eq('validation_code', req.params.code)
      .maybeSingle()

    if (error) throw error
    if (!data) return res.status(404).json({ message: 'Certificado não encontrado' })

    res.json({
      data: {
        valid: !data.revoked,
        certificate_number: data.certificate_number,
        validation_code: data.validation_code,
        student_name: (data.student as { name: string } | null)?.name,
        course_title: (data.course as { title: string } | null)?.title,
        course_hours: (data.course as { duration_hours: number } | null)?.duration_hours,
        issued_at: data.issued_at,
        revoked: data.revoked,
        revoked_reason: data.revoked ? data.revoked_reason : undefined,
      },
    })
  } catch (err) { next(err) }
})

export default router
