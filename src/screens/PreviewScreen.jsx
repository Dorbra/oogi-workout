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
      <div className="flex items-center gap-3 px-4 pt-5 pb-3 border-b border-black/5 dark:border-white/5 flex-shrink-0">
        <button
          onClick={() => dispatch({ type: 'GO_HOME' })}
          className="glass text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white text-sm font-bold px-3 py-2 rounded-xl active:scale-95 transition-all"
        >
          {t.back}
        </button>
        <div className="flex-1 text-center">
          <h2 className="font-display font-black text-zinc-900 dark:text-white text-xl tracking-wide">{getDurationLabel(state.selectedDuration, state.selectedVariation, t)}</h2>
          <p className="text-zinc-500 dark:text-zinc-600 text-xs mt-0.5">{items.length} {t.exercises}</p>
        </div>
        <div className="w-16" />
      </div>

      {/* Exercise list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">

        {/* Warmup row */}
        <div className="glass rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-teal-600 dark:text-teal-400 font-bold text-sm">{t.warmup}</span>
          <span className="text-zinc-600 text-sm tabular-nums">{state.skipWarmup ? '—' : '3:00'}</span>
        </div>

        {items.map((item, idx) => {
          if (item.type === 'superset') {
            return (
              <div key={idx} className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(168,85,247,0.2)', background: 'rgba(168,85,247,0.04)' }}>
                <div className="px-4 py-1.5 flex items-center gap-2" style={{ background: 'rgba(168,85,247,0.08)' }}>
                  <span className="text-purple-400 text-xs font-black uppercase tracking-widest">{t.superset}</span>
                </div>
                {[{ ex: item.ex, exData: item.exData }, { ex: item.exB, exData: item.exDataB }].map(({ ex, exData }, j) => (
                  <div key={j} className={`px-4 py-3 flex items-center gap-3 ${j === 0 ? 'border-b border-black/5 dark:border-white/5' : ''}`}>
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0" style={{ background: 'var(--color-svg-bg)' }}>
                      <ExerciseSvg svgKey={exData.svg} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-zinc-900 dark:text-white font-bold text-sm leading-tight">{isHe ? exData.nameHe : exData.nameEn}</p>
                      {isHe && <p className="text-zinc-500 dark:text-zinc-600 text-xs mt-0.5">{exData.nameEn}</p>}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-orange-400 font-display font-black text-sm">{ex.sets}×{ex.reps}</p>
                      <p className="text-zinc-600 text-xs">{ex.weight}</p>
                    </div>
                  </div>
                ))}
                <div className="px-4 py-1.5" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <span className="text-zinc-600 text-xs">{t.rest}: {item.ex.rest}{t.sec}</span>
                </div>
              </div>
            )
          }

          return (
            <div key={idx} className="glass rounded-xl px-3 py-3 flex items-center gap-3" style={{ borderLeft: '2px solid rgba(249,115,22,0.25)' }}>
              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0" style={{ background: 'var(--color-svg-bg)' }}>
                <ExerciseSvg svgKey={item.exData.svg} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-zinc-900 dark:text-white font-bold text-sm leading-tight">{isHe ? item.exData.nameHe : item.exData.nameEn}</p>
                {isHe && <p className="text-zinc-500 dark:text-zinc-600 text-xs mt-0.5">{item.exData.nameEn}</p>}
                <p className="text-zinc-500 dark:text-zinc-700 text-xs mt-0.5">{t.rest}: {item.ex.rest}{t.sec}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-orange-400 font-display font-black text-sm">{item.ex.sets}×{item.ex.reps}</p>
                <p className="text-zinc-600 text-xs">{item.ex.weight}</p>
              </div>
            </div>
          )
        })}

        {/* Cooldown row */}
        <div className="glass rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-teal-600 dark:text-teal-400 font-bold text-sm">{t.cooldown}</span>
          <span className="text-zinc-600 text-sm tabular-nums">2:30</span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-4 pb-6 pt-3 flex-shrink-0 border-t border-black/5 dark:border-white/5 space-y-3">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-zinc-600 dark:text-zinc-300 font-bold text-sm">{t.skipWarmup}</span>
          <div
            onClick={() => dispatch({ type: 'TOGGLE_SKIP_WARMUP' })}
            className={`w-11 h-6 rounded-full relative transition-colors ${state.skipWarmup ? 'bg-orange-500' : 'bg-zinc-200 dark:bg-zinc-800'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${state.skipWarmup ? 'right-1' : 'left-1'}`} />
          </div>
        </label>
        <button
          onClick={() => dispatch({ type: 'START_WORKOUT' })}
          className="btn-shine w-full text-white font-black text-xl py-5 rounded-2xl active:scale-95 transition-transform"
          style={{
            background: 'linear-gradient(135deg, #f97316, #f59e0b)',
            boxShadow: '0 8px 32px rgba(249,115,22,0.4)',
          }}
        >
          {t.start}
        </button>
      </div>
    </div>
  )
}
