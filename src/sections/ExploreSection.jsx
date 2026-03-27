import { useMemo,useEffect, useState } from 'react'
import CityCard from '../components/CityCard.jsx'
import FilterBar from '../components/FilterBar.jsx'

const uniqueSorted = (values) => [...new Set(values)].sort()

export default function ExploreSection({
  cities,
  filters,
  onChangeFilters,
  onResetFilters,
  onSelectCity,
  onLoadIndiaCities,
  loadingIndiaCities,
  usingIndiaCities,
}) {
  const regions = useMemo(
    () => uniqueSorted(cities.map((c) => c.region)),
    [cities],
  )

  const vibes = useMemo(
    () => uniqueSorted(cities.flatMap((c) => c.vibe || [])),
    [cities],
  )
  const [page, setPage] = useState(1)
const [visibleCities, setVisibleCities] = useState([])
  const filteredCities = useMemo(() => {
    return cities.filter((c) => {
      const matchesSafety =
        filters.safety === 'all' ? true : c.safetyLevel >= Number(filters.safety)
      const matchesRegion =
        filters.region === 'all' ? true : c.region === filters.region
      const matchesBudget =
        filters.budget === 'all' ? true : c.budget === filters.budget
      const matchesVibe =
        filters.vibe === 'all' ? true : (c.vibe || []).includes(filters.vibe)

      return matchesSafety && matchesRegion && matchesBudget && matchesVibe
    })
  }, [cities, filters])
useEffect(() => {
  setPage(1)
  setVisibleCities(filteredCities.slice(0, 20))
}, [filteredCities])

const loadNext = () => {
  const nextPage = page + 1
  const nextCities = filteredCities.slice(0, nextPage * 20)

  setVisibleCities(nextCities)
  setPage(nextPage)
}
  return (
    <section className="hv-container py-10 sm:py-14">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Explore cities
          </h2>
          <p className="mt-1 text-sm text-slate-700">
            Use filters to find your next safe, solo-friendly destination.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <div className="text-sm font-semibold text-slate-700">
            Showing <span className="font-black">{filteredCities.length}</span> of{' '}
            {cities.length}
          </div>

          <button
            type="button"
            onClick={onLoadIndiaCities}
            disabled={loadingIndiaCities}
            className="rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-xs font-extrabold text-slate-900 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingIndiaCities
              ? 'Loading India cities…'
              : usingIndiaCities
                ? 'Reload India cities (live)'
                : 'Load India cities (live)'}
          </button>
        </div>
      </div>

      {usingIndiaCities ? (
        <div className="mt-4 rounded-2xl border border-black/10 bg-white/70 p-4 text-xs text-slate-700">
          India cities are loaded from a live API (name + state). Safety rating is a
          country advisory, so it will be similar across India unless you add
          city-specific sources later.
        </div>
      ) : null}

      <div className="mt-6">
        <FilterBar
          filters={filters}
          regions={regions}
          vibes={vibes}
          onChange={onChangeFilters}
          onReset={onResetFilters}
        />
      </div>

<div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {visibleCities.map((city) => (
    <CityCard key={city.id} city={city} onSelect={onSelectCity} />
  ))}
</div>
{visibleCities.length < filteredCities.length && (
  <div className="mt-6 text-center">
    <button
      onClick={loadNext}
      className="px-5 py-2 rounded-lg bg-black text-white"
    >
      Load More
    </button>
  </div>
)}
      {filteredCities.length === 0 ? (
        <div className="mt-8 hv-card p-6 text-sm text-slate-700">
          No cities match your filters. Try resetting.
        </div>
      ) : null}
    </section>
  )
}

