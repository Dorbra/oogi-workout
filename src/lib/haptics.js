function vibrate(pattern) {
  if (typeof navigator !== 'undefined') navigator.vibrate?.(pattern)
}

export function vibrateShort()  { vibrate(180) }
export function vibrateDouble() { vibrate([180, 80, 300]) }
export function vibrateLong()   { vibrate(800) }
