import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../apis'
import { getLocalBookings, getLocalWishlist } from '../utils'

export default function Dashboard() {
  const { user, setUser } = useAuth()
  const [bookings, setBookings] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({ name: '', email: '', avatar: '' })
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')

  const userId = user?.id || user?._id || user?.userId

  useEffect(() => {
    if (!userId) return
    const localBookings = getLocalBookings(userId)
    const localWishlist = getLocalWishlist(userId)

    api.getBookings(userId)
      .then((response) => {
        setBookings([...localBookings, ...(response.data || [])])
      })
      .catch(() => {
        // Backend unreachable — still show whatever was booked locally instead
        // of leaving the dashboard stuck empty.
        setBookings(localBookings)
      })

    api.getWishlist(userId)
      .then((response) => {
        setWishlist([...localWishlist, ...(response.data || [])])
      })
      .catch(() => {
        setWishlist(localWishlist)
      })
  }, [userId])

  useEffect(() => {
    if (!user) return
    setProfileForm({ name: user.name || '', email: user.email || '', avatar: user.avatar || '' })
  }, [user])

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-paper px-6 text-center dark:bg-midnight">
        <p className="text-mist">Please log in to view your dashboard.</p>
      </div>
    )
  }

  const handleProfileFieldChange = (field) => (event) => {
    setProfileForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const startEditingProfile = () => {
    setProfileError('')
    setProfileSuccess('')
    setProfileForm({ name: user.name || '', email: user.email || '', avatar: user.avatar || '' })
    setIsEditingProfile(true)
  }

  const cancelEditingProfile = () => {
    setIsEditingProfile(false)
    setProfileError('')
  }

  const handleProfileSave = async (event) => {
    event.preventDefault()
    setProfileError('')
    setProfileSuccess('')

    const trimmedName = profileForm.name.trim()
    const trimmedEmail = profileForm.email.trim()

    if (!trimmedName || !trimmedEmail) {
      setProfileError('Name and email are required.')
      return
    }

    setProfileSaving(true)
    try {
      const response = await api.updateProfile(user.id, {
        name: trimmedName,
        email: trimmedEmail,
        avatar: profileForm.avatar.trim(),
      })
      const updatedUser = response.data?.user
      if (updatedUser) {
        setUser({ ...user, ...updatedUser, id: updatedUser.id || user.id })
      }
      setProfileSuccess('Profile updated successfully.')
      setIsEditingProfile(false)
    } catch (error) {
      setProfileError(error.response?.data?.message || 'Unable to update profile. Please try again.')
    } finally {
      setProfileSaving(false)
    }
  }

  const profileInitials = (user.name || user.email || 'U')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const completedBookings = bookings.filter((item) => item.status === 'Completed').length
  const upcomingBookings = bookings.filter((item) => item.status === 'Confirmed').length
  const totalBookings = bookings.length

  const statCards = [
    ['Total Bookings', totalBookings, null],
    ['Upcoming Bookings', upcomingBookings, null],
    ['Completed Bookings', completedBookings, null],
    ['Wishlist Items', wishlist.length, '/wishlist'],
  ]

  return (
    <div className="min-h-[calc(100vh-80px)] bg-paper px-6 py-14 sm:px-8 dark:bg-midnight">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[28px] border border-ink/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-midnight-2">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-velvet text-xl font-semibold text-gold">
                {user.avatar ? <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" /> : profileInitials}
              </div>
              <div>
                <p className="font-ticket text-xs uppercase tracking-[0.35em] text-gold">Dashboard</p>
                <h1 className="font-display mt-2 text-3xl tracking-wide text-ink dark:text-slate-100">Welcome back, {user.name}</h1>
                <p className="mt-2 text-sm leading-7 text-mist">Track your bookings, upcoming shows, and saved favorites in one place.</p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3 sm:items-end">
              <div className="rounded-2xl border border-ink/10 bg-paper px-4 py-3 text-sm text-mist dark:border-white/10 dark:bg-midnight-3">
                <p className="font-semibold text-ink dark:text-slate-100">{user.email}</p>
                <p className="mt-1">Role: {user.role || 'user'}</p>
              </div>
              {!isEditingProfile && (
                <button
                  type="button"
                  onClick={startEditingProfile}
                  className="rounded-full border border-ink/15 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-gold hover:text-gold dark:border-white/10 dark:bg-midnight-3 dark:text-slate-100"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {profileSuccess && !isEditingProfile && (
            <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
              {profileSuccess}
            </p>
          )}

          {isEditingProfile && (
            <form onSubmit={handleProfileSave} className="mt-6 space-y-4 border-t border-ink/10 pt-6 dark:border-white/10">
              {profileError && (
                <p className="rounded-xl bg-velvet/10 px-4 py-2 text-sm font-medium text-velvet dark:text-velvet-soft">
                  {profileError}
                </p>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-ink dark:text-slate-300">
                  Name
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={handleProfileFieldChange('name')}
                    className="mt-1 w-full rounded-xl border border-ink/15 bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-gold dark:border-white/10 dark:bg-midnight-3 dark:text-slate-100"
                    placeholder="Your name"
                  />
                </label>
                <label className="text-sm font-medium text-ink dark:text-slate-300">
                  Email
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={handleProfileFieldChange('email')}
                    className="mt-1 w-full rounded-xl border border-ink/15 bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-gold dark:border-white/10 dark:bg-midnight-3 dark:text-slate-100"
                    placeholder="you@example.com"
                  />
                </label>
                <label className="text-sm font-medium text-ink dark:text-slate-300 sm:col-span-2">
                  Avatar URL
                  <input
                    type="text"
                    value={profileForm.avatar}
                    onChange={handleProfileFieldChange('avatar')}
                    className="mt-1 w-full rounded-xl border border-ink/15 bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-gold dark:border-white/10 dark:bg-midnight-3 dark:text-slate-100"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-ink transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {profileSaving ? 'Saving…' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={cancelEditingProfile}
                  disabled={profileSaving}
                  className="rounded-full border border-ink/15 bg-white px-5 py-2 text-sm font-semibold text-ink transition hover:border-gold hover:text-gold dark:border-white/10 dark:bg-midnight-3 dark:text-slate-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map(([label, value, to]) => {
            const cardClass = 'rounded-[24px] border border-ink/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-midnight-2'
            const content = (
              <>
                <p className="font-ticket text-xs uppercase tracking-[0.25em] text-mist">{label}</p>
                <p className="font-display mt-3 text-4xl tracking-wide text-ink dark:text-slate-100">{value}</p>
              </>
            )
            return to ? (
              <Link key={label} to={to} className={`${cardClass} block transition hover:border-gold`}>
                {content}
              </Link>
            ) : (
              <div key={label} className={cardClass}>
                {content}
              </div>
            )
          })}
        </div>

        <div className="rounded-[24px] border border-ink/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-midnight-2">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-2xl tracking-wide text-ink dark:text-slate-100">Recent Bookings</h2>
            <span className="text-sm text-mist">Latest activity</span>
          </div>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-ink/10 dark:border-white/10">
            <div className="grid min-w-[720px] grid-cols-[1.3fr_1fr_0.8fr_0.8fr_0.8fr_0.8fr_0.8fr] gap-3 bg-paper px-4 py-3 text-sm font-semibold text-ink dark:bg-midnight-3 dark:text-slate-200">
              <span>Movie</span>
              <span>Theater</span>
              <span>Date</span>
              <span>Time</span>
              <span>Seats</span>
              <span>Status</span>
              <span>Amount</span>
            </div>
            {bookings.length === 0 ? (
              <div className="px-4 py-6 text-sm text-mist">No bookings yet. Start booking your next movie.</div>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="grid min-w-[720px] grid-cols-[1.3fr_1fr_0.8fr_0.8fr_0.8fr_0.8fr_0.8fr] gap-3 border-t border-ink/10 px-4 py-4 text-sm text-mist dark:border-white/10"
                >
                  <div>
                    <p className="font-semibold text-ink dark:text-slate-100">{booking.movieTitle}</p>
                  </div>
                  <div>{booking.theaterName}</div>
                  <div className="font-ticket">{booking.showDate}</div>
                  <div className="font-ticket">{booking.showTime}</div>
                  <div className="font-ticket">{(booking.seats || []).join(', ') || '—'}</div>
                  <div>
                    <span className="rounded-full bg-gold/15 px-2.5 py-1 text-xs font-semibold text-gold">{booking.status || 'Confirmed'}</span>
                  </div>
                  <div>₹{booking.amount}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
