export function NavBar({ t, dispatch, isPaused = false, isTransition = false }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 md:py-5 shrink-0 border-t border-zinc-900">
      <button
        onClick={() => dispatch({ type: 'SKIP_BACKWARD' })}
        className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-zinc-300 font-bold px-5 py-3 md:px-7 md:py-4 rounded-xl active:scale-95 text-sm md:text-base"
      >
        ◀ {t.prev}
      </button>
      <button
        onClick={() => dispatch({ type: 'PAUSE_RESUME' })}
        className={`flex items-center gap-2 font-bold px-6 py-3 md:px-8 md:py-4 rounded-xl active:scale-95 text-sm md:text-base transition-all ${
          isPaused
            ? 'bg-orange-500 hover:bg-orange-400 text-white'
            : 'bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-zinc-300'
        }`}
      >
        {isPaused ? t.resume : t.pause}
      </button>
      <button
        onClick={() => dispatch({ type: 'SKIP_FORWARD' })}
        className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-zinc-300 font-bold px-5 py-3 md:px-7 md:py-4 rounded-xl active:scale-95 text-sm md:text-base"
      >
        {isTransition ? t.skip : t.next} ▶
      </button>
    </div>
  )
}
