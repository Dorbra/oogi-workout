const COLOR_MAP = {
  orange: {
    stroke: 'url(#ring-grad-orange)',
    glow:   'rgba(13, 148, 136, 0.5)',
    text:   'var(--ring-text-orange)',
    textShadow: '0 0 20px rgba(13, 148, 136, 0.5)',
  },
  blue: {
    stroke: 'url(#ring-grad-blue)',
    glow:   'rgba(59, 130, 246, 0.5)',
    text:   'var(--ring-text-blue)',
    textShadow: '0 0 24px rgba(59, 130, 246, 0.5)',
  },
  teal: {
    stroke: 'url(#ring-grad-teal)',
    glow:   'rgba(34, 197, 94, 0.5)',
    text:   'var(--ring-text-teal)',
    textShadow: '0 0 20px rgba(34, 197, 94, 0.4)',
  },
  red: {
    stroke: 'url(#ring-grad-red)',
    glow:   'rgba(239, 68, 68, 0.6)',
    text:   'var(--ring-text-red)',
    textShadow: '0 0 20px rgba(239, 68, 68, 0.6)',
  },
}

export function TimerRing({ seconds, totalSeconds, color = 'orange', size = 160 }) {
  const c = COLOR_MAP[color] ?? COLOR_MAP.orange
  const radius = (size / 2) * 0.82
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * radius
  const progress = totalSeconds > 0 ? Math.max(0, Math.min(1, seconds / totalSeconds)) : 0
  const dashOffset = circumference * (1 - progress)
  const isUrgent = seconds <= 5 && seconds > 0

  const fontSize = size * 0.3
  const fontSizeLg = size >= 160 ? fontSize * 1.15 : fontSize

  return (
    <div
      className={`relative flex items-center justify-center flex-shrink-0${isUrgent ? ' ring-pulse' : ''}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="absolute inset-0"
        style={{ transform: 'rotate(-90deg)' }}
      >
        <defs>
          <linearGradient id="ring-grad-orange" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#0d9488" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="ring-grad-blue" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>
          <linearGradient id="ring-grad-teal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#16a34a" />
            <stop offset="100%" stopColor="#4ade80" />
          </linearGradient>
          <linearGradient id="ring-grad-red" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#dc2626" />
            <stop offset="100%" stopColor="#f87171" />
          </linearGradient>
          <filter id="ring-glow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="var(--ring-track)"
          strokeWidth={size * 0.048}
        />

        {/* Progress arc */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={c.stroke}
          strokeWidth={size * 0.048}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          filter="url(#ring-glow)"
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>

      {/* Number */}
      <span
        className="relative z-10 font-display font-black tabular-nums leading-none"
        style={{
          fontSize: fontSizeLg,
          color: c.text,
          textShadow: c.textShadow,
        }}
      >
        {seconds}
      </span>
    </div>
  )
}
