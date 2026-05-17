const audioCtxRef: { current: AudioContext | null } = { current: null }

function getAudioCtx(): AudioContext | null {
  if (!audioCtxRef.current) {
    try {
      const Ctor = window.AudioContext
        ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return null
      audioCtxRef.current = new Ctor()
    } catch { return null }
  }
  return audioCtxRef.current
}

export function playBeep(freq = 880, duration = 0.12, volume = 0.25): void {
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
  } catch { /* AudioContext unavailable */ }
}

export function playStartTone(): void {
  playBeep(660, 0.1, 0.2)
  setTimeout(() => playBeep(880, 0.2, 0.3), 120)
}

export function playWorkBuzzer(): void {
  playBeep(880, 0.09, 0.32)
  setTimeout(() => playBeep(880, 0.09, 0.32), 140)
  setTimeout(() => playBeep(1100, 0.22, 0.38), 300)
}

export function playRestTone(): void {
  playBeep(440, 0.2, 0.2)
}

export function playGetReadyAlert(): void {
  playBeep(660, 0.12, 0.28)
  setTimeout(() => playBeep(880, 0.18, 0.32), 180)
}
