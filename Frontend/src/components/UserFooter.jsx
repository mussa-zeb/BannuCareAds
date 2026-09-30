import { Link } from 'react-router-dom'
import { Stethoscope, MapPin, Phone, Mail, Clock } from 'lucide-react'

const heading = { fontFamily: "'Fraunces', serif" }

const HOSPITAL = {
  name: 'BannuCare',
  address: 'Bannu City, Khyber Pakhtunkhwa, Pakistan',
  mapUrl: 'https://maps.google.com/?q=Bannu+City+Khyber+Pakhtunkhwa+Pakistan',
  phone: '+92 336 111 0185',
  phoneHref: 'tel:+923361110185',
  email: 'mussazeb123@gmail.com',
  emailHref: 'mailto:mussazeb123@gmail.com',
  hours: 'Open 24/7',
}

export default function UserFooter() {
  const quickLinks = [
    { to: '/home', label: 'Home' },
    { to: '/home/departments', label: 'Departments' },
    { to: '/home/doctors', label: 'Doctors' },
    { to: '/home/contact', label: 'Contact' },
  ]

  const legalLinks = [
    { to: '/home/privacy-policy', label: 'Privacy Policy' },
    { to: '/home/terms-of-service', label: 'Terms of Service' },
  ]

  return (
    <footer className="bg-[#0B2B3A] text-white/70" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 pt-8 sm:pt-14 pb-5 sm:pb-8">

        {/* ─── MOBILE: compact ─── */}
        <div className="sm:hidden space-y-5">
          <div className="flex items-center justify-between">
            <Link to="/home" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Stethoscope size={16} className="text-[#1F8A93]" />
              </div>
              <span className="text-base font-semibold text-white" style={heading}>
                Bannu<span className="text-[#1F8A93]">Care</span>
              </span>
            </Link>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-medium text-white/80">Open 24/7</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {quickLinks.map((l) => (
              <Link key={l.to} to={l.to}
                className="text-[11px] text-white/70 hover:text-[#1F8A93] text-center py-1.5 rounded-lg transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

          <div className="space-y-2">
            <a href={HOSPITAL.mapUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-start gap-2 text-[11px] text-white/60 hover:text-[#1F8A93]">
              <MapPin size={12} className="text-[#1F8A93] shrink-0 mt-0.5" />
              <span className="leading-snug">{HOSPITAL.address}</span>
            </a>
            <div className="grid grid-cols-2 gap-2">
              <a href={HOSPITAL.phoneHref} className="flex items-center gap-2 text-[11px] text-white/60 hover:text-[#1F8A93]">
                <Phone size={11} className="text-[#1F8A93] shrink-0" />
                <span className="truncate">{HOSPITAL.phone}</span>
              </a>
              <a href={HOSPITAL.emailHref} className="flex items-center gap-2 text-[11px] text-white/60 hover:text-[#1F8A93]">
                <Mail size={11} className="text-[#1F8A93] shrink-0" />
                <span className="truncate">Email us</span>
              </a>
            </div>
          </div>
        </div>

        {/* ─── DESKTOP ─── */}
        <div className="hidden sm:grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/home" className="inline-flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Stethoscope size={20} className="text-[#1F8A93]" />
              </div>
              <span className="text-xl font-semibold text-white tracking-tight" style={heading}>
                Bannu<span className="text-[#1F8A93]">Care</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/60 max-w-xs">
              World-class specialists, modern diagnostics, and compassionate care
              under one roof — built around long-term outcomes, not just appointments.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-white/80">Open 24/7</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white mb-5" style={heading}>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}
                    className="text-sm text-white/60 hover:text-[#1F8A93] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white mb-5" style={heading}>
              Get in Touch
            </h4>
            <ul className="space-y-4">
              <li>
                <a href={HOSPITAL.mapUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-3 text-sm text-white/60 hover:text-[#1F8A93] transition-colors">
                  <MapPin size={16} className="text-[#1F8A93] flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{HOSPITAL.address}</span>
                </a>
              </li>
              <li>
                <a href={HOSPITAL.phoneHref}
                  className="flex items-center gap-3 text-sm text-white/60 hover:text-[#1F8A93] transition-colors">
                  <Phone size={16} className="text-[#1F8A93] flex-shrink-0" />
                  <span>{HOSPITAL.phone}</span>
                </a>
              </li>
              <li>
                <a href={HOSPITAL.emailHref}
                  className="flex items-center gap-3 text-sm text-white/60 hover:text-[#1F8A93] transition-colors">
                  <Mail size={16} className="text-[#1F8A93] flex-shrink-0" />
                  <span className="break-all">{HOSPITAL.email}</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Clock size={16} className="text-[#1F8A93] flex-shrink-0" />
                <span>{HOSPITAL.hours}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white mb-5" style={heading}>
              Visit Us
            </h4>
            <p className="text-sm text-white/60 leading-relaxed mb-5">
              Walk-ins welcome for OPD. Emergency department open around the clock.
            </p>
            <Link to="/home/departments">
              <button className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1F8A93] hover:border-[#1F8A93] transition-colors">
                Book an Appointment
              </button>
            </Link>
          </div>
        </div>

        {/* ─── Bottom bar ─── */}
        <div className="mt-5 sm:mt-12 pt-4 sm:pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-[10px] sm:text-xs text-white/50 text-center sm:text-left">
            © {new Date().getFullYear()} {HOSPITAL.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 sm:gap-6">
            {legalLinks.map((l) => (
              <Link key={l.to} to={l.to}
                className="text-[10px] sm:text-xs text-white/50 hover:text-[#1F8A93] transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}