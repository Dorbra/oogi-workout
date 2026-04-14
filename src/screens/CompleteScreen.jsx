import { T } from '../constants/translations'
import { formatTime } from '../lib/steps'
import { getDurationLabel } from '../lib/plan'

export function CompleteScreen({ state, dispatch }) {
  const t = T[state.lang]
  const elapsed = state.completedSeconds
  return (
    <div className="flex flex-col h-full items-center justify-center px-8 gap-8 md:gap-10 text-center">
      <div className="text-8xl md:text-9xl">🏆</div>
      <div>
        <h1 className="text-5xl md:text-6xl font-black text-white">{t.complete}</h1>
        <p className="text-zinc-400 text-xl md:text-2xl mt-2">{getDurationLabel(state.selectedDuration, state.selectedVariation, t)} {state.lang === 'he' ? 'אימון הושלם' : 'workout done'}</p>
      </div>
      <div className="bg-zinc-900 rounded-2xl px-10 md:px-14 py-6 md:py-8 border border-zinc-800">
        <p className="text-zinc-500 text-sm md:text-base uppercase tracking-wide mb-1">{t.totalTime}</p>
        <p className="text-orange-400 font-black text-5xl md:text-6xl">{formatTime(elapsed)}</p>
      </div>
      <button
        onClick={() => dispatch({ type: 'GO_HOME' })}
        className="w-full max-w-xs md:max-w-sm bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-black text-xl md:text-2xl py-5 md:py-6 rounded-2xl transition-all active:scale-95"
      >
        {t.backHome}
      </button>
    </div>
  )
}
