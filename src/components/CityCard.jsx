import SafetyBadge from './SafetyBadge.jsx'

export default function CityCard({ city, onSelect }) {
  const subtitleParts = [
    city.country,
    city.region,
    city.state ? `State: ${city.state}` : null,
    city.budget && city.budget !== '—' ? `Budget ${city.budget}` : null,
  ].filter(Boolean)

  return (
    <button
      type="button"
      onClick={() => onSelect?.(city)}
      className="hv-card group w-full overflow-hidden text-left transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-extrabold tracking-tight text-slate-900">
              {city.name}
            </div>
            <div className="text-sm text-slate-600">
              {subtitleParts.join(' • ')}
            </div>
          </div>
          <SafetyBadge level={city.safetyLevel} className="shrink-0" />
        </div>

        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          {city.shortBlurb}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {(city.vibe || []).slice(0, 3).map((tag) => (
            <span key={tag} className="hv-chip">
              {tag}
            </span>
          ))}
          {(city.vibe || []).length > 3 ? (
            <span className="hv-chip">+{city.vibe.length - 3} more</span>
          ) : null}
        </div>

        <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
          View details
          <span className="transition group-hover:translate-x-0.5">→</span>
        </div>
      </div>
    </button>
  )
}

