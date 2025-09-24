import { Routes, Route, Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { FiMenu, FiX, FiEye, FiEyeOff } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import './App.css'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Projects from './pages/Projects'
import Trainings from './pages/Trainings'
import Admin from './pages/Admin'
import Contact from './pages/Contact'
import Loader from './components/Loader'
import { STORAGE_KEYS, saveContent } from './utils/storage'
import { getContent } from './utils/api'

function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const toggle = () => setOpen((v) => !v)
  const close = () => setOpen(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initial app load: show loader for 3s
    // Kick off background preload of all admin-managed content during splash
    ;(async () => {
      try {
        const tasks = [
          getContent(STORAGE_KEYS.HOME, null).then((v)=> v!=null && saveContent(STORAGE_KEYS.HOME, v)).catch(()=>{}),
          getContent(STORAGE_KEYS.HOME_FEATURES, null).then((v)=> v!=null && saveContent(STORAGE_KEYS.HOME_FEATURES, v)).catch(()=>{}),
          getContent(STORAGE_KEYS.HOME_TESTIMONIALS, null).then((v)=> v!=null && saveContent(STORAGE_KEYS.HOME_TESTIMONIALS, v)).catch(()=>{}),
          getContent(STORAGE_KEYS.ABOUT, null).then((v)=> v!=null && saveContent(STORAGE_KEYS.ABOUT, v)).catch(()=>{}),
          getContent(STORAGE_KEYS.ABOUT_TEAM, null).then((v)=> v!=null && saveContent(STORAGE_KEYS.ABOUT_TEAM, v)).catch(()=>{}),
          getContent(STORAGE_KEYS.SERVICES, null).then((v)=> Array.isArray(v) && saveContent(STORAGE_KEYS.SERVICES, v)).catch(()=>{}),
          getContent(STORAGE_KEYS.PROJECTS, null).then((v)=> Array.isArray(v) && saveContent(STORAGE_KEYS.PROJECTS, v)).catch(()=>{}),
          getContent(STORAGE_KEYS.TRAININGS, null).then((v)=> Array.isArray(v) && saveContent(STORAGE_KEYS.TRAININGS, v)).catch(()=>{}),
          getContent(STORAGE_KEYS.TRAININGS_META, null).then((v)=> v!=null && saveContent(STORAGE_KEYS.TRAININGS_META, v)).catch(()=>{}),
          getContent(STORAGE_KEYS.TRAININGS_FORM, null).then((v)=> Array.isArray(v) && saveContent(STORAGE_KEYS.TRAININGS_FORM, v)).catch(()=>{}),
        ]
        await Promise.allSettled(tasks)
      } catch (err) {
        console.warn('Preload failed', err)
      }
    })()
    const timer = setTimeout(() => setLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Route change: show loader for 3s
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 3000)
    return () => clearTimeout(timer)
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
            <Route path="/trainings" element={<Trainings />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        {!isAdminRoute && (
        <footer className="site-footer" style={{ animation: 'fadeIn 400ms ease both 160ms' }}>
          <div className="container">
            <p>© {new Date().getFullYear()} Izzy Tech Team. All rights reserved.</p>
          </div>
        </footer>
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
