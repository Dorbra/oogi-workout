import { describe, it, expect, beforeEach, vi } from 'vitest'
import { vibrateShort, vibrateDouble, vibrateLong } from './haptics'

describe('vibrateShort', () => {
  beforeEach(() => vi.stubGlobal('navigator', { vibrate: vi.fn() }))

  it('calls navigator.vibrate(180)', () => {
    vibrateShort()
    expect(navigator.vibrate).toHaveBeenCalledWith(180)
  })
})

describe('vibrateDouble', () => {
  beforeEach(() => vi.stubGlobal('navigator', { vibrate: vi.fn() }))

  it('calls navigator.vibrate with a pulse-pause-pulse pattern', () => {
    vibrateDouble()
    expect(navigator.vibrate).toHaveBeenCalledWith([180, 80, 300])
  })
})

describe('vibrateLong', () => {
  beforeEach(() => vi.stubGlobal('navigator', { vibrate: vi.fn() }))

  it('calls navigator.vibrate(800)', () => {
    vibrateLong()
    expect(navigator.vibrate).toHaveBeenCalledWith(800)
  })
})

describe('when vibrate is not supported', () => {
  beforeEach(() => vi.stubGlobal('navigator', {}))

  it('does not throw when vibrate is missing', () => {
    expect(() => vibrateShort()).not.toThrow()
    expect(() => vibrateDouble()).not.toThrow()
    expect(() => vibrateLong()).not.toThrow()
  })
})
