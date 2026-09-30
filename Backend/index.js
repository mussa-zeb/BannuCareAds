import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import dns from 'dns'

import dbConnection from './shared/db/dbConnection.js'
import userRoute from './modules/user/user.route.js'
import doctorRoute from './modules/doctor/doctor.route.js'
import departmentRoute from './modules/department/department.route.js'
import appointmentRoute from './modules/appointment/appointment.route.js'
import reviewRoute from './modules/review/review.route.js'

/* ───────────────────────────────────────────────
   1. Validate required env vars at startup
   ─────────────────────────────────────────────── */
const REQUIRED_ENV = [
  'MONGO_URL',
  'JWT_SECRET',
  'FRONTEND_URL',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
]

const missing = REQUIRED_ENV.filter((key) => {
  const val = process.env[key]
  return !val || !String(val).trim()
})

if (missing.length) {
  console.error('❌ Missing or empty env vars:', missing.join(', '))
  console.error('   Check your Backend/.env file.')
  process.exit(1)
}

/* ───────────────────────────────────────────────
   2. Sanitize FRONTEND_URL → allowed CORS origins
   ─────────────────────────────────────────────── */
const allowedOrigins = String(process.env.FRONTEND_URL)
  .split(',')
  .map((o) => o.trim().replace(/\/+$/, '')) // strip trailing slashes
  .filter(Boolean)

if (allowedOrigins.length === 0) {
  console.error('❌ FRONTEND_URL is empty after sanitizing.')
  process.exit(1)
}

console.log('🌐 CORS allowed origins:', allowedOrigins)

/* ───────────────────────────────────────────────
   3. Force Google DNS (helps with MongoDB Atlas SRV)
   ─────────────────────────────────────────────── */
dns.setServers(['8.8.8.8', '8.8.4.4'])

/* ───────────────────────────────────────────────
   4. Express app
   ─────────────────────────────────────────────── */
const app = express()

app.use(helmet())
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

/* ───────────────────────────────────────────────
   5. CORS — dynamic check against allowedOrigins
   ─────────────────────────────────────────────── */
app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser requests (curl, Postman, mobile apps, server-to-server)
      if (!origin) return callback(null, true)

      const cleanOrigin = origin.trim().replace(/\/+$/, '')

      if (allowedOrigins.includes(cleanOrigin)) {
        return callback(null, true)
      }

      console.warn(`🚫 CORS blocked: ${origin}`)
      return callback(new Error(`CORS: origin "${origin}" not allowed`))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

/* ───────────────────────────────────────────────
   6. Routes
   ─────────────────────────────────────────────── */
app.use('/user', userRoute)
app.use('/doctor', doctorRoute)
app.use('/department', departmentRoute)
app.use('/appointment', appointmentRoute)
app.use('/review', reviewRoute)

/* ───────────────────────────────────────────────
   7. Health check
   ─────────────────────────────────────────────── */
app.get('/', (_req, res) => {
  res.json({
    success: true,
    msg: 'BannuCare API is running',
    env: process.env.NODE_ENV || 'development',
  })
})

/* ───────────────────────────────────────────────
   8. 404 handler (must be after routes)
   ─────────────────────────────────────────────── */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    msg: `Route not found: ${req.method} ${req.originalUrl}`,
  })
})

/* ───────────────────────────────────────────────
   9. Global error handler (must be last)
   ─────────────────────────────────────────────── */
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('🔥 Server error:', err)

  // CORS error → 403, everything else → 500 (or err.status if set)
  const status = err.message?.startsWith('CORS') ? 403 : err.status || 500

  res.status(status).json({
    success: false,
    msg: err.message || 'Server error',
  })
})

/* ───────────────────────────────────────────────
   10. Start server
   ─────────────────────────────────────────────── */
const PORT = process.env.PORT || 4000

const start = async () => {
  try {
    await dbConnection()

    app.listen(PORT, () => {
      console.log(`🚀 BannuCare server running on port ${PORT}`)
    })
  } catch (err) {
    console.error('❌ Failed to start server:', err)
    process.exit(1)
  }
}

start()