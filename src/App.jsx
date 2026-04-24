import { useReducer, useEffect, useRef } from 'react'
import { reducer, initialState } from './store/reducer'
import { useWorkoutTimer } from './hooks/useWorkoutTimer'
import { useWakeLock } from './hooks/useWakeLock'
import { useWorkoutAudio } from './hooks/useWorkoutAudio'
import { useWorkoutHistory } from './hooks/useWorkoutHistory'
import { HomeScreen } from './screens/HomeScreen'
import { PreviewScreen } from './screens/PreviewScreen'
import { ActiveWorkoutScreen } from './screens/ActiveWorkoutScreen'
import { CompleteScreen } from './screens/CompleteScreen'
import { HistoryScreen } from './screens/HistoryScreen'

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { history, saveWorkout, removeEntry, wipeHistory } = useWorkoutHistory()
  const prevScreen = useRef(state.screen)

  useWorkoutTimer(dispatch, state.screen, state.isPaused)
  useWakeLock(state.screen)
  useWorkoutAudio(state.screen, state.steps, state.stepIndex, state.secondsRemaining)

  useEffect(() => {
    localStorage.setItem('theme', state.theme)
  }, [state.theme])

  // Save a history entry exactly once when a workout transitions to complete.
  useEffect(() => {
    if (prevScreen.current === 'active' && state.screen === 'complete') {
      const hasVariants =
        state.plan.templates[`${state.selectedCategory}_${state.selectedDuration}a`] !== undefined
      saveWorkout({
        id: crypto.randomUUID(),
        completedAt: new Date().toISOString(),
        category: state.selectedCategory,
        duration: state.selectedDuration,
        variation: hasVariants ? state.selectedVariation : null,
        skipWarmup: state.skipWarmup,
        elapsedSeconds: state.completedSeconds,
      })
    }
    prevScreen.current = state.screen
  }, [state.screen])

  return (
    <div
      dir={state.lang === 'he' ? 'rtl' : 'ltr'}
      className={`h-full bg-gradient-to-b from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 text-zinc-900 dark:text-white max-w-2xl mx-auto relative overflow-hidden${state.theme === 'dark' ? ' dark' : ''}`}
    >
      {state.screen === 'home'     && <HomeScreen     state={state} dispatch={dispatch} history={history} />}
      {state.screen === 'preview'  && <PreviewScreen  state={state} dispatch={dispatch} />}
      {state.screen === 'active'   && <ActiveWorkoutScreen state={state} dispatch={dispatch} />}
      {state.screen === 'complete' && <CompleteScreen state={state} dispatch={dispatch} />}
      {state.screen === 'history'  && (
        <HistoryScreen
          state={state}
          dispatch={dispatch}
          history={history}
          removeEntry={removeEntry}
          wipeHistory={wipeHistory}
        />
      )}
    </div>
  )
}
