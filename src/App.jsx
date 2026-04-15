import { useReducer } from 'react'
import { reducer, initialState } from './store/reducer'
import { useWorkoutTimer } from './hooks/useWorkoutTimer'
import { useWakeLock } from './hooks/useWakeLock'
import { useWorkoutAudio } from './hooks/useWorkoutAudio'
import { HomeScreen } from './screens/HomeScreen'
import { PreviewScreen } from './screens/PreviewScreen'
import { ActiveWorkoutScreen } from './screens/ActiveWorkoutScreen'
import { CompleteScreen } from './screens/CompleteScreen'

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  useWorkoutTimer(dispatch, state.screen, state.isPaused)
  useWakeLock(state.screen)
  useWorkoutAudio(state.screen, state.steps, state.stepIndex, state.secondsRemaining)

  return (
    <div
      dir={state.lang === 'he' ? 'rtl' : 'ltr'}
      className="h-full bg-gradient-to-b from-zinc-900 to-zinc-950 text-white max-w-2xl mx-auto relative overflow-hidden"
    >
      {state.screen === 'home'     && <HomeScreen          state={state} dispatch={dispatch} />}
      {state.screen === 'preview'  && <PreviewScreen       state={state} dispatch={dispatch} />}
      {state.screen === 'active'   && <ActiveWorkoutScreen state={state} dispatch={dispatch} />}
      {state.screen === 'complete' && <CompleteScreen      state={state} dispatch={dispatch} />}
    </div>
  )
}
