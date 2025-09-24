import './Home.css'
import { useEffect, useState } from 'react'
import { loadContent, STORAGE_KEYS, addContentListener } from '../utils/storage'
import { getContent } from '../utils/api'

function Projects() {
  const [items, setItems] = useState([])

  useEffect(() => {
    setItems(loadContent(STORAGE_KEYS.PROJECTS, []))
    getContent(STORAGE_KEYS.PROJECTS, null).then((srv)=>{ if (srv) setItems(srv) })
  }, [])

  useEffect(() => {
    const off = addContentListener((key, value) => {
      if (key === STORAGE_KEYS.PROJECTS) setItems(Array.isArray(value) ? value : [])
    })
    return off
  }, [])

  return (
    <div className="projects">
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
              <h2>No projects yet</h2>
              <p>Add projects in the Admin panel to see them here.</p>
            </div>
          ) : (
            <div className="card-grid">
              {items.map((p) => (
                <article className="card" key={p.title}>
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
    </div>
  )
}

export default Projects


