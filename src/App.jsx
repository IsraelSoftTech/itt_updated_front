import { Routes, Route, Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { FiMenu, FiX, FiEye, FiEyeOff } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import './App.css'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Projects from './pages/Projects'
import Trainings from './pages/Trainings'
import Products from './pages/Products'
import Admin from './pages/Admin'
import Contact from './pages/Contact'
import Loader from './components/Loader'
import { STORAGE_KEYS } from './utils/content'

function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const toggle = () => setOpen((v) => !v)
  const close = () => setOpen(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY || document.documentElement.scrollTop
      setShowTop(y > 240)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    // Route change: do not delay rendering
    setLoading(false)
  }, [location.pathname])

  function handleAdminClick(e) {
    e.preventDefault()
    setOpen(false)
    setLoginOpen(true)
  }

  function handleLoginSubmit(e) {
    e.preventDefault()
    if (username === 'admin_account' && password === 'admin_password') {
      setLoginError('')
      setLoginOpen(false)
      setUsername('')
      setPassword('')
      navigate('/admin')
    } else {
      setLoginError('Invalid credentials')
    }
  }
  return (
      <div className="app">
        <Loader show={loading} text="Izzy Tech Team" />
        {!isAdminRoute && (
        <header className="site-header" style={{ animation: 'fadeIn 400ms ease both' }}>
          <div className="container header-inner">
            <Link to="/" className="brand">
              <img src={new URL('./assets/logo.png', import.meta.url).href} alt="Izzy Tech Team" style={{ height: 28, verticalAlign: 'middle', marginRight: 8 }} />
              Izzy Tech Team
            </Link>
            <button className="menu-btn" onClick={toggle} aria-label="Toggle menu">
              {open ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
            <nav className={`nav ${open ? 'open' : ''}`} onClick={close}>
              <NavLink to="/" className={({isActive}) => isActive ? 'active' : undefined}>Home</NavLink>
              <NavLink to="/about" className={({isActive}) => isActive ? 'active' : undefined}>About</NavLink>
              <NavLink to="/services" className={({isActive}) => isActive ? 'active' : undefined}>Services</NavLink>
              <NavLink to="/projects" className={({isActive}) => isActive ? 'active' : undefined}>Projects</NavLink>
              <NavLink to="/products" className={({isActive}) => isActive ? 'active' : undefined}>Products</NavLink>
              <NavLink to="/trainings" className={({isActive}) => isActive ? 'active' : undefined}>Trainings</NavLink>
              <NavLink to="/contact" className={({isActive}) => isActive ? 'active' : undefined}>Contact</NavLink>
              <a className="admin" onClick={handleAdminClick}>Admin</a>
            </nav>
          </div>
        </header>
        )}
        <main style={{ animation: 'fadeUp 600ms ease both 120ms' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/products" element={<Products />} />
            <Route path="/trainings" element={<Trainings />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        {!isAdminRoute && (
        <footer className="site-footer" style={{ animation: 'fadeIn 400ms ease both 160ms' }}>
          <div className="container footer-grid">
            <div className="foot-brand">
              <Link to="/" className="brand">
                <img src={new URL('./assets/logo.png', import.meta.url).href} alt="Izzy Tech Team" style={{ height: 32, verticalAlign: 'middle', marginRight: 10 }} />
                Izzy Tech Team
              </Link>
              <p className="muted">Secure, scalable software solutions and professional trainings.</p>
            </div>
            <div className="foot-col">
              <h4>Company</h4>
              <nav>
                <NavLink to="/about">About</NavLink>
                <NavLink to="/services">Services</NavLink>
                <NavLink to="/projects">Projects</NavLink>
                <NavLink to="/trainings">Trainings</NavLink>
              </nav>
            </div>
            <div className="foot-col">
              <h4>Support</h4>
              <nav>
                <NavLink to="/contact">Contact</NavLink>
                <a href="https://wa.link/jto04v" target="_blank" rel="noreferrer">WhatsApp</a>
                <a href="https://maps.app.goo.gl/nWHGoU4nuqjxpgZRA" target="_blank" rel="noreferrer">Find us on Maps</a>
              </nav>
            </div>
            <div className="foot-col">
              <h4>Legal</h4>
              <nav>
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
              </nav>
            </div>
          </div>
          <div className="container foot-bottom">
            <p>© {new Date().getFullYear()} Izzy Tech Team. All rights reserved.</p>
          </div>
        </footer>
        )}

        {!isAdminRoute && (
          <>
            <a href="https://wa.link/jto04v" className={`floating floating-whatsapp show`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
              <svg viewBox="0 0 32 32" width="22" height="22" aria-hidden="true">
                <path fill="currentColor" d="M19.11 17.39c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.62.14-.18.27-.71.88-.87 1.06-.16.18-.32.2-.59.07-.27-.14-1.13-.42-2.16-1.34-.8-.71-1.34-1.58-1.5-1.85-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.62-1.49-.85-2.04-.22-.53-.45-.46-.62-.46-.16 0-.34-.02-.52-.02s-.48.07-.73.34c-.25.27-.96.94-.96 2.3 0 1.36.99 2.67 1.14 2.85.14.18 1.95 2.97 4.71 4.16.66.28 1.18.45 1.59.58.67.21 1.28.18 1.76.11.54-.08 1.6-.65 1.83-1.27.23-.62.23-1.14.16-1.27-.07-.11-.25-.18-.52-.32z"/>
                <path fill="currentColor" d="M26.88 5.12A12.91 12.91 0 0 0 16 1.5C8.55 1.5 2.5 7.55 2.5 15c0 2.35.63 4.56 1.73 6.46L2 30.5l9.23-2.16A13.42 13.42 0 0 0 16 28.5c7.45 0 13.5-6.05 13.5-13.5 0-3.61-1.41-7-3.62-9.88zM16 26.5c-1.99 0-3.83-.52-5.43-1.43l-.39-.22-5.36 1.26 1.24-5.23-.25-.4A11.47 11.47 0 0 1 4.5 15C4.5 8.65 9.65 3.5 16 3.5S27.5 8.65 27.5 15 22.35 26.5 16 26.5z"/>
              </svg>
            </a>
            <button type="button" className={`floating floating-top ${showTop ? 'show' : ''}`} aria-label="Scroll to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              ↑
            </button>
          </>
        )}

        {loginOpen && (
          <div className="modal" onClick={() => setLoginOpen(false)}>
            <div className="modal-dialog auth-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-body">
                <h3>Admin Login</h3>
                <form className="form-grid" onSubmit={handleLoginSubmit}>
                  <label>
                    <span>Username</span>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" required />
                  </label>
                  <label className="password-field">
                    <span>Password</span>
                    <div className="password-input">
                      <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required />
                      <button type="button" className="eye" onClick={() => setShowPassword((v)=>!v)} aria-label="Toggle password visibility">
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </label>
                  {loginError && <p className="error">{loginError}</p>}
                  <button className="primary" type="submit">Login</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
  )
}

export default App
