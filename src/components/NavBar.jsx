function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

export function NavBar({ t, dispatch, isPaused = false, isTransition = false, prevAction = 'SKIP_BACKWARD', nextAction = 'SKIP_FORWARD' }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 flex-shrink-0 border-t border-black/5 dark:border-white/5">
      <button
        onClick={() => dispatch({ type: prevAction })}
        className="flex items-center gap-2 glass rounded-full text-zinc-500 dark:text-zinc-400 font-bold px-5 py-3 active:scale-95 transition-transform text-sm"
      >
        <ChevronLeft />
        {t.prev}
      </button>

      <button
        onClick={() => dispatch({ type: 'PAUSE_RESUME' })}
        className={`flex items-center gap-2 font-bold px-6 py-3 rounded-full active:scale-95 transition-all text-sm ${
          isPaused
            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/40'
            : 'glass text-zinc-500 dark:text-zinc-400'
        }`}
      >
        {isPaused ? <PlayIcon /> : <PauseIcon />}
        {isPaused ? t.resume : t.pause}
      </button>

      <button
        onClick={() => dispatch({ type: nextAction })}
        className="flex items-center gap-2 glass rounded-full text-zinc-500 dark:text-zinc-400 font-bold px-5 py-3 active:scale-95 transition-transform text-sm"
      >
        {isTransition ? t.skip : t.next}
        <ChevronRight />
      </button>
    </div>
  )
}
