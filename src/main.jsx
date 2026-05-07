import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// ── Service worker registration & update logic ────────────────────────────
// This is intentionally in the app bundle (injectRegister: false in vite.config)
// rather than in a separate registerSW.js. That way every deploy ships new
// update-checking code immediately without requiring a prior SW update first.
if ('serviceWorker' in navigator) {
  // Reload the page whenever a new SW activates and claims this client so the
  // fresh content-hashed assets are served instead of the old cached bundle.
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload()
  })

  window.addEventListener('load', async () => {
    let reg
    try {
      reg = await navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' })
    } catch {
      return
    }

    // Force an update check immediately on every page load — this bypasses the
    // browser's 24-hour passive-check throttle that register() alone uses.
    // Combined with skipWaiting + clientsClaim in the SW, a new deploy is live
    // within seconds of the user opening or returning to the app.
    reg.update()

    // Re-check on every app-foreground event. Android PWAs stay alive in the
    // background indefinitely; without this the passive 24h check is the only
    // trigger, and Android battery optimisation often suppresses it entirely.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') reg.update()
    })

    // Belt-and-suspenders: also check every 30 min while the app is open.
    setInterval(() => reg.update(), 30 * 60 * 1000)
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
