import { useEffect, useMemo, useState } from 'react'
import { CalendarCheck, Clock, CheckCircle2, XCircle, Users, Phone, Mail, MapPin, FileText, Loader2 } from 'lucide-react'
import api from '../../api/axios.js'

const heading = { fontFamily: "'Fraunces', serif" }

const statusStyles = {
  pending: 'bg-amber-50 text-amber-700 border-amber-100',
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  cancelled: 'bg-red-50 text-red-600 border-red-100',
}

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    api.get('/appointment')
      .then(({ data }) => { if (data.success) setAppointments(data.appointments) })
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id, status) => {
    setUpdating(id)
    try {
      const { data } = await api.patch(`/appointment/${id}/status`, { status })
      if (data.success) setAppointments((p) => p.map((a) => (a._id === id ? { ...a, status: data.appointment.status } : a)))
    } finally { setUpdating(null) }
  }

  const stats = useMemo(() => ({
    total: appointments.length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  }), [appointments])

  const filtered = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter)

  const tabs = [
    { key: 'all', label: 'All', count: stats.total },
    { key: 'pending', label: 'Pending', count: stats.pending },
    { key: 'confirmed', label: 'Confirmed', count: stats.confirmed },
    { key: 'cancelled', label: 'Cancelled', count: stats.cancelled },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#1F8A93]">Bookings</p>
        <h1 className="text-3xl font-semibold text-[#0B2B3A] mt-1" style={heading}>Appointments</h1>
        <p className="text-sm text-slate-500 mt-2">Manage all patient booking requests.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { icon: Users, label: 'Total', value: stats.total, tone: 'bg-[#0B2B3A]' },
          { icon: Clock, label: 'Pending', value: stats.pending, tone: 'bg-amber-500' },
          { icon: CheckCircle2, label: 'Confirmed', value: stats.confirmed, tone: 'bg-emerald-500' },
          { icon: XCircle, label: 'Cancelled', value: stats.cancelled, tone: 'bg-red-500' },
        ].map((c, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className={`w-11 h-11 rounded-xl ${c.tone} flex items-center justify-center mb-4`}>
              <c.icon size={20} className="text-white" />
            </div>
            <p className="text-2xl font-semibold text-[#0B2B3A]" style={heading}>{loading ? '—' : c.value}</p>
            <p className="text-xs text-slate-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            className={`px-4 py-2 rounded-full text-xs font-semibold border transition ${filter === t.key ? 'bg-[#0B2B3A] text-white border-[#0B2B3A]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#1F8A93]'}`}>
            {t.label}
            <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${filter === t.key ? 'bg-white/20' : 'bg-slate-100'}`}>{t.count}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 flex flex-col items-center gap-3">
          <Loader2 size={26} className="text-[#1F8A93] animate-spin" />
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <FileText size={28} className="mx-auto text-slate-300 mb-3" />
          <p className="text-sm text-slate-500">No appointments in this view.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((a) => {
            const initials = (a.patientName || 'P').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
            return (
              <div key={a._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-72 shrink-0 p-6 border-b lg:border-b-0 lg:border-r border-slate-100 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0B2B3A] flex items-center justify-center text-white font-semibold shrink-0">{initials}</div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[#0B2B3A] truncate" style={heading}>{a.patientName}</p>
                      <span className={`inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusStyles[a.status]}`}>{a.status}</span>
                    </div>
                  </div>
                  <div className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <Detail icon={Phone} label="Phone" value={a.phone || '—'} />
                    <Detail icon={Mail} label="Email" value={a.email || '—'} truncate />
                    <Detail icon={CalendarCheck} label="Date" value={a.date || '—'} />
                    <Detail icon={Clock} label="Time" value={a.time || '—'} />
                    {a.doctor?.name && <Detail icon={Users} label="Doctor" value={a.doctor.name} />}
                    {a.department?.name && <Detail icon={MapPin} label="Department" value={a.department.name} />}
                  </div>
                  <div className="lg:w-56 shrink-0 p-6 border-t lg:border-t-0 lg:border-l border-slate-100 flex lg:flex-col gap-2">
                    {a.status !== 'confirmed' && (
                      <button disabled={updating === a._id} onClick={() => updateStatus(a._id, 'confirmed')}
                        className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 bg-[#1F8A93] text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-[#0B2B3A] transition disabled:opacity-60">
                        <CheckCircle2 size={13} /> Confirm
                      </button>
                    )}
                    {a.status !== 'cancelled' && (
                      <button disabled={updating === a._id} onClick={() => updateStatus(a._id, 'cancelled')}
                        className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 bg-white border border-red-100 text-red-600 text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-red-50 transition disabled:opacity-60">
                        <XCircle size={13} /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Detail({ icon: Icon, label, value, truncate }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
        <Icon size={10} className="text-[#1F8A93]" /> {label}
      </p>
      <p className={`text-sm text-[#0B2B3A] font-medium ${truncate ? 'truncate' : 'break-words'}`} title={value}>{value}</p>
    </div>
  )
}