import { useAuth } from '../../context/AuthContext.jsx'
import { ADS_ENABLED, HIDE_ADS_FOR_ROLES } from './adConfig.js'

// Ads tab dikhte hain jab auth load ho chuka ho aur user admin/doctor na ho.
export default function useAdsEnabled() {
  const auth = useAuth()
  if (!ADS_ENABLED || !auth || auth.loading) return false
  if (auth.user && HIDE_ADS_FOR_ROLES.includes(auth.user.role)) return false
  return true
}
