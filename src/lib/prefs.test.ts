import { describe, it, expect, beforeEach, vi } from 'vitest'
import { loadPrefs, savePrefs } from './prefs'

const store: Record<string, string> = {}
const localStorageMock = {
  getItem:    (k: string)            => store[k] ?? null,
  setItem:    (k: string, v: string) => { store[k] = String(v) },
  removeItem: (k: string)            => { delete store[k] },
}

beforeEach(() => {
  Object.keys(store).forEach(k => delete store[k])
  vi.stubGlobal('localStorage', localStorageMock)
})

const DEFAULTS = {
  lang: 'he',
  selectedCategory: 'upper',
  selectedDuration: 30,
  selectedVariation: 'a',
  skipWarmup: false,
}

describe('loadPrefs', () => {
  it('returns defaults when nothing is stored', () => {
    expect(loadPrefs()).toEqual(DEFAULTS)
  })

  it('returns defaults on corrupt JSON', () => {
    store['oogi_prefs'] = '{invalid'
    expect(loadPrefs()).toEqual(DEFAULTS)
  })

  it('returns stored values when valid', () => {
    const saved = { lang: 'en', selectedCategory: 'lower', selectedDuration: 45, selectedVariation: 'b', skipWarmup: true }
    store['oogi_prefs'] = JSON.stringify(saved)
    expect(loadPrefs()).toEqual(saved)
  })

  it('merges stored values with defaults — unknown keys are dropped, missing keys use defaults', () => {
    store['oogi_prefs'] = JSON.stringify({ lang: 'en' })
    expect(loadPrefs()).toEqual({ ...DEFAULTS, lang: 'en' })
  })
})

describe('savePrefs', () => {
  it('persists all preference fields', () => {
    const prefs = { lang: 'en', selectedCategory: 'lower', selectedDuration: 45, selectedVariation: 'b', skipWarmup: true }
    savePrefs(prefs)
    expect(loadPrefs()).toEqual(prefs)
  })

  it('round-trips default values unchanged', () => {
    savePrefs(DEFAULTS)
    expect(loadPrefs()).toEqual(DEFAULTS)
  })

  it('does not throw when localStorage is unavailable', () => {
    vi.stubGlobal('localStorage', undefined)
    expect(() => savePrefs(DEFAULTS)).not.toThrow()
  })
})
