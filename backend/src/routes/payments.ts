import { Router } from 'express'
import type { Response, NextFunction } from 'express'
import { authenticate, requireAdmin, type AuthRequest } from '../middleware/auth'
import { supabase } from '../config/supabase'
import { createError } from '../middleware/errorHandler'
import axios from 'axios'

const router = Router()

const asaas = axios.create({
  baseURL: process.env.ASAAS_BASE_URL || 'https://sandbox.asaas.com/api/v3',
  headers: { access_token: process.env.ASAAS_API_KEY },
})

async function getOrCreateAsaasCustomer(studentId: string): Promise<string> {
  const { data: profile } = await supabase.from('user_profiles').select('*').eq('id', studentId).single()
  if (!profile) throw createError('Perfil não encontrado', 404)

  if (profile.asaas_customer_id) return profile.asaas_customer_id

  const { data: customer } = await asaas.post('/customers', {
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
  })

  await supabase.from('user_profiles').update({ asaas_customer_id: customer.id }).eq('id', studentId)
  return customer.id
}

// POST /api/payments/create - create payment for course enrollment
router.post('/create', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { courseId, paymentMethod, installments = 1 } = req.body

    const { data: course } = await supabase.from('courses').select('*').eq('id', courseId).single()
    if (!course) return next(createError('Curso não encontrado', 404))

    // Check if already enrolled
    const { data: existingEnrollment } = await supabase
      .from('enrollments').select('id').eq('student_id', req.userId!).eq('course_id', courseId).single()
    if (existingEnrollment) return next(createError('Já matriculado neste curso', 409))

    // Create enrollment (pending)
    const { data: enrollment } = await supabase.from('enrollments').insert({
      student_id: req.userId, course_id: courseId, status: 'pending',
    }).select().single()

    const customerId = await getOrCreateAsaasCustomer(req.userId!)

    const asaasMethodMap: Record<string, string> = {
      boleto: 'BOLETO', pix: 'PIX', credit_card: 'CREDIT_CARD',
    }

    const { data: asaasPayment } = await asaas.post('/payments', {
      customer: customerId,
      billingType: asaasMethodMap[paymentMethod] || 'PIX',
      value: course.price,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: `Matrícula: ${course.title}`,
      installmentCount: paymentMethod === 'credit_card' ? installments : 1,
      installmentValue: paymentMethod === 'credit_card' ? course.price / installments : course.price,
    })

    const { data: payment } = await supabase.from('payments').insert({
      student_id: req.userId,
      enrollment_id: enrollment?.id,
      asaas_payment_id: asaasPayment.id,
      asaas_customer_id: customerId,
      amount: course.price,
      payment_method: paymentMethod,
      status: 'pending',
      due_date: asaasPayment.dueDate,
      bank_slip_url: asaasPayment.bankSlipUrl,
      pix_code: asaasPayment.pixQrCode?.payload,
      description: `Matrícula: ${course.title}`,
      installment_count: installments,
    }).select().single()

    res.status(201).json({
      data: payment,
      bankSlipUrl: asaasPayment.bankSlipUrl,
      pixCode: asaasPayment.pixQrCode?.payload,
      message: 'Cobrança criada com sucesso',
    })
  } catch (err) { next(err) }
})

// POST /api/payments/webhook - Asaas webhook
router.post('/webhook', async (req, res: Response, next: NextFunction) => {
  try {
    const { event, payment } = req.body
    if (!payment?.id) return res.sendStatus(200)

    const statusMap: Record<string, string> = {
      PAYMENT_CONFIRMED: 'confirmed',
      PAYMENT_RECEIVED: 'received',
      PAYMENT_OVERDUE: 'overdue',
      PAYMENT_DELETED: 'cancelled',
      PAYMENT_REFUNDED: 'refunded',
    }

    const newStatus = statusMap[event]
    if (!newStatus) return res.sendStatus(200)

    const { data: paymentRecord } = await supabase
      .from('payments').select('*, enrollment:enrollments(id, course_id, student_id)')
      .eq('asaas_payment_id', payment.id).single()

    if (!paymentRecord) return res.sendStatus(200)

    await supabase.from('payments').update({
      status: newStatus,
      paid_at: ['confirmed', 'received'].includes(newStatus) ? new Date().toISOString() : null,
    }).eq('asaas_payment_id', payment.id)

    // Activate enrollment if paid
    if (['confirmed', 'received'].includes(newStatus) && paymentRecord.enrollment_id) {
      await supabase.from('enrollments').update({ status: 'active' }).eq('id', paymentRecord.enrollment_id)
    }

    res.sendStatus(200)
  } catch (err) { next(err) }
})

// GET /api/payments/my - student payments
router.get('/my', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase.from('payments').select('*').eq('student_id', req.userId!).order('created_at', { ascending: false })
    res.json({ data })
  } catch (err) { next(err) }
})

// GET /api/payments - admin all
router.get('/', authenticate, requireAdmin, async (_req, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase.from('payments').select('*, student:user_profiles(name, email)').order('created_at', { ascending: false })
    res.json({ data })
  } catch (err) { next(err) }
})

export default router
