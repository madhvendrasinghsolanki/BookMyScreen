import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import BookingCard from '../components/BookingCard'
import BookingConfirmation from '../components/BookingConfirmation'
import { useAuth } from '../context/AuthContext'
import { api } from '../apis'
import { CITY_OPTIONS, SEAT_TYPES } from '../utils/constants'
import { movies as staticMovies, theaters as staticTheaters } from '../data/content'
import { saveLocalBooking, isNetworkError, getErrorMessage } from '../utils'

const dates = ['Today', 'Tomorrow', 'Fri, Jul 12', 'Sat, Jul 13']
const seatRows = ['A', 'B', 'C', 'D', 'E', 'F']
const seatLayout = [8, 8, 8, 8, 8, 8]
const DEMO_SHOWTIME = '7:00 PM (Demo show)'

const fieldClass =
  'w-full rounded-2xl border border-ink/15 bg-paper px-4 py-3 text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20 dark:border-white/10 dark:bg-midnight-3 dark:text-slate-100'

export default function Booking() {
  const { user } = useAuth()
  const location = useLocation()
  const searchQuery = useMemo(() => new URLSearchParams(location.search).get('search')?.trim() || '', [location.search])
  const [movies, setMovies] = useState(staticMovies)
  const [theaters, setTheaters] = useState(staticTheaters)
  const [shows, setShows] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(staticMovies[0])
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem('bms-city') || CITY_OPTIONS[0]
  })
  const [selectedTheater, setSelectedTheater] = useState(staticTheaters[0])
  const [selectedDate, setSelectedDate] = useState(dates[0])
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedSeatType, setSelectedSeatType] = useState(SEAT_TYPES[0])
  const [tickets, setTickets] = useState(2)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [message, setMessage] = useState('')
  const [confirmedBooking, setConfirmedBooking] = useState(null)

  useEffect(() => {
    localStorage.setItem('bms-city', selectedCity)
  }, [selectedCity])

  useEffect(() => {
    api.getMovies().then((response) => {
      const remoteMovies = response.data || []
      setMovies(remoteMovies.length ? remoteMovies : staticMovies)
      if (!selectedMovie?._id) {
        setSelectedMovie(remoteMovies[0] || staticMovies[0])
      }
    }).catch(() => {
      setMovies(staticMovies)
    })
    api.getTheaters().then((response) => {
      const remoteTheaters = response.data || []
      setTheaters(remoteTheaters.length ? remoteTheaters : staticTheaters)
    }).catch(() => {
      setTheaters(staticTheaters)
    })
  }, [])

  useEffect(() => {
    if (!selectedMovie) return
    if (!selectedMovie._id) {
      // Static/demo movie with no backend record — there's no real show to
      // fetch, so offer a demo showtime instead of leaving selectedTime empty
      // (which would silently block booking forever).
      setShows([])
      setSelectedTheater((current) => current || staticTheaters[0])
      setSelectedTime(DEMO_SHOWTIME)
      return
    }
    api.getShows({ movieId: selectedMovie._id, city: selectedCity }).then((response) => {
      setShows(response.data || [])
      const filtered = (response.data || []).filter((show) => show.city === selectedCity)
      if (filtered.length) {
        const firstShow = filtered[0]
        setSelectedTheater(firstShow.theater || staticTheaters[0])
        setSelectedTime(firstShow.startTime || DEMO_SHOWTIME)
      } else {
        setSelectedTheater(staticTheaters[0])
        setSelectedTime(DEMO_SHOWTIME)
      }
    }).catch(() => {
      // Backend unreachable — still let the demo booking flow proceed.
      setShows([])
      setSelectedTheater(staticTheaters[0])
      setSelectedTime(DEMO_SHOWTIME)
    })
  }, [selectedMovie, selectedCity])

  useEffect(() => {
    // If the user arrived here for a specific movie (e.g. via "Book Now" on a
    // movie card or a nav search, which sets ?search=<title>), honor that exact
    // movie. This runs only when the search query or the catalog changes, so it
    // never overrides a movie the user picks manually afterwards.
    if (!searchQuery || !movies.length) return
    const normalizedQuery = searchQuery.toLowerCase()
    const exactMatch = movies.find((movie) => (movie.title || movie.name || '').toLowerCase() === normalizedQuery)
    if (!exactMatch) return
    setSelectedMovie((current) => {
      const currentTitle = (current?.title || current?.name || '').toLowerCase()
      return currentTitle === normalizedQuery ? current : exactMatch
    })
  }, [searchQuery, movies])

  useEffect(() => {
    if (!movies.length) {
      setSelectedMovie(null)
      return
    }

    const currentTitle = selectedMovie?.title || selectedMovie?.name
    const matchesCurrent = currentTitle && movies.some((movie) => (movie.title || movie.name) === currentTitle)

    if (!currentTitle || !matchesCurrent) {
      setSelectedMovie(movies[0])
    }
  }, [movies, selectedMovie?.title, selectedMovie?.name])

  const filteredBySearch = useMemo(() => {
    if (!searchQuery) return null
    const normalized = searchQuery.toLowerCase()
    return movies.filter((movie) => {
      const title = (movie.title || movie.name || '').toLowerCase()
      const description = (movie.description || '').toLowerCase()
      return title.includes(normalized) || description.includes(normalized)
    })
  }, [movies, searchQuery])

  // If the search doesn't match anything in our catalog (e.g. a movie that
  // isn't in this demo's data), fall back to showing the full catalog instead
  // of leaving the dropdown with only a "No matching movies" placeholder that
  // doesn't match whatever movie is actually selected.
  const noSearchMatches = Boolean(filteredBySearch && filteredBySearch.length === 0)
  const visibleMovies = filteredBySearch && filteredBySearch.length ? filteredBySearch : movies

  const filteredTheaters = useMemo(() => {
    return theaters.filter((theater) => (theater.city || selectedCity) === selectedCity)
  }, [theaters, selectedCity])

  const availableShows = useMemo(() => {
    return shows.filter((show) => show.city === selectedCity && show.movie?._id === selectedMovie?._id)
  }, [shows, selectedCity, selectedMovie])

  const total = selectedSeatType.price * tickets

  const toggleSeat = (seatId) => {
    setSelectedSeats((current) => {
      if (current.includes(seatId)) {
        return current.filter((item) => item !== seatId)
      }
      if (current.length < tickets) {
        return [...current, seatId]
      }
      return current
    })
  }

  const handleBooking = async () => {
    if (!user) {
      setMessage('Please log in before booking.')
      return
    }
    if (!selectedMovie || !selectedTheater || !selectedTime || selectedSeats.length !== tickets) {
      setMessage('Please select a show and enough seats to continue.')
      return
    }

    const payload = {
      user: user.id || user._id || user.userId,
      movieTitle: selectedMovie.title || selectedMovie.name,
      moviePoster: selectedMovie.posterUrl || selectedMovie.poster,
      city: selectedCity,
      theaterName: selectedTheater.name || selectedTheater.title,
      showTime: selectedTime,
      showDate: selectedDate,
      seatType: selectedSeatType.label,
      seats: selectedSeats,
      ticketCount: tickets,
      amount: total,
    }

    try {
      const response = await api.createBooking(payload)
      if (response.status === 201) {
        const created = response.data || {}
        setConfirmedBooking({
          id: created._id || created.id || `BMS-${Date.now()}`,
          ...payload,
          offline: false,
        })
        setMessage('')
        setSelectedSeats([])
      }
    } catch (error) {
      if (isNetworkError(error)) {
        // Backend truly unreachable — fall back to a local dummy booking so
        // the user still gets a confirmation instead of getting stuck.
        const localBooking = saveLocalBooking(payload)
        setConfirmedBooking({
          id: localBooking._id,
          ...payload,
          offline: true,
        })
        setMessage('')
        setSelectedSeats([])
        return
      }
      // The server was reachable and rejected the request (validation error,
      // expired session, etc.) — show the real reason, never fake success.
      setMessage(getErrorMessage(error, 'Booking failed. Please check your selection and try again.'))
    }
  }

  const handleBookAnother = () => {
    setConfirmedBooking(null)
    setMessage('')
  }

  const booking = useMemo(() => ({
    movie: selectedMovie,
    theater: selectedTheater,
    date: selectedDate,
    time: selectedTime,
    seatType: selectedSeatType.label,
    tickets,
    total,
    seats: selectedSeats,
  }), [selectedMovie, selectedTheater, selectedDate, selectedTime, selectedSeatType, tickets, total, selectedSeats])

  if (confirmedBooking) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-paper px-6 py-14 sm:px-8 dark:bg-midnight">
        <BookingConfirmation booking={confirmedBooking} onBookAnother={handleBookAnother} />
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-paper px-6 py-14 sm:px-8 dark:bg-midnight">
      <div className="mx-auto grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-8">
          <div className="space-y-6 rounded-[28px] border border-ink/10 bg-white px-6 py-8 shadow-sm dark:border-white/10 dark:bg-midnight-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-ticket text-xs uppercase tracking-[0.35em] text-gold">Booking</p>
                <h1 className="font-display mt-2 text-3xl tracking-wide text-ink dark:text-slate-100">Secure your seat</h1>
              </div>
              <Link to="/" className="text-sm font-semibold text-gold transition hover:text-gold-soft">
                Back to homepage
              </Link>
            </div>
            <div className="grid gap-6">
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-ink dark:text-slate-100">Movie details</h2>
                <select
                  value={selectedMovie?.title || selectedMovie?.name || ''}
                  onChange={(event) => setSelectedMovie(movies.find((movie) => (movie.title || movie.name) === event.target.value))}
                  className={fieldClass}
                >
                  {visibleMovies.length ? visibleMovies.map((movie) => (
                    <option key={movie._id || movie.title} value={movie.title || movie.name}>{movie.title || movie.name}</option>
                  )) : <option value="">No movies available</option>}
                </select>
                <p className="text-sm leading-7 text-mist">{searchQuery ? `Showing results for “${searchQuery}”.` : selectedMovie?.description || 'Select a movie and continue to the next step.'}</p>
                {noSearchMatches && <p className="text-sm text-mist">No movies match “{searchQuery}” in our catalog — showing everything available to book instead.</p>}
              </section>

              <section className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-ink dark:text-slate-100">City</h3>
                  <select
                    value={selectedCity}
                    onChange={(event) => setSelectedCity(event.target.value)}
                    className={fieldClass}
                  >
                    {CITY_OPTIONS.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-ink dark:text-slate-100">Theater</h3>
                  <select
                    value={selectedTheater?.name || selectedTheater?.title || ''}
                    onChange={(event) => setSelectedTheater(filteredTheaters.find((theater) => (theater.name || theater.title) === event.target.value))}
                    className={fieldClass}
                  >
                    {filteredTheaters.map((theater) => (
                      <option key={theater._id || theater.name} value={theater.name || theater.title}>{theater.name || theater.title}</option>
                    ))}
                  </select>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-ink dark:text-slate-100">Date</h3>
                  <select
                    value={selectedDate}
                    onChange={(event) => setSelectedDate(event.target.value)}
                    className={fieldClass}
                  >
                    {dates.map((date) => (
                      <option key={date} value={date}>{date}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-ink dark:text-slate-100">Showtime</h3>
                  <select
                    value={selectedTime}
                    onChange={(event) => setSelectedTime(event.target.value)}
                    className={fieldClass}
                  >
                    {availableShows.length ? availableShows.map((show) => (
                      <option key={show._id} value={show.startTime}>{show.startTime}</option>
                    )) : <option value={DEMO_SHOWTIME}>{DEMO_SHOWTIME}</option>}
                  </select>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-ink dark:text-slate-100">Seat type</h3>
                  <select
                    value={selectedSeatType.label}
                    onChange={(event) => setSelectedSeatType(SEAT_TYPES.find((item) => item.label === event.target.value))}
                    className={fieldClass}
                  >
                    {SEAT_TYPES.map((seat) => (
                      <option key={seat.label} value={seat.label}>{seat.label} - ₹{seat.price}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-ink dark:text-slate-100">Tickets</h3>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={tickets}
                    onChange={(event) => setTickets(Number(event.target.value))}
                    className="w-full accent-gold"
                  />
                  <div className="flex items-center justify-between text-sm text-mist">
                    <span>{tickets} ticket{tickets > 1 ? 's' : ''}</span>
                    <span>₹{selectedSeatType.price} each</span>
                  </div>
                </div>
              </section>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-ink dark:text-slate-100">Seat selection</h3>
                <div className="rounded-[22px] border border-ink/10 bg-paper p-5 dark:border-white/10 dark:bg-midnight-3">
                  <div className="mb-6 flex justify-center">
                    <div className="h-1.5 w-2/3 rounded-full bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
                  </div>
                  <p className="mb-5 text-center font-ticket text-[10px] uppercase tracking-[0.4em] text-mist">Screen this way</p>
                  <div className="grid gap-3">
                    {seatRows.map((row, rowIndex) => (
                      <div key={row} className="flex items-center justify-center gap-2">
                        <span className="w-5 text-sm font-medium text-mist">{row}</span>
                        {Array.from({ length: seatLayout[rowIndex] }, (_, index) => {
                          const seatId = `${row}${index + 1}`
                          const isSelected = selectedSeats.includes(seatId)
                          const isDisabled = selectedSeats.length >= tickets && !isSelected
                          return (
                            <button
                              key={seatId}
                              type="button"
                              disabled={isDisabled}
                              onClick={() => toggleSeat(seatId)}
                              className={`h-9 w-9 rounded-md border text-xs font-semibold font-ticket transition ${
                                isSelected
                                  ? 'border-gold bg-gold text-ink'
                                  : 'border-ink/15 bg-white text-ink dark:border-white/10 dark:bg-midnight-2 dark:text-slate-200'
                              } ${isDisabled ? 'cursor-not-allowed opacity-40' : 'hover:border-gold'}`}
                            >
                              {seatId}
                            </button>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-mist">Select {tickets} seat{tickets > 1 ? 's' : ''} for {selectedSeatType.label.toLowerCase()} pricing.</p>
              </div>

              {message && <p className="text-sm font-medium text-gold">{message}</p>}
            </div>
          </div>
        </div>

        <BookingCard booking={booking} onBook={handleBooking} />
      </div>
    </div>
  )
}
