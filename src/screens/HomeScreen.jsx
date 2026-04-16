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
    <div className="flex flex-col h-full items-center justify-center px-5 gap-7 relative overflow-hidden">

      {/* Background hero glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)', filter: 'blur(8px)' }}
      />

      {/* Lang toggle */}
      <div className="absolute top-5 left-5 flex gap-1 glass rounded-full p-1">
        {['he', 'en'].map(l => (
          <button
            key={l}
            onClick={() => dispatch({ type: 'SET_LANG', lang: l })}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
              state.lang === l
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30'
                : 'text-zinc-500 hover:text-zinc-400 dark:hover:text-zinc-300'
            }`}
          >
            {l === 'he' ? 'עב' : 'EN'}
          </button>
        ))}
      </div>

      {/* Theme toggle */}
      <button
        onClick={() => dispatch({ type: 'SET_THEME', theme: state.theme === 'dark' ? 'light' : 'dark' })}
        className="absolute top-5 right-5 glass rounded-full px-3 py-1.5 text-lg leading-none transition-all active:scale-95"
        aria-label={state.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {state.theme === 'dark' ? '☀️' : '🌙'}
      </button>

      {/* Title */}
      <div className="text-center animate-slide-up" style={{ animationDelay: '0ms' }}>
        <div className="text-5xl md:text-6xl mb-2 leading-none">💪</div>
        <h1 className="font-display font-black text-zinc-900 dark:text-white tracking-wide uppercase" style={{ fontSize: 'clamp(2.4rem, 10vw, 3.8rem)' }}>
          {t.appTitle}
        </h1>
        <p className="text-zinc-500 mt-1 text-sm md:text-base">{t.pickDuration}</p>
      </div>

      {/* Category picker */}
      {categories.length > 1 && (
        <div className="w-full max-w-sm animate-slide-up" style={{ animationDelay: '60ms' }}>
          <p className="text-zinc-600 text-xs font-bold text-center uppercase tracking-widest mb-2">{t.category}</p>
          <div className="flex gap-3">
            {categories.map(cat => {
              const isSelected = state.selectedCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => dispatch({ type: 'SET_CATEGORY', category: cat })}
                  className={`flex-1 flex flex-col items-center py-4 rounded-2xl border transition-all active:scale-95 ${
                    isSelected
                      ? 'border-orange-500/50 text-zinc-900 dark:text-white'
                      : 'glass border-black/5 dark:border-white/5 text-zinc-500 dark:text-zinc-400 hover:border-black/10 dark:hover:border-white/10'
                  }`}
                  style={isSelected ? {
                    background: 'linear-gradient(145deg, rgba(249,115,22,0.18), rgba(245,158,11,0.08))',
                    boxShadow: '0 0 24px rgba(249,115,22,0.15)',
                  } : {}}
                >
                  <span className="text-2xl leading-none">{categoryIcon(cat)}</span>
                  <span className={`mt-1.5 text-xs font-bold text-center leading-tight px-1 ${isSelected ? 'text-orange-600 dark:text-orange-200' : 'text-zinc-500'}`}>
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
        <div className="w-full max-w-sm animate-slide-up" style={{ animationDelay: '100ms' }}>
          <p className="text-zinc-600 text-xs font-bold text-center uppercase tracking-widest mb-2">
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
                  className={`flex-1 flex flex-col items-center py-4 rounded-2xl border transition-all active:scale-95 ${
                    isSelected
                      ? 'border-orange-500/50 text-zinc-900 dark:text-white'
                      : 'glass border-black/5 dark:border-white/5 text-zinc-500 dark:text-zinc-400 hover:border-black/10 dark:hover:border-white/10'
                  }`}
                  style={isSelected ? {
                    background: 'linear-gradient(145deg, rgba(249,115,22,0.18), rgba(245,158,11,0.08))',
                    boxShadow: '0 0 24px rgba(249,115,22,0.15)',
                  } : {}}
                >
                  <span className="font-display text-xl font-black leading-none">{label}</span>
                  <span className={`mt-1.5 text-xs font-medium text-center px-2 leading-tight ${isSelected ? 'text-orange-600 dark:text-orange-200' : 'text-zinc-600'}`}>{sub}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Duration picker */}
      <div className="w-full max-w-sm animate-slide-up" style={{ animationDelay: '130ms' }}>
        <p className="text-zinc-600 text-xs font-bold text-center uppercase tracking-widest mb-2">
          {state.lang === 'he' ? 'משך אימון' : 'Duration'}
        </p>
        <div className="flex gap-3">
          {durations.map(d => {
            const isSelected = state.selectedDuration === d
            return (
              <button
                key={d}
                onClick={() => dispatch({ type: 'SET_DURATION', duration: d })}
                  className={`flex-1 flex flex-col items-center py-3.5 rounded-2xl border font-black transition-all active:scale-95 ${
                  isSelected
                    ? 'glass border-black/10 dark:border-white/20 text-zinc-900 dark:text-white'
                    : 'glass border-black/5 dark:border-white/5 text-zinc-500 dark:text-zinc-600 hover:border-black/10 dark:hover:border-white/10 hover:text-zinc-700 dark:hover:text-zinc-400'
                }`}
              >
                <span className="font-display text-3xl leading-none">{d}</span>
                <span className="text-xs font-medium mt-0.5 text-zinc-600">{t.min}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Preview button */}
      <button
        onClick={() => dispatch({ type: 'GO_PREVIEW' })}
        className="btn-shine w-full max-w-xs md:max-w-sm text-white font-black text-lg md:text-xl py-5 rounded-2xl transition-all active:scale-95 animate-slide-up tracking-wide"
        style={{
          animationDelay: '160ms',
          background: 'linear-gradient(135deg, #f97316, #f59e0b)',
          boxShadow: '0 8px 32px rgba(249,115,22,0.4), 0 2px 6px rgba(0,0,0,0.4)',
        }}
      >
        {t.preview}
      </button>

      {/* Version badge */}
      <p className="absolute bottom-4 text-zinc-400 dark:text-zinc-800 text-xs font-mono select-none">
        v{__APP_VERSION__}
      </p>
    </div>
  )
}
