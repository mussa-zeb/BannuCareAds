import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
})

// No response interceptor needed.
// ProtectedRoute handles redirects, AuthContext handles "not logged in".

export default api