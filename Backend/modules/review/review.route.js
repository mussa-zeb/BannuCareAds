import express from 'express'
import { getForDoctor, upsertReview, removeReview } from './review.controller.js'
import { protect, protectAdmin } from '../../shared/middleware/auth.middleware.js'

const router = express.Router()

// Public — anyone can read reviews for a doctor
router.get('/doctor/:doctorId', getForDoctor)

// Logged-in user creates or updates their own review
router.post('/doctor/:doctorId', protect, upsertReview)

// Admin only — delete a review
router.delete('/:id', protectAdmin, removeReview)

export default router