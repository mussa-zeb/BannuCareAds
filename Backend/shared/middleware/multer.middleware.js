import multer from 'multer'
import { cloudinary } from '../config/cloudinary.config.js'

/* ─── 1. Multer keeps the file in RAM (not disk) ─── */
const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
})

/* ─── 2. Helper: stream the buffer up to Cloudinary ─── */
const streamToCloudinary = (buffer, folder = 'bannucare') =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => (err ? reject(err) : resolve(result))
    )
    stream.end(buffer)
  })

/* ─── 3. Wrapper middleware ───
 * Runs multer first (parses the file into req.file.buffer),
 * then uploads it to Cloudinary and writes the URL + public_id
 * back onto req.file.path / req.file.filename so that existing
 * controllers work without any change.
 */
const upload = {
  single: (fieldName) => (req, res, next) => {
    memoryUpload.single(fieldName)(req, res, async (err) => {
      if (err) return next(err)
      if (!req.file) return next() // no file sent, that's fine

      try {
        const result = await streamToCloudinary(req.file.buffer)
        req.file.path = result.secure_url       // e.g. https://res.cloudinary.com/...
        req.file.filename = result.public_id    // e.g. bannucare/1727...
        next()
      } catch (uploadErr) {
        next(uploadErr)
      }
    })
  },

  array: (fieldName, maxCount) => (req, res, next) => {
    memoryUpload.array(fieldName, maxCount)(req, res, async (err) => {
      if (err) return next(err)
      if (!req.files?.length) return next()

      try {
        const uploaded = await Promise.all(
          req.files.map(async (f) => {
            const result = await streamToCloudinary(f.buffer)
            f.path = result.secure_url
            f.filename = result.public_id
            return f
          })
        )
        req.files = uploaded
        next()
      } catch (uploadErr) {
        next(uploadErr)
      }
    })
  },
}

export default upload