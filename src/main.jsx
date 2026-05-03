import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

if ('serviceWorker' in navigator) {
  // Reload when a new SW activates and claims this client.
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload()
  })

  // Android PWAs can stay alive in the background for hours or days, so the
  // browser's passive ~24h SW update check is the only trigger without this.
  // Re-checking on every visibility restore means the user gets the new build
  // within seconds of returning to the app after a deploy.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      navigator.serviceWorker.getRegistration().then(reg => {
        if (reg) reg.update()
      })
    }
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
