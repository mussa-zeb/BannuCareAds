import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Stethoscope, Mail, Lock, User as UserIcon, ShieldCheck, Loader2, AlertCircle,
  Eye, EyeOff,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const heading = { fontFamily: "'Fraunces', serif" }

const baseInput =
  'w-full rounded-xl border bg-white pl-11 pr-11 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 transition disabled:opacity-60'

const inputClass = (hasError) =>
  baseInput +
  (hasError
    ? ' border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100'
    : ' border-slate-200 focus:border-[#1F8A93] focus:ring-4 focus:ring-[#1F8A93]/10')

const iconClass = (hasError) =>
  `absolute left-4 top-1/2 -translate-y-1/2 ${hasError ? 'text-red-400' : 'text-slate-400'}`

export default function SignUp() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' })
  const [err, setErr] = useState({ msg: '', field: '' })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (err.msg) setErr({ msg: '', field: '' })
  }

  const submit = async (e) => {
    e.preventDefault()
    if (loading) return

    setErr({ msg: '', field: '' })
    setLoading(true)

    try {
      const res = await register(form)

      if (!res.success) {
        setErr({ msg: res.msg, field: res.field || '' })
        return
      }

      if (res.user.role === 'admin') navigate('/admin', { replace: true })
      else if (res.user.role === 'doctor') navigate('/doctor', { replace: true })
      else navigate('/home', { replace: true })
    } catch (unexpected) {
      setErr({ msg: unexpected?.message || 'Something went wrong', field: '' })
    } finally {
      setLoading(false)
    }
  }

  const hasFieldError = (f) => err.field === f

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#F3F8FA] px-4"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#0B2B3A] flex items-center justify-center mb-3 shadow-lg shadow-[#0B2B3A]/20">
            <Stethoscope size={26} className="text-white" />
          </div>
          <h1 className="text-3xl font-semibold text-[#0B2B3A]" style={heading}>
            Bannu<span className="text-[#1F8A93]">Care</span>
          </h1>
        </div>

        <form
          onSubmit={submit}
          className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 p-8 border border-slate-100 space-y-5"
        >
          <h2 className="text-xl font-semibold text-[#0B2B3A]" style={heading}>
            Create your account
          </h2>

          {err.msg && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-red-600 leading-relaxed">
                {err.msg}
              </p>
            </div>
          )}

          {/* Name */}
          <div className="relative">
            <UserIcon size={16} className={iconClass(hasFieldError('name'))} />
            <input
              className={inputClass(hasFieldError('name'))}
              type="text"
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={handle}
              required
              disabled={loading}
              autoComplete="name"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail size={16} className={iconClass(hasFieldError('email'))} />
            <input
              className={inputClass(hasFieldError('email'))}
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handle}
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          {/* Password with eye toggle */}
          <div className="relative">
            <Lock size={16} className={iconClass(hasFieldError('password'))} />
            <input
              className={inputClass(hasFieldError('password'))}
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password (min 6 characters)"
              value={form.password}
              onChange={handle}
              required
              disabled={loading}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Role */}
          <div className="relative">
            <ShieldCheck size={16} className={iconClass(hasFieldError('role'))} />
            <select
              className={inputClass(hasFieldError('role')) + ' appearance-none cursor-pointer'}
              name="role"
              value={form.role}
              onChange={handle}
              disabled={loading}
            >
              <option value="user">User</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#0B2B3A] text-white text-sm font-semibold py-3 rounded-xl hover:bg-[#123b4f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Creating...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/" className="text-[#1F8A93] font-semibold hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}