import { useCallback } from 'react'
import { T } from '../constants/translations'
import { totalRemainingSeconds, formatTime } from '../lib/steps'
import { ExerciseSvg } from '../components/Svgs'
import { NavBar } from '../components/NavBar'
import { ProgressBar } from '../components/ProgressBar'
import { TimerRing } from '../components/TimerRing'

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

  // ── TRANSITION ──────────────────────────────────────────
  if (step.type === 'transition') {
    const ex = step.previewExercise
    const instr = ex ? (isHe ? ex.instrHe : ex.instrEn) : null
    return (
      <div className="flex flex-col h-full relative">
        <div className="flex items-center justify-between px-5 pt-4 pb-2 flex-shrink-0">
          <div>
            <p className="text-orange-600 dark:text-orange-400 font-black text-lg leading-tight">{t.getReady}</p>
            <p className="text-zinc-500 dark:text-zinc-600 text-xs mt-0.5">{currentGroup}/{exerciseCount} · ⏱ {formatTime(totalRemaining)} {t.remaining}</p>
          </div>
          <TimerRing seconds={state.secondsRemaining} totalSeconds={step.duration} color="orange" size={72} />
        </div>

        <div className="flex-1 flex flex-col px-4 gap-3 overflow-y-auto pb-2" onClick={handleCenterTap}>
          {ex && (
            <div className="w-full rounded-2xl overflow-hidden" style={{ background: 'var(--color-svg-bg)', border: '1px solid var(--color-svg-border)' }}>
              <div className="w-full" style={{ aspectRatio: '200/80' }}>
                <ExerciseSvg svgKey={ex.svg} />
              </div>
            </div>
          )}

          {ex && (
            <div className="glass rounded-2xl px-4 py-3">
              {step.isSuperset && (
                <span className="inline-block text-orange-600 dark:text-orange-400 text-xs font-black uppercase tracking-wide bg-orange-500/10 px-2.5 py-0.5 rounded-full mb-2">{t.superset}</span>
              )}
              <p className="text-zinc-900 dark:text-white font-black text-xl leading-tight">{isHe ? ex.nameHe : ex.nameEn}</p>
              {step.isSuperset && step.previewExB && (
                <p className="text-zinc-500 dark:text-zinc-400 font-bold text-base mt-0.5">+ {isHe ? step.previewExB.nameHe : step.previewExB.nameEn}</p>
              )}
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className="font-display font-black text-orange-600 dark:text-orange-400 text-lg">{step.workoutEx.sets}×{step.workoutEx.reps}</span>
                <div className="inline-flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/25 dark:border-orange-500/20 rounded-full px-3 py-1">
                  <span className="text-orange-600 dark:text-orange-300 font-bold text-sm">🏋️ {step.workoutEx.weight}</span>
                </div>
                {step.isSuperset && step.workoutExB && step.workoutExB.weight !== step.workoutEx.weight && (
                  <div className="inline-flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/25 dark:border-orange-500/20 rounded-full px-3 py-1">
                    <span className="text-orange-600 dark:text-orange-300 font-bold text-sm">🏋️ {step.workoutExB.weight}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {instr && (
            <div className="glass rounded-xl px-4 py-3">
              <p className="text-zinc-500 dark:text-zinc-600 text-xs font-bold uppercase tracking-wide mb-1">{isHe ? 'הוראות ביצוע' : 'Form cues'}</p>
              <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">{instr}</p>
            </div>
          )}

          {step.isSuperset && step.previewExB && (
            <div className="glass rounded-xl px-4 py-3">
              <p className="text-zinc-500 dark:text-zinc-600 text-xs font-bold uppercase tracking-wide mb-1">{isHe ? step.previewExB.nameHe : step.previewExB.nameEn}</p>
              <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">{isHe ? step.previewExB.instrHe : step.previewExB.instrEn}</p>
            </div>
          )}
        </div>

        <ProgressBar progress={progress} />
        <NavBar t={t} dispatch={dispatch} isPaused={state.isPaused} isTransition />
      </div>
    )
  }

  // ── WARMUP ──────────────────────────────────────────────
  if (step.type === 'warmup') {
    const ex = step.exercise
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-5 pt-4 pb-2 flex-shrink-0">
          <span className="text-teal-600 dark:text-teal-400 font-bold text-sm tracking-wide uppercase">{t.warmup}</span>
          <span className="text-zinc-500 dark:text-zinc-600 text-xs">⏱ {formatTime(totalRemaining)} {t.remaining}</span>
        </div>

        <div className="flex-1 flex flex-col items-center px-5 gap-4 overflow-hidden" onClick={handleCenterTap}>
          <div className="w-full rounded-2xl overflow-hidden flex-shrink-0" style={{ background: 'var(--color-svg-bg)', border: '1px solid var(--color-svg-border)', aspectRatio: '200/80' }}>
            <ExerciseSvg svgKey={ex.svg} />
          </div>

          <div className="text-center flex-shrink-0">
            <h2 className="text-zinc-900 dark:text-white font-black leading-tight" style={{ fontSize: 'clamp(1.5rem, 6vw, 2.5rem)' }}>
              {isHe ? ex.nameHe : ex.nameEn}
            </h2>
            {isHe && <p className="text-zinc-500 dark:text-zinc-600 text-sm mt-0.5">{ex.nameEn}</p>}
          </div>

          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed text-center px-2 flex-shrink-0 line-clamp-3">
            {isHe ? ex.instrHe : ex.instrEn}
          </p>

          <div className="flex flex-col items-center gap-3 mt-auto pb-2 flex-shrink-0">
            <TimerRing seconds={state.secondsRemaining} totalSeconds={step.duration} color="teal" size={148} />
          </div>
        </div>

        <ProgressBar progress={progress} color="bg-teal-500" />
        <NavBar t={t} dispatch={dispatch} isPaused={state.isPaused} />
      </div>
    )
  }

  // ── REST ────────────────────────────────────────────────
  if (step.type === 'rest') {
    const ex = step.previewExercise
    const isIntraSet = !step.isInterExercise
    return (
      <div
        className="flex flex-col h-full"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(99,102,241,0.1) 0%, transparent 65%)' }}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-indigo-600 dark:text-indigo-400 font-black text-sm tracking-widest uppercase">{t.rest}</span>
            {isIntraSet && step.set != null && (
              <span className="text-zinc-500 text-xs font-bold">
                · {t.set} {step.set}{t.of}{step.totalSets}
              </span>
            )}
          </div>
          <span className="text-zinc-500 dark:text-zinc-600 text-xs">{currentGroup}/{exerciseCount} · ⏱ {formatTime(totalRemaining)} {t.remaining}</span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-5 px-5" onClick={handleCenterTap}>
          <TimerRing seconds={state.secondsRemaining} totalSeconds={step.duration} color="blue" size={172} />

          {ex && (
            <div className="glass rounded-2xl px-5 py-3 w-full max-w-sm text-center">
              <p className="text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-1">
                {step.isInterExercise ? t.nextExercise : t.nextSet}
              </p>
              <p className="text-zinc-900 dark:text-white font-black text-lg">{isHe ? ex.nameHe : ex.nameEn}</p>
              {!step.isInterExercise && step.isSuperset && step.previewExB && (
                <p className="text-zinc-500 text-sm mt-0.5">+ {isHe ? step.previewExB.nameHe : step.previewExB.nameEn}</p>
              )}
            </div>
          )}

          <button
            onClick={e => { e.stopPropagation(); dispatch({ type: 'EXTEND_REST' }) }}
            className="glass rounded-full text-indigo-700 dark:text-indigo-300 font-black text-lg px-8 py-3 active:scale-95 transition-transform"
            style={{ border: '1px solid rgba(99,102,241,0.25)' }}
          >
            {t.extendRest}
          </button>
        </div>

        <ProgressBar progress={progress} color="bg-blue-500" />
        <NavBar
          t={t}
          dispatch={dispatch}
          isPaused={state.isPaused}
          prevAction={isIntraSet ? 'SKIP_SET_BACKWARD' : 'SKIP_BACKWARD'}
          nextAction={isIntraSet ? 'SKIP_SET_FORWARD' : 'SKIP_FORWARD'}
        />
      </div>
    )
  }

  // ── COOLDOWN ─────────────────────────────────────────────
  if (step.type === 'cooldown') {
    const ex = step.exercise
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-5 pt-4 pb-2 flex-shrink-0">
          <span className="text-teal-600 dark:text-teal-400 font-bold text-sm tracking-wide uppercase">{t.cooldown}</span>
          <span className="text-zinc-500 dark:text-zinc-600 text-xs">⏱ {formatTime(totalRemaining)} {t.remaining}</span>
        </div>

        <div className="flex-1 flex flex-col items-center px-5 gap-4 overflow-hidden" onClick={handleCenterTap}>
          <div className="w-full rounded-2xl overflow-hidden flex-shrink-0" style={{ background: 'var(--color-svg-bg)', border: '1px solid var(--color-svg-border)', aspectRatio: '200/80' }}>
            <ExerciseSvg svgKey={ex.svg} />
          </div>

          <div className="text-center flex-shrink-0">
            <h2 className="text-zinc-900 dark:text-white font-black leading-tight" style={{ fontSize: 'clamp(1.5rem, 6vw, 2.5rem)' }}>
              {isHe ? ex.nameHe : ex.nameEn}
            </h2>
            {isHe && <p className="text-zinc-500 dark:text-zinc-600 text-sm mt-0.5">{ex.nameEn}</p>}
          </div>

          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed text-center px-2 flex-shrink-0 line-clamp-3">
            {isHe ? ex.instrHe : ex.instrEn}
          </p>

          <div className="flex flex-col items-center gap-3 mt-auto pb-2 flex-shrink-0">
            <TimerRing seconds={state.secondsRemaining} totalSeconds={step.duration} color="teal" size={148} />
          </div>
        </div>

        <ProgressBar progress={progress} color="bg-teal-500" />
        <NavBar t={t} dispatch={dispatch} isPaused={state.isPaused} />
      </div>
    )
  }

  // ── EXERCISE SET ─────────────────────────────────────────
  const ex = step.exercise
  const wo = step.workoutEx
  const name = isHe ? ex.nameHe : ex.nameEn
  const instr = isHe ? ex.instrHe : ex.instrEn
  const isUrgent = state.secondsRemaining <= 10
  const ringColor = isUrgent ? 'red' : 'orange'
  const barColor = isUrgent ? 'bg-red-500' : 'bg-orange-500'

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex items-center justify-between px-5 pt-4 pb-2 flex-shrink-0">
        <span className="text-zinc-500 dark:text-zinc-600 text-xs">⏱ {formatTime(totalRemaining)} {t.remaining}</span>
        <span className="text-zinc-500 dark:text-zinc-600 text-xs">{currentGroup}/{exerciseCount}</span>
      </div>

      {step.supersetPart && (
        <div className="px-5 flex-shrink-0 mb-1">
          <span className="text-xs text-orange-600 dark:text-orange-400 font-black uppercase tracking-wide bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full">
            {t.superset} · {step.supersetPart === 'A' ? 'א' : 'ב'}
          </span>
        </div>
      )}

      <div className="flex-1 flex flex-col px-5 gap-3 overflow-hidden min-h-0" onClick={handleCenterTap}>
        {/* SVG diagram */}
        <div className="w-full flex-shrink-0 rounded-2xl overflow-hidden" style={{ background: 'var(--color-svg-bg)', border: '1px solid var(--color-svg-border)', aspectRatio: '200/78' }}>
          <ExerciseSvg svgKey={ex.svg} />
        </div>

        {/* Name */}
        <div className="text-center flex-shrink-0">
          <h2 className="text-zinc-900 dark:text-white font-black leading-tight" style={{ fontSize: 'clamp(1.4rem, 5vw, 2.2rem)' }}>
            {name}
          </h2>
          {isHe && <p className="text-zinc-500 dark:text-zinc-600 text-xs mt-0.5">{ex.nameEn}</p>}
        </div>

        {/* Stats row */}
        <div className="glass rounded-2xl flex items-center justify-around py-3 flex-shrink-0">
          <div className="text-center">
            <p className="text-zinc-500 dark:text-zinc-600 text-xs uppercase tracking-wide mb-0.5">{t.set}</p>
            <p className="text-zinc-900 dark:text-white font-display font-black text-2xl leading-none">{step.set}<span className="text-zinc-500 dark:text-zinc-600 text-base">{t.of}{step.totalSets}</span></p>
          </div>
          <div className="w-px h-8 bg-black/8 dark:bg-white/8" />
          <div className="text-center">
            <p className="text-zinc-500 dark:text-zinc-600 text-xs uppercase tracking-wide mb-0.5">{t.reps}</p>
            <p className="text-orange-600 dark:text-orange-400 font-display font-black text-2xl leading-none">{wo.reps}</p>
          </div>
          <div className="w-px h-8 bg-black/8 dark:bg-white/8" />
          <div className="text-center">
            <p className="text-zinc-500 dark:text-zinc-600 text-xs uppercase tracking-wide mb-0.5">{t.weight}</p>
            <p className="text-zinc-600 dark:text-zinc-300 font-bold text-sm leading-none">{wo.weight}</p>
          </div>
        </div>

        {/* Form cue */}
        <p className="text-zinc-500 text-xs leading-relaxed text-center px-1 flex-shrink-0 line-clamp-2">
          {instr}
        </p>

        {/* Timer ring */}
        <div className="mt-auto pb-1 flex-shrink-0 flex flex-col items-center gap-2">
          <TimerRing
            seconds={state.secondsRemaining}
            totalSeconds={step.duration}
            color={ringColor}
            size={148}
          />
        </div>
      </div>

      <ProgressBar progress={progress} color={barColor} />
      <NavBar t={t} dispatch={dispatch} isPaused={state.isPaused} />

      {/* Pause overlay */}
      {state.isPaused && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-5 z-10"
          style={{ background: 'var(--color-pause-overlay)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
        >
          <p className="font-display font-black text-zinc-900 dark:text-white uppercase tracking-widest" style={{ fontSize: 'clamp(2.5rem, 12vw, 4rem)' }}>{t.paused}</p>
          <p className="text-zinc-500 text-base">{t.tapResume}</p>
          <button
            onClick={() => dispatch({ type: 'PAUSE_RESUME' })}
            className="mt-2 btn-shine text-white font-black text-xl px-12 py-4 rounded-2xl active:scale-95"
            style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)', boxShadow: '0 8px 24px rgba(249,115,22,0.4)' }}
          >
            {t.resume}
          </button>
        </div>
      )}
    </div>
  )
}
