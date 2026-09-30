import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, Pin } from 'lucide-react'
import api from '../../api/axios.js'
import { InContentAd } from '../../components/ads/Ads.jsx'

const heading = { fontFamily: "'Fraunces', serif" }

export default function Departments() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/department')
      .then(({ data }) => { if (data.success) setDepartments(data.departments) })
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-10 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#1F8A93]">Departments</p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0B2B3A] mt-2" style={heading}>
            Browse by Department
          </h2>
          <p className="text-sm text-slate-500 mt-3 max-w-md mx-auto px-4">
            Explore our specialities and find the right care for you.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-slate-500 text-sm">Loading...</p>
        ) : departments.length === 0 ? (
          <div className="bg-[#F3F8FA] rounded-2xl p-10 text-center max-w-md mx-auto">
            <Building2 size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-sm text-slate-500">No departments available yet.</p>
          </div>
        ) : (
          /* 3 per row on mobile, 3 on sm, 4 on lg, 5 on xl */
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-5">
            {departments.map((d) => (
              <Link key={d._id} to={`/home/departments/${d._id}`}>
                <div className="group bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-2 sm:p-3 flex flex-col items-center gap-1.5 sm:gap-3 cursor-pointer hover:border-[#1F8A93] hover:shadow-lg hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300 relative">
                  {d.pinned && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#1F8A93] flex items-center justify-center z-10">
                      <Pin size={9} className="text-white" />
                    </span>
                  )}
                  <div className="aspect-square w-full overflow-hidden rounded-lg sm:rounded-xl bg-[#F3F8FA]">
                    {d.image ? (
                      <img src={d.image} alt={d.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 size={20} className="text-slate-300" />
                      </div>
                    )}
                  </div>
                  <p className="text-[9px] sm:text-[11px] font-semibold tracking-[0.1em] sm:tracking-[0.12em] uppercase text-[#0B2B3A] text-center line-clamp-2 leading-tight">
                    {d.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <InContentAd className="pt-10 sm:pt-14" />
      </div>
    </section>
  )
}