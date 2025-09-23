import { useEffect, useState } from 'react'

function Loader({ show }) {
  const [visible, setVisible] = useState(show)
  const [showLogo, setShowLogo] = useState(false)

  useEffect(() => {
    setVisible(show)
  }, [show])

  useEffect(() => {
    if (!visible) return
    setShowLogo(false)
    const t = setTimeout(() => setShowLogo(true), 1700)
    return () => clearTimeout(t)
  }, [visible])

  if (!visible) return null
  const logoUrl = new URL('../assets/logo.png', import.meta.url).href

  return (
    <div className="loader-overlay" aria-busy="true" aria-live="polite">
      <div className="loader">
        <div className="kite">
          {!showLogo && (
            <svg className="kite-svg" viewBox="0 0 100 100" width="120" height="120">
              <polygon className="kite-stroke" points="50,5 95,50 50,95 5,50" pathLength="100" />
            </svg>
          )}
          {showLogo && (
            <img className="kite-logo" src={logoUrl} alt="" />
          )}
        </div>
      </div>
    </div>
  )
}

export default Loader
