import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from './user.model.js'

const TOKEN_NAME = 'BannuCare'

const isProd = process.env.NODE_ENV === 'production'
const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: isProd ? 'none' : 'lax',
  secure: isProd,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
}

const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

/* ────────────────────────────────────────────
   REGISTER
   ──────────────────────────────────────────── */
export async function registration(req, res) {
  try {
    const { name, email, password, role = 'user' } = req.body

    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        msg: 'Please enter your full name',
        field: 'name',
      })
    }
    if (!email || !String(email).trim()) {
      return res.status(400).json({
        success: false,
        msg: 'Please enter your email address',
        field: 'email',
      })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(String(email).trim())) {
      return res.status(400).json({
        success: false,
        msg: 'Please enter a valid email address',
        field: 'email',
      })
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        msg: 'Please enter a password',
        field: 'password',
      })
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        msg: 'Password must be at least 6 characters',
        field: 'password',
      })
    }

    const cleanEmail = String(email).trim().toLowerCase()

    const existingEmail = await User.findOne({ email: cleanEmail })
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        msg: 'This email is already registered',
        field: 'email',
      })
    }

    if (role === 'admin') {
      const existingAdmin = await User.findOne({ role: 'admin' })
      if (existingAdmin) {
        return res.status(403).json({
          success: false,
          msg: 'An admin account already exists. Only one admin is allowed.',
          field: 'role',
        })
      }
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      name: String(name).trim(),
      email: cleanEmail,
      password: hashPassword,
      role,
    })

    const token = signToken(user)
    res.cookie(TOKEN_NAME, token, COOKIE_OPTS)

    return res.status(201).json({
      success: true,
      msg: 'Account created successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message })
  }
}

/* ────────────────────────────────────────────
   LOGIN — no role disclosure
   ──────────────────────────────────────────── */
export async function login(req, res) {
  try {
    const { email, password, role } = req.body

    if (!email || !String(email).trim()) {
      return res.status(400).json({
        success: false,
        msg: 'Please enter your email address',
        field: 'email',
      })
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        msg: 'Please enter your password',
        field: 'password',
      })
    }
    if (!role) {
      return res.status(400).json({
        success: false,
        msg: 'Please select a role',
        field: 'role',
      })
    }

    const cleanEmail = String(email).trim().toLowerCase()

    // Find the user by email
    const user = await User.findOne({ email: cleanEmail })

    // ── Email doesn't exist ──
    if (!user) {
      return res.status(401).json({
        success: false,
        msg: 'No account found with this email',
        field: 'email',
      })
    }

    // ── Role mismatch: message does NOT reveal the actual role ──
    if (user.role !== role) {
      return res.status(401).json({
        success: false,
        msg: 'The selected role does not match this account',
        field: 'role',
      })
    }

    // ── Wrong password ──
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
      return res.status(401).json({
        success: false,
        msg: 'Incorrect password',
        field: 'password',
      })
    }

    // ── Success ──
    const token = signToken(user)
    res.cookie(TOKEN_NAME, token, COOKIE_OPTS)

    return res.json({
      success: true,
      msg: 'Logged in successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message })
  }
}

export async function me(req, res) {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) return res.status(401).json({ success: false, msg: 'Not authenticated' })
    return res.json({ success: true, user })
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message })
  }
}

export async function logout(_req, res) {
  res.clearCookie(TOKEN_NAME, COOKIE_OPTS)
  return res.json({ success: true, msg: 'Logged out' })
}