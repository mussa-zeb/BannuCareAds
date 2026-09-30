import express from 'express'
import { registration, login, me, logout } from './user.controller.js'
import { protect } from '../../shared/middleware/auth.middleware.js'

const router = express.Router()

router.post('/register', registration)
router.post('/login', login)
router.post('/logout', logout)
router.get('/me', protect, me)

export default router