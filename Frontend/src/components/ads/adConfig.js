// ─────────────────────────────────────────────────────────────
//  Adsterra ad units — sab codes yahan ek jagah hain.
//  Kisi bhi ad ko band karna ho to ADS_ENABLED false kar dein.
// ─────────────────────────────────────────────────────────────
export const ADS_ENABLED = true

// Admin / Doctor accounts ko ads nahi dikhte (apne ads pe click = Adsterra ban risk)
export const HIDE_ADS_FOR_ROLES = ['admin', 'doctor']

export const POPUNDER_SRC =
  'https://pl31596276.profitableratecpmnetwork.com/a3/59/72/a359723ae241162f0ea3e6062b529ed9.js'

export const SOCIAL_BAR_SRC =
  'https://pl31596280.profitableratecpmnetwork.com/24/bc/8a/24bc8a1971a6131bc28f6b74ee850d20.js'

export const NATIVE_BANNER = {
  src: 'https://pl31596277.profitableratecpmnetwork.com/03aeee5be67e1ec1d779bff4ac9425ad/invoke.js',
  containerId: 'container-03aeee5be67e1ec1d779bff4ac9425ad',
}

export const SMARTLINK_URL =
  'https://www.profitableratecpmnetwork.com/tcpqzuyr?key=cf7a6ad88fc22caa05b69c7483be605d'

// iframe banners (highrevenueformat.com/<key>/invoke.js)
export const BANNERS = {
  b300x250: { key: '0ea086c83aa4ec85a8571ff751db0fa2', width: 300, height: 250 },
  b468x60:  { key: 'daed2a30cf5c8aa63dacc729356f0101', width: 468, height: 60 },
  b160x600: { key: '2634b613081cf199156fe18b79819438', width: 160, height: 600 },
  b160x300: { key: 'eff14d71ad960c596ef0461b03476c1b', width: 160, height: 300 },
  b320x50:  { key: '3f31d398be0380af4ea8ad0cdd3fcffd', width: 320, height: 50 },
  b728x90:  { key: '1b26812d7e5a488faff6d9bcbdb44d1a', width: 728, height: 90 },
}