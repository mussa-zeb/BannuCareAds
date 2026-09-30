import Department from './department.model.js'
import { cloudinary } from '../../shared/config/cloudinary.config.js'

const slugify = (str) => str.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '')

/* Parse services coming as JSON string from FormData */
const parseServices = (raw) => {
  if (Array.isArray(raw)) return raw
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

export const getAll = async (_req, res) => {
  const departments = await Department.find().sort({ pinned: -1, name: 1 })
  res.json({ success: true, departments })
}

export const getOne = async (req, res) => {
  const dept = await Department.findById(req.params.id)
  if (!dept) return res.status(404).json({ success: false, msg: 'Department not found' })
  res.json({ success: true, department: dept })
}

export const create = async (req, res) => {
  try {
    const { name, description, pinned, tagline, heroTitle, heroText } = req.body
    if (!name) return res.status(400).json({ success: false, msg: 'Name is required' })

    const exists = await Department.findOne({ name })
    if (exists) return res.status(409).json({ success: false, msg: 'Department already exists' })

    const doc = {
      name,
      slug: slugify(name),
      description: description || '',
      tagline: tagline || 'Your Health, Our Priority',
      heroTitle: heroTitle || '',
      heroText: heroText || '',
      services: parseServices(req.body.services),
      pinned: pinned === 'true' || pinned === true,
    }

    if (req.file) {
      doc.image = req.file.path
      doc.imagePublicId = req.file.filename
    }

    const department = await Department.create(doc)
    res.status(201).json({ success: true, department })
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message })
  }
}

export const update = async (req, res) => {
  try {
    const dept = await Department.findById(req.params.id)
    if (!dept) return res.status(404).json({ success: false, msg: 'Not found' })

    const { name, description, pinned, tagline, heroTitle, heroText } = req.body

    if (name) {
      dept.name = name
      dept.slug = slugify(name)
    }
    if (description !== undefined) dept.description = description
    if (tagline !== undefined) dept.tagline = tagline
    if (heroTitle !== undefined) dept.heroTitle = heroTitle
    if (heroText !== undefined) dept.heroText = heroText
    if (req.body.services !== undefined) dept.services = parseServices(req.body.services)
    if (pinned !== undefined) dept.pinned = pinned === 'true' || pinned === true

    if (req.file) {
      if (dept.imagePublicId) {
        try { await cloudinary.uploader.destroy(dept.imagePublicId) } catch {}
      }
      dept.image = req.file.path
      dept.imagePublicId = req.file.filename
    }

    await dept.save()
    res.json({ success: true, department: dept })
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message })
  }
}

export const remove = async (req, res) => {
  try {
    const dept = await Department.findById(req.params.id)
    if (!dept) return res.status(404).json({ success: false, msg: 'Not found' })

    if (dept.imagePublicId) {
      try { await cloudinary.uploader.destroy(dept.imagePublicId) } catch {}
    }

    await dept.deleteOne()
    res.json({ success: true, msg: 'Department deleted' })
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message })
  }
}

export const togglePin = async (req, res) => {
  const dept = await Department.findById(req.params.id)
  if (!dept) return res.status(404).json({ success: false, msg: 'Not found' })
  dept.pinned = !dept.pinned
  await dept.save()
  res.json({ success: true, department: dept })
}