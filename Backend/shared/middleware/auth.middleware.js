import jwt from 'jsonwebtoken'

const TOKEN_NAME = 'BannuCare'

const verifyToken = (req, res, next) => {
  const token = req.cookies?.[TOKEN_NAME]
  if (!token) {
    return res.status(401).json({ success: false, msg: 'Not authenticated' })
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ success: false, msg: 'Invalid or expired token' })
  }
}

export const protect = verifyToken

export const protectRole = (...roles) => (req, res, next) => {
  verifyToken(req, res, () => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, msg: 'Access denied' })
    }
    next()
  })
}

export const protectAdmin = protectRole('admin')
export const protectDoctor = protectRole('doctor')
export const protectUser = protectRole('user')