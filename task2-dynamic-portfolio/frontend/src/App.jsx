import { Component, useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, Link, useNavigate } from 'react-router-dom'
import { ArrowUpRight, Award, BriefcaseBusiness, Code2, Contact, GitBranch, Layers3, LogOut, Menu, Pencil, Plus, Save, Sparkles, Trash2, X } from 'lucide-react'
import './App.css'

const API = import.meta.env.VITE_API_URL || '/api'
async function request(path, options = {}) { const response = await fetch(`${API}${path}`, {...options, headers:{'Content-Type':'application/json',...options.headers}}); const body=response.status===204?null:await response.json().catch(()=>({})); if(!response.ok) throw new Error(body.details?.[0]?.msg || body.error || 'Something went wrong'); return body }
function Loading(){return <main className="state-page"><span className="loader"/><p>Loading portfolio…</p></main>}

const studentHeadline = 'Building. Learning. Exploring technology.'

function externalUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : ''
  } catch {
    return ''
  }
}

function screenshotUrl(value) {
  return value?.startsWith('/api/') ? `${API}${value.slice(4)}` : value
}

function initials(name) {
  const words = name.trim().split(/\s+/)
  return words.length === 1 ? words[0].slice(0, 2) : words[0][0] + words.at(-1)[0]
}

function ProjectCard({ project, wide }) {
  const liveUrl = externalUrl(project.liveUrl)
  const githubUrl = externalUrl(project.repositoryUrl)
  const destination = liveUrl || githubUrl
  const image = project.imageUrl && (
    <img
      src={screenshotUrl(project.imageUrl)}
      alt={project.imageAlt || `${project.title} application screenshot`}
      width="1440"
      height="900"
      loading="lazy"
      decoding="async"
    />
  )

  return (
    <article className={wide ? 'project-card wide' : 'project-card'} style={{ '--accent': project.color || '#ff6b4a' }}>
      {image && (destination
        ? <a className="project-visual" href={destination} target="_blank" rel="noopener noreferrer">{image}</a>
        : <div className="project-visual">{image}</div>)}
      <div className="project-info">
        <p className="project-meta">{[project.year, project.technologies?.join(' / ')].filter(Boolean).join(' · ')}</p>
        <h3>
          {destination
            ? <a href={destination} target="_blank" rel="noopener noreferrer">{project.title}</a>
            : project.title}
        </h3>
        <p className="summary">{project.description?.trim() || project.summary}</p>
        {(liveUrl || githubUrl) && (
          <div className="project-links">
            {liveUrl && <a href={liveUrl} target="_blank" rel="noopener noreferrer">View Live</a>}
            {githubUrl && <a href={githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>}
          </div>
        )}
      </div>
    </article>
  )
}

function PublicPortfolio() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [menu, setMenu] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    async function loadPortfolio() {
      try {
        setData(await request('/portfolio', { signal: controller.signal }))
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message)
      }
    }
    void loadPortfolio()
    return () => controller.abort()
  }, [])

  if (error) return <main className="state-page"><h1>Unable to load the portfolio.</h1><p>{error}</p><button onClick={() => location.reload()}>Try again</button></main>
  if (!data) return <Loading />

  const { profile, projects, skills, achievements } = data
  const headline = profile.headline === studentHeadline
    ? 'Building. Learning.\nExploring technology.'
    : profile.headline
  const linkedin = externalUrl(profile.social?.linkedin)
  const github = externalUrl(profile.social?.github)
  const brand = <><span aria-hidden="true">{initials(profile.name)}</span>{profile.name}</>

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top">{brand}</a>
        <button className="menu-button" onClick={() => setMenu(!menu)} aria-label="Toggle navigation" aria-expanded={menu} aria-controls="site-navigation">
          {menu ? <X /> : <Menu />}
        </button>
        <nav id="site-navigation" className={menu ? 'open' : ''} onClick={() => setMenu(false)}>
          <a href="#work">Projects</a>
          <a href="#about">About</a>
          {achievements.length > 0 && <a href="#recognition">Recognition</a>}
          {linkedin && <a href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={14} /></a>}
          <a href="#contact" className="nav-cta">Contact</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <h1>{headline}</h1>
            <p className="hero-intro">{profile.bio}</p>
            <div className="hero-actions">
              <a className="button primary" href="#work">Explore projects</a>
              <a className="text-link" href="#contact">Contact me</a>
            </div>
          </div>
          <div className="hero-mark" aria-hidden="true"><span className="orbit orbit-one" /><span className="orbit orbit-two" /><Sparkles /></div>
          <p className="hero-side">{profile.role}<br />{profile.location}</p>
        </section>

        <section className="work section" id="work">
          <header className="section-heading">
            <div><p className="kicker">Featured Projects</p><h2>From ideas to applications.</h2></div>
          </header>
          {projects.length > 0
            ? <div className="project-grid">{projects.map((project, i) => <ProjectCard key={project.id} project={project} wide={i === 0} />)}</div>
            : <p className="empty-state">No projects to display.</p>}
        </section>

        <section className="about section" id="about">
          <div>
            <p className="kicker">About</p>
            <h2>What I’m learning<br />and using.</h2>
            <p>I’m learning programming fundamentals and exploring how applications handle security decisions in practice.</p>
          </div>
          <div className="skill-list">
            {skills.map(skill => (
              <div className="skill-row" key={skill.id}>
                <span>{skill.category}</span><strong>{skill.name}</strong><span className="skill-stage">Learning</span>
              </div>
            ))}
          </div>
        </section>

        {achievements.length > 0 && (
          <section className="recognition section" id="recognition">
            <p className="kicker">Milestones</p>
            <div className="achievement-head"><h2>Beyond the classroom.</h2><Award aria-hidden="true" /></div>
            <div className="achievement-list">
              {achievements.map(achievement => (
                <article key={achievement.id}>
                  <span>{achievement.year}</span>
                  <div><h3>{achievement.title}</h3><p>{achievement.issuer}</p></div>
                  <p>{achievement.description}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="contact section" id="contact">
          <h2>Get in touch.</h2>
          <a href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight aria-hidden="true" /></a>
        </section>
      </main>

      <footer>
        <div className="brand">{brand}</div>
        <div>
          {github && <a href={github} aria-label="GitHub"><GitBranch /></a>}
          {linkedin && <a href={linkedin} aria-label="LinkedIn"><Contact /></a>}
          <Link to="/admin">Admin</Link>
        </div>
      </footer>
    </div>
  )
}

function Login({onLogin}){const [form,setForm]=useState({email:'',password:''}),[error,setError]=useState(''),[busy,setBusy]=useState(false);const navigate=useNavigate();const submit=async e=>{e.preventDefault();setBusy(true);setError('');try{const result=await request('/auth/login',{method:'POST',body:JSON.stringify(form)});onLogin(result.token);navigate('/admin')}catch(err){setError(err.message)}finally{setBusy(false)}};return <main className="login-page"><Link className="brand" to="/"><span aria-hidden="true">SG</span>Portfolio</Link><form className="login-card" onSubmit={submit}><p className="kicker">Private workspace</p><h1>Welcome back.</h1><p>Sign in to edit your portfolio.</p>{error&&<div className="form-error">{error}</div>}<label>Email<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/></label><label>Password<input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/></label><button className="button primary" disabled={busy}>{busy?'Signing in…':'Sign in'}</button><Link to="/">Return to portfolio</Link></form></main>}
const emptyItems={projects:{title:'',summary:'',description:'',technologies:[],liveUrl:'',repositoryUrl:'',featured:false,year:new Date().getFullYear(),color:'#ff6b4a'},skills:{name:'',category:'Frontend',level:80},achievements:{title:'',issuer:'',year:new Date().getFullYear(),description:''}}
const screenshotTypes = ['image/png', 'image/jpeg', 'image/webp']
const maxScreenshotBytes = 2 * 1024 * 1024

function readScreenshot(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('The screenshot could not be read. Choose it again.'))
    reader.readAsDataURL(file)
  })
}

function Editor({ type, item, onSave, onClose }) {
  const [form, setForm] = useState(item || emptyItems[type])
  const [technologies, setTechnologies] = useState(() => item?.technologies?.join(', ') || '')
  const [upload, setUpload] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => () => {
    if (upload) URL.revokeObjectURL(upload.preview)
  }, [upload])

  function selectScreenshot(event) {
    const file = event.target.files[0]
    if (!file) return
    if (!screenshotTypes.includes(file.type) || file.size > maxScreenshotBytes) {
      event.target.value = ''
      setUpload(null)
      setError('Choose a PNG, JPEG, or WebP screenshot up to 2 MB.')
      return
    }
    setError('')
    setUpload({ file, preview: URL.createObjectURL(file) })
  }

  async function submit(event) {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      const fields = { ...form }
      delete fields.imageUrl
      if (type === 'projects') {
        fields.technologies = technologies.split(',').map(value => value.trim()).filter(Boolean)
        if (upload) fields.imageData = await readScreenshot(upload.file)
      }
      await onSave(fields)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const field = (name, label, fieldType = 'text') => (
    <label>
      {label}
      <input
        type={fieldType}
        value={form[name] ?? ''}
        onChange={event => setForm({ ...form, [name]: fieldType === 'number' ? Number(event.target.value) : event.target.value })}
        required={['title', 'name', 'summary', 'issuer', 'category'].includes(name)}
      />
    </label>
  )

  const description = (
    <div className="editor-field">
      <label htmlFor="editor-description">Description</label>
      <textarea id="editor-description" value={form.description || ''} onChange={event => setForm({ ...form, description: event.target.value })} />
    </div>
  )

  return (
    <div className="modal-backdrop">
      <form className="editor" onSubmit={submit}>
        <header>
          <div><p className="kicker">{item ? 'Edit' : 'Create'}</p><h2>{type.slice(0, -1)}</h2></div>
          <button type="button" className="icon-button" onClick={onClose} disabled={busy} aria-label="Close editor"><X /></button>
        </header>
        {type === 'projects' && (
          <>
            {field('title', 'Project title')}
            {field('summary', 'Short summary')}
            {description}
            <label>Technologies (comma separated)<input value={technologies} onChange={event => setTechnologies(event.target.value)} /></label>
            <div className="split">{field('year', 'Year', 'number')}{field('color', 'Accent color', 'color')}</div>
            {field('liveUrl', 'Live URL', 'url')}
            {field('repositoryUrl', 'GitHub URL', 'url')}
            <label>
              Project screenshot
              <input type="file" accept={screenshotTypes.join(',')} onChange={selectScreenshot} disabled={busy} />
              <small>PNG, JPEG, or WebP, up to 2 MB.</small>
            </label>
            {(upload || form.imageUrl) && <img className="editor-screenshot" src={upload?.preview || screenshotUrl(form.imageUrl)} alt="Project screenshot preview" />}
            <label>
              Screenshot alt text
              <input value={form.imageAlt || ''} maxLength={250} onChange={event => setForm({ ...form, imageAlt: event.target.value })} />
            </label>
            <label className="checkbox"><input type="checkbox" checked={!!form.featured} onChange={event => setForm({ ...form, featured: event.target.checked })} /> Featured project</label>
          </>
        )}
        {type === 'skills' && <>{field('name', 'Skill name')}{field('category', 'Category')}{field('level', 'Level (0–100)', 'number')}</>}
        {type === 'achievements' && <>{field('title', 'Achievement')}{field('issuer', 'Issuer')}{field('year', 'Year', 'number')}{description}</>}
        {error && <div className="form-error" role="alert">{error}</div>}
        <div className="editor-actions">
          <button type="button" onClick={onClose} disabled={busy}>Cancel</button>
          <button className="button primary" disabled={busy}><Save size={18} />{busy ? 'Saving…' : 'Save changes'}</button>
        </div>
      </form>
    </div>
  )
}

function Dashboard({token,onLogout}){const [data,setData]=useState(null),[section,setSection]=useState('overview'),[editing,setEditing]=useState(null),[notice,setNotice]=useState(''),[error,setError]=useState('');const auth=useMemo(()=>({Authorization:`Bearer ${token}`}),[token]);const load=async()=>{try{setError('');setData(await request('/portfolio'))}catch(err){setError(err.message)}};useEffect(()=>{const controller=new AbortController();async function loadDashboard(){try{setError('');setData(await request('/portfolio',{signal:controller.signal}))}catch(err){if(err.name!=='AbortError')setError(err.message)}}void loadDashboard();return()=>controller.abort()},[]);const saveItem = async form => {
  setNotice('')
  setError('')
  await request('/' + section + (editing?.id ? `/${editing.id}` : ''), {
    method: editing?.id ? 'PUT' : 'POST',
    headers: auth,
    body: JSON.stringify(form),
  })
  setEditing(null)
  setNotice('Changes saved')
  await load()
};const remove=async(type,id)=>{if(!confirm('Delete this item?'))return;try{setError('');await request(`/${type}/${id}`,{method:'DELETE',headers:auth});setNotice('Item deleted');await load()}catch(err){setError(err.message)}};if(!data)return error?<main className="state-page"><h1>Unable to load the dashboard.</h1><p>{error}</p><button onClick={load}>Try again</button></main>:<Loading/>;const nav=[['overview','Overview',Layers3],['projects','Projects',BriefcaseBusiness],['skills','Skills',Code2],['achievements','Achievements',Award],['profile','Profile',Pencil],['security','Security',Save]];return <div className="dashboard"><aside><Link className="brand" to="/"><span aria-hidden="true">{initials(data.profile.name)}</span>Portfolio</Link><nav>{nav.map(([id,label,Icon])=><button key={id} className={section===id?'active':''} onClick={()=>{setSection(id);setNotice('');setError('')}}><Icon/>{label}</button>)}</nav><button className="logout" onClick={onLogout}><LogOut/>Log out</button></aside><main><header className="dash-header"><div><p className="kicker">Admin dashboard</p><h1>{nav.find(x=>x[0]===section)?.[1]}</h1></div><Link to="/" target="_blank">View public site <ArrowUpRight size={18}/></Link></header>{notice&&<div className="notice" role="status">{notice}</div>}{error&&<div className="form-error">{error}</div>}{section==='overview'&&<Overview data={data} setSection={setSection}/>} {['projects','skills','achievements'].includes(section)&&<Manager type={section} items={data[section]} onEdit={item=>{setNotice('');setEditing(item)}} onDelete={id=>remove(section,id)}/>} {section==='profile'&&<ProfileForm profile={data.profile} auth={auth} onSaved={()=>{setNotice('Profile updated');void load()}} onError={setError}/>} {section==='security'&&<PasswordForm auth={auth} onSaved={()=>setNotice('Password updated')} onError={setError}/>}</main>{editing!==null&&<Editor type={section} item={editing.id?editing:null} onSave={saveItem} onClose={()=>setEditing(null)}/>}</div>}
function Overview({data,setSection}){const cards=[['Projects',data.projects.length,'projects'],['Skills',data.skills.length,'skills'],['Milestones',data.achievements.length,'achievements']];return <><div className="stat-grid">{cards.map(([label,count,id])=><button key={id} onClick={()=>setSection(id)}><span>{label}</span><strong>{String(count).padStart(2,'0')}</strong><ArrowUpRight/></button>)}</div><section className="dash-panel"><header><div><p className="kicker">At a glance</p><h2>Featured work</h2></div></header>{data.projects.filter(x=>x.featured).map(p=><div className="compact-row" key={p.id}><span style={{background:p.color}}/><strong>{p.title}</strong><em>{p.year}</em></div>)}</section></>}
function Manager({type,items,onEdit,onDelete}){return <section className="dash-panel"><header><div><p className="kicker">Content library</p><h2>{items.length} {type}</h2></div><button className="button primary" onClick={()=>onEdit({})}><Plus size={18}/>Add new</button></header>{items.length?items.map(item=><div className="manager-row" key={item.id}><div><strong>{item.title||item.name}</strong><span>{item.summary||item.category||`${item.issuer} · ${item.year}`}</span></div><div><button className="icon-button" onClick={()=>onEdit(item)} aria-label="Edit"><Pencil/></button><button className="icon-button danger" onClick={()=>onDelete(item.id)} aria-label="Delete"><Trash2/></button></div></div>):<div className="empty-state">Nothing here yet. Add your first item.</div>}</section>}
function ProfileForm({profile,auth,onSaved,onError}){const [form,setForm]=useState(profile);const submit=async e=>{e.preventDefault();try{await request('/profile',{method:'PUT',headers:auth,body:JSON.stringify(form)});onSaved()}catch(err){onError(err.message)}};return <form className="dash-panel form-grid" onSubmit={submit}>{['name','role','location','email','headline'].map(k=><label key={k}>{k}<input type={k==='email'?'email':'text'} value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})} required={['name','role','email','headline'].includes(k)}/></label>)}<label className="full">Bio<textarea value={form.bio||''} onChange={e=>setForm({...form,bio:e.target.value})} required/></label><button className="button primary"><Save size={18}/>Save profile</button></form>}
function PasswordForm({auth,onSaved,onError}){const [form,setForm]=useState({currentPassword:'',newPassword:''});const submit=async e=>{e.preventDefault();try{await request('/auth/password',{method:'PUT',headers:auth,body:JSON.stringify(form)});setForm({currentPassword:'',newPassword:''});onSaved()}catch(err){onError(err.message)}};return <form className="dash-panel security-form" onSubmit={submit}><h2>Change password</h2><p>Use at least eight characters. You’ll stay signed in on this device.</p><label>Current password<input type="password" value={form.currentPassword} onChange={e=>setForm({...form,currentPassword:e.target.value})} required/></label><label>New password<input type="password" minLength="8" value={form.newPassword} onChange={e=>setForm({...form,newPassword:e.target.value})} required/></label><button className="button primary">Update password</button></form>}
class ErrorBoundary extends Component{constructor(props){super(props);this.state={error:null}}static getDerivedStateFromError(error){return{error}}componentDidCatch(error,info){console.error('Uncaught React error',error,info)}reset=()=>{localStorage.removeItem('portfolio-token');window.location.assign('/')};render(){if(this.state.error)return <main className="state-page error-boundary"><p className="kicker">Application error</p><h1>Something went wrong.</h1><p>The error was contained so you can safely return to the portfolio.</p><button className="button primary" onClick={this.reset}>Return home</button></main>;return this.props.children}}
function App(){const [token,setToken]=useState(()=>localStorage.getItem('portfolio-token'));const login=value=>{localStorage.setItem('portfolio-token',value);setToken(value)};const logout=()=>{localStorage.removeItem('portfolio-token');setToken(null)};return <ErrorBoundary><BrowserRouter><Routes><Route path="/" element={<PublicPortfolio/>}/><Route path="/login" element={token?<Navigate to="/admin"/>:<Login onLogin={login}/>}/><Route path="/admin" element={token?<Dashboard token={token} onLogout={logout}/>:<Navigate to="/login"/>}/><Route path="*" element={<Navigate to="/"/>}/></Routes></BrowserRouter></ErrorBoundary>}
export default App
