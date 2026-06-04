# PujiverseNetwork
PUJIVERSE NETWORK — Master Data

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PUJIVERSE — Network Hub</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'Inter', sans-serif;
      background: #07070f;
      color: #e8e8f8;
      min-height: 100vh;
      overflow-x: hidden;
    }
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background:
        radial-gradient(ellipse 80% 50% at 20% 10%, oklch(0.25 0.1 280 / 0.35) 0%, transparent 60%),
        radial-gradient(ellipse 60% 40% at 80% 80%, oklch(0.2 0.1 320 / 0.25) 0%, transparent 60%),
        radial-gradient(ellipse 40% 60% at 50% 50%, oklch(0.15 0.06 260 / 0.2) 0%, transparent 70%);
      z-index: 0;
      pointer-events: none;
    }
    input::placeholder { color: rgba(255,255,255,0.25); }
    textarea::placeholder { color: rgba(255,255,255,0.25); }
    input, textarea, select { color-scheme: dark; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
    @keyframes twinkle { from { opacity: 0.1; transform: scale(0.8);} to { opacity: 0.8; transform: scale(1.2);} }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(12px);} to { opacity: 1; transform: translateY(0);} }
    #root { position: relative; z-index: 1; }
    /* rocket cursor: hide native cursor on fine-pointer devices */
    @media (pointer: fine) {
      body, a, button, select, input, textarea, [onclick], label { cursor: none !important; }
    }
  </style>

  <!-- React + Babel -->
  <script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>

  <!-- Supabase + SheetJS -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>

  <!-- Data + service layer -->
  <script src="js/data.js"></script>
  <script src="js/supabaseService.js"></script>
</head>
<body>
  <div id="root"></div>

  <!-- Components -->
  <script type="text/babel" src="components/PublicView.jsx"></script>
  <script type="text/babel" src="components/SpaceUI.jsx"></script>
  <script type="text/babel" src="components/SocialPages.jsx"></script>
  <script type="text/babel" src="components/AIChat.jsx"></script>
  <script type="text/babel" src="components/AdminData.jsx"></script>
  <script type="text/babel" src="components/AdminPanel.jsx"></script>

  <!-- App root -->
  <script type="text/babel">
    const { useState, useEffect, useCallback, useRef } = React;

    function App() {
      // view: 'solar' | 'channel' | 'hub' | 'classic' | 'login' | 'admin'
      const [view, setView]   = useState('solar');
      const [activeCh, setActiveCh] = useState(null);
      const clickRef = useRef({ count: 0, timer: null });

      // ---- Supabase ----
      const DEFAULT_SB_URL = 'https://kykkbramlsychystjqba.supabase.co';
      const DEFAULT_SB_KEY = 'sb_publishable_OcsI13nc3Xy5ak_BHAhJMA_lFhAf8EO';
      const [supabaseUrl, setSupabaseUrl] = useState(() => localStorage.getItem('pv_sb_url') || DEFAULT_SB_URL);
      const [supabaseKey, setSupabaseKey] = useState(() => localStorage.getItem('pv_sb_key') || DEFAULT_SB_KEY);
      const [supabase, setSupabase]       = useState(null);

      // ---- Local data (for classic admin compatibility) ----
      const [localChannels, setLocalChannels] = useState(() => { try { const s=localStorage.getItem('pv_channels'); return s?JSON.parse(s):CHANNELS; } catch { return CHANNELS; } });
      const [localVideos, setLocalVideos]     = useState(() => { try { const s=localStorage.getItem('pv_videos'); return s?JSON.parse(s):{}; } catch { return {}; } });
      const [localSocial, setLocalSocial]     = useState(() => { try { const s=localStorage.getItem('pv_social'); return s?JSON.parse(s):SOCIAL_LINKS; } catch { return SOCIAL_LINKS; } });
      const [localWebsites, setLocalWebsites] = useState(() => { try { const s=localStorage.getItem('pv_websites'); return s?JSON.parse(s):[]; } catch { return []; } });
      const [localPosts, setLocalPosts]       = useState(() => { try { const s=localStorage.getItem('pv_posts'); return s?JSON.parse(s):[]; } catch { return []; } });

      useEffect(() => { localStorage.setItem('pv_channels', JSON.stringify(localChannels)); }, [localChannels]);
      useEffect(() => { localStorage.setItem('pv_social', JSON.stringify(localSocial)); }, [localSocial]);
      useEffect(() => { localStorage.setItem('pv_websites', JSON.stringify(localWebsites)); }, [localWebsites]);
      useEffect(() => { localStorage.setItem('pv_posts', JSON.stringify(localPosts)); }, [localPosts]);

      // ---- Unified live data from Supabase (or localStorage fallback) ----
      const [data, setData] = useState({ channels: [], videos: [], announcements: [], posts: [], subscribers: [], lottery_entries: [], social: SOCIAL_LINKS });

      const reloadData = useCallback(async () => {
        const tables = ['channels','videos','announcements','posts','lottery_entries'];
        const next = { social: localSocial };
        for (const t of tables) {
          try {
            const res = await PVDB.selectAll(t, t==='videos' ? { order:'created_at', asc:false } : {});
            next[t] = res.data || [];
          } catch { next[t] = []; }
        }
        // merge CHANNELS metadata (playlists, category colors) onto channel rows
        const chById = {}; (next.channels||[]).forEach(c => chById[c.sno]=c);
        next.mergedChannels = CHANNELS.map(c => {
          const db = chById[c.sno] || {};
          return { ...c, ...db, name:c.name, cat:c.cat, playlists:c.playlists, url:c.url, score:db.score||c.score, sno:c.sno, handle:c.handle };
        });
        setData(d => ({ ...d, ...next }));
      }, [localSocial]);

      useEffect(() => { window.pvReloadData = reloadData; }, [reloadData]);

      // ---- Connect Supabase ----
      const connectSupabase = useCallback(() => {
        if (supabaseUrl && supabaseKey && window.supabase) {
          try {
            const client = window.supabase.createClient(supabaseUrl, supabaseKey);
            setSupabase(client);
            PVDB.setClient(client);
            localStorage.setItem('pv_sb_url', supabaseUrl);
            localStorage.setItem('pv_sb_key', supabaseKey);
          } catch(e) { console.warn('Supabase connect failed', e); }
        }
      }, [supabaseUrl, supabaseKey]);

      useEffect(() => { connectSupabase(); }, [connectSupabase]);
      useEffect(() => { reloadData(); }, [supabase, reloadData]);


      // ---- Secret login: triple-click the PUJIVERSE logo ----
      const handleLogoClick = useCallback(() => {
        const c = clickRef.current;
        c.count += 1;
        if (c.timer) clearTimeout(c.timer);
        if (c.count >= 3) { c.count = 0; setView('login'); }
        else { c.timer = setTimeout(() => { c.count = 0; }, 1200); }
      }, []);

      useEffect(() => {
        const el = document.getElementById('logo-click-target');
        if (el) el.onclick = handleLogoClick;
      });

      const channels = data.mergedChannels && data.mergedChannels.length ? data.mergedChannels : CHANNELS;

      return (
        <>
          <CosmicCanvas />
          <RocketCursor />

          {(view==='solar' || view==='channel' || view==='hub') && (
            <div style={{ position:'fixed', bottom:24, left:24, zIndex:8000, display:'flex', gap:8, flexWrap:'wrap' }}>
              <NavChip active={view==='solar'} onClick={()=>{ setView('solar'); setActiveCh(null); }}>🪐 Solar</NavChip>
              <NavChip active={view==='hub'} onClick={()=>setView('hub')}>🛰 Hub</NavChip>
              <NavChip onClick={()=>setView('classic')}>📇 Grid view</NavChip>
            </div>
          )}

          {view === 'login' && (
            <LoginModal onLogin={() => setView('admin')} onClose={() => setView('solar')} />
          )}

          {view === 'solar' && (
            <SolarSystem channels={channels} onOpenChannel={(ch)=>{ setActiveCh(ch); setView('channel'); }} onAdminClick={()=>setView('login')} />
          )}

          {view === 'channel' && activeCh && (
            <ChannelWorld ch={activeCh} data={data}
              onBack={()=>{ setView('solar'); setActiveCh(null); }}
              onOpenPlaylists={(ch)=>{ window.open(ch.url, '_blank'); }} />
          )}

          {view === 'hub' && (
            <SocialHub data={data} onBack={()=>setView('solar')} />
          )}

          {view === 'classic' && (
            <PublicView
              onAdminClick={() => setView('login')}
              videos={localVideos}
              social={localSocial}
              websites={localWebsites}
              posts={localPosts}
              onBackToSpace={()=>setView('solar')}
            />
          )}

          {view === 'admin' && (
            <AdminPanel
              onBack={() => { setView('solar'); reloadData(); }}
              supabase={supabase}
              supabaseUrl={supabaseUrl}
              supabaseKey={supabaseKey}
              setSupabaseUrl={setSupabaseUrl}
              setSupabaseKey={setSupabaseKey}
              onConnectSupabase={connectSupabase}
              localChannels={localChannels}
              setLocalChannels={setLocalChannels}
              localVideos={localVideos}
              setLocalVideos={setLocalVideos}
              localSocial={localSocial}
              setLocalSocial={setLocalSocial}
              localWebsites={localWebsites}
              setLocalWebsites={setLocalWebsites}
              localPosts={localPosts}
              setLocalPosts={setLocalPosts}
            />
          )}

          {(view==='solar' || view==='channel' || view==='hub' || view==='classic') && (
            <AIChat supabase={supabase} supabaseUrl={supabaseUrl} data={{ ...data, channels }} />
          )}
        </>
      );
    }

    function NavChip({ children, active, onClick }) {
      return (
        <button onClick={onClick} style={{
          padding:'8px 14px', borderRadius:999, fontSize:13, fontWeight:600, cursor:'pointer',
          background: active ? 'rgba(34,211,238,0.18)' : 'rgba(12,12,24,0.8)',
          border:`1px solid ${active ? '#22d3ee' : 'rgba(255,255,255,0.12)'}`,
          color: active ? '#22d3ee' : 'rgba(255,255,255,0.7)', backdropFilter:'blur(8px)'
        }}>{children}</button>
      );
    }

    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>
