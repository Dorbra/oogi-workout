const STORAGE_KEY = 'oogi_history'
const SCHEMA_VERSION = 1

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { version: SCHEMA_VERSION, entries: [] }
    const parsed = JSON.parse(raw)
    if (parsed.version !== SCHEMA_VERSION) return { version: SCHEMA_VERSION, entries: [] }
    return parsed
  } catch {
    return { version: SCHEMA_VERSION, entries: [] }
  }
}

function write(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

export function loadHistory() {
  return read().entries
}

export function appendEntry(entry) {
  const data = read()
  data.entries = [entry, ...data.entries]
  return write(data)
}

export function deleteEntry(id) {
  const data = read()
  data.entries = data.entries.filter(e => e.id !== id)
  return write(data)
}

export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch {
    return false
  }
}
