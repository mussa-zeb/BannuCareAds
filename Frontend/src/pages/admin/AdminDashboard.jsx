import { useEffect, useState } from 'react'
import { Building2, Users, CalendarCheck, TrendingUp } from 'lucide-react'
import api from '../../api/axios.js'

const heading = { fontFamily: "'Fraunces', serif" }

export default function AdminDashboard() {
  const [stats, setStats] = useState({ departments: 0, doctors: 0, appointments: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/department'), api.get('/doctor'), api.get('/appointment')])
      .then(([d, doc, a]) => {
        setStats({
          departments: d.data.departments?.length || 0,
          doctors: doc.data.doctors?.length || 0,
          appointments: a.data.appointments?.length || 0,
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const cards = [
    { icon: Building2, label: 'Departments', value: stats.departments, tone: 'bg-[#1F8A93]' },
    { icon: Users, label: 'Doctors', value: stats.doctors, tone: 'bg-[#0B2B3A]' },
    { icon: CalendarCheck, label: 'Appointments', value: stats.appointments, tone: 'bg-[#10b981]' },
    { icon: TrendingUp, label: 'Growth', value: '+12%', tone: 'bg-[#f59e0b]' },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#1F8A93]">Dashboard</p>
        <h1 className="text-3xl font-semibold text-[#0B2B3A] mt-1" style={heading}>Welcome back, Admin</h1>
        <p className="text-sm text-slate-500 mt-2">Manage departments, doctors and appointments from one place.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition">
            <div className={`w-11 h-11 rounded-xl ${c.tone} flex items-center justify-center mb-4`}>
              <c.icon size={20} className="text-white" />
            </div>
            <p className="text-2xl font-semibold text-[#0B2B3A]" style={heading}>{loading ? '—' : c.value}</p>
            <p className="text-xs text-slate-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}