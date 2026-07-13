import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaHeart, FaStar } from 'react-icons/fa'
import { api } from '../apis'
import { useAuth } from '../context/AuthContext'
import { getLocalWishlist, addLocalWishlist, removeLocalWishlist, isNetworkError, getErrorMessage } from '../utils'

export default function MovieCard({ movie }) {
  const { user } = useAuth()
  const [liked, setLiked] = useState(false)
  const [message, setMessage] = useState('')

  let storedUser = null
  try {
    storedUser = JSON.parse(window.localStorage.getItem('bms-user') || 'null')
  } catch {
    storedUser = null
  }
  const effectiveUser = user || storedUser
  const userId = effectiveUser?.id || effectiveUser?._id || effectiveUser?.userId || null

  useEffect(() => {
    if (!userId) return
    api.getWishlist(userId).then((response) => {
      const exists = (response.data || []).some((item) => item.movieTitle === (movie.title || movie.name))
      setLiked(exists)
    }).catch(() => {
      const exists = getLocalWishlist(userId).some((item) => item.movieTitle === (movie.title || movie.name))
      setLiked(exists)
    })
  }, [movie, userId])

  const toggleWishlist = async () => {
    if (!userId) {
      setMessage('Please log in to save this movie to your wishlist.')
      return
    }

    const movieTitle = movie.title || movie.name
    const posterUrl = movie.posterUrl || movie.poster

    if (liked) {
      try {
        const existing = (await api.getWishlist(userId)).data.find((item) => item.movieTitle === movieTitle)
        if (existing) {
          await api.removeWishlist(existing._id)
        }
        setLiked(false)
        setMessage('Removed from wishlist.')
      } catch (error) {
        if (isNetworkError(error)) {
          const existing = getLocalWishlist(userId).find((item) => item.movieTitle === movieTitle)
          if (existing) removeLocalWishlist(existing._id)
          setLiked(false)
          setMessage('Removed from wishlist (offline).')
        } else {
          setMessage(getErrorMessage(error, 'Could not update your wishlist.'))
        }
      }
      return
    }

    try {
      await api.addWishlist({ user: userId, movieTitle, posterUrl })
      setLiked(true)
      setMessage('Added to wishlist.')
    } catch (error) {
      if (isNetworkError(error)) {
        addLocalWishlist({ user: userId, movieTitle, posterUrl })
        setLiked(true)
        setMessage('Added to wishlist (offline).')
      } else {
        setMessage(getErrorMessage(error, 'Could not update your wishlist.'))
      }
    }
  }

  return (
    <article className="ticket-stub group overflow-hidden rounded-[22px] border border-ink/10 bg-white transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/10 dark:border-white/10 dark:bg-midnight-2">
      <div className="relative h-80 overflow-hidden bg-paper-2 dark:bg-midnight-3">
        <Link to={`/movie/${encodeURIComponent(movie.title || movie.name)}`}>
          <img
            src={movie.posterUrl || movie.poster}
            alt={movie.title || movie.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        <button
          type="button"
          onClick={toggleWishlist}
          aria-label="Toggle wishlist"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-sm text-white backdrop-blur transition hover:bg-black/60"
        >
          <FaHeart className={liked ? 'text-velvet-soft' : 'text-white/80'} />
        </button>
        {message && (
          <div className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white backdrop-blur">
            {message}
          </div>
        )}
        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-xs font-semibold text-gold backdrop-blur">
          <FaStar className="text-[10px]" /> {movie.rating}
        </div>
      </div>

      <div className="space-y-2 p-5">
        <h3 className="truncate text-lg font-semibold text-ink dark:text-slate-100">
          <Link to={`/movie/${encodeURIComponent(movie.title || movie.name)}`} className="transition hover:text-gold">
            {movie.title || movie.name}
          </Link>
        </h3>
        <p className="truncate text-sm text-mist">{Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}</p>
      </div>

      <div className="ticket-perforation flex items-center justify-between px-5 py-4">
        <div className="font-ticket text-xs text-mist">
          <span>{movie.duration}</span>
          <span className="mx-1.5">·</span>
          <span>{movie.certification}</span>
        </div>
        <Link
          to={`/booking?search=${encodeURIComponent(movie.title || movie.name)}`}
          className="inline-flex items-center justify-center rounded-full bg-gold px-4 py-2 text-xs font-semibold text-ink transition hover:bg-gold-soft"
        >
          Book Now
        </Link>
      </div>
    </article>
  )
}
