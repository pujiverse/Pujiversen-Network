
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
          <ABtn onClick={()=>{ try { localStorage.setItem('pv_is_admin','1'); } catch(e){} onLogin(); }} variant="primary" style={{ width:'100%' }}>Enter Admin Panel →</ABtn>
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
function ConfigTab({ supabaseUrl, supabaseKey, setSupabaseUrl, setSupabaseKey, onConnect, supabase, localChannels, localVideos, localSocial, localWebsites, localPosts }) {
  const [msg, setMsg] = React.useState('');
  const [syncing, setSyncing] = React.useState(false);
  const [syncLog, setSyncLog] = React.useState([]);

  const save = () => {
    localStorage.setItem('pv_sb_url', supabaseUrl);
    localStorage.setItem('pv_sb_key', supabaseKey);
    onConnect();
    setMsg('Supabase config saved & connected!'); setTimeout(()=>setMsg(''),3000);
  };

  const log = (line, ok=true) => setSyncLog(prev => [...prev, { line, ok, t: new Date().toLocaleTimeString() }]);

  const syncAll = async () => {
    if (!supabase) { log('❌ Not connected to Supabase. Click "Connect Supabase" above first.', false); return; }
    setSyncing(true); setSyncLog([]);

    // 1. CHANNELS — upsert by sno
    try {
      const rows = localChannels.map(ch => ({
        sno: ch.sno, channel_name: ch.name, handle: ch.handle, category: ch.cat,
        youtube_url: ch.url, viral_score: parseInt(ch.score)||0, cpm_tier: ch.cpm,
        team_size: parseInt(ch.team)||1, status: ch.status
      }));
      const { error } = await supabase.from('channels').upsert(rows, { onConflict: 'sno' });
      if (error) throw error;
      log(`✓ channels: ${rows.length} rows synced`);
    } catch(e) { log(`✗ channels: ${e.message || e}`, false); }

    // 2. SOCIAL LINKS — clear + reinsert (simplest)
    try {
      const rows = localSocial.map((s,i) => ({
        platform: s.platform, handle: s.handle, url: s.url,
        icon_key: s.icon, brand_color: s.color, display_order: i, is_active: true
      }));
      await supabase.from('social_links').delete().neq('platform','__none__');
      const { error } = await supabase.from('social_links').insert(rows);
      if (error) throw error;
      log(`✓ social_links: ${rows.length} rows synced`);
    } catch(e) { log(`✗ social_links: ${e.message || e}`, false); }

    // 3. VIDEOS
    try {
      const rows = [];
      Object.entries(localVideos).forEach(([sno, plMap]) => {
        Object.entries(plMap || {}).forEach(([plIdx, vids]) => {
          (vids || []).forEach((v, i) => rows.push({
            channel_sno: sno, playlist_index: parseInt(plIdx),
            playlist_name: localChannels.find(c=>c.sno===sno)?.playlists?.[parseInt(plIdx)] || '',
            title: v.title, video_url: v.url, sort_order: i
          }));
        });
      });
      if (rows.length > 0) {
        await supabase.from('videos').delete().neq('id','00000000-0000-0000-0000-000000000000');
        const { error } = await supabase.from('videos').insert(rows);
        if (error) throw error;
      }
      log(`✓ videos: ${rows.length} rows synced`);
    } catch(e) { log(`✗ videos: ${e.message || e}`, false); }

    // 4. WEBSITES
    try {
      const rows = (localWebsites || []).map(w => ({
        id: w.id, title: w.title, url: w.url, description: w.description || '',
        tags: w.tags || [], accent: w.accent || '#22d3ee'
      }));
      const { error } = await supabase.from('websites').upsert(rows, { onConflict: 'id' });
      if (error) throw error;
      log(`✓ websites: ${rows.length} rows synced`);
    } catch(e) { log(`✗ websites: ${e.message || e} — make sure you ran the new SQL below`, false); }

    // 5. POSTS
    try {
      const rows = (localPosts || []).map(p => ({
        id: p.id, title: p.title, url: p.url, platform: p.platform,
        cover: p.cover || '', summary: p.summary || '',
        post_date: p.date && /^\d{4}-\d{2}-\d{2}$/.test(p.date) ? p.date : null
      }));
      const { error } = await supabase.from('posts').upsert(rows, { onConflict: 'id' });
      if (error) throw error;
      log(`✓ posts: ${rows.length} rows synced`);
    } catch(e) { log(`✗ posts: ${e.message || e} — make sure you ran the new SQL below`, false); }

    // 6. LOTTERY SUBSCRIBERS — across all channels
    try {
      const rows = [];
      localChannels.forEach(ch => {
        try {
          const subs = JSON.parse(localStorage.getItem('pv_lot_subs_' + ch.sno) || '[]');
          subs.forEach(s => rows.push({
            sub_id: s.id, channel_sno: ch.sno,
            name: s.name || '', handle: s.handle || '', email: s.email || '',
            subscriber_id: s.subscriberId || '', phone: s.phone || ''
          }));
        } catch(e) {}
      });
      if (rows.length > 0) {
        await supabase.from('lottery_subscribers').delete().neq('sub_id','__none__');
        const { error } = await supabase.from('lottery_subscribers').insert(rows);
        if (error) throw error;
      }
      log(`✓ lottery_subscribers: ${rows.length} rows synced`);
    } catch(e) { log(`✗ lottery_subscribers: ${e.message || e} — make sure you ran the new SQL below`, false); }

    // 7. LOTTERY HISTORY
    try {
      const hist = JSON.parse(localStorage.getItem('pv_lot_history') || '[]');
      const rows = hist.map(h => ({
        history_id: h.id, channel_name: h.channel, channel_sno: h.channelSno,
        draw_date: h.date, pool_size: h.poolSize, winner_count: h.winnerCount,
        winners: h.winners
      }));
      if (rows.length > 0) {
        const { error } = await supabase.from('lottery_history').upsert(rows, { onConflict: 'history_id' });
        if (error) throw error;
      }
      log(`✓ lottery_history: ${rows.length} rows synced`);
    } catch(e) { log(`✗ lottery_history: ${e.message || e} — make sure you ran the new SQL below`, false); }

    log('— Done —');
    setSyncing(false);
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
      <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:24, flexWrap:'wrap' }}>
        <ABtn onClick={save} variant="primary">Connect Supabase</ABtn>
        {msg && <span style={{ fontSize:13, color:'#4ade80' }}>{msg}</span>}
      </div>

      {/* SYNC PANEL */}
      <div style={{ background:'rgba(74,222,128,0.06)', border:'1px solid rgba(74,222,128,0.25)', borderRadius:14, padding:20, marginBottom:32 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:14, flexWrap:'wrap', marginBottom:14 }}>
          <div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:16, fontWeight:800, color:'#4ade80', margin:'0 0 4px' }}>📤 Sync All Data to Supabase</div>
            <p style={{ color:'rgba(255,255,255,0.55)', fontSize:13, margin:0, maxWidth:520 }}>
              Push everything currently in your browser (channels, videos, social links, lottery subs, websites, posts, draw history) to your Supabase tables in one go. Use this anytime your local data is ahead of Supabase. Existing rows are upserted by primary key — no duplicates.
            </p>
          </div>
          <ABtn onClick={syncAll} variant="primary" style={{ background: syncing ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg,#4ade80,#22d3ee)' }}>
            {syncing ? 'Syncing…' : '↑ Sync Now'}
          </ABtn>
        </div>
        {syncLog.length > 0 && (
          <div style={{ background:'rgba(0,0,0,0.4)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:10, padding:'10px 14px', fontFamily:'ui-monospace,Menlo,Consolas,monospace', fontSize:12, lineHeight:1.7, maxHeight:240, overflow:'auto' }}>
            {syncLog.map((l, i) => (
              <div key={i} style={{ color: l.ok ? 'rgba(255,255,255,0.7)' : '#fca5a5' }}>
                <span style={{ color:'rgba(255,255,255,0.3)', marginRight:8 }}>{l.t}</span>{l.line}
              </div>
            ))}
          </div>
        )}
        {!supabase && <div style={{ marginTop:10, fontSize:12, color:'#fca5a5' }}>⚠ Not connected yet. Click "Connect Supabase" above first.</div>}
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

-- 5. WEBSITES TABLE (My Projects on home page)
CREATE TABLE IF NOT EXISTS websites (
  id text PRIMARY KEY,
  title text NOT NULL,
  url text NOT NULL,
  description text,
  tags text[],
  accent text,
  created_at timestamptz DEFAULT now()
);

-- 6. POSTS TABLE (Medium / Blogger / Patreon links)
CREATE TABLE IF NOT EXISTS posts (
  id text PRIMARY KEY,
  title text NOT NULL,
  url text NOT NULL,
  platform text,
  cover text,
  summary text,
  post_date date,
  created_at timestamptz DEFAULT now()
);

-- 7. LOTTERY SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS lottery_subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sub_id text,
  channel_sno text,
  name text NOT NULL,
  handle text,
  email text,
  subscriber_id text,
  phone text,
  created_at timestamptz DEFAULT now()
);

-- 8. LOTTERY HISTORY TABLE (past draws)
CREATE TABLE IF NOT EXISTS lottery_history (
  history_id text PRIMARY KEY,
  channel_name text,
  channel_sno text,
  draw_date text,
  pool_size integer,
  winner_count integer,
  winners jsonb,
  created_at timestamptz DEFAULT now()
);

-- 9. Enable RLS + public read for all tables
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE lottery_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE lottery_history ENABLE ROW LEVEL SECURITY;

-- Public read policies
DROP POLICY IF EXISTS "Public read channels" ON channels;
CREATE POLICY "Public read channels" ON channels FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read playlists" ON playlists;
CREATE POLICY "Public read playlists" ON playlists FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read videos" ON videos;
CREATE POLICY "Public read videos" ON videos FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read social" ON social_links;
CREATE POLICY "Public read social" ON social_links FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read websites" ON websites;
CREATE POLICY "Public read websites" ON websites FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read posts" ON posts;
CREATE POLICY "Public read posts" ON posts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read lottery_subs" ON lottery_subscribers;
CREATE POLICY "Public read lottery_subs" ON lottery_subscribers FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read lottery_history" ON lottery_history;
CREATE POLICY "Public read lottery_history" ON lottery_history FOR SELECT USING (true);

-- IMPORTANT: write policies (anon key writes from the admin panel)
-- These allow the anon key to insert/update/delete. If you want to lock down writes
-- to authenticated users only, replace USING(true) with USING(auth.role() = 'authenticated').
DROP POLICY IF EXISTS "Anon write channels" ON channels;
CREATE POLICY "Anon write channels" ON channels FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Anon write playlists" ON playlists;
CREATE POLICY "Anon write playlists" ON playlists FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Anon write videos" ON videos;
CREATE POLICY "Anon write videos" ON videos FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Anon write social" ON social_links;
CREATE POLICY "Anon write social" ON social_links FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Anon write websites" ON websites;
CREATE POLICY "Anon write websites" ON websites FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Anon write posts" ON posts;
CREATE POLICY "Anon write posts" ON posts FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Anon write lottery_subs" ON lottery_subscribers;
CREATE POLICY "Anon write lottery_subs" ON lottery_subscribers FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Anon write lottery_history" ON lottery_history;
CREATE POLICY "Anon write lottery_history" ON lottery_history FOR ALL USING (true) WITH CHECK (true);`}</pre>
    </div>
  );
}

// ============================================================
// LOTTERY SUBSCRIBERS TAB — per-channel subscriber lists
// ============================================================
function LotterySubsTab({ localChannels }) {
  const [selSno, setSelSno]   = React.useState(localChannels[0]?.sno || '');
  const [subs, setSubs]       = React.useState([]);
  const [paste, setPaste]     = React.useState('');
  const [manForm, setManForm] = React.useState({ name:'', handle:'', email:'', subscriberId:'', phone:'' });
  const [msg, setMsg]         = React.useState('');
  const [search, setSearch]   = React.useState('');

  const showMsg = (m, ok=true) => { setMsg({text:m,ok}); setTimeout(()=>setMsg(''),2500); };
  const uid = () => Math.random().toString(36).slice(2)+Date.now().toString(36);

  // Load subs whenever selected channel changes
  React.useEffect(() => {
    if (!selSno) return;
    try { setSubs(JSON.parse(localStorage.getItem('pv_lot_subs_'+selSno) || '[]')); }
    catch { setSubs([]); }
  }, [selSno]);

  const persist = (arr) => {
    setSubs(arr);
    localStorage.setItem('pv_lot_subs_'+selSno, JSON.stringify(arr));
  };

  const addManual = () => {
    if (!manForm.name.trim()) { showMsg('Name is required', false); return; }
    persist([...subs, { id:uid(), ...manForm }]);
    setManForm({ name:'', handle:'', email:'', subscriberId:'', phone:'' });
    showMsg('Subscriber added ✓');
  };

  const addPaste = () => {
    const lines = paste.split('\n').map(l=>l.trim()).filter(Boolean);
    const newSubs = lines.map(l => {
      const parts = l.split(',').map(s=>s.trim());
      return { id:uid(), name:parts[0]||l, handle:parts[1]||'', email:parts[2]||'', subscriberId:parts[3]||'', phone:parts[4]||'' };
    });
    if (newSubs.length === 0) { showMsg('Nothing to add', false); return; }
    persist([...subs, ...newSubs]);
    setPaste('');
    showMsg(`Added ${newSubs.length} subscribers ✓`);
  };

  const delSub = (id) => persist(subs.filter(s => s.id !== id));
  const clearAll = () => {
    if (!confirm(`Delete ALL ${subs.length} subscribers?`)) return;
    persist([]);
  };

  const filtered = subs.filter(s => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (s.name||'').toLowerCase().includes(q)
      || (s.handle||'').toLowerCase().includes(q)
      || (s.email||'').toLowerCase().includes(q);
  });

  const ch = localChannels.find(c=>c.sno===selSno);
  const accent = ch ? (CAT_COLORS[ch.cat]?.accent || '#c084fc') : '#c084fc';

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
        <div>
          <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:800, color:'#f0f0f8', margin:0 }}>Lottery Subscribers</h3>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, margin:'4px 0 0' }}>Each channel has its own private subscriber pool. Public viewers can see the list — only admin can edit.</p>
        </div>
        <a href="Lottery.html" target="_blank" rel="noreferrer" style={{ padding:'8px 14px', background:'rgba(192,132,252,0.15)', border:'1px solid rgba(192,132,252,0.3)', borderRadius:10, color:'#c084fc', fontSize:13, fontWeight:600, textDecoration:'none' }}>🎰 Open Lottery →</a>
      </div>

      {/* Channel picker */}
      <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:16, marginBottom:20 }}>
        <label style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:8 }}>Select channel</label>
        <select value={selSno} onChange={e=>setSelSno(e.target.value)} style={{ width:'100%', padding:'10px 14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, color:'#e8e8f8', fontSize:14, outline:'none' }}>
          {localChannels.map(c => {
            const cnt = (() => { try { return (JSON.parse(localStorage.getItem('pv_lot_subs_'+c.sno) || '[]')).length; } catch { return 0; } })();
            return <option key={c.sno} value={c.sno} style={{background:'#0e0e1a'}}>{c.name} — {cnt} sub{cnt!==1?'s':''}</option>;
          })}
        </select>
      </div>

      {ch && (
        <div style={{ background:`${accent}10`, border:`1px solid ${accent}33`, borderRadius:16, padding:'16px 20px', marginBottom:20, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:18, fontWeight:800, color:accent }}>{ch.name}</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)' }}>{ch.handle} · {ch.cat}</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:32, fontWeight:900, color:accent, lineHeight:1 }}>{subs.length}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1 }}>subscribers</div>
          </div>
        </div>
      )}

      {/* Add manual */}
      <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:14, padding:18, marginBottom:14 }}>
        <h4 style={{ color:'#c084fc', margin:'0 0 12px', fontSize:13, fontFamily:"'Space Grotesk',sans-serif", textTransform:'uppercase', letterSpacing:1 }}>+ Add One Subscriber</h4>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:10, marginBottom:10 }}>
          <AInput label="Name *"        value={manForm.name}         onChange={v=>setManForm({...manForm,name:v})}         placeholder="John Doe" />
          <AInput label="Handle"        value={manForm.handle}       onChange={v=>setManForm({...manForm,handle:v})}       placeholder="@johndoe" />
          <AInput label="Email"         value={manForm.email}        onChange={v=>setManForm({...manForm,email:v})}        placeholder="john@gmail.com" />
          <AInput label="Subscriber ID" value={manForm.subscriberId} onChange={v=>setManForm({...manForm,subscriberId:v})} placeholder="UCxxxxxx" />
          <AInput label="Phone"         value={manForm.phone}        onChange={v=>setManForm({...manForm,phone:v})}        placeholder="+91 9876543210" />
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <ABtn onClick={addManual} variant="primary">+ Add Subscriber</ABtn>
          {msg && <span style={{ fontSize:13, color: msg.ok?'#4ade80':'#f87171' }}>{msg.text}</span>}
        </div>
      </div>

      {/* Bulk paste */}
      <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:14, padding:18, marginBottom:20 }}>
        <h4 style={{ color:'#22d3ee', margin:'0 0 8px', fontSize:13, fontFamily:"'Space Grotesk',sans-serif", textTransform:'uppercase', letterSpacing:1 }}>📝 Bulk Paste</h4>
        <p style={{ fontSize:12, color:'rgba(255,255,255,0.45)', margin:'0 0 10px' }}>One per line. Format: <code style={{ color:'#22d3ee' }}>Name, @handle, email, subscriberId, phone</code> — only Name is required.</p>
        <textarea value={paste} onChange={e=>setPaste(e.target.value)} rows={6} placeholder={"John Doe, @johndoe, john@gmail.com\nJane Smith\nAlex Kumar, @alex"} style={{ width:'100%', padding:'10px 14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, color:'#e8e8f8', fontSize:13, outline:'none', fontFamily:'Inter,sans-serif', resize:'vertical', lineHeight:1.6, marginBottom:10 }}/>
        <div style={{ display:'flex', gap:10 }}>
          <ABtn onClick={addPaste} variant="primary">Add {paste.split('\n').filter(l=>l.trim()).length} Subscribers</ABtn>
          {subs.length>0 && <ABtn onClick={clearAll} variant="danger">Clear all subs for this channel</ABtn>}
        </div>
      </div>

      {/* List */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
        <h4 style={{ color:'#e8e8f8', margin:0, fontSize:14, fontFamily:"'Space Grotesk',sans-serif" }}>Current list ({subs.length})</h4>
        {subs.length>0 && <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search names..." style={{ padding:'6px 12px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, color:'#e8e8f8', fontSize:12, outline:'none', width:200 }}/>}
      </div>
      {subs.length === 0 ? (
        <div style={{ padding:'32px', textAlign:'center', color:'rgba(255,255,255,0.3)', fontSize:14, background:'rgba(255,255,255,0.02)', border:'1px dashed rgba(255,255,255,0.08)', borderRadius:14 }}>
          <div style={{ fontSize:32, marginBottom:10 }}>👥</div>
          No subscribers in this channel's pool yet — add some above
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:6, maxHeight:400, overflowY:'auto' }}>
          {filtered.map((s,i) => (
            <div key={s.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10 }}>
              <div style={{ width:26, height:26, borderRadius:8, background:`${accent}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:accent, flexShrink:0 }}>{i+1}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:600, color:'#e8e8f8' }}>{s.name}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', display:'flex', gap:10, flexWrap:'wrap', marginTop:2 }}>
                  {s.handle && <span>{s.handle}</span>}
                  {s.email && <span>{s.email}</span>}
                  {s.phone && <span>{s.phone}</span>}
                  {s.subscriberId && <span>ID: {s.subscriberId}</span>}
                </div>
              </div>
              <ABtn onClick={()=>delSub(s.id)} variant="danger" size="sm">×</ABtn>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// WEBSITES TAB — manage projects shown on the home page
// ============================================================
function WebsitesTab({ localWebsites, setLocalWebsites }) {
  const [editing, setEditing] = React.useState(null);
  const [form, setForm]       = React.useState({ id:'', title:'', url:'', description:'', tags:'', accent:'#22d3ee' });
  const [msg, setMsg]         = React.useState('');

  const startNew  = () => { setEditing('NEW'); setForm({ id:Date.now().toString(36), title:'', url:'', description:'', tags:'', accent:'#22d3ee' }); };
  const startEdit = (w) => { setEditing(w.id); setForm({ ...w, tags:(w.tags||[]).join(', ') }); };
  const cancel    = () => { setEditing(null); setForm({}); };
  const showMsg = (m) => { setMsg(m); setTimeout(()=>setMsg(''),2000); };

  const save = () => {
    if (!form.title || !form.url) { showMsg('Title & URL required'); return; }
    const cleaned = { ...form, tags: form.tags.split(',').map(s=>s.trim()).filter(Boolean) };
    const updated = editing === 'NEW' ? [...localWebsites, cleaned] : localWebsites.map(w => w.id===editing ? cleaned : w);
    setLocalWebsites(updated);
    setEditing(null); setForm({});
    showMsg('Saved ✓');
  };

  const del = (id) => {
    if (!confirm('Delete this website?')) return;
    setLocalWebsites(localWebsites.filter(w=>w.id!==id));
  };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:800, color:'#f0f0f8', margin:0 }}>My Projects (Websites)</h3>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, margin:'4px 0 0' }}>Live websites shown on the home page. Thumbnails are auto-generated from your URL.</p>
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          {msg && <span style={{ fontSize:13, color:'#4ade80' }}>{msg}</span>}
          <ABtn onClick={startNew} variant="primary">+ Add Website</ABtn>
        </div>
      </div>

      {editing && (
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:16, padding:20, marginBottom:18 }}>
          <h4 style={{ color:'#22d3ee', margin:'0 0 14px', fontSize:14, fontFamily:"'Space Grotesk',sans-serif" }}>{editing==='NEW' ? 'New Website' : 'Edit Website'}</h4>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
            <AInput label="Title *" value={form.title||''} onChange={v=>setForm({...form,title:v})} placeholder="My Cool Project" />
            <AInput label="URL *" value={form.url||''} onChange={v=>setForm({...form,url:v})} placeholder="https://my-project.vercel.app" />
            <AInput label="Tags (comma separated)" value={form.tags||''} onChange={v=>setForm({...form,tags:v})} placeholder="React, Tailwind, Live" />
            <AInput label="Accent color" value={form.accent||'#22d3ee'} onChange={v=>setForm({...form,accent:v})} placeholder="#22d3ee" />
          </div>
          <ATextarea label="Short description" value={form.description||''} onChange={v=>setForm({...form,description:v})} rows={2} placeholder="What does this project do? (1-2 lines)" />
          <div style={{ display:'flex', gap:10, marginTop:14 }}>
            <ABtn onClick={save} variant="primary">Save Website</ABtn>
            <ABtn onClick={cancel} variant="ghost">Cancel</ABtn>
          </div>
        </div>
      )}

      {localWebsites.length === 0 ? (
        <div style={{ padding:'40px', textAlign:'center', color:'rgba(255,255,255,0.3)', fontSize:14, background:'rgba(255,255,255,0.02)', border:'1px dashed rgba(255,255,255,0.08)', borderRadius:14 }}>
          <div style={{ fontSize:36, marginBottom:10 }}>🌐</div>
          No websites yet — click "+ Add Website" above to feature your first project on the home page.
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {localWebsites.map(w => (
            <div key={w.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 16px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12 }}>
              <div style={{ width:48, height:36, borderRadius:8, background:`${w.accent||'#22d3ee'}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>🌐</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:700, color:'#e8e8f8' }}>{w.title}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{w.url}</div>
              </div>
              <a href={w.url} target="_blank" rel="noreferrer" style={{ padding:'5px 10px', background:'rgba(34,211,238,0.12)', border:'1px solid rgba(34,211,238,0.25)', borderRadius:8, fontSize:11, color:'#22d3ee', textDecoration:'none' }}>Open</a>
              <ABtn onClick={()=>startEdit(w)} variant="ghost" size="sm">Edit</ABtn>
              <ABtn onClick={()=>del(w.id)} variant="danger" size="sm">×</ABtn>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// POSTS TAB — Medium / Blogger / Patreon / etc.
// ============================================================
function PostsTab({ localPosts, setLocalPosts }) {
  const [editing, setEditing] = React.useState(null);
  const [form, setForm]       = React.useState({ id:'', title:'', url:'', platform:'Medium', cover:'', summary:'', date:'' });
  const [msg, setMsg]         = React.useState('');
  const PLATFORMS = ['Medium','Blogger','Patreon','Substack','Quora','LinkedIn','Other'];

  const startNew  = () => { setEditing('NEW'); setForm({ id:Date.now().toString(36), title:'', url:'', platform:'Medium', cover:'', summary:'', date:new Date().toISOString().slice(0,10) }); };
  const startEdit = (p) => { setEditing(p.id); setForm({ ...p }); };
  const cancel    = () => { setEditing(null); setForm({}); };
  const showMsg = (m) => { setMsg(m); setTimeout(()=>setMsg(''),2000); };

  const save = () => {
    if (!form.title || !form.url) { showMsg('Title & URL required'); return; }
    const updated = editing === 'NEW' ? [...localPosts, form] : localPosts.map(p => p.id===editing ? form : p);
    setLocalPosts(updated);
    setEditing(null); setForm({});
    showMsg('Saved ✓');
  };

  const del = (id) => {
    if (!confirm('Delete this post?')) return;
    setLocalPosts(localPosts.filter(p=>p.id!==id));
  };

  const platformColor = (p) => ({
    'Medium':'#02b875','Blogger':'#fb923c','Patreon':'#f96854','Substack':'#ff6719','Quora':'#b92b27','LinkedIn':'#0a66c2','Other':'#c084fc'
  }[p] || '#c084fc');

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:800, color:'#f0f0f8', margin:0 }}>Latest Posts</h3>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, margin:'4px 0 0' }}>Articles from Medium, Blogger, Patreon and other platforms — shown on the home page.</p>
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          {msg && <span style={{ fontSize:13, color:'#4ade80' }}>{msg}</span>}
          <ABtn onClick={startNew} variant="primary">+ Add Post</ABtn>
        </div>
      </div>

      {editing && (
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:16, padding:20, marginBottom:18 }}>
          <h4 style={{ color:'#c084fc', margin:'0 0 14px', fontSize:14, fontFamily:"'Space Grotesk',sans-serif" }}>{editing==='NEW' ? 'New Post' : 'Edit Post'}</h4>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
            <AInput label="Title *" value={form.title||''} onChange={v=>setForm({...form,title:v})} placeholder="My latest article" />
            <AInput label="URL *"   value={form.url||''}   onChange={v=>setForm({...form,url:v})}   placeholder="https://medium.com/..." />
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              <label style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:1 }}>Platform</label>
              <select value={form.platform||'Medium'} onChange={e=>setForm({...form,platform:e.target.value})} style={{ padding:'10px 14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, color:'#e8e8f8', fontSize:14, outline:'none' }}>
                {PLATFORMS.map(p => <option key={p} value={p} style={{background:'#0e0e1a'}}>{p}</option>)}
              </select>
            </div>
            <AInput label="Date" value={form.date||''} onChange={v=>setForm({...form,date:v})} type="date" />
            <AInput label="Cover image URL (optional)" value={form.cover||''} onChange={v=>setForm({...form,cover:v})} placeholder="https://..." style={{gridColumn:'1 / -1'}}/>
          </div>
          <ATextarea label="Summary / preview" value={form.summary||''} onChange={v=>setForm({...form,summary:v})} rows={3} placeholder="2–3 line summary that shows on the home page..." />
          <div style={{ display:'flex', gap:10, marginTop:14 }}>
            <ABtn onClick={save} variant="primary">Save Post</ABtn>
            <ABtn onClick={cancel} variant="ghost">Cancel</ABtn>
          </div>
        </div>
      )}

      {localPosts.length === 0 ? (
        <div style={{ padding:'40px', textAlign:'center', color:'rgba(255,255,255,0.3)', fontSize:14, background:'rgba(255,255,255,0.02)', border:'1px dashed rgba(255,255,255,0.08)', borderRadius:14 }}>
          <div style={{ fontSize:36, marginBottom:10 }}>📝</div>
          No posts yet — click "+ Add Post" above to share your latest article.
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {localPosts.map(p => {
            const col = platformColor(p.platform);
            return (
              <div key={p.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 16px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12 }}>
                <div style={{ minWidth:64, padding:'4px 10px', borderRadius:50, background:`${col}22`, border:`1px solid ${col}44`, color:col, fontSize:11, fontWeight:700, textAlign:'center' }}>{p.platform}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:'#e8e8f8' }}>{p.title}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.date} · {p.url}</div>
                </div>
                <a href={p.url} target="_blank" rel="noreferrer" style={{ padding:'5px 10px', background:`${col}22`, border:`1px solid ${col}44`, borderRadius:8, fontSize:11, color:col, textDecoration:'none' }}>Open</a>
                <ABtn onClick={()=>startEdit(p)} variant="ghost" size="sm">Edit</ABtn>
                <ABtn onClick={()=>del(p.id)} variant="danger" size="sm">×</ABtn>
              </div>
            );
          })}
        </div>
      )}
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
function AdminPanel({ onBack, supabase, supabaseUrl, supabaseKey, setSupabaseUrl, setSupabaseKey, onConnectSupabase, localChannels, setLocalChannels, localVideos, setLocalVideos, localSocial, setLocalSocial, localWebsites, setLocalWebsites, localPosts, setLocalPosts }) {
  const [tab, setTab] = React.useState('dashboard');
  const tabs = [
    { id:'dashboard', label:'Dashboard' },
    { id:'channels',  label:'Channels' },
    { id:'videos',    label:'Videos' },
    { id:'import',    label:'📥 Import / Data' },
    { id:'search',    label:'🔎 Search' },
    { id:'lotterysubs', label:'🎰 Lottery Subs' },
    { id:'websites',  label:'🌐 Websites' },
    { id:'posts',     label:'📝 Posts' },
    { id:'social',    label:'Social Links' },
    { id:'config',    label:'⚙ Supabase' },
  ];

  const handleLogout = () => {
    try { localStorage.removeItem('pv_is_admin'); } catch(e){}
    onBack();
  };

  return (
    <div style={{ minHeight:'100vh', background:'#07071280', position:'relative', zIndex:1 }}>
      {/* Top bar */}
      <div style={{ borderBottom:'1px solid rgba(255,255,255,0.08)', padding:'16px 24px', display:'flex', alignItems:'center', gap:16, background:'rgba(0,0,0,0.3)', backdropFilter:'blur(12px)', position:'sticky', top:0, zIndex:100, flexWrap:'wrap' }}>
        <button onClick={onBack} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'6px 14px', color:'rgba(255,255,255,0.6)', cursor:'pointer', fontSize:13 }}>← Public</button>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:16, fontWeight:800, color:'#c084fc' }}>PUJIVERSE ADMIN</div>
        <div style={{ display:'flex', gap:4, marginLeft:12, flex:1, flexWrap:'wrap' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              padding:'6px 12px', borderRadius:8, border:'none', cursor:'pointer', fontSize:12, fontWeight:600,
              background: tab===t.id ? 'rgba(192,132,252,0.15)' : 'transparent',
              color: tab===t.id ? '#c084fc' : 'rgba(255,255,255,0.45)',
              transition:'all 0.15s'
            }}>{t.label}</button>
          ))}
        </div>
        {supabase && <div style={{ fontSize:12, color:'#4ade80', display:'flex', alignItems:'center', gap:5 }}><span style={{ width:7, height:7, borderRadius:'50%', background:'#4ade80', display:'inline-block' }}/>Supabase</div>}
        <button onClick={handleLogout} style={{ padding:'5px 12px', background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:8, color:'#f87171', cursor:'pointer', fontSize:12, fontWeight:600 }}>Logout</button>
      </div>

      {/* Content */}
      <div style={{ maxWidth:1000, margin:'0 auto', padding:'32px 24px' }}>
        {tab === 'dashboard' && <>
          <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:24, fontWeight:800, color:'#f0f0f8', margin:'0 0 8px' }}>Welcome back, Pujith 👋</h2>
          <p style={{ color:'rgba(255,255,255,0.4)', margin:'0 0 28px' }}>Manage your entire Pujiverse network from here.</p>
          <DashStats channels={localChannels} videos={localVideos} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {[{ id:'channels',label:'Manage Channels',icon:'📺',desc:'Edit channel details, playlists, handles and URLs'},
              {id:'videos',label:'Add Videos',icon:'🎬',desc:'Add video links to any channel playlist (with thumbnails)'},
              {id:'lotterysubs',label:'Lottery Subscribers',icon:'🎰',desc:'Per-channel subscriber lists — only admin can add names'},
              {id:'websites',label:'My Websites',icon:'🌐',desc:`Showcase live projects on home page · ${localWebsites.length} added`},
              {id:'posts',label:'Latest Posts',icon:'📝',desc:`Medium / Blogger / Patreon posts · ${localPosts.length} added`},
              {id:'social',label:'Social Links',icon:'🔗',desc:'Update your social media platform links'},
              {id:'config',label:'Supabase Config',icon:'🗄️',desc:'Connect your database for persistent storage'},
              {id:'lottery',label:'Run Live Draw',icon:'🎬',desc:'Open the live lottery draw screen — stream ready',external:'Lottery.html'},
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
        {tab === 'import'      && <ImportTab supabase={supabase} onDataChanged={()=>{ if(window.pvReloadData) window.pvReloadData(); }} />}
        {tab === 'search'      && <SearchTab supabase={supabase} />}
        {tab === 'channels'    && <ChannelsTab supabase={supabase} localChannels={localChannels} setLocalChannels={setLocalChannels} />}
        {tab === 'videos'      && <VideosTab supabase={supabase} localChannels={localChannels} localVideos={localVideos} setLocalVideos={setLocalVideos} />}
        {tab === 'lotterysubs' && <LotterySubsTab localChannels={localChannels} />}
        {tab === 'websites'    && <WebsitesTab localWebsites={localWebsites} setLocalWebsites={setLocalWebsites} />}
        {tab === 'posts'       && <PostsTab localPosts={localPosts} setLocalPosts={setLocalPosts} />}
        {tab === 'social'      && <SocialTab localSocial={localSocial} setLocalSocial={setLocalSocial} />}
        {tab === 'config'      && <ConfigTab supabaseUrl={supabaseUrl} supabaseKey={supabaseKey} setSupabaseUrl={setSupabaseUrl} setSupabaseKey={setSupabaseKey} onConnect={onConnectSupabase} supabase={supabase} localChannels={localChannels} localVideos={localVideos} localSocial={localSocial} localWebsites={localWebsites} localPosts={localPosts} />}
      </div>
    </div>
  );
}

Object.assign(window, { AdminPanel, LoginModal });
 setSupabaseKey={setSupabaseKey} onConnect={onConnectSupabase} supabase={supabase} localChannels={localChannels} localVideos={localVideos} localSocial={localSocial} localWebsites={localWebsites} localPosts={localPosts} />}
      </div>
    </div>
  );
}

Object.assign(window, { AdminPanel, LoginModal });
