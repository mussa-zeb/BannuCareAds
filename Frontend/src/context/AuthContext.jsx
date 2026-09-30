import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    api.get('/user/me')
      .then(({ data }) => {
        if (!cancelled && data.success) setUser(data.user)
      })
      .catch(() => {
        if (!cancelled) setUser(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  const login = async (payload) => {
    try {
      const { data } = await api.post('/user/login', payload)
      if (data.success) {
        setUser(data.user)
        return { success: true, user: data.user }
      }
      return { success: false, msg: data.msg || 'Login failed', field: data.field || '' }
    } catch (err) {
      return {
        success: false,
        msg: err.response?.data?.msg || err.message || 'Network error — please try again',
        field: err.response?.data?.field || '',
      }
    }
  }

  const register = async (payload) => {
    try {
      const { data } = await api.post('/user/register', payload)
      if (data.success) {
        setUser(data.user)
        return { success: true, user: data.user }
      }
      return { success: false, msg: data.msg || 'Registration failed', field: data.field || '' }
    } catch (err) {
      return {
        success: false,
        msg: err.response?.data?.msg || err.message || 'Network error — please try again',
        field: err.response?.data?.field || '',
      }
    }
  }

  const logout = async () => {
    try {
      await api.post('/user/logout')
    } catch { /* ignore */ }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)