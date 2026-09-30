import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Building2, Calendar, Clock, CheckCircle2, Star, MapPin,
  BadgeCheck, Crown, Pin, Loader2, Phone, Mail, Stethoscope, ArrowRight,
} from 'lucide-react'
import api from '../../api/axios.js'
import { InContentAd } from '../../components/ads/Ads.jsx'

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');`
const heading = { fontFamily: "'Fraunces', serif" }

const ServiceIcons = [Stethoscope, Calendar, CheckCircle2, Building2]
const PREVIEW_COUNT = 3

export default function DepartmentDetail() {
  const { id } = useParams()

  const [department, setDepartment] = useState(null)
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    Promise.all([
      api.get(`/department/${id}`),
      api.get(`/doctor?department=${id}`),
    ])
      .then(([dRes, docRes]) => {
        if (cancelled) return
        if (dRes.data.success) setDepartment(dRes.data.department)
        if (docRes.data.success) setDoctors(dRes.data.doctors || docRes.data.doctors)
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.msg || 'Failed to load department')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 size={26} className="animate-spin text-[#1F8A93]" />
        <p className="text-sm">Loading department...</p>
      </div>
    )
  }

  if (error || !department) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-500">
        <Building2 size={32} className="text-slate-300" />
        <p className="text-sm">{error || 'Department not found'}</p>
        <Link to="/home/departments">
          <button className="mt-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-[#104560] hover:text-white transition">
            Back to departments
          </button>
        </Link>
      </div>
    )
  }

  const services = department.services?.length ? department.services : []
  const heroTitle = department.heroTitle || department.name
  const heroText = department.heroText || ''
  const tagline = department.tagline || 'Your Health, Our Priority'
  const previewDoctors = doctors.slice(0, PREVIEW_COUNT)

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{FONT_IMPORT}</style>

      {/* HERO */}
      <section className="grid grid-cols-1 items-center gap-8 lg:gap-12 lg:grid-cols-2 w-full bg-[#F3F8FA] px-4 sm:px-10 lg:px-36 pt-10 sm:pt-16 pb-12 sm:pb-20">
        <div>
          <Link to="/home/departments"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1F8A93] hover:underline mb-4 sm:mb-6">
            ← Back to departments
          </Link>

          <h1 className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-semibold text-[#0B2B3A]">
            {tagline}
          </h1>

          <h1 style={heading}
              className="text-3xl sm:text-4xl lg:text-[3.25rem] font-semibold text-[#0B2B3A] leading-[1.1] mb-4 sm:mb-5 tracking-tight whitespace-pre-line">
            {heroTitle}
          </h1>

          {heroText && (
            <p className="mt-4 sm:mt-6 max-w-md text-sm leading-relaxed text-slate-500">
              {heroText}
            </p>
          )}

          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3">
            <a href="#team">
              <button className="rounded-full border border-slate-200 bg-white px-5 sm:px-6 py-2 text-sm font-semibold text-slate-700 hover:text-white transition hover:border-slate-300 hover:bg-[#104560]">
                View Doctors
              </button>
            </a>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-md items-center justify-center py-4 sm:py-10">
          <div className="absolute right-4 top-4 w-56 h-56 sm:w-72 sm:h-72 lg:w-96 lg:h-96 rounded-full opacity-70 z-0"></div>
          {department.image ? (
            <img src={department.image} alt={department.name}
              className="relative z-10 h-[280px] sm:h-[400px] w-full max-w-sm object-cover rounded-3xl select-none" />
          ) : (
            <div className="relative z-10 h-[280px] sm:h-[400px] w-full max-w-sm rounded-3xl bg-[#0B2B3A] flex items-center justify-center">
              <Building2 size={64} className="text-white/40" />
            </div>
          )}
        </div>
      </section>

      {/* SERVICES */}
      {services.length > 0 && (
        <section className="text-center w-full bg-white px-4 sm:px-10 lg:px-36 pb-14 sm:pb-28 pt-10 sm:pt-16">
          <div className="flex flex-col items-center">
            <h1 className="inline-flex items-center rounded-full border border-blue-100 mb-4 bg-blue-50 px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-semibold text-[#0B2B3A]">
              Services
            </h1>
            <h2 style={heading} className="text-2xl sm:text-3xl font-semibold text-[#0B2B3A] mt-2 mb-3">
              What we offer in
              <br />
              {department.name}
            </h2>
          </div>

          <div className="mt-8 sm:mt-14 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5 text-left">
            {services.map((s, index) => {
              const Icon = ServiceIcons[index % ServiceIcons.length]
              return (
                <div key={index}
                  className="relative flex flex-col justify-between rounded-2xl p-4 sm:p-6 min-h-[160px] sm:min-h-[220px] bg-[#F3F8FA] text-slate-500 transition-all duration-300 hover:bg-[#0B2B3A] hover:text-white group">
                  <div className="flex items-start justify-between">
                    <div className="flex h-9 sm:h-11 w-9 sm:w-11 items-center justify-center rounded-xl bg-white group-hover:bg-white/15">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-[#0B2B3A] group-hover:text-white" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-medium text-slate-400 group-hover:text-white/60">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="mt-4 sm:mt-8">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-800 group-hover:text-white">
                      {s.title}
                    </h3>
                    <p className="mt-1.5 sm:mt-2 text-[11px] sm:text-[13px] leading-relaxed text-slate-500 group-hover:text-white/75">
                      {s.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      <InContentAd className="py-8 sm:py-12" />

      {/* DOCTORS — preview of 3 + button */}
      <section id="team" className="text-center w-full bg-[#F3F8FA] pb-14 sm:pb-28 pt-10 sm:pt-16">
        <div className="flex flex-col items-center px-4 sm:px-0">
          <h1 className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 sm:px-4 py-1.5 mb-4 text-[10px] sm:text-xs font-semibold text-[#0B2B3A]">
            Our Team
          </h1>
          <h2 style={heading} className="text-2xl sm:text-3xl font-semibold text-[#0B2B3A] leading-snug mt-2 mb-4 sm:mb-6">
            {department.name} specialists
          </h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Top-rated and pinned experts in this department.
          </p>
        </div>

        {doctors.length === 0 ? (
          <div className="mt-10 sm:mt-12 max-w-md mx-auto bg-white rounded-2xl p-10 text-center mx-4 sm:mx-auto">
            <Stethoscope size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-sm text-slate-500">No doctors in this department yet.</p>
          </div>
        ) : (
          <>
            <div className="mt-8 sm:mt-14 grid grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5 px-4 sm:px-10 lg:px-36">
              {previewDoctors.map((doc) => (
                <Link key={doc._id} to={`/home/doctors/${doc._id}`}>
                  <div className="group flex flex-col h-full overflow-hidden rounded-xl sm:rounded-2xl bg-white text-left border border-transparent hover:border-[#1F8A93] hover:shadow-lg hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300 relative">
                    <div className="absolute top-1.5 left-1.5 z-10 flex flex-col gap-1">
                      {doc.pinned && (
                        <span className="inline-flex items-center gap-1 bg-[#1F8A93] text-white text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-sm">
                          <Pin size={8} /> Pinned
                        </span>
                      )}
                      {doc.pro && (
                        <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-sm">
                          <Crown size={8} /> Pro
                        </span>
                      )}
                    </div>
                    {doc.verified && (
                      <span className="absolute top-1.5 right-1.5 z-10 bg-blue-500 text-white text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full shadow-sm">
                        ✓
                      </span>
                    )}

                    <div className="aspect-[4/4.4] w-full overflow-hidden bg-slate-100">
                      {doc.image ? (
                        <img src={doc.image} alt={doc.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 text-2xl sm:text-4xl font-semibold">
                          {doc.name?.[0]}
                        </div>
                      )}
                    </div>

                    <div className="px-2 sm:px-4 py-2 sm:py-4 flex-1 flex flex-col">
                      <p className="text-[10px] sm:text-sm font-semibold text-[#0B2B3A] line-clamp-1">{doc.name}</p>
                      <p className="text-[9px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1">{doc.doctorrole}</p>
                      <div className="flex items-center gap-1 mt-1 sm:mt-2">
                        <Star size={9} className="fill-amber-400 text-amber-400" />
                        <span className="text-[9px] sm:text-[11px] font-semibold text-[#0B2B3A]">
                          {doc.averageRating > 0 ? doc.averageRating : 'New'}
                        </span>
                      </div>
                      <p className="text-[9px] sm:text-[11px] text-slate-400 mt-1 flex items-center gap-1 line-clamp-1">
                        <MapPin size={8} /> {doc.location || '—'}
                      </p>
                      <p className="text-[9px] sm:text-[11px] text-[#1F8A93] font-semibold mt-0.5 line-clamp-1">
                        {doc.fee || '—'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* View All button — only if there are more doctors than preview */}
            {doctors.length > PREVIEW_COUNT && (
              <div className="mt-8 sm:mt-10 px-4 sm:px-0">
                <Link to={`/home/doctors?department=${department._id}`}>
                  <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 hover:text-white transition hover:border-slate-300 hover:bg-[#104560]">
                    View All {department.name} Doctors
                    <ArrowRight size={14} />
                  </button>
                </Link>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}