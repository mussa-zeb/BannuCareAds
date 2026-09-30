import Review from './review.model.js'
import User from '../user/user.model.js'
import mongoose from 'mongoose'

/* ─── Public: list reviews for a doctor + average ─── */
export const getForDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params

    // Populate the userId to get the CURRENT user name
    const raw = await Review.find({ doctorId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .lean()

    // Always override patientName with the live user name
    const reviews = raw.map((r) => ({
      ...r,
      patientName:
        r.userId?.name?.trim() ||
        r.patientName?.trim() ||
        'Patient',
      // Drop the userId object payload, keep just the id for the frontend
      userId: r.userId?._id || r.userId,
    }))

    const agg = await Review.aggregate([
      { $match: { doctorId: new mongoose.Types.ObjectId(doctorId) } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ])

    const averageRating = agg[0]?.avg ? Number(agg[0].avg.toFixed(1)) : 0
    const totalReviews = agg[0]?.count || 0

    res.json({ success: true, reviews, averageRating, totalReviews })
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message })
  }
}

/* ─── Logged-in user creates their review (no updates) ─── */
export const upsertReview = async (req, res) => {
  try {
    const { doctorId } = req.params
    const { rating, comment } = req.body

    const numericRating = Number(rating)
    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ success: false, msg: 'Rating must be between 1 and 5' })
    }

    const existing = await Review.findOne({ doctorId, userId: req.user.id })
    if (existing) {
      return res.status(409).json({
        success: false,
        msg: 'You have already reviewed this doctor',
        review: existing,
      })
    }

    // Snapshot the name now (also used as fallback if user is later deleted)
    const user = await User.findById(req.user.id).select('name')
    const patientName = user?.name?.trim() || 'Patient'

    const review = await Review.create({
      doctorId,
      userId: req.user.id,
      patientName,
      rating: numericRating,
      comment: comment || '',
    })

    res.status(201).json({ success: true, review })
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message })
  }
}

/* ─── Delete (admin only) ─── */
export const removeReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id)
    if (!review) return res.status(404).json({ success: false, msg: 'Review not found' })
    res.json({ success: true, msg: 'Review deleted' })
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message })
  }
}