import { T } from '../constants/translations'
import { getAvailableCategories, getAvailableDurations, categoryLabel, categoryDesc, categoryIcon } from '../lib/plan'

export function HomeScreen({ state, dispatch, history, isWatch = false }) {
  const t = T[state.lang]
  const { templates } = state.plan
  const categories = getAvailableCategories(templates)
  const durations = getAvailableDurations(templates, state.selectedCategory)
  const hasVariations =
    templates[`${state.selectedCategory}_${state.selectedDuration}a`] !== undefined &&
    templates[`${state.selectedCategory}_${state.selectedDuration}b`] !== undefined

  return (
    <div className={`flex flex-col h-full items-center px-4 relative${isWatch ? ' gap-2 justify-start pt-14 pb-4 overflow-y-auto' : ' gap-7 justify-center overflow-hidden'}`}>

      {/* Background hero glow */}
      {!isWatch && (
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(13,148,136,0.15) 0%, transparent 70%)', filter: 'blur(8px)' }}
        />
      )}

      {/* Lang toggle */}
      <div className="absolute top-5 left-5 flex gap-1 glass rounded-full p-1">
        {['he', 'en'].map(l => (
          <button
            key={l}
            onClick={() => dispatch({ type: 'SET_LANG', lang: l })}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
              state.lang === l
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md shadow-teal-500/30'
                : 'text-zinc-500 hover:text-zinc-400 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            {l === 'he' ? 'עב' : 'EN'}
          </button>
        ))}
      </div>

      {/* Top-right cluster: history + theme */}
      <div className="absolute top-5 right-5 flex items-center gap-2">
        <button
          onClick={() => dispatch({ type: 'GO_HISTORY' })}
          className="relative glass rounded-full px-3 py-1.5 text-lg leading-none transition-all active:scale-95"
          aria-label="Workout history"
        >
          📊
          {history.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center leading-none">
              {history.length > 9 ? '9+' : history.length}
            </span>
          )}
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_THEME', theme: state.theme === 'dark' ? 'light' : 'dark' })}
          className="glass rounded-full px-3 py-1.5 text-lg leading-none transition-all active:scale-95"
          aria-label={state.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {state.theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Title */}
      <div className="text-center animate-slide-up" style={{ animationDelay: '0ms' }}>
        {!isWatch && <div className="text-6xl md:text-7xl mb-2 leading-none">💪</div>}
        <h1 className="font-display font-black text-zinc-900 dark:text-white tracking-wide uppercase" style={{ fontSize: isWatch ? 'clamp(1.8rem, 8vw, 2.4rem)' : 'clamp(2.6rem, 11vw, 4rem)' }}>
          {t.appTitle}
        </h1>
        {!isWatch && <p className="text-zinc-500 dark:text-zinc-300 mt-1 text-base md:text-lg">{t.pickDuration}</p>}
      </div>

      {/* Category picker */}
      {categories.length > 1 && (
        <div className="w-full max-w-sm animate-slide-up" style={{ animationDelay: '60ms' }}>
          {!isWatch && <p className="text-zinc-600 dark:text-zinc-300 text-sm font-bold text-center uppercase tracking-widest mb-2">{t.category}</p>}
          <div className="flex gap-2">
            {categories.map(cat => {
              const isSelected = state.selectedCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => dispatch({ type: 'SET_CATEGORY', category: cat })}
                  className={`flex-1 flex flex-col items-center ${isWatch ? 'py-2' : 'py-5'} rounded-2xl border transition-all active:scale-95 ${
                    isSelected
                      ? 'border-teal-500/50 text-zinc-900 dark:text-white'
                      : 'glass border-black/5 dark:border-white/10 text-zinc-500 dark:text-zinc-300 hover:border-black/10 dark:hover:border-white/20'
                  }`}
                  style={isSelected ? {
                    background: 'linear-gradient(145deg, rgba(13,148,136,0.18), rgba(6,182,212,0.08))',
                    boxShadow: '0 0 24px rgba(13,148,136,0.15)',
                  } : {}}
                >
                  <span className={`${isWatch ? 'text-xl' : 'text-2xl'} leading-none`}>{categoryIcon(cat)}</span>
                  <span className={`${isWatch ? 'mt-0.5 text-xs' : 'mt-1.5 text-sm'} font-bold text-center leading-tight px-1 ${isSelected ? 'text-teal-600 dark:text-teal-300' : 'text-zinc-500 dark:text-zinc-300'}`}>
                    {categoryLabel(cat, t)}
                  </span>
                  {!isWatch && (
                    <span className={`mt-0.5 text-xs text-center leading-tight px-1 ${isSelected ? 'text-teal-500/80 dark:text-teal-300/80' : 'text-zinc-400 dark:text-zinc-400'}`}>
                      {categoryDesc(cat, t)}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Variation picker */}
      {hasVariations && (
        <div className="w-full max-w-sm animate-slide-up" style={{ animationDelay: '100ms' }}>
          {!isWatch && (
            <p className="text-zinc-600 dark:text-zinc-300 text-sm font-bold text-center uppercase tracking-widest mb-2">
              {state.lang === 'he' ? 'בחר וריאציה' : 'Pick Variation'}
            </p>
          )}
          <div className="flex gap-2">
            {(['a', 'b']).map(v => {
              const isSelected = state.selectedVariation === v
              const label = v === 'a' ? t.dayA : t.dayB
              const sub   = v === 'a' ? t.pushFocus : t.pullFocus
              return (
                <button
                  key={v}
                  onClick={() => dispatch({ type: 'SET_VARIATION', variation: v })}
                  className={`flex-1 flex flex-col items-center ${isWatch ? 'py-2' : 'py-5'} rounded-2xl border transition-all active:scale-95 ${
                    isSelected
                      ? 'border-teal-500/50 text-zinc-900 dark:text-white'
                      : 'glass border-black/5 dark:border-white/10 text-zinc-500 dark:text-zinc-300 hover:border-black/10 dark:hover:border-white/20'
                  }`}
                  style={isSelected ? {
                    background: 'linear-gradient(145deg, rgba(13,148,136,0.18), rgba(6,182,212,0.08))',
                    boxShadow: '0 0 24px rgba(13,148,136,0.15)',
                  } : {}}
                >
                  <span className={`font-display ${isWatch ? 'text-base' : 'text-xl'} font-black leading-none`}>{label}</span>
                  {!isWatch && (
                    <span className={`mt-1.5 text-sm font-medium text-center px-2 leading-tight ${isSelected ? 'text-teal-600 dark:text-teal-300' : 'text-zinc-500 dark:text-zinc-300'}`}>{sub}</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Duration picker */}
      <div className="w-full max-w-sm animate-slide-up" style={{ animationDelay: '130ms' }}>
        {!isWatch && (
          <p className="text-zinc-600 dark:text-zinc-300 text-sm font-bold text-center uppercase tracking-widest mb-2">
            {state.lang === 'he' ? 'משך אימון' : 'Duration'}
          </p>
        )}
        <div className="flex gap-2">
          {durations.map(d => {
            const isSelected = state.selectedDuration === d
            return (
              <button
                key={d}
                onClick={() => dispatch({ type: 'SET_DURATION', duration: d })}
                className={`flex-1 flex flex-col items-center ${isWatch ? 'py-2' : 'py-4'} rounded-2xl border font-black transition-all active:scale-95 ${
                  isSelected
                    ? 'glass border-black/10 dark:border-white/20 text-zinc-900 dark:text-white'
                    : 'glass border-black/5 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-black/10 dark:hover:border-white/20 hover:text-zinc-700 dark:hover:text-zinc-200'
                }`}
              >
                <span className={`font-display ${isWatch ? 'text-2xl' : 'text-4xl'} leading-none`}>{d}</span>
                {!isWatch && <span className="text-sm font-medium mt-0.5 text-zinc-500 dark:text-zinc-400">{t.min}</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Preview button */}
      <button
        onClick={() => dispatch({ type: 'GO_PREVIEW' })}
        className={`btn-shine w-full max-w-xs md:max-w-sm text-white font-black rounded-2xl transition-all active:scale-95 animate-slide-up tracking-wide ${isWatch ? 'text-base py-3' : 'text-xl md:text-2xl py-6'}`}
        style={{
          animationDelay: '160ms',
          background: 'linear-gradient(135deg, #0d9488, #06b6d4)',
          boxShadow: '0 8px 32px rgba(13,148,136,0.4), 0 2px 6px rgba(0,0,0,0.4)',
        }}
      >
        {t.preview}
      </button>

      {/* Version badge */}
      {!isWatch && (
        <p className="absolute bottom-4 text-zinc-400 dark:text-zinc-600 text-xs font-mono select-none">
          v{__APP_VERSION__}
        </p>
      )}
    </div>
  )
}
