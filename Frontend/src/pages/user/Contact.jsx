import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Headset } from 'lucide-react'
import MaleDoctor from '../../assets/MaleDoctor.png'

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');`
const heading = { fontFamily: "'Fraunces', serif" }

const channels = [
  { id: '01', title: 'Visit Our Hospital', desc: 'Bannu City, Khyber Pukhtoon Khwa, Pakistan. Open for walk-in consultations every day.', icon: MapPin, dark: false },
  { id: '02', title: 'Call Us Anytime', desc: '+92 3361110185 — our reception and emergency lines are answered 24 hours a day.', icon: Phone, dark: false },
  { id: '03', title: 'Email Support', desc: 'mussazeb123@gmail.com — send reports, queries or feedback and we reply within 24 hours.', icon: Mail, dark: false },
  { id: '04', title: 'Patient Helpdesk', desc: 'Dedicated coordinators help with appointments, insurance, records and follow-up care.', icon: Headset, dark: false },
]

const inputBase = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#1F8A93] focus:ring-4 focus:ring-[#1F8A93]/10 transition'
const labelBase = 'mb-2 block text-xs font-semibold uppercase tracking-wide text-[#0B2B3A]'

export default function Contact() {
  const [channelsState, setChannelsState] = useState(channels)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleMouseEnter = (index) =>
    setChannelsState((prev) => prev.map((item, i) => ({ ...item, dark: i === index })))
  const handleMouseLeave = () =>
    setChannelsState((prev) => prev.map((item) => ({ ...item, dark: false })))
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  const handleSubmit = (e) => { e.preventDefault(); setSent(true) }

  return (
    <div className="w-full bg-white font-sans text-slate-500 antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{FONT_IMPORT}</style>

      <section className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 w-full bg-[#F3F8FA] px-6 sm:px-10 lg:px-36 pt-16 pb-20">
        <div>
          <h1 className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 mb-10 px-4 py-1.5 text-xs font-semibold text-[#0B2B3A]">Contact Us</h1>
          <h1 style={heading} className="text-4xl lg:text-[3.25rem] font-semibold text-[#0B2B3A] leading-[1.1] mb-5 tracking-tight">
            <span className="text-[#0B2B3A]">We are here</span> to<br />help you, any<br />hour of the day
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-slate-500">
            Questions about a treatment, a report or a booking? Reach out and a real member of our care team will get back to you quickly.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/home/departments">
              <button className="mt-10 rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-semibold text-slate-700 hover:text-white transition hover:border-slate-300 hover:bg-[#104560]">
                Book an Appointment
              </button>
            </Link>
          </div>
        </div>
        <div className="relative mx-auto flex w-full max-w-md items-center justify-center py-10">
          <div className="absolute -left-4 top-16 w-72 h-72 lg:w-80 lg:h-80 rounded-full bg-[#D9EBEC] opacity-70 z-0"></div>
          <img src={MaleDoctor} alt="Contact our care team" className="relative z-10 w-full max-w-sm select-none" />
          <div className="left-0 top-20 sm:-left-4 absolute z-20 flex items-center gap-1.5 rounded-full border border-blue-100 bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> Pro Diagnostics
          </div>
          <div className="left-0 top-1/2 -translate-y-1/2 sm:-left-8 absolute z-20 flex items-center gap-1.5 rounded-full border border-blue-100 bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> World-Class Care
          </div>
          <div className="bottom-20 right-0 sm:-right-6 absolute z-20 flex items-center gap-1.5 rounded-full border border-blue-100 bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> 24/7 Patient Support
          </div>
        </div>
      </section>

      <section className="text-center w-full bg-white px-6 sm:px-10 lg:px-36 pb-28 pt-16">
        <div className="flex flex-col items-center">
          <h1 className="inline-flex items-center rounded-full border border-blue-100 mb-4 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-[#0B2B3A]">Reach Us</h1>
          <h2 style={heading} className="text-3xl font-semibold text-[#0B2B3A] mt-2 mb-3">
            Every way to get<br />in touch with us
          </h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto mt-5">
            Choose whichever channel suits you best — we answer all of them with the same care.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-5 text-left sm:grid-cols-2 lg:grid-cols-4">
          {channelsState.map((s, index) => {
            const Icon = s.icon
            return (
              <div key={s.id} onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}
                className={'relative flex flex-col justify-between rounded-2xl p-6 min-h-[220px] transition-all duration-500 ease-in-out ' +
                  (s.dark ? 'bg-[#0B2B3A] text-white' : 'bg-[#F3F8FA] text-slate-500')}>
                <div className="flex items-start justify-between">
                  <div className={'flex h-11 w-11 items-center justify-center rounded-xl ' + (s.dark ? 'bg-white/15' : 'bg-white')}>
                    <Icon className={'h-5 w-5 ' + (s.dark ? 'text-white' : 'text-[#0B2B3A]')} />
                  </div>
                  <span className={'text-xs font-medium ' + (s.dark ? 'text-white/60' : 'text-slate-400')}>{s.id}</span>
                </div>
                <div className="mt-8">
                  <h3 className={'text-base font-semibold ' + (s.dark ? 'text-white' : 'text-slate-800')}>{s.title}</h3>
                  <p className={'mt-2 text-[13px] leading-relaxed ' + (s.dark ? 'text-white/75' : 'text-slate-500')}>{s.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="text-center w-full bg-[#F3F8FA] px-6 sm:px-10 lg:px-36 pb-28 pt-16">
        <div className="flex flex-col items-center">
          <h1 className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 mb-4 text-xs font-semibold text-[#0B2B3A]">Send a Message</h1>
          <h2 style={heading} className="text-3xl font-semibold text-[#0B2B3A] leading-snug mt-2 mb-6">
            Tell us how we can help
          </h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Fill the form below and our patient support team will respond within 24 hours.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mx-auto mt-14 max-w-3xl rounded-2xl border border-slate-100 bg-white p-6 sm:p-10 text-left shadow-sm">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelBase}>Full Name</label>
              <input className={inputBase} type="text" name="name" value={form.name} onChange={handleChange} placeholder="Enter your full name" required />
            </div>
            <div>
              <label className={labelBase}>Email Address</label>
              <input className={inputBase} type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
            </div>
          </div>
          <div className="mt-5">
            <label className={labelBase}>Subject</label>
            <input className={inputBase} type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="What is your message about?" required />
          </div>
          <div className="mt-5">
            <label className={labelBase}>Message</label>
            <textarea className={inputBase + ' min-h-[140px] resize-none'} name="message" value={form.message} onChange={handleChange} placeholder="Write your message here..." required />
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button type="submit" className="bg-[#0B2B3A] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#123b4f] transition-colors shadow-sm">
              Send Message
            </button>
            <Link to="/home/departments">
              <button type="button" className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 hover:text-white transition hover:border-slate-300 hover:bg-[#104560]">
                Browse Departments
              </button>
            </Link>
          </div>
          {sent && (
            <p className="mt-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs font-semibold text-[#0B2B3A]">
              Thank you {form.name || 'there'} — your message has been sent. We will reply to {form.email || 'your email'} soon.
            </p>
          )}
        </form>
      </section>
    </div>
  )
}