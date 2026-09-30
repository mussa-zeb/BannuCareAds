import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  BANNERS, NATIVE_BANNER, POPUNDER_SRC, SOCIAL_BAR_SRC, SMARTLINK_URL,
} from './adConfig.js'
import useAdsEnabled from './useAdsEnabled.js'
import useMediaQuery from './useMediaQuery.js'

/* ───────────── helpers ───────────── */

const AdLabel = () => (
  <span className="block text-[9px] uppercase tracking-[0.2em] text-slate-400 mb-1 text-center select-none">
    Advertisement
  </span>
)

const buildSrcDoc = ({ key, width, height }) =>
  `<!doctype html><html><head><meta charset="utf-8">` +
  `<style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body>` +
  `<script>atOptions={'key':'${key}','format':'iframe','height':${height},'width':${width},'params':{}};</script>` +
  `<script src="https://www.highrevenueformat.com/${key}/invoke.js"></script>` +
  `</body></html>`

/* ───────────── 1. Iframe banner (300x250, 468x60, 160x600, 160x300, 320x50, 728x90) ─────────────
   Har banner apne iframe (srcdoc) mein load hota hai taake `atOptions` global
   ek doosre se clash na kare, aur sirf screen ke qareeb aane par load ho. */
export function BannerAd({ type, label = true, className = '' }) {
  const enabled = useAdsEnabled()
  const cfg = BANNERS[type]
  const holder = useRef(null)
  const [near, setNear] = useState(false)
  const srcDoc = useMemo(() => (cfg ? buildSrcDoc(cfg) : ''), [cfg])

  useEffect(() => {
    if (!enabled || !holder.current) return
    if (!('IntersectionObserver' in window)) { const t = setTimeout(() => setNear(true), 0); return () => clearTimeout(t) }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect() } },
      { rootMargin: '250px' }
    )
    io.observe(holder.current)
    return () => io.disconnect()
  }, [enabled])

  if (!enabled || !cfg) return null

  return (
    <div className={className}>
      {label && <AdLabel />}
      <div ref={holder} className="mx-auto max-w-full" style={{ width: cfg.width, height: cfg.height }}>
        {near && (
          <iframe
            title={`Advertisement ${cfg.width}x${cfg.height}`}
            srcDoc={srcDoc}
            width={cfg.width}
            height={cfg.height}
            scrolling="no"
            frameBorder="0"
            style={{ border: 0, display: 'block', maxWidth: '100%' }}
          />
        )}
      </div>
    </div>
  )
}

/* ───────────── 2. Responsive leaderboard ─────────────
   Mobile: 320x50 · Tablet: 468x60 · Desktop: 728x90
   (sirf ek hi render hota hai — hidden duplicate impressions nahi) */
export function ResponsiveBanner({ className = '' }) {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const isTablet = useMediaQuery('(min-width: 640px)')
  const type = isDesktop ? 'b728x90' : isTablet ? 'b468x60' : 'b320x50'
  return (
    <div className={`px-4 ${className}`}>
      <BannerAd key={type} type={type} />
    </div>
  )
}

/* ───────────── 3. Medium rectangle 300x250 (in-content) ───────────── */
export function InContentAd({ className = 'py-8 sm:py-10' }) {
  return (
    <div className={`flex justify-center px-4 ${className}`}>
      <BannerAd type="b300x250" />
    </div>
  )
}

/* ───────────── 4. Side rails: 160x600 (left) + 160x300 (right) — sirf bohot wide screens par ───────────── */
export function SideRails() {
  const wide = useMediaQuery('(min-width: 1700px)')
  const enabled = useAdsEnabled()
  if (!wide || !enabled) return null
  return (
    <>
      <div className="fixed z-20 top-28" style={{ left: 'calc(50% - 640px - 24px - 160px)' }}>
        <BannerAd type="b160x600" />
      </div>
      <div className="fixed z-20 top-28" style={{ left: 'calc(50% + 640px + 24px)' }}>
        <BannerAd type="b160x300" />
      </div>
    </>
  )
}

/* ───────────── 5. Native banner ───────────── */
export function NativeBannerAd({ className = 'py-8' }) {
  const enabled = useAdsEnabled()
  const { pathname } = useLocation()
  const wrap = useRef(null)

  useEffect(() => {
    if (!enabled || !wrap.current) return
    const host = wrap.current
    host.innerHTML = ''

    const container = document.createElement('div')
    container.id = NATIVE_BANNER.containerId

    const s = document.createElement('script')
    s.async = true
    s.setAttribute('data-cfasync', 'false')
    s.src = NATIVE_BANNER.src

    host.appendChild(s)
    host.appendChild(container)
    return () => { host.innerHTML = '' }
  }, [enabled, pathname])   // har page change par fresh ad

  if (!enabled) return null
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 ${className}`}>
      <AdLabel />
      <div ref={wrap} />
    </div>
  )
}

/* ───────────── 6. Popunder + Social Bar (poori site par sirf ek baar load) ───────────── */
export function GlobalAds() {
  const enabled = useAdsEnabled()

  useEffect(() => {
    if (!enabled || window.__bannucareAdsLoaded) return
    window.__bannucareAdsLoaded = true
    ;[POPUNDER_SRC, SOCIAL_BAR_SRC].forEach((src) => {
      const s = document.createElement('script')
      s.src = src
      s.async = true
      document.body.appendChild(s)
    })
  }, [enabled])

  return null
}

/* ───────────── 7. Smartlink — clearly "Sponsored" card ───────────── */
export function SponsoredCard({ className = '' }) {
  const enabled = useAdsEnabled()
  if (!enabled) return null
  return (
    <div className={`max-w-2xl mx-auto px-4 sm:px-6 ${className}`}>
      <a
        href={SMARTLINK_URL}
        target="_blank"
        rel="noopener noreferrer sponsored nofollow"
        className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-[#F3F8FA] px-5 py-4 hover:border-[#1F8A93] hover:shadow-md transition"
      >
        <div>
          <span className="inline-block rounded-full bg-slate-200 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-slate-600">
            Sponsored
          </span>
          <p className="mt-1.5 text-sm font-semibold text-[#0B2B3A]">Check out today's featured offers</p>
          <p className="text-xs text-slate-500">Sponsored content from our advertising partner.</p>
        </div>
        <span className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 group-hover:bg-[#104560] group-hover:text-white transition">
          View
        </span>
      </a>
    </div>
  )
}
