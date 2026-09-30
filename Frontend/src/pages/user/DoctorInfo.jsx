import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Star, MapPin, Briefcase, Calendar, Clock, CheckCircle2,
  BadgeCheck, Crown, Phone, Mail, Loader2, User, MessageSquare,
  ChevronDown, ChevronUp, Quote,
} from 'lucide-react'
import api from '../../api/axios.js'
import { InContentAd } from '../../components/ads/Ads.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import StarRating from '../../components/StarRating.jsx'

const heading = { fontFamily: "'Fraunces', serif" }
const input = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#1F8A93] focus:ring-4 focus:ring-[#1F8A93]/10 transition'
const label = 'block text-xs font-semibold uppercase tracking-wide text-[#0B2B3A] mb-2'

const TIME_SLOTS = ['Dawn', 'Morning', 'Evening', 'Noon', 'Night', 'Midnight']
const ratingLabel = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very good', 5: 'Excellent' }

const VISIBLE_REVIEWS = 3

export default function DoctorInfo() {
  const { id } = useParams()
  const { user } = useAuth()

  const [doctor, setDoctor] = useState(null)
  const [reviews, setReviews] = useState([])
  const [avgRating, setAvgRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewMsg, setReviewMsg] = useState({ type: '', text: '' })

  const [showAllReviews, setShowAllReviews] = useState(false)

  const [bookingForm, setBookingForm] = useState({
    patientName: '', email: '', phone: '', date: '', time: '', message: '',
  })
  const [booking, setBooking] = useState(false)
  const [bookingMsg, setBookingMsg] = useState('')

  const loadAll = async () => {
    try {
      const [dRes, rRes] = await Promise.all([
        api.get(`/doctor/${id}`),
        api.get(`/review/doctor/${id}`),
      ])
      if (dRes.data.success) setDoctor(dRes.data.doctor)
      if (rRes.data.success) {
        setReviews(rRes.data.reviews)
        setAvgRating(rRes.data.averageRating)
        setTotalReviews(rRes.data.totalReviews)
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to load doctor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAll() }, [id])

  useEffect(() => {
    if (user) {
      setBookingForm((p) => ({
        ...p,
        patientName: p.patientName || user.name || '',
        email: p.email || user.email || '',
      }))
    }
  }, [user])

  const myReview = useMemo(
    () => (user ? reviews.find((r) => r.userId === user.id || r.userId === user._id) : null),
    [reviews, user]
  )

  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, VISIBLE_REVIEWS)
  const hasMore = reviews.length > VISIBLE_REVIEWS

  const submitReview = async (e) => {
    e.preventDefault()
    if (!user) return
    setSubmittingReview(true)
    setReviewMsg({ type: '', text: '' })
    try {
      const { data } = await api.post(`/review/doctor/${id}`, {
        rating: reviewRating,
        comment: reviewComment,
      })
      if (data.success) {
        setReviewMsg({ type: 'ok', text: 'Thank you! Your review has been posted.' })
        setReviewComment('')
        await loadAll()
      } else {
        setReviewMsg({ type: 'err', text: data.msg || 'Something went wrong' })
      }
    } catch (err) {
      setReviewMsg({
        type: 'err',
        text: err.response?.data?.msg || 'Failed to submit review',
      })
    } finally {
      setSubmittingReview(false)
    }
  }

  const submitBooking = async (e) => {
    e.preventDefault()
    setBooking(true)
    setBookingMsg('')
    try {
      const { data } = await api.post('/appointment', {
        ...bookingForm,
        doctor: doctor._id,
        department: doctor.department?._id || doctor.department,
        location: doctor.location || '',
      })
      if (data.success) {
        setBookingMsg('Appointment requested! We will confirm shortly.')
        setBookingForm((p) => ({ ...p, date: '', time: '', message: '' }))
      }
    } catch (err) {
      setBookingMsg(err.response?.data?.msg || 'Failed to book')
    } finally {
      setBooking(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 size={26} className="animate-spin text-[#1F8A93]" />
        <p className="text-sm">Loading doctor profile...</p>
      </div>
    )
  }

  if (error || !doctor) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-500">
        <User size={32} className="text-slate-300" />
        <p className="text-sm">{error || 'Doctor not found'}</p>
        <Link to="/home/doctors">
          <button className="mt-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-[#104560] hover:text-white transition">
            Back to doctors
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* HERO */}
      <section className="grid grid-cols-1 items-center gap-8 lg:gap-12 lg:grid-cols-2 w-full bg-[#F3F8FA] px-4 sm:px-10 lg:px-36 pt-10 sm:pt-16 pb-12 sm:pb-20">
        <div>
          <Link to="/home/doctors"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1F8A93] hover:underline mb-4 sm:mb-6">
            ← Back to doctors
          </Link>

          <h1 className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-semibold text-[#0B2B3A]">
            {doctor.department?.name || 'Specialist'}
          </h1>

          <h1 style={heading} className="text-3xl sm:text-4xl lg:text-[3.25rem] font-semibold text-[#0B2B3A] leading-[1.1] mb-4 sm:mb-5 tracking-tight">
            {doctor.name}
            <br />
            <span className="text-[#1F8A93] text-lg sm:text-2xl lg:text-3xl">{doctor.doctorrole}</span>
          </h1>

          {doctor.about && (
            <p className="mt-4 sm:mt-6 max-w-md text-sm leading-relaxed text-slate-500">{doctor.about}</p>
          )}

          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-white/90 px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-[11px] font-semibold text-slate-700 shadow-sm">
              <Briefcase size={10} className="text-[#1F8A93]" /> {doctor.experience || 'Experienced'}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-white/90 px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-[11px] font-semibold text-slate-700 shadow-sm">
              <Star size={10} className="fill-amber-400 text-amber-400" />
              {avgRating > 0 ? avgRating : 'New'}
            </span>
            {doctor.verified && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-[11px] font-semibold text-blue-700">
                <BadgeCheck size={10} /> Verified
              </span>
            )}
            {doctor.pro && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-[11px] font-semibold text-amber-700">
                <Crown size={10} /> Pro
              </span>
            )}
          </div>

          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3">
            <a href="#book">
              <button className="rounded-full border border-[#0B2B3A] bg-[#0B2B3A] px-5 sm:px-6 py-2 sm:py-2.5 text-sm font-semibold text-white hover:bg-[#123b4f] transition">
                Book Appointment
              </button>
            </a>
            <a href="#reviews">
              <button className="rounded-full border border-slate-200 bg-white px-5 sm:px-6 py-2 sm:py-2.5 text-sm font-semibold text-slate-700 hover:bg-[#104560] hover:text-white transition">
                Read Reviews
              </button>
            </a>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-md items-center justify-center py-4 sm:py-6">
          <div className="absolute right-4 top-4 w-56 h-56 sm:w-72 sm:h-72 lg:w-96 lg:h-96 rounded-full bg-[#D9EBEC] opacity-70 z-0"></div>
          {doctor.image ? (
            <img src={doctor.image} alt={doctor.name}
              className="relative z-10 h-[320px] sm:h-[420px] w-full max-w-sm object-cover object-top rounded-3xl select-none" />
          ) : (
            <div className="relative z-10 h-[320px] sm:h-[420px] w-full max-w-sm rounded-3xl bg-[#0B2B3A] flex items-center justify-center text-white text-6xl font-semibold">
              {doctor.name?.[0]}
            </div>
          )}
        </div>
      </section>

      <InContentAd className="py-8 sm:py-12" />

      {/* SCHEDULE */}
      <section className="text-center w-full bg-white px-4 sm:px-10 lg:px-36 pb-14 sm:pb-24 pt-10 sm:pt-16">
        <div className="flex flex-col items-center">
          <h1 className="inline-flex items-center rounded-full border border-blue-100 mb-3 sm:mb-4 bg-blue-50 px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-semibold text-[#0B2B3A]">Schedule</h1>
          <h2 style={heading} className="text-2xl sm:text-3xl font-semibold text-[#0B2B3A] mt-2 mb-3">
            Availability &amp; consultation details
          </h2>
        </div>

        <div className="mt-8 sm:mt-14 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-5 text-left">
          {[
            { icon: Calendar, label: 'Available Days', value: doctor.days?.length ? doctor.days.join(', ') : '—' },
            { icon: Clock, label: 'Time Slots', value: doctor.timeSlots?.length ? doctor.timeSlots.join(' • ') : '—' },
            { icon: MapPin, label: 'Clinic Location', value: doctor.location || '—' },
            { icon: CheckCircle2, label: 'Consultation Fee', value: doctor.fee || '—' },
            {
              icon: Phone,
              label: 'Contact Number',
              value: doctor.phone || '—',
              href: doctor.phone ? `tel:${doctor.phone.replace(/\s+/g, '')}` : undefined,
            },
          ].map((f, i) => {
            const Card = (
              <div className="group relative flex flex-col justify-between rounded-2xl p-4 sm:p-5 min-h-[160px] sm:min-h-[200px] bg-[#F3F8FA] text-slate-500 transition-all duration-300 hover:bg-[#0B2B3A] hover:text-white h-full">
                <div className="flex items-start justify-between">
                  <div className="flex h-9 sm:h-11 w-9 sm:w-11 items-center justify-center rounded-xl bg-white group-hover:bg-white/15">
                    <f.icon className="h-4 w-4 sm:h-5 sm:w-5 text-[#0B2B3A] group-hover:text-white" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-slate-400 group-hover:text-white/60">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="mt-4 sm:mt-8">
                  <h3 className="text-sm sm:text-base font-semibold text-slate-800 group-hover:text-white">{f.label}</h3>
                  <p className="mt-1.5 sm:mt-2 text-[11px] sm:text-[13px] leading-relaxed text-slate-500 group-hover:text-white/75 break-words">
                    {f.value}
                  </p>
                </div>
              </div>
            )
            return f.href ? (
              <a key={i} href={f.href} className="block h-full">{Card}</a>
            ) : (
              <div key={i}>{Card}</div>
            )
          })}
        </div>
      </section>

      {/* BOOKING */}
      <section id="book" className="w-full bg-[#F3F8FA] px-4 sm:px-10 lg:px-36 pb-14 sm:pb-24 pt-10 sm:pt-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6 sm:mb-10">
            <h1 className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-semibold text-[#0B2B3A]">Book</h1>
            <h2 style={heading} className="text-2xl sm:text-3xl font-semibold text-[#0B2B3A] mt-3">
              Book with {doctor.name}
            </h2>
          </div>

          {bookingMsg && (
            <div className="mb-4 sm:mb-6 rounded-xl px-4 py-3 text-sm font-medium border bg-emerald-50 text-emerald-700 border-emerald-100 text-center">
              {bookingMsg}
            </div>
          )}

          <form onSubmit={submitBooking} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-8 space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className={label}>Full Name *</label>
                <input className={input} value={bookingForm.patientName} required
                  onChange={(e) => setBookingForm({ ...bookingForm, patientName: e.target.value })} />
              </div>
              <div>
                <label className={label}>Email *</label>
                <input className={input} type="email" value={bookingForm.email} required
                  onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })} />
              </div>
              <div>
                <label className={label}>Phone *</label>
                <input className={input} value={bookingForm.phone} required
                  onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })} />
              </div>
              <div>
                <label className={label}>Preferred Date *</label>
                <input className={input} type="date" value={bookingForm.date} required
                  onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className={label}>Preferred Time *</label>
                <select className={input} value={bookingForm.time} required
                  onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}>
                  <option value="">Select a slot</option>
                  {(doctor.timeSlots?.length ? doctor.timeSlots : TIME_SLOTS).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={label}>Message (optional)</label>
                <textarea className={input + ' min-h-[90px] sm:min-h-[100px] resize-none'} value={bookingForm.message}
                  onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                  placeholder="Briefly describe your concern..." />
              </div>
            </div>
            <button type="submit" disabled={booking}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#0B2B3A] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#123b4f] transition disabled:opacity-60">
              {booking ? <Loader2 size={16} className="animate-spin" /> : <Calendar size={16} />}
              {booking ? 'Booking...' : 'Confirm Appointment'}
            </button>
          </form>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="w-full bg-white px-4 sm:px-10 lg:px-36 pb-14 sm:pb-24 pt-10 sm:pt-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6 sm:mb-10">
            <h1 className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-semibold text-[#0B2B3A]">Reviews</h1>
            <h2 style={heading} className="text-2xl sm:text-3xl font-semibold text-[#0B2B3A] mt-2 sm:mt-3">
              What patients say
            </h2>
            <div className="mt-3 sm:mt-4 inline-flex items-center gap-2 sm:gap-3 rounded-full border border-slate-200 bg-[#F3F8FA] px-4 sm:px-5 py-1.5 sm:py-2">
              <Star size={15} className="fill-amber-400 text-amber-400" />
              <span className="text-lg sm:text-2xl font-semibold text-[#0B2B3A]" style={heading}>
                {avgRating > 0 ? avgRating : '—'}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-500">
                {totalReviews} review{totalReviews !== 1 && 's'}
              </span>
            </div>
          </div>

          {user ? (
            myReview ? (
              <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-4 sm:p-8 mb-6 sm:mb-10">
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-emerald-800" style={heading}>
                      Thank you for your review!
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-700 mt-1">
                      You've already reviewed {doctor.name}. Your feedback helps other patients.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={submitReview} className="bg-[#F3F8FA] rounded-2xl border border-slate-100 p-4 sm:p-8 mb-6 sm:mb-10">
                <h3 className="text-base sm:text-lg font-semibold text-[#0B2B3A] mb-3 sm:mb-4" style={heading}>
                  Write a review
                </h3>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                  <StarRating value={reviewRating} onChange={setReviewRating} size={28} />
                  <span className="text-sm font-semibold text-[#0B2B3A]">
                    {reviewRating}.0
                    <span className="ml-2 text-xs font-normal text-slate-500">
                      — {ratingLabel[reviewRating]}
                    </span>
                  </span>
                </div>

                <textarea
                  className={input + ' min-h-[80px] sm:min-h-[100px] resize-none mb-3 sm:mb-4'}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience..."
                  maxLength={1000}
                />

                <div className="flex items-center gap-3 flex-wrap">
                  <button type="submit" disabled={submittingReview}
                    className="inline-flex items-center gap-2 bg-[#0B2B3A] text-white text-sm font-semibold px-5 sm:px-6 py-2.5 rounded-xl hover:bg-[#123b4f] transition disabled:opacity-60">
                    {submittingReview ? <Loader2 size={14} className="animate-spin" /> : <MessageSquare size={14} />}
                    {submittingReview ? 'Submitting...' : 'Post Review'}
                  </button>
                  {reviewMsg.text && (
                    <span className={`text-xs font-semibold ${reviewMsg.type === 'err' ? 'text-red-600' : 'text-[#1F8A93]'}`}>
                      {reviewMsg.text}
                    </span>
                  )}
                </div>
              </form>
            )
          ) : (
            <div className="bg-[#F3F8FA] rounded-2xl border border-slate-100 p-4 sm:p-6 mb-6 sm:mb-10 text-center">
              <p className="text-xs sm:text-sm text-slate-600">
                <Link to="/" className="font-semibold text-[#1F8A93] hover:underline">Log in</Link>
                {' '}or{' '}
                <Link to="/signup" className="font-semibold text-[#1F8A93] hover:underline">create an account</Link>
                {' '}to write a review.
              </p>
            </div>
          )}

          {reviews.length === 0 ? (
            <div className="text-center py-8 sm:py-10">
              <Quote size={28} className="mx-auto text-slate-200 mb-3" />
              <p className="text-sm text-slate-500">No reviews yet. Be the first!</p>
            </div>
          ) : (
            <>
              <div className="space-y-2.5 sm:space-y-4">
                {visibleReviews.map((r) => (
                  <ReviewCard key={r._id} review={r} isMine={myReview?._id === r._id} />
                ))}
              </div>

              {hasMore && (
                <div className="mt-6 sm:mt-8 text-center">
                  <button
                    onClick={() => setShowAllReviews((v) => !v)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:border-[#1F8A93] hover:text-[#0B2B3A] transition"
                  >
                    {showAllReviews ? (
                      <>
                        <ChevronUp size={14} /> Show fewer
                      </>
                    ) : (
                      <>
                        <ChevronDown size={14} /> See all {reviews.length} reviews
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

/* ── Compact review card for mobile ── */
function ReviewCard({ review: r, isMine }) {
  return (
    <div className={`rounded-xl sm:rounded-2xl border p-3 sm:p-6 shadow-sm ${isMine ? 'bg-emerald-50/40 border-emerald-100' : 'bg-white border-slate-100'}`}>
      <div className="flex items-start gap-2.5 sm:gap-4">
        <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[#0B2B3A] text-white flex items-center justify-center text-xs sm:text-base font-semibold shrink-0">
          {r.patientName?.[0]?.toUpperCase() || 'P'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <p className="font-semibold text-[#0B2B3A] text-sm sm:text-base truncate" style={{ fontFamily: "'Fraunces', serif" }}>
                {r.patientName}
              </p>
              {isMine && (
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                  You
                </span>
              )}
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-400 shrink-0">
              {new Date(r.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center gap-1 mt-1">
            <StarRating value={r.rating} size={12} readOnly />
          </div>

          {r.comment && (
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">{r.comment}</p>
          )}
        </div>
      </div>
    </div>
  )
}