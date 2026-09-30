import express from 'express'
import {
  getAll, getOne, getMe, upsertMe, create, update, remove,
  togglePin, toggleVerify,
} from './doctor.controller.js'
import upload from '../../shared/middleware/multer.middleware.js'
import { protectAdmin, protectDoctor } from '../../shared/middleware/auth.middleware.js'

const router = express.Router()

// Public
router.get('/', getAll)

// Doctor's own profile — MUST come before `/:id`
router.get('/me', protectDoctor, getMe)
router.put('/me', protectDoctor, upload.single('image'), upsertMe)

// By ID (public read)
router.get('/:id', getOne)

// Admin only
router.post('/', protectAdmin, upload.single('image'), create)
router.put('/:id', protectAdmin, upload.single('image'), update)
router.patch('/:id/pin', protectAdmin, togglePin)
router.patch('/:id/verify', protectAdmin, toggleVerify)
router.delete('/:id', protectAdmin, remove)

export default router