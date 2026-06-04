// ============================================================
// PUJIVERSE NETWORK — Social, Announcements & Posts pages
// ============================================================

function SocialHub({ data, onBack }) {
  const [tab, setTab] = React.useState('social');
  const anns = (data.announcements || []);
  const posts = (data.posts || []);

  const tabs = [
    { id: 'social', label: 'Social Accounts', icon: '🌐' },
    { id: 'announcements', label: `Announcements`, icon: '📣' },
    { id: 'posts', label: `Posts`, icon: '📝' },
  ];

  return (
    <div style={{ position: 'relative', zIndex: 5, minHeight: '100vh', padding: '20px 28px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#e8e8f8', borderRadius: 10, padding: '8px 14px', cursor: 'pointer', fontSize: 13 }}>← Solar system</button>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 24 }}>🛰 Pujiverse Hub</div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 22, flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', cursor: 'pointer',
            borderRadius: 999, fontSize: 13, fontWeight: 600,
            background: tab === t.id ? 'rgba(34,211,238,0.18)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${tab === t.id ? '#22d3ee' : 'rgba(255,255,255,0.1)'}`,
            color: tab === t.id ? '#22d3ee' : 'rgba(255,255,255,0.7)'
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      {tab === 'social' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
          {(data.social && data.social.length ? data.social : SOCIAL_LINKS).map((s, i) => (
            <a key={i} href={s.url} target="_blank" rel="noreferrer" style={{
              textDecoration: 'none', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16, padding: 18, display: 'flex', alignItems: 'center', gap: 14, transition: 'all .2s'
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `${s.color}22`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SocialIcon icon={s.icon} size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#e8e8f8' }}>{s.platform}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{s.handle}</div>
              </div>
            </a>
          ))}
        </div>
      )}

      {tab === 'announcements' && (anns.length ? <AnnList anns={anns} accent="#22d3ee" /> : <Empty msg="No announcements yet. Add them in the Excel workbook → Announcements tab." />)}
      {tab === 'posts' && (posts.length ? <PostList posts={posts} accent="#c084fc" /> : <Empty msg="No posts yet. Add them in the Excel workbook → Posts tab." />)}
    </div>
  );
}

Object.assign(window, { SocialHub });
