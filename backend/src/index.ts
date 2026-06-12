import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { router } from './routes'
import { errorHandler } from './middleware/errorHandler'

const app = express()
const PORT = process.env.PORT || 3000

// Security
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: 'Muitas requisições. Tente novamente em 15 minutos.' },
}))

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

// API routes
app.use('/api', router)

// Error handler (must be last)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})

export default app
