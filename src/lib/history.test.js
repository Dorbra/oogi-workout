import { describe, it, expect, beforeEach, vi } from 'vitest'
import { loadHistory, appendEntry, deleteEntry, clearHistory } from './history'

const store = {}
const localStorageMock = {
  getItem:    (k)    => store[k] ?? null,
  setItem:    (k, v) => { store[k] = String(v) },
  removeItem: (k)    => { delete store[k] },
}

beforeEach(() => {
  Object.keys(store).forEach(k => delete store[k])
  vi.stubGlobal('localStorage', localStorageMock)
})

describe('loadHistory', () => {
  it('returns empty array when nothing is stored', () => {
    expect(loadHistory()).toEqual([])
  })

  it('returns empty array on corrupt JSON', () => {
    store['oogi_history'] = '{invalid'
    expect(loadHistory()).toEqual([])
  })

  it('returns empty array on schema version mismatch', () => {
    store['oogi_history'] = JSON.stringify({ version: 99, entries: [{ id: '1' }] })
    expect(loadHistory()).toEqual([])
  })

  it('returns stored entries when valid', () => {
    const entry = { id: 'a', completedAt: '2026-01-01T00:00:00.000Z', elapsedSeconds: 100 }
    store['oogi_history'] = JSON.stringify({ version: 1, entries: [entry] })
    expect(loadHistory()).toEqual([entry])
  })
})

describe('appendEntry', () => {
  it('returns true and the entry is retrievable', () => {
    const entry = { id: 'x', completedAt: '2026-04-24T10:00:00.000Z', elapsedSeconds: 1800 }
    expect(appendEntry(entry)).toBe(true)
    expect(loadHistory()).toEqual([entry])
  })

  it('prepends so newest entry comes first', () => {
    appendEntry({ id: 'first', completedAt: '2026-04-23T08:00:00.000Z' })
    appendEntry({ id: 'second', completedAt: '2026-04-24T08:00:00.000Z' })
    const entries = loadHistory()
    expect(entries[0].id).toBe('second')
    expect(entries[1].id).toBe('first')
  })

  it('accumulates multiple entries', () => {
    appendEntry({ id: '1' })
    appendEntry({ id: '2' })
    appendEntry({ id: '3' })
    expect(loadHistory()).toHaveLength(3)
  })

  it('preserves all fields on the entry', () => {
    const entry = {
      id: 'full',
      completedAt: '2026-04-24T10:00:00.000Z',
      category: 'upper',
      duration: 30,
      variation: 'a',
      skipWarmup: false,
      elapsedSeconds: 1842,
    }
    appendEntry(entry)
    expect(loadHistory()[0]).toEqual(entry)
  })
})

describe('deleteEntry', () => {
  it('removes the entry with the matching id', () => {
    appendEntry({ id: 'keep' })
    appendEntry({ id: 'remove' })
    deleteEntry('remove')
    const entries = loadHistory()
    expect(entries).toHaveLength(1)
    expect(entries[0].id).toBe('keep')
  })

  it('is a no-op when the id does not exist', () => {
    appendEntry({ id: 'x' })
    deleteEntry('nonexistent')
    expect(loadHistory()).toHaveLength(1)
  })

  it('returns true on success', () => {
    appendEntry({ id: 'x' })
    expect(deleteEntry('x')).toBe(true)
  })

  it('returns true even when the id is not found', () => {
    expect(deleteEntry('ghost')).toBe(true)
  })
})

describe('clearHistory', () => {
  it('removes all entries', () => {
    appendEntry({ id: '1' })
    appendEntry({ id: '2' })
    clearHistory()
    expect(loadHistory()).toEqual([])
  })

  it('returns true', () => {
    expect(clearHistory()).toBe(true)
  })

  it('is safe to call when already empty', () => {
    expect(clearHistory()).toBe(true)
    expect(loadHistory()).toEqual([])
  })
})
