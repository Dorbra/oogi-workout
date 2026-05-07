const audioCtxRef = { current: null }

function getAudioCtx() {
  if (!audioCtxRef.current) {
    try {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    } catch (e) { return null }
  }
  return audioCtxRef.current
}

export function playBeep(freq = 880, duration = 0.12, volume = 0.25) {
  const ctx = getAudioCtx()
  if (!ctx) return
  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = freq
    osc.type = 'sine'
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch (e) {}
}

export function playStartTone() {
  playBeep(660, 0.1, 0.2)
  setTimeout(() => playBeep(880, 0.2, 0.3), 120)
}

export function playWorkBuzzer() {
  playBeep(880, 0.09, 0.32)
  setTimeout(() => playBeep(880, 0.09, 0.32), 140)
  setTimeout(() => playBeep(1100, 0.22, 0.38), 300)
}

export function playRestTone() {
  playBeep(440, 0.2, 0.2)
}

export function playGetReadyAlert() {
  playBeep(660, 0.12, 0.28)
  setTimeout(() => playBeep(880, 0.18, 0.32), 180)
}
