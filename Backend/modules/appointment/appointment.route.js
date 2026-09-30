import express from 'express'
import { create, getAll, updateStatus, remove } from './appointment.controller.js'
import { protectRole } from '../../shared/middleware/auth.middleware.js'

const router = express.Router()

router.post('/', create)
router.get('/', protectRole('admin', 'doctor'), getAll)
router.patch('/:id/status', protectRole('admin', 'doctor'), updateStatus)
router.delete('/:id', protectRole('admin', 'doctor'), remove)

export default router