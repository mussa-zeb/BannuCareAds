import { Link } from 'react-router-dom'
import Navbar from '../../components/UserNavbar.jsx'

const heading = { fontFamily: "'Fraunces', serif" }

const sections = [
  {
    id: '01',
    title: 'Acceptance of Terms',
    body: [
      'By accessing BannuCare, booking an appointment or using any part of this website, you agree to be bound by these Terms of Service and all applicable laws of Pakistan.',
      'If you do not agree with any part of these terms, please discontinue use of the website and our online booking services.',
    ],
  },
  {
    id: '02',
    title: 'Medical Disclaimer',
    body: [
      'The content on this website is provided for general information only and is not a substitute for professional medical advice, diagnosis or treatment.',
      'Always seek the guidance of a qualified doctor regarding any medical condition. Never disregard professional advice or delay seeking it because of something you read here.',
      'In a medical emergency, contact our emergency line or your nearest hospital immediately instead of using the online form.',
    ],
  },
  {
    id: '03',
    title: 'Appointments and Cancellations',
    body: [
      'Appointment requests submitted online are confirmed only after our team contacts you by phone or email.',
      'Please cancel or reschedule at least 4 hours before your slot so it can be offered to another patient.',
      'Repeated no-shows may result in restrictions on future online booking privileges.',
    ],
  },
  {
    id: '04',
    title: 'User Responsibilities',
    body: [
      'You agree to provide accurate, current and complete information when booking an appointment or contacting our team.',
      'You may not use this website to transmit harmful code, attempt unauthorised access, or interfere with the experience of other patients.',
      'Records and reports accessed through this site are personal and must not be shared with unauthorised persons.',
    ],
  },
  {
    id: '05',
    title: 'Fees and Payments',
    body: [
      'Consultation fees displayed on doctor profiles are indicative and may change based on the treatment plan, tests and procedures required.',
      'Final billing is confirmed at the hospital reception. Receipts are issued for every payment.',
    ],
  },
  {
    id: '06',
    title: 'Intellectual Property',
    body: [
      'All content on this website — text, graphics, logos, icons, illustrations and layout — is the property of BannuCare and protected by copyright law.',
      'You may not reproduce, distribute or create derivative works from this content without written permission.',
    ],
  },
  {
    id: '07',
    title: 'Limitation of Liability',
    body: [
      'BannuCare is not liable for any indirect or consequential loss arising from use of this website, including interruptions, delays or inaccuracies in online information.',
      'Nothing in these terms limits liability for clinical negligence, which remains governed by applicable medical regulations.',
    ],
  },
  {
    id: '08',
    title: 'Changes to These Terms',
    body: [
      'We may update these Terms of Service from time to time. The revised version takes effect as soon as it is published on this page.',
      'Continued use of the website after changes are posted means you accept the updated terms.',
    ],
  },
]

export default function TermsOfService() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <section className="w-full bg-[#F3F8FA] px-4 sm:px-10 lg:px-36 pt-10 sm:pt-16 pb-10 sm:pb-20 text-center">
        <div className="flex flex-col items-center">
          <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 mb-6 px-4 py-1.5 text-xs font-semibold text-[#0B2B3A]">
            Legal
          </span>
          <h1 style={heading} className="text-3xl sm:text-4xl lg:text-[3.25rem] font-semibold text-[#0B2B3A] leading-[1.1] mb-4 tracking-tight">
            Terms of Service
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-slate-500">
            Please read these terms carefully before using BannuCare's website,
            online booking and patient services.
          </p>
          <span className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-slate-700 shadow-sm">
            Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
      </section>

      <section className="w-full bg-white px-4 sm:px-10 lg:px-36 pb-16 sm:pb-28 pt-10 sm:pt-16">
        <div className="mx-auto max-w-3xl flex flex-col gap-4 sm:gap-5">
          {sections.map((s) => (
            <div key={s.id}
              className="rounded-2xl border border-slate-100 bg-[#F3F8FA] p-5 sm:p-8 text-left hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <h3 className="text-sm sm:text-base font-semibold text-slate-800 pr-3" style={heading}>
                  {s.title}
                </h3>
                <span className="text-xs font-medium text-slate-400 shrink-0">{s.id}</span>
              </div>
              {s.body.map((p, i) => (
                <p key={i} className="mt-3 text-[12px] sm:text-[13px] leading-relaxed text-slate-500">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="text-center w-full bg-[#F3F8FA] px-4 sm:px-10 lg:px-36 pb-16 sm:pb-28 pt-10 sm:pt-16">
        <div className="flex flex-col items-center">
          <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 mb-4 text-xs font-semibold text-[#0B2B3A]">
            Questions?
          </span>
          <h2 style={heading} className="text-2xl sm:text-3xl font-semibold text-[#0B2B3A] leading-snug mt-2 mb-4 sm:mb-6">
            Need clarification on any term?
          </h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Our patient support team is available 24/7 to explain anything on this page.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link to="/home/contact">
              <button className="rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-semibold text-slate-700 hover:text-white transition hover:border-slate-300 hover:bg-[#104560]">
                Contact Us
              </button>
            </Link>
            <Link to="/home/privacy-policy">
              <button className="rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-semibold text-slate-700 hover:text-white transition hover:border-slate-300 hover:bg-[#104560]">
                Privacy Policy
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}