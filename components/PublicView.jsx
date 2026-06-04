
// ============================================================
// PUBLIC VIEW COMPONENTS
// ============================================================

// --- Social icon SVGs ---
function SocialIcon({ icon, size = 20 }) {
  const icons = {
    yt: <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/></svg>,
    ig: <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.8.1 3.2.1 4.7 1.7 4.8 4.8.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.1-1.6 4.7-4.8 4.8-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.2-.1-4.7-1.7-4.8-4.8C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-3.2 1.7-4.7 4.8-4.8C8.4 2.2 8.8 2.2 12 2.2zm0-2.2C8.7 0 8.3 0 7.1.1 2.9.3.3 2.9.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 4.2 2.8 6.8 7 7C8.3 24 8.7 24 12 24s3.7 0 4.9-.1c4.2-.2 6.8-2.8 7-7C24 15.7 24 15.3 24 12s0-3.7-.1-4.9c-.2-4.1-2.8-6.8-7-7C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 12 5.8zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z"/></svg>,
    tt: <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor"><path d="M19.6 3.3A4.9 4.9 0 0 1 14.6 0h-3.5v16.5a2.8 2.8 0 1 1-2-2.7V10a6.4 6.4 0 1 0 5.5 6.3V8.4a8.3 8.3 0 0 0 5 1.6V6.5a4.9 4.9 0 0 1-3-.6 4.9 4.9 0 0 1-2.6-2.6h3.6z"/></svg>,
    x:  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor"><path d="M18.9 1h3.5l-7.6 8.7L24 23h-7l-5.5-7.2L5.4 23H2l8.1-9.3L0 1h7.2l5 6.5zm-1.2 19.8h1.9L6.5 2.9H4.4z"/></svg>,
    fb: <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor"><path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4h-3V12h3V9.4c0-3 1.8-4.7 4.5-4.7l2.6.2v3H15.6c-1.4 0-1.8.9-1.8 1.8V12h3.1l-.5 3.5h-2.6v8.4A12 12 0 0 0 24 12z"/></svg>,
    li: <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor"><path d="M20.4 20.4h-3.4v-5.3c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8v5.4H9.8V9h3.3v1.6h.1c.4-.8 1.5-1.8 3.2-1.8 3.4 0 4 2.2 4 5.2v6.4zM5.3 7.4a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm1.7 13H3.6V9h3.4v11.4zM22.2 0H1.8A1.8 1.8 0 0 0 0 1.8v20.4A1.8 1.8 0 0 0 1.8 24h20.4a1.8 1.8 0 0 0 1.8-1.8V1.8A1.8 1.8 0 0 0 22.2 0z"/></svg>,
    pi: <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12c0 5.1 3.1 9.4 7.6 11.2-.1-.9-.2-2.4 0-3.4l1.6-6.7s-.4-.8-.4-2c0-1.9 1.1-3.3 2.5-3.3 1.2 0 1.7.9 1.7 1.9 0 1.2-.7 2.9-1.1 4.5-.3 1.3.6 2.4 1.9 2.4 2.3 0 3.9-2.4 3.9-5.9 0-3.1-2.2-5.2-5.4-5.2-3.7 0-5.8 2.7-5.8 5.6 0 1.1.4 2.3 1 3 .1.1.1.2.1.4l-.4 1.5c-.1.3-.3.4-.6.2-2-1-3.3-4-3.3-6.4C3.2 7.1 7.1 3.6 12.5 3.6c4.3 0 7.7 3.1 7.7 7.2 0 4.3-2.7 7.7-6.4 7.7-1.3 0-2.5-.7-2.9-1.5l-.8 3c-.3 1.1-1 2.5-1.5 3.3.5.2 1.1.2 1.6.2 6.6 0 12-5.4 12-12S18.6 0 12 0z"/></svg>,
    me: <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor"><path d="M13.5 11.7L11.1 4.8 8.7 11.7h4.8zm5.7 7.3h-3l-1.2-3.4H9l-1.2 3.4H4.8L10.5 3H13l6.2 16z"/></svg>,
    ss: <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor"><path d="M22.5 8.1H1.5C.7 8.1 0 7.4 0 6.6V5.4C0 4.6.7 4 1.5 4h21C23.3 4 24 4.6 24 5.4v1.2c0 .8-.7 1.5-1.5 1.5zm-21 3h21C23.3 11.1 24 11.8 24 12.6v5.8c0 2.6-2.1 4.6-4.7 4.6H4.7C2.1 23 0 21 0 18.4v-5.8c0-.8.7-1.5 1.5-1.5z"/></svg>,
    dc: <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor"><path d="M20.3 4.4a19.8 19.8 0 0 0-4.9-1.5.1.1 0 0 0-.1 0 13.5 13.5 0 0 0-.6 1.3 18.3 18.3 0 0 0-5.5 0 13.5 13.5 0 0 0-.6-1.3.1.1 0 0 0-.1 0 19.8 19.8 0 0 0-4.9 1.5.1.1 0 0 0-.1.1C1 9.4.4 14.2 1.5 19a.1.1 0 0 0 .1 0A19.9 19.9 0 0 0 7.4 21a.1.1 0 0 0 .1 0 15 15 0 0 0 1.3-2.1.1.1 0 0 0-.1-.1 13 13 0 0 1-1.9-.9.1.1 0 0 1 0-.1l.4-.3a.1.1 0 0 1 .1 0c4 1.8 8.3 1.8 12.2 0a.1.1 0 0 1 .1 0l.4.3a.1.1 0 0 1 0 .1 12.8 12.8 0 0 1-1.9.9.1.1 0 0 0 0 .1 16.9 16.9 0 0 0 1.3 2.1.1.1 0 0 0 .1 0 19.8 19.8 0 0 0 5.8-2.1.1.1 0 0 0 .1 0c1.3-5.4-.7-10-.9-14.5a.1.1 0 0 0-.1-.1zM8.5 16.1c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4c1.2 0 2.2 1.1 2.2 2.4 0 1.3-1 2.4-2.2 2.4zm7 0c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4c1.2 0 2.2 1.1 2.2 2.4 0 1.3-1 2.4-2.2 2.4z"/></svg>,
    wa: <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9s-.4-.1-.6.1-.7.9-.9 1.1-.3.2-.6 0-1.2-.4-2.3-1.4c-.9-.8-1.4-1.7-1.6-2s0-.5.1-.6l.4-.5.3-.4.1-.4-1-2.3c-.2-.5-.5-.5-.7-.5h-.5c-.2 0-.5.1-.7.3-.3.2-1 1-1 2.4s1 2.8 1.2 3c.2.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.1-1.4l-.5-.2zM12 2.2a9.8 9.8 0 0 0-8.3 15L2 22l4.9-1.6A9.8 9.8 0 1 0 12 2.2zm0 17.8a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20z"/></svg>,
    qu: <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12c1.7 0 3.3-.4 4.8-1.1l-1.4-2.1a9 9 0 0 1-3.4.7A9.1 9.1 0 0 1 2.9 12 9.1 9.1 0 0 1 12 2.9a9.1 9.1 0 0 1 9.1 9.1c0 2.2-.8 4.3-2.2 5.9l1.5 2.2A11.9 11.9 0 0 0 24 12C24 5.4 18.6 0 12 0zm-.5 6.6c-2.3 0-3.9 1.9-3.9 5.4s1.5 5.5 3.9 5.5 3.9-1.9 3.9-5.5-1.6-5.4-3.9-5.4zm0 9c-1.4 0-2.1-1.5-2.1-3.6s.7-3.5 2.1-3.5 2 1.4 2 3.5-.6 3.6-2 3.6z"/></svg>,
    dm: <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm6 12L9 17.2V6.8L18 12z"/></svg>,
  };
  return icons[icon] || <span style={{fontSize:size+'px'}}>●</span>;
}

// --- Channel Card ---
function ChannelCard({ ch, onClick }) {
  const col = CAT_COLORS[ch.cat] || CAT_COLORS["Education"];
  const scoreColor = ch.score >= 90 ? '#4ade80' : ch.score >= 80 ? '#facc15' : '#fb923c';
  return (
    <div onClick={() => onClick(ch)} style={{
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid rgba(255,255,255,0.08)`,
      borderRadius: 16,
      padding: '20px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      position: 'relative',
      overflow: 'hidden',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.border='1px solid rgba(255,255,255,0.18)'; e.currentTarget.style.background='rgba(255,255,255,0.06)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.border='1px solid rgba(255,255,255,0.08)'; e.currentTarget.style.background='rgba(255,255,255,0.03)'; }}
    >
      {/* accent bar */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, ${col.accent}, transparent)` }} />
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
        <span style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:1, color: col.accent, background:`${col.badge}33`, padding:'3px 8px', borderRadius:20 }}>{ch.cat}</span>
        <span style={{ fontSize:13, fontWeight:700, color: scoreColor }}>{ch.score}</span>
      </div>
      <div style={{ fontFamily:"'Space Grotesk', sans-serif", fontSize:16, fontWeight:700, color:'#f0f0f8', marginBottom:4, lineHeight:1.3 }}>{ch.name}</div>
      <div style={{ fontSize:13, color:'rgba(255,255,255,0.45)', marginBottom:14 }}>{ch.handle}</div>
      <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)', marginBottom:16 }}>
        {ch.playlists.length} playlists &nbsp;·&nbsp; {ch.team} member{ch.team>1?'s':''}
      </div>
      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
        <a href={ch.url} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{
          display:'inline-flex', alignItems:'center', gap:6, padding:'6px 12px',
          background:'rgba(255,0,0,0.15)', border:'1px solid rgba(255,0,0,0.3)',
          borderRadius:8, fontSize:12, color:'#ff6b6b', textDecoration:'none', fontWeight:600
        }}>
          <SocialIcon icon="yt" size={13}/> YouTube
        </a>
        <span style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginLeft:'auto' }}>View playlists →</span>
      </div>
    </div>
  );
}

// --- Helper: Extract YouTube video ID from any YouTube URL ---
function ytId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

// --- Helper: Build a YouTube search URL for a playlist title (fallback when no direct URL) ---
function plSearchUrl(channel, plTitle) {
  return `https://www.youtube.com/${channel.handle}/search?query=${encodeURIComponent(plTitle)}`;
}

// --- Playlist Modal ---
function PlaylistModal({ ch, onClose, videos }) {
  const col = CAT_COLORS[ch.cat] || CAT_COLORS["Education"];
  const [selPl, setSelPl] = React.useState(null);
  const plVideos = selPl !== null ? (videos[ch.sno]?.[selPl] || []) : [];

  React.useEffect(() => {
    const onKey = (e) => { if(e.key==='Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:1000,
      display:'flex', alignItems:'center', justifyContent:'center', padding:24,
      backdropFilter:'blur(8px)'
    }} onClick={onClose}>
      <div style={{
        background:'#0e0e1a', border:'1px solid rgba(255,255,255,0.12)',
        borderRadius:24, width:'100%', maxWidth:880, maxHeight:'88vh',
        overflow:'auto', padding:32
      }} onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24, gap:16, flexWrap:'wrap' }}>
          <div>
            <div style={{ display:'inline-block', fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:1, color:col.accent, background:`${col.badge}33`, padding:'3px 10px', borderRadius:20, marginBottom:8 }}>{ch.cat}</div>
            <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:24, fontWeight:800, color:'#f0f0f8', margin:'0 0 4px' }}>{ch.name}</h2>
            <span style={{ color:'rgba(255,255,255,0.4)', fontSize:14 }}>{ch.handle}</span>
          </div>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <a href={ch.url} target="_blank" rel="noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 16px', background:'rgba(255,0,0,0.15)', border:'1px solid rgba(255,0,0,0.3)', borderRadius:10, fontSize:13, color:'#ff6b6b', textDecoration:'none', fontWeight:600 }}>
              <SocialIcon icon="yt" size={14}/> Open Channel
            </a>
            <a href={`${ch.url}/playlists`} target="_blank" rel="noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 16px', background:`${col.badge}33`, border:`1px solid ${col.accent}55`, borderRadius:10, fontSize:13, color:col.accent, textDecoration:'none', fontWeight:600 }}>
              All Playlists ↗
            </a>
            <button onClick={onClose} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, width:38, height:38, color:'rgba(255,255,255,0.6)', cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
          </div>
        </div>

        {/* Playlists */}
        <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:14, fontWeight:600, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1, marginBottom:14 }}>Playlists ({ch.playlists.length})</h3>
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom: selPl!==null ? 24 : 0 }}>
          {ch.playlists.map((pl, i) => {
            const vCount = (videos[ch.sno]?.[i] || []).length;
            const isOpen = selPl===i;
            // Use first video URL as a representative cover thumbnail
            const firstVid = (videos[ch.sno]?.[i] || [])[0];
            const coverId = firstVid ? ytId(firstVid.url) : null;
            return (
              <div key={i} style={{
                background: isOpen ? `${col.badge}22` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isOpen ? col.accent+'44' : 'rgba(255,255,255,0.07)'}`,
                borderRadius:12, transition:'all 0.15s', overflow:'hidden'
              }}>
                <div onClick={() => setSelPl(isOpen ? null : i)} style={{
                  display:'flex', alignItems:'center', gap:12, padding:'14px 16px', cursor:'pointer'
                }}>
                  {coverId ? (
                    <div style={{ width:60, height:34, borderRadius:6, background:`url(https://img.youtube.com/vi/${coverId}/mqdefault.jpg) center/cover, ${col.badge}33`, flexShrink:0, position:'relative' }}>
                      <div style={{ position:'absolute', inset:0, borderRadius:6, background:'rgba(0,0,0,0.25)' }}/>
                    </div>
                  ) : (
                    <div style={{ width:36, height:36, borderRadius:8, background:`${col.badge}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:col.accent, flexShrink:0 }}>{i+1}</div>
                  )}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:600, color:'#e8e8f8' }}>{pl}</div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:2 }}>{vCount} video{vCount!==1?'s':''}</div>
                  </div>
                  <a href={plSearchUrl(ch, pl)} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} title="Open this playlist on YouTube"
                     style={{ padding:'4px 10px', background:'rgba(255,0,0,0.12)', border:'1px solid rgba(255,0,0,0.25)', borderRadius:8, fontSize:11, color:'#ff6b6b', textDecoration:'none', whiteSpace:'nowrap' }}>
                    ▶ Open
                  </a>
                  <span style={{ color:'rgba(255,255,255,0.3)', fontSize:12, marginLeft:6 }}>{isOpen ? '▲' : '▼'}</span>
                </div>

                {/* Inline videos when expanded — YouTube-style cards with thumbnails */}
                {isOpen && (
                  <div style={{ padding:'4px 14px 14px' }}>
                    {vCount === 0 ? (
                      <div style={{ marginTop:8, padding:'18px 16px', background:'rgba(255,255,255,0.02)', borderRadius:10, fontSize:13, color:'rgba(255,255,255,0.35)', textAlign:'center' }}>
                        No videos added yet — admin can add them from the dashboard
                      </div>
                    ) : (
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:10 }}>
                        {plVideos.map((v, vi) => {
                          const id = ytId(v.url);
                          return (
                            <a key={vi} href={v.url} target="_blank" rel="noreferrer" style={{ display:'flex', flexDirection:'column', gap:8, padding:8, background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:10, textDecoration:'none', transition:'all 0.15s' }}
                              onMouseEnter={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.transform='translateY(-2px)';}}
                              onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.025)'; e.currentTarget.style.transform='translateY(0)';}}>
                              <div style={{ aspectRatio:'16/9', borderRadius:8, background: id ? `url(https://img.youtube.com/vi/${id}/mqdefault.jpg) center/cover` : `${col.badge}33`, position:'relative', overflow:'hidden' }}>
                                <div style={{ position:'absolute', bottom:6, right:6, padding:'2px 6px', borderRadius:4, background:'rgba(0,0,0,0.75)', color:'#fff', fontSize:10, fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>
                                  <SocialIcon icon="yt" size={9}/> YT
                                </div>
                              </div>
                              <div style={{ fontSize:12, fontWeight:600, color:'#d0d0e8', lineHeight:1.4, display:'-webkit-box', WebkitBoxOrient:'vertical', WebkitLineClamp:2, overflow:'hidden' }}>{v.title}</div>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// --- Lottery Widget (compact, on main page) ---
function LotteryWidget() {
  const [history, setHistory] = React.useState([]);
  const [counts, setCounts] = React.useState([]);

  React.useEffect(() => {
    try { setHistory(JSON.parse(localStorage.getItem('pv_lot_history') || '[]')); } catch { setHistory([]); }
    // Build per-channel sub counts
    const c = (typeof CHANNELS !== 'undefined' ? CHANNELS : []).map(ch => {
      try { return { sno:ch.sno, name:ch.name, cat:ch.cat, count:(JSON.parse(localStorage.getItem('pv_lot_subs_'+ch.sno) || '[]')).length }; }
      catch { return { sno:ch.sno, name:ch.name, cat:ch.cat, count:0 }; }
    });
    setCounts(c);
  }, []);

  const totalSubs = counts.reduce((a,c)=>a+c.count, 0);
  const activeChannels = counts.filter(c=>c.count>0).length;
  const lastDraw = history[history.length-1];
  const top5 = [...counts].sort((a,b)=>b.count-a.count).slice(0,5).filter(c=>c.count>0);

  return (
    <div style={{ maxWidth:1100, margin:'0 auto', padding:'24px 24px 56px' }}>
      <div style={{ background:'linear-gradient(135deg, rgba(192,132,252,0.08), rgba(34,211,238,0.05))', border:'1px solid rgba(192,132,252,0.18)', borderRadius:24, padding:'28px 32px', position:'relative', overflow:'hidden' }}>
        {/* Decorative glow */}
        <div style={{ position:'absolute', top:-40, right:-40, width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle, rgba(192,132,252,0.15), transparent 70%)', pointerEvents:'none' }}/>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:16, marginBottom:18, position:'relative' }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'4px 12px', borderRadius:50, background:'rgba(192,132,252,0.15)', border:'1px solid rgba(192,132,252,0.3)', marginBottom:10 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#c084fc', boxShadow:'0 0 10px #c084fc' }}/>
              <span style={{ fontSize:11, fontWeight:700, color:'#c084fc', letterSpacing:2, textTransform:'uppercase' }}>Lottery System</span>
            </div>
            <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:28, fontWeight:900, color:'#f0f0f8', margin:'0 0 6px' }}>Subscriber Draw — Per Channel</h2>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:14, margin:0, maxWidth:520 }}>Each channel has its own private subscriber pool. Subscribers are added by the admin only — no double entries, no gaming the system. Watch the live draw or check past winners.</p>
          </div>
          <a href="Lottery.html" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'12px 22px', background:'linear-gradient(135deg, #c084fc, #f472b6)', border:'none', borderRadius:14, color:'#0a0a15', fontSize:14, fontWeight:800, textDecoration:'none', boxShadow:'0 6px 22px rgba(192,132,252,0.35)' }}>🎰 Open Lottery →</a>
        </div>

        {/* Stats row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12, marginBottom:18, position:'relative' }}>
          <div style={{ padding:'14px 18px', background:'rgba(255,255,255,0.03)', borderRadius:12, border:'1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:24, fontWeight:800, color:'#c084fc' }}>{totalSubs}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1 }}>Total subs</div>
          </div>
          <div style={{ padding:'14px 18px', background:'rgba(255,255,255,0.03)', borderRadius:12, border:'1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:24, fontWeight:800, color:'#22d3ee' }}>{activeChannels}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1 }}>Active channels</div>
          </div>
          <div style={{ padding:'14px 18px', background:'rgba(255,255,255,0.03)', borderRadius:12, border:'1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:24, fontWeight:800, color:'#4ade80' }}>{history.length}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1 }}>Past draws</div>
          </div>
        </div>

        {/* Latest winner + top channels */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, position:'relative' }}>
          <div style={{ padding:'14px 18px', background:'rgba(74,222,128,0.06)', borderRadius:12, border:'1px solid rgba(74,222,128,0.18)' }}>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>🏆 Latest Winner</div>
            {lastDraw && lastDraw.winners?.[0] ? (
              <>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:18, fontWeight:800, color:'#4ade80' }}>{lastDraw.winners[0].name}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:2 }}>{lastDraw.channel} · {lastDraw.date}</div>
              </>
            ) : (
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>No draws yet — first one is waiting to happen!</div>
            )}
          </div>
          <div style={{ padding:'14px 18px', background:'rgba(255,255,255,0.03)', borderRadius:12, border:'1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>📊 Top channels (subs)</div>
            {top5.length === 0 ? (
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>No subscriber pools loaded yet</div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                {top5.map(c => (
                  <div key={c.sno} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:12 }}>
                    <span style={{ color:'rgba(255,255,255,0.7)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.name}</span>
                    <span style={{ color:'#c084fc', fontWeight:700, marginLeft:8 }}>{c.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Websites / Projects Section ---
function ProjectsSection({ websites }) {
  if (!websites || websites.length === 0) return null;
  return (
    <div style={{ maxWidth:1100, margin:'0 auto', padding:'24px 24px 56px' }}>
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:12, fontWeight:600, letterSpacing:3, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6 }}>Built by Pujiverse</div>
        <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:28, fontWeight:900, color:'#f0f0f8', margin:0 }}>My Projects</h2>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:14, margin:'4px 0 0' }}>Live websites & apps deployed on Vercel and beyond</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
        {websites.map(w => {
          const accent = w.accent || '#22d3ee';
          // Auto-generated thumbnail via image.thum.io (free, no key)
          const cleanUrl = (w.url||'').replace(/^https?:\/\//,'');
          const thumb = cleanUrl ? `https://image.thum.io/get/width/600/crop/450/${w.url}` : '';
          return (
            <a key={w.id} href={w.url} target="_blank" rel="noreferrer" style={{
              display:'block', textDecoration:'none', background:'rgba(255,255,255,0.03)',
              border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, overflow:'hidden',
              transition:'all 0.2s'
            }}
            onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.border=`1px solid ${accent}55`; e.currentTarget.style.boxShadow=`0 12px 36px ${accent}22`; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.border='1px solid rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow='none'; }}>
              <div style={{ aspectRatio:'4/3', background:`linear-gradient(135deg, ${accent}33, rgba(0,0,0,0.4)), url(${thumb}) center/cover, ${accent}22`, position:'relative' }}>
                <div style={{ position:'absolute', top:10, right:10, padding:'3px 10px', borderRadius:50, background:'rgba(74,222,128,0.18)', border:'1px solid rgba(74,222,128,0.35)', color:'#4ade80', fontSize:10, fontWeight:700, letterSpacing:1, textTransform:'uppercase', display:'inline-flex', alignItems:'center', gap:5 }}>
                  <span style={{ width:5, height:5, borderRadius:'50%', background:'#4ade80', boxShadow:'0 0 6px #4ade80' }}/> Live
                </div>
              </div>
              <div style={{ padding:'16px 18px' }}>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:16, fontWeight:700, color:'#f0f0f8', marginBottom:4 }}>{w.title}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginBottom:10, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{cleanUrl}</div>
                {w.description && <div style={{ fontSize:13, color:'rgba(255,255,255,0.55)', lineHeight:1.5, marginBottom:12 }}>{w.description}</div>}
                {(w.tags||[]).length > 0 && (
                  <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                    {(w.tags||[]).map((t,i) => (
                      <span key={i} style={{ padding:'2px 9px', borderRadius:50, background:`${accent}18`, border:`1px solid ${accent}33`, color:accent, fontSize:11, fontWeight:600 }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

// --- Posts (Medium/Blogger/Patreon) Section ---
function PostsSection({ posts }) {
  if (!posts || posts.length === 0) return null;
  const platformColor = (p) => ({
    'Medium':'#02b875','Blogger':'#fb923c','Patreon':'#f96854','Substack':'#ff6719','Quora':'#b92b27','LinkedIn':'#0a66c2','Other':'#c084fc'
  }[p] || '#c084fc');

  return (
    <div style={{ maxWidth:1100, margin:'0 auto', padding:'24px 24px 56px' }}>
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:12, fontWeight:600, letterSpacing:3, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6 }}>Reading & Writing</div>
        <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:28, fontWeight:900, color:'#f0f0f8', margin:0 }}>Latest Posts</h2>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:14, margin:'4px 0 0' }}>Articles from Medium, Blogger, Patreon and more</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:16 }}>
        {posts.map(p => {
          const col = platformColor(p.platform);
          return (
            <a key={p.id} href={p.url} target="_blank" rel="noreferrer" style={{
              display:'block', textDecoration:'none', background:'rgba(255,255,255,0.03)',
              border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, overflow:'hidden',
              transition:'all 0.2s'
            }}
            onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.border=`1px solid ${col}55`; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.border='1px solid rgba(255,255,255,0.08)'; }}>
              {p.cover && (
                <div style={{ aspectRatio:'16/9', background:`url(${p.cover}) center/cover, ${col}22` }}/>
              )}
              <div style={{ padding:'16px 18px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                  <span style={{ padding:'2px 10px', borderRadius:50, background:`${col}22`, border:`1px solid ${col}44`, color:col, fontSize:11, fontWeight:700 }}>{p.platform}</span>
                  {p.date && <span style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>{p.date}</span>}
                </div>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:16, fontWeight:700, color:'#f0f0f8', marginBottom:6, lineHeight:1.35 }}>{p.title}</div>
                {p.summary && <div style={{ fontSize:13, color:'rgba(255,255,255,0.55)', lineHeight:1.55, display:'-webkit-box', WebkitBoxOrient:'vertical', WebkitLineClamp:3, overflow:'hidden' }}>{p.summary}</div>}
                <div style={{ marginTop:12, fontSize:12, color:col, fontWeight:600 }}>Read on {p.platform} →</div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

// --- Stars background ---
function StarField() {
  const stars = React.useMemo(() => Array.from({length:120}, (_,i) => ({
    id:i, x: Math.random()*100, y: Math.random()*100,
    s: Math.random()*2+0.5, o: Math.random()*0.6+0.1, d: Math.random()*4+2
  })), []);
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, overflow:'hidden' }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position:'absolute', left:`${s.x}%`, top:`${s.y}%`,
          width:s.s, height:s.s, borderRadius:'50%',
          background:'white', opacity:s.o,
          animation:`twinkle ${s.d}s ease-in-out infinite alternate`,
          animationDelay:`${Math.random()*4}s`
        }}/>
      ))}
    </div>
  );
}

// --- Main Public View ---
function PublicView({ onAdminClick, videos, websites = [], posts = [] }) {
  const [search, setSearch] = React.useState('');
  const [cat, setCat] = React.useState('All');
  const [selectedCh, setSelectedCh] = React.useState(null);
  const [showAllSocial, setShowAllSocial] = React.useState(false);

  const filtered = CHANNELS.filter(ch => {
    const q = search.toLowerCase();
    const matchQ = !q || ch.name.toLowerCase().includes(q) || ch.handle.toLowerCase().includes(q) || ch.playlists.some(p => p.toLowerCase().includes(q));
    const matchCat = cat === 'All' || ch.cat === cat;
    return matchQ && matchCat;
  });

  const socialShown = showAllSocial ? SOCIAL_LINKS : SOCIAL_LINKS.slice(0,8);

  return (
    <div style={{ minHeight:'100vh', background:'#07071280', position:'relative', zIndex:1 }}>
      {/* HERO */}
      <div style={{ textAlign:'center', padding:'80px 24px 48px', position:'relative' }}>
        <div
          id="logo-click-target"
          style={{ display:'inline-block', cursor:'default', userSelect:'none' }}
        >
          <div style={{ fontSize:13, fontWeight:600, letterSpacing:4, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:16 }}>Welcome to</div>
          <h1 style={{
            fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(48px,8vw,96px)',
            fontWeight:900, margin:0, lineHeight:1,
            background:'linear-gradient(135deg, #22d3ee 0%, #c084fc 50%, #f472b6 100%)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            backgroundClip:'text'
          }}>PUJIVERSE</h1>
        </div>
        <p style={{ color:'rgba(255,255,255,0.45)', fontSize:18, maxWidth:580, margin:'20px auto 0', lineHeight:1.7 }}>
          37 YouTube channels · 185 playlists · One universe of content
        </p>
        {/* Stats row */}
        <div style={{ display:'flex', gap:32, justifyContent:'center', flexWrap:'wrap', marginTop:36 }}>
          {[['37','Channels'],['185','Playlists'],['11','Categories'],['LIVE','Status']].map(([val,label]) => (
            <div key={label} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:28, fontWeight:800, color:'#e0e0f8' }}>{val}</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:1 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SOCIAL BAR */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px 48px' }}>
        <div style={{ textAlign:'center', marginBottom:16 }}>
          <span style={{ fontSize:12, fontWeight:600, letterSpacing:2, color:'rgba(255,255,255,0.3)', textTransform:'uppercase' }}>Follow Pujiverse Everywhere</span>
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center' }}>
          {socialShown.map(s => (
            <a key={s.platform} href={s.url} target="_blank" rel="noreferrer" style={{
              display:'inline-flex', alignItems:'center', gap:7, padding:'8px 14px',
              background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)',
              borderRadius:50, fontSize:13, color: s.color, textDecoration:'none',
              fontWeight:500, transition:'all 0.15s', whiteSpace:'nowrap'
            }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.09)'; e.currentTarget.style.transform='translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.transform='translateY(0)'; }}>
              <SocialIcon icon={s.icon} size={15}/> {s.platform}
            </a>
          ))}
          <button onClick={() => setShowAllSocial(!showAllSocial)} style={{
            padding:'8px 16px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)',
            borderRadius:50, fontSize:13, color:'rgba(255,255,255,0.5)', cursor:'pointer'
          }}>{showAllSocial ? 'Show less' : `+${SOCIAL_LINKS.length-8} more`}</button>
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px 24px' }}>
        <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:20 }}>
          <input
            value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search channels, playlists..."
            style={{ flex:1, minWidth:200, padding:'12px 18px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, color:'#e8e8f8', fontSize:14, outline:'none', fontFamily:'Inter,sans-serif' }}
          />
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', alignSelf:'center', whiteSpace:'nowrap' }}>{filtered.length} channel{filtered.length!==1?'s':''}</div>
        </div>
        {/* Category pills */}
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {ALL_CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              padding:'6px 14px', borderRadius:50, fontSize:12, fontWeight:600, cursor:'pointer',
              border: cat===c ? 'none' : '1px solid rgba(255,255,255,0.1)',
              background: cat===c ? 'linear-gradient(135deg,#22d3ee,#c084fc)' : 'rgba(255,255,255,0.04)',
              color: cat===c ? '#0a0a15' : 'rgba(255,255,255,0.55)',
              transition:'all 0.15s'
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* CHANNEL GRID */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px 56px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
          {filtered.map(ch => <ChannelCard key={ch.sno} ch={ch} onClick={setSelectedCh} />)}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'80px 0', color:'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize:40, marginBottom:16 }}>🔭</div>
            <div style={{ fontSize:16 }}>No channels found</div>
          </div>
        )}
      </div>

      {/* PROJECTS / WEBSITES SECTION */}
      <ProjectsSection websites={websites} />

      {/* POSTS (BLOGS) SECTION */}
      <PostsSection posts={posts} />

      {/* LOTTERY WIDGET */}
      <LotteryWidget />

      {/* FOOTER */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', padding:'32px 24px', textAlign:'center' }}>
        <div style={{ color:'rgba(255,255,255,0.25)', fontSize:13 }}>
          © 2026 Pujiverse — All rights reserved &nbsp;·&nbsp;
          <a href="mailto:pujiverse@gmail.com" style={{ color:'rgba(255,255,255,0.35)', textDecoration:'none' }}>pujiverse@gmail.com</a>
          &nbsp;·&nbsp;
          <a href="Lottery.html" style={{ color:'rgba(192,132,252,0.6)', textDecoration:'none', fontWeight:600 }}>🎰 Lottery</a>
          &nbsp;·&nbsp;
          {/* SECRET ADMIN BUTTON - invisible, triple-click on logo triggers it */}
          <span
            id="secret-admin-btn"
            style={{ color:'transparent', userSelect:'none', cursor:'default' }}
            onClick={onAdminClick}
          >·</span>
        </div>
      </div>

      {/* Modal */}
      {selectedCh && <PlaylistModal ch={selectedCh} onClose={() => setSelectedCh(null)} videos={videos} />}
    </div>
  );
}

Object.assign(window, { PublicView, SocialIcon, LotteryWidget, ProjectsSection, PostsSection });
