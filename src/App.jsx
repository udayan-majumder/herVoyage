  import { useEffect, useMemo, useRef, useState } from 'react'
  import Navbar from './components/Navbar.jsx'
  import HomeSection from './sections/HomeSection.jsx'
  import ExploreSection from './sections/ExploreSection.jsx'
  import CityDetailSection from './sections/CityDetailSection.jsx'
  import SafetyTipsSection from './sections/SafetyTipsSection.jsx'
  import AboutSection from './sections/AboutSection.jsx'
  import citiesData from './data/cities.json'
  import { getAdvisoryForCountryName } from './api/travelAdvisory.js'
  import { getAllIndiaCities } from './api/countryStateCity.js'
import { getCityTravelContent } from './api/travelContent.js'
  function App() {
    const [activeSection, setActiveSection] = useState('explore')
    const [selectedCityId, setSelectedCityId] = useState(null)
    const [filters, setFilters] = useState({
      safety: '4',
      region: 'all',
      budget: 'all',
      vibe: 'all',
    })

    // Start empty so we don't flash static demo cities before India loads.
    const [cities, setCities] = useState([])
    const [safetyStatus, setSafetyStatus] = useState({ state: 'idle', message: '' })
    const [indiaStatus, setIndiaStatus] = useState({ state: 'idle', message: '' })
    const [usingIndiaCities, setUsingIndiaCities] = useState(false)
    const didLoadSafetyRef = useRef(false)
    const indiaInFlightRef = useRef(false)
    const didAutoLoadIndiaRef = useRef(false)

    useEffect(() => {
      // React StrictMode runs effects twice in dev to catch bugs.
      // This guard prevents duplicate API calls while keeping StrictMode enabled.
      if (didLoadSafetyRef.current) return
      didLoadSafetyRef.current = true

      let cancelled = false

      const loadSafety = async () => {
        setSafetyStatus({ state: 'loading', message: 'Updating safety ratings…' })

        try {
          const uniqueCountries = [...new Set(citiesData.map((c) => c.country))]
          const advisoryByCountry = {}

          for (const country of uniqueCountries) {
            try {
              const advisory = await getAdvisoryForCountryName(country)
              if (advisory) advisoryByCountry[country] = advisory
            } catch {
              // ignore per-country failures; we fall back to static values
            }
          }

          if (cancelled) return

          const merged = citiesData.map((city) => {
            const adv = advisoryByCountry[city.country]
            if (!adv?.safetyLevel) return city
            return {
              ...city,
              safetyLevel: adv.safetyLevel,
              safetySource: {
                provider: 'travel-advisory.info',
                score: adv.score,
                updated: adv.updated,
                countryCode: adv.countryCode,
              },
            }
          })

          setCities(merged)
          setSafetyStatus({ state: 'ready', message: 'Safety ratings updated.' })
        } catch {
          if (cancelled) return
          setSafetyStatus({
            state: 'error',
            message: 'Could not update safety ratings. Using offline data.',
          })
        }
      }

      loadSafety()
      return () => {
        cancelled = true
      }
    }, [])

    useEffect(() => {
      // Auto-load India cities on first load (no click needed).
      if (didAutoLoadIndiaRef.current) return
      didAutoLoadIndiaRef.current = true

      ;(async () => {
        const ok = await loadIndiaCities()
        if (!ok) {
          // If CSC isn't configured (missing server-side key / proxy), fall back
          // to the small demo dataset so the app isn't empty.
          setCities(citiesData)
          setUsingIndiaCities(false)
          setActiveSection('home')
        }
      })()
    }, [])

    const loadIndiaCities = async () => {
      if (indiaInFlightRef.current) return
      indiaInFlightRef.current = true
      setIndiaStatus({ state: 'loading', message: 'Loading India cities…' })

      try {
        const cacheKey = 'hv_india_cities_v1'
        const cachedRaw = localStorage.getItem(cacheKey)
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw)
          if (Array.isArray(cached) && cached.length > 0) {
           const mapped = await Promise.all(
  cached.map(async (c) => {
    const details = await getCityTravelContent(c.cityName)

    const baseCity = {
      id: `in-${(c.cityName || '').toLowerCase().replace(/\s+/g, '-')}-${c.stateIso2 || 'na'}`,
      name: c.cityName,
      country: 'India',
      region: 'Asia',
      state: c.stateName || null,
      safetyLevel: 3,
      budget: '—',
      vibe: [],
      shortBlurb: '',
      highlights: [],
      safetyTips: [],
      itinerary: [],
      source: { provider: 'countrystatecity.in', cached: true },
    }

    return {
      ...baseCity,
      ...details
    }
  })
)

            setCities(mapped)
            setUsingIndiaCities(true)
            setSelectedCityId(null)
            setActiveSection('explore')
            setFilters({ safety: 'all', region: 'all', budget: 'all', vibe: 'all' })
            setIndiaStatus({
              state: 'ready',
              message: `Loaded ${mapped.length} India cities (cached).`,
            })
            return true
          }
        }

        // Country-level advisory (same for all India cities). No key required.
        let indiaSafetyLevel = 3
        try {
          const adv = await getAdvisoryForCountryName('India')
          if (adv?.safetyLevel) indiaSafetyLevel = adv.safetyLevel
        } catch {
          // fall back to 3/5
        }

        let mappedSoFar = []
        let lastMessageUpdateAt = 0

        const list = await getAllIndiaCities({
          onChunk: ({ cities: chunk }) => {
            mappedSoFar = chunk.map((c) => ({
              id: `in-${(c.cityName || '').toLowerCase().replace(/\s+/g, '-')}-${c.stateIso2 || 'na'}`,
              name: c.cityName,
              country: 'India',
              region: 'Asia',
              state: c.stateName || null,
              safetyLevel: indiaSafetyLevel,
              budget: '—',
              vibe: [],
              shortBlurb: '',
              highlights: [],
              safetyTips: [],
              itinerary: [],
              source: { provider: 'countrystatecity.in' },
            }))

            setCities(mappedSoFar)

            const now = Date.now()
            if (now - lastMessageUpdateAt > 500) {
              lastMessageUpdateAt = now
              setIndiaStatus({
                state: 'loading',
                message: `Loaded ${mappedSoFar.length} India cities…`,
              })
            }
          },
          onProgress: ({ stateIndex, totalStates, stateName }) => {
            const now = Date.now()
            if (now - lastMessageUpdateAt > 500) {
              lastMessageUpdateAt = now
              setIndiaStatus({
                state: 'loading',
                message: `Loading India cities… (State ${stateIndex}/${totalStates}: ${stateName || '—'})`,
              })
            }
          },
        })

        // Cache raw list so we never spam the API.
        try {
          localStorage.setItem(cacheKey, JSON.stringify(list))
        } catch {
          // ignore cache failures (storage may be full/blocked)
        }

        setUsingIndiaCities(true)
        setSelectedCityId(null)
        setActiveSection('explore')
        setFilters({ safety: 'all', region: 'all', budget: 'all', vibe: 'all' })

        setIndiaStatus({
          state: 'ready',
          message: `Loaded ${Array.isArray(list) ? list.length : mappedSoFar.length} India cities.`,
        })
        return true
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Could not load India cities.'
        setIndiaStatus({
          state: 'error',
          message:
            msg.includes('CSC API error 401') || msg.includes('CSC API error 403')
              ? 'CSC is not authorized. Put CSC_API_KEY in `.env`, restart `npm run dev`, then refresh.'
              : msg,
        })
        return false
      } finally {
        indiaInFlightRef.current = false
      }
    }

    const featuredCities = useMemo(() => {
      const top = [...cities].sort((a, b) => b.safetyLevel - a.safetyLevel)
      return top.slice(0, 3)
    }, [cities])

    const selectedCity = useMemo(
      () => cities.find((c) => c.id === selectedCityId) || null,
      [cities, selectedCityId],
    )

    const goTo = (sectionKey) => {
      setActiveSection(sectionKey)
      if (sectionKey !== 'city') setSelectedCityId(null)
    }

    const openCity = (city) => {
      setSelectedCityId(city.id)
      setActiveSection('city')
    }

    const resetFilters = () =>
      setFilters({ safety: '4', region: 'all', budget: 'all', vibe: 'all' })

    return (
      <div className="min-h-screen">
        <Navbar activeSection={activeSection} onNavigate={goTo} />

        <div className="hv-container pt-6">
          {safetyStatus.state !== 'idle' ? (
            <div className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-xs font-semibold text-slate-700">
              {safetyStatus.message}
            </div>
          ) : null}

          {indiaStatus.state !== 'idle' ? (
            <div className="mt-3 rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-xs font-semibold text-slate-700">
              {indiaStatus.message}
            </div>
          ) : null}
        </div>

        {activeSection === 'home' ? (
          <HomeSection
            featuredCities={featuredCities}
            onSelectCity={openCity}
            onExplore={() => goTo('explore')}
          />
        ) : null}

        {activeSection === 'explore' ? (
          <ExploreSection
            cities={cities}
            filters={filters}
            onChangeFilters={setFilters}
            onResetFilters={resetFilters}
            onSelectCity={openCity}
            onLoadIndiaCities={loadIndiaCities}
            loadingIndiaCities={indiaStatus.state === 'loading'}
            usingIndiaCities={usingIndiaCities}
          />
        ) : null}

        {activeSection === 'city' ? (
          <CityDetailSection
            city={selectedCity}
            onBackToExplore={() => goTo('explore')}
          />
        ) : null}

        {activeSection === 'tips' ? <SafetyTipsSection /> : null}
        {activeSection === 'about' ? <AboutSection /> : null}

        <footer className="hv-container py-10">
          <div className="hv-card p-6 text-sm text-slate-700">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="font-extrabold text-slate-900">HerVoyage Co.</span>{' '}
                • Beginner-friendly solo travel planner
              </div>
              <div className="text-slate-600">
                Built with React + Tailwind • Static JSON + live safety advisory
              </div>
            </div>  
          </div>
        </footer>
      </div>
    )
  }

  export default App
