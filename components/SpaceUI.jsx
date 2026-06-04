// ============================================================
// PUJIVERSE NETWORK — SPACE / SOLAR-SYSTEM UI
// Solar system view + rocket cursor + channel pages with moons
// ============================================================

// ---------- Rocket cursor ----------
function RocketCursor() {
  const ref = React.useRef(null);
  const pos = React.useRef({ x: 0, y: 0, px: 0, py: 0 });

  React.useEffect(() => {
    const el = ref.current;
    let raf;
    const move = (e) => {
      pos.current.px = pos.current.x;
      pos.current.py = pos.current.y;
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
    };
    const tick = () => {
      const p = pos.current;
      const dx = p.x - p.px, dy = p.y - p.py;
      const ang = Math.atan2(dy, dx) * 180 / Math.PI + 90;
      if (el) el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${ang}deg)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', move);
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf); };
  }, []);

  // hide on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null;

  return (
    <div ref={ref} style={{
      position: 'fixed', top: 0, left: 0, width: 0, height: 0,
      pointerEvents: 'none', zIndex: 9999, marginLeft: -14, marginTop: -14,
      transition: 'transform 0.05s linear',
    }}>
      <svg width="28" height="28" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 0 6px #22d3ee)' }}>
        <path d="M12 2c2.5 2 4 5.5 4 9 0 1.4-.3 2.7-.8 3.9L12 22l-3.2-7.1A9.8 9.8 0 0 1 8 11c0-3.5 1.5-7 4-9z" fill="#e8e8f8"/>
        <circle cx="12" cy="9.5" r="1.6" fill="#22d3ee"/>
        <path d="M8.5 13l-2 3 3-1zM15.5 13l2 3-3-1z" fill="#c084fc"/>
        <path d="M10.4 18h3.2l-1.6 4z" fill="#fb923c"/>
      </svg>
    </div>
  );
}

// ---------- Animated starfield (canvas) ----------
function CosmicCanvas() {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    let w, h, stars = [], raf;
    const resize = () => {
      w = cv.width = window.innerWidth; h = cv.height = window.innerHeight;
      stars = Array.from({ length: Math.min(220, Math.floor(w * h / 9000)) }, () => ({
        x: Math.random() * w, y: Math.random() * h, z: Math.random() * 1.5 + 0.3,
        tw: Math.random() * Math.PI * 2,
      }));
    };
    resize();
    window.addEventListener('resize', resize);
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.tw += 0.02;
        const a = 0.4 + Math.sin(s.tw) * 0.4;
        ctx.fillStyle = `rgba(255,255,255,${a * s.z})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.z, 0, 7); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />;
}

// ---------- Solar System (home) ----------
function SolarSystem({ channels, onOpenChannel, onAdminClick }) {
  const cats = ALL_CATEGORIES.filter(c => c !== 'All');
  const [filter, setFilter] = React.useState('All');
  const list = filter === 'All' ? channels : channels.filter(c => c.cat === filter);

  // arrange channels in concentric orbits
  const rings = [];
  const perRing = [6, 10, 14, 18, 22];
  let idx = 0;
  let ring = 0;
  while (idx < list.length) {
    const count = perRing[Math.min(ring, perRing.length - 1)];
    rings.push(list.slice(idx, idx + count));
    idx += count; ring++;
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Top bar */}
      <div style={{ position: 'relative', zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 26 }}>🪐</span>
          <div>
            <div id="logo-click-target" style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 900, fontSize: 22, letterSpacing: 1, background: 'linear-gradient(90deg,#22d3ee,#c084fc,#fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer' }}>PUJIVERSE</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 3 }}>NETWORK · {channels.length} WORLDS</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{
            padding: '8px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 10, color: '#e8e8f8', fontSize: 13, outline: 'none', cursor: 'pointer'
          }}>
            <option value="All">All galaxies</option>
            {cats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Hint */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 5, marginTop: 4, marginBottom: -8 }}>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>Click a planet to enter its channel world →</span>
      </div>

      {/* Orbit system */}
      <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 120px)', minHeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: 0, height: 0 }}>
          {/* Sun */}
          <div title="Pujiverse Network" style={{
            position: 'absolute', width: 86, height: 86, borderRadius: '50%', left: -43, top: -43,
            background: 'radial-gradient(circle at 35% 35%, #fff6d5, #fbbf24 40%, #f97316 75%, #b91c1c)',
            boxShadow: '0 0 60px 18px rgba(251,146,60,0.5), 0 0 120px 40px rgba(249,115,22,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3,
            fontFamily: "'Space Grotesk',sans-serif", fontWeight: 900, fontSize: 11, color: '#7c2d12', textAlign: 'center', lineHeight: 1.1
          }}>PUJI<br />VERSE</div>

          {rings.map((rch, ri) => {
            const radius = 130 + ri * 95;
            const dur = 60 + ri * 24; // seconds per revolution
            return (
              <React.Fragment key={ri}>
                {/* orbit ring */}
                <div style={{
                  position: 'absolute', width: radius * 2, height: radius * 2, left: -radius, top: -radius,
                  border: '1px solid rgba(255,255,255,0.07)', borderRadius: '50%', pointerEvents: 'none'
                }} />
                {/* rotating layer */}
                <div className="pv-orbit" style={{ position: 'absolute', left: 0, top: 0, animation: `pvspin ${dur}s linear infinite` }}>
                  {rch.map((ch, pi) => {
                    const ang = (pi / rch.length) * Math.PI * 2;
                    const x = Math.cos(ang) * radius, y = Math.sin(ang) * radius;
                    return <Planet key={ch.sno} ch={ch} x={x} y={y} counterDur={dur} onClick={() => onOpenChannel(ch)} />;
                  })}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes pvspin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
        @keyframes pvspinrev { from { transform: rotate(0deg);} to { transform: rotate(-360deg);} }
        .pv-orbit:hover { animation-play-state: paused !important; }
      `}</style>
    </div>
  );
}

function Planet({ ch, x, y, counterDur, onClick }) {
  const col = CAT_COLORS[ch.cat] || CAT_COLORS['Education'];
  const accent = col.accent;
  const size = 34 + (ch.score - 77) * 0.7; // bigger score => bigger planet
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ position: 'absolute', left: x, top: y, width: 0, height: 0, cursor: 'pointer', zIndex: hover ? 8 : 4 }}
    >
      {/* counter-rotate so label stays upright */}
      <div style={{ animation: `pvspinrev ${counterDur}s linear infinite`, position: 'absolute', left: -size / 2, top: -size / 2 }}>
        <div style={{
          width: size, height: size, borderRadius: '50%',
          background: `radial-gradient(circle at 32% 30%, #ffffff55, ${accent} 45%, ${col.badge})`,
          boxShadow: hover ? `0 0 22px 5px ${accent}aa` : `0 0 12px 2px ${accent}55`,
          border: '1px solid rgba(255,255,255,0.25)', transition: 'box-shadow .2s, transform .2s',
          transform: hover ? 'scale(1.25)' : 'scale(1)',
        }} />
        <div style={{
          position: 'absolute', top: size + 4, left: '50%', transform: 'translateX(-50%)',
          whiteSpace: 'nowrap', fontSize: 10.5, fontWeight: 600,
          color: hover ? accent : 'rgba(255,255,255,0.55)', pointerEvents: 'none',
          background: hover ? 'rgba(7,7,15,0.85)' : 'transparent', padding: hover ? '2px 6px' : 0, borderRadius: 6,
        }}>{ch.name.replace(/^Pujiverse\s*/i, '').replace(/^PUJIVERSE\s*/i, '') || ch.name}</div>
      </div>
    </div>
  );
}

// ---------- Channel page (planet zoomed, with moons) ----------
function ChannelWorld({ ch, data, onBack, onOpenPlaylists }) {
  const col = CAT_COLORS[ch.cat] || CAT_COLORS['Education'];
  const accent = col.accent;
  const [moon, setMoon] = React.useState('overview');

  const videos = (data.videos || []).filter(v => v.channel_sno === ch.sno);
  const popular = videos.filter(v => v.is_popular).concat(
    videos.filter(v => !v.is_popular).slice().sort((a, b) => (b.views || 0) - (a.views || 0))
  ).slice(0, 8);
  const recent = videos.filter(v => v.status === 'published').slice().sort((a, b) => new Date(b.scheduled_at || b.created_at || 0) - new Date(a.scheduled_at || a.created_at || 0)).slice(0, 8);
  const upcoming = videos.filter(v => v.status === 'upcoming');
  const anns = (data.announcements || []).filter(a => !a.channel_sno || a.channel_sno === ch.sno);
  const posts = (data.posts || []).filter(p => p.channel_sno === ch.sno);
  const lottery = (data.lottery_entries || []).filter(l => l.channel_sno === ch.sno);

  const moons = [
    { id: 'overview', label: 'Activity', icon: '📡' },
    { id: 'videos', label: 'Videos', icon: '🎬' },
    { id: 'recent', label: 'Recently Uploaded', icon: '🆕' },
    { id: 'popular', label: 'Popular', icon: '🔥' },
    { id: 'posts', label: 'Posts', icon: '📝' },
    { id: 'announcements', label: 'Announcements', icon: '📣' },
    { id: 'lottery', label: 'Lottery', icon: '🎰' },
  ];

  return (
    <div style={{ position: 'relative', minHeight: '100vh', zIndex: 5 }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 28px', flexWrap: 'wrap' }}>
        <button onClick={onBack} style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#e8e8f8',
          borderRadius: 10, padding: '8px 14px', cursor: 'pointer', fontSize: 13
        }}>← Solar system</button>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: `radial-gradient(circle at 32% 30%, #ffffff66, ${accent} 45%, ${col.badge})`,
          boxShadow: `0 0 24px 6px ${accent}66`, flexShrink: 0
        }} />
        <div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 24 }}>{ch.name}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{ch.handle} · {ch.cat} · score {ch.score}</div>
        </div>
        <a href={ch.url} target="_blank" rel="noreferrer" style={{
          marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px',
          background: 'rgba(255,0,0,0.15)', border: '1px solid rgba(255,0,0,0.3)', borderRadius: 10,
          fontSize: 13, color: '#ff6b6b', textDecoration: 'none', fontWeight: 600
        }}>▶ Open on YouTube</a>
      </div>

      {/* moon selector — orbiting chips */}
      <div style={{ display: 'flex', gap: 10, padding: '0 28px 20px', flexWrap: 'wrap' }}>
        {moons.map(m => (
          <button key={m.id} onClick={() => setMoon(m.id)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 15px', cursor: 'pointer',
            borderRadius: 999, fontSize: 13, fontWeight: 600,
            background: moon === m.id ? `${accent}22` : 'rgba(255,255,255,0.04)',
            border: `1px solid ${moon === m.id ? accent : 'rgba(255,255,255,0.1)'}`,
            color: moon === m.id ? accent : 'rgba(255,255,255,0.7)', transition: 'all .15s'
          }}>
            <span>{m.icon}</span>{m.label}
            <span style={{ opacity: 0.6, fontSize: 11 }}>{moonCount(m.id, { videos, recent, popular, posts, anns, lottery, upcoming })}</span>
          </button>
        ))}
      </div>

      {/* content panel */}
      <div style={{ padding: '0 28px 80px', animation: 'fadeIn .3s ease' }}>
        {moon === 'overview' && <ChannelOverview ch={ch} accent={accent} videos={videos} upcoming={upcoming} anns={anns} posts={posts} lottery={lottery} onOpenPlaylists={onOpenPlaylists} />}
        {moon === 'videos' && <VideoGrid videos={videos} accent={accent} empty="No videos imported yet. Add them in the Excel workbook." />}
        {moon === 'recent' && <VideoGrid videos={recent} accent={accent} empty="No recently uploaded videos." />}
        {moon === 'popular' && <VideoGrid videos={popular} accent={accent} empty="No popular videos flagged. Set is_popular=TRUE in Excel." />}
        {moon === 'posts' && <PostList posts={posts} accent={accent} />}
        {moon === 'announcements' && <AnnList anns={anns} accent={accent} />}
        {moon === 'lottery' && <LotteryPanel entries={lottery} accent={accent} />}
      </div>
    </div>
  );
}

function moonCount(id, d) {
  const m = { overview: '', videos: d.videos.length, recent: d.recent.length, popular: d.popular.length, posts: d.posts.length, announcements: d.anns.length, lottery: d.lottery.length };
  return m[id] === '' ? '' : `· ${m[id]}`;
}

function Card({ children, accent, style }) {
  return <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 18, ...style }}>{children}</div>;
}

function Stat({ label, value, accent }) {
  return (
    <Card accent={accent} style={{ flex: '1 1 140px', minWidth: 140 }}>
      <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", color: accent }}>{value}</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>{label}</div>
    </Card>
  );
}

function ChannelOverview({ ch, accent, videos, upcoming, anns, posts, lottery, onOpenPlaylists }) {
  const totalViews = videos.reduce((s, v) => s + (v.views || 0), 0);
  const topPl = analyzePlaylists(ch, videos);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* stats */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <Stat label="Videos" value={videos.length} accent={accent} />
        <Stat label="Total views" value={fmt(totalViews)} accent={accent} />
        <Stat label="Upcoming" value={upcoming.length} accent={accent} />
        <Stat label="Posts" value={posts.length} accent={accent} />
        <Stat label="Lottery entries" value={lottery.length} accent={accent} />
        <Stat label="Playlists" value={ch.playlists.length} accent={accent} />
      </div>

      {/* popular content analysis */}
      <Card accent={accent}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>🔥 Popular content analysis</div>
        {topPl.length === 0 ? (
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>Import videos with view counts to unlock analysis. Showing channel playlists:
            <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {ch.playlists.map((p, i) => (
                <span key={i} style={{ fontSize: 12, padding: '6px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>{p}</span>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topPl.map((p, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span>{p.name}</span><span style={{ color: accent }}>{fmt(p.views)} views · {p.count} videos</span>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${p.pct}%`, background: `linear-gradient(90deg,${accent},${accent}66)` }} />
                </div>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => onOpenPlaylists(ch)} style={{ marginTop: 14, background: `${accent}22`, border: `1px solid ${accent}`, color: accent, borderRadius: 10, padding: '8px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Browse all playlists →</button>
      </Card>

      {anns.length > 0 && (
        <Card accent={accent}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>📣 Latest announcement</div>
          <div style={{ fontWeight: 600 }}>{anns[0].title}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 6 }}>{anns[0].body}</div>
        </Card>
      )}
    </div>
  );
}

function analyzePlaylists(ch, videos) {
  if (!videos.length) return [];
  const map = {};
  videos.forEach(v => { const k = v.playlist || 'Other'; map[k] = map[k] || { name: k, views: 0, count: 0 }; map[k].views += v.views || 0; map[k].count++; });
  const arr = Object.values(map).sort((a, b) => b.views - a.views);
  const max = Math.max(...arr.map(a => a.views), 1);
  arr.forEach(a => a.pct = Math.round(a.views / max * 100));
  return arr.slice(0, 5);
}

function VideoGrid({ videos, accent, empty }) {
  if (!videos || !videos.length) return <Empty msg={empty || 'Nothing here yet.'} />;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
      {videos.map((v, i) => (
        <Card key={v.id || i} accent={accent} style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ aspectRatio: '16/9', background: `linear-gradient(135deg,${accent}33,#1a1a2e)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <span style={{ fontSize: 30 }}>{v.status === 'upcoming' ? '⏳' : '▶'}</span>
            {v.is_popular && <span style={{ position: 'absolute', top: 8, right: 8, fontSize: 11, padding: '2px 7px', background: '#f97316', borderRadius: 6, fontWeight: 700 }}>🔥 POPULAR</span>}
          </div>
          <div style={{ padding: 14 }}>
            <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.3, marginBottom: 6 }}>{v.title}</div>
            {v.description && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{v.description}</div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
              <span>{v.status === 'upcoming' ? `📅 ${fmtDate(v.scheduled_at)}` : `👁 ${fmt(v.views || 0)}`}</span>
              {v.url ? <a href={v.url} target="_blank" rel="noreferrer" style={{ color: accent, textDecoration: 'none', fontWeight: 600 }}>Watch →</a> : <span style={{ opacity: 0.5 }}>{v.status}</span>}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function PostList({ posts, accent }) {
  if (!posts.length) return <Empty msg="No posts yet. Add them in the Posts tab of the Excel workbook." />;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {posts.map((p, i) => (
        <Card key={p.id || i} accent={accent} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: 11, padding: '2px 8px', background: `${accent}22`, color: accent, borderRadius: 6, marginRight: 8 }}>{p.platform}</span>
            <span style={{ fontWeight: 600 }}>{p.title || p.body || p.link}</span>
            {p.body && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>{p.body}</div>}
          </div>
          <a href={p.link} target="_blank" rel="noreferrer" style={{ color: accent, textDecoration: 'none', fontWeight: 600, fontSize: 13 }}>Open →</a>
        </Card>
      ))}
    </div>
  );
}

function AnnList({ anns, accent }) {
  if (!anns.length) return <Empty msg="No announcements yet." />;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {anns.map((a, i) => (
        <Card key={a.id || i} accent={accent}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 700 }}>{a.pinned ? '📌 ' : ''}{a.title}</div>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{fmtDate(a.published_at)}</span>
          </div>
          {a.body && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 6 }}>{a.body}</div>}
          {a.link && <a href={a.link} target="_blank" rel="noreferrer" style={{ color: accent, fontSize: 13, textDecoration: 'none', display: 'inline-block', marginTop: 8 }}>Read more →</a>}
        </Card>
      ))}
    </div>
  );
}

function LotteryPanel({ entries, accent }) {
  const winners = entries.filter(e => e.is_winner);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <Stat label="Total entries" value={entries.length} accent={accent} />
        <Stat label="Winners" value={winners.length} accent={accent} />
      </div>
      {entries.length === 0 ? <Empty msg="No lottery entries yet for this channel." /> : (
        <Card accent={accent} style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ background: 'rgba(255,255,255,0.05)' }}>
              {['Name', 'Ticket', 'Numbers', 'Date', 'Prize'].map(h => <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {entries.slice(0, 50).map((e, i) => (
                <tr key={e.id || i} style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: e.is_winner ? `${accent}11` : 'transparent' }}>
                  <td style={{ padding: '9px 14px' }}>{e.is_winner ? '🏆 ' : ''}{e.name}</td>
                  <td style={{ padding: '9px 14px' }}>{e.ticket}</td>
                  <td style={{ padding: '9px 14px', fontFamily: 'monospace', color: accent }}>{e.numbers}</td>
                  <td style={{ padding: '9px 14px' }}>{fmtDate(e.entered_at)}</td>
                  <td style={{ padding: '9px 14px' }}>{e.prize || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

function Empty({ msg }) {
  return <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
    <div style={{ fontSize: 40, marginBottom: 12 }}>🌌</div>{msg}
  </div>;
}

// ---- formatting helpers ----
function fmt(n) { n = Number(n) || 0; if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B'; if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'; if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'; return String(n); }
function fmtDate(d) { if (!d) return '—'; const x = new Date(d); return isNaN(x) ? '—' : x.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }); }

Object.assign(window, { RocketCursor, CosmicCanvas, SolarSystem, Planet, ChannelWorld, ChannelOverview, VideoGrid, PostList, AnnList, LotteryPanel, Card, Stat, Empty, fmt, fmtDate, analyzePlaylists, moonCount });
