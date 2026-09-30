import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Stethoscope, Menu, X, UserCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const heading = { fontFamily: "'Fraunces', serif" }

const links = [
  { to: '/home', label: 'Home' },
  { to: '/home/departments', label: 'Departments' },
  { to: '/home/doctors', label: 'Doctors' },
  { to: '/home/about', label: 'About Us' },
  { to: '/home/contact', label: 'Contact' },
]

export default function UserNavbar() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="bg-white/80 backdrop-blur fixed top-0 w-full z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#0B2B3A] flex items-center justify-center">
            <Stethoscope size={20} className="text-white" strokeWidth={2} />
          </div>
          <span className="text-xl font-semibold text-[#0B2B3A] tracking-tight" style={heading}>
            Bannu<span className="text-[#1F8A93]">Care</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link key={l.to} to={l.to}
              className="text-sm font-medium text-[#0B2B3A] hover:text-[#1F8A93] transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-[#0B2B3A]">
                <UserCircle size={18} className="text-[#1F8A93]" />
                <span className="font-medium">{user.name}</span>
              </div>
              <button onClick={handleLogout}
                className="text-sm font-medium text-slate-500 hover:text-red-500 transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/">
              <button className="bg-[#0B2B3A] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#123b4f] transition-colors shadow-sm">
                Login
              </button>
            </Link>
          )}

          <button onClick={() => setOpen(!open)} className="md:hidden text-[#0B2B3A]">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 flex flex-col gap-3">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className="text-sm font-medium text-[#0B2B3A] hover:text-[#1F8A93] py-1">
              {l.label}
            </Link>
          ))}
          {user && (
            <button onClick={handleLogout}
              className="text-left text-sm font-medium text-red-500 mt-2">
              Logout ({user.name})
            </button>
          )}
        </div>
      )}
    </header>
  )
}