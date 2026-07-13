import Hero from '../components/Hero'
import MovieCard from '../components/MovieCard'
import TheaterCard from '../components/TheaterCard'
import Footer from '../components/Footer'
import { comingSoon, nowShowing, theaters, trendingMovies } from '../data/content'

function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="font-ticket text-xs uppercase tracking-[0.35em] text-gold">{eyebrow}</p>
        <h2 className="font-display mt-2 text-4xl tracking-wide text-ink dark:text-slate-100">{title}</h2>
      </div>
      {description && <p className="max-w-xl text-sm leading-7 text-mist">{description}</p>}
    </div>
  )
}

export default function Home() {
  return (
    <div className="space-y-20 px-6 py-10 sm:px-8">
      <Hero />

      <section id="movies" className="space-y-6">
        <SectionHeader eyebrow="Trending" title="Trending Movies" description="Latest titles grabbing attention this week." />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {trendingMovies.map((movie, index) => (
            <div key={movie.title} className="rise-in" style={{ animationDelay: `${index * 80}ms` }}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeader eyebrow="In theaters" title="Now Showing" description="Book a ticket for a showtime near you." />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {nowShowing.slice(0, 6).map((movie, index) => (
            <div key={movie.title} className="rise-in" style={{ animationDelay: `${index * 70}ms` }}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeader eyebrow="Coming soon" title="Coming Soon" description="Plan ahead with upcoming premieres and releases." />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {comingSoon.map((movie, index) => (
            <div key={movie.title} className="rise-in" style={{ animationDelay: `${index * 80}ms` }}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </section>

      <section id="theaters" className="space-y-6">
        <SectionHeader eyebrow="Locations" title="Popular Theaters" description="Choose your theater and enjoy the best screen experience." />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {theaters.map((theater, index) => (
            <div key={theater.name} className="rise-in" style={{ animationDelay: `${index * 80}ms` }}>
              <TheaterCard theater={theater} />
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="space-y-6">
        <div className="overflow-hidden rounded-[28px] border border-ink/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-midnight-2">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="font-ticket text-xs uppercase tracking-[0.35em] text-gold">About</p>
              <h2 className="font-display mt-2 text-4xl tracking-wide text-ink dark:text-slate-100">
                A premium experience for every movie lover.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-mist">
                BookMyScreen brings a cinematic, premium layout to movie ticket booking — designed for
                fast browsing, easy seat selection, and a polished checkout flow from marquee to seat.
              </p>
            </div>
            <div className="ticket-stub rounded-[22px] border border-ink/10 bg-paper p-6 dark:border-white/10 dark:bg-midnight-3">
              <p className="font-ticket text-xs font-semibold uppercase tracking-[0.35em] text-mist">Designed for</p>
              <ul className="mt-4 space-y-3 text-sm text-ink dark:text-slate-200">
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gold" /> Fast ticket discovery</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gold" /> Clear showtime browsing</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gold" /> Minimal booking flow</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
