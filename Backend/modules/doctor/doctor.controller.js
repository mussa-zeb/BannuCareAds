import Doctor from './doctor.model.js'
import Review from '../review/review.model.js'
import mongoose from 'mongoose'
import { cloudinary } from '../../shared/config/cloudinary.config.js'

const attachRatings = async (doctors) => {
  if (!doctors.length) return doctors
  const ids = doctors.map((d) => d._id)

  const aggs = await Review.aggregate([
    { $match: { doctorId: { $in: ids } } },
    { $group: { _id: '$doctorId', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ])

  const map = new Map(aggs.map((a) => [String(a._id), a]))

  return doctors.map((d) => {
    const doc = d.toObject ? d.toObject() : d
    const a = map.get(String(doc._id))
    doc.averageRating = a ? Number(a.avg.toFixed(1)) : 0
    doc.totalReviews = a ? a.count : 0
    return doc
  })
}

/* Sort: pinned first → then avg rating desc → then pro → then newest */
const sortDoctors = (list) =>
  [...list].sort((a, b) => {
    if (a.pinned !== b.pinned) return b.pinned ? 1 : -1
    if (b.averageRating !== a.averageRating) return b.averageRating - a.averageRating
    if (a.pro !== b.pro) return b.pro ? 1 : -1
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  })

export const getAll = async (req, res) => {
  try {
    const { department, location, day, time, q } = req.query
    const filter = {}
    if (department) filter.department = department
    if (location) filter.location = location
    if (day) filter.days = day
    if (time) filter.timeSlots = time
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { doctorrole: { $regex: q, $options: 'i' } },
      ]
    }

    const doctors = await Doctor.find(filter).populate('department', 'name slug image')
    const withRatings = await attachRatings(doctors)
    const sorted = sortDoctors(withRatings)

    res.json({ success: true, doctors: sorted })
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message })
  }
}

export const getOne = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('department', 'name slug image')
    if (!doctor) return res.status(404).json({ success: false, msg: 'Doctor not found' })
    const [withRating] = await attachRatings([doctor])
    res.json({ success: true, doctor: withRating })
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message })
  }
}

export const getMe = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id }).populate('department', 'name slug image')
    if (!doctor) return res.json({ success: true, doctor: null })
    const [withRating] = await attachRatings([doctor])
    res.json({ success: true, doctor: withRating })
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message })
  }
}

export const upsertMe = async (req, res) => {
  try {
    const body = { ...req.body, userId: req.user.id }
    if (typeof body.days === 'string')
      body.days = body.days.split(',').map((s) => s.trim()).filter(Boolean)
    if (typeof body.timeSlots === 'string')
      body.timeSlots = body.timeSlots.split(',').map((s) => s.trim()).filter(Boolean)
    if (!body.department) delete body.department
    delete body.rating
    delete body.verified
    delete body.pro
    delete body.pinned

    const existing = await Doctor.findOne({ userId: req.user.id })
    if (req.file) {
      if (existing?.imagePublicId) {
        try { await cloudinary.uploader.destroy(existing.imagePublicId) } catch {}
      }
      body.image = req.file.path
      body.imagePublicId = req.file.filename
    }

    let doctor
    if (existing) {
      Object.assign(existing, body)
      doctor = await existing.save()
    } else {
      doctor = await Doctor.create(body)
    }

    const populated = await doctor.populate('department', 'name slug image')
    res.json({ success: true, doctor: populated })
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message })
  }
}

export const create = async (req, res) => {
  try {
    const body = { ...req.body }
    if (typeof body.days === 'string')
      body.days = body.days.split(',').map((s) => s.trim()).filter(Boolean)
    if (typeof body.timeSlots === 'string')
      body.timeSlots = body.timeSlots.split(',').map((s) => s.trim()).filter(Boolean)
    body.verified = body.verified === 'true' || body.verified === true
    body.pro = body.pro === 'true' || body.pro === true
    body.pinned = body.pinned === 'true' || body.pinned === true
    if (req.file) {
      body.image = req.file.path
      body.imagePublicId = req.file.filename
    }
    const doctor = await Doctor.create(body)
    res.status(201).json({ success: true, doctor })
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message })
  }
}

export const update = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
    if (!doctor) return res.status(404).json({ success: false, msg: 'Doctor not found' })

    const body = { ...req.body }
    if (typeof body.days === 'string')
      body.days = body.days.split(',').map((s) => s.trim()).filter(Boolean)
    if (typeof body.timeSlots === 'string')
      body.timeSlots = body.timeSlots.split(',').map((s) => s.trim()).filter(Boolean)
    if (body.verified !== undefined) body.verified = body.verified === 'true' || body.verified === true
    if (body.pro !== undefined) body.pro = body.pro === 'true' || body.pro === true
    if (body.pinned !== undefined) body.pinned = body.pinned === 'true' || body.pinned === true
    delete body.rating

    if (req.file) {
      if (doctor.imagePublicId) {
        try { await cloudinary.uploader.destroy(doctor.imagePublicId) } catch {}
      }
      body.image = req.file.path
      body.imagePublicId = req.file.filename
    }

    Object.assign(doctor, body)
    await doctor.save()
    res.json({ success: true, doctor })
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message })
  }
}

export const remove = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
    if (!doctor) return res.status(404).json({ success: false, msg: 'Not found' })
    if (doctor.imagePublicId) {
      try { await cloudinary.uploader.destroy(doctor.imagePublicId) } catch {}
    }
    await doctor.deleteOne()
    res.json({ success: true, msg: 'Doctor deleted' })
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message })
  }
}

export const togglePin = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id)
  if (!doctor) return res.status(404).json({ success: false, msg: 'Not found' })
  doctor.pinned = !doctor.pinned
  await doctor.save()
  res.json({ success: true, doctor })
}

export const toggleVerify = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id)
  if (!doctor) return res.status(404).json({ success: false, msg: 'Not found' })
  doctor.verified = !doctor.verified
  await doctor.save()
  res.json({ success: true, doctor })
}