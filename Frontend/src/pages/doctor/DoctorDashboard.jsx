import { useEffect, useMemo, useState } from 'react'
import { CalendarCheck, Clock, CheckCircle2, XCircle, Users, Phone, Mail, MapPin, FileText, Loader2 } from 'lucide-react'
import api from '../../api/axios.js'
import { useAuth } from '../../context/AuthContext.jsx'

const heading = { fontFamily: "'Fraunces', serif" }
const statusStyles = {
  pending: 'bg-amber-50 text-amber-700 border-amber-100',
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  cancelled: 'bg-red-50 text-red-600 border-red-100',
}

export default function DoctorDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/appointment')
      .then(({ data }) => { if (data.success) setAppointments(data.appointments) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return {
      today: appointments.filter((a) => a.date === today).length,
      pending: appointments.filter((a) => a.status === 'pending').length,
      confirmed: appointments.filter((a) => a.status === 'confirmed').length,
      total: appointments.length,
    }
  }, [appointments])

  const statCards = [
    { icon: CalendarCheck, label: "Today's Appointments", value: stats.today, tone: 'bg-[#1F8A93]' },
    { icon: Clock, label: 'Pending Requests', value: stats.pending, tone: 'bg-amber-500' },
    { icon: CheckCircle2, label: 'Confirmed', value: stats.confirmed, tone: 'bg-emerald-500' },
    { icon: Users, label: 'Total Bookings', value: stats.total, tone: 'bg-[#0B2B3A]' },
  ]

  const upcoming = appointments.slice(0, 5)

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#1F8A93]">Dashboard</p>
          <h1 className="text-3xl sm:text-[2.25rem] font-semibold text-[#0B2B3A] mt-1 leading-tight" style={heading}>
            Welcome, Dr. {user?.name?.split(' ')[0] || 'Doctor'}
          </h1>
          <p className="text-sm text-slate-500 mt-2">Here's a snapshot of your appointments and patient requests.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Available for bookings
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((c, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-11 h-11 rounded-xl ${c.tone} flex items-center justify-center mb-4`}>
              <c.icon size={20} className="text-white" strokeWidth={2} />
            </div>
            <p className="text-2xl font-semibold text-[#0B2B3A]" style={heading}>{loading ? '—' : c.value}</p>
            <p className="text-xs text-slate-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#0B2B3A]" style={heading}>Recent Requests</h2>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 flex flex-col items-center justify-center gap-3">
          <Loader2 size={26} className="text-[#1F8A93] animate-spin" />
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      ) : upcoming.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <FileText size={28} className="mx-auto text-slate-300 mb-3" />
          <p className="text-sm text-slate-500">No appointments yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {upcoming.map((a) => (
            <div key={a._id} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#0B2B3A] flex items-center justify-center text-white font-semibold shrink-0">
                {(a.patientName || 'P')?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#0B2B3A] truncate">{a.patientName}</p>
                <p className="text-xs text-slate-500 truncate flex items-center gap-2 mt-0.5">
                  <span className="inline-flex items-center gap-1"><CalendarCheck size={10} /> {a.date}</span>
                  <span className="inline-flex items-center gap-1"><Clock size={10} /> {a.time}</span>
                </p>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shrink-0 ${statusStyles[a.status]}`}>{a.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}