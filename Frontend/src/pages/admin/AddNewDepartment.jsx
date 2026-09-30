import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X, Check, Pin, Plus, Trash2 } from 'lucide-react'
import api from '../../api/axios.js'

const heading = { fontFamily: "'Fraunces', serif" }
const input = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#1F8A93] focus:ring-4 focus:ring-[#1F8A93]/10 transition'
const label = 'block text-xs font-semibold uppercase tracking-wide text-[#0B2B3A] mb-2'

const emptyService = { title: '', description: '' }

export default function AddNewDepartment() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    tagline: 'Your Health, Our Priority',
    heroTitle: '',
    heroText: '',
    pinned: false,
    services: [{ ...emptyService }, { ...emptyService }],
  })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [msg, setMsg] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)

  const handle = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const onFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const setService = (index, key, value) =>
    setForm((p) => ({
      ...p,
      services: p.services.map((s, i) => (i === index ? { ...s, [key]: value } : s)),
    }))

  const addService = () =>
    setForm((p) => ({ ...p, services: [...p.services, { ...emptyService }] }))

  const removeService = (index) =>
    setForm((p) => ({ ...p, services: p.services.filter((_, i) => i !== index) }))

  const submit = async (e) => {
    e.preventDefault()
    setMsg({ type: '', text: '' })
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('tagline', form.tagline)
      fd.append('heroTitle', form.heroTitle)
      fd.append('heroText', form.heroText)
      fd.append('pinned', String(form.pinned))
      fd.append('services', JSON.stringify(
        form.services.filter((s) => s.title.trim() || s.description.trim())
      ))
      if (file) fd.append('image', file)

      const { data } = await api.post('/department', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (data.success) {
        setMsg({ type: 'ok', text: 'Department created successfully!' })
        setTimeout(() => navigate('/admin/departments'), 1000)
      } else {
        setMsg({ type: 'err', text: data.msg })
      }
    } catch (err) {
      setMsg({ type: 'err', text: err.response?.data?.msg || err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#1F8A93]">Departments</p>
        <h1 className="text-3xl font-semibold text-[#0B2B3A] mt-1" style={heading}>Add New Department</h1>
        <p className="text-sm text-slate-500 mt-2">
          Fill in the details — everything you write here appears on the department page.
        </p>
      </div>

      {msg.text && (
        <div className={`mb-6 rounded-xl px-4 py-3 text-sm font-medium border ${msg.type === 'ok' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
          {msg.text}
        </div>
      )}

      <form onSubmit={submit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <label className={label}>Department Name *</label>
          <input className={input} name="name" value={form.name} onChange={handle} placeholder="e.g. Cardiology" required />
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-base font-semibold text-[#0B2B3A] mb-4" style={heading}>Hero Section</h3>
          <div className="space-y-5">
            <div>
              <label className={label}>Tagline (small pill at top)</label>
              <input className={input} name="tagline" value={form.tagline} onChange={handle} placeholder="Your Health, Our Priority" />
            </div>
            <div>
              <label className={label}>Hero Title</label>
              <textarea className={input + ' min-h-[80px] resize-none'} name="heroTitle" value={form.heroTitle} onChange={handle} placeholder="Expert care for your heart and health (use Enter for line breaks)" />
            </div>
            <div>
              <label className={label}>Hero Paragraph</label>
              <textarea className={input + ' min-h-[100px] resize-none'} name="heroText" value={form.heroText} onChange={handle} placeholder="Paragraph shown under the hero title" />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[#0B2B3A]" style={heading}>Services</h3>
            <button type="button" onClick={addService}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F8A93] hover:text-[#0B2B3A] transition">
              <Plus size={14} /> Add service
            </button>
          </div>

          <div className="space-y-3">
            {form.services.map((s, i) => (
              <div key={i} className="bg-[#F3F8FA] rounded-xl p-4 flex items-start gap-3">
                <span className="text-xs font-bold text-slate-400 pt-2.5 w-6 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    className={input + ' sm:col-span-1'}
                    value={s.title}
                    onChange={(e) => setService(i, 'title', e.target.value)}
                    placeholder="Service title"
                  />
                  <textarea
                    className={input + ' sm:col-span-2 min-h-[44px] resize-none'}
                    value={s.description}
                    onChange={(e) => setService(i, 'description', e.target.value)}
                    placeholder="Short description"
                  />
                </div>
                <button type="button" onClick={() => removeService(i)}
                  className="w-8 h-8 rounded-lg bg-white border border-red-100 text-red-500 hover:bg-red-50 flex items-center justify-center shrink-0 mt-1.5">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            {form.services.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No services yet. Click "Add service" above.</p>
            )}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <label className={label}>Department Image</label>
          <div className="flex items-start gap-5">
            <label className="cursor-pointer flex-1">
              <div className="border-2 border-dashed border-slate-200 hover:border-[#1F8A93] rounded-2xl p-6 flex flex-col items-center justify-center transition-colors bg-[#F3F8FA]">
                <Upload size={22} className="text-[#1F8A93] mb-2" />
                <p className="text-sm font-medium text-[#0B2B3A]">Click to upload image</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG or WebP — max 5MB</p>
                <input type="file" accept="image/*" className="hidden" onChange={onFile} />
              </div>
            </label>
            {preview && (
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden border border-slate-200 shrink-0">
                <img src={preview} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => { setFile(null); setPreview('') }}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center hover:bg-red-50">
                  <X size={12} className="text-red-500" />
                </button>
              </div>
            )}
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer select-none border-t border-slate-100 pt-6">
          <input type="checkbox" name="pinned" checked={form.pinned} onChange={handle} className="peer sr-only" />
          <span className="w-11 h-6 rounded-full bg-slate-200 peer-checked:bg-[#1F8A93] relative transition-colors">
            <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
          </span>
          <span className="flex items-center gap-1.5 text-sm text-[#0B2B3A] font-medium">
            <Pin size={14} /> Pin as most-worked department
          </span>
        </label>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 bg-[#0B2B3A] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#123b4f] transition disabled:opacity-60">
            <Check size={16} /> {loading ? 'Creating...' : 'Create Department'}
          </button>
          <button type="button" onClick={() => navigate('/admin/departments')}
            className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}