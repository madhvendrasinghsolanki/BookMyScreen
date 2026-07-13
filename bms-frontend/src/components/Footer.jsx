import { Link } from 'react-router-dom'
import { FaTicketAlt } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="rounded-[28px] border border-ink/10 bg-white px-6 py-10 shadow-sm dark:border-white/10 dark:bg-midnight-2">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-center">
        <div>
          <p className="flex items-center gap-2 font-display text-xl tracking-wide text-ink dark:text-slate-100">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-velvet text-sm text-gold">
              <FaTicketAlt />
            </span>
            BookMy<span className="text-gold">Screen</span>
          </p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-mist">
            A premium cinema booking experience — fast browsing, clear showtimes, and a checkout flow
            that gets you to your seat, not through a maze.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link to="/" className="text-sm text-mist transition hover:text-gold">
            Movies
          </Link>
          <Link to="/booking" className="text-sm text-mist transition hover:text-gold">
            Booking
          </Link>
          <Link to="/dashboard" className="text-sm text-mist transition hover:text-gold">
            Dashboard
          </Link>
        </div>
      </div>
      <div className="mt-8 border-t border-ink/10 pt-6 text-sm text-mist dark:border-white/10">
        © 2026 BookMyScreen. Crafted for premium movie experiences.
      </div>
    </footer>
  )
}
