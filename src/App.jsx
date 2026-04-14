import { useReducer, useEffect, useRef } from 'react'
import { reducer, initialState } from './store/reducer'
import { playBeep, playStartTone, playRestTone } from './lib/audio'
import { HomeScreen } from './screens/HomeScreen'
import { PreviewScreen } from './screens/PreviewScreen'
import { ActiveWorkoutScreen } from './screens/ActiveWorkoutScreen'
import { CompleteScreen } from './screens/CompleteScreen'

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Timer
  useEffect(() => {
    if (state.screen !== 'active' || state.isPaused) return
    const id = setInterval(() => dispatch({ type: 'TICK' }), 1000)
    return () => clearInterval(id)
  }, [state.screen, state.isPaused])

  // Wake Lock — keep screen on during active workout
  useEffect(() => {
    if (!('wakeLock' in navigator)) return
    if (state.screen !== 'active') return

    let wakeLock = null

    const acquire = async () => {
      try {
        wakeLock = await navigator.wakeLock.request('screen')
      } catch (_) {
        // silently ignore — wake lock is a best-effort feature
      }
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') acquire()
    }

    acquire()
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      if (wakeLock) wakeLock.release()
    }
  }, [state.screen])

  // Sound effects
  const prevStep = useRef(null)
  useEffect(() => {
    if (state.screen !== 'active') return
    const step = state.steps[state.stepIndex]
    if (!step) return

    // Beep on countdown 3-2-1 during transition or rest
    if ((step.type === 'transition' || step.type === 'rest') && state.secondsRemaining <= 3 && state.secondsRemaining > 0) {
      playBeep(state.secondsRemaining === 1 ? 1200 : 880, 0.1)
    }

    // Beep on last 5 seconds during exercise (work) sets
    if (step.type === 'exercise' && state.secondsRemaining <= 5 && state.secondsRemaining > 0) {
      playBeep(state.secondsRemaining === 1 ? 1200 : 660, 0.12, 0.2)
    }

    // Tone on new step
    if (prevStep.current !== state.stepIndex) {
      if (step.type === 'exercise') playStartTone()
      else if (step.type === 'rest') playRestTone()
      prevStep.current = state.stepIndex
    }
  }, [state.secondsRemaining, state.stepIndex, state.screen])

  return (
    <div
      dir={state.lang === 'he' ? 'rtl' : 'ltr'}
      className="h-full bg-zinc-950 text-white max-w-2xl mx-auto relative overflow-hidden"
    >
      {state.screen === 'home'     && <HomeScreen          state={state} dispatch={dispatch} />}
      {state.screen === 'preview'  && <PreviewScreen       state={state} dispatch={dispatch} />}
      {state.screen === 'active'   && <ActiveWorkoutScreen state={state} dispatch={dispatch} />}
      {state.screen === 'complete' && <CompleteScreen      state={state} dispatch={dispatch} />}
    </div>
  )
}
