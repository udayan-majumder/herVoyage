// IMPORTANT:
// We call CSC via the Vite dev proxy (`/csc/...`) so:
// - the browser doesn't send X-CSCAPI-KEY (no CORS preflight spam)
// - the key stays server-side (set CSC_API_KEY in `.env`)
const CSC_BASE = '/csc/v1'

async function cscFetch(path) {
  const res = await fetch(`${CSC_BASE}${path}`)

  if (!res.ok) {
    const msg = await res.text().catch(() => '')
    throw new Error(`CSC API error ${res.status}${msg ? `: ${msg}` : ''}`)
  }

  return res.json()
}

export async function getIndiaStates() {
  return cscFetch('/countries/IN/states')
}

export async function getIndiaCitiesByState(stateIso2) {
  return cscFetch(`/countries/IN/states/${encodeURIComponent(stateIso2)}/cities`)
}

export async function getIndiaCities() {
  // Single-call endpoint (avoids 1 + 36 calls).
  return cscFetch('/countries/IN/cities')
}

export async function getAllIndiaCities(options = {}) {
  const { onChunk, onProgress } = options

  const normalizeCity = (c) => {
    const cityName =
      c?.name ||
      c?.cityName ||
      c?.city_name ||
      c?.city ||
      (typeof c === 'string' ? c : null)
    if (typeof cityName !== 'string' || cityName.trim().length === 0) return null

    return {
      cityName,
      stateName: c?.state_name || c?.stateName || null,
      stateIso2: c?.state_code || c?.stateIso2 || null,
      latitude: c?.latitude ?? c?.lat ?? null,
      longitude: c?.longitude ?? c?.lng ?? c?.lon ?? null,
    }
  }

  // Try bulk cities first (some paid plans only).
  try {
    const cities = await getIndiaCities()
    const normalized = (Array.isArray(cities) ? cities : [])
      .map(normalizeCity)
      .filter(Boolean)

    if (typeof onChunk === 'function') onChunk({ cities: normalized })
    return normalized
  } catch (e) {
    // Fallback for free plans: states + cities-by-state
    // Example error: 403 feature not available (bulkCities).
    const states = await getIndiaStates()
    const totalStates = Array.isArray(states) ? states.length : 0
    const all = []

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

    for (let i = 0; i < states.length; i++) {
      const st = states[i]
      const stateIso2 = st?.iso2 || st?.iso_2 || st?.code || null
      const stateName = st?.name || null
      if (!stateIso2) continue

      if (typeof onProgress === 'function') {
        onProgress({ state: 'loading', stateIndex: i + 1, totalStates, stateName })
      }

      const cities = await getIndiaCitiesByState(stateIso2)
      const chunk = (Array.isArray(cities) ? cities : [])
        .map((c) => {
          const base = normalizeCity(c)
          if (!base) return null
          return { ...base, stateIso2, stateName }
        })
        .filter(Boolean)

      if (chunk.length) {
        all.push(...chunk)
        if (typeof onChunk === 'function') onChunk({ cities: all })
      }

      // Be polite to free tier (and your key): slow down a bit.
      await sleep(350)
    }

    return all
  }
}

export async function getIndiaCitiesPaginated(page = 1, limit = 50) {
  const all = await getAllIndiaCities();

  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    data: all.slice(start, end),
    hasMore: end < all.length,
  };
}
