import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../apis'
import { useAuth } from '../context/AuthContext'

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const { setUser, setToken } = useAuth()

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.email || !form.password) {
      setMessage('Please fill in your email and password.')
      return
    }

    try {
      const response = await api.login({ email: form.email, password: form.password })
      const user = response.data?.user
      const token = response.data?.token
      if (!user || !token) {
        setMessage('Login failed. Please try again.')
        return
      }
      setUser(user)
      setToken(token)
      setMessage('Login successful.')
      navigate(user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (error) {
      // Never fabricate a session on failure — a network hiccup or a wrong
      // password must never silently grant access (and could not
      // grant admin access just because the email contains "admin").
      setMessage(error.response?.data?.message || 'Invalid email or password.')
    }
  }

  return (
    <div className="w-full max-w-md rounded-[24px] border border-ink/10 bg-white px-8 py-10 shadow-xl shadow-black/5 dark:border-white/10 dark:bg-midnight-2">
      <p className="font-ticket text-xs font-semibold uppercase tracking-[0.35em] text-gold">Login</p>
      <h1 className="font-display mt-3 text-4xl tracking-wide text-ink dark:text-slate-100">Welcome back</h1>
      <p className="mt-3 text-sm leading-6 text-mist">Sign in to access your bookings and book tickets faster.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <label className="block text-sm font-medium text-ink dark:text-slate-200">
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-ink/15 bg-paper px-4 py-3 text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20 dark:border-white/10 dark:bg-midnight-3 dark:text-slate-100"
            placeholder="you@example.com"
          />
        </label>

        <label className="block text-sm font-medium text-ink dark:text-slate-200">
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-ink/15 bg-paper px-4 py-3 text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20 dark:border-white/10 dark:bg-midnight-3 dark:text-slate-100"
            placeholder="Enter password"
          />
        </label>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex items-center gap-2 text-sm text-mist">
            <input
              name="remember"
              type="checkbox"
              checked={form.remember}
              onChange={handleChange}
              className="h-4 w-4 rounded border-ink/20 text-gold focus:ring-gold"
            />
            Remember me
          </label>
          <button type="button" className="text-sm font-medium text-gold transition hover:text-gold-soft">
            Forgot password?
          </button>
        </div>

        <button className="w-full rounded-full bg-gold px-5 py-3 text-sm font-semibold text-ink transition hover:bg-gold-soft">
          Login
        </button>

        {message && <p className="text-sm text-mist">{message}</p>}
      </form>

      <p className="mt-6 text-center text-sm text-mist">
        Don't have an account?{' '}
        <Link to="/signup" className="font-semibold text-gold hover:text-gold-soft">
          Sign up
        </Link>
      </p>
    </div>
  )
}
