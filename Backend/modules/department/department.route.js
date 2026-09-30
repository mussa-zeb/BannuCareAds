import express from 'express'
import { getAll, getOne, create, update, remove, togglePin } from './department.controller.js'
import upload from '../../shared/middleware/multer.middleware.js'
import { protectAdmin } from '../../shared/middleware/auth.middleware.js'

const router = express.Router()

router.get('/', getAll)
router.get('/:id', getOne)
router.post('/', protectAdmin, upload.single('image'), create)
router.put('/:id', protectAdmin, upload.single('image'), update)
router.patch('/:id/pin', protectAdmin, togglePin)
router.delete('/:id', protectAdmin, remove)

export default router