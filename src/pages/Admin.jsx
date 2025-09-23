import { useState, useEffect } from 'react'
import { loadContent, saveContent, STORAGE_KEYS } from '../utils/storage'
import { getContent, setContent, getJson } from '../utils/api'
import './Home.css'

function Admin() {
  const sections = ['Home Contents','About Contents','Services Contents','Projects Contents','Trainings Contents','Training Submits','Contact Messages']
  const [active, setActive] = useState(sections[0])
  const [homeTitle, setHomeTitle] = useState('Build Your Dream Software')
  const [homeSub, setHomeSub] = useState('We craft secure, scalable products for startups, SMEs and enterprises.')
  const [aboutWho, setAboutWho] = useState('Izzy Tech Team is a computer engineering company ...')
  const [heroBg, setHeroBg] = useState('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop')
  const [stats, setStats] = useState([
    { label: 'Users Reached', value: '500+', icon: 'users' },
    { label: 'Team Members', value: '10', icon: 'layers' },
    { label: 'Yearly Growth', value: '78%', icon: 'trend' },
    { label: 'Projects', value: '25', icon: 'package' },
  ])
  const [features, setFeatures] = useState(['Fast Services','Cloud','Training/Internship','High Ratings','Quality Visions','Excellence'])
  const [testiTitle, setTestiTitle] = useState('What People Say')
  const [testiSub, setTestiSub] = useState('Clients trust us for reliability, usability and speed.')
  const [testimonials, setTestimonials] = useState([
    { quote: 'A complex and highly functional restaurant app. Excellent experience!', author: 'Tih Goodman, Precious Food Restaurant' },
    { quote: 'School website and management system functioning 100% for a year.', author: 'Akum Joe, CPSS' },
  ])
  const [team, setTeam] = useState([
    { name: 'Engr. Takoh Israel M.', role: 'CEO', img: '/team/israel.jpg' },
  ])
  const [services, setServices] = useState([])
  const [projects, setProjects] = useState([])
  const [trainings, setTrainings] = useState([])
  const [trainingsMeta, setTrainingsMeta] = useState({ title: 'Become an Intern', subtitle: 'Apply to our internship program and acquire real industry skills.' })
  const [messages, setMessages] = useState([])
  const [trainingForm, setTrainingForm] = useState([]) // [{name:'fullName', label:'Full Name', type:'text', required:true}]
  const [trainingSubmits, setTrainingSubmits] = useState([])

  useEffect(() => {
    // Load exclusively from backend; keep local saves only for instant preview during editing.
    getContent(STORAGE_KEYS.HOME, null).then((srv)=>{ if (srv) { setHomeTitle(srv.title || homeTitle); setHomeSub(srv.sub || homeSub); setHeroBg(srv.heroBg || heroBg) }})
    getContent(STORAGE_KEYS.ABOUT, null).then((srv)=>{ if (srv) setAboutWho(srv.who || aboutWho) })
    getContent(STORAGE_KEYS.HOME_STATS, null).then((srv)=>{ if (srv) setStats(srv) })
    getContent(STORAGE_KEYS.HOME_FEATURES, null).then((srv)=>{ if (srv) setFeatures(srv) })
    getContent(STORAGE_KEYS.HOME_TESTIMONIALS, null).then((srv)=>{ if (srv) { setTestiTitle(srv.title || testiTitle); setTestiSub(srv.subtitle || testiSub); if (Array.isArray(srv.items)) setTestimonials(srv.items) } })
    getContent(STORAGE_KEYS.ABOUT_TEAM, null).then((srv)=>{ if (srv) setTeam(srv) })
    getContent(STORAGE_KEYS.SERVICES, null).then((srv)=>{ if (srv) setServices(srv) })
    getContent(STORAGE_KEYS.PROJECTS, null).then((srv)=>{ if (srv) setProjects(srv) })
    getContent(STORAGE_KEYS.TRAININGS, null).then((srv)=>{ if (srv) setTrainings(srv) })
    getContent(STORAGE_KEYS.TRAININGS_META, null).then((srv)=>{ if (srv) setTrainingsMeta(srv) })
    getJson('/api/trainings/submits').then((rows)=> setTrainingSubmits(rows || [])).catch(()=>{})
    getJson('/api/contact').then((rows)=> setMessages(rows || [])).catch(()=>{})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reload submissions/messages when switching tabs
  useEffect(() => {
    if (active === 'Training Submits') {
      // Prefer backend
      getJson('/api/trainings/submits')
        .then((rows)=> setTrainingSubmits(rows || []))
        .catch(()=> setTrainingSubmits(loadContent(STORAGE_KEYS.TRAININGS_SUBMITS, [])))
    }
    if (active === 'Contact Messages') {
      getJson('/api/contact')
        .then((rows)=> setMessages(rows || []))
        .catch(()=> setMessages(loadContent(STORAGE_KEYS.CONTACT_MESSAGES, [])))
    }
  }, [active])

  function saveHome() {
    const payload = { title: homeTitle, sub: homeSub, heroBg }
    saveContent(STORAGE_KEYS.HOME, payload)
    setContent(STORAGE_KEYS.HOME, payload)
    alert('Home content saved')
  }
  function saveAbout() {
    const payload = { who: aboutWho }
    saveContent(STORAGE_KEYS.ABOUT, payload)
    setContent(STORAGE_KEYS.ABOUT, payload)
    alert('About content saved')
  }
  async function saveTeam() {
    try { await setContent(STORAGE_KEYS.ABOUT_TEAM, team); alert('Team saved') } catch (e) { alert('Failed to save Team: ' + e.message) }
  }
  async function saveHomeStats() {
    try { await setContent(STORAGE_KEYS.HOME_STATS, stats); alert('Homepage stats saved') } catch (e) { alert('Failed to save stats: ' + e.message) }
  }
  async function saveHomeFeatures() {
    try { await setContent(STORAGE_KEYS.HOME_FEATURES, features); alert('Homepage features saved') } catch (e) { alert('Failed to save features: ' + e.message) }
  }
  async function saveHomeTestimonials() {
    try { await setContent(STORAGE_KEYS.HOME_TESTIMONIALS, { title: testiTitle, subtitle: testiSub, items: testimonials }); alert('Testimonials saved') } catch (e) { alert('Failed to save testimonials: ' + e.message) }
  }
  function addService() {
    const next = [...services, { title: '', copy: '', img: '' }]
    setServices(next)
    // Optional local cache for instant UI, but server is source of truth
    saveContent(STORAGE_KEYS.SERVICES, next)
    setContent(STORAGE_KEYS.SERVICES, next)
  }
  function updateService(index, field, value) {
    const next = services.map((s,i)=> i===index ? { ...s, [field]: value } : s)
    setServices(next)
    saveContent(STORAGE_KEYS.SERVICES, next)
    setContent(STORAGE_KEYS.SERVICES, next)
  }
  async function saveServices() {
    try { await setContent(STORAGE_KEYS.SERVICES, services); alert('Services saved') } catch (e) { alert('Failed to save Services: ' + e.message) }
  }
  function uploadServiceImage(index, file) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => updateService(index, 'img', reader.result)
    reader.readAsDataURL(file)
  }
  function addProject() {
    const next = [...projects, { title: '', copy: '', img: '' }]
    setProjects(next)
    saveContent(STORAGE_KEYS.PROJECTS, next)
    setContent(STORAGE_KEYS.PROJECTS, next)
  }
  function updateProject(index, field, value) {
    const next = projects.map((p,i)=> i===index ? { ...p, [field]: value } : p)
    setProjects(next)
    saveContent(STORAGE_KEYS.PROJECTS, next)
    setContent(STORAGE_KEYS.PROJECTS, next)
  }
  async function saveProjects() {
    try { await setContent(STORAGE_KEYS.PROJECTS, projects); alert('Projects saved') } catch (e) { alert('Failed to save Projects: ' + e.message) }
  }
  function uploadProjectImage(index, file) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => updateProject(index, 'img', reader.result)
    reader.readAsDataURL(file)
  }
  function addTraining() {
    const next = [...trainings, { title: '', copy: '', img: '' }]
    setTrainings(next)
    saveContent(STORAGE_KEYS.TRAININGS, next)
    setContent(STORAGE_KEYS.TRAININGS, next)
  }
  function updateTraining(index, field, value) {
    const next = trainings.map((t,i)=> i===index ? { ...t, [field]: value } : t)
    setTrainings(next)
    saveContent(STORAGE_KEYS.TRAININGS, next)
    setContent(STORAGE_KEYS.TRAININGS, next)
  }
  async function saveTrainings() {
    try { await setContent(STORAGE_KEYS.TRAININGS, trainings); alert('Trainings saved') } catch (e) { alert('Failed to save Trainings: ' + e.message) }
  }
  async function saveTrainingsMeta() {
    try { await setContent(STORAGE_KEYS.TRAININGS_META, trainingsMeta); alert('Trainings intro saved') } catch (e) { alert('Failed to save trainings intro: ' + e.message) }
  }
  function uploadTrainingImage(index, file) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => updateTraining(index, 'img', reader.result)
    reader.readAsDataURL(file)
  }
  function uploadHeroBg(file) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const payload = { title: homeTitle, sub: homeSub, heroBg: reader.result }
      setHeroBg(reader.result)
      // Save to local cache for instant preview
      saveContent(STORAGE_KEYS.HOME, payload)
      // Also persist to backend immediately so clearing browser data won't wipe it
      setContent(STORAGE_KEYS.HOME, payload)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="admin">
      <section className="hero" style={{ backgroundImage: "linear-gradient(180deg, rgba(4,22,47,0.6), rgba(4,22,47,0.4)), url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2000&auto=format&fit=crop')" }}>
        <div className="container hero-inner">
          <h1>Admin Panel</h1>
          <p className="sub">Manage contents and messages.</p>
        </div>
      </section>
      <section className="popular">
        <div className="container">
          <div className="tabs">
            {sections.map((s) => (
              <button key={s} className={active===s?'active':''} onClick={()=>setActive(s)}>{s}</button>
            ))}
          </div>
          <div className="card-grid">
            <article className="card" style={{gridColumn: '1 / -1'}}>
              <div className="card-body">
                <h3>{active}</h3>
                {active === 'Contact Messages' ? (
                  <div className="form-grid">
                    <p className="muted">Incoming messages (Name, Email, Phone, Message) will appear here when the Contact page is implemented.</p>
                    {messages.length === 0 ? <p className="muted">No messages yet.</p> : messages.map((m, idx) => (
                      <div key={idx} className="card" style={{padding:12}}>
                        <div className="card-body">
                          <strong>{m.name}</strong> • {m.email} • {m.phone}
                          <p className="muted">{m.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : active === 'Home Contents' ? (
                  <div className="form-grid">
                    <label>
                      <span>Hero Title</span>
                      <input value={homeTitle} onChange={(e)=>setHomeTitle(e.target.value)} placeholder="Enter hero title" />
                    </label>
                    <label>
                      <span>Hero Subtitle</span>
                      <input value={homeSub} onChange={(e)=>setHomeSub(e.target.value)} placeholder="Enter hero subtitle" />
                    </label>
                    <label>
                      <span>Hero Background URL</span>
                      <input value={heroBg} onChange={(e)=>setHeroBg(e.target.value)} placeholder="Background image URL" />
                    </label>
                    <label>
                      <span>Upload Hero Background</span>
                      <input type="file" accept="image/*" onChange={(e)=>uploadHeroBg(e.target.files && e.target.files[0])} />
                    </label>
                <div>
                  <button className="primary" type="button" onClick={saveHome}>Save Home</button>
                </div>
                    <div className="card" style={{padding:12}}>
                      <strong>Homepage Stats</strong>
                      {stats.map((s,i)=> (
                        <div key={i} className="form-grid">
                          <label><span>Label</span><input value={s.label} onChange={(e)=>{const n=[...stats];n[i]={...n[i],label:e.target.value};setStats(n);saveContent(STORAGE_KEYS.HOME_STATS,n)}} /></label>
                          <label><span>Value</span><input value={s.value} onChange={(e)=>{const n=[...stats];n[i]={...n[i],value:e.target.value};setStats(n);saveContent(STORAGE_KEYS.HOME_STATS,n)}} /></label>
                        </div>
                      ))}
                      <div>
                        <button className="primary" type="button" onClick={saveHomeStats}>Save Stats</button>
                      </div>
                    </div>
                    <div className="card" style={{padding:12}}>
                      <strong>Homepage Features</strong>
                      <button className="primary" type="button" onClick={()=>{const n=[...features, '']; setFeatures(n); saveContent(STORAGE_KEYS.HOME_FEATURES,n)}}>+ Add Feature</button>
                      {features.map((f,i)=> (
                        <div key={i} className="form-grid">
                          <label><span>Text</span><input value={f} onChange={(e)=>{const n=[...features]; n[i]=e.target.value; setFeatures(n); saveContent(STORAGE_KEYS.HOME_FEATURES,n)}} /></label>
                          <button className="danger" type="button" onClick={()=>{const n=features.filter((_,idx)=>idx!==i); setFeatures(n); saveContent(STORAGE_KEYS.HOME_FEATURES,n)}}>Delete</button>
                        </div>
                      ))}
                      <div>
                        <button className="primary" type="button" onClick={saveHomeFeatures}>Save Features</button>
                      </div>
                    </div>
                    <div className="card" style={{padding:12}}>
                      <strong>Testimonials Section</strong>
                      <label><span>Title</span><input value={testiTitle} onChange={(e)=>{setTestiTitle(e.target.value); saveContent(STORAGE_KEYS.HOME_TESTIMONIALS,{ title: e.target.value, subtitle: testiSub, items: testimonials })}} /></label>
                      <label><span>Subtitle</span><input value={testiSub} onChange={(e)=>{setTestiSub(e.target.value); saveContent(STORAGE_KEYS.HOME_TESTIMONIALS,{ title: testiTitle, subtitle: e.target.value, items: testimonials })}} /></label>
                      <button className="primary" type="button" onClick={()=>{const n=[...testimonials, { quote:'', author:'' }]; setTestimonials(n); saveContent(STORAGE_KEYS.HOME_TESTIMONIALS,{ title: testiTitle, subtitle: testiSub, items: n })}}>+ Add Testimonial</button>
                      {testimonials.map((t,i)=> (
                        <div key={i} className="form-grid">
                          <label><span>Quote</span><input value={t.quote} onChange={(e)=>{const n=[...testimonials]; n[i]={...n[i], quote:e.target.value}; setTestimonials(n); saveContent(STORAGE_KEYS.HOME_TESTIMONIALS,{ title: testiTitle, subtitle: testiSub, items: n })}} /></label>
                          <label><span>Author</span><input value={t.author} onChange={(e)=>{const n=[...testimonials]; n[i]={...n[i], author:e.target.value}; setTestimonials(n); saveContent(STORAGE_KEYS.HOME_TESTIMONIALS,{ title: testiTitle, subtitle: testiSub, items: n })}} /></label>
                          <button className="danger" type="button" onClick={()=>{const n=testimonials.filter((_,idx)=>idx!==i); setTestimonials(n); saveContent(STORAGE_KEYS.HOME_TESTIMONIALS,{ title: testiTitle, subtitle: testiSub, items: n })}}>Delete</button>
                        </div>
                      ))}
                      <div>
                        <button className="primary" type="button" onClick={saveHomeTestimonials}>Save Testimonials</button>
                      </div>
                    </div>
                    
                  </div>
                ) : active === 'About Contents' ? (
                  <div className="form-grid">
                    <label>
                      <span>Who We Are</span>
                      <input value={aboutWho} onChange={(e)=>setAboutWho(e.target.value)} placeholder="About summary" />
                    </label>
                    <div className="card" style={{padding:12}}>
                      <strong>Team Members</strong>
                      <button className="primary" type="button" onClick={()=>{const n=[...team,{name:'',role:'',img:''}];setTeam(n);saveContent(STORAGE_KEYS.ABOUT_TEAM,n)}}>+ Add Member</button>
                      {team.map((m,i)=> (
                        <div key={i} className="form-grid">
                          <label><span>Name</span><input value={m.name} onChange={(e)=>{const n=[...team];n[i]={...n[i],name:e.target.value};setTeam(n);saveContent(STORAGE_KEYS.ABOUT_TEAM,n)}} /></label>
                          <label><span>Role</span><input value={m.role} onChange={(e)=>{const n=[...team];n[i]={...n[i],role:e.target.value};setTeam(n);saveContent(STORAGE_KEYS.ABOUT_TEAM,n)}} /></label>
                          <label><span>Image URL</span><input value={m.img} onChange={(e)=>{const n=[...team];n[i]={...n[i],img:e.target.value};setTeam(n);saveContent(STORAGE_KEYS.ABOUT_TEAM,n)}} /></label>
                          <label><span>Upload Image</span><input type="file" accept="image/*" onChange={(e)=>{const file=(e.target.files && e.target.files[0]); if(!file) return; const reader=new FileReader(); reader.onload=()=>{const n=[...team];n[i]={...n[i],img:reader.result}; setTeam(n); saveContent(STORAGE_KEYS.ABOUT_TEAM,n)}; reader.readAsDataURL(file);}} /></label>
                          <button className="danger" type="button" onClick={()=>{const next = team.filter((_,idx)=>idx!==i); setTeam(next); saveContent(STORAGE_KEYS.ABOUT_TEAM,next)}}>Delete</button>
                        </div>
                      ))}
                      <div>
                        <button className="primary" type="button" onClick={saveTeam}>Save Team</button>
                      </div>
                    </div>
                    
                  </div>
                ) : active === 'Services Contents' ? (
                  <div className="form-grid">
                    <button className="primary" type="button" onClick={addService}>+ Add Service</button>
                    {services.map((s, i) => (
                      <div key={i} className="card" style={{padding:12}}>
                        <div className="form-grid">
                          <label><span>Title</span><input value={s.title} onChange={(e)=>updateService(i,'title',e.target.value)} /></label>
                          <label><span>Copy</span><input value={s.copy} onChange={(e)=>updateService(i,'copy',e.target.value)} /></label>
                          <label><span>Image URL</span><input value={s.img} onChange={(e)=>updateService(i,'img',e.target.value)} /></label>
                          <label><span>Upload Image</span><input type="file" accept="image/*" onChange={(e)=>uploadServiceImage(i, e.target.files && e.target.files[0])} /></label>
                          <button className="danger" type="button" onClick={()=>{const next = services.filter((_,idx)=>idx!==i); setServices(next); saveContent(STORAGE_KEYS.SERVICES,next)}}>Delete</button>
                        </div>
                      </div>
                    ))}
                    <div>
                      <button className="primary" type="button" onClick={saveServices}>Save Services</button>
                    </div>
                  </div>
                ) : active === 'Projects Contents' ? (
                  <div className="form-grid">
                    <button className="primary" type="button" onClick={addProject}>+ Add Project</button>
                    {projects.map((p, i) => (
                      <div key={i} className="card" style={{padding:12}}>
                        <div className="form-grid">
                          <label><span>Title</span><input value={p.title} onChange={(e)=>updateProject(i,'title',e.target.value)} /></label>
                          <label><span>Copy</span><input value={p.copy} onChange={(e)=>updateProject(i,'copy',e.target.value)} /></label>
                          <label><span>Image URL</span><input value={p.img} onChange={(e)=>updateProject(i,'img',e.target.value)} /></label>
                          <label><span>Upload Image</span><input type="file" accept="image/*" onChange={(e)=>uploadProjectImage(i, e.target.files && e.target.files[0])} /></label>
                          <button className="danger" type="button" onClick={()=>{const next = projects.filter((_,idx)=>idx!==i); setProjects(next); saveContent(STORAGE_KEYS.PROJECTS,next)}}>Delete</button>
                        </div>
                      </div>
                    ))}
                    <div>
                      <button className="primary" type="button" onClick={saveProjects}>Save Projects</button>
                    </div>
                  </div>
                ) : active === 'Trainings Contents' ? (
                  <div className="form-grid">
                    <label><span>Trainings Title</span><input value={trainingsMeta.title} onChange={(e)=>{const v={...trainingsMeta, title:e.target.value}; setTrainingsMeta(v); saveContent(STORAGE_KEYS.TRAININGS_META, v)}} /></label>
                    <label><span>Trainings Subtitle</span><input value={trainingsMeta.subtitle} onChange={(e)=>{const v={...trainingsMeta, subtitle:e.target.value}; setTrainingsMeta(v); saveContent(STORAGE_KEYS.TRAININGS_META, v)}} /></label>
                    {trainings.map((t, i) => (
                      <div key={i} className="card" style={{padding:12}}>
                        <div className="form-grid">
                          <label><span>Title</span><input value={t.title} onChange={(e)=>updateTraining(i,'title',e.target.value)} /></label>
                          <label><span>Copy</span><input value={t.copy} onChange={(e)=>updateTraining(i,'copy',e.target.value)} /></label>
                          <label><span>Image URL</span><input value={t.img} onChange={(e)=>updateTraining(i,'img',e.target.value)} /></label>
                          <label><span>Upload Image</span><input type="file" accept="image/*" onChange={(e)=>uploadTrainingImage(i, e.target.files && e.target.files[0])} /></label>
                          <button className="danger" type="button" onClick={()=>{const next = trainings.filter((_,idx)=>idx!==i); setTrainings(next); saveContent(STORAGE_KEYS.TRAININGS,next)}}>Delete</button>
                        </div>
                      </div>
                    ))}
                    <div style={{display:'flex', gap:'10px'}}>
                      <button className="primary" type="button" onClick={saveTrainingsMeta}>Save Intro</button>
                      <button className="primary" type="button" onClick={saveTrainings}>Save Trainings</button>
                    </div>
                    <div className="card" style={{padding:12}}>
                      <strong>Registration Form Builder</strong>
                      <button className="primary" type="button" onClick={()=>{const n=[...trainingForm,{ name:'', label:'', type:'text', required:false }]; setTrainingForm(n); saveContent(STORAGE_KEYS.TRAININGS_FORM,n)}}>+ Add Field</button>
                      {trainingForm.map((f,i)=> (
                        <div key={i} className="form-grid">
                          <label><span>Field Name</span><input value={f.name} onChange={(e)=>{const n=[...trainingForm]; n[i]={...n[i],name:e.target.value}; setTrainingForm(n); saveContent(STORAGE_KEYS.TRAININGS_FORM,n)}} /></label>
                          <label><span>Label</span><input value={f.label} onChange={(e)=>{const n=[...trainingForm]; n[i]={...n[i],label:e.target.value}; setTrainingForm(n); saveContent(STORAGE_KEYS.TRAININGS_FORM,n)}} /></label>
                          <label><span>Type</span>
                            <select value={f.type} onChange={(e)=>{const n=[...trainingForm]; n[i]={...n[i],type:e.target.value}; setTrainingForm(n); saveContent(STORAGE_KEYS.TRAININGS_FORM,n)}}>
                              <option value="text">Text</option>
                              <option value="email">Email</option>
                              <option value="tel">Phone</option>
                              <option value="textarea">Textarea</option>
                              <option value="image">Image</option>
                              <option value="select">Select</option>
                            </select>
                          </label>
                          {f.type === 'select' && (
                            <label><span>Options (comma‑separated)</span><input value={f.options || ''} onChange={(e)=>{const n=[...trainingForm]; n[i]={...n[i],options:e.target.value}; setTrainingForm(n); saveContent(STORAGE_KEYS.TRAININGS_FORM,n)}} placeholder="e.g. Male,Female" /></label>
                          )}
                          <label><span>Required</span>
                            <select value={f.required ? 'yes':'no'} onChange={(e)=>{const n=[...trainingForm]; n[i]={...n[i],required:e.target.value==='yes'}; setTrainingForm(n); saveContent(STORAGE_KEYS.TRAININGS_FORM,n)}}>
                              <option value="yes">Yes</option>
                              <option value="no">No</option>
                            </select>
                          </label>
                          <button className="danger" type="button" onClick={()=>{const n=trainingForm.filter((_,idx)=>idx!==i); setTrainingForm(n); saveContent(STORAGE_KEYS.TRAININGS_FORM,n)}}>Delete</button>
                        </div>
                      ))}
                      <div>
                        <button className="primary" type="button" onClick={async ()=>{ try { await setContent(STORAGE_KEYS.TRAININGS_FORM, trainingForm); alert('Training form saved') } catch (e) { alert('Failed to save form: ' + e.message) } }}>Save Form</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="form-grid">
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <strong>Training Submissions</strong>
                      <button className="primary" type="button" onClick={()=>setTrainingSubmits(loadContent(STORAGE_KEYS.TRAININGS_SUBMITS, []))}>Refresh</button>
                    </div>
                    {trainingSubmits.length === 0 ? <p className="muted">No training submissions yet.</p> : trainingSubmits.map((s, i)=> (
                      <div key={i} className="card" style={{padding:12}}>
                        <div className="card-body">
                          <strong>{new Date(s.createdAt).toLocaleString()}</strong>
                          {Object.entries(s.values).map(([k,v]) => (
                            <p key={k}><strong>{k}:</strong> {typeof v === 'string' && v.startsWith('data:image') ? '[image uploaded]' : String(v)}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Admin



