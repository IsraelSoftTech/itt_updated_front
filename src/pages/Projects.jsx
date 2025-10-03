import './Home.css'
import { useEffect, useState } from 'react'
import { STORAGE_KEYS, addContentListener } from '../utils/content'
import Loader from '../components/Loader'
import { getContent } from '../utils/api'

function Projects() {
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

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
          {items.length === 0 ? (
            <div className="section-head center">
              <h2>No projects</h2>
            </div>
          ) : (
            <div className="card-grid">
              {items.map((p) => (
                <article className="card" key={p.title} onClick={() => setSelected(p)} style={{ cursor: 'pointer' }}>
                  {p.img && <div className="media" style={{ backgroundImage: `url(${p.img})` }} />}
                  <div className="card-body">
                    <h3>{p.title}</h3>
                    <p className="muted">{p.copy}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    {selected && (
      <div className="modal" onClick={() => setSelected(null)}>
        <div className="modal-dialog" onClick={(e)=>e.stopPropagation()} style={{ maxWidth: 960, width: '100%' }}>
          <div className="modal-body">
            {selected.img && (
              <div style={{ width: '100%', paddingBottom: '56.25%', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url(${selected.img})`, borderRadius: 8 }} />
            )}
            <div style={{ marginTop: 12 }}>
              <h3 style={{ marginBottom: 6 }}>{selected.title}</h3>
              {selected.client && <p className="muted" style={{ marginBottom: 8 }}><strong>Client:</strong> {selected.client}</p>}
              {selected.copy && <p className="muted">{selected.copy}</p>}
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
  )
}

export default Projects


