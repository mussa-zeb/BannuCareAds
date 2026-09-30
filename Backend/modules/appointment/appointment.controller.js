import Appointment from './appointment.model.js'
import Doctor from '../doctor/doctor.model.js'

export const create = async (req, res) => {
  try {
    const appt = await Appointment.create(req.body)
    res.status(201).json({ success: true, appointment: appt })
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message })
  }
}

export const getAll = async (req, res) => {
  try {
    const filter = {}

    // If a doctor is logged in, try to scope to their own appointments
    if (req.user?.role === 'doctor') {
      const profile = await Doctor.findOne({ userId: req.user.id })
      if (profile) {
        filter.doctor = profile._id
      }
      // If no linked profile exists yet, fall back to showing all
      // (remove this fallback once you start linking doctor accounts)
    }

    const appointments = await Appointment.find(filter)
      .populate('doctor', 'name image doctorrole')
      .populate('department', 'name')
      .sort({ createdAt: -1 })

    res.json({ success: true, appointments })
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message })
  }
}

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, msg: 'Invalid status' })
    }

    const appt = await Appointment.findById(req.params.id)
    if (!appt) return res.status(404).json({ success: false, msg: 'Appointment not found' })

    // Doctor can only touch their own appointments (once linked)
    if (req.user?.role === 'doctor') {
      const profile = await Doctor.findOne({ userId: req.user.id })
      if (profile && String(appt.doctor) !== String(profile._id)) {
        return res.status(403).json({ success: false, msg: 'Not your appointment' })
      }
    }

    appt.status = status
    await appt.save()

    res.json({ success: true, appointment: appt })
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message })
  }
}

export const remove = async (req, res) => {
  try {
    const appt = await Appointment.findByIdAndDelete(req.params.id)
    if (!appt) return res.status(404).json({ success: false, msg: 'Appointment not found' })
    res.json({ success: true, msg: 'Appointment deleted' })
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message })
  }
}