// ─────────────────────────────────────────────────────────────
//  Adsterra ad units — sab codes yahan ek jagah hain.
//  Kisi bhi ad ko band karna ho to ADS_ENABLED false kar dein.
// ─────────────────────────────────────────────────────────────
export const ADS_ENABLED = true

// Admin / Doctor accounts ko ads nahi dikhte (apne ads pe click = Adsterra ban risk)
export const HIDE_ADS_FOR_ROLES = ['admin', 'doctor']

export const POPUNDER_SRC =
  'https://pl31589313.profitableratecpmnetwork.com/5e/1d/3e/5e1d3ea73be78ad2f111711ff0a3921b.js'

export const SOCIAL_BAR_SRC =
  'https://pl31589315.profitableratecpmnetwork.com/3b/c6/d7/3bc6d764e02f9f9d21549d8ebd37a619.js'

export const NATIVE_BANNER = {
  src: 'https://pl31589314.profitableratecpmnetwork.com/a560039e0640ce76d8103516afc765c6/invoke.js',
  containerId: 'container-a560039e0640ce76d8103516afc765c6',
}

export const SMARTLINK_URL =
  'https://www.profitableratecpmnetwork.com/by9e6d0df?key=012753694cfb4882f293e536097292b5'

// iframe banners (highrevenueformat.com/<key>/invoke.js)
export const BANNERS = {
  b300x250: { key: '90ea3bc2e879bd41e408555550a8b553', width: 300, height: 250 },
  b468x60:  { key: '084d165b565ba5a1a331ec199431a806', width: 468, height: 60 },
  b160x600: { key: '2b54d80949c81b3750901f8b6681886d', width: 160, height: 600 },
  b160x300: { key: '9928d767797a64101cb4962647f76276', width: 160, height: 300 },
  b320x50:  { key: '9ce49d4bac18a6795581111ba91b48c2', width: 320, height: 50 },
  b728x90:  { key: 'ced1119ab210a9025f06ebdc30e2347e', width: 728, height: 90 },
}
