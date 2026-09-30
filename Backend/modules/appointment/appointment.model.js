import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    location: { type: String, default: '' },
    date: { type: String, required: true },
    time: { type: String, required: true },
    message: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  },
  { timestamps: true }
)

export default mongoose.model('Appointment', appointmentSchema)