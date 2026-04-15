import { T } from '../constants/translations'
import { getAvailableCategories, getAvailableDurations, categoryLabel, categoryIcon } from '../lib/plan'

export function HomeScreen({ state, dispatch }) {
  const t = T[state.lang]
  const { templates } = state.plan
  const categories = getAvailableCategories(templates)
  const durations = getAvailableDurations(templates, state.selectedCategory)
  const hasVariations =
    templates[`${state.selectedCategory}_${state.selectedDuration}a`] !== undefined &&
    templates[`${state.selectedCategory}_${state.selectedDuration}b`] !== undefined

  return (
    <div className="flex flex-col h-full items-center justify-center px-6 gap-10">
      {/* Lang toggle */}
      <div className="absolute top-5 left-5 flex gap-1 bg-zinc-800 rounded-full p-1">
        {['he', 'en'].map(l => (
          <button
            key={l}
            onClick={() => dispatch({ type: 'SET_LANG', lang: l })}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${state.lang === l ? 'bg-orange-500 text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            {l === 'he' ? 'עב' : 'EN'}
          </button>
        ))}
      </div>

      {/* Title */}
      <div className="text-center">
        <div className="text-6xl md:text-7xl mb-3">💪</div>
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">{t.appTitle}</h1>
        <p className="text-zinc-400 mt-2 text-lg md:text-xl">{t.pickDuration}</p>
      </div>

      {/* Category picker */}
      {categories.length > 1 && (
        <div className="w-full max-w-sm space-y-2">
          <p className="text-zinc-500 text-xs font-bold text-center uppercase tracking-widest">{t.category}</p>
          <div className="flex gap-3">
            {categories.map(cat => {
              const isSelected = state.selectedCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => dispatch({ type: 'SET_CATEGORY', category: cat })}
                  className={`flex-1 flex flex-col items-center py-4 rounded-2xl border-2 font-black transition-all active:scale-95
                    ${isSelected
                      ? 'bg-gradient-to-br from-orange-500 to-amber-500 border-orange-400 text-white shadow-xl shadow-orange-500/50'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-500'}`}
                >
                  <span className="text-2xl leading-none">{categoryIcon(cat)}</span>
                  <span className={`mt-1 text-xs font-semibold text-center ${isSelected ? 'text-orange-100' : 'text-zinc-400'}`}>
                    {categoryLabel(cat, t)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Variation picker */}
      {hasVariations && (
        <div className="w-full max-w-sm space-y-2">
          <p className="text-zinc-500 text-xs font-bold text-center uppercase tracking-widest">
            {state.lang === 'he' ? 'בחר וריאציה' : 'Pick Variation'}
          </p>
          <div className="flex gap-3">
            {(['a', 'b']).map(v => {
              const isSelected = state.selectedVariation === v
              const label = v === 'a' ? t.dayA : t.dayB
              const sub   = v === 'a' ? t.pushFocus : t.pullFocus
              return (
                <button
                  key={v}
                  onClick={() => dispatch({ type: 'SET_VARIATION', variation: v })}
                  className={`flex-1 flex flex-col items-center py-5 rounded-2xl border-2 font-black transition-all active:scale-95
                    ${isSelected
                      ? 'bg-gradient-to-br from-orange-500 to-amber-500 border-orange-400 text-white shadow-xl shadow-orange-500/50'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-500'}`}
                >
                  <span className="text-2xl leading-none">{label}</span>
                  <span className={`mt-2 text-xs font-medium text-center px-2 leading-tight ${isSelected ? 'text-orange-100' : 'text-zinc-500'}`}>{sub}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Duration picker */}
      <div className="w-full max-w-sm space-y-2">
        <p className="text-zinc-500 text-xs font-bold text-center uppercase tracking-widest">
          {state.lang === 'he' ? 'משך אימון' : 'Duration'}
        </p>
        <div className="flex gap-3">
          {durations.map(d => {
            const isSelected = state.selectedDuration === d
            return (
              <button
                key={d}
                onClick={() => dispatch({ type: 'SET_DURATION', duration: d })}
                className={`flex-1 flex flex-col items-center py-4 rounded-2xl border-2 font-black transition-all active:scale-95
                  ${isSelected
                    ? 'bg-zinc-700 border-zinc-500 text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600'}`}
              >
                <span className="text-3xl leading-none">{d}</span>
                <span className="text-xs font-medium mt-1 text-zinc-500">{t.min}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Preview button */}
      <button
        onClick={() => dispatch({ type: 'GO_PREVIEW' })}
        className="w-full max-w-xs md:max-w-sm bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 active:from-orange-600 active:to-amber-600 text-white font-black text-xl md:text-2xl py-5 md:py-6 rounded-2xl transition-all active:scale-95 shadow-lg shadow-orange-500/40"
      >
        {t.preview}
      </button>

      {/* Version badge */}
      <p className="absolute bottom-4 text-zinc-700 text-xs font-mono select-none">
        v{__APP_VERSION__}
      </p>
    </div>
  )
}
