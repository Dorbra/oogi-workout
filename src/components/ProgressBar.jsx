const SHIMMER = {
  'bg-orange-500': {
    gradient: 'linear-gradient(90deg, #ea6c0c, #f97316, #fbbf24, #f97316, #ea6c0c)',
    glow: '0 0 8px rgba(249, 115, 22, 0.6)',
    dot: '#f97316',
  },
  'bg-blue-500': {
    gradient: 'linear-gradient(90deg, #4f46e5, #6366f1, #a5b4fc, #6366f1, #4f46e5)',
    glow: '0 0 8px rgba(99, 102, 241, 0.6)',
    dot: '#6366f1',
  },
  'bg-teal-500': {
    gradient: 'linear-gradient(90deg, #0d9488, #14b8a6, #5eead4, #14b8a6, #0d9488)',
    glow: '0 0 8px rgba(20, 184, 166, 0.5)',
    dot: '#14b8a6',
  },
  'bg-red-500': {
    gradient: 'linear-gradient(90deg, #b91c1c, #ef4444, #fca5a5, #ef4444, #b91c1c)',
    glow: '0 0 8px rgba(239, 68, 68, 0.7)',
    dot: '#ef4444',
  },
}

export function ProgressBar({ progress, color = 'bg-orange-500' }) {
  const cfg = SHIMMER[color] ?? SHIMMER['bg-orange-500']
  const pct = Math.max(0, Math.min(100, progress * 100))

  return (
    <div className="w-full px-0 flex-shrink-0">
      <div
        className="w-full rounded-full overflow-visible relative"
        style={{ height: 3, background: 'rgba(255,255,255,0.06)' }}
      >
        <div
          className="rounded-full relative"
          style={{
            height: 3,
            width: `${pct}%`,
            background: cfg.gradient,
            backgroundSize: '200% 100%',
            animation: 'bar-shimmer 2.5s linear infinite',
            boxShadow: cfg.glow,
            transition: 'width 1s linear',
          }}
        >
          {/* Leading dot */}
          {pct > 2 && (
            <div
              className="absolute right-0 top-1/2 rounded-full"
              style={{
                width: 7,
                height: 7,
                transform: 'translate(50%, -50%)',
                background: cfg.dot,
                boxShadow: cfg.glow,
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
