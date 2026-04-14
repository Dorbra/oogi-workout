import { useEffect } from 'react'

export function useWakeLock(screen) {
  useEffect(() => {
    if (!('wakeLock' in navigator)) return
    if (screen !== 'active') return

    let wakeLock = null

    const acquire = async () => {
      try {
        wakeLock = await navigator.wakeLock.request('screen')
      } catch (_) {
        // best-effort — silently ignore if denied or unsupported
      }
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') acquire()
    }

    acquire()
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      if (wakeLock) wakeLock.release()
    }
  }, [screen])
}
