import { useEffect, useState } from 'react'
import { Upload, X, Check, Loader2, Star } from 'lucide-react'
import api from '../../api/axios.js'

const heading = { fontFamily: "'Fraunces', serif" }
const input = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#1F8A93] focus:ring-4 focus:ring-[#1F8A93]/10 transition'
const label = 'block text-xs font-semibold uppercase tracking-wide text-[#0B2B3A] mb-2'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const SLOTS = ['Dawn', 'Morning', 'Evening', 'Noon', 'Night', 'Midnight']

export default function DoctorProfile() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)

  const [form, setForm] = useState({
    name: '', email: '', phone: '', department: '', doctorrole: '', experience: '',
    location: '', fee: '', about: '', days: [], timeSlots: [],
  })

  useEffect(() => {
    Promise.all([api.get('/department'), api.get('/doctor/me')]).then(([depts, mine]) => {
      if (depts.data.success) setDepartments(depts.data.departments)
      if (mine.data.success && mine.data.doctor) {
        const d = mine.data.doctor
        setForm({
          name: d.name || '', email: d.email || '', phone: d.phone || '',
          department: d.department?._id || d.department || '',
          doctorrole: d.doctorrole || '', experience: d.experience || '',
          location: d.location || '', fee: d.fee || '',
          about: d.about || '', days: d.days || [], timeSlots: d.timeSlots || [],
        })
        setAverageRating(d.averageRating || 0)
        setTotalReviews(d.totalReviews || 0)
        if (d.image) setPreview(d.image)
      }
    }).finally(() => setLoading(false))
  }, [])

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const toggleArray = (key, val) =>
    setForm((p) => ({ ...p, [key]: p[key].includes(val) ? p[key].filter((x) => x !== val) : [...p[key], val] }))

  const onFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const submit = async (e) => {
    e.preventDefault()
    setMsg({ type: '', text: '' })
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, Array.isArray(v) ? v.join(',') : v))
      if (file) fd.append('image', file)

      const { data } = await api.put('/doctor/me', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      if (data.success) setMsg({ type: 'ok', text: 'Profile saved successfully!' })
      else setMsg({ type: 'err', text: data.msg })
    } catch (err) {
      setMsg({ type: 'err', text: err.response?.data?.msg || err.message })
    } finally { setSaving(false) }
  }

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center gap-3 text-slate-500">
        <Loader2 size={20} className="animate-spin text-[#1F8A93]" /> Loading your profile...
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#1F8A93]">Profile</p>
          <h1 className="text-3xl font-semibold text-[#0B2B3A] mt-1" style={heading}>My Profile</h1>
          <p className="text-sm text-slate-500 mt-2">Your rating comes from patient reviews and cannot be set manually.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-4 py-2">
          <Star size={14} className="fill-amber-400 text-amber-400" />
          <span className="text-sm font-semibold text-[#0B2B3A]">{averageRating > 0 ? averageRating : 'New'}</span>
          <span className="text-xs text-amber-700">({totalReviews} review{totalReviews !== 1 && 's'})</span>
        </div>
      </div>

      {msg.text && (
        <div className={`mb-6 rounded-xl px-4 py-3 text-sm font-medium border ${msg.type === 'ok' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>{msg.text}</div>
      )}

      <form onSubmit={submit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[['name', 'Full Name *', true], ['email', 'Email', false], ['phone', 'Phone', false], ['doctorrole', 'Role', false], ['experience', 'Experience', false], ['location', 'Location', false], ['fee', 'Fee', false]].map(([key, ph, req]) => (
            <div key={key}>
              <label className={label}>{ph}</label>
              <input className={input} name={key} value={form[key]} onChange={handle} placeholder={ph} required={req} />
            </div>
          ))}

          <div className="sm:col-span-2">
            <label className={label}>Department *</label>
            <select className={input} name="department" value={form.department} onChange={handle} required>
              <option value="">Select department</option>
              {departments.map((d) => (<option key={d._id} value={d._id}>{d.name}</option>))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className={label}>About</label>
            <textarea className={input + ' min-h-[120px] resize-none'} name="about" value={form.about} onChange={handle} placeholder="Short bio..." />
          </div>

          <div className="sm:col-span-2">
            <label className={label}>Available Days</label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((d) => (
                <button key={d} type="button" onClick={() => toggleArray('days', d)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${form.days.includes(d) ? 'bg-[#1F8A93] text-white border-[#1F8A93]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#1F8A93]'}`}>{d}</button>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className={label}>Time Slots</label>
            <div className="flex flex-wrap gap-2">
              {SLOTS.map((s) => (
                <button key={s} type="button" onClick={() => toggleArray('timeSlots', s)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${form.timeSlots.includes(s) ? 'bg-[#0B2B3A] text-white border-[#0B2B3A]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#0B2B3A]'}`}>{s}</button>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className={label}>Profile Photo</label>
            <div className="flex items-start gap-5">
              <label className="cursor-pointer flex-1">
                <div className="border-2 border-dashed border-slate-200 hover:border-[#1F8A93] rounded-2xl p-6 flex flex-col items-center justify-center transition-colors bg-[#F3F8FA]">
                  <Upload size={22} className="text-[#1F8A93] mb-2" />
                  <p className="text-sm font-medium text-[#0B2B3A]">Click to upload photo</p>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG — max 5MB</p>
                  <input type="file" accept="image/*" className="hidden" onChange={onFile} />
                </div>
              </label>
              {preview && (
                <div className="relative w-32 h-32 rounded-full overflow-hidden border border-slate-200 shrink-0">
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => { setFile(null); setPreview('') }}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center hover:bg-red-50">
                    <X size={12} className="text-red-500" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 bg-[#0B2B3A] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#123b4f] transition disabled:opacity-60">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}