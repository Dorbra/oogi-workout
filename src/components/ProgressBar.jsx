export function ProgressBar({ progress, color = 'bg-orange-500' }) {
  return (
    <div className="w-full bg-zinc-800 rounded-full h-4 md:h-5 overflow-hidden">
      <div
        className={`h-4 md:h-5 rounded-full transition-all duration-1000 ease-linear ${color}`}
        style={{ width: `${Math.max(0, Math.min(100, progress * 100))}%` }}
      />
    </div>
  )
}
