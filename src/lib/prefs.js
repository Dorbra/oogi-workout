const PREFS_KEY = 'oogi_prefs'

const DEFAULTS = {
  lang: 'he',
  selectedCategory: 'upper',
  selectedDuration: 30,
  selectedVariation: 'a',
  skipWarmup: false,
}

export function loadPrefs() {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    if (!raw) return { ...DEFAULTS }
    return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULTS }
  }
}

export function savePrefs({ lang, selectedCategory, selectedDuration, selectedVariation, skipWarmup }) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify({ lang, selectedCategory, selectedDuration, selectedVariation, skipWarmup }))
  } catch {
    // localStorage unavailable (private mode, quota exceeded) — silent no-op
  }
}
