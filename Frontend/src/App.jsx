import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'

import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'

import AdminLayout from './layouts/AdminLayout.jsx'
import DoctorLayout from './layouts/DoctorLayout.jsx'
import UserLayout from './layouts/UserLayout.jsx'

import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AllDepartments from './pages/admin/AllDepartments.jsx'
import AddNewDepartment from './pages/admin/AddNewDepartment.jsx'
import UpdateDepartment from './pages/admin/UpdateDepartment.jsx'
import AllDoctors from './pages/admin/AllDoctors.jsx'
import AddDoctor from './pages/admin/AddDoctor.jsx'
import UpdateDoctor from './pages/admin/UpdateDoctor.jsx'
import AdminAppointments from './pages/admin/AdminAppointments.jsx'

import DoctorDashboard from './pages/doctor/DoctorDashboard.jsx'
import DoctorProfile from './pages/doctor/DoctorProfile.jsx'
import DoctorAppointments from './pages/doctor/DoctorAppointments.jsx'

import Home from './pages/user/Home.jsx'
import Departments from './pages/user/Departments.jsx'
import DepartmentDetail from './pages/user/DepartmentDetail.jsx'
import Doctors from './pages/user/Doctors.jsx'
import DoctorInfo from './pages/user/DoctorInfo.jsx'
import Contact from './pages/user/Contact.jsx'
import PrivacyPolicy from './pages/user/PrivacyPolicy.jsx'
import TermsOfService from './pages/user/TermsOfService.jsx'

const RootRedirect = () => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Login />
  if (user.role === 'admin') return <Navigate to="/admin" replace />
  if (user.role === 'doctor') return <Navigate to="/doctor" replace />
  return <Navigate to="/home" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/signup" element={<SignUp />} />

          {/* ADMIN */}
          <Route element={<ProtectedRoute role="admin" />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/departments" element={<AllDepartments />} />
              <Route path="/admin/departments/add" element={<AddNewDepartment />} />
              <Route path="/admin/departments/update" element={<UpdateDepartment />} />
              <Route path="/admin/doctors" element={<AllDoctors />} />
              <Route path="/admin/doctors/add" element={<AddDoctor />} />
              <Route path="/admin/doctors/update" element={<UpdateDoctor />} />
              <Route path="/admin/appointments" element={<AdminAppointments />} />
            </Route>
          </Route>

          {/* DOCTOR */}
          <Route element={<ProtectedRoute role="doctor" />}>
            <Route element={<DoctorLayout />}>
              <Route path="/doctor" element={<DoctorDashboard />} />
              <Route path="/doctor/profile" element={<DoctorProfile />} />
              <Route path="/doctor/appointments" element={<DoctorAppointments />} />
            </Route>
          </Route>

          {/* USER */}
          <Route element={<UserLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/home/departments" element={<Departments />} />
            <Route path="/home/departments/:id" element={<DepartmentDetail />} />
            <Route path="/home/doctors" element={<Doctors />} />
            <Route path="/home/doctors/:id" element={<DoctorInfo />} />
            <Route path="/home/contact" element={<Contact />} />
            <Route path="/home/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/home/terms-of-service" element={<TermsOfService />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}