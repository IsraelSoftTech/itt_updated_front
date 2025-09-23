import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'
import { FiMapPin, FiLayers, FiDollarSign, FiSearch, FiUsers, FiTrendingUp, FiPackage, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { loadContent, STORAGE_KEYS, saveContent } from '../utils/storage'
import { getContent } from '../utils/api'

function Home() {
  const [query, setQuery] = useState('')
  const [openService, setOpenService] = useState(null)
  const [homeDynamic, setHomeDynamic] = useState({ title: 'Build Your Dream Software', sub: 'We craft secure, scalable products for startups, SMEs and enterprises.', heroBg: null })
  const [servicesDynamic, setServicesDynamic] = useState(null)
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
    const h = loadContent(STORAGE_KEYS.HOME, null)
    if (h) setHomeDynamic({ title: h.title || homeDynamic.title, sub: h.sub || homeDynamic.sub, heroBg: h.heroBg || null })
    const s = loadContent(STORAGE_KEYS.SERVICES, null)
    if (s && Array.isArray(s) && s.length) setServicesDynamic(s)
    const ft = loadContent(STORAGE_KEYS.HOME_FEATURES, null)
    if (ft) setFeatures(ft)
    const ts = loadContent(STORAGE_KEYS.HOME_TESTIMONIALS, null)
    if (ts) {
      setTestiTitle(ts.title || testiTitle)
      setTestiSub(ts.subtitle || testiSub)
      if (Array.isArray(ts.items)) setTestimonials(ts.items)
    }
    // Server content (preferred)
    getContent(STORAGE_KEYS.HOME, null).then((srv)=>{ if (srv) { setHomeDynamic({ title: srv.title || homeDynamic.title, sub: srv.sub || homeDynamic.sub, heroBg: srv.heroBg || null }); saveContent(STORAGE_KEYS.HOME, srv) } })
    getContent(STORAGE_KEYS.SERVICES, null).then((srv)=>{ if (srv && Array.isArray(srv) && srv.length) { setServicesDynamic(srv); saveContent(STORAGE_KEYS.SERVICES, srv) } else { setServicesDynamic([]) } })
    getContent(STORAGE_KEYS.HOME_FEATURES, null).then((srv)=>{ if (srv) { setFeatures(srv); saveContent(STORAGE_KEYS.HOME_FEATURES, srv) } })
    getContent(STORAGE_KEYS.HOME_TESTIMONIALS, null).then((srv)=>{ if (srv) { setTestiTitle(srv.title || testiTitle); setTestiSub(srv.subtitle || testiSub); if (Array.isArray(srv.items)) setTestimonials(srv.items); saveContent(STORAGE_KEYS.HOME_TESTIMONIALS, srv) } })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [tIndex, setTIndex] = useState(0)
  const nextT = () => setTIndex((tIndex + 1) % testimonials.length)
  const prevT = () => setTIndex((tIndex - 1 + testimonials.length) % testimonials.length)

  function handleSearch(event) {
    event.preventDefault()
    // In a later iteration, wire to backend search endpoint
    alert(`Searching for: ${query || 'all'}`)
  }

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
            {Array.isArray(servicesDynamic) && servicesDynamic.length > 0 ? servicesDynamic.map((card) => (
              <article className="card" key={card.title}>
                <div className="media" style={{ backgroundImage: `url(${card.img})` }} />
                <div className="card-body">
                  <h3>{card.title}</h3>
                  <p className="muted">{card.copy}</p>
                  <div className="meta">
                    <button className="primary" type="button" onClick={() => setOpenService(card)}>Explore More</button>
                  </div>
                </div>
              </article>
            )) : (
              <p className="muted" style={{gridColumn:'1 / -1', textAlign:'center'}}>No services yet. Please check back soon.</p>
            )}
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container features-grid">
          {features.map((f) => (<div className="feature" key={f}><span>{f}</span></div>))}
        </div>
      </section>

      {openService && (
        <div className="modal" onClick={() => setOpenService(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-media" style={{ backgroundImage: `url(${openService.img})` }} />
            <div className="modal-body">
              <h3>{openService.title}</h3>
              <p>{openService.details || openService.copy}</p>
              <div className="modal-actions">
                <button className="primary" type="button" onClick={() => setOpenService(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

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


