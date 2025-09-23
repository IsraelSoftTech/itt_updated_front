import './Home.css'
import { useEffect, useState } from 'react'
import { loadContent, STORAGE_KEYS } from '../utils/storage'
import { getContent } from '../utils/api'

function Services() {
  const [items, setItems] = useState([
    { title: 'Sales of Electronics', copy: 'Top‑quality, durable electronic devices at fair prices.', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop' },
    { title: 'Web Development', copy: 'High‑performing, user‑friendly websites and web apps.', img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop' },
    { title: 'Application Development', copy: 'Secure, scalable mobile and desktop applications.', img: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1600&auto=format&fit=crop' },
    { title: 'Cloud & DevOps', copy: 'Optimize, automate and accelerate delivery in the cloud.', img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop' },
    { title: 'Graphics & Printing', copy: 'Logos, banners, T‑shirts and brand materials that impress.', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop' },
    { title: 'Maintenance & Support', copy: 'Hardware/software debugging, lifetime reliability.', img: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop' },
  ])

  useEffect(() => {
    const s = loadContent(STORAGE_KEYS.SERVICES, null)
    if (s && Array.isArray(s) && s.length) setItems(s)
    getContent(STORAGE_KEYS.SERVICES, null).then((srv)=>{ if (srv && Array.isArray(srv) && srv.length) setItems(srv) })
  }, [])

  return (
    <div className="services">
      <section className="hero" style={{ backgroundImage: "linear-gradient(180deg, rgba(4,22,47,0.6), rgba(4,22,47,0.4)), url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2000&auto=format&fit=crop')" }}>
        <div className="container hero-inner">
          <h1>Our Services</h1>
          <p className="sub">We sell quality, we design, we develop, we secure, we deploy, we train.</p>
        </div>
      </section>

      <section className="popular">
        <div className="container">
          <div className="card-grid">
            {items.map((s) => (
              <article className="card" key={s.title}>
                <div className="media" style={{ backgroundImage: `url(${s.img})` }} />
                <div className="card-body">
                  <h3>{s.title}</h3>
                  <p className="muted">{s.copy}</p>
                </div>
              </article>
            ))}
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


