import { useEffect, useMemo, useState } from 'react'
import { CalendarCheck, Clock, CheckCircle2, XCircle, Phone, Mail, MapPin, User, Loader2, Search, Filter } from 'lucide-react'
import api from '../../api/axios.js'

const heading = { fontFamily: "'Fraunces', serif" }

const statusStyles = {
  pending: 'bg-amber-50 text-amber-700 border-amber-100',
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  cancelled: 'bg-red-50 text-red-600 border-red-100',
}
const statusTone = {
  pending: 'bg-amber-500',
  confirmed: 'bg-emerald-500',
  cancelled: 'bg-red-500',
}

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/appointment')
      .then(({ data }) => { if (data.success) setAppointments(data.appointments) })
      .catch((err) => setError(err.response?.data?.msg || 'Failed to load appointments'))
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id, status) => {
    setUpdating(id)
    try {
      const { data } = await api.patch(`/appointment/${id}/status`, { status })
      if (data.success) setAppointments((prev) => prev.map((a) => (a._id === id ? { ...a, status: data.appointment.status } : a)))
    } catch (err) { setError(err.response?.data?.msg || 'Failed to update status') }
    finally { setUpdating(null) }
  }

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return {
      total: appointments.length,
      today: appointments.filter((a) => a.date === today).length,
      pending: appointments.filter((a) => a.status === 'pending').length,
      confirmed: appointments.filter((a) => a.status === 'confirmed').length,
      cancelled: appointments.filter((a) => a.status === 'cancelled').length,
    }
  }, [appointments])

  const filtered = useMemo(() => {
    let list = appointments
    if (filter !== 'all') list = list.filter((a) => a.status === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((a) => (a.patientName || '').toLowerCase().includes(q) || (a.email || '').toLowerCase().includes(q) || (a.phone || '').toLowerCase().includes(q))
    }
    return list
  }, [appointments, filter, search])

  const tabs = [
    { key: 'all', label: 'All', count: stats.total },
    { key: 'pending', label: 'Pending', count: stats.pending },
    { key: 'confirmed', label: 'Confirmed', count: stats.confirmed },
    { key: 'cancelled', label: 'Cancelled', count: stats.cancelled },
  ]

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#1F8A93]">Bookings</p>
          <h1 className="text-3xl sm:text-[2.25rem] font-semibold text-[#0B2B3A] mt-1 leading-tight" style={heading}>My Appointments</h1>
          <p className="text-sm text-slate-500 mt-2">Review patient requests, confirm visits and manage your daily schedule.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-[#0B2B3A] shadow-sm">
          <CalendarCheck size={13} className="text-[#1F8A93]" /> {stats.today} booked for today
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl px-4 py-3 text-sm font-medium border bg-red-50 text-red-600 border-red-100">{error}</div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: stats.total, tone: 'bg-[#0B2B3A]' },
          { label: 'Pending', value: stats.pending, tone: 'bg-amber-500' },
          { label: 'Confirmed', value: stats.confirmed, tone: 'bg-emerald-500' },
          { label: 'Cancelled', value: stats.cancelled, tone: 'bg-red-500' },
        ].map((c, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className={`w-2 h-2 rounded-full mb-3 ${c.tone}`} />
            <p className="text-2xl font-semibold text-[#0B2B3A]" style={heading}>{loading ? '—' : c.value}</p>
            <p className="text-xs text-slate-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setFilter(t.key)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-colors ${filter === t.key ? 'bg-[#0B2B3A] text-white border-[#0B2B3A]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#1F8A93] hover:text-[#0B2B3A]'}`}>
              {t.label}
              <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${filter === t.key ? 'bg-white/20' : 'bg-slate-100'}`}>{t.count}</span>
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 bg-white rounded-full border border-slate-200 px-4 py-2 w-full sm:w-72">
          <Search size={14} className="text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, phone or email"
            className="flex-1 outline-none text-sm text-slate-700 placeholder:text-slate-400 bg-transparent" />
          {search && <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600"><XCircle size={14} /></button>}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-14 flex flex-col items-center justify-center gap-3">
          <Loader2 size={26} className="text-[#1F8A93] animate-spin" />
          <p className="text-sm text-slate-500">Loading appointments...</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState filter={filter} hasSearch={!!search} />
      ) : (
        <div className="space-y-4">
          {filtered.map((a) => (
            <AppointmentRow key={a._id} a={a} isUpdating={updating === a._id} onUpdate={updateStatus} />
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyState({ filter, hasSearch }) {
  const titles = { all: 'No appointments yet', pending: 'No pending requests', confirmed: 'No confirmed appointments', cancelled: 'No cancelled appointments' }
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-14 text-center">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-[#F3F8FA] flex items-center justify-center mb-4">
        <Filter size={22} className="text-[#1F8A93]" />
      </div>
      <p className="text-base font-semibold text-[#0B2B3A]" style={heading}>{hasSearch ? 'No matches found' : titles[filter]}</p>
      <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
        {hasSearch ? 'Try a different search term or clear the filter.' : 'Patient requests will appear here as soon as they are submitted.'}
      </p>
    </div>
  )
}

function AppointmentRow({ a, isUpdating, onUpdate }) {
  const initials = (a.patientName || 'P').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className={`h-1 ${statusTone[a.status] || statusTone.pending}`} />
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-72 shrink-0 p-6 border-b lg:border-b-0 lg:border-r border-slate-100 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0B2B3A] flex items-center justify-center text-white font-semibold shrink-0">{initials}</div>
          <div className="min-w-0">
            <p className="font-semibold text-[#0B2B3A] truncate" style={heading}>{a.patientName}</p>
            <span className={`inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusStyles[a.status] || statusStyles.pending}`}>{a.status}</span>
          </div>
        </div>
        <div className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Detail icon={Phone} label="Phone" value={a.phone || '—'} />
          <Detail icon={Mail} label="Email" value={a.email || '—'} truncate />
          <Detail icon={CalendarCheck} label="Date" value={a.date || '—'} />
          <Detail icon={Clock} label="Time" value={a.time || '—'} />
          {a.location && <Detail icon={MapPin} label="Location" value={a.location} />}
          {a.department?.name && <Detail icon={User} label="Department" value={a.department.name} />}
          {a.message && (
            <div className="sm:col-span-2 lg:col-span-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Patient Note</p>
              <p className="text-sm text-slate-600 leading-relaxed">{a.message}</p>
            </div>
          )}
        </div>
        <div className="lg:w-52 shrink-0 p-6 border-t lg:border-t-0 lg:border-l border-slate-100 flex lg:flex-col gap-2">
          {a.status !== 'confirmed' && (
            <button disabled={isUpdating} onClick={() => onUpdate(a._id, 'confirmed')}
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 bg-[#1F8A93] text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-[#0B2B3A] transition-colors disabled:opacity-60">
              {isUpdating ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />} Confirm
            </button>
          )}
          {a.status !== 'cancelled' && (
            <button disabled={isUpdating} onClick={() => onUpdate(a._id, 'cancelled')}
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 bg-white border border-red-100 text-red-600 text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-60">
              <XCircle size={13} /> Cancel
            </button>
          )}
          {a.status === 'confirmed' && (
            <button disabled={isUpdating} onClick={() => onUpdate(a._id, 'pending')}
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-60">
              <Clock size={13} /> Set Pending
            </button>
          )}
          {a.status === 'cancelled' && (
            <button disabled={isUpdating} onClick={() => onUpdate(a._id, 'pending')}
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-60">
              <Clock size={13} /> Restore
            </button>
          )}
        </div>
      </div>
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