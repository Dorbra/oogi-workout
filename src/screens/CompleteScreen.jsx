import { T } from '../constants/translations'
import { formatTime } from '../lib/steps'
import { getDurationLabel } from '../lib/plan'

const CONFETTI = [
  { left: '12%', color: '#0d9488', delay: '0s',    dur: '2.8s', shape: 'rect'   },
  { left: '25%', color: '#06b6d4', delay: '0.35s', dur: '3.1s', shape: 'circle' },
  { left: '38%', color: '#3b82f6', delay: '0.6s',  dur: '2.6s', shape: 'rect'   },
  { left: '52%', color: '#0d9488', delay: '0.15s', dur: '3.4s', shape: 'wide'   },
  { left: '64%', color: '#4ade80', delay: '0.8s',  dur: '2.9s', shape: 'circle' },
  { left: '76%', color: '#22d3ee', delay: '0.45s', dur: '3.2s', shape: 'rect'   },
  { left: '88%', color: '#06b6d4', delay: '0.2s',  dur: '2.7s', shape: 'wide'   },
  { left: '18%', color: '#60a5fa', delay: '1.0s',  dur: '3.0s', shape: 'circle' },
  { left: '44%', color: '#4ade80', delay: '0.7s',  dur: '2.5s', shape: 'rect'   },
  { left: '70%', color: '#0d9488', delay: '0.9s',  dur: '3.3s', shape: 'wide'   },
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
          style={{ background: 'radial-gradient(circle, rgba(13,148,136,0.35) 0%, transparent 70%)', filter: 'blur(12px)', transform: 'scale(1.5)' }}
        />
        <div className="text-8xl md:text-9xl leading-none relative z-10">🏆</div>
      </div>

      {/* Title */}
      <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
        <h1
          className="font-display font-black text-zinc-900 dark:text-white uppercase tracking-wide"
          style={{ fontSize: 'clamp(2.6rem, 11vw, 4rem)' }}
        >
          {t.complete}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-300 text-lg md:text-xl mt-1">
          {getDurationLabel(state.selectedDuration, state.selectedVariation, t)}{' '}
          {state.lang === 'he' ? 'אימון הושלם' : 'workout done'}
        </p>
      </div>

      {/* Time card */}
      <div className="glass rounded-2xl px-10 md:px-14 py-6 md:py-8 animate-slide-up" style={{ animationDelay: '300ms' }}>
        <p className="text-zinc-600 dark:text-zinc-300 text-sm uppercase tracking-widest mb-2">{t.totalTime}</p>
        <p
          className="font-display font-black leading-none"
          style={{
            fontSize: 'clamp(3.5rem, 16vw, 6rem)',
            color: 'var(--ring-text-orange)',
            textShadow: '0 0 24px rgba(13,148,136,0.5)',
          }}
        >
          {formatTime(elapsed)}
        </p>
      </div>

      {/* Home button */}
      <button
        onClick={() => dispatch({ type: 'GO_HOME' })}
        className="btn-shine w-full max-w-xs md:max-w-sm text-white font-black text-2xl md:text-3xl py-6 md:py-7 rounded-2xl active:scale-95 transition-transform animate-slide-up"
        style={{
          animationDelay: '400ms',
          background: 'linear-gradient(135deg, #0d9488, #06b6d4)',
          boxShadow: '0 8px 32px rgba(13,148,136,0.4)',
        }}
      >
        {t.backHome}
      </button>
    </div>
  )
}
