import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Stethoscope, LayoutDashboard, UserCircle, CalendarCheck, LogOut, Menu, X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const link = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
    isActive
      ? 'bg-[#1F8A93] text-white shadow-lg shadow-[#1F8A93]/30'
      : 'text-white/70 hover:bg-white/10 hover:text-white'
  }`

const Section = ({ title }) => (
  <p className="px-4 mt-6 mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
    {title}
  </p>
)

function SidebarContent({ onNavigate }) {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
    onNavigate?.()
  }

  return (
    <>
      <div className="flex items-center gap-2.5 px-3 pb-6 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
          <Stethoscope size={20} className="text-[#1F8A93]" />
        </div>
        <div className="min-w-0">
          <p className="text-white font-semibold text-lg leading-tight truncate"
             style={{ fontFamily: "'Fraunces', serif" }}>
            Bannu<span className="text-[#1F8A93]">Care</span>
          </p>
          <p className="text-[10px] text-white/40 uppercase tracking-widest">Doctor Panel</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto mt-4 pb-4">
        <Section title="Overview" />
        <NavLink to="/doctor" end className={link} onClick={onNavigate}>
          <LayoutDashboard size={17} /> Dashboard
        </NavLink>

        <Section title="Profile" />
        <NavLink to="/doctor/profile" className={link} onClick={onNavigate}>
          <UserCircle size={17} /> My Profile
        </NavLink>

        <Section title="Bookings" />
        <NavLink to="/doctor/appointments" className={link} onClick={onNavigate}>
          <CalendarCheck size={17} /> My Appointments
        </NavLink>
      </nav>

      <div className="border-t border-white/10 pt-4 mt-4 px-1">
        <div className="px-3 mb-3">
          <p className="text-xs text-white/40">Signed in as</p>
          <p className="text-sm text-white truncate">{user?.name}</p>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/10 hover:text-red-200 transition">
          <LogOut size={17} /> Logout
        </button>
      </div>
    </>
  )
}

export default function DoctorSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* ─── MOBILE TOP BAR ─── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0B2B3A] border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
            <Stethoscope size={17} className="text-[#1F8A93]" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight"
               style={{ fontFamily: "'Fraunces', serif" }}>
              Bannu<span className="text-[#1F8A93]">Care</span>
            </p>
            <p className="text-[9px] text-white/40 uppercase tracking-widest">Doctor</p>
          </div>
        </div>
        <button onClick={() => setOpen(true)}
          className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white">
          <Menu size={18} />
        </button>
      </div>

      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside className="hidden lg:flex w-64 min-h-screen bg-[#0B2B3A] flex-col py-6 px-3 shrink-0">
        <SidebarContent />
      </aside>

      {/* ─── MOBILE DRAWER ─── */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"
               onClick={() => setOpen(false)} />
          <aside className="relative w-72 max-w-[85vw] bg-[#0B2B3A] flex flex-col py-6 px-3 overflow-y-auto">
            <button onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/80">
              <X size={16} />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  )
}