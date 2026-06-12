import { Router } from 'express'
import authRoutes from './auth'
import userRoutes from './users'
import courseRoutes from './courses'
import lessonRoutes from './lessons'
import enrollmentRoutes from './enrollments'
import paymentRoutes from './payments'
import certificateRoutes from './certificates'
import evaluationRoutes from './evaluations'
import attendanceRoutes from './attendance'
import gamificationRoutes from './gamification'
import calculatorRoutes from './calculator'
import serviceRoutes from './services'
import uploadRoutes from './upload'
import empregabilidadeRoutes from './empregabilidade'
import crmRoutes from './crm'
import consultingRoutes from './consulting'

export const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/courses', courseRoutes)
router.use('/lessons', lessonRoutes)
router.use('/enrollments', enrollmentRoutes)
router.use('/payments', paymentRoutes)
router.use('/certificates', certificateRoutes)
router.use('/evaluations', evaluationRoutes)
router.use('/attendance', attendanceRoutes)
router.use('/gamification', gamificationRoutes)
router.use('/calculator', calculatorRoutes)
router.use('/services', serviceRoutes)
router.use('/upload', uploadRoutes)
router.use('/empregabilidade', empregabilidadeRoutes)
router.use('/crm', crmRoutes)
router.use('/consulting', consultingRoutes)
