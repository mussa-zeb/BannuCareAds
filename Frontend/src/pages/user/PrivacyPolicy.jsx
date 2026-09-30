import { Link } from 'react-router-dom'
import Navbar from '../../components/UserNavbar.jsx'

const heading = { fontFamily: "'Fraunces', serif" }

const sections = [
  {
    id: '01',
    title: 'Information We Collect',
    body: [
      'Personal details you provide when booking an appointment or contacting us — name, phone number, email address, city and preferred schedule.',
      'Medical information shared voluntarily, such as symptoms, previous reports and the department or specialist you wish to consult.',
      'Basic technical data such as browser type and pages visited, used only to keep the website fast and secure.',
    ],
  },
  {
    id: '02',
    title: 'How We Use Your Information',
    body: [
      'To confirm, reschedule and manage your appointments with the right specialist.',
      'To share test results, prescriptions and follow-up reminders through secure channels.',
      'To improve our services, waiting times and the quality of care we provide.',
    ],
  },
  {
    id: '03',
    title: 'Medical Confidentiality',
    body: [
      'Your medical records are confidential and accessible only to the treating doctor and authorised clinical staff.',
      'We never sell patient data, and we never share medical records, appointment details or any personal health information with advertisers.',
    ],
  },
  {
    id: '04',
    title: 'Data Security',
    body: [
      'Records are stored on encrypted, access-controlled systems with regular security audits and backups.',
      'Staff access is granted strictly on a need-to-know basis and every access event is logged.',
      'While we apply strong safeguards, no online transmission is completely risk-free, so please avoid sending sensitive reports over unsecured channels.',
    ],
  },
  {
    id: '05',
    title: 'Cookies',
    body: [
      'We use minimal cookies to remember your preferences and keep your session active while browsing.',
      'You can disable cookies in your browser settings; core pages will continue to work, though some convenience features may not.',
    ],
  },
  {
    id: '06',
    title: 'Advertising',
    body: [
      'This website displays advertisements served by third-party advertising partners (such as Adsterra). These partners may use cookies and similar technologies to show ads and measure their performance.',
      'Advertisements are clearly separate from our medical content. Ads are not shown inside admin or doctor panels, and BannuCare does not endorse advertised products or services.',
      'We never pass your medical or appointment information to advertising partners. You can limit ad personalisation through your browser or device settings.',
    ],
  },
  {
    id: '07',
    title: 'Sharing With Third Parties',
    body: [
      'We share information only with partner laboratories, pharmacies or insurers directly involved in your treatment.',
      'Disclosure may also occur where required by law, a court order or a legitimate public-health obligation.',
    ],
  },
  {
    id: '08',
    title: 'Your Rights',
    body: [
      'You may request a copy of your medical records, ask for corrections to inaccurate details, or request deletion where legally permitted.',
      'You can opt out of appointment reminders and newsletters at any time by contacting our helpdesk.',
    ],
  },
  {
    id: '09',
    title: 'Contact Us',
    body: [
      'For any privacy question or data request, write to mussazeb123@gmail.com or call +92 336 111 0185.',
      'You can also visit our reception at Bannu City, Khyber Pakhtunkhwa, Pakistan.',
    ],
  },
]

export default function PrivacyPolicy() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* HERO */}
      <section className="w-full bg-[#F3F8FA] px-4 sm:px-10 lg:px-36 pt-10 sm:pt-16 pb-10 sm:pb-20 text-center">
        <div className="flex flex-col items-center">
          <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 mb-6 px-4 py-1.5 text-xs font-semibold text-[#0B2B3A]">
            Legal
          </span>
          <h1 style={heading} className="text-3xl sm:text-4xl lg:text-[3.25rem] font-semibold text-[#0B2B3A] leading-[1.1] mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-slate-500">
            Your health data is personal. Here is exactly what we collect, why we collect it,
            and how we keep it protected.
          </p>
          <span className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-slate-700 shadow-sm">
            Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
      </section>

      {/* CONTENT */}
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

      {/* CTA */}
      <section className="text-center w-full bg-[#F3F8FA] px-4 sm:px-10 lg:px-36 pb-16 sm:pb-28 pt-10 sm:pt-16">
        <div className="flex flex-col items-center">
          <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 mb-4 text-xs font-semibold text-[#0B2B3A]">
            Your Data
          </span>
          <h2 style={heading} className="text-2xl sm:text-3xl font-semibold text-[#0B2B3A] leading-snug mt-2 mb-4 sm:mb-6">
            Want a copy of your records?
          </h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Reach out and our team will process your request within 7 working days.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link to="/home/contact">
              <button className="rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-semibold text-slate-700 hover:text-white transition hover:border-slate-300 hover:bg-[#104560]">
                Contact Us
              </button>
            </Link>
            <Link to="/home/terms-of-service">
              <button className="rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-semibold text-slate-700 hover:text-white transition hover:border-slate-300 hover:bg-[#104560]">
                Terms of Service
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}