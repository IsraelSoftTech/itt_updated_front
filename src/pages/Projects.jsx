import './Home.css'
import { useEffect, useRef, useState } from 'react'
import { STORAGE_KEYS, addContentListener } from '../utils/content'
import Loader from '../components/Loader'
import { getContent } from '../utils/api'

function Projects() {
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const cardRefs = useRef(new Map())

  useEffect(() => {
    getContent(STORAGE_KEYS.PROJECTS, null).then((srv)=>{ setItems(Array.isArray(srv)?srv:[]) }).finally(()=> setLoading(false))
  }, [])

  useEffect(() => {
    const off = addContentListener((key, value) => {
      if (key === STORAGE_KEYS.PROJECTS) {
        setItems(Array.isArray(value) ? value : [])
        setLoading(false)
      }
    })
    return off
  }, [])

  function toggleProject(card) {
    const isOpen = selected && selected.title === card.title
    const next = isOpen ? null : card
    setSelected(next)
    const isMobile = window.matchMedia('(max-width: 640px)').matches
    if (!isOpen && isMobile) {
      const el = cardRefs.current.get(card.title)
      if (el && typeof el.scrollIntoView === 'function') {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
      }
    }
  }

  return (
    <div className="projects">
      <Loader show={loading} />
      <section className="hero" style={{ backgroundImage: "linear-gradient(180deg, rgba(4,22,47,0.6), rgba(4,22,47,0.4)), url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop')" }}>
        <div className="container hero-inner">
          <h1>Projects</h1>
          <p className="sub">Selected works and case studies.</p>
        </div>
      </section>
      <section className="popular">
        <div className="container">
          {!loading && items.length === 0 ? (
            <div className="section-head center">
              <h2>No projects</h2>
            </div>
          ) : (
            <div className="card-grid">
              {items.map((p) => (
                <article className="card" key={p.title} ref={(el)=>{ if (el) cardRefs.current.set(p.title, el) }}>
                  {p.img && <div className="media" style={{ backgroundImage: `url(${p.img})` }} />}
                  <div className="card-body">
                    <h3>{p.title}</h3>
                    <p className="muted">{p.copy}</p>
                    <div className="meta">
                      <button className="primary" type="button" onClick={()=>toggleProject(p)}>{selected && selected.title === p.title ? 'Close' : 'View Details'}</button>
                    </div>
                    <div className={`details ${selected && selected.title === p.title ? 'open' : ''}`}>
                      {selected && selected.title === p.title && (
                        <div>
                          {p.img && (
                            <div style={{ width: '100%', paddingBottom: '56.25%', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url(${p.img})`, borderRadius: 8, marginBottom: 12 }} />
                          )}
                          {p.client && <p className="muted" style={{ marginBottom: 8 }}><strong>Client:</strong> {p.client}</p>}
                          {p.copy && <p className="muted">{p.copy}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Projects


