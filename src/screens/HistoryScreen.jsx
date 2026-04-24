import { useState } from 'react'
import { T } from '../constants/translations'
import { formatTime } from '../lib/steps'
import { categoryLabel, categoryIcon } from '../lib/plan'

function formatTotalDuration(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

function formatEntryDate(isoString, lang) {
  const d = new Date(isoString)
  return new Intl.DateTimeFormat(lang === 'he' ? 'he-IL' : 'en-US', {
    weekday: 'short',
    month:   'short',
    day:     'numeric',
    hour:    '2-digit',
    minute:  '2-digit',
  }).format(d)
}

function isWithinLastWeek(isoString) {
  return Date.now() - new Date(isoString).getTime() < 7 * 24 * 60 * 60 * 1000
}

function StatCard({ value, label }) {
  return (
    <div className="flex-1 glass rounded-2xl py-4 flex flex-col items-center gap-1">
      <span
        className="font-display font-black leading-none"
        style={{ fontSize: 'clamp(1.6rem, 7vw, 2.2rem)', color: 'var(--ring-text-orange)' }}
      >
        {value}
      </span>
      <span className="text-xs text-zinc-500 font-medium text-center leading-tight px-1">{label}</span>
    </div>
  )
}

function WorkoutCard({ entry, lang, t, onRemove }) {
  const catLabel = categoryLabel(entry.category, T[lang])
  const catIcon  = categoryIcon(entry.category)

  return (
    <div className="glass rounded-2xl px-5 py-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl leading-none shrink-0">{catIcon}</span>
          <div className="min-w-0">
            <p className="font-bold text-zinc-900 dark:text-white text-sm leading-tight truncate">
              {catLabel}
              {entry.variation && (
                <span className="text-orange-500 font-black ms-1">
                  · {entry.variation === 'a' ? t.dayA : t.dayB}
                </span>
              )}
            </p>
            <p className="text-zinc-500 text-xs mt-0.5">{formatEntryDate(entry.completedAt, lang)}</p>
          </div>
        </div>
        <button
          onClick={() => onRemove(entry.id)}
          className="shrink-0 text-zinc-400 hover:text-red-400 transition-colors text-lg leading-none mt-0.5"
          aria-label="Delete entry"
        >
          ×
        </button>
      </div>

      <div className="flex gap-4 text-xs text-zinc-500 pt-1 border-t border-black/5 dark:border-white/5">
        <span>
          <span className="font-bold text-zinc-700 dark:text-zinc-300">{entry.duration}{t.min}</span>
          {' '}{t.planned}
        </span>
        <span>
          <span
            className="font-bold"
            style={{ color: 'var(--ring-text-orange)' }}
          >
            ⏱ {formatTime(entry.elapsedSeconds)}
          </span>
          {' '}{t.actual}
        </span>
        {entry.skipWarmup && (
          <span className="text-zinc-400">{t.skippedWarmup}</span>
        )}
      </div>
    </div>
  )
}

export function HistoryScreen({ state, dispatch, history, removeEntry, wipeHistory }) {
  const t = T[state.lang]
  const [confirmingClear, setConfirmingClear] = useState(false)

  const totalSeconds  = history.reduce((s, e) => s + e.elapsedSeconds, 0)
  const thisWeekCount = history.filter(e => isWithinLastWeek(e.completedAt)).length

  function handleClearClick() {
    if (!confirmingClear) {
      setConfirmingClear(true)
      setTimeout(() => setConfirmingClear(false), 3000)
      return
    }
    wipeHistory()
    setConfirmingClear(false)
  }

  return (
    <div className="flex flex-col h-full px-5 pt-5 pb-6 gap-5 overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => dispatch({ type: 'GO_HOME' })}
          className="glass rounded-full px-4 py-2 text-sm font-bold text-zinc-600 dark:text-zinc-300 active:scale-95 transition-transform"
        >
          {state.lang === 'he' ? '→' : '←'} {t.back}
        </button>
        <h1 className="font-display font-black text-zinc-900 dark:text-white text-2xl tracking-wide uppercase">
          {t.history}
        </h1>
      </div>

      {history.length === 0 ? (

        /* Empty state */
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
          <div className="text-6xl leading-none">🏋️</div>
          <p className="text-zinc-500 text-base">{t.noHistory}</p>
        </div>

      ) : (
        <>
          {/* Stats bar */}
          <div className="flex gap-3 shrink-0">
            <StatCard value={history.length} label={t.workoutsCount} />
            <StatCard value={formatTotalDuration(totalSeconds)} label={t.totalTime} />
            <StatCard value={thisWeekCount} label={t.thisWeek} />
          </div>

          {/* Entry list */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-3 pb-1" style={{ scrollbarWidth: 'none' }}>
            {history.map(entry => (
              <WorkoutCard
                key={entry.id}
                entry={entry}
                lang={state.lang}
                t={t}
                onRemove={removeEntry}
              />
            ))}
          </div>

          {/* Clear all */}
          <button
            onClick={handleClearClick}
            className={`shrink-0 w-full py-3 rounded-2xl text-sm font-bold transition-all active:scale-95 ${
              confirmingClear
                ? 'bg-red-500/20 text-red-500 border border-red-500/30'
                : 'glass text-zinc-500 dark:text-zinc-400'
            }`}
          >
            {confirmingClear ? t.confirmClear : t.clearAll}
          </button>
        </>
      )}
    </div>
  )
}
