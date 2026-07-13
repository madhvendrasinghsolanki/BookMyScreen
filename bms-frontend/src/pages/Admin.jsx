import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../apis'

export default function Admin() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ movies: 0, theaters: 0, bookings: 0, users: 0 })
  const [users, setUsers] = useState([])
  const [bookings, setBookings] = useState([])

  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    Promise.all([api.getAdminStats(), api.getAdminUsers(), api.getAdminBookings()])
      .then(([statsRes, usersRes, bookingsRes]) => {
        setStats(statsRes.data || {})
        setUsers(usersRes.data || [])
        setBookings(bookingsRes.data || [])
      })
      .catch((error) => {
        setLoadError(error.response?.data?.message || 'Unable to load admin data.')
      })
  }, [])

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-paper px-6 text-center dark:bg-midnight">
        <p className="text-mist">Admin access is required.</p>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-paper px-6 py-14 sm:px-8 dark:bg-midnight">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[28px] border border-ink/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-midnight-2">
          <p className="font-ticket text-xs uppercase tracking-[0.35em] text-gold">Admin Panel</p>
          <h1 className="font-display mt-2 text-3xl tracking-wide text-ink dark:text-slate-100">Management Console</h1>
          <p className="mt-3 text-sm leading-7 text-mist">Manage movies, theaters, shows, users, and bookings from a single place.</p>
        </div>

        {loadError && (
          <p className="rounded-2xl border border-velvet/30 bg-velvet/5 px-4 py-3 text-sm font-medium text-velvet dark:text-velvet-soft">
            {loadError}
          </p>
        )}

        <div className="grid gap-6 md:grid-cols-4">
          {[
            ['Movies', stats.movies],
            ['Theaters', stats.theaters],
            ['Bookings', stats.bookings],
            ['Users', stats.users],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[24px] border border-ink/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-midnight-2">
              <p className="text-sm text-mist">{label}</p>
              <p className="font-display mt-2 text-4xl tracking-wide text-ink dark:text-slate-100">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[24px] border border-ink/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-midnight-2">
            <h2 className="text-lg font-semibold text-ink dark:text-slate-100">Analytics Overview</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-ink/10 bg-paper p-4 dark:border-white/10 dark:bg-midnight-3">
                <p className="text-sm text-mist">Revenue</p>
                <p className="mt-2 text-xl font-semibold text-ink dark:text-slate-100">₹{bookings.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)}</p>
              </div>
              <div className="rounded-2xl border border-ink/10 bg-paper p-4 dark:border-white/10 dark:bg-midnight-3">
                <p className="text-sm text-mist">Confirmed</p>
                <p className="mt-2 text-xl font-semibold text-ink dark:text-slate-100">{bookings.filter((item) => item.status === 'Confirmed').length}</p>
              </div>
              <div className="rounded-2xl border border-ink/10 bg-paper p-4 dark:border-white/10 dark:bg-midnight-3">
                <p className="text-sm text-mist">Users</p>
                <p className="mt-2 text-xl font-semibold text-ink dark:text-slate-100">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="rounded-[24px] border border-ink/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-midnight-2">
            <h2 className="text-lg font-semibold text-ink dark:text-slate-100">Users</h2>
            <div className="mt-4 space-y-3">
              {users.map((item) => (
                <div key={item._id} className="rounded-2xl border border-ink/10 p-4 text-sm text-mist dark:border-white/10">
                  <p className="font-semibold text-ink dark:text-slate-100">{item.name}</p>
                  <p>{item.email}</p>
                  <p>Role: {item.role}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[24px] border border-ink/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-midnight-2">
            <h2 className="text-lg font-semibold text-ink dark:text-slate-100">Bookings</h2>
            <div className="mt-4 space-y-3">
              {bookings.map((booking) => (
                <div key={booking._id} className="rounded-2xl border border-ink/10 p-4 text-sm text-mist dark:border-white/10">
                  <p className="font-semibold text-ink dark:text-slate-100">{booking.movieTitle}</p>
                  <p>{booking.theaterName} • {booking.city}</p>
                  <p>Seats: {(booking.seats || []).join(', ')}</p>
                  <p>Amount: ₹{booking.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
