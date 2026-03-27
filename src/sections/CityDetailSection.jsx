import ItineraryCard from '../components/ItineraryCard.jsx'
import SafetyBadge from '../components/SafetyBadge.jsx'
import TipsCard from '../components/TipsCard.jsx'

export default function CityDetailSection({ city, onBackToExplore }) {
  if (!city) return null

  const hasFullDetails =
    typeof city.shortBlurb === 'string' &&
    Array.isArray(city.itinerary) &&
    city.itinerary.length > 0

  return (
    <section className="hv-container py-10 sm:py-14">
      <button
        type="button"
        onClick={onBackToExplore}
        className="rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white"
      >
        ← Back to Explore
      </button>

      <div className="mt-6 grid gap-6 lg:grid-cols-3 lg:items-start">
        <div className="lg:col-span-2">
          <div className="hv-card p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900">
                  {city.name}
                </h2>
                <div className="mt-1 text-sm text-slate-600">
                  {city.country} • {city.region}
                  {city.state ? ` • State: ${city.state}` : ''}
                  {city.budget && city.budget !== '—' ? ` • Budget ${city.budget}` : ''}
                </div>
              </div>
              <SafetyBadge level={city.safetyLevel} className="self-start" />
            </div>

            {hasFullDetails ? (
              <p className="mt-4 text-sm leading-relaxed text-slate-700">
                {city.shortBlurb}
              </p>
            ) : (
              <div className="mt-4 rounded-2xl border border-black/10 bg-white/70 p-4 text-sm text-slate-700">
                This city was loaded from a live cities API, so it may not include
                a custom itinerary/highlights yet. (You can add those later for
                your favorite cities.)
              </div>
            )}

            {city.safetySource?.provider ? (
              <div className="mt-4 rounded-2xl border border-black/10 bg-white/70 p-4 text-xs text-slate-700">
                Safety rating is updated from{' '}
                <span className="font-bold">{city.safetySource.provider}</span>{' '}
                (advisory score: {typeof city.safetySource.score === 'number' ? city.safetySource.score.toFixed(1) : '—'}
                {city.safetySource.updated ? ` • updated ${city.safetySource.updated}` : ''}
                ).
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-2">
              {(city.vibe || []).map((tag) => (
                <span key={tag} className="hv-chip">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {hasFullDetails ? (
            <div className="mt-6">
              <div className="text-sm font-extrabold tracking-tight text-slate-900">
                Day-wise itinerary
              </div>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                {(city.itinerary || []).map((d) => (
                  <ItineraryCard
                    key={d.day}
                    day={d.day}
                    title={d.title}
                    items={d.plan}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-4">
          {Array.isArray(city.safetyTips) && city.safetyTips.length > 0 ? (
            <TipsCard title="Safety tips" items={city.safetyTips} />
          ) : (
            <div className="hv-card p-5 text-sm text-slate-700">
              For city-specific tips, use the <span className="font-bold">Safety Tips</span>{' '}
              section (universal checklist), or add your own tips to this city later.
            </div>
          )}

          {Array.isArray(city.highlights) && city.highlights.length > 0 ? (
            <div className="hv-card p-5">
              <div className="text-base font-extrabold tracking-tight text-slate-900">
                Travel highlights
              </div>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
                {(city.highlights || []).map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

