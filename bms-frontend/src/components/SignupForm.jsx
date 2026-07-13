import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../apis'

export default function SignupForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isSubmitting) {
      return
    }
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setMessage('Please fill in all fields.')
      return
    }
    if (form.password !== form.confirm) {
      setMessage('Passwords do not match.')
      return
    }

    try {
      setIsSubmitting(true)
      setMessage('')
      await api.register({ name: form.name, email: form.email, password: form.password })
      setMessage('Signup successful. Please log in.')
      navigate('/login')
    } catch (error) {
      const serverMessage = error?.response?.data?.message
      const isTimeout = error?.code === 'ECONNABORTED'
      const isNetworkError = !error?.response
      if (isTimeout) {
        setMessage('Request timed out. Please try again in a moment.')
      } else if (isNetworkError) {
        setMessage('Cannot reach server right now. Please try again shortly.')
      } else {
        setMessage(serverMessage || 'Signup failed. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md rounded-[24px] border border-ink/10 bg-white px-8 py-10 shadow-xl shadow-black/5 dark:border-white/10 dark:bg-midnight-2">
      <p className="font-ticket text-xs font-semibold uppercase tracking-[0.35em] text-gold">Create account</p>
      <h1 className="font-display mt-3 text-4xl tracking-wide text-ink dark:text-slate-100">Get started</h1>
      <p className="mt-3 text-sm leading-6 text-mist">Register to save your bookings and enjoy faster checkout.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <label className="block text-sm font-medium text-ink dark:text-slate-200">
          Name
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-ink/15 bg-paper px-4 py-3 text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20 dark:border-white/10 dark:bg-midnight-3 dark:text-slate-100"
            placeholder="Your name"
          />
        </label>
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
            placeholder="Create password"
          />
        </label>
        <label className="block text-sm font-medium text-ink dark:text-slate-200">
          Confirm Password
          <input
            name="confirm"
            type="password"
            value={form.confirm}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-ink/15 bg-paper px-4 py-3 text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20 dark:border-white/10 dark:bg-midnight-3 dark:text-slate-100"
            placeholder="Confirm password"
          />
        </label>

        <button
          disabled={isSubmitting}
          className="w-full rounded-full bg-gold px-5 py-3 text-sm font-semibold text-ink transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Signing up...' : 'Signup'}
        </button>

        {message && <p className="text-sm text-mist">{message}</p>}
      </form>

      <p className="mt-6 text-center text-sm text-mist">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-gold hover:text-gold-soft">
          Login
        </Link>
      </p>
    </div>
  )
}
