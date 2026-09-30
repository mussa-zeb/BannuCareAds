import { Outlet } from 'react-router-dom'
import DoctorSidebar from '../components/DoctorSidebar.jsx'

export default function DoctorLayout() {
  return (
    <div className="flex min-h-screen bg-[#F3F8FA]">
      <DoctorSidebar />
      <main className="flex-1 min-w-0 pt-16 lg:pt-0">
        <Outlet />
      </main>
    </div>
  )
}