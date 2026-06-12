import { Router } from 'express'
import type { Response, NextFunction } from 'express'
import { authenticate, requireAdmin, type AuthRequest } from '../middleware/auth'
import { supabase } from '../config/supabase'
import axios from 'axios'

const router = Router()
router.use(authenticate, requireAdmin)

const asaas = axios.create({
  baseURL: process.env.ASAAS_BASE_URL || 'https://sandbox.asaas.com/api/v3',
  headers: { access_token: process.env.ASAAS_API_KEY },
})

// ============================================================
// CLIENTS
// ============================================================
router.get('/clients', async (_req, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase.from('service_clients').select('*').order('name')
    res.json({ data })
  } catch (err) { next(err) }
})

router.post('/clients', async (req, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase.from('service_clients').insert(req.body).select().single()
    if (error) throw error
    res.status(201).json({ data, message: 'Cliente cadastrado' })
  } catch (err) { next(err) }
})

router.put('/clients/:id', async (req, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase.from('service_clients').update(req.body).eq('id', req.params.id).select().single()
    res.json({ data })
  } catch (err) { next(err) }
})

// ============================================================
// QUOTATIONS
// ============================================================
router.get('/quotations', async (_req, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase.from('quotations').select('*, client:service_clients(name, email), items:quotation_items(*)').order('created_at', { ascending: false })
    res.json({ data })
  } catch (err) { next(err) }
})

router.post('/quotations', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { items, ...quotationData } = req.body
    const { data: quotation, error } = await supabase.from('quotations').insert({ ...quotationData, created_by: req.userId }).select().single()
    if (error) throw error
    if (items?.length) {
      const itemsWithId = items.map((item: Record<string, unknown>, i: number) => ({ ...item, quotation_id: quotation.id, order_index: i }))
      await supabase.from('quotation_items').insert(itemsWithId)
    }
    const total = items?.reduce((s: number, i: { unit_price: number; quantity: number }) => s + i.unit_price * i.quantity, 0) || 0
    await supabase.from('quotations').update({ total_amount: total }).eq('id', quotation.id)
    res.status(201).json({ data: { ...quotation, total_amount: total }, message: 'Cotação criada' })
  } catch (err) { next(err) }
})

router.patch('/quotations/:id/status', async (req, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase.from('quotations').update({ status: req.body.status }).eq('id', req.params.id).select().single()
    res.json({ data })
  } catch (err) { next(err) }
})

// ============================================================
// SERVICE ORDERS
// ============================================================
router.get('/orders', async (_req, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase.from('service_orders').select('*, client:service_clients(name, phone, email), quotation:quotations(id, title)').order('created_at', { ascending: false })
    res.json({ data })
  } catch (err) { next(err) }
})

router.post('/orders', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const total = (req.body.labor_cost || 0) + (req.body.materials_cost || 0)
    const { data, error } = await supabase.from('service_orders').insert({ ...req.body, total_cost: total, os_number: '', created_by: req.userId }).select().single()
    if (error) throw error
    res.status(201).json({ data, message: 'O.S. criada com sucesso' })
  } catch (err) { next(err) }
})

router.put('/orders/:id', async (req, res: Response, next: NextFunction) => {
  try {
    const total = (req.body.labor_cost || 0) + (req.body.materials_cost || 0)
    const { data } = await supabase.from('service_orders').update({ ...req.body, total_cost: total }).eq('id', req.params.id).select().single()
    res.json({ data })
  } catch (err) { next(err) }
})

router.patch('/orders/:id/status', async (req, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body
    const updates: Record<string, unknown> = { status }
    if (status === 'in_progress') updates.started_at = new Date().toISOString()
    if (status === 'completed') updates.completed_at = new Date().toISOString()
    const { data } = await supabase.from('service_orders').update(updates).eq('id', req.params.id).select().single()
    res.json({ data, message: 'Status atualizado' })
  } catch (err) { next(err) }
})

// POST /api/services/orders/:id/invoice - generate invoice via Asaas
router.post('/orders/:id/invoice', async (req, res: Response, next: NextFunction) => {
  try {
    const { data: order } = await supabase.from('service_orders').select('*, client:service_clients(*)').eq('id', req.params.id).single()
    if (!order) return res.status(404).json({ message: 'O.S. não encontrada' })

    const client = (order as any).client
    let asaasCustomerId = client.asaas_customer_id
    if (!asaasCustomerId) {
      const { data: customer } = await asaas.post('/customers', { name: client.name, email: client.email, phone: client.phone })
      asaasCustomerId = customer.id
      await supabase.from('service_clients').update({ asaas_customer_id: asaasCustomerId }).eq('id', client.id)
    }

    const { paymentMethod = 'PIX', dueDate } = req.body
    const { data: asaasPayment } = await asaas.post('/payments', {
      customer: asaasCustomerId,
      billingType: paymentMethod,
      value: order.total_cost || 0,
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: `O.S. ${(order as any).os_number}: ${order.title}`,
    })

    await supabase.from('service_invoices').insert({
      service_order_id: order.id, client_id: client.id, asaas_payment_id: asaasPayment.id,
      amount: order.total_cost || 0, payment_method: paymentMethod.toLowerCase(), status: 'pending',
      due_date: asaasPayment.dueDate, bank_slip_url: asaasPayment.bankSlipUrl, pix_code: asaasPayment.pixQrCode?.payload,
    })

    res.json({ message: 'Cobrança gerada', bankSlipUrl: asaasPayment.bankSlipUrl, pixCode: asaasPayment.pixQrCode?.payload })
  } catch (err) { next(err) }
})

export default router
