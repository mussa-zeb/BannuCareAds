import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar.jsx'

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#F3F8FA]">
      <AdminSidebar />
      <main className="flex-1 min-w-0 pt-16 lg:pt-0">
        <Outlet />
      </main>
    </div>
  )
}