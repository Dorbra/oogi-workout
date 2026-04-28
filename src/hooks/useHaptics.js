import { useEffect, useRef } from 'react'
import { vibrateShort, vibrateDouble, vibrateLong } from '../lib/haptics'

export function useHaptics(screen, steps, stepIndex, secondsRemaining) {
  const prevStepRef   = useRef(null)
  const prevScreenRef = useRef(null)

  useEffect(() => {
    // Long buzz once on workout completion
    if (screen === 'complete' && prevScreenRef.current !== 'complete') {
      vibrateLong()
    }
    prevScreenRef.current = screen

    if (screen !== 'active') return
    const step = steps[stepIndex]
    if (!step) return

    // Step-change: double pulse for exercise start, short pulse for everything else
    if (prevStepRef.current !== stepIndex) {
      if (step.type === 'exercise') vibrateDouble()
      else vibrateShort()
      prevStepRef.current = stepIndex
    }

    // One short pulse per second during the last 3 s of rest/transition (mirrors audio beeps)
    if ((step.type === 'rest' || step.type === 'transition') && secondsRemaining <= 3 && secondsRemaining > 0) {
      vibrateShort()
    }
  }, [secondsRemaining, stepIndex, screen, steps])
}
