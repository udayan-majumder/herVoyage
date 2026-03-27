const ADVISORY_BASE = 'https://www.travel-advisory.info/api'
const RESTCOUNTRIES_BY_NAME = 'https://restcountries.com/v3.1/name'

const clamp = (n, min, max) => Math.min(max, Math.max(min, n))

// travel-advisory score: 0 (best) → 5 (worst)
// We convert it to a friendly "safety level": 5 (best) → 1 (worst)
export function advisoryScoreToSafetyLevel(score) {
  if (typeof score !== 'number' || Number.isNaN(score)) return null
  const rounded = Math.round(score)
  return clamp(5 - rounded, 1, 5)
}

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

async function getCountryCodeAlpha2(countryName) {
  // RestCountries sometimes returns multiple matches; we pick the first.
  const url = `${RESTCOUNTRIES_BY_NAME}/${encodeURIComponent(countryName)}?fields=cca2,name`
  const data = await fetchJson(url)
  const first = Array.isArray(data) ? data[0] : null
  return first?.cca2 || null
}

export async function getAdvisoryForCountryName(countryName) {
  const code = await getCountryCodeAlpha2(countryName)
  if (!code) return null

  const url = `${ADVISORY_BASE}/${encodeURIComponent(code)}`
  const data = await fetchJson(url)
  const record = data?.data?.[code]
  if (!record) return null

  const score = typeof record.advisory?.score === 'number' ? record.advisory.score : null
  const updated = record.advisory?.updated || null

  return {
    countryCode: code,
    score,
    updated,
    safetyLevel: advisoryScoreToSafetyLevel(score),
  }
}

