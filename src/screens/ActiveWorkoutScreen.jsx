import { useCallback } from 'react'
import { T } from '../constants/translations'
import { totalRemainingSeconds, formatTime } from '../lib/steps'
import { ExerciseSvg } from '../components/Svgs'
import { NavBar } from '../components/NavBar'
import { ProgressBar } from '../components/ProgressBar'

export function ActiveWorkoutScreen({ state, dispatch }) {
  const t = T[state.lang]
  const isHe = state.lang === 'he'
  const step = state.steps[state.stepIndex]
  if (!step) return null

  const totalRemaining = totalRemainingSeconds(state.steps, state.stepIndex, state.secondsRemaining)
  const progress = step.duration > 0 ? state.secondsRemaining / step.duration : 0
  const exerciseCount = state.groupStarts.length - 1
  const currentGroup = step.groupIndex ?? 0

  const handleCenterTap = useCallback(() => {
    dispatch({ type: 'PAUSE_RESUME' })
  }, [dispatch])

  // TRANSITION screen
  if (step.type === 'transition') {
    const ex = step.previewExercise
    const instr = ex ? (isHe ? ex.instrHe : ex.instrEn) : null
    return (
      <div className="flex flex-col h-full bg-zinc-950 relative">
        <div className="flex items-center justify-between px-5 pt-5 pb-2 shrink-0">
          <div>
            <p className="text-orange-400 font-black text-lg leading-tight">{t.getReady}</p>
            <p className="text-zinc-600 text-xs">{currentGroup}/{exerciseCount} · ⏱ {formatTime(totalRemaining)} {t.remaining}</p>
          </div>
          <span className="text-7xl font-black text-white tabular-nums leading-none">{state.secondsRemaining}</span>
        </div>

        <div className="flex-1 flex flex-col px-4 gap-3 overflow-y-auto pb-2" onClick={handleCenterTap}>
          {ex && (
            <div className="w-full rounded-xl overflow-hidden bg-zinc-900/40 border border-zinc-800/50">
              <div className="w-full" style={{ aspectRatio: '200/80' }}>
                <ExerciseSvg svgKey={ex.svg} />
              </div>
            </div>
          )}

          {ex && (
            <div className="bg-zinc-900 rounded-2xl px-4 py-3 border border-zinc-800">
              {step.isSuperset && (
                <p className="text-orange-400 text-xs font-black uppercase tracking-wide mb-1">{t.superset}</p>
              )}
              <p className="text-white font-black text-xl leading-tight">{isHe ? ex.nameHe : ex.nameEn}</p>
              {step.isSuperset && step.previewExB && (
                <p className="text-zinc-400 font-bold text-base mt-0.5">+ {isHe ? step.previewExB.nameHe : step.previewExB.nameEn}</p>
              )}
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className="text-orange-400 font-black text-base">{step.workoutEx.sets}×{step.workoutEx.reps}</span>
                <div className="inline-flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-1">
                  <span className="text-orange-300 font-bold text-sm">🏋️ {step.workoutEx.weight}</span>
                </div>
                {step.isSuperset && step.workoutExB && step.workoutExB.weight !== step.workoutEx.weight && (
                  <div className="inline-flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-1">
                    <span className="text-orange-300 font-bold text-sm">🏋️ {step.workoutExB.weight}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {instr && (
            <div className="bg-zinc-900/60 rounded-xl px-4 py-3 border border-zinc-800/50">
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-wide mb-1">{isHe ? 'הוראות ביצוע' : 'Form cues'}</p>
              <p className="text-zinc-200 text-sm leading-relaxed">{instr}</p>
            </div>
          )}

          {step.isSuperset && step.previewExB && (
            <div className="bg-zinc-900/60 rounded-xl px-4 py-3 border border-zinc-800/50">
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-wide mb-1">{isHe ? step.previewExB.nameHe : step.previewExB.nameEn}</p>
              <p className="text-zinc-200 text-sm leading-relaxed">{isHe ? step.previewExB.instrHe : step.previewExB.instrEn}</p>
            </div>
          )}
        </div>

        <NavBar t={t} dispatch={dispatch} isPaused={state.isPaused} isTransition />
        <ProgressBar progress={progress} />
      </div>
    )
  }

  // WARMUP screen
  if (step.type === 'warmup') {
    const ex = step.exercise
    return (
      <div className="flex flex-col h-full bg-zinc-950">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <span className="text-zinc-500 text-sm font-medium">{t.warmup}</span>
          <span className="text-zinc-500 text-sm font-medium">⏱ {formatTime(totalRemaining)} {t.remaining}</span>
        </div>

        <div className="flex-1 flex flex-col px-5 gap-4 overflow-hidden" onClick={handleCenterTap}>
          <div className="h-36 md:h-48 flex items-center justify-center">
            <div className="w-32 h-32 md:w-44 md:h-44">
              <ExerciseSvg svgKey={ex.svg} />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-white font-black text-4xl md:text-5xl leading-tight">{isHe ? ex.nameHe : ex.nameEn}</h2>
            {isHe && <p className="text-zinc-500 text-base md:text-lg mt-1">{ex.nameEn}</p>}
          </div>
          <p className="text-zinc-400 text-base md:text-lg leading-relaxed text-center px-2">
            {isHe ? ex.instrHe : ex.instrEn}
          </p>
          <div className="flex flex-col items-center gap-3 mt-auto pb-4">
            <span className="text-7xl md:text-8xl font-black text-orange-400 tabular-nums">{state.secondsRemaining}</span>
            <ProgressBar progress={progress} />
          </div>
        </div>

        <NavBar t={t} dispatch={dispatch} isPaused={state.isPaused} />
      </div>
    )
  }

  // REST screen
  if (step.type === 'rest') {
    const ex = step.previewExercise
    return (
      <div className="flex flex-col h-full bg-zinc-950">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <span className="text-zinc-500 text-sm font-medium">⏱ {formatTime(totalRemaining)} {t.remaining}</span>
          <span className="text-zinc-600 text-sm">{currentGroup}/{exerciseCount}</span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6" onClick={handleCenterTap}>
          <p className="text-orange-400 font-black text-3xl md:text-4xl">{t.rest}</p>
          <div className="text-9xl md:text-[10rem] font-black text-white leading-none tabular-nums">
            {state.secondsRemaining}
          </div>
          {ex && (
            <div className="bg-zinc-900 rounded-2xl px-6 py-3 w-full max-w-sm border border-zinc-800 text-center">
              <p className="text-zinc-400 text-sm mb-1">{step.isInterExercise ? t.nextExercise : t.nextSet}:</p>
              <p className="text-white font-bold text-lg">{isHe ? ex.nameHe : ex.nameEn}</p>
              {!step.isInterExercise && step.isSuperset && step.previewExB && (
                <p className="text-zinc-400 text-sm mt-0.5">+ {isHe ? step.previewExB.nameHe : step.previewExB.nameEn}</p>
              )}
            </div>
          )}

          <button
            onClick={e => { e.stopPropagation(); dispatch({ type: 'EXTEND_REST' }) }}
            className="text-zinc-400 font-black text-2xl px-10 py-4 rounded-2xl border border-zinc-700 bg-zinc-900 active:scale-95 active:bg-zinc-800"
          >
            {t.extendRest}
          </button>
        </div>

        <ProgressBar progress={progress} color="bg-blue-500" />
        <NavBar t={t} dispatch={dispatch} isPaused={state.isPaused} />
      </div>
    )
  }

  // COOLDOWN screen
  if (step.type === 'cooldown') {
    const ex = step.exercise
    return (
      <div className="flex flex-col h-full bg-zinc-950">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <span className="text-zinc-400 font-bold text-sm">{t.cooldown}</span>
          <span className="text-zinc-500 text-sm">⏱ {formatTime(totalRemaining)} {t.remaining}</span>
        </div>

        <div className="flex-1 flex flex-col px-5 gap-4 overflow-hidden" onClick={handleCenterTap}>
          <div className="h-36 md:h-48 flex items-center justify-center">
            <div className="w-32 h-32 md:w-44 md:h-44">
              <ExerciseSvg svgKey={ex.svg} />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-white font-black text-4xl md:text-5xl">{isHe ? ex.nameHe : ex.nameEn}</h2>
            {isHe && <p className="text-zinc-500 text-base md:text-lg mt-1">{ex.nameEn}</p>}
          </div>
          <p className="text-zinc-400 text-base md:text-lg leading-relaxed text-center px-2">{isHe ? ex.instrHe : ex.instrEn}</p>
          <div className="flex flex-col items-center gap-3 mt-auto pb-4">
            <span className="text-7xl md:text-8xl font-black text-orange-400 tabular-nums">{state.secondsRemaining}</span>
            <ProgressBar progress={progress} color="bg-teal-500" />
          </div>
        </div>

        <NavBar t={t} dispatch={dispatch} isPaused={state.isPaused} />
      </div>
    )
  }

  // EXERCISE SET screen
  const ex = step.exercise
  const wo = step.workoutEx
  const name = isHe ? ex.nameHe : ex.nameEn
  const instr = isHe ? ex.instrHe : ex.instrEn

  return (
    <div className="flex flex-col h-full bg-zinc-950 relative">
      <div className="flex items-center justify-between px-5 pt-5 pb-2 shrink-0">
        <span className="text-zinc-500 text-sm font-medium">⏱ {formatTime(totalRemaining)} {t.remaining}</span>
        <span className="text-zinc-600 text-sm font-medium">{currentGroup}/{exerciseCount}</span>
      </div>

      {step.supersetPart && (
        <div className="px-5 shrink-0">
          <span className="text-xs text-orange-400 font-black uppercase tracking-wide bg-orange-500/10 px-3 py-1 rounded-full">
            {t.superset} · {step.supersetPart === 'A' ? 'א' : 'ב'}
          </span>
        </div>
      )}

      <div className="flex-1 flex flex-col px-5 gap-3 md:gap-4 overflow-hidden min-h-0" onClick={handleCenterTap}>
        <div className="w-full px-1 shrink-0">
          <div className="w-full" style={{ aspectRatio: '200/80' }}>
            <ExerciseSvg svgKey={ex.svg} />
          </div>
        </div>

        <div className="text-center shrink-0">
          <h2 className="text-white font-black leading-tight" style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)' }}>
            {name}
          </h2>
          {isHe && <p className="text-zinc-500 text-sm md:text-base mt-0.5">{ex.nameEn}</p>}
        </div>

        <div className="flex items-center justify-center gap-4 md:gap-8 shrink-0">
          <div className="text-center">
            <p className="text-zinc-500 text-xs md:text-sm uppercase tracking-wide">{t.set}</p>
            <p className="text-white font-black text-3xl md:text-4xl">{step.set}{t.of}{step.totalSets}</p>
          </div>
          <div className="w-px h-10 md:h-12 bg-zinc-800" />
          <div className="text-center">
            <p className="text-zinc-500 text-xs md:text-sm uppercase tracking-wide">{t.reps}</p>
            <p className="text-orange-400 font-black text-3xl md:text-4xl">{wo.reps}</p>
          </div>
          <div className="w-px h-10 md:h-12 bg-zinc-800" />
          <div className="text-center">
            <p className="text-zinc-500 text-xs md:text-sm uppercase tracking-wide">{t.weight}</p>
            <p className="text-zinc-300 font-bold text-base md:text-lg">{wo.weight}</p>
          </div>
        </div>

        <p className="text-zinc-400 text-sm md:text-base leading-relaxed text-center px-2 shrink-0 line-clamp-3">
          {instr}
        </p>

        <div className="mt-auto pb-2 shrink-0 space-y-3">
          <div className="flex items-center justify-center">
            <span className={`text-7xl md:text-8xl font-black tabular-nums leading-none transition-colors ${
              state.secondsRemaining <= 10 ? 'text-red-500' : 'text-orange-400'
            }${state.secondsRemaining <= 5 ? ' animate-pulse' : ''}`}>
              {state.secondsRemaining}
            </span>
          </div>
          <ProgressBar progress={progress} color={state.secondsRemaining <= 10 ? 'bg-red-500' : 'bg-orange-500'} />
        </div>
      </div>

      <NavBar t={t} dispatch={dispatch} isPaused={state.isPaused} />

      {state.isPaused && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 z-10">
          <p className="text-white font-black text-5xl md:text-6xl">{t.paused}</p>
          <p className="text-zinc-400 text-lg md:text-xl">{t.tapResume}</p>
          <button
            onClick={() => dispatch({ type: 'PAUSE_RESUME' })}
            className="mt-4 bg-orange-500 text-white font-black text-2xl md:text-3xl px-12 md:px-16 py-5 md:py-6 rounded-2xl active:scale-95"
          >
            {t.resume}
          </button>
        </div>
      )}
    </div>
  )
}
