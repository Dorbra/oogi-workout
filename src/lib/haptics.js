function vibrate(pattern) {
  if (typeof navigator !== 'undefined') navigator.vibrate?.(pattern)
}

export function vibrateShort()  { vibrate(100) }
export function vibrateDouble() { vibrate([100, 80, 200]) }
export function vibrateLong()   { vibrate(500) }
