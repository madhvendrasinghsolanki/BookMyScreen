import { Link } from 'react-router-dom'
import { FaPlay, FaTicketAlt, FaStar } from 'react-icons/fa'

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-ink/10 bg-midnight shadow-xl shadow-black/10 dark:border-white/10">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-r from-midnight via-midnight/85 to-midnight/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent" />
        <div className="film-grain absolute inset-0 opacity-30" />
      </div>

      <div className="relative grid gap-10 px-6 py-14 sm:px-10 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="rise-in">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            <span className="marquee-bulb inline-block h-1.5 w-1.5 rounded-full bg-gold" />
            Now booking
          </span>
          <h1 className="font-display mt-6 max-w-xl text-5xl leading-[0.95] tracking-wide text-white sm:text-6xl">
            Every seat is
            <span className="block text-gold">the best seat.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-8 text-slate-300">
            Discover trending releases, compare showtimes across theaters, and lock in your seats in
            under a minute — a cinema experience built for people who love the movies.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              to="/booking"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition hover:bg-gold-soft"
            >
              <FaTicketAlt className="transition group-hover:-translate-y-0.5" /> Book Tickets
            </Link>
            <a
              href="/#movies"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:border-gold hover:text-gold"
            >
              <FaPlay className="text-xs" /> Browse Movies
            </a>
          </div>
        </div>

        <div className="rise-in ticket-stub" style={{ animationDelay: '120ms' }}>
          <div className="overflow-hidden rounded-3xl border border-white/15 bg-midnight-2/90 shadow-2xl shadow-black/40 backdrop-blur">
            <div className="relative h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=900&q=80"
                alt="Now showing"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight-2 via-transparent to-transparent" />
            </div>
            <div className="p-6">
              <p className="font-ticket text-xs uppercase tracking-[0.3em] text-gold">Now Showing</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Mission: Impossible — The Final Reckoning</h2>
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                <FaStar className="text-gold" /> 8.6 · Action & Thriller · 2h 40m
              </div>
            </div>
            <div className="ticket-perforation flex items-center justify-between px-6 py-4">
              <span className="font-ticket text-xs tracking-widest text-slate-400">SCR 04 · UA13+</span>
              <Link to="/booking" className="text-xs font-semibold text-gold hover:text-gold-soft">
                Get Tickets →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
