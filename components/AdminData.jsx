// ============================================================
// PUJIVERSE NETWORK — ADMIN: Excel Import + Global Search
// New admin tabs that talk to the new Supabase schema via PVDB.
// ============================================================

// ---------- Excel Import tab ----------
function ImportTab({ supabase, onDataChanged }) {
  const [log, setLog] = React.useState([]);
  const [busy, setBusy] = React.useState(false);
  const fileRef = React.useRef(null);
  const add = (msg, ok = true) => setLog(l => [...l, { msg, ok, t: Date.now() }]);

  React.useEffect(() => { if (supabase) PVDB.setClient(supabase); }, [supabase]);

  async function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true); setLog([]);
    add(`Reading "${f.name}"…`);
    try {
      const buf = await f.arrayBuffer();
      if (supabase) PVDB.setClient(supabase);
      const { summary, errors } = await PVDB.importWorkbook(buf);
      Object.entries(summary).forEach(([t, n]) => add(`✓ ${t}: ${n} rows ${supabase ? 'pushed to Supabase' : 'saved locally'}`));
      errors.forEach(er => add('✗ ' + er, false));
      if (!Object.keys(summary).length) add('No matching sheets found. Use the provided template.', false);
      add('Done. ' + (supabase ? 'Data is live.' : 'Connect Supabase to make it permanent.'));
      onDataChanged && onDataChanged();
    } catch (err) {
      add('✗ ' + (err.message || err), false);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div>
      <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>📥 Import from Excel</h3>
      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: '0 0 20px' }}>
        Upload <b>PujiverseNetwork_Data.xlsx</b>. Each tab (Videos, Subscribers, Announcements, Posts, Lottery, Channels) is pushed to its matching Supabase table. Videos &amp; channels are upserted (no duplicates); the rest are appended.
      </p>

      <div style={{ border: '2px dashed rgba(34,211,238,0.4)', borderRadius: 16, padding: 36, textAlign: 'center', background: 'rgba(34,211,238,0.04)' }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>📊</div>
        <input ref={fileRef} type="file" accept=".xlsx,.xls" onChange={handleFile} style={{ display: 'none' }} id="pv-xlsx-input" />
        <label htmlFor="pv-xlsx-input" style={{
          display: 'inline-block', padding: '12px 22px', borderRadius: 12, cursor: busy ? 'wait' : 'pointer',
          background: 'linear-gradient(135deg,#22d3ee,#c084fc)', color: '#0a0a15', fontWeight: 700
        }}>{busy ? 'Importing…' : 'Choose Excel file'}</label>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 12 }}>
          {supabase ? '● Connected to Supabase — data will persist' : '○ Not connected — data saved in browser only (connect in ⚙ Supabase tab)'}
        </div>
      </div>

      {log.length > 0 && (
        <div style={{ marginTop: 20, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, fontFamily: 'monospace', fontSize: 12.5, maxHeight: 260, overflowY: 'auto' }}>
          {log.map((l, i) => <div key={i} style={{ color: l.ok ? '#4ade80' : '#f87171', padding: '2px 0' }}>{l.msg}</div>)}
        </div>
      )}
    </div>
  );
}

// ---------- Global Search tab ----------
function SearchTab({ supabase }) {
  const [q, setQ] = React.useState('');
  const [scope, setScope] = React.useState('videos');
  const [rows, setRows] = React.useState([]);
  const [busy, setBusy] = React.useState(false);
  const [count, setCount] = React.useState(null);

  const scopes = [
    { id: 'videos', label: '🎬 Videos', cols: ['title', 'channel_sno', 'playlist', 'status', 'views', 'url'], search: ['title', 'description', 'playlist'] },
    { id: 'subscribers', label: '👥 Subscribers', cols: ['name', 'email', 'channel_sno', 'source', 'is_member'], search: ['name', 'email', 'source'] },
    { id: 'lottery_entries', label: '🎰 Lottery', cols: ['name', 'email', 'ticket', 'numbers', 'channel_sno', 'is_winner'], search: ['name', 'email', 'ticket'] },
    { id: 'announcements', label: '📣 Announcements', cols: ['title', 'channel_sno', 'published_at'], search: ['title', 'body'] },
    { id: 'posts', label: '📝 Posts', cols: ['title', 'platform', 'channel_sno', 'link'], search: ['title', 'body'] },
  ];
  const cfg = scopes.find(s => s.id === scope);

  React.useEffect(() => { if (supabase) PVDB.setClient(supabase); }, [supabase]);

  async function run() {
    setBusy(true);
    try {
      if (supabase) {
        let query = supabase.from(scope).select('*', { count: 'exact' });
        if (q.trim()) {
          const term = q.trim().replace(/[%,]/g, '');
          const ors = cfg.search.map(c => `${c}.ilike.%${term}%`).join(',');
          query = query.or(ors);
        }
        query = query.limit(200);
        const { data, error, count } = await query;
        if (error) { setRows([{ _err: error.message }]); setCount(null); }
        else { setRows(data || []); setCount(count); }
      } else {
        const all = PVDB.lsGet(scope);
        const t = q.trim().toLowerCase();
        const filtered = t ? all.filter(r => cfg.search.some(c => String(r[c] || '').toLowerCase().includes(t))) : all;
        setRows(filtered.slice(0, 200)); setCount(filtered.length);
      }
    } finally { setBusy(false); }
  }

  React.useEffect(() => { run(); /* eslint-disable-next-line */ }, [scope]);

  return (
    <div>
      <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>🔎 Search all data</h3>
      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: '0 0 18px' }}>Find any row fast — even across tens of thousands of records. Searches Supabase directly when connected.</p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <select value={scope} onChange={e => setScope(e.target.value)} style={inp(160)}>
          {scopes.map(s => <option key={s.id} value={s.id} style={{ background: '#0e0e1a' }}>{s.label}</option>)}
        </select>
        <input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && run()} placeholder="Type to search… (title, name, email, ticket)" style={{ ...inp(0), flex: 1, minWidth: 220 }} />
        <button onClick={run} style={{ padding: '0 20px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700, background: 'linear-gradient(135deg,#22d3ee,#c084fc)', color: '#0a0a15' }}>Search</button>
      </div>

      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>
        {busy ? 'Searching…' : count != null ? `${count} match${count === 1 ? '' : 'es'}${rows.length < count ? ` (showing first ${rows.length})` : ''}` : ''}
      </div>

      <div style={{ overflowX: 'auto', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead><tr style={{ background: 'rgba(255,255,255,0.05)' }}>
            {cfg.cols.map(c => <th key={c} style={{ textAlign: 'left', padding: '10px 14px', color: 'rgba(255,255,255,0.55)', fontWeight: 600, whiteSpace: 'nowrap' }}>{c}</th>)}
          </tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={cfg.cols.length} style={{ padding: 24, textAlign: 'center', color: 'rgba(255,255,255,0.35)' }}>No results.</td></tr>}
            {rows.map((r, i) => r._err ? (
              <tr key={i}><td colSpan={cfg.cols.length} style={{ padding: 14, color: '#f87171' }}>{r._err} — did you run schema.sql?</td></tr>
            ) : (
              <tr key={r.id || i} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {cfg.cols.map(c => (
                  <td key={c} style={{ padding: '9px 14px', maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c === 'url' || c === 'link' ? (r[c] ? <a href={r[c]} target="_blank" rel="noreferrer" style={{ color: '#22d3ee' }}>open</a> : '—') : String(r[c] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  function inp(w) { return { padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#e8e8f8', fontSize: 14, outline: 'none', width: w || undefined }; }
}

Object.assign(window, { ImportTab, SearchTab });
