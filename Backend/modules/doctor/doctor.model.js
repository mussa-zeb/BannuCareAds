import mongoose from 'mongoose'

const doctorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    name: { type: String, required: true },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    doctorrole: { type: String, default: '' },
    experience: { type: String, default: '' },
    location: { type: String, default: '' },
    fee: { type: String, default: '' },
    rating: { type: String, default: '4.5' },
    days: { type: [String], default: [] },
    timeSlots: { type: [String], default: [] },
    about: { type: String, default: '' },
    image: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
    verified: { type: Boolean, default: false },
    pro: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model('Doctor', doctorSchema)