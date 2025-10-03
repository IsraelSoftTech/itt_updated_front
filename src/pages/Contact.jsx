import './Home.css'
import { useState } from 'react'
import { STORAGE_KEYS } from '../utils/content'
import { db, dbRef, push, serverTimestamp } from '../utils/firebase'

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((p)=> ({ ...p, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await push(dbRef(db, 'contact_messages'), { ...form, created_at: serverTimestamp() })
      setSent(true)
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      alert('Failed to send message: ' + err.message)
    }
  }

  return (
    <div className="contact">
      <section className="hero" style={{ backgroundImage: "linear-gradient(180deg, rgba(4,22,47,0.6), rgba(4,22,47,0.4)), url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop')" }}>
        <div className="container hero-inner">
          <h1>Contact Us</h1>
          <p className="sub">Send us a message and we’ll respond quickly.</p>
        </div>
      </section>

      <section className="popular">
        <div className="container">
          <div className="card" style={{overflow:'hidden'}}>
            <div className="card-body" style={{padding:0}}>
              <iframe
                title="Our location - Google Maps"
                src="https://www.google.com/maps?q=Izzy%20Tech%20Team&z=15&output=embed"
                style={{ border: 0, width: '100%', height: 380 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      <section className="popular">
        <div className="container">
          <div className="card" style={{maxWidth: 720, margin: '0 auto'}}>
            <div className="card-body">
              {sent ? (
                <p>Thanks! Your message has been sent.</p>
              ) : (
              <form className="form-grid" onSubmit={handleSubmit}>
                <label>
                  <span>Name</span>
                  <input name="name" value={form.name} onChange={handleChange} required />
                </label>
                <label>
                  <span>Email</span>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required />
                </label>
                <label>
                  <span>Phone</span>
                  <input name="phone" value={form.phone} onChange={handleChange} />
                </label>
                <label>
                  <span>Message</span>
                  <input name="message" value={form.message} onChange={handleChange} required />
                </label>
                <button className="primary" type="submit">Send Message</button>
              </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact


