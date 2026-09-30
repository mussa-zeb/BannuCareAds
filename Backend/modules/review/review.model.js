import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    patientName: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: '', maxlength: 1000 },
  },
  { timestamps: true }
)

reviewSchema.index({ doctorId: 1, userId: 1 }, { unique: true })

export default mongoose.model('Review', reviewSchema)