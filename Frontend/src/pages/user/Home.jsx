import { useEffect, useState } from 'react'
import { Search, Activity, Siren, FlaskConical, Pill, ScanLine, Building2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import FemaleDoctor from '../../assets/FemaleDoctor.png'
import MaleDoctor from '../../assets/MaleDoctor.png'
import api from '../../api/axios.js'
import { InContentAd, SponsoredCard } from '../../components/ads/Ads.jsx'

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');`
const heading = { fontFamily: "'Fraunces', serif" }

const CustomMarquee = ({ children }) => (
  <div className="overflow-hidden whitespace-nowrap bg-white py-3 border-y border-slate-100">
    <style>{`
      @keyframes marquee { 0% { transform: translate3d(0,0,0); } 100% { transform: translate3d(-50%,0,0); } }
      .animate-custom-marquee { display: inline-flex; animation: marquee 12s linear infinite; will-change: transform; }
      @media (min-width: 768px) { .animate-custom-marquee { animation-duration: 25s; } }
    `}</style>
    <div className="animate-custom-marquee flex gap-8">
      <div className="flex gap-8 shrink-0">{children}</div>
      <div className="flex gap-8 shrink-0" aria-hidden="true">{children}</div>
    </div>
  </div>
)

export default function Home() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/department')
      .then(({ data }) => { if (data.success) setDepartments(data.departments) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const services = [
    { icon: Siren, title: "Emergency Services", copy: "24/7 immediate care for critical conditions, accidents, and life-threatening situations." },
    { icon: Pill, title: "Pharmacy", copy: "Convenient access to prescriptions and health essentials, staffed by expert pharmacists." },
    { icon: ScanLine, title: "Radiology & Imaging", copy: "X-ray, CT, MRI and ultrasound diagnostics delivered with precision and speed." },
    { icon: FlaskConical, title: "Laboratory Services", copy: "State-of-the-art diagnostic labs supporting fast, reliable results." },
  ]

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{FONT_IMPORT}</style>

      {/* HERO */}
      <section className="bg-[#F3F8FA] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-center lg:min-h-[520px]">
          <div className="z-10">
            <div className="flex items-center gap-2 mb-5 sm:mb-6 justify-end lg:justify-start">
              <div className="ml-auto lg:ml-0 gap-2 shadow-sm inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700">
                <div className="w-2 h-2 rounded-full bg-[#10e47d] animate-pulse" />
                <span className="text-xs font-medium text-slate-600">2,500+ Doctors Online</span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-semibold text-[#0B2B3A] leading-[1.1] mb-4 sm:mb-5 tracking-tight" style={heading}>
              Premium Treatments for<br />a Healthy Lifestyle
            </h1>
            <p className="text-slate-500 text-[14px] sm:text-[15px] leading-relaxed mb-6 sm:mb-8 max-w-md">
              World-class specialists, modern diagnostics and compassionate care under one roof — built around long-term outcomes, not just appointments.
            </p>
            <div className="flex items-center gap-4 mb-8 sm:mb-10">
              <Link to="/home/departments">
                <button className="rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-semibold text-slate-700 hover:text-white transition hover:border-slate-300 hover:bg-[#104560]">
                  View Our Departments
                </button>
              </Link>
            </div>
            <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 p-4 flex items-center gap-3 max-w-sm border border-slate-100">
              <div className="bg-[#0B2B3A] rounded-xl p-2.5 text-white flex-shrink-0">
                <Search size={18} />
              </div>
              <div>
                <div className="font-semibold text-slate-800 text-sm">Search the Medical</div>
                <div className="text-xs text-slate-400">With more care options</div>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute right-4 top-4 w-56 h-56 sm:w-72 sm:h-72 lg:w-96 lg:h-96 rounded-full bg-[#D9EBEC] opacity-70 z-0"></div>
              <img src={FemaleDoctor} alt="Doctor"
                className="relative z-10 h-[300px] sm:h-[400px] lg:h-[480px] object-cover object-top rounded-3xl sm:ml-20"
                style={{ objectPosition: "center top" }} />
            </div>
          </div>
        </div>

        <CustomMarquee>
          <div className="bg-white">
            <div className="w-screen mx-auto px-6 py-2 flex">
              {[['4,500+', 'Happy Patients'], ['200', 'Hospital Rooms'], ['4,500+', 'Awards Won'], ['500+', 'Ambulances']].map(([v, l], i) => (
                <div key={i} className="ml-20 lg:ml-70">
                  <h1 className="text-lg lg:text-2xl font-semibold text-[#0B2B3A]" style={heading}>{v}</h1>
                  <p className="text-xs text-slate-500 mt-1 uppercase tracking-wide">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </CustomMarquee>
      </section>

      {/* DEPARTMENTS — 3 PER ROW */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <span className="text-[#1F8A93] text-xs font-semibold tracking-[0.2em] uppercase">Departments</span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#0B2B3A] mt-2 mb-3" style={heading}>Browse by Department</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Tailored services and expert solutions organized around the care you need.
            </p>
          </div>

          {loading ? (
            <p className="text-center text-sm text-slate-500 mt-10 sm:mt-12">Loading departments...</p>
          ) : departments.length === 0 ? (
            <div className="mt-10 sm:mt-12 max-w-md mx-auto bg-[#F3F8FA] rounded-2xl p-10 text-center">
              <Building2 size={32} className="mx-auto text-slate-300 mb-3" />
              <p className="text-sm text-slate-500">No departments have been added yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4 mt-8 sm:mt-12">
              {departments.slice(0, 15).map((d) => (
                <Link key={d._id} to={`/home/departments/${d._id}`}>
                  <div className="group bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-2 sm:p-3 flex flex-col items-center gap-1.5 sm:gap-3 cursor-pointer hover:border-[#1F8A93] hover:shadow-lg hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300">
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
                    <p className="text-[9px] sm:text-[10px] font-semibold tracking-[0.1em] uppercase text-[#0B2B3A] text-center line-clamp-2 leading-tight">
                      {d.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8 sm:mt-10">
            <Link to="/home/departments">
              <button className="rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-semibold text-slate-700 hover:text-white transition hover:border-slate-300 hover:bg-[#104560]">
                View All Departments
              </button>
            </Link>
          </div>
        </div>
      </section>

      <InContentAd className="pb-10 sm:pb-14" />
      <SponsoredCard className="pb-10 sm:pb-14" />

      {/* SERVICES */}
      <section className="py-12 sm:py-20 bg-[#F3F8FA] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
            <div className="lg:col-span-1">
              <span className="text-[#1F8A93] text-xs font-semibold tracking-[0.2em] uppercase">What we offer</span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#0B2B3A] leading-snug mt-2 mb-6" style={heading}>
                World-class healthcare for you and your loved ones
              </h2>
              {services.slice(0, 2).map((s, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#0B2B3A] flex items-center justify-center flex-shrink-0">
                      <s.icon size={20} className="text-white" strokeWidth={1.75} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0B2B3A] text-sm mb-1" style={heading}>{s.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{s.copy}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-1 flex flex-col gap-4 lg:mt-16">
              {services.slice(2, 4).map((s, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#0B2B3A] flex items-center justify-center flex-shrink-0">
                      <s.icon size={20} className="text-white" strokeWidth={1.75} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0B2B3A] text-sm mb-1" style={heading}>{s.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{s.copy}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-center gap-2 px-2 opacity-40 text-[#1F8A93]">
                <Activity size={22} strokeWidth={1.5} />
                <div className="h-px flex-1 bg-[#1F8A93]" />
                <Activity size={22} strokeWidth={1.5} />
              </div>
            </div>
            <div className="lg:col-span-1 flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute -left-4 top-20 w-80 h-80 rounded-full bg-[#D9EBEC] opacity-70 z-0"></div>
                <img src={MaleDoctor} alt="Male Doctor"
                  className="relative z-10 h-[320px] sm:h-[420px] object-cover object-top rounded-3xl"
                  style={{ objectPosition: "center top" }} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}