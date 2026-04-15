import { T } from '../constants/translations'
import { getDurationLabel } from '../lib/plan'
import { ExerciseSvg } from '../components/Svgs'

export function PreviewScreen({ state, dispatch }) {
  const t = T[state.lang]
  const isHe = state.lang === 'he'
  const { exercises, templates } = state.plan
  const hasVariants = templates[`${state.selectedCategory}_${state.selectedDuration}a`] !== undefined
  const templateKey = hasVariants
    ? `${state.selectedCategory}_${state.selectedDuration}${state.selectedVariation}`
    : `${state.selectedCategory}_${state.selectedDuration}`
  const template = templates[templateKey]
  const exList = template.exercises
  const items = []
  let i = 0
  while (i < exList.length) {
    const ex = exList[i]
    const exData = exercises[ex.exerciseId]
    if (ex.supersetWith) {
      const exB = exList[i + 1]
      const exDataB = exercises[exB.exerciseId]
      items.push({ type: 'superset', ex, exData, exB, exDataB })
      i += 2
    } else {
      items.push({ type: 'single', ex, exData })
      i++
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 pt-5 pb-3 border-b border-zinc-800 shrink-0">
        <button
          onClick={() => dispatch({ type: 'GO_HOME' })}
          className="text-zinc-400 hover:text-white text-sm font-medium px-3 py-2 bg-zinc-800 rounded-xl active:scale-95"
        >
          {t.back}
        </button>
        <div className="flex-1 text-center">
          <h2 className="text-white font-black text-xl">{getDurationLabel(state.selectedDuration, state.selectedVariation, t)}</h2>
          <p className="text-zinc-500 text-sm">{items.length} {t.exercises}</p>
        </div>
        <div className="w-16" />
      </div>

      {/* Exercise list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        <div className="bg-zinc-800/60 rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-zinc-300 font-bold">{t.warmup}</span>
          <span className="text-zinc-500 text-sm">{state.skipWarmup ? '—' : '3:00'}</span>
        </div>

        {items.map((item, idx) => {
          if (item.type === 'superset') {
            return (
              <div key={idx} className="bg-zinc-900 rounded-xl border border-orange-500/30 overflow-hidden">
                <div className="bg-orange-500/10 px-4 py-1.5 flex items-center gap-2">
                  <span className="text-orange-400 text-xs font-black uppercase tracking-wide">{t.superset}</span>
                </div>
                {[{ex: item.ex, exData: item.exData}, {ex: item.exB, exData: item.exDataB}].map(({ex, exData}, j) => (
                  <div key={j} className={`px-4 py-3 ${j === 0 ? 'border-b border-zinc-800' : ''}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-base leading-tight">{isHe ? exData.nameHe : exData.nameEn}</p>
                        {isHe && <p className="text-zinc-500 text-xs mt-0.5">{exData.nameEn}</p>}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-orange-400 font-black text-sm">{ex.sets}×{ex.reps}</p>
                        <p className="text-zinc-500 text-xs">{ex.weight}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="px-4 py-1.5 bg-zinc-800/40">
                  <span className="text-zinc-500 text-xs">{t.rest}: {item.ex.rest}{t.sec}</span>
                </div>
              </div>
            )
          }
          return (
            <div key={idx} className="bg-zinc-900 rounded-xl px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-zinc-600 font-black text-lg w-6 text-center shrink-0">{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-base leading-tight">{isHe ? item.exData.nameHe : item.exData.nameEn}</p>
                    {isHe && <p className="text-zinc-500 text-xs mt-0.5">{item.exData.nameEn}</p>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-orange-400 font-black text-sm">{item.ex.sets}×{item.ex.reps}</p>
                  <p className="text-zinc-500 text-xs">{item.ex.weight}</p>
                  <p className="text-zinc-600 text-xs">{t.rest}: {item.ex.rest}{t.sec}</p>
                </div>
              </div>
            </div>
          )
        })}

        <div className="bg-zinc-800/60 rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-zinc-300 font-bold">{t.cooldown}</span>
          <span className="text-zinc-500 text-sm">2:30</span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-4 pb-6 pt-3 shrink-0 border-t border-zinc-800 space-y-3">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-zinc-300 font-bold">{t.skipWarmup}</span>
          <div
            onClick={() => dispatch({ type: 'TOGGLE_SKIP_WARMUP' })}
            className={`w-12 h-6 rounded-full relative transition-all ${state.skipWarmup ? 'bg-orange-500' : 'bg-zinc-700'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${state.skipWarmup ? 'right-1' : 'left-1'}`} />
          </div>
        </label>
        <button
          onClick={() => dispatch({ type: 'START_WORKOUT' })}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 active:from-orange-600 active:to-amber-600 text-white font-black text-xl md:text-2xl py-5 md:py-6 rounded-2xl transition-all active:scale-95 shadow-lg shadow-orange-500/40"
        >
          {t.start}
        </button>
      </div>
    </div>
  )
}
