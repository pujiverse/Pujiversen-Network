// ============================================================
// PUJIVERSE NETWORK — AI CHAT AGENT
// Floating widget. Tries OpenAI (via Supabase Edge Function),
// falls back to a smart rule-based assistant over local data.
// Logs every message to the `messages` table.
// ============================================================

function sessionId() {
  let id = localStorage.getItem('pv_chat_session');
  if (!id) { id = 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('pv_chat_session', id); }
  return id;
}

// Rule-based fallback brain — answers from CHANNELS / SOCIAL_LINKS / data
function localBrain(q, data) {
  const t = (q || '').toLowerCase();
  const chans = (data.channels && data.channels.length ? data.channels : CHANNELS);

  // greeting
  if (/^(hi|hey|hello|yo|namaste|hola)\b/.test(t))
    return `Hey! 🪐 I'm the Pujiverse assistant. Ask me about any of our ${chans.length} channels, where to find a topic, our lottery, or social links.`;

  // lottery
  if (/lottery|lucky|draw|winner|ticket/.test(t)) {
    const entries = data.lottery_entries || [];
    const winners = entries.filter(e => e.is_winner).length;
    return `🎰 Our lottery currently has ${entries.length} entries${winners ? ` and ${winners} winner(s)` : ''}. You can enter from any channel's Lottery moon. Want me to point you to a specific channel?`;
  }

  // social / where to follow
  if (/follow|social|instagram|twitter|tiktok|discord|facebook|where.*find|links?/.test(t)) {
    const top = SOCIAL_LINKS.slice(0, 6).map(s => `${s.platform}: ${s.url}`).join('\n');
    return `Here's where to follow Pujiverse:\n${top}\n…and more on the Social page. 🚀`;
  }

  // recommend by topic — match channel categories/names/playlists
  const matches = chans.filter(c => {
    const blob = (c.name + ' ' + c.cat + ' ' + (c.playlists || []).join(' ')).toLowerCase();
    return t.split(/\s+/).filter(w => w.length > 3).some(w => blob.includes(w));
  }).slice(0, 4);
  if (matches.length) {
    return `Based on that, check out:\n` + matches.map(c => `• ${c.name} (${c.cat}) — ${c.url}`).join('\n') + `\n\nClick its planet in the solar system to explore videos, popular content and posts.`;
  }

  // count / list
  if (/how many|number of|count/.test(t) && /channel/.test(t))
    return `Pujiverse Network runs ${chans.length} channels across categories like Science & Tech, Entertainment, Education, Gaming, Finance and more. 🌌`;

  if (/help|what can you|who are you/.test(t))
    return `I can: recommend a channel for any topic, find where to watch something, share our social links, and explain the lottery. Try "I want crypto videos" or "where do I follow you on Instagram".`;

  return `I can help you navigate Pujiverse's ${chans.length} channels, find videos on a topic, share social links, or explain the lottery. What are you into — tech, mystery, finance, gaming, something else?`;
}

function AIChat({ supabase, supabaseUrl, data }) {
  const [open, setOpen] = React.useState(false);
  const [msgs, setMsgs] = React.useState([{ role: 'assistant', content: "Hi! 🚀 I'm your Pujiverse guide. Ask me anything about our channels, videos, lottery, or where to follow us." }]);
  const [input, setInput] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const bodyRef = React.useRef(null);

  React.useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [msgs, open]);

  async function logMessage(role, content) {
    try {
      if (supabase) await supabase.from('messages').insert({ session_id: sessionId(), role, content });
    } catch {}
  }

  async function askAgent(question) {
    // Try edge function first
    if (supabaseUrl) {
      try {
        const fnUrl = supabaseUrl.replace(/\/$/, '') + '/functions/v1/chat-agent';
        const res = await fetch(fnUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: question, session_id: sessionId() }),
        });
        if (res.ok) {
          const j = await res.json();
          if (j && j.reply) return j.reply;
        }
      } catch (e) { /* fall through to local brain */ }
    }
    return localBrain(question, data);
  }

  async function send() {
    const q = input.trim();
    if (!q || busy) return;
    setInput('');
    setMsgs(m => [...m, { role: 'user', content: q }]);
    logMessage('user', q);
    setBusy(true);
    const reply = await askAgent(q);
    setMsgs(m => [...m, { role: 'assistant', content: reply }]);
    logMessage('assistant', reply);
    setBusy(false);
  }

  return (
    <>
      {/* launcher */}
      <button onClick={() => setOpen(o => !o)} title="Ask Pujiverse AI" style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 9000, width: 58, height: 58, borderRadius: '50%',
        border: 'none', cursor: 'pointer', fontSize: 24,
        background: 'linear-gradient(135deg,#22d3ee,#c084fc)', color: '#0a0a15',
        boxShadow: '0 0 24px rgba(34,211,238,0.5)'
      }}>{open ? '✕' : '🤖'}</button>

      {open && (
        <div style={{
          position: 'fixed', bottom: 92, right: 24, zIndex: 9000, width: 'min(380px, calc(100vw - 32px))',
          height: 'min(520px, 70vh)', display: 'flex', flexDirection: 'column',
          background: 'rgba(12,12,24,0.97)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 18,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)', overflow: 'hidden'
        }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>🪐</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Pujiverse Assistant</div>
              <div style={{ fontSize: 11, color: '#4ade80' }}>● online</div>
            </div>
          </div>

          <div ref={bodyRef} style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%',
                padding: '10px 13px', borderRadius: 14, fontSize: 13.5, lineHeight: 1.45, whiteSpace: 'pre-wrap',
                background: m.role === 'user' ? 'linear-gradient(135deg,#22d3ee,#c084fc)' : 'rgba(255,255,255,0.06)',
                color: m.role === 'user' ? '#0a0a15' : '#e8e8f8',
                border: m.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)'
              }}>{m.content}</div>
            ))}
            {busy && <div style={{ alignSelf: 'flex-start', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>typing…</div>}
          </div>

          <div style={{ padding: 12, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask about channels, videos, lottery…"
              style={{ flex: 1, padding: '10px 13px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, color: '#e8e8f8', fontSize: 13, outline: 'none' }} />
            <button onClick={send} disabled={busy} style={{
              padding: '0 16px', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 700,
              background: 'linear-gradient(135deg,#22d3ee,#c084fc)', color: '#0a0a15'
            }}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}

Object.assign(window, { AIChat });
