const glowMap = {
  'bg-orange-500': '0 0 8px 1px rgba(249, 115, 22, 0.6)',
  'bg-blue-500':   '0 0 8px 1px rgba(59, 130, 246, 0.6)',
  'bg-teal-500':   '0 0 8px 1px rgba(20, 184, 166, 0.6)',
  'bg-red-500':    '0 0 8px 1px rgba(239, 68, 68, 0.7)',
}

export function ProgressBar({ progress, color = 'bg-orange-500' }) {
  return (
    <div className="w-full bg-zinc-800/80 rounded-full h-4 md:h-5 overflow-hidden">
      <div
        className={`h-4 md:h-5 rounded-full transition-all duration-1000 ease-linear ${color}`}
        style={{
          width: `${Math.max(0, Math.min(100, progress * 100))}%`,
          boxShadow: glowMap[color],
        }}
      />
    </div>
  )
}
