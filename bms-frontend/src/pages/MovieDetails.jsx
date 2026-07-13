import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FaArrowLeft, FaCalendarAlt, FaClock, FaStar, FaTicketAlt } from 'react-icons/fa'
import { movies as staticMovies } from '../data/content'
import { api } from '../apis'

export default function MovieDetails() {
  const { movieName } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const normalized = decodeURIComponent(movieName || '').trim().toLowerCase()

    const resolveMovie = (list = []) => {
      const match = list.find((item) => (item.title || item.name || '').toLowerCase() === normalized)
      if (match) {
        setMovie(match)
      }
    }

    resolveMovie(staticMovies)
    setLoading(false)

    api.getMovies()
      .then((response) => {
        const remoteMovies = response.data || []
        const fromRemote = remoteMovies.find((item) => (item.title || item.name || '').toLowerCase() === normalized)
        if (fromRemote) {
          setMovie(fromRemote)
        }
      })
      .catch(() => {
        // Fallback to the static catalog if the backend is unavailable.
      })
  }, [movieName])

  const relatedMovies = useMemo(() => {
    if (!movie) return []
    return staticMovies.filter((item) => (item.title || item.name) !== (movie.title || movie.name)).slice(0, 3)
  }, [movie])

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-20 text-sm text-mist">
        Loading movie details…
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-5xl flex-col items-center justify-center gap-4 px-6 py-20 text-center">
        <p className="font-ticket text-xs uppercase tracking-[0.35em] text-gold">Movie not found</p>
        <h1 className="font-display text-3xl tracking-wide text-ink dark:text-slate-100">We could not find that title.</h1>
        <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink">
          <FaArrowLeft /> Return home
        </Link>
      </div>
    )
  }

  const movieTitle = movie.title || movie.name
  const poster = movie.posterUrl || movie.poster
  const genre = Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre || 'General audience'

  return (
    <div className="min-h-[calc(100vh-80px)] bg-paper px-6 py-14 sm:px-8 dark:bg-midnight">
      <div className="mx-auto max-w-6xl space-y-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gold transition hover:text-gold-soft">
          <FaArrowLeft /> Back to home
        </Link>

        <div className="grid gap-8 rounded-[32px] border border-ink/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-midnight-2 lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
          <div className="overflow-hidden rounded-[24px] border border-ink/10 bg-paper-2 dark:border-white/10 dark:bg-midnight-3">
            <img src={poster} alt={movieTitle} className="h-full min-h-[420px] w-full object-cover" />
          </div>

          <div className="flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
                  <FaStar /> {movie.rating || 'N/A'}
                </span>
                <span className="rounded-full border border-ink/10 px-3 py-1 text-xs font-medium text-mist dark:border-white/10">
                  {movie.certification || 'UA'}
                </span>
              </div>

              <div>
                <p className="font-ticket text-xs uppercase tracking-[0.35em] text-gold">Now streaming</p>
                <h1 className="font-display mt-2 text-3xl tracking-wide text-ink dark:text-slate-100">{movieTitle}</h1>
              </div>

              <p className="max-w-2xl text-sm leading-7 text-mist">
                {movie.description || 'A cinematic experience crafted for movie lovers and theatergoers alike.'}
              </p>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-ink/10 bg-paper px-4 py-3 dark:border-white/10 dark:bg-midnight-3">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-mist">
                    <FaCalendarAlt /> Release
                  </div>
                  <p className="mt-2 text-sm font-semibold text-ink dark:text-slate-100">{movie.releaseDate || 'Coming soon'}</p>
                </div>
                <div className="rounded-2xl border border-ink/10 bg-paper px-4 py-3 dark:border-white/10 dark:bg-midnight-3">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-mist">
                    <FaClock /> Runtime
                  </div>
                  <p className="mt-2 text-sm font-semibold text-ink dark:text-slate-100">{movie.duration || 'TBA'}</p>
                </div>
                <div className="rounded-2xl border border-ink/10 bg-paper px-4 py-3 dark:border-white/10 dark:bg-midnight-3">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-mist">
                    <FaTicketAlt /> Genre
                  </div>
                  <p className="mt-2 text-sm font-semibold text-ink dark:text-slate-100">{genre}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to={`/booking?search=${encodeURIComponent(movieTitle)}`} className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-gold-soft">
                Book tickets
              </Link>
              <Link to="/" className="inline-flex items-center justify-center rounded-full border border-ink/10 px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-gold hover:text-gold dark:border-white/10 dark:text-slate-100">
                Explore more
              </Link>
            </div>
          </div>
        </div>

        {relatedMovies.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl tracking-wide text-ink dark:text-slate-100">More to discover</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedMovies.map((item) => (
                <Link key={item.title || item.name} to={`/movie/${encodeURIComponent(item.title || item.name)}`} className="overflow-hidden rounded-[24px] border border-ink/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-midnight-2">
                  <img src={item.posterUrl || item.poster} alt={item.title || item.name} className="h-48 w-full object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-ink dark:text-slate-100">{item.title || item.name}</h3>
                    <p className="mt-2 text-sm text-mist">{item.releaseDate || item.duration}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
