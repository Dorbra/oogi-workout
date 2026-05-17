import { useCallback, useMemo } from 'react'
import { T } from '../constants/translations'
import { totalRemainingSeconds, formatTime } from '../lib/steps'
import { ExerciseSvg } from '../components/Svgs'
import { NavBar } from '../components/NavBar'
import { ProgressBar } from '../components/ProgressBar'
import { TimerRing } from '../components/TimerRing'

export function ActiveWorkoutScreen({ state, dispatch, isWatch = false }) {
  const t = T[state.lang]
  const isHe = state.lang === 'he'

  // Memoize the O(n) loop over future steps; only re-runs on step transitions.
  // Add secondsRemaining inline — it changes every tick but the sum does not.
  const futureStepSeconds = useMemo(
    () => totalRemainingSeconds(state.steps, state.stepIndex, 0),
    [state.steps, state.stepIndex]
  )
  const handleCenterTap = useCallback(() => {
    dispatch({ type: 'PAUSE_RESUME' })
  }, [dispatch])

  const step = state.steps[state.stepIndex]
  if (!step) return null

  const totalRemaining = futureStepSeconds + state.secondsRemaining
  const progress = step.duration > 0 ? state.secondsRemaining / step.duration : 0
  const exerciseCount = state.groupStarts.length - 1
  const currentGroup = step.groupIndex ?? 0

  // ── TRANSITION ──────────────────────────────────────────
  if (step.type === 'transition') {
    const ex = step.previewExercise
    const instr = ex ? (isHe ? ex.instrHe : ex.instrEn) : null

    if (isWatch) {
      return (
        <div className="flex flex-col h-full relative">
          <div className="flex items-center justify-between px-4 pt-3 pb-1 flex-shrink-0">
            <p className="text-teal-600 dark:text-teal-400 font-black text-base">{t.getReady}</p>
            <TimerRing seconds={state.secondsRemaining} totalSeconds={step.duration} color="orange" size={60} />
          </div>
          <div className="flex-1 flex flex-col items-center justify-center px-4 gap-3" onClick={handleCenterTap}>
            {ex && (
              <>
                <p className="text-zinc-900 dark:text-white font-black text-xl text-center leading-tight">
                  {isHe ? ex.nameHe : ex.nameEn}
                </p>
                <p className="font-display font-black text-teal-600 dark:text-teal-400 text-lg">
                  {step.workoutEx.sets}×{step.workoutEx.reps}
                </p>
                <div className="glass rounded-full px-3 py-1.5 text-sm font-bold text-teal-600 dark:text-teal-300">
                  🏋️ {step.workoutEx.weight}
                </div>
              </>
            )}
          </div>
          <ProgressBar progress={progress} />
          <NavBar t={t} dispatch={dispatch} isPaused={state.isPaused} isTransition isWatch />
        </div>
      )
    }

    return (
      <div className="flex flex-col h-full relative">
        <div className="flex items-center justify-between px-5 pt-4 pb-2 flex-shrink-0">
          <div>
            <p className="text-teal-600 dark:text-teal-400 font-black text-xl leading-tight">{t.getReady}</p>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-0.5">{currentGroup}/{exerciseCount} · ⏱ {formatTime(totalRemaining)} {t.remaining}</p>
          </div>
          <TimerRing seconds={state.secondsRemaining} totalSeconds={step.duration} color="orange" size={84} />
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
                <span className="inline-block text-teal-600 dark:text-teal-400 text-xs font-black uppercase tracking-wide bg-teal-500/10 px-2.5 py-0.5 rounded-full mb-2">{t.superset}</span>
              )}
              <p className="text-zinc-900 dark:text-white font-black text-2xl leading-tight">{isHe ? ex.nameHe : ex.nameEn}</p>
              {step.isSuperset && step.previewExB && (
                <p className="text-zinc-500 dark:text-zinc-300 font-bold text-base mt-0.5">+ {isHe ? step.previewExB.nameHe : step.previewExB.nameEn}</p>
              )}
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className="font-display font-black text-teal-600 dark:text-teal-400 text-xl">{step.workoutEx.sets}×{step.workoutEx.reps}</span>
                <div className="inline-flex items-center gap-1.5 bg-teal-500/10 border border-teal-500/25 dark:border-teal-500/30 rounded-full px-3 py-1">
                  <span className="text-teal-600 dark:text-teal-300 font-bold text-sm">🏋️ {step.workoutEx.weight}</span>
                </div>
                {step.isSuperset && step.workoutExB && step.workoutExB.weight !== step.workoutEx.weight && (
                  <div className="inline-flex items-center gap-1.5 bg-teal-500/10 border border-teal-500/25 dark:border-teal-500/30 rounded-full px-3 py-1">
                    <span className="text-teal-600 dark:text-teal-300 font-bold text-sm">🏋️ {step.workoutExB.weight}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {instr && (
            <div className="glass rounded-xl px-4 py-3">
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-bold uppercase tracking-wide mb-1">{isHe ? 'הוראות ביצוע' : 'Form cues'}</p>
              <p className="text-zinc-700 dark:text-zinc-200 text-base leading-relaxed">{instr}</p>
            </div>
          )}

          {step.isSuperset && step.previewExB && (
            <div className="glass rounded-xl px-4 py-3">
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-bold uppercase tracking-wide mb-1">{isHe ? step.previewExB.nameHe : step.previewExB.nameEn}</p>
              <p className="text-zinc-700 dark:text-zinc-200 text-base leading-relaxed">{isHe ? step.previewExB.instrHe : step.previewExB.instrEn}</p>
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

    if (isWatch) {
      return (
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 pt-3 pb-1 flex-shrink-0">
            <span className="text-green-600 dark:text-green-400 font-bold text-sm uppercase tracking-wide">{t.warmup}</span>
            <span className="text-zinc-400 dark:text-zinc-500 text-xs">⏱ {formatTime(totalRemaining)}</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center px-4 gap-3" onClick={handleCenterTap}>
            <h2 className="text-zinc-900 dark:text-white font-black text-xl text-center leading-tight">
              {isHe ? ex.nameHe : ex.nameEn}
            </h2>
            <TimerRing seconds={state.secondsRemaining} totalSeconds={step.duration} color="teal" size={130} />
          </div>
          <ProgressBar progress={progress} color="bg-green-500" />
          <NavBar t={t} dispatch={dispatch} isPaused={state.isPaused} isWatch />
        </div>
      )
    }

    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-5 pt-4 pb-2 flex-shrink-0">
          <span className="text-green-600 dark:text-green-400 font-bold text-base tracking-wide uppercase">{t.warmup}</span>
          <span className="text-zinc-500 dark:text-zinc-400 text-sm">⏱ {formatTime(totalRemaining)} {t.remaining}</span>
        </div>

        <div className="flex-1 flex flex-col items-center px-5 gap-4 overflow-hidden" onClick={handleCenterTap}>
          <div className="w-full rounded-2xl overflow-hidden flex-shrink-0" style={{ background: 'var(--color-svg-bg)', border: '1px solid var(--color-svg-border)', aspectRatio: '200/80' }}>
            <ExerciseSvg svgKey={ex.svg} />
          </div>

          <div className="text-center flex-shrink-0">
            <h2 className="text-zinc-900 dark:text-white font-black leading-tight" style={{ fontSize: 'clamp(1.7rem, 6.5vw, 2.8rem)' }}>
              {isHe ? ex.nameHe : ex.nameEn}
            </h2>
            {isHe && <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-0.5">{ex.nameEn}</p>}
          </div>

          <p className="text-zinc-600 dark:text-zinc-300 text-base leading-relaxed text-center px-2 flex-shrink-0 line-clamp-3">
            {isHe ? ex.instrHe : ex.instrEn}
          </p>

          <div className="flex flex-col items-center gap-3 mt-auto pb-2 flex-shrink-0">
            <TimerRing seconds={state.secondsRemaining} totalSeconds={step.duration} color="teal" size={160} />
          </div>
        </div>

        <ProgressBar progress={progress} color="bg-green-500" />
        <NavBar t={t} dispatch={dispatch} isPaused={state.isPaused} />
      </div>
    )
  }

  // ── REST ────────────────────────────────────────────────
  if (step.type === 'rest') {
    const ex = step.previewExercise
    const isIntraSet = !step.isInterExercise
    const restIsUrgent = state.secondsRemaining <= 10
    const restAccent = restIsUrgent ? 'rgba(239,68,68,0.12)' : 'rgba(59,130,246,0.10)'
    const restRing = restIsUrgent ? 'red' : 'blue'
    const restBar = restIsUrgent ? 'bg-red-500' : 'bg-blue-500'
    const nextSetNum = isIntraSet && step.set != null ? step.set + 1 : null

    if (isWatch) {
      return (
        <div className="flex flex-col h-full" style={{ background: `radial-gradient(ellipse at 50% 30%, ${restAccent} 0%, transparent 65%)` }}>
          <div className="flex items-center justify-between px-4 pt-3 pb-1 flex-shrink-0">
            <span className={`font-black text-sm tracking-widest uppercase ${restIsUrgent ? 'text-red-500 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>{t.rest}</span>
            <span className="text-zinc-400 dark:text-zinc-500 text-xs">{currentGroup}/{exerciseCount}</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-2 px-4" onClick={handleCenterTap}>
            <TimerRing seconds={state.secondsRemaining} totalSeconds={step.duration} color={restRing} size={140} />
            {nextSetNum != null && (
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold uppercase tracking-widest ${restIsUrgent ? 'text-red-500' : 'text-blue-500 dark:text-blue-400'}`}>{t.set}</span>
                <span className={`font-display font-black text-3xl ${restIsUrgent ? 'text-red-500' : 'text-zinc-900 dark:text-white'}`}>{nextSetNum}</span>
                <span className="text-zinc-400 text-xl">/{step.totalSets}</span>
              </div>
            )}
            {ex && (
              <p className="text-zinc-500 dark:text-zinc-400 text-xs text-center font-medium px-2">
                {step.isInterExercise ? t.nextExercise : t.nextSet}: <span className="text-zinc-700 dark:text-zinc-200 font-bold">{isHe ? ex.nameHe : ex.nameEn}</span>
              </p>
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={e => { e.stopPropagation(); dispatch({ type: 'EXTEND_REST' }) }}
                className="glass rounded-full font-black text-sm px-4 py-2.5 active:scale-95 transition-transform text-zinc-600 dark:text-zinc-300"
                style={{ border: '1px solid rgba(100,100,100,0.25)' }}
              >
                {t.extendRest}
              </button>
              <button
                onClick={e => { e.stopPropagation(); dispatch({ type: isIntraSet ? 'SKIP_SET_FORWARD' : 'SKIP_FORWARD' }) }}
                className="glass rounded-full font-black text-sm px-4 py-2.5 active:scale-95 transition-transform text-blue-700 dark:text-blue-300"
                style={{ border: '1px solid rgba(59,130,246,0.30)' }}
              >
                {t.skipRest} →
              </button>
            </div>
          </div>
          <ProgressBar progress={progress} color={restBar} />
          <NavBar t={t} dispatch={dispatch} isPaused={state.isPaused} prevAction={isIntraSet ? 'SKIP_SET_BACKWARD' : 'SKIP_BACKWARD'} nextAction={isIntraSet ? 'SKIP_SET_FORWARD' : 'SKIP_FORWARD'} isWatch />
        </div>
      )
    }

    return (
      <div
        className="flex flex-col h-full"
        style={{ background: `radial-gradient(ellipse at 50% 30%, ${restAccent} 0%, transparent 65%)` }}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-2 flex-shrink-0">
          <span className={`font-black text-base tracking-widest uppercase ${restIsUrgent ? 'text-red-500 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>{t.rest}</span>
          <span className="text-zinc-500 dark:text-zinc-400 text-sm">{currentGroup}/{exerciseCount} · ⏱ {formatTime(totalRemaining)} {t.remaining}</span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-5 px-5" onClick={handleCenterTap}>
          <TimerRing seconds={state.secondsRemaining} totalSeconds={step.duration} color={restRing} size={184} />

          {nextSetNum != null && (
            <div className="flex items-center gap-3">
              <span className={`text-base font-bold uppercase tracking-widest ${restIsUrgent ? 'text-red-500 dark:text-red-400' : 'text-blue-500 dark:text-blue-400'}`}>{t.set}</span>
              <span className={`font-display font-black leading-none ${restIsUrgent ? 'text-red-500 dark:text-red-400' : 'text-zinc-900 dark:text-white'}`} style={{ fontSize: 'clamp(3rem, 12vw, 4.5rem)' }}>{nextSetNum}</span>
              <span className="text-zinc-400 dark:text-zinc-400 font-bold text-2xl">/ {step.totalSets}</span>
            </div>
          )}

          {ex && (
            <div className="glass rounded-2xl px-5 py-3 w-full max-w-sm text-center">
              <p className="text-blue-600 dark:text-blue-400 text-sm font-bold uppercase tracking-widest mb-1">
                {step.isInterExercise ? t.nextExercise : t.nextSet}
              </p>
              <p className="text-zinc-900 dark:text-white font-black text-xl">{isHe ? ex.nameHe : ex.nameEn}</p>
              {!step.isInterExercise && step.isSuperset && step.previewExB && (
                <p className="text-zinc-500 dark:text-zinc-300 text-base mt-0.5">+ {isHe ? step.previewExB.nameHe : step.previewExB.nameEn}</p>
              )}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={e => { e.stopPropagation(); dispatch({ type: 'EXTEND_REST' }) }}
              className="glass rounded-full font-black text-base px-6 py-4 active:scale-95 transition-transform text-zinc-600 dark:text-zinc-300"
              style={{ border: '1px solid rgba(100,100,100,0.25)' }}
            >
              {t.extendRest}
            </button>
            <button
              onClick={e => { e.stopPropagation(); dispatch({ type: isIntraSet ? 'SKIP_SET_FORWARD' : 'SKIP_FORWARD' }) }}
              className="glass rounded-full font-black text-base px-8 py-4 active:scale-95 transition-transform text-blue-700 dark:text-blue-300"
              style={{ border: '1px solid rgba(59,130,246,0.30)' }}
            >
              {t.skipRest} →
            </button>
          </div>
        </div>

        <ProgressBar progress={progress} color={restBar} />
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

    if (isWatch) {
      return (
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 pt-3 pb-1 flex-shrink-0">
            <span className="text-green-600 dark:text-green-400 font-bold text-sm uppercase tracking-wide">{t.cooldown}</span>
            <span className="text-zinc-400 dark:text-zinc-500 text-xs">⏱ {formatTime(totalRemaining)}</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center px-4 gap-3" onClick={handleCenterTap}>
            <h2 className="text-zinc-900 dark:text-white font-black text-xl text-center leading-tight">
              {isHe ? ex.nameHe : ex.nameEn}
            </h2>
            <TimerRing seconds={state.secondsRemaining} totalSeconds={step.duration} color="teal" size={130} />
          </div>
          <ProgressBar progress={progress} color="bg-green-500" />
          <NavBar t={t} dispatch={dispatch} isPaused={state.isPaused} isWatch />
        </div>
      )
    }

    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-5 pt-4 pb-2 flex-shrink-0">
          <span className="text-green-600 dark:text-green-400 font-bold text-base tracking-wide uppercase">{t.cooldown}</span>
          <span className="text-zinc-500 dark:text-zinc-400 text-sm">⏱ {formatTime(totalRemaining)} {t.remaining}</span>
        </div>

        <div className="flex-1 flex flex-col items-center px-5 gap-4 overflow-hidden" onClick={handleCenterTap}>
          <div className="w-full rounded-2xl overflow-hidden flex-shrink-0" style={{ background: 'var(--color-svg-bg)', border: '1px solid var(--color-svg-border)', aspectRatio: '200/80' }}>
            <ExerciseSvg svgKey={ex.svg} />
          </div>

          <div className="text-center flex-shrink-0">
            <h2 className="text-zinc-900 dark:text-white font-black leading-tight" style={{ fontSize: 'clamp(1.7rem, 6.5vw, 2.8rem)' }}>
              {isHe ? ex.nameHe : ex.nameEn}
            </h2>
            {isHe && <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-0.5">{ex.nameEn}</p>}
          </div>

          <p className="text-zinc-600 dark:text-zinc-300 text-base leading-relaxed text-center px-2 flex-shrink-0 line-clamp-3">
            {isHe ? ex.instrHe : ex.instrEn}
          </p>

          <div className="flex flex-col items-center gap-3 mt-auto pb-2 flex-shrink-0">
            <TimerRing seconds={state.secondsRemaining} totalSeconds={step.duration} color="teal" size={160} />
          </div>
        </div>

        <ProgressBar progress={progress} color="bg-green-500" />
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
  const barColor = isUrgent ? 'bg-red-500' : 'bg-teal-500'

  if (isWatch) {
    return (
      <div className="flex flex-col h-full relative">
        <div className="flex items-center justify-between px-4 pt-3 pb-1 flex-shrink-0">
          <span className="text-zinc-400 dark:text-zinc-500 text-xs">⏱ {formatTime(totalRemaining)}</span>
          <span className="text-zinc-400 dark:text-zinc-500 text-xs">{currentGroup}/{exerciseCount}</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-4 gap-2" onClick={handleCenterTap}>
          <h2 className="text-zinc-900 dark:text-white font-black text-center leading-tight" style={{ fontSize: 'clamp(1.3rem, 5.5vw, 1.8rem)' }}>
            {name}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 dark:text-zinc-500 text-xs uppercase tracking-widest">{t.set}</span>
            <span className="font-display font-black text-3xl text-zinc-900 dark:text-white leading-none">{step.set}</span>
            <span className="text-zinc-400 text-xl">/{step.totalSets}</span>
          </div>
          <TimerRing seconds={state.secondsRemaining} totalSeconds={step.duration} color={ringColor} size={128} />
          <div className="flex items-center gap-3">
            <span className="font-display font-black text-2xl text-teal-500 dark:text-teal-400 leading-none">{wo.reps}</span>
            <span className="text-zinc-400 dark:text-zinc-500 text-xs">{t.reps}</span>
            <span className="text-zinc-300 dark:text-zinc-600">·</span>
            <span className="font-bold text-sm text-zinc-600 dark:text-zinc-300">{wo.weight}</span>
          </div>
        </div>
        <ProgressBar progress={progress} color={barColor} />
        <NavBar t={t} dispatch={dispatch} isPaused={state.isPaused} isWatch />
        {state.isPaused && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10"
            style={{ background: 'var(--color-pause-overlay)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
          >
            <p className="font-display font-black text-3xl text-zinc-900 dark:text-white uppercase tracking-widest">{t.paused}</p>
            <button
              onClick={() => dispatch({ type: 'PAUSE_RESUME' })}
              className="btn-shine text-white font-black text-base px-8 py-3 rounded-xl active:scale-95"
              style={{ background: 'linear-gradient(135deg, #0d9488, #06b6d4)', boxShadow: '0 8px 24px rgba(13,148,136,0.4)' }}
            >
              {t.resume}
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex items-center justify-between px-5 pt-4 pb-2 flex-shrink-0">
        <span className="text-zinc-500 dark:text-zinc-400 text-sm">⏱ {formatTime(totalRemaining)} {t.remaining}</span>
        <span className="text-zinc-500 dark:text-zinc-400 text-sm">{currentGroup}/{exerciseCount}</span>
      </div>

      {step.supersetPart && (
        <div className="px-5 flex-shrink-0 mb-1">
          <span className="text-sm text-teal-600 dark:text-teal-400 font-black uppercase tracking-wide bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-full">
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
          <h2 className="text-zinc-900 dark:text-white font-black leading-tight" style={{ fontSize: 'clamp(1.6rem, 6vw, 2.6rem)' }}>
            {name}
          </h2>
          {isHe && <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-0.5">{ex.nameEn}</p>}
        </div>

        {/* Set indicator */}
        <div className="flex-shrink-0 flex items-center justify-center gap-3">
          <span className="text-zinc-500 dark:text-zinc-400 text-base font-bold uppercase tracking-widest">{t.set}</span>
          <span className="font-display font-black text-zinc-900 dark:text-white leading-none" style={{ fontSize: 'clamp(3rem, 12vw, 4.5rem)' }}>{step.set}</span>
          <span className="text-zinc-400 dark:text-zinc-400 font-bold text-2xl">/ {step.totalSets}</span>
        </div>

        {/* Reps + weight */}
        <div className="glass rounded-2xl flex items-center justify-around py-4 flex-shrink-0">
          <div className="text-center">
            <p className="text-zinc-500 dark:text-zinc-400 text-sm uppercase tracking-wide mb-0.5">{t.reps}</p>
            <p className="text-teal-600 dark:text-teal-400 font-display font-black text-3xl leading-none">{wo.reps}</p>
          </div>
          <div className="w-px h-10 bg-black/8 dark:bg-white/10" />
          <div className="text-center">
            <p className="text-zinc-500 dark:text-zinc-400 text-sm uppercase tracking-wide mb-0.5">{t.weight}</p>
            <p className="text-zinc-700 dark:text-zinc-200 font-bold text-base leading-none">{wo.weight}</p>
          </div>
        </div>

        {/* Form cue */}
        <p className="text-zinc-600 dark:text-zinc-300 text-base leading-relaxed text-center px-1 flex-shrink-0 line-clamp-3">
          {instr}
        </p>

        {/* Timer ring */}
        <div className="mt-auto pb-1 flex-shrink-0 flex flex-col items-center gap-2">
          <TimerRing
            seconds={state.secondsRemaining}
            totalSeconds={step.duration}
            color={ringColor}
            size={156}
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
          <p className="text-zinc-500 dark:text-zinc-300 text-lg">{t.tapResume}</p>
          <button
            onClick={() => dispatch({ type: 'PAUSE_RESUME' })}
            className="mt-2 btn-shine text-white font-black text-xl px-12 py-5 rounded-2xl active:scale-95"
            style={{ background: 'linear-gradient(135deg, #0d9488, #06b6d4)', boxShadow: '0 8px 24px rgba(13,148,136,0.4)' }}
          >
            {t.resume}
          </button>
        </div>
      )}
    </div>
  )
}
