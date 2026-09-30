import { Outlet } from 'react-router-dom'
import UserNavbar from '../components/UserNavbar.jsx'
import UserFooter from '../components/UserFooter.jsx'
import { GlobalAds, ResponsiveBanner, NativeBannerAd, SideRails } from '../components/ads/Ads.jsx'

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <GlobalAds />            {/* Popunder + Social Bar */}
      <UserNavbar />
      <SideRails />            {/* 160x600 + 160x300 (wide screens) */}
      <main className="pt-20 flex-1">
        <ResponsiveBanner className="pt-4" />   {/* 320x50 / 468x60 / 728x90 */}
        <Outlet />
        <NativeBannerAd />     {/* Native banner, footer se pehle */}
      </main>
      <UserFooter />
    </div>
  )
}
