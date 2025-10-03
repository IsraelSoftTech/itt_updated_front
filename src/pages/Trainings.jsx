import './Home.css'
import { useEffect, useState } from 'react'
import { STORAGE_KEYS, addContentListener } from '../utils/storage'
import { postJson, getContent } from '../utils/api'

function Trainings() {
  const [items, setItems] = useState([])
  const [meta, setMeta] = useState({ title: 'Become an Intern', subtitle: 'Apply to our internship program and acquire real industry skills.' })
  const [formDef, setFormDef] = useState([])
  const [formValues, setFormValues] = useState({})
  const [sent, setSent] = useState(false)

  useEffect(() => {
    getContent(STORAGE_KEYS.TRAININGS, null).then((srv)=>{ if (srv) setItems(srv) })
    getContent(STORAGE_KEYS.TRAININGS_META, null).then((srv)=>{ if (srv) setMeta(srv) })
    getContent(STORAGE_KEYS.TRAININGS_FORM, null).then((srv)=>{ if (srv) setFormDef(srv) })
  }, [])

  useEffect(() => {
    const off = addContentListener((key, value) => {
      if (key === STORAGE_KEYS.TRAININGS) setItems(Array.isArray(value) ? value : [])
      if (key === STORAGE_KEYS.TRAININGS_META) setMeta(value || meta)
      if (key === STORAGE_KEYS.TRAININGS_FORM) setFormDef(Array.isArray(value) ? value : [])
    })
    return off
  }, [])

  function handleChange(name, type, value, files) {
    if (type === 'image') {
      const file = files && files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => setFormValues((p)=> ({ ...p, [name]: reader.result }))
      reader.readAsDataURL(file)
    } else {
      setFormValues((p)=> ({ ...p, [name]: value }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await postJson('/api/trainings/submit', { values: formValues })
      setSent(true)
      setFormValues({})
    } catch (err) {
      alert('Failed to submit application: ' + err.message)
    }
  }

  return (
    <div className="trainings">
      <section className="hero" style={{ backgroundImage: "linear-gradient(180deg, rgba(4,22,47,0.6), rgba(4,22,47,0.4)), url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop')" }}>
        <div className="container hero-inner">
          <h1>Trainings</h1>
          <p className="sub">Competent trainers, hands-on projects, company tools and technologies.</p>
        </div>
      </section>
      <section className="popular">
        <div className="container">
          <div className="section-head center">
            <h2>{meta.title}</h2>
            <p>{meta.subtitle}</p>
          </div>
          <div className="card-grid">
            {items.map((t) => (
              <article className="card" key={t.title}>
                {t.img && <div className="media" style={{ backgroundImage: `url(${t.img})` }} />}
                <div className="card-body">
                  <h3>{t.title}</h3>
                  <p className="muted">{t.copy}</p>
                </div>
              </article>
            ))}
          </div>

          {formDef.length > 0 && (
            <div className="card" style={{maxWidth: 720, margin: '20px auto 0'}}>
              <div className="card-body">
                {sent ? <p>Thanks! Your application has been received.</p> : (
                  <form className="form-grid" onSubmit={handleSubmit}>
                    {formDef.map((f) => (
                      <label key={f.name}>
                        <span>{f.label || f.name}</span>
                        {f.type === 'textarea' ? (
                          <textarea value={formValues[f.name] || ''} onChange={(e)=>handleChange(f.name, f.type, e.target.value)} required={f.required} />
                        ) : f.type === 'image' ? (
                          <input type="file" accept="image/*" onChange={(e)=>handleChange(f.name, f.type, undefined, e.target.files)} required={f.required} />
                        ) : f.type === 'select' ? (
                          <select value={formValues[f.name] || ''} onChange={(e)=>handleChange(f.name, f.type, e.target.value)} required={f.required}>
                            <option value="">Select...</option>
                            {(f.options || '').split(',').map((opt) => (
                              <option key={opt.trim()} value={opt.trim()}>{opt.trim()}</option>
                            ))}
                          </select>
                        ) : (
                          <input type={f.type || 'text'} value={formValues[f.name] || ''} onChange={(e)=>handleChange(f.name, f.type, e.target.value)} required={f.required} />
                        )}
                      </label>
                    ))}
                    <button className="primary" type="submit">Submit Application</button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Trainings


