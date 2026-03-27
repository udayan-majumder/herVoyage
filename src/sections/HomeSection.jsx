import CityCard from '../components/CityCard.jsx'

export default function HomeSection({ featuredCities, onSelectCity, onExplore }) {
  return (
    <section className="hv-container py-10 sm:py-14">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-black/5">
            Built for beginners • No logins • Simple & safe
          </div>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            HerVoyage Co.
          </h1>
          <p className="mt-3 text-lg font-semibold text-slate-700">
            Safe journeys for solo female travelers
          </p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-700">
            Explore cities with safety-focused summaries, day-by-day itineraries,
            and practical tips you can actually use. Designed to be calm,
            minimal, and easy for first-time travelers.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onExplore}
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:opacity-95"
            >
              Explore safe cities
            </button>
            <div className="text-sm font-semibold text-slate-700">
              Tip: Start with a city rated <span className="font-black">4/5</span>{' '}
              or higher.
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="hv-card p-4">
              <div className="text-sm font-extrabold text-slate-900">
                Safety-first
              </div>
              <div className="mt-1 text-xs text-slate-600">
                Quick checklists + city tips
              </div>
            </div>
            <div className="hv-card p-4">
              <div className="text-sm font-extrabold text-slate-900">
                Simple itineraries
              </div>
              <div className="mt-1 text-xs text-slate-600">
                3-day beginner-friendly plans
              </div>
            </div>
            <div className="hv-card p-4">
              <div className="text-sm font-extrabold text-slate-900">
                Calm design
              </div>
              <div className="mt-1 text-xs text-slate-600">
                Soft pastels, clean cards
              </div>
            </div>
          </div>
        </div>

        <div className="hv-card overflow-hidden p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-extrabold text-slate-900">
                Featured safe cities
              </div>
              <div className="text-xs text-slate-600">
                Tap a card to see details
              </div>
            </div>
            <button
              type="button"
              onClick={onExplore}
              className="rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-xs font-bold text-slate-900 transition hover:bg-white"
            >
              View all
            </button>
          </div>

          <div className="mt-5 grid gap-4">
            {featuredCities.map((city) => (
              <CityCard key={city.id} city={city} onSelect={onSelectCity} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

