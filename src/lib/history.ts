const STORAGE_KEY = 'oogi_history'
const SCHEMA_VERSION = 1

export interface HistoryEntry {
  id: string
  completedAt?: string
  category?: string
  duration?: number
  variation?: string | null
  skipWarmup?: boolean
  elapsedSeconds?: number
}

interface HistoryData {
  version: number
  entries: HistoryEntry[]
}

function read(): HistoryData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { version: SCHEMA_VERSION, entries: [] }
    const parsed = JSON.parse(raw) as HistoryData
    if (parsed.version !== SCHEMA_VERSION) return { version: SCHEMA_VERSION, entries: [] }
    return parsed
  } catch {
    return { version: SCHEMA_VERSION, entries: [] }
  }
}

function write(data: HistoryData): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

export function loadHistory(): HistoryEntry[] {
  return read().entries
}

export function appendEntry(entry: HistoryEntry): boolean {
  const data = read()
  data.entries = [entry, ...data.entries]
  return write(data)
}

export function deleteEntry(id: string): boolean {
  const data = read()
  data.entries = data.entries.filter(e => e.id !== id)
  return write(data)
}

export function clearHistory(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch {
    return false
  }
}
