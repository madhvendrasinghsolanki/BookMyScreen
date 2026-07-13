import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaEllipsisV,
  FaTachometerAlt,
  FaUserShield,
  FaCog,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaHeart,
} from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import SettingsModal from './SettingsModal'

export default function AccountMenu() {
  const { user, setUser } = useAuth()
  const [open, setOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    const handleKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  const close = () => setOpen(false)

  const initials = (user?.name || user?.email || 'U')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const handleLogout = () => {
    setUser(null)
    close()
    navigate('/')
  }

  const item =
    'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-ink transition hover:bg-paper-2 dark:text-slate-200 dark:hover:bg-midnight-3'

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen((current) => !current)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white/70 text-ink transition hover:border-gold hover:text-gold dark:border-white/10 dark:bg-midnight-2 dark:text-slate-100"
      >
        <FaEllipsisV />
      </button>

      {open && (
        <div
          role="menu"
          className="animate-fadeIn absolute right-0 top-[calc(100%+10px)] z-50 w-72 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-2xl shadow-black/10 dark:border-white/10 dark:bg-midnight-2"
        >
          {user ? (
            <>
              <div className="flex items-center gap-3 border-b border-ink/10 px-4 py-4 dark:border-white/10">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-velvet text-sm font-semibold text-white">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink dark:text-slate-100">{user.name}</p>
                  <p className="truncate text-xs text-mist">{user.email}</p>
                </div>
              </div>

              <div className="space-y-1 p-2">
                <Link to="/dashboard" onClick={close} className={item} role="menuitem">
                  <FaTachometerAlt className="text-gold" /> Dashboard
                </Link>
                <Link to="/wishlist" onClick={close} className={item} role="menuitem">
                  <FaHeart className="text-gold" /> Wishlist
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={close} className={item} role="menuitem">
                    <FaUserShield className="text-gold" /> Admin panel
                  </Link>
                )}
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setSettingsOpen(true)
                    close()
                  }}
                  className={item}
                >
                  <FaCog className="text-gold" /> Settings
                </button>
              </div>

              <div className="border-t border-ink/10 p-2 dark:border-white/10">
                <button type="button" role="menuitem" onClick={handleLogout} className={`${item} text-velvet dark:text-velvet-soft`}>
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-1 p-2">
              <Link to="/login" onClick={close} className={item} role="menuitem">
                <FaSignInAlt className="text-gold" /> Login
              </Link>
              <Link to="/signup" onClick={close} className={item} role="menuitem">
                <FaUserPlus className="text-gold" /> Signup
              </Link>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setSettingsOpen(true)
                  close()
                }}
                className={item}
              >
                <FaCog className="text-gold" /> Settings
              </button>
            </div>
          )}
        </div>
      )}

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
