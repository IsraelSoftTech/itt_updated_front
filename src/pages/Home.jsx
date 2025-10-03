import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'
import { FiMapPin, FiLayers, FiDollarSign, FiSearch, FiUsers, FiTrendingUp, FiPackage, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { STORAGE_KEYS, addContentListener } from '../utils/storage'
import { getContent } from '../utils/api'

function Home() {
  const DEFAULT_HOME = { title: 'Build Your Dream Software', sub: 'We craft secure, scalable products for startups, SMEs and enterprises.', heroBg: null }
  const [query, setQuery] = useState('')
  const [openService, setOpenService] = useState(null)
  const cardRefs = useRef(new Map())
  const [homeDynamic, setHomeDynamic] = useState(DEFAULT_HOME)
  const [servicesDynamic, setServicesDynamic] = useState(null)
  const [filteredServices, setFilteredServices] = useState([])
  const [features, setFeatures] = useState(['Fast Services','Cloud','Training/Internship','High Ratings','Quality Visions','Excellence'])
  const [testiTitle, setTestiTitle] = useState('What People Say')
  const [testiSub, setTestiSub] = useState('Clients trust us for reliability, usability and speed.')
  const [testimonials, setTestimonials] = useState([
    { quote: 'A complex and highly functional restaurant app. Excellent experience!', author: 'Tih Goodman, Precious Food Restaurant' },
    { quote: 'School website and management system functioning 100% for a year.', author: 'Akum Joe, CPSS' },
    { quote: 'E‑Learning app lets me teach globally from home.', author: 'Lobbe Joel, Lojitech MEDIA' },
    { quote: 'Hotel management system that works online and offline seamlessly.', author: 'Jua Edison, Free Keep Hotel' },
  ])

  useEffect(() => {
    // Fetch fresh from Firebase
    getContent(STORAGE_KEYS.HOME, null).then((srv)=>{ if (srv) { setHomeDynamic({ title: srv.title || DEFAULT_HOME.title, sub: srv.sub || DEFAULT_HOME.sub, heroBg: srv.heroBg || null }) } })
    getContent(STORAGE_KEYS.SERVICES, null).then((srv)=>{
      if (srv && Array.isArray(srv) && srv.length) {
        setServicesDynamic(srv)
        setFilteredServices(srv)
      } else {
        setServicesDynamic([])
        setFilteredServices([])
      }
    })
    getContent(STORAGE_KEYS.HOME_FEATURES, null).then((srv)=>{ if (srv) { setFeatures(srv) } })
    getContent(STORAGE_KEYS.HOME_TESTIMONIALS, null).then((srv)=>{ if (srv) { setTestiTitle(srv.title || 'What People Say'); setTestiSub(srv.subtitle || 'Clients trust us for reliability, usability and speed.'); if (Array.isArray(srv.items)) setTestimonials(srv.items) } })
  }, [DEFAULT_HOME.title, DEFAULT_HOME.sub])
  const [tIndex, setTIndex] = useState(0)
  const nextT = () => setTIndex((tIndex + 1) % testimonials.length)
  const prevT = () => setTIndex((tIndex - 1 + testimonials.length) % testimonials.length)
  // Live content updates from Admin
  useEffect(() => {
    const off = addContentListener((key, value) => {
      switch (key) {
        case STORAGE_KEYS.HOME: {
          if (value) setHomeDynamic({ title: value.title || DEFAULT_HOME.title, sub: value.sub || DEFAULT_HOME.sub, heroBg: value.heroBg || null })
          break
        }
        case STORAGE_KEYS.HOME_FEATURES: {
          if (value) setFeatures(value)
          break
        }
        case STORAGE_KEYS.HOME_TESTIMONIALS: {
          if (value) { setTestiTitle(value.title || 'What People Say'); setTestiSub(value.subtitle || 'Clients trust us for reliability, usability and speed.'); if (Array.isArray(value.items)) setTestimonials(value.items) }
          break
        }
        case STORAGE_KEYS.SERVICES: {
          const list = Array.isArray(value) ? value : []
          setServicesDynamic(list)
          const q = (query || '').trim().toLowerCase()
          setFilteredServices(!q ? list : list.filter((s)=>`${s.title||''} ${s.copy||''}`.toLowerCase().includes(q)))
          break
        }
        default:
          break
      }
    })
    return off
  }, [query, DEFAULT_HOME.title, DEFAULT_HOME.sub])

  function handleSearch(event) {
    event.preventDefault()
    // No-op on submit; filtering happens reactively as query changes
  }

  function generateServiceDetails(svc) {
    if (svc && typeof svc.details === 'string' && svc.details.trim().length > 40) return svc.details
    const title = (svc?.title || 'Our Service').trim()
    const summary = (svc?.copy || '').trim()
    const benefitLines = [
      `End‑to‑end ${title.toLowerCase()} tailored to your business goals.`,
      'Modern architectures for performance, security and scalability.',
      'Clear delivery milestones, transparent pricing and continuous support.',
      'Zero‑downtime deployments and robust monitoring from day one.'
    ]
    const bullets = benefitLines.map((b) => `• ${b}`).join('\n')
    const lead = summary ? `${summary}` : `Expert ${title.toLowerCase()} that ships fast without compromising quality.`
    return `${lead}\n\nWhat you get:\n${bullets}\n\nOutcomes:\n• Faster time‑to‑value\n• Reduced technical risk\n• Maintainable code and great UX`
  }

  function toggleService(card) {
    const isOpen = openService && openService.title === card.title
    const next = isOpen ? null : card
    setOpenService(next)
    // On mobile, ensure expanded card stays in context
    const isMobile = window.matchMedia('(max-width: 640px)').matches
    if (!isOpen && isMobile) {
      const el = cardRefs.current.get(card.title)
      if (el && typeof el.scrollIntoView === 'function') {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
      }
    }
  }

  useEffect(() => {
    if (!Array.isArray(servicesDynamic)) { setFilteredServices([]); return }
    const q = (query || '').trim().toLowerCase()
    if (!q) { setFilteredServices(servicesDynamic); return }
    const next = servicesDynamic.filter((s) => {
      const hay = `${s.title || ''} ${s.copy || ''}`.toLowerCase()
      return hay.includes(q)
    })
    setFilteredServices(next)
  }, [query, servicesDynamic])

  return (
    <div className="home">
      <section className="hero" style={homeDynamic.heroBg ? { backgroundImage: `linear-gradient(180deg, rgba(4,22,47,0.6), rgba(4,22,47,0.4)), url(${homeDynamic.heroBg})` } : undefined}>
        <div className="container hero-inner">
          <h1>{homeDynamic.title}</h1>
          <p className="sub">{homeDynamic.sub}</p>
          <form className="search single" onSubmit={handleSearch}>
            <input
              type="text"
              className="search-input"
              placeholder="Search services, technologies, or solutions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="search-btn" aria-label="Search"><FiSearch /></button>
          </form>
        </div>
      </section>

      <section className="stats">
        <div className="container stats-grid">
          <div><span className="num"><FiUsers /> 500+</span><span className="label">Users Reached</span></div>
          <div><span className="num"><FiLayers /> 10</span><span className="label">Team Members</span></div>
          <div><span className="num"><FiTrendingUp /> 78%</span><span className="label">Yearly Growth</span></div>
          <div><span className="num"><FiPackage /> 25</span><span className="label">Projects</span></div>
        </div>
      </section>

      <section className="popular">
        <div className="container">
          <div className="section-head">
            <h2>What We Do</h2>
            <p>We sell quality, we design, we develop, we secure, we deploy, we train.</p>
          </div>

          <div className="card-grid">
            {Array.isArray(filteredServices) && filteredServices.length > 0 ? filteredServices.map((card) => (
              <article className="card" key={card.title} ref={(el)=>{ if (el) cardRefs.current.set(card.title, el) }}>
                <div className="media" style={{ backgroundImage: `url(${card.img})` }} />
                <div className="card-body">
                  <h3>{card.title}</h3>
                  <p className="muted">{card.copy}</p>
                  <div className="meta">
                    <button className="primary" type="button" onClick={() => toggleService(card)}>{openService && openService.title === card.title ? 'Close' : 'Explore More'}</button>
                  </div>
                  <div className={`details ${openService && openService.title === card.title ? 'open' : ''}`}>
                    <pre className="details-text">{generateServiceDetails(card)}</pre>
                  </div>
                </div>
              </article>
            )) : (
              <p className="muted" style={{gridColumn:'1 / -1', textAlign:'center'}}>{(query || '').trim() ? 'No matching services.' : 'No services yet. Please check back soon.'}</p>
            )}
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container features-grid">
          {features.map((f) => (<div className="feature" key={f}><span>{f}</span></div>))}
        </div>
      </section>

      {/* Inline expansion replaces modal for better mobile UX */}

      <section className="testimonials">
        <div className="container">
          <div className="section-head center">
            <h2>{testiTitle}</h2>
            <p>{testiSub}</p>
          </div>
          <div className="testimonial-slider">
            <button className="slider-btn" onClick={prevT} aria-label="Previous testimonial">
              <FiChevronLeft size={22} />
            </button>
            <figure className="testimonial active" key={testimonials[tIndex].author}>
              <blockquote>“{testimonials[tIndex].quote}”</blockquote>
              <figcaption>— {testimonials[tIndex].author}</figcaption>
            </figure>
            <button className="slider-btn" onClick={nextT} aria-label="Next testimonial">
              <FiChevronRight size={22} />
            </button>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container cta-inner">
          <h3>Let’s design, develop and deploy for you</h3>
          <p>Contact us today, trust us with your projects and never regret.</p>
          <Link className="primary" to="/contact">Get in touch</Link>
        </div>
      </section>
    </div>
  )
}

export default Home


