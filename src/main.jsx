import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  state = { hasError: false, message: '' }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message ?? 'Unknown error' }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full flex flex-col items-center justify-center gap-6 px-8 text-center bg-gradient-to-b from-slate-900 to-slate-950 text-white">
          <div className="text-6xl">⚠️</div>
          <div>
            <p className="font-black text-2xl tracking-wide uppercase text-red-400">Something went wrong</p>
            <p className="text-zinc-400 text-sm mt-2 font-mono break-all">{this.state.message}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="text-white font-black text-lg px-10 py-4 rounded-2xl active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg, #0d9488, #06b6d4)', boxShadow: '0 8px 24px rgba(13,148,136,0.4)' }}
          >
            Reload App
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// ── Version staleness check ───────────────────────────────────────────────
// Strategy: fetch /version.json (never precached, served with no-store) and
// compare the deployed version against __APP_VERSION__ baked into this bundle.
//
// Loop-safety: when we trigger a reload the old SW still serves the old bundle
// on the next load, so a naive check would loop forever.  We set a sessionStorage
// flag before reloading; the next load sees the flag, skips the check, and
// waits for the SW update cycle to finish (skipWaiting → clientsClaim →
// controllerchange → reload).  After that reload the new bundle is live and
// the check matches.  Total forced reloads per deploy: ≤ 2.
const VERSION_RELOAD_KEY = 'oogi_version_reload'

async function checkVersion() {
  // Skip on the immediate post-reload load so we don't loop while the new SW
  // is still installing.  The SW's controllerchange handler takes it from here.
  if (sessionStorage.getItem(VERSION_RELOAD_KEY)) {
    sessionStorage.removeItem(VERSION_RELOAD_KEY)
    return
  }
  try {
    const res = await fetch('/version.json?t=' + Date.now(), { cache: 'no-store' })
    if (!res.ok) return
    const { v } = await res.json()
    if (v && v !== __APP_VERSION__) {
      sessionStorage.setItem(VERSION_RELOAD_KEY, '1')
      window.location.reload()
    }
  } catch { /* network unavailable — keep running with cached version */ }
}

// ── Service worker registration & update logic ────────────────────────────
// This is intentionally in the app bundle (injectRegister: false in vite.config)
// rather than in a separate registerSW.js. That way every deploy ships new
// update-checking code immediately without requiring a prior SW update first.
if ('serviceWorker' in navigator) {
  // Reload whenever a new SW activates and claims this client so the fresh
  // content-hashed assets are served instead of the old cached bundle.
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload()
  })

  window.addEventListener('load', async () => {
    // Version check on initial load catches the case where the SW is already
    // serving stale content before the SW update cycle has had a chance to run.
    checkVersion()

    let reg
    try {
      reg = await navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' })
    } catch {
      return
    }

    // Force an update check immediately — bypasses the browser's 24 h passive
    // throttle.  Combined with skipWaiting + clientsClaim, a new deploy is live
    // within seconds of the user opening the app.
    reg.update()

    // On every app-foreground: version check (direct, fast) + SW update check.
    // Android PWAs live in background memory indefinitely; without this the
    // passive 24 h browser check is the only trigger and battery optimisation
    // often suppresses it entirely.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        checkVersion()
        reg.update()
      }
    })
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
