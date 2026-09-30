import { useEffect, useState } from 'react'
import { Users, Trash2, BadgeCheck, Crown, Pin, X, Check, Upload, Search } from 'lucide-react'
import api from '../../api/axios.js'

const heading = { fontFamily: "'Fraunces', serif" }
const input = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#1F8A93] focus:ring-4 focus:ring-[#1F8A93]/10 transition'
const label = 'block text-xs font-semibold uppercase tracking-wide text-[#0B2B3A] mb-2'

export default function UpdateDoctor() {
  const [doctors, setDoctors] = useState([])
  const [departments, setDepartments] = useState([])
  const [editing, setEditing] = useState(null)
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const [d, depts] = await Promise.all([api.get('/doctor'), api.get('/department')])
    if (d.data.success) setDoctors(d.data.doctors)
    if (depts.data.success) setDepartments(depts.data.departments)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const togglePin = async (id) => {
    const { data } = await api.patch(`/doctor/${id}/pin`)
    if (data.success) setDoctors((p) => p.map((d) => (d._id === id ? data.doctor : d)))
  }
  const toggleVerify = async (id) => {
    const { data } = await api.patch(`/doctor/${id}/verify`)
    if (data.success) setDoctors((p) => p.map((d) => (d._id === id ? data.doctor : d)))
  }
  const togglePro = async (id) => {
    const found = doctors.find((d) => d._id === id)
    const { data } = await api.put(`/doctor/${id}`, { pro: !found.pro })
    if (data.success) setDoctors((p) => p.map((d) => (d._id === id ? data.doctor : d)))
  }
  const remove = async (id) => {
    if (!confirm('Delete this doctor?')) return
    const { data } = await api.delete(`/doctor/${id}`)
    if (data.success) setDoctors((p) => p.filter((d) => d._id !== id))
  }

  const saveEdit = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    const editable = ['name', 'email', 'phone', 'department', 'doctorrole', 'experience', 'location', 'fee', 'about']
    editable.forEach((k) => fd.append(k, editing[k] ?? ''))
    fd.append('verified', String(editing.verified))
    fd.append('pro', String(editing.pro))
    fd.append('pinned', String(editing.pinned))
    if (editing._file) fd.append('image', editing._file)

    const { data } = await api.put(`/doctor/${editing._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    if (data.success) { setDoctors((p) => p.map((d) => (d._id === editing._id ? data.doctor : d))); setEditing(null) }
  }

  const filtered = doctors.filter((d) =>
    d.name.toLowerCase().includes(q.toLowerCase()) ||
    (d.doctorrole || '').toLowerCase().includes(q.toLowerCase())
  )

  return (
    <div className="p-8 max-w-7xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#1F8A93]">Doctors</p>
        <h1 className="text-3xl font-semibold text-[#0B2B3A] mt-1" style={heading}>Update &amp; Verify Doctors</h1>
        <p className="text-sm text-slate-500 mt-2">Manage doctor info, toggle verified badge, pro subscription and pinning.</p>
      </div>

      <div className="mb-6 max-w-md bg-white rounded-xl shadow-sm border border-slate-100 px-4 py-2.5 flex items-center gap-2">
        <Search size={15} className="text-slate-400" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search doctors..." className="flex-1 outline-none text-sm text-slate-700 placeholder:text-slate-400" />
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
          <Users size={32} className="mx-auto text-slate-300 mb-3" />
          <p className="text-sm text-slate-500">No doctors found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[#F3F8FA] text-[#0B2B3A]">
              <tr>
                <th className="text-left px-5 py-4 font-semibold">Doctor</th>
                <th className="text-left px-5 py-4 font-semibold hidden md:table-cell">Department</th>
                <th className="text-left px-5 py-4 font-semibold hidden lg:table-cell">Location</th>
                <th className="text-left px-5 py-4 font-semibold">Badges</th>
                <th className="text-right px-5 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d._id} className="border-t border-slate-100 hover:bg-slate-50/50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden shrink-0">
                        {d.image ? <img src={d.image} alt="" className="w-full h-full object-cover" /> : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">{d.name?.[0]}</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[#0B2B3A] truncate">{d.name}</p>
                        <p className="text-xs text-slate-500 truncate">{d.doctorrole}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell text-slate-600">{d.department?.name || '—'}</td>
                  <td className="px-5 py-4 hidden lg:table-cell text-slate-600">{d.location || '—'}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1.5 flex-wrap">
                      {d.verified && (
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-full">
                          <BadgeCheck size={10} /> VERIFIED
                        </span>
                      )}
                      {d.pro && (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-1 rounded-full">
                          <Crown size={10} /> PRO
                        </span>
                      )}
                      {d.pinned && (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-1 rounded-full">
                          <Pin size={10} /> PINNED
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => toggleVerify(d._id)} title="Toggle verified"
                        className={`p-2 rounded-lg border transition ${d.verified ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-blue-500 border-blue-100 hover:bg-blue-50'}`}>
                        <BadgeCheck size={13} />
                      </button>
                      <button onClick={() => togglePro(d._id)} title="Toggle pro"
                        className={`p-2 rounded-lg border transition ${d.pro ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-amber-500 border-amber-100 hover:bg-amber-50'}`}>
                        <Crown size={13} />
                      </button>
                      <button onClick={() => togglePin(d._id)} title="Toggle pin"
                        className={`p-2 rounded-lg border transition ${d.pinned ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-emerald-500 border-emerald-100 hover:bg-emerald-50'}`}>
                        <Pin size={13} />
                      </button>
                      <button onClick={() => setEditing({ ...d, _file: null })}
                        className="p-2 rounded-lg border border-slate-200 bg-white text-[#0B2B3A] hover:bg-slate-50 transition">
                        <Check size={13} />
                      </button>
                      <button onClick={() => remove(d._id)}
                        className="p-2 rounded-lg border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 transition">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={saveEdit} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto my-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#0B2B3A]" style={heading}>Edit Doctor</h2>
              <button type="button" onClick={() => setEditing(null)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[['name', 'Full Name'], ['email', 'Email'], ['phone', 'Phone'], ['doctorrole', 'Role'], ['experience', 'Experience'], ['location', 'Location'], ['fee', 'Fee']].map(([key, ph]) => (
                <div key={key}>
                  <label className={label}>{ph}</label>
                  <input className={input} value={editing[key] || ''} onChange={(e) => setEditing({ ...editing, [key]: e.target.value })} />
                </div>
              ))}

              <div className="sm:col-span-2">
                <label className={label}>Department</label>
                <select className={input} value={editing.department?._id || editing.department || ''} onChange={(e) => setEditing({ ...editing, department: e.target.value })}>
                  <option value="">Select department</option>
                  {departments.map((dept) => (<option key={dept._id} value={dept._id}>{dept.name}</option>))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className={label}>About</label>
                <textarea className={input + ' min-h-[100px] resize-none'} value={editing.about || ''} onChange={(e) => setEditing({ ...editing, about: e.target.value })} />
              </div>

              <div className="sm:col-span-2">
                <label className={label}>Replace Image</label>
                <label className="cursor-pointer block">
                  <div className="border-2 border-dashed border-slate-200 hover:border-[#1F8A93] rounded-xl p-4 flex items-center gap-3 bg-[#F3F8FA]">
                    <Upload size={18} className="text-[#1F8A93]" />
                    <span className="text-sm text-[#0B2B3A]">{editing._file ? editing._file.name : 'Choose new image'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setEditing({ ...editing, _file: e.target.files[0] })} />
                  </div>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex items-center gap-2 bg-[#0B2B3A] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#123b4f] transition">
                <Check size={16} /> Save Changes
              </button>
              <button type="button" onClick={() => setEditing(null)} className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}