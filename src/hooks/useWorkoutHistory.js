import { useState, useCallback } from 'react'
import { loadHistory, appendEntry, deleteEntry, clearHistory } from '../lib/history'

export function useWorkoutHistory() {
  const [history, setHistory] = useState(() => loadHistory())

  const saveWorkout = useCallback((entry) => {
    const ok = appendEntry(entry)
    if (ok) setHistory(loadHistory())
    return ok
  }, [])

  const removeEntry = useCallback((id) => {
    const ok = deleteEntry(id)
    if (ok) setHistory(loadHistory())
    return ok
  }, [])

  const wipeHistory = useCallback(() => {
    const ok = clearHistory()
    if (ok) setHistory([])
    return ok
  }, [])

  return { history, saveWorkout, removeEntry, wipeHistory }
}
