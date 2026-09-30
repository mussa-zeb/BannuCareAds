import mongoose from 'mongoose'

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' }, // short — used on cards

    // ─── New: content for the department detail page ───
    tagline: { type: String, default: 'Your Health, Our Priority' },
    heroTitle: { type: String, default: '' }, // "Expert care for your lungs"
    heroText: { type: String, default: '' },  // the paragraph
    services: [
      {
        title: { type: String, default: '' },
        description: { type: String, default: '' },
      },
    ],

    image: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
    pinned: { type: Boolean, default: false },
    appointmentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('Department', departmentSchema)