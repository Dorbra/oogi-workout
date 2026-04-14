import { useEffect } from 'react'

export function useWorkoutTimer(dispatch, screen, isPaused) {
  useEffect(() => {
    if (screen !== 'active' || isPaused) return
    const id = setInterval(() => dispatch({ type: 'TICK' }), 1000)
    return () => clearInterval(id)
  }, [screen, isPaused, dispatch])
}
