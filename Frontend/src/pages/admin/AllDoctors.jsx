import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, BadgeCheck, Crown, Pin, MapPin, Users } from 'lucide-react'
import api from '../../api/axios.js'

const heading = { fontFamily: "'Fraunces', serif" }

export default function AllDoctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')

  useEffect(() => {
    api.get('/doctor')
      .then(({ data }) => { if (data.success) setDoctors(data.doctors) })
      .finally(() => setLoading(false))
  }, [])

  const filtered = doctors.filter((d) =>
    d.name.toLowerCase().includes(q.toLowerCase()) ||
    (d.doctorrole || '').toLowerCase().includes(q.toLowerCase())
  )

  return (
    <div className="p-8 max-w-7xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#1F8A93]">Doctors</p>
          <h1 className="text-3xl font-semibold text-[#0B2B3A] mt-1" style={heading}>All Doctors</h1>
          <p className="text-sm text-slate-500 mt-2">{doctors.length} doctor{doctors.length !== 1 && 's'} registered</p>
        </div>
        <Link to="/admin/doctors/add">
          <button className="inline-flex items-center gap-2 bg-[#0B2B3A] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#123b4f] transition">
            <Plus size={15} /> Add Doctor
          </button>
        </Link>
      </div>

      <div className="mb-6 max-w-md bg-white rounded-xl shadow-sm border border-slate-100 px-4 py-2.5 flex items-center gap-2">
        <Search size={15} className="text-slate-400" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search doctors..."
          className="flex-1 outline-none text-sm text-slate-700 placeholder:text-slate-400" />
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <Users size={32} className="mx-auto text-slate-300 mb-3" />
          <p className="text-sm text-slate-500">No doctors yet.</p>
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
                <th className="text-right px-5 py-4 font-semibold">Fee</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d._id} className="border-t border-slate-100 hover:bg-slate-50/50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden shrink-0">
                        {d.image ? (
                          <img src={d.image} alt="" className="w-full h-full object-cover" />
                        ) : (
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
                  <td className="px-5 py-4 hidden lg:table-cell text-slate-600">
                    <span className="inline-flex items-center gap-1"><MapPin size={11} /> {d.location || '—'}</span>
                  </td>
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
                  <td className="px-5 py-4 text-right text-[#1F8A93] font-semibold">{d.fee || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}