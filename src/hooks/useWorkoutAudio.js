import { useEffect, useRef } from 'react'
import { playBeep, playStartTone, playRestTone } from '../lib/audio'

export function useWorkoutAudio(screen, steps, stepIndex, secondsRemaining) {
  const prevStepRef = useRef(null)

  useEffect(() => {
    if (screen !== 'active') return
    const step = steps[stepIndex]
    if (!step) return

    // Countdown beeps during transition or rest (last 3 seconds)
    if ((step.type === 'transition' || step.type === 'rest') && secondsRemaining <= 3 && secondsRemaining > 0) {
      playBeep(secondsRemaining === 1 ? 1200 : 880, 0.1)
    }

    // Countdown beeps during exercise sets (last 5 seconds)
    if (step.type === 'exercise' && secondsRemaining <= 5 && secondsRemaining > 0) {
      playBeep(secondsRemaining === 1 ? 1200 : 660, 0.12, 0.2)
    }

    // Tone on step change
    if (prevStepRef.current !== stepIndex) {
      if (step.type === 'exercise') playStartTone()
      else if (step.type === 'rest') playRestTone()
      prevStepRef.current = stepIndex
    }
  }, [secondsRemaining, stepIndex, screen, steps])
}
