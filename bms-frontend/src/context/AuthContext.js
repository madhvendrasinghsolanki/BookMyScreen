import { createContext, useContext, useEffect, useMemo, useState, createElement } from 'react'

const AuthContext = createContext({ user: null, token: null, setUser: () => {}, setToken: () => {} })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null
    const saved = window.localStorage.getItem('bms-user')
    return saved ? JSON.parse(saved) : null
  })
  const [token, setToken] = useState(() => {
    if (typeof window === 'undefined') return null
    return window.localStorage.getItem('bms-token') || null
  })

  useEffect(() => {
    if (user) {
      window.localStorage.setItem('bms-user', JSON.stringify(user))
    } else {
      window.localStorage.removeItem('bms-user')
    }
  }, [user])

  useEffect(() => {
    if (token) {
      window.localStorage.setItem('bms-token', token)
    } else {
      window.localStorage.removeItem('bms-token')
    }
  }, [token])

  const value = useMemo(() => ({ user, token, setUser, setToken }), [user, token])

  return createElement(AuthContext.Provider, { value }, children)
}

export function useAuth() {
  return useContext(AuthContext)
}
