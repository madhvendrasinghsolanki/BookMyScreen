import { FaMapMarkerAlt } from 'react-icons/fa'

export default function TheaterCard({ theater }) {
  return (
    <article className="group overflow-hidden rounded-[22px] border border-ink/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/10 dark:border-white/10 dark:bg-midnight-2">
      <div className="relative h-44 overflow-hidden bg-paper-2 dark:bg-midnight-3">
        <img
          src={theater.image}
          alt={theater.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>
      <div className="space-y-1.5 p-5">
        <h3 className="text-lg font-semibold text-ink dark:text-slate-100">{theater.name}</h3>
        <p className="flex items-center gap-1.5 text-sm text-mist">
          <FaMapMarkerAlt className="text-gold" /> {theater.location}
        </p>
      </div>
    </article>
  )
}
