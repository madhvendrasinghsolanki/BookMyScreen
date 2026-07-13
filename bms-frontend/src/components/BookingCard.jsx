import { FaTicketAlt } from 'react-icons/fa'

export default function BookingCard({ booking, onBook }) {
  return (
    <div className="ticket-stub sticky top-24 overflow-hidden rounded-[24px] border border-ink/10 bg-white shadow-lg shadow-black/5 dark:border-white/10 dark:bg-midnight-2">
      <div className="flex items-center justify-between bg-velvet px-6 py-4 text-white">
        <h2 className="font-display text-xl tracking-wide">Ticket Summary</h2>
        <FaTicketAlt className="text-gold" />
      </div>

      <div className="space-y-3 px-6 py-5 text-sm text-ink dark:text-slate-200">
        <div className="grid grid-cols-2 gap-2">
          <span className="text-mist">Movie</span>
          <span className="text-right font-medium">{booking.movie?.title || booking.movie?.name}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <span className="text-mist">Theater</span>
          <span className="text-right font-medium">{booking.theater?.name || booking.theater?.title}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <span className="text-mist">Date</span>
          <span className="text-right font-medium font-ticket">{booking.date}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <span className="text-mist">Time</span>
          <span className="text-right font-medium font-ticket">{booking.time}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <span className="text-mist">Seat type</span>
          <span className="text-right font-medium">{booking.seatType}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <span className="text-mist">Tickets</span>
          <span className="text-right font-medium">{booking.tickets}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <span className="text-mist">Seats</span>
          <span className="text-right font-medium font-ticket">{booking.seats?.join(', ') || 'Not selected'}</span>
        </div>
      </div>

      <div className="ticket-perforation mx-6" />

      <div className="px-6 py-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-mist">Total</span>
          <span className="font-display text-3xl tracking-wide text-ink dark:text-slate-100">₹{booking.total}</span>
        </div>
        <button
          onClick={onBook}
          className="mt-5 w-full rounded-full bg-gold px-5 py-3 text-sm font-semibold text-ink transition hover:bg-gold-soft"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  )
}
