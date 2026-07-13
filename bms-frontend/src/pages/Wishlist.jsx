import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaHeart, FaTicketAlt, FaTrash } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { api } from '../apis'
import { getLocalWishlist, removeLocalWishlist, isNetworkError, getErrorMessage } from '../utils'

export default function Wishlist() {
  const { user } = useAuth()
  const userId = user?.id || user?._id || user?.userId
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [removingId, setRemovingId] = useState(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    const localItems = getLocalWishlist(userId)
    api.getWishlist(userId)
      .then((response) => {
        setItems([...localItems, ...(response.data || [])])
      })
      .catch(() => {
        setItems(localItems)
      })
      .finally(() => setLoading(false))
  }, [userId])

  const handleRemove = async (item) => {
    setRemovingId(item._id)
    if (item.offline) {
      removeLocalWishlist(item._id)
      setItems((current) => current.filter((entry) => entry._id !== item._id))
      setRemovingId(null)
      return
    }
    try {
      await api.removeWishlist(item._id)
      setItems((current) => current.filter((entry) => entry._id !== item._id))
    } catch (error) {
      if (isNetworkError(error)) {
        removeLocalWishlist(item._id)
        setItems((current) => current.filter((entry) => entry._id !== item._id))
      } else {
        setError(getErrorMessage(error, 'Could not remove that item. Please try again.'))
      }
    } finally {
      setRemovingId(null)
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-paper px-6 text-center dark:bg-midnight">
        <div className="space-y-4">
          <p className="text-mist">Please log in to view your wishlist.</p>
          <Link to="/login" className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink">
            Log in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-paper px-6 py-14 sm:px-8 dark:bg-midnight">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-ticket text-xs uppercase tracking-[0.35em] text-gold">Saved for later</p>
            <h1 className="font-display mt-2 text-3xl tracking-wide text-ink dark:text-slate-100">Your wishlist</h1>
          </div>
          <Link to="/" className="text-sm font-semibold text-gold transition hover:text-gold-soft">
            Back to homepage
          </Link>
        </div>

        {error && <p className="text-sm font-medium text-velvet dark:text-velvet-soft">{error}</p>}

        {loading ? (
          <p className="text-sm text-mist">Loading your wishlist…</p>
        ) : items.length === 0 ? (
          <div className="rounded-[28px] border border-ink/10 bg-white px-6 py-14 text-center shadow-sm dark:border-white/10 dark:bg-midnight-2">
            <FaHeart className="mx-auto mb-4 text-3xl text-ink/15 dark:text-white/15" />
            <p className="text-mist">Nothing saved yet. Tap the heart on any movie to add it here.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 rounded-[22px] border border-ink/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-midnight-2"
              >
                <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-paper-2 dark:bg-midnight-3">
                  {item.posterUrl && (
                    <img src={item.posterUrl} alt={item.movieTitle} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink dark:text-slate-100">{item.movieTitle}</p>
                  <Link
                    to={`/booking?search=${encodeURIComponent(item.movieTitle)}`}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:text-gold-soft"
                  >
                    <FaTicketAlt /> Book tickets
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(item)}
                  disabled={removingId === item._id}
                  aria-label="Remove from wishlist"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/10 text-ink/60 transition hover:border-velvet hover:text-velvet disabled:opacity-50 dark:border-white/10 dark:text-slate-300"
                >
                  <FaTrash className="text-xs" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
