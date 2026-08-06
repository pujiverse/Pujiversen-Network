
// ============================================================
// ADMIN PANEL COMPONENTS
// ============================================================

const ADMIN_USER = "pujiverse";
const ADMIN_PASS = "pujiverse2026";

// --- Small reusable form input ---
function AInput({ label, value, onChange, type="text", placeholder="", style={} }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6, ...style }}>
      {label && <label style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:1 }}>{label}</label>}
      <input
        type={type} value={value} onChange={e=>onChange(e.target.value)}
        placeholder={placeholder}
        style={{ padding:'10px 14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, color:'#e8e8f8', fontSize:14, outline:'none', fontFamily:'Inter,sans-serif' }}
      />
    </div>
  );
}

function ATextarea({ label, value, onChange, rows=3, placeholder="" }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      {label && <label style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:1 }}>{label}</label>}
      <textarea
        value={value} onChange={e=>onChange(e.target.value)} rows={rows}
        placeholder={placeholder}
        style={{ padding:'10px 14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, color:'#e8e8f8', fontSize:14, outline:'none', fontFamily:'Inter,sans-serif', resize:'vertical' }}
      />
    </div>
  );
}

function ABtn({ children, onClick, variant="primary", size="md", style={} }) {
  const base = { cursor:'pointer', fontFamily:'Inter,sans-serif', fontWeight:600, border:'none', borderRadius:10, transition:'all 0.15s', ...style };
  const sz = size==="sm" ? { padding:'6px 12px', fontSize:12 } : { padding:'10px 18px', fontSize:14 };
  const col = variant==="primary" ? { background:'linear-gradient(135deg,#22d3ee,#c084fc)', color:'#0a0a15' }
            : variant==="danger"  ? { background:'rgba(239,68,68,0.2)', color:'#f87171', border:'1px solid rgba(239,68,68,0.3)' }
            : variant==="ghost"   ? { background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.6)', border:'1px solid rgba(255,255,255,0.1)' }
            :                       { background:'rgba(255,255,255,0.08)', color:'#e8e8f8', border:'1px solid rgba(255,255,255,0.12)' };
  return <button onClick={onClick} style={{...base,...sz,...col}}>{children}</button>;
}

// ---- LOGIN MODAL ----
function LoginModal({ onLogin, onClose }) {
  const [user, setUser] = React.useState('');
  const [pass, setPass] = React.useState('');
  const [err, setErr] = React.useState('');
  const [step, setStep] = React.useState(1); // 1=credentials, 2=verify

  const handleLogin = () => {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      setStep(2);
    } else {
      setErr('Invalid credentials. Try again.');
    }
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', zIndex:9000, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(12px)' }}>
      <div style={{ background:'#0e0e1a', border:'1px solid rgba(255,255,255,0.12)', borderRadius:24, padding:40, width:'100%', maxWidth:400 }}>
        {step === 1 && <>
          <div style={{ textAlign:'center', marginBottom:28 }}>
            <div style={{ fontSize:32, marginBottom:8 }}>🔐</div>
            <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:22, fontWeight:800, color:'#f0f0f8', margin:'0 0 6px' }}>Admin Access</h2>
            <p style={{ color:'rgba(255,255,255,0.35)', fontSize:13, margin:0 }}>Private panel — authorized personnel only</p>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:16, marginBottom:20 }}>
            <AInput label="Username" value={user} onChange={setUser} placeholder="Enter username" />
            <AInput label="Password" value={pass} onChange={setPass} type="password" placeholder="Enter password" />
          </div>
          {err && <div style={{ padding:'10px 14px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:10, color:'#f87171', fontSize:13, marginBottom:16 }}>{err}</div>}
          <div style={{ display:'flex', gap:10 }}>
            <ABtn onClick={handleLogin} variant="primary" style={{ flex:1 }} onKeyDown={e=>e.key==='Enter'&&handleLogin()}>Continue →</ABtn>
            <ABtn onClick={onClose} variant="ghost">Cancel</ABtn>
          </div>
        </>}

        {step === 2 && <>
          <div style={{ textAlign:'center', marginBottom:28 }}>
            <div style={{ fontSize:32, marginBottom:8 }}>✅</div>
            <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:22, fontWeight:800, color:'#f0f0f8', margin:'0 0 6px' }}>Verification</h2>
            <p style={{ color:'rgba(255,255,255,0.35)', fontSize:13, margin:0 }}>Identity confirmed — click below to enter</p>
          </div>
          <div style={{ padding:'16px', background:'rgba(34,211,238,0.07)', border:'1px solid rgba(34,211,238,0.2)', borderRadius:12, marginBottom:20, textAlign:'center' }}>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)' }}>Logged in as</div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:18, fontWeight:700, color:'#22d3ee', marginTop:4 }}>@{ADMIN_USER}</div>
          </div>
          <ABtn onClick={onLogin} variant="primary" style={{ width:'100%' }}>Enter Admin Panel →</ABtn>
        </>}
      </div>
    </div>
  );
}

// ---- CHANNELS TAB ----
function ChannelsTab({ supabase, localChannels, setLocalChannels }) {
  const [editing, setEditing] = React.useState(null);
  const [form, setForm] = React.useState({});
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState('');

  const startEdit = (ch) => { setEditing(ch.sno); setForm({...ch, playlists: ch.playlists.join('\n')}); };
  const startNew  = () => { setEditing('NEW'); setForm({ sno:'', name:'', handle:'', cat:'Education', url:'', score:'', cpm:'Medium', team:1, status:'LIVE', playlists:'' }); };
  const cancel    = () => { setEditing(null); setForm({}); };

  const save = async () => {
    setSaving(true);
    const ch = { ...form, score: parseInt(form.score)||0, team: parseInt(form.team)||1, playlists: form.playlists.split('\n').map(s=>s.trim()).filter(Boolean) };
    if (editing === 'NEW') {
      const updated = [...localChannels, ch];
      setLocalChannels(updated);
      if (supabase) {
        await supabase.from('channels').insert([{ sno:ch.sno, channel_name:ch.name, handle:ch.handle, category:ch.cat, youtube_url:ch.url, viral_score:ch.score, cpm_tier:ch.cpm, team_size:ch.team, status:ch.status }]);
      }
    } else {
      const updated = localChannels.map(c => c.sno===editing ? ch : c);
      setLocalChannels(updated);
      if (supabase) {
        await supabase.from('channels').update({ channel_name:ch.name, handle:ch.handle, category:ch.cat, youtube_url:ch.url, viral_score:ch.score, cpm_tier:ch.cpm, team_size:ch.team, status:ch.status }).eq('sno', editing);
      }
    }
    setMsg('Saved ✓'); setSaving(false); setEditing(null);
    setTimeout(()=>setMsg(''), 2000);
  };

  const del = (sno) => {
    if (!confirm('Delete this channel?')) return;
    setLocalChannels(localChannels.filter(c=>c.sno!==sno));
    if (supabase) supabase.from('channels').delete().eq('sno', sno);
  };

  const cats = Array.from(new Set(CHANNELS.map(c=>c.cat)));

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:800, color:'#f0f0f8', margin:0 }}>Channels</h3>
          <span style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>{localChannels.length} total</span>
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          {msg && <span style={{ fontSize:13, color:'#4ade80' }}>{msg}</span>}
          <ABtn onClick={startNew} variant="primary">+ Add Channel</ABtn>
        </div>
      </div>

      {editing && (
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:16, padding:24, marginBottom:20 }}>
          <h4 style={{ color:'#c084fc', margin:'0 0 18px', fontFamily:"'Space Grotesk',sans-serif" }}>{editing==='NEW' ? '+ New Channel' : 'Edit Channel'}</h4>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
            <AInput label="S.No" value={form.sno||''} onChange={v=>setForm({...form,sno:v})} placeholder="1.38" />
            <AInput label="Channel Name" value={form.name||''} onChange={v=>setForm({...form,name:v})} placeholder="Pujiverse Example" />
            <AInput label="Handle" value={form.handle||''} onChange={v=>setForm({...form,handle:v})} placeholder="@pujiverseexample" />
            <AInput label="YouTube URL" value={form.url||''} onChange={v=>setForm({...form,url:v})} placeholder="https://youtube.com/@..." />
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              <label style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:1 }}>Category</label>
              <select value={form.cat||''} onChange={e=>setForm({...form,cat:e.target.value})} style={{ padding:'10px 14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, color:'#e8e8f8', fontSize:14, outline:'none' }}>
                {cats.map(c=><option key={c} value={c} style={{background:'#0e0e1a'}}>{c}</option>)}
              </select>
            </div>
            <AInput label="Viral Score" value={form.score||''} onChange={v=>setForm({...form,score:v})} placeholder="85" type="number" />
            <AInput label="Team Size" value={form.team||''} onChange={v=>setForm({...form,team:v})} placeholder="1" type="number" />
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              <label style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:1 }}>Status</label>
              <select value={form.status||'LIVE'} onChange={e=>setForm({...form,status:e.target.value})} style={{ padding:'10px 14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, color:'#e8e8f8', fontSize:14, outline:'none' }}>
                {['LIVE','PENDING','PAUSED'].map(s=><option key={s} value={s} style={{background:'#0e0e1a'}}>{s}</option>)}
              </select>
            </div>
          </div>
          <ATextarea label="Playlists (one per line)" value={form.playlists||''} onChange={v=>setForm({...form,playlists:v})} rows={6} placeholder="Playlist 1 name&#10;Playlist 2 name&#10;..." />
          <div style={{ display:'flex', gap:10, marginTop:14 }}>
            <ABtn onClick={save} variant="primary">{saving ? 'Saving...' : 'Save Channel'}</ABtn>
            <ABtn onClick={cancel} variant="ghost">Cancel</ABtn>
          </div>
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {localChannels.map(ch => {
          const col = CAT_COLORS[ch.cat] || CAT_COLORS["Education"];
          return (
            <div key={ch.sno} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 16px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:`${col.badge}33`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:col.accent, flexShrink:0 }}>{ch.sno}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:700, color:'#e8e8f8', marginBottom:2 }}>{ch.name}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)' }}>{ch.handle} · {ch.cat} · {ch.playlists.length} playlists</div>
              </div>
              <div style={{ fontSize:13, fontWeight:700, color: ch.score>=90?'#4ade80':ch.score>=80?'#facc15':'#fb923c', marginRight:8 }}>{ch.score}</div>
              <div style={{ display:'flex', gap:6 }}>
                {ch.url && <a href={ch.url} target="_blank" rel="noreferrer" style={{ padding:'5px 10px', background:'rgba(255,0,0,0.12)', border:'1px solid rgba(255,0,0,0.2)', borderRadius:8, fontSize:11, color:'#ff6b6b', textDecoration:'none' }}>YT</a>}
                <ABtn onClick={()=>startEdit(ch)} variant="ghost" size="sm">Edit</ABtn>
                <ABtn onClick={()=>del(ch.sno)} variant="danger" size="sm">Del</ABtn>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- VIDEOS TAB ----
function VideosTab({ supabase, localChannels, localVideos, setLocalVideos }) {
  const [selCh, setSelCh] = React.useState('');
  const [selPl, setSelPl] = React.useState('');
  const [form, setForm] = React.useState({ title:'', url:'' });
  const [msg, setMsg] = React.useState('');

  const ch = localChannels.find(c=>c.sno===selCh);
  const playlists = ch ? ch.playlists : [];
  const vids = (selCh && selPl !== '') ? (localVideos[selCh]?.[selPl] || []) : [];

  const addVideo = async () => {
    if (!form.title || !form.url || !selCh || selPl==='') { setMsg('Fill all fields'); return; }
    const updated = JSON.parse(JSON.stringify(localVideos));
    if (!updated[selCh]) updated[selCh] = {};
    if (!updated[selCh][selPl]) updated[selCh][selPl] = [];
    updated[selCh][selPl].push({ title: form.title, url: form.url });
    setLocalVideos(updated);
    localStorage.setItem('pv_videos', JSON.stringify(updated));
    if (supabase) {
      const plName = playlists[parseInt(selPl)];
      await supabase.from('videos').insert([{ channel_sno:selCh, playlist_index:parseInt(selPl), playlist_name:plName, title:form.title, video_url:form.url }]);
    }
    setForm({ title:'', url:'' });
    setMsg('Video added ✓'); setTimeout(()=>setMsg(''), 2000);
  };

  const delVideo = (idx) => {
    const updated = JSON.parse(JSON.stringify(localVideos));
    updated[selCh][selPl].splice(idx, 1);
    setLocalVideos(updated);
    localStorage.setItem('pv_videos', JSON.stringify(updated));
  };

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:800, color:'#f0f0f8', margin:'0 0 4px' }}>Video Manager</h3>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, margin:0 }}>Add videos to any playlist — they'll appear in the public view</p>
      </div>

      {/* Step 1: Pick channel */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          <label style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:1 }}>Channel</label>
          <select value={selCh} onChange={e=>{setSelCh(e.target.value);setSelPl('');}} style={{ padding:'10px 14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, color:'#e8e8f8', fontSize:14, outline:'none' }}>
            <option value="" style={{background:'#0e0e1a'}}>— Select Channel —</option>
            {localChannels.map(c=><option key={c.sno} value={c.sno} style={{background:'#0e0e1a'}}>{c.name}</option>)}
          </select>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          <label style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:1 }}>Playlist</label>
          <select value={selPl} onChange={e=>setSelPl(e.target.value)} disabled={!selCh} style={{ padding:'10px 14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, color:'#e8e8f8', fontSize:14, outline:'none', opacity: selCh?1:0.4 }}>
            <option value="" style={{background:'#0e0e1a'}}>— Select Playlist —</option>
            {playlists.map((pl,i)=><option key={i} value={i} style={{background:'#0e0e1a'}}>{pl}</option>)}
          </select>
        </div>
      </div>

      {/* Add video form */}
      {selCh && selPl !== '' && (
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:16, padding:20, marginBottom:20 }}>
          <h4 style={{ color:'#c084fc', margin:'0 0 14px', fontSize:14, fontFamily:"'Space Grotesk',sans-serif" }}>Add New Video</h4>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
            <AInput label="Video Title" value={form.title} onChange={v=>setForm({...form,title:v})} placeholder="My Awesome Video" />
            <AInput label="YouTube URL" value={form.url} onChange={v=>setForm({...form,url:v})} placeholder="https://youtube.com/watch?v=..." />
          </div>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <ABtn onClick={addVideo} variant="primary">+ Add Video</ABtn>
            {msg && <span style={{ fontSize:13, color: msg.includes('✓')?'#4ade80':'#f87171' }}>{msg}</span>}
          </div>
        </div>
      )}

      {/* Video list */}
      {selCh && selPl !== '' && (
        <div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:10 }}>{vids.length} video{vids.length!==1?'s':''} in this playlist</div>
          {vids.length === 0 && <div style={{ padding:'20px', textAlign:'center', color:'rgba(255,255,255,0.2)', fontSize:14 }}>No videos yet — add one above</div>}
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {vids.map((v,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10 }}>
                <div style={{ width:22, height:22, borderRadius:6, background:'rgba(255,0,0,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <SocialIcon icon="yt" size={10}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'#e0e0f0', marginBottom:2 }}>{v.title}</div>
                  <a href={v.url} target="_blank" rel="noreferrer" style={{ fontSize:11, color:'rgba(255,255,255,0.35)', textDecoration:'none' }}>{v.url}</a>
                </div>
                <ABtn onClick={()=>delVideo(i)} variant="danger" size="sm">×</ABtn>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---- SOCIAL LINKS TAB ----
function SocialTab({ localSocial, setLocalSocial }) {
  const [editing, setEditing] = React.useState(null);
  const [form, setForm] = React.useState({});
  const [msg, setMsg] = React.useState('');

  const save = () => {
    if (editing === 'NEW') {
      setLocalSocial([...localSocial, form]);
    } else {
      setLocalSocial(localSocial.map((s,i)=>i===editing ? form : s));
    }
    setEditing(null); setForm({});
    setMsg('Saved ✓'); setTimeout(()=>setMsg(''),2000);
  };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:800, color:'#f0f0f8', margin:0 }}>Social Links</h3>
          <span style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>{localSocial.length} platforms</span>
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          {msg && <span style={{ fontSize:13, color:'#4ade80' }}>{msg}</span>}
          <ABtn onClick={()=>{setEditing('NEW');setForm({platform:'',handle:'',url:'',color:'#ffffff',icon:'yt'});}} variant="primary">+ Add Platform</ABtn>
        </div>
      </div>

      {editing !== null && (
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:16, padding:20, marginBottom:20 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
            <AInput label="Platform Name" value={form.platform||''} onChange={v=>setForm({...form,platform:v})} placeholder="YouTube" />
            <AInput label="Handle" value={form.handle||''} onChange={v=>setForm({...form,handle:v})} placeholder="@pujiverse" />
            <AInput label="URL" value={form.url||''} onChange={v=>setForm({...form,url:v})} placeholder="https://..." />
            <AInput label="Brand Color" value={form.color||''} onChange={v=>setForm({...form,color:v})} placeholder="#ff0000" />
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <ABtn onClick={save} variant="primary">Save</ABtn>
            <ABtn onClick={()=>{setEditing(null);setForm({});}} variant="ghost">Cancel</ABtn>
          </div>
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {localSocial.map((s,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:`${s.color}22`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <SocialIcon icon={s.icon||'yt'} size={15}/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#e0e0f0' }}>{s.platform}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>{s.handle} · <a href={s.url} target="_blank" rel="noreferrer" style={{ color:'rgba(255,255,255,0.3)', textDecoration:'none' }}>{s.url}</a></div>
            </div>
            <ABtn onClick={()=>{setEditing(i);setForm({...s});}} variant="ghost" size="sm">Edit</ABtn>
            <ABtn onClick={()=>setLocalSocial(localSocial.filter((_,j)=>j!==i))} variant="danger" size="sm">×</ABtn>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- SUPABASE CONFIG TAB ----
function ConfigTab({ supabaseUrl, supabaseKey, setSupabaseUrl, setSupabaseKey, onConnect }) {
  const [msg, setMsg] = React.useState('');

  const save = () => {
    localStorage.setItem('pv_sb_url', supabaseUrl);
    localStorage.setItem('pv_sb_key', supabaseKey);
    onConnect();
    setMsg('Supabase config saved & connected!'); setTimeout(()=>setMsg(''),3000);
  };

  return (
    <div>
      <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:800, color:'#f0f0f8', margin:'0 0 6px' }}>Supabase Config</h3>
      <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, margin:'0 0 24px' }}>Connect your Supabase project to persist all data across devices</p>

      <div style={{ background:'rgba(34,211,238,0.06)', border:'1px solid rgba(34,211,238,0.2)', borderRadius:14, padding:20, marginBottom:24 }}>
        <div style={{ fontSize:13, fontWeight:600, color:'#22d3ee', marginBottom:12 }}>How to connect:</div>
        <ol style={{ margin:0, padding:'0 0 0 20px', color:'rgba(255,255,255,0.55)', fontSize:13, lineHeight:2 }}>
          <li>Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color:'#22d3ee' }}>supabase.com</a> → your project</li>
          <li>Settings → API → copy <strong style={{color:'#e8e8f8'}}>Project URL</strong> and <strong style={{color:'#e8e8f8'}}>anon public key</strong></li>
          <li>Paste them below and click Connect</li>
          <li>Run the SQL from the <strong style={{color:'#e8e8f8'}}>SQL Setup</strong> section below to create tables</li>
        </ol>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:20 }}>
        <AInput label="Supabase Project URL" value={supabaseUrl} onChange={setSupabaseUrl} placeholder="https://xxxx.supabase.co" />
        <AInput label="Supabase Anon Key" value={supabaseKey} onChange={setSupabaseKey} placeholder="eyJhbGciOiJIUzI1NiIsInR5c..." />
      </div>
      <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:32 }}>
        <ABtn onClick={save} variant="primary">Connect Supabase</ABtn>
        {msg && <span style={{ fontSize:13, color:'#4ade80' }}>{msg}</span>}
      </div>

      <h4 style={{ fontFamily:"'Space Grotesk',sans-serif", color:'#c084fc', margin:'0 0 12px' }}>SQL Setup — Run in Supabase SQL Editor</h4>
      <pre style={{ background:'rgba(0,0,0,0.4)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:20, fontSize:12, color:'#a8d8a8', overflow:'auto', maxHeight:400, lineHeight:1.7 }}>{`-- 1. CHANNELS TABLE
CREATE TABLE IF NOT EXISTS channels (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sno text UNIQUE,
  channel_name text NOT NULL,
  handle text,
  category text,
  youtube_url text,
  viral_score integer DEFAULT 0,
  cpm_tier text DEFAULT 'Medium',
  team_size integer DEFAULT 1,
  status text DEFAULT 'LIVE',
  created_at timestamptz DEFAULT now()
);

-- 2. PLAYLISTS TABLE
CREATE TABLE IF NOT EXISTS playlists (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_sno text REFERENCES channels(sno) ON DELETE CASCADE,
  playlist_name text NOT NULL,
  description text,
  playlist_url text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 3. VIDEOS TABLE
CREATE TABLE IF NOT EXISTS videos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  playlist_id uuid REFERENCES playlists(id) ON DELETE CASCADE,
  channel_sno text,
  playlist_index integer,
  playlist_name text,
  title text NOT NULL,
  video_url text,
  thumbnail_url text,
  description text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 4. SOCIAL LINKS TABLE
CREATE TABLE IF NOT EXISTS social_links (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  platform text NOT NULL,
  handle text,
  url text,
  icon_key text,
  brand_color text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true
);

-- 5. Enable RLS (optional but recommended)
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Public read channels" ON channels FOR SELECT USING (true);
CREATE POLICY "Public read playlists" ON playlists FOR SELECT USING (true);
CREATE POLICY "Public read videos" ON videos FOR SELECT USING (true);
CREATE POLICY "Public read social" ON social_links FOR SELECT USING (true);`}</pre>
    </div>
  );
}

// ---- DASHBOARD STATS ----
function DashStats({ channels, videos }) {
  const totalVideos = Object.values(videos).reduce((a,ch)=>a+Object.values(ch).reduce((b,vl)=>b+(vl.length||0),0),0);
  const cats = Array.from(new Set(channels.map(c=>c.cat)));
  const avgScore = Math.round(channels.reduce((a,c)=>a+c.score,0)/channels.length);
  const stats = [
    { label:'Channels', val: channels.length, color:'#22d3ee' },
    { label:'Playlists', val: channels.reduce((a,c)=>a+c.playlists.length,0), color:'#c084fc' },
    { label:'Videos Added', val: totalVideos, color:'#4ade80' },
    { label:'Categories', val: cats.length, color:'#facc15' },
    { label:'Avg Score', val: avgScore, color:'#fb923c' },
  ];
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:12, marginBottom:28 }}>
      {stats.map(s => (
        <div key={s.label} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:'16px 18px' }}>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:28, fontWeight:800, color: s.color }}>{s.val}</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:1 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ---- MAIN ADMIN PANEL ----
function AdminPanel({ onBack, supabase, supabaseUrl, supabaseKey, setSupabaseUrl, setSupabaseKey, onConnectSupabase, localChannels, setLocalChannels, localVideos, setLocalVideos, localSocial, setLocalSocial }) {
  const [tab, setTab] = React.useState('dashboard');
  const tabs = [
    { id:'dashboard', label:'Dashboard' },
    { id:'channels',  label:'Channels' },
    { id:'videos',    label:'Videos' },
    { id:'social',    label:'Social Links' },
    { id:'config',    label:'⚙ Supabase' },
  ];

  return (
    <div style={{ minHeight:'100vh', background:'#07071280', position:'relative', zIndex:1 }}>
      {/* Top bar */}
      <div style={{ borderBottom:'1px solid rgba(255,255,255,0.08)', padding:'16px 24px', display:'flex', alignItems:'center', gap:16, background:'rgba(0,0,0,0.3)', backdropFilter:'blur(12px)', position:'sticky', top:0, zIndex:100 }}>
        <button onClick={onBack} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'6px 14px', color:'rgba(255,255,255,0.6)', cursor:'pointer', fontSize:13 }}>← Public</button>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:16, fontWeight:800, color:'#c084fc' }}>PUJIVERSE ADMIN</div>
        <div style={{ display:'flex', gap:4, marginLeft:24, flex:1 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              padding:'6px 14px', borderRadius:8, border:'none', cursor:'pointer', fontSize:13, fontWeight:600,
              background: tab===t.id ? 'rgba(192,132,252,0.15)' : 'transparent',
              color: tab===t.id ? '#c084fc' : 'rgba(255,255,255,0.45)',
              transition:'all 0.15s'
            }}>{t.label}</button>
          ))}
        </div>
        {supabase && <div style={{ fontSize:12, color:'#4ade80', display:'flex', alignItems:'center', gap:5 }}><span style={{ width:7, height:7, borderRadius:'50%', background:'#4ade80', display:'inline-block' }}/>Supabase Connected</div>}
      </div>

      {/* Content */}
      <div style={{ maxWidth:1000, margin:'0 auto', padding:'32px 24px' }}>
        {tab === 'dashboard' && <>
          <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:24, fontWeight:800, color:'#f0f0f8', margin:'0 0 8px' }}>Welcome back, Pujith 👋</h2>
          <p style={{ color:'rgba(255,255,255,0.4)', margin:'0 0 28px' }}>Manage your entire Pujiverse network from here.</p>
          <DashStats channels={localChannels} videos={localVideos} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {[{ id:'channels',label:'Manage Channels',icon:'📺',desc:'Edit channel details, playlists, handles and URLs'},
              {id:'videos',label:'Add Videos',icon:'🎬',desc:'Add video links to any channel playlist'},
              {id:'social',label:'Social Links',icon:'🔗',desc:'Update your social media platform links'},
              {id:'config',label:'Supabase Config',icon:'🗄️',desc:'Connect your database for persistent storage'},
              {id:'lottery',label:'Lottery System',icon:'🎰',desc:'Run monthly subscriber draws per channel — live stream ready',external:'Lottery.html'},
            ].map(item => (
              <div key={item.id} onClick={()=>item.external ? window.open(item.external,'_blank') : setTab(item.id)} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'20px', cursor:'pointer', transition:'all 0.2s' }}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(192,132,252,0.08)'; e.currentTarget.style.border='1px solid rgba(192,132,252,0.25)';}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.03)'; e.currentTarget.style.border='1px solid rgba(255,255,255,0.08)';}}>
                <div style={{ fontSize:28, marginBottom:10 }}>{item.icon}</div>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:16, fontWeight:700, color:'#e8e8f8', marginBottom:4 }}>{item.label}</div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </>}
        {tab === 'channels' && <ChannelsTab supabase={supabase} localChannels={localChannels} setLocalChannels={setLocalChannels} />}
        {tab === 'videos'   && <VideosTab supabase={supabase} localChannels={localChannels} localVideos={localVideos} setLocalVideos={setLocalVideos} />}
        {tab === 'social'   && <SocialTab localSocial={localSocial} setLocalSocial={setLocalSocial} />}
        {tab === 'config'   && <ConfigTab supabaseUrl={supabaseUrl} supabaseKey={supabaseKey} setSupabaseUrl={setSupabaseUrl} setSupabaseKey={setSupabaseKey} onConnect={onConnectSupabase} />}
      </div>
    </div>
  );
}

Object.assign(window, { AdminPanel, LoginModal });
