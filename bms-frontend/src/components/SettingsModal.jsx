import { useEffect, useState } from 'react'
import { FaTimes, FaMoon, FaSun } from 'react-icons/fa'
import { useTheme } from '../context/ThemeContext'

export default function SettingsModal({ open, onClose }) {
  const { theme, toggleTheme } = useTheme()
  const [notifications, setNotifications] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.localStorage.getItem('bms-notifications') !== 'off'
  })

  useEffect(() => {
    window.localStorage.setItem('bms-notifications', notifications ? 'on' : 'off')
  }, [notifications])

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4" role="dialog" aria-modal="true">
      <div className="animate-fadeIn w-full max-w-md rounded-3xl border border-ink/10 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-midnight-2">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl tracking-wide text-ink dark:text-slate-100">Settings</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="flex h-9 w-9 items-center justify-center rounded-full text-mist transition hover:bg-paper-2 hover:text-ink dark:hover:bg-midnight-3 dark:hover:text-slate-100"
          >
            <FaTimes />
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <div className="flex items-center justify-between rounded-2xl border border-ink/10 px-4 py-3 dark:border-white/10">
            <div>
              <p className="text-sm font-semibold text-ink dark:text-slate-100">Appearance</p>
              <p className="text-xs text-mist">Switch between cinematic dark and light paper themes.</p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-2 rounded-full border border-ink/10 bg-paper px-3 py-2 text-xs font-semibold text-ink transition hover:border-gold dark:border-white/10 dark:bg-midnight-3 dark:text-slate-100"
            >
              {theme === 'light' ? <FaMoon /> : <FaSun className="text-gold" />}
              {theme === 'light' ? 'Dark' : 'Light'}
            </button>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-ink/10 px-4 py-3 dark:border-white/10">
            <div>
              <p className="text-sm font-semibold text-ink dark:text-slate-100">Booking notifications</p>
              <p className="text-xs text-mist">Get reminders about showtimes and confirmations.</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={notifications}
              onClick={() => setNotifications((current) => !current)}
              className={`relative h-6 w-11 rounded-full transition ${notifications ? 'bg-gold' : 'bg-ink/15 dark:bg-white/15'}`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${notifications ? 'left-[22px]' : 'left-0.5'}`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
