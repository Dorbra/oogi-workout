import { T } from '../constants/translations'
import { formatTime } from '../lib/steps'
import { getDurationLabel } from '../lib/plan'

const CONFETTI = [
  { left: '12%', color: '#f97316', delay: '0s',    dur: '2.8s', shape: 'rect'   },
  { left: '25%', color: '#fbbf24', delay: '0.35s', dur: '3.1s', shape: 'circle' },
  { left: '38%', color: '#818cf8', delay: '0.6s',  dur: '2.6s', shape: 'rect'   },
  { left: '52%', color: '#f97316', delay: '0.15s', dur: '3.4s', shape: 'wide'   },
  { left: '64%', color: '#5eead4', delay: '0.8s',  dur: '2.9s', shape: 'circle' },
  { left: '76%', color: '#c084fc', delay: '0.45s', dur: '3.2s', shape: 'rect'   },
  { left: '88%', color: '#fbbf24', delay: '0.2s',  dur: '2.7s', shape: 'wide'   },
  { left: '18%', color: '#c084fc', delay: '1.0s',  dur: '3.0s', shape: 'circle' },
  { left: '44%', color: '#5eead4', delay: '0.7s',  dur: '2.5s', shape: 'rect'   },
  { left: '70%', color: '#f97316', delay: '0.9s',  dur: '3.3s', shape: 'wide'   },
]

export function CompleteScreen({ state, dispatch }) {
  const t = T[state.lang]
  const elapsed = state.completedSeconds

  return (
    <div className="flex flex-col h-full items-center justify-center px-8 gap-7 md:gap-9 text-center relative overflow-hidden">

      {/* CSS confetti */}
      {CONFETTI.map((c, i) => (
        <div
          key={i}
          className="pointer-events-none absolute top-0"
          style={{
            left: c.left,
            width:  c.shape === 'circle' ? 7 : c.shape === 'wide' ? 10 : 6,
            height: c.shape === 'circle' ? 7 : c.shape === 'wide' ? 4  : 8,
            borderRadius: c.shape === 'circle' ? '50%' : 2,
            background: c.color,
            animation: `confetti-fall ${c.dur} linear ${c.delay} infinite`,
          }}
        />
      ))}

      {/* Trophy */}
      <div className="relative animate-scale-in">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.3) 0%, transparent 70%)', filter: 'blur(12px)', transform: 'scale(1.5)' }}
        />
        <div className="text-8xl md:text-9xl leading-none relative z-10">🏆</div>
      </div>

      {/* Title */}
      <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
        <h1
          className="font-display font-black text-zinc-900 dark:text-white uppercase tracking-wide"
          style={{ fontSize: 'clamp(2.4rem, 10vw, 3.8rem)' }}
        >
          {t.complete}
        </h1>
        <p className="text-zinc-500 text-base md:text-lg mt-1">
          {getDurationLabel(state.selectedDuration, state.selectedVariation, t)}{' '}
          {state.lang === 'he' ? 'אימון הושלם' : 'workout done'}
        </p>
      </div>

      {/* Time card */}
      <div className="glass rounded-2xl px-10 md:px-14 py-6 md:py-8 animate-slide-up" style={{ animationDelay: '300ms' }}>
        <p className="text-zinc-600 text-xs uppercase tracking-widest mb-2">{t.totalTime}</p>
        <p
          className="font-display font-black leading-none"
          style={{
            fontSize: 'clamp(3rem, 14vw, 5rem)',
            color: '#f97316',
            textShadow: '0 0 24px rgba(249,115,22,0.6)',
          }}
        >
          {formatTime(elapsed)}
        </p>
      </div>

      {/* Home button */}
      <button
        onClick={() => dispatch({ type: 'GO_HOME' })}
        className="btn-shine w-full max-w-xs md:max-w-sm text-white font-black text-xl md:text-2xl py-5 md:py-6 rounded-2xl active:scale-95 transition-transform animate-slide-up"
        style={{
          animationDelay: '400ms',
          background: 'linear-gradient(135deg, #f97316, #f59e0b)',
          boxShadow: '0 8px 32px rgba(249,115,22,0.4)',
        }}
      >
        {t.backHome}
      </button>
    </div>
  )
}
