import './Home.css'
import { useEffect, useState } from 'react'
import { STORAGE_KEYS, addContentListener } from '../utils/content'
import { getContent } from '../utils/api'

function About() {
  const [team, setTeam] = useState([
    { name: 'Engr. Takoh Israel M.', role: 'CEO', img: '/team/israel.jpg' },
  ])
  const [who, setWho] = useState('Izzy Tech Team is a computer engineering company focused on building secure, reliable and scalable solutions while training the next generation.')

  useEffect(() => {
    getContent(STORAGE_KEYS.ABOUT_TEAM, null).then((srv)=>{ if (srv) setTeam(srv) })
    getContent(STORAGE_KEYS.ABOUT, null).then((srv)=>{ if (srv && srv.who) setWho(srv.who) })
  }, [])

  useEffect(() => {
    const off = addContentListener((key, value) => {
      if (key === STORAGE_KEYS.ABOUT_TEAM) setTeam(Array.isArray(value) ? value : [])
      if (key === STORAGE_KEYS.ABOUT && value && value.who) setWho(value.who)
    })
    return off
  }, [])

  return (
    <div className="about">
      <section className="hero" style={{ backgroundImage: "linear-gradient(180deg, rgba(4,22,47,0.6), rgba(4,22,47,0.4)), url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop')" }}>
        <div className="container hero-inner">
          <h1>About Izzy Tech Team</h1>
          <p className="sub">A competent team bringing excellence to the tech world.</p>
        </div>
      </section>

      <section className="popular">
        <div className="container">
          <div className="section-head center">
            <h2>Who We Are</h2>
            <p>{who}</p>
          </div>

          <div className="card-grid">
            {[ 
              { title: 'What makes us different', copy: 'Excellent project execution, short execution time range, moderate pricing, skills transfer, concrete security measures, onsite or remote, client satisfaction.' },
              { title: 'Vision', copy: 'Train future tech leaders, encourage teamwork, and deliver solutions to complex problems quickly.' },
              { title: 'Location', copy: 'Head Office: Bamenda, Cameroon. We also work remotely for clients worldwide.' },
            ].map((item) => (
              <article className="card" key={item.title}>
                <div className="card-body">
                  <h3>{item.title}</h3>
                  <p className="muted">{item.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container features-grid">
          {[ 'Fast Services', 'Cloud', 'Training/Internship', 'Quality Visions', 'Security', 'Excellence' ].map((f) => (
            <div className="feature" key={f}><span>{f}</span></div>
          ))}
        </div>
      </section>

      <section className="popular">
        <div className="container">
          <div className="section-head center">
            <h2>Our Team</h2>
            <p>Competent engineers dedicated to your success.</p>
          </div>
          <div className="card-grid">
            {team.map((m) => (
              <article className="card team-card" key={m.name}>
                <div className="avatar" style={{ backgroundImage: `url(${m.img})` }} />
                <div className="card-body">
                  <h3>{m.name}</h3>
                  <p className="muted">{m.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container cta-inner">
          <h3>Work with a reliable, fast and security‑minded team</h3>
          <p>Contact us: +237 675644383 • iminuifuong@gmail.com</p>
          <a className="primary" href="mailto:iminuifuong@gmail.com">Get in touch</a>
        </div>
      </section>
    </div>
  )
}

export default About


