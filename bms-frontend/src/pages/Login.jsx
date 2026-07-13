import { FaTicketAlt, FaStar } from 'react-icons/fa'
import LoginForm from '../components/LoginForm'

export default function Login() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-paper dark:bg-midnight">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:px-8 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div className="relative hidden overflow-hidden rounded-[28px] border border-white/10 bg-midnight p-10 lg:block">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599162946-c4dab8e56f7f?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/70 to-midnight/20" />
          <div className="relative flex h-full flex-col justify-between">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              <FaTicketAlt /> BookMyScreen
            </span>
            <div>
              <h2 className="font-display text-4xl leading-tight tracking-wide text-white">
                Welcome back to the front row.
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-7 text-slate-300">
                Sign in to pick up right where you left off — saved bookings, wishlisted
                releases, and your favorite theaters.
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm text-slate-300">
                <FaStar className="text-gold" /> Loved by movie-goers across every city we serve.
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
