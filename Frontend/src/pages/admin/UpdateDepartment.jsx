import { useEffect, useState } from 'react'
import { Pencil, Trash2, Pin, X, Check, Upload, Building2, Plus } from 'lucide-react'
import api from '../../api/axios.js'

const heading = { fontFamily: "'Fraunces', serif" }
const input = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#1F8A93] focus:ring-4 focus:ring-[#1F8A93]/10 transition'
const label = 'block text-xs font-semibold uppercase tracking-wide text-[#0B2B3A] mb-2'

const emptyService = { title: '', description: '' }

export default function UpdateDepartment() {
  const [departments, setDepartments] = useState([])
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () =>
    api.get('/department')
      .then(({ data }) => { if (data.success) setDepartments(data.departments) })
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const togglePin = async (id) => {
    const { data } = await api.patch(`/department/${id}/pin`)
    if (data.success) setDepartments((p) => p.map((d) => (d._id === id ? data.department : d)))
  }

  const remove = async (id) => {
    if (!confirm('Delete this department? This cannot be undone.')) return
    const { data } = await api.delete(`/department/${id}`)
    if (data.success) setDepartments((p) => p.filter((d) => d._id !== id))
  }

  const startEdit = (d) =>
    setEditing({
      ...d,
      _file: null,
      services: d.services?.length ? d.services.map((s) => ({ ...s })) : [{ ...emptyService }],
    })

  const setService = (index, key, value) =>
    setEditing((p) => ({
      ...p,
      services: p.services.map((s, i) => (i === index ? { ...s, [key]: value } : s)),
    }))

  const addService = () =>
    setEditing((p) => ({ ...p, services: [...p.services, { ...emptyService }] }))

  const removeService = (index) =>
    setEditing((p) => ({ ...p, services: p.services.filter((_, i) => i !== index) }))

  const saveEdit = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('name', editing.name)
    fd.append('tagline', editing.tagline || '')
    fd.append('heroTitle', editing.heroTitle || '')
    fd.append('heroText', editing.heroText || '')
    fd.append('pinned', String(editing.pinned))
    fd.append('services', JSON.stringify(
      (editing.services || []).filter((s) => s.title.trim() || s.description.trim())
    ))
    if (editing._file) fd.append('image', editing._file)

    const { data } = await api.put(`/department/${editing._id}`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    if (data.success) {
      setDepartments((prev) => prev.map((d) => (d._id === editing._id ? data.department : d)))
      setEditing(null)
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#1F8A93]">Departments</p>
        <h1 className="text-3xl font-semibold text-[#0B2B3A] mt-1" style={heading}>Update Departments</h1>
        <p className="text-sm text-slate-500 mt-2">Edit details, hero text, services, pin, or delete.</p>
      </div>

      {loading ? (
        <p className="text-slate-500 text-sm">Loading...</p>
      ) : departments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
          <Building2 size={32} className="mx-auto text-slate-300 mb-3" />
          <p className="text-sm text-slate-500">No departments yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((d) => (
            <div key={d._id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="aspect-[16/10] bg-[#F3F8FA] overflow-hidden relative">
                {d.image ? (
                  <img src={d.image} alt={d.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 size={32} className="text-slate-300" />
                  </div>
                )}
                {d.pinned && (
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-[#1F8A93] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    <Pin size={10} /> Pinned
                  </span>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-[#0B2B3A] text-base" style={heading}>{d.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {d.heroTitle || d.tagline || '—'}
                </p>
                <div className="flex items-center gap-2 mt-5">
                  <button onClick={() => startEdit(d)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#0B2B3A] text-white text-xs font-semibold py-2 hover:bg-[#123b4f] transition">
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => togglePin(d._id)}
                    className={`rounded-lg border px-3 py-2 transition ${d.pinned ? 'bg-[#1F8A93] text-white border-[#1F8A93]' : 'bg-white text-[#0B2B3A] border-slate-200 hover:border-[#1F8A93]'}`}>
                    <Pin size={13} />
                  </button>
                  <button onClick={() => remove(d._id)}
                    className="rounded-lg border border-red-100 bg-red-50 text-red-500 px-3 py-2 hover:bg-red-100 transition">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={saveEdit}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto my-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#0B2B3A]" style={heading}>Edit Department</h2>
              <button type="button" onClick={() => setEditing(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
                <X size={16} />
              </button>
            </div>

            <div>
              <label className={label}>Name</label>
              <input className={input} value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })} required />
            </div>

            <div className="border-t border-slate-100 pt-4">
              <h3 className="text-sm font-semibold text-[#0B2B3A] mb-3" style={heading}>Hero Content</h3>
              <div className="space-y-4">
                <div>
                  <label className={label}>Tagline</label>
                  <input className={input} value={editing.tagline || ''}
                    onChange={(e) => setEditing({ ...editing, tagline: e.target.value })} />
                </div>
                <div>
                  <label className={label}>Hero Title</label>
                  <textarea className={input + ' min-h-[70px] resize-none'} value={editing.heroTitle || ''}
                    onChange={(e) => setEditing({ ...editing, heroTitle: e.target.value })} />
                </div>
                <div>
                  <label className={label}>Hero Paragraph</label>
                  <textarea className={input + ' min-h-[90px] resize-none'} value={editing.heroText || ''}
                    onChange={(e) => setEditing({ ...editing, heroText: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#0B2B3A]" style={heading}>Services</h3>
                <button type="button" onClick={addService}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#1F8A93] hover:text-[#0B2B3A]">
                  <Plus size={13} /> Add
                </button>
              </div>
              <div className="space-y-2">
                {(editing.services || []).map((s, i) => (
                  <div key={i} className="bg-[#F3F8FA] rounded-lg p-3 flex items-start gap-2">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input className={input}
                        value={s.title}
                        onChange={(e) => setService(i, 'title', e.target.value)}
                        placeholder="Title" />
                      <textarea className={input + ' sm:col-span-2 min-h-[40px] resize-none'}
                        value={s.description}
                        onChange={(e) => setService(i, 'description', e.target.value)}
                        placeholder="Description" />
                    </div>
                    <button type="button" onClick={() => removeService(i)}
                      className="w-7 h-7 rounded bg-white border border-red-100 text-red-500 hover:bg-red-50 flex items-center justify-center shrink-0 mt-1">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <label className={label}>Replace Image</label>
              <label className="cursor-pointer block">
                <div className="border-2 border-dashed border-slate-200 hover:border-[#1F8A93] rounded-xl p-4 flex items-center gap-3 bg-[#F3F8FA]">
                  <Upload size={18} className="text-[#1F8A93]" />
                  <span className="text-sm text-[#0B2B3A]">{editing._file ? editing._file.name : 'Choose new image'}</span>
                  <input type="file" accept="image/*" className="hidden"
                    onChange={(e) => setEditing({ ...editing, _file: e.target.files[0] })} />
                </div>
              </label>
            </div>

            <label className="flex items-center gap-3 cursor-pointer select-none border-t border-slate-100 pt-4">
              <input type="checkbox" checked={editing.pinned}
                onChange={(e) => setEditing({ ...editing, pinned: e.target.checked })}
                className="peer sr-only" />
              <span className="w-11 h-6 rounded-full bg-slate-200 peer-checked:bg-[#1F8A93] relative transition-colors">
                <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
              </span>
              <span className="text-sm text-[#0B2B3A] font-medium">Pinned as most-worked</span>
            </label>

            <div className="flex gap-3 pt-2">
              <button type="submit"
                className="flex items-center gap-2 bg-[#0B2B3A] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#123b4f] transition">
                <Check size={16} /> Save Changes
              </button>
              <button type="button" onClick={() => setEditing(null)}
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}