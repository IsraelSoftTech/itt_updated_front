import { StrictMode, useEffect } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { db, dbRef, push, serverTimestamp } from './utils/firebase'

export function AnalyticsTracker({ children }) {
  const location = useLocation()
  useEffect(() => {
    ;(async () => {
      try {
        const ip = await fetch('https://api.ipify.org?format=json', { cache: 'no-store' }).then(r=>r.json()).then(j=>j.ip).catch(()=>undefined)
        const ua = navigator.userAgent
        const ref = document.referrer || ''
        await push(dbRef(db, 'analytics/visits'), { ts: serverTimestamp(), path: location.pathname, ip: ip || null, ua, ref })
      } catch {
        // ignore analytics failures
      }
    })()
  }, [location.pathname])
  return children
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AnalyticsTracker>
        <App />
      </AnalyticsTracker>
    </BrowserRouter>
  </StrictMode>,
)
