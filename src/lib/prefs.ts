const PREFS_KEY = 'oogi_prefs'

export interface Prefs {
  lang: string
  selectedCategory: string
  selectedDuration: number
  selectedVariation: string
  skipWarmup: boolean
}

const DEFAULTS: Prefs = {
  lang: 'he',
  selectedCategory: 'upper',
  selectedDuration: 30,
  selectedVariation: 'a',
  skipWarmup: false,
}

export function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    if (!raw) return { ...DEFAULTS }
    return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Prefs>) }
  } catch {
    return { ...DEFAULTS }
  }
}

export function savePrefs(prefs: Prefs): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
  } catch {
    // localStorage unavailable (private mode, quota exceeded) — silent no-op
  }
}
