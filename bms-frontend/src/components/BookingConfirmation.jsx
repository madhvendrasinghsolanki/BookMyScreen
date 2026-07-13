import { Link } from 'react-router-dom'
import { FaCheckCircle, FaTicketAlt } from 'react-icons/fa'

export default function BookingConfirmation({ booking, onBookAnother }) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <FaCheckCircle className="text-5xl text-emerald-500" />
        <h1 className="font-display text-3xl tracking-wide text-ink dark:text-slate-100">Booking confirmed!</h1>
        <p className="text-sm text-mist">
          {booking.offline
            ? "Your seats are booked. This was saved on this device since we couldn't reach the server."
            : 'Your seats are booked. A confirmation has been added to your dashboard.'}
        </p>
      </div>

      <div className="ticket-stub overflow-hidden rounded-[24px] border border-ink/10 bg-white shadow-lg shadow-black/5 dark:border-white/10 dark:bg-midnight-2">
        <div className="flex items-center justify-between bg-velvet px-6 py-4 text-white">
          <h2 className="font-display text-xl tracking-wide">E-Ticket</h2>
          <FaTicketAlt className="text-gold" />
        </div>

        <div className="space-y-3 px-6 py-5 text-sm text-ink dark:text-slate-200">
          <div className="grid grid-cols-2 gap-2">
            <span className="text-mist">Booking ID</span>
            <span className="text-right font-medium font-ticket">{booking.id}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-mist">Movie</span>
            <span className="text-right font-medium">{booking.movieTitle}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-mist">Theater</span>
            <span className="text-right font-medium">{booking.theaterName}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-mist">City</span>
            <span className="text-right font-medium">{booking.city}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-mist">Date</span>
            <span className="text-right font-medium font-ticket">{booking.showDate}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-mist">Time</span>
            <span className="text-right font-medium font-ticket">{booking.showTime}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-mist">Seat type</span>
            <span className="text-right font-medium">{booking.seatType}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-mist">Seats</span>
            <span className="text-right font-medium font-ticket">{(booking.seats || []).join(', ')}</span>
          </div>
        </div>

        <div className="ticket-perforation mx-6" />

        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-mist">Amount paid</span>
            <span className="font-display text-3xl tracking-wide text-ink dark:text-slate-100">₹{booking.amount}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onBookAnother}
          className="flex-1 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-ink transition hover:bg-gold-soft"
        >
          Book another ticket
        </button>
        <Link
          to="/dashboard"
          className="flex-1 rounded-full border border-ink/15 px-5 py-3 text-center text-sm font-semibold text-ink transition hover:border-gold hover:text-gold dark:border-white/10 dark:text-slate-100"
        >
          View in dashboard
        </Link>
      </div>
    </div>
  )
}
