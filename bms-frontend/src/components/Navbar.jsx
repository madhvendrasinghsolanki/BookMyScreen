import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaSearch, FaMoon, FaSun, FaBars, FaTimes, FaTicketAlt } from 'react-icons/fa'
import { useTheme } from '../context/ThemeContext'
import { api } from '../apis'
import AccountMenu from './AccountMenu'

const navItems = [
  { label: 'Movies', to: '/#movies' },
  { label: 'Theaters', to: '/#theaters' },
  { label: 'About', to: '/#about' },
]

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [query, setQuery] = useState('')
  const [liveResults, setLiveResults] = useState([])
  const [showLiveResults, setShowLiveResults] = useState(false)
  const [liveSearchLoading, setLiveSearchLoading] = useState(false)
  const [liveSearchError, setLiveSearchError] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const searchBoxRef = useRef(null)
  const navigate = useNavigate()

  const filteredNavItems = useMemo(() => navItems, [])

  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed.length < 2) {
      setLiveResults([])
      setLiveSearchError('')
      setLiveSearchLoading(false)
      return
    }

    setLiveSearchLoading(true)
    setLiveSearchError('')
    const timeoutId = setTimeout(() => {
      api
        .searchMoviesLive(trimmed)
        .then((response) => {
          setLiveResults(response.data?.results || [])
        })
        .catch((error) => {
          setLiveResults([])
          setLiveSearchError(
            error.code === 'ERR_NETWORK' || !error.response
              ? 'Cannot reach the server. Is the backend running?'
              : error.response?.data?.message || 'Search failed. Please try again.'
          )
        })
        .finally(() => {
          setLiveSearchLoading(false)
        })
    }, 400)

    return () => clearTimeout(timeoutId)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setShowLiveResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (event) => {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    navigate(`/booking?search=${encodeURIComponent(trimmed)}`)
    setQuery('')
    setShowLiveResults(false)
    setMobileOpen(false)
  }

  const handleLiveResultSelect = (title) => {
    navigate(`/booking?search=${encodeURIComponent(title)}`)
    setQuery('')
    setShowLiveResults(false)
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur-xl dark:border-white/10 dark:bg-midnight/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-3.5 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-velvet text-gold shadow-sm">
            <FaTicketAlt />
          </span>
          <span className="font-display text-2xl leading-none tracking-wide text-ink dark:text-slate-100">
            BookMy<span className="text-gold">Screen</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-ink/70 md:flex dark:text-slate-300">
          {filteredNavItems.map((item) => (
            <a key={item.label} href={item.to} className="transition hover:text-gold">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2.5">
          <form
            onSubmit={handleSearch}
            ref={searchBoxRef}
            className="relative hidden min-w-[220px] items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-3.5 py-2 text-sm text-ink/80 shadow-sm md:flex dark:border-white/10 dark:bg-midnight-2 dark:text-slate-300"
          >
            <FaSearch className="text-mist" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setShowLiveResults(true)
              }}
              onFocus={() => setShowLiveResults(true)}
              placeholder="Search movies"
              className="w-full bg-transparent outline-none placeholder:text-mist"
            />
            {showLiveResults && query.trim().length >= 2 && (
              <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-80 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-xl dark:border-white/10 dark:bg-midnight-2">
                {liveSearchLoading ? (
                  <div className="px-4 py-3 text-sm text-mist">Searching…</div>
                ) : liveSearchError ? (
                  <div className="px-4 py-3 text-sm text-velvet dark:text-velvet-soft">{liveSearchError}</div>
                ) : liveResults.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-mist">No live results found.</div>
                ) : (
                  liveResults.slice(0, 6).map((result) => (
                    <button
                      key={result.imdbId}
                      type="button"
                      onClick={() => handleLiveResultSelect(result.title)}
                      className="flex w-full items-center gap-3 border-b border-ink/10 px-4 py-2 text-left last:border-b-0 hover:bg-paper-2 dark:border-white/10 dark:hover:bg-midnight-3"
                    >
                      {result.poster ? (
                        <img src={result.poster} alt={result.title} className="h-12 w-8 rounded object-cover" />
                      ) : (
                        <div className="h-12 w-8 rounded bg-paper-2 dark:bg-midnight-3" />
                      )}
                      <div>
                        <p className="text-sm font-semibold text-ink dark:text-slate-100">{result.title}</p>
                        <p className="text-xs text-mist">{result.year}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </form>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white/70 text-ink transition hover:border-gold hover:text-gold dark:border-white/10 dark:bg-midnight-2 dark:text-slate-100"
          >
            {theme === 'light' ? <FaMoon /> : <FaSun className="text-gold" />}
          </button>

          <Link
            to="/booking"
            className="hidden items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink shadow-sm transition hover:bg-gold-soft sm:inline-flex"
          >
            <FaTicketAlt /> Book Tickets
          </Link>

          <AccountMenu />

          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            aria-label="Toggle navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white/70 text-ink md:hidden dark:border-white/10 dark:bg-midnight-2 dark:text-slate-100"
          >
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="animate-fadeIn border-t border-ink/10 bg-paper px-6 py-4 md:hidden dark:border-white/10 dark:bg-midnight">
          <form onSubmit={handleSearch} className="mb-4 flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-3.5 py-2 text-sm dark:border-white/10 dark:bg-midnight-2">
            <FaSearch className="text-mist" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search movies"
              className="w-full bg-transparent outline-none placeholder:text-mist"
            />
          </form>
          <div className="flex flex-col gap-3 text-sm font-medium text-ink/80 dark:text-slate-300">
            {filteredNavItems.map((item) => (
              <a key={item.label} href={item.to} onClick={() => setMobileOpen(false)} className="transition hover:text-gold">
                {item.label}
              </a>
            ))}
            <Link
              to="/booking"
              onClick={() => setMobileOpen(false)}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink"
            >
              <FaTicketAlt /> Book Tickets
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
