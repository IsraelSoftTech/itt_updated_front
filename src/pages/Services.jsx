import './Home.css'
import { useEffect, useState } from 'react'
import { STORAGE_KEYS, addContentListener } from '../utils/content'
import Loader from '../components/Loader'

function Services() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // initial state comes from realtime listener below
  }, [])

  useEffect(() => {
    const off = addContentListener((key, value) => {
      if (key === STORAGE_KEYS.SERVICES) { setItems(Array.isArray(value) ? value : []); setLoading(false) }
    })
    return off
  }, [])

  return (
    <div className="services">
      <Loader show={loading} />
      <section className="hero" style={{ backgroundImage: "linear-gradient(180deg, rgba(4,22,47,0.6), rgba(4,22,47,0.4)), url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2000&auto=format&fit=crop')" }}>
        <div className="container hero-inner">
          <h1>Our Services</h1>
          <p className="sub">We sell quality, we design, we develop, we secure, we deploy, we train.</p>
        </div>
      </section>

      <section className="popular">
        <div className="container">
          <div className="card-grid">
            {items.length > 0 ? items.map((s) => (
              <article className="card" key={s.title}>
                <div className="media" style={{ backgroundImage: `url(${s.img})` }} />
                <div className="card-body">
                  <h3>{s.title}</h3>
                  <p className="muted">{s.copy}</p>
                </div>
              </article>
            )) : (
              !loading ? <p className="muted" style={{gridColumn:'1 / -1', textAlign:'center'}}>No services.</p> : null
            )}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container cta-inner">
          <h3>Ready to start?</h3>
          <p>Contact us today and get a free consultation.</p>
          <a className="primary" href="mailto:iminuifuong@gmail.com">Get in touch</a>
        </div>
      </section>
    </div>
  )
}

export default Services


