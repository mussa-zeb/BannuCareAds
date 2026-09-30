import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, MapPin, Star } from 'lucide-react'
import api from '../../api/axios.js'
import { InContentAd, SponsoredCard } from '../../components/ads/Ads.jsx'

const heading = { fontFamily: "'Fraunces', serif" }

export default function Doctors() {
  const [params] = useSearchParams()
  const [doctors, setDoctors] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [dept, setDept] = useState(params.get('department') || '')

  useEffect(() => {
    api.get('/department').then(({ data }) => setDepartments(data.departments || []))
  }, [])

  useEffect(() => {
    setLoading(true)
    const query = {}
    if (dept) query.department = dept
    if (q) query.q = q
    api.get('/doctor', { params: query })
      .then(({ data }) => { if (data.success) setDoctors(data.doctors) })
      .finally(() => setLoading(false))
  }, [dept, q])

  return (
    <section className="py-10 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-6 sm:mb-10">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#1F8A93]">Doctors</p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0B2B3A] mt-2" style={heading}>
            Our Specialists
          </h2>
        </div>

        {/* Filters */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg shadow-slate-200/60 p-3 sm:p-4 flex flex-col sm:flex-row gap-2 sm:gap-3 border border-slate-100 mb-8 sm:mb-10">
          <div className="flex items-center gap-2 flex-1 px-2 py-1">
            <Search size={16} className="text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or role"
              className="flex-1 outline-none text-sm text-slate-700 placeholder:text-slate-400 min-w-0" />
          </div>
          <select value={dept} onChange={(e) => setDept(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#1F8A93] bg-white">
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-center text-slate-500 text-sm">Loading...</p>
        ) : doctors.length === 0 ? (
          <p className="text-center text-slate-500 text-sm py-10">No doctors found.</p>
        ) : (
          /* 3 per row on mobile and up, 4 on desktop */
          <div className="grid grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
            {doctors.map((d) => (
              <Link key={d._id} to={`/home/doctors/${d._id}`}>
                <div className="group flex flex-col h-full overflow-hidden rounded-xl sm:rounded-2xl bg-slate-50 border border-transparent hover:border-[#1F8A93] hover:shadow-lg hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300">
                  <div className="aspect-[4/4.4] w-full overflow-hidden bg-slate-100 relative">
                    {d.image ? (
                      <img src={d.image} alt={d.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 text-2xl sm:text-3xl">
                        {d.name?.[0]}
                      </div>
                    )}
                    {d.verified && (
                      <span className="absolute top-1.5 left-1.5 bg-blue-500 text-white text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="px-2 sm:px-4 py-2 sm:py-4 flex-1 flex flex-col">
                    <p className="text-[10px] sm:text-sm font-semibold text-[#0B2B3A] line-clamp-1">{d.name}</p>
                    <p className="text-[9px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1">{d.doctorrole}</p>
                    <div className="flex items-center gap-1 mt-1 sm:mt-2">
                      <Star size={9} className="fill-amber-400 text-amber-400" />
                      <span className="text-[9px] sm:text-[11px] font-semibold text-[#0B2B3A]">
                        {d.averageRating > 0 ? d.averageRating : 'New'}
                      </span>
                    </div>
                    <p className="text-[9px] sm:text-[11px] text-slate-400 mt-1 flex items-center gap-1 line-clamp-1">
                      <MapPin size={8} /> {d.location || '—'}
                    </p>
                    <p className="text-[9px] sm:text-[11px] text-[#1F8A93] font-semibold mt-0.5 line-clamp-1">
                      {d.fee || '—'}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <InContentAd className="pt-10 sm:pt-14" />
        <SponsoredCard className="pt-2" />
      </div>
    </section>
  )
}