import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Pin, Building2 } from 'lucide-react'
import api from '../../api/axios.js'

const heading = { fontFamily: "'Fraunces', serif" }

export default function AllDepartments() {
  const [departments, setDepartments] = useState([])
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

  return (
    <div className="p-8 max-w-7xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#1F8A93]">Departments</p>
          <h1 className="text-3xl font-semibold text-[#0B2B3A] mt-1" style={heading}>All Departments</h1>
          <p className="text-sm text-slate-500 mt-2">{departments.length} department{departments.length !== 1 && 's'} total</p>
        </div>
        <Link to="/admin/departments/add">
          <button className="inline-flex items-center gap-2 bg-[#0B2B3A] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#123b4f] transition">
            <Plus size={15} /> Add Department
          </button>
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : departments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <Building2 size={32} className="mx-auto text-slate-300 mb-3" />
          <p className="text-sm text-slate-500">No departments yet. Create your first one.</p>
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
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{d.description || '—'}</p>
                <div className="flex items-center gap-2 mt-5">
                  <Link to="/admin/departments/update" className="flex-1">
                    <button className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-[#0B2B3A] text-white text-xs font-semibold py-2 hover:bg-[#123b4f] transition">
                      <Pencil size={12} /> Edit
                    </button>
                  </Link>
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
    </div>
  )
}