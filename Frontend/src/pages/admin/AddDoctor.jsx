import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X, Check, Loader2, BadgeCheck, Crown, Pin, Info, Search, Link2 } from 'lucide-react'
import api from '../../api/axios.js'

const heading = { fontFamily: "'Fraunces', serif" }
const input = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#1F8A93] focus:ring-4 focus:ring-[#1F8A93]/10 transition'
const label = 'block text-xs font-semibold uppercase tracking-wide text-[#0B2B3A] mb-2'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const SLOTS = ['Dawn', 'Morning', 'Evening', 'Noon', 'Night', 'Midnight']

export default function AddDoctor() {
  const navigate = useNavigate()
  const [departments, setDepartments] = useState([])
  const [doctorUsers, setDoctorUsers] = useState([])
  const [showLinkPanel, setShowLinkPanel] = useState(false)
  const [userSearch, setUserSearch] = useState('')
  const [form, setForm] = useState({
    name: '', email: '', phone: '', department: '', doctorrole: '', experience: '',
    location: '', fee: '', rating: '4.5', about: '', days: [], timeSlots: [],
    verified: false, pro: false, pinned: false, userId: '',
  })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [msg, setMsg] = useState({ type: '', text: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get('/department'),
      api.get('/user/doctors').catch(() => ({ data: { users: [] } })),
    ]).then(([depts, users]) => {
      if (depts.data.success) setDepartments(depts.data.departments)
      if (users.data?.success) setDoctorUsers(users.data.users || [])
    })
  }, [])

  const handle = (e) => {
    const { name, value, type, checked } = e.target
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  const toggleArray = (key, val) =>
    setForm((p) => ({ ...p, [key]: p[key].includes(val) ? p[key].filter((x) => x !== val) : [...p[key], val] }))

  const onFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    if (f.size > 5 * 1024 * 1024) { setMsg({ type: 'err', text: 'Image must be under 5MB' }); return }
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const linkUser = (u) => {
    setForm((p) => ({ ...p, userId: u._id, name: p.name || u.name, email: p.email || u.email }))
    setShowLinkPanel(false)
    setUserSearch('')
  }

  const filteredUsers = doctorUsers.filter((u) =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  )

  const submit = async (e) => {
    e.preventDefault()
    setMsg({ type: '', text: '' })
    if (!form.department) { setMsg({ type: 'err', text: 'Please select a department' }); return }
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (Array.isArray(v)) fd.append(k, v.join(',')); else fd.append(k, String(v)) })
      if (file) fd.append('image', file)
      const { data } = await api.post('/doctor', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      if (data.success) { setMsg({ type: 'ok', text: 'Doctor added successfully! Redirecting...' }); setTimeout(() => navigate('/admin/doctors'), 1000) }
      else setMsg({ type: 'err', text: data.msg || 'Failed to add doctor' })
    } catch (err) {
      setMsg({ type: 'err', text: err.response?.data?.msg || err.message || 'Server error' })
    } finally { setSaving(false) }
  }

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#1F8A93]">Doctors</p>
          <h1 className="text-3xl sm:text-[2.25rem] font-semibold text-[#0B2B3A] mt-1 leading-tight" style={heading}>Add New Doctor</h1>
          <p className="text-sm text-slate-500 mt-2">Create a doctor profile. Optionally link it to an existing doctor account.</p>
        </div>
        <button type="button" onClick={() => setShowLinkPanel(true)}
          className="inline-flex items-center gap-2 bg-white border border-slate-200 text-[#0B2B3A] text-xs font-semibold px-4 py-2.5 rounded-xl hover:border-[#1F8A93] hover:text-[#1F8A93] transition">
          <Link2 size={13} /> Link existing account
        </button>
      </div>

      {form.userId && (
        <div className="mb-6 rounded-xl px-4 py-3 border border-blue-100 bg-blue-50 text-sm text-[#0B2B3A] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <BadgeCheck size={15} className="text-[#1F8A93] shrink-0" />
            <span className="truncate">Linked to: <strong>{form.email || form.userId}</strong></span>
          </div>
          <button type="button" onClick={() => setForm((p) => ({ ...p, userId: '' }))} className="text-xs font-semibold text-red-500 hover:text-red-600 shrink-0">Unlink</button>
        </div>
      )}

      {msg.text && (
        <div className={`mb-6 rounded-xl px-4 py-3 text-sm font-medium border ${msg.type === 'ok' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>{msg.text}</div>
      )}

      <form onSubmit={submit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-7">
        <section>
          <h2 className="text-lg font-semibold text-[#0B2B3A] mb-4" style={heading}>Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[['name', 'Full Name *', true, 'text'], ['email', 'Email', false, 'email'], ['phone', 'Phone', false, 'tel'], ['doctorrole', 'Role (Cardiologist, Dentist...)', false, 'text'], ['experience', 'Experience (e.g. 12 Years Experience)', false, 'text'], ['location', 'Location', false, 'text'], ['fee', 'Fee (e.g. PKR 2,500)', false, 'text']].map(([key, ph, req, type]) => (
              <div key={key}>
                <label className={label}>{ph}</label>
                <input className={input} name={key} type={type} value={form[key]} onChange={handle} placeholder={ph} required={req} />
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
              <textarea className={input + ' min-h-[120px] resize-none'} name="about" value={form.about} onChange={handle} placeholder="Short professional bio..." />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0B2B3A] mb-4" style={heading}>Availability</h2>
          <div className="space-y-5">
            <div>
              <label className={label}>Available Days</label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((d) => {
                  const active = form.days.includes(d)
                  return (
                    <button key={d} type="button" onClick={() => toggleArray('days', d)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${active ? 'bg-[#1F8A93] text-white border-[#1F8A93]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#1F8A93]'}`}>{d}</button>
                  )
                })}
              </div>
            </div>
            <div>
              <label className={label}>Time Slots</label>
              <div className="flex flex-wrap gap-2">
                {SLOTS.map((s) => {
                  const active = form.timeSlots.includes(s)
                  return (
                    <button key={s} type="button" onClick={() => toggleArray('timeSlots', s)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${active ? 'bg-[#0B2B3A] text-white border-[#0B2B3A]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#0B2B3A]'}`}>{s}</button>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0B2B3A] mb-4" style={heading}>Profile Photo</h2>
          <div className="flex items-start gap-5">
            <label className="cursor-pointer flex-1">
              <div className="border-2 border-dashed border-slate-200 hover:border-[#1F8A93] rounded-2xl p-6 flex flex-col items-center justify-center transition-colors bg-[#F3F8FA]">
                <Upload size={22} className="text-[#1F8A93] mb-2" />
                <p className="text-sm font-medium text-[#0B2B3A]">{file ? file.name : 'Click to upload photo'}</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG or WebP — max 5MB</p>
                <input type="file" accept="image/*" className="hidden" onChange={onFile} />
              </div>
            </label>
            {preview && (
              <div className="relative w-32 h-32 rounded-full overflow-hidden border border-slate-200 shrink-0">
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => { setFile(null); setPreview('') }}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center hover:bg-red-50">
                  <X size={12} className="text-red-500" />
                </button>
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0B2B3A] mb-4" style={heading}>Badges &amp; Promotion</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <BadgeToggle icon={BadgeCheck} active={form.verified} onToggle={() => setForm((p) => ({ ...p, verified: !p.verified }))} label="Verified" desc="Show blue checkmark" tone="blue" />
            <BadgeToggle icon={Crown} active={form.pro} onToggle={() => setForm((p) => ({ ...p, pro: !p.pro }))} label="Pro" desc="Paid subscription" tone="amber" />
            <BadgeToggle icon={Pin} active={form.pinned} onToggle={() => setForm((p) => ({ ...p, pinned: !p.pinned }))} label="Pinned" desc="Show at top" tone="emerald" />
          </div>
        </section>

        <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-100">
          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 bg-[#0B2B3A] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#123b4f] transition disabled:opacity-60">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            {saving ? 'Creating...' : 'Create Doctor'}
          </button>
          <button type="button" onClick={() => navigate('/admin/doctors')}
            className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">Cancel</button>
        </div>
      </form>

      {showLinkPanel && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-semibold text-[#0B2B3A]" style={heading}>Link Doctor Account</h3>
                <p className="text-xs text-slate-500 mt-1">Choose a user with role <code>doctor</code></p>
              </div>
              <button onClick={() => setShowLinkPanel(false)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
                <X size={16} />
              </button>
            </div>
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center gap-2 bg-[#F3F8FA] rounded-xl px-4 py-2.5">
                <Search size={14} className="text-slate-400" />
                <input autoFocus value={userSearch} onChange={(e) => setUserSearch(e.target.value)} placeholder="Search by name or email..." className="flex-1 bg-transparent outline-none text-sm text-slate-700" />
              </div>
            </div>
            <div className="overflow-y-auto flex-1 p-2">
              {filteredUsers.length === 0 ? (
                <div className="p-8 text-center">
                  <Info size={24} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-sm text-slate-500">{doctorUsers.length === 0 ? 'No doctor accounts registered yet.' : 'No matching accounts.'}</p>
                </div>
              ) : (
                filteredUsers.map((u) => (
                  <button key={u._id} onClick={() => linkUser(u)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#F3F8FA] transition text-left">
                    <div className="w-10 h-10 rounded-full bg-[#0B2B3A] text-white flex items-center justify-center font-semibold shrink-0">{u.name?.[0]?.toUpperCase() || 'D'}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#0B2B3A] truncate">{u.name}</p>
                      <p className="text-xs text-slate-500 truncate">{u.email}</p>
                    </div>
                    <Link2 size={14} className="text-[#1F8A93] shrink-0" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function BadgeToggle({ icon: Icon, active, onToggle, label, desc, tone }) {
  const tones = {
    blue: { on: 'bg-blue-50 border-blue-200 text-blue-700' },
    amber: { on: 'bg-amber-50 border-amber-200 text-amber-700' },
    emerald: { on: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
  }
  const t = tones[tone]
  return (
    <button type="button" onClick={onToggle}
      className={`flex items-start gap-3 p-4 rounded-2xl border text-left transition ${active ? t.on : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${active ? 'bg-white/70' : 'bg-slate-100'}`}>
        <Icon size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-tight">{label}</p>
        <p className="text-[11px] opacity-75 mt-0.5">{desc}</p>
      </div>
      <div className={`w-4 h-4 rounded-full border-2 shrink-0 mt-1 transition ${active ? 'bg-current border-current' : 'border-slate-300'}`} />
    </button>
  )
}