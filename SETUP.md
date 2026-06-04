# PUJIVERSE NETWORK — Setup & Operations Guide

A space-themed hub for all 37 Pujiverse YouTube channels. Solar-system home, per-channel "worlds" with orbiting moons, an AI assistant, Supabase backend, and an Excel → Supabase data pipeline.

---

## 1. Run the site

It's a static site — no build step. Two ways to open it:

- **Quick:** double-click `index.html`.
- **Recommended (so the AI agent + Supabase fetch work without CORS issues):** serve the folder:
  ```
  cd PujiverseNetwork-main
  python -m http.server 8000
  ```
  then visit `http://localhost:8000`.

Without Supabase connected, everything still works using your browser's local storage. Connect Supabase to make data permanent and shared across visitors.

---

## 2. What's new

| Area | File |
|------|------|
| Solar-system UI, rocket cursor, channel worlds (Activity / Videos / Recently Uploaded / Popular / Posts / Announcements / Lottery moons) | `components/SpaceUI.jsx` |
| AI chat agent (OpenAI-backed, with offline fallback) | `components/AIChat.jsx` |
| Social / Announcements / Posts hub pages | `components/SocialPages.jsx` |
| Admin: **Import / Data** (Excel upload) + **Search** (find any row fast) | `components/AdminData.jsx` |
| Supabase service layer + Excel parser | `js/supabaseService.js` |
| Database schema | `supabase/schema.sql` |
| Channel seed (37 rows) | `supabase/seed_channels.sql` |
| AI agent backend (OpenAI) | `supabase/functions/chat-agent/index.ts` |
| Master data workbook | `PujiverseNetwork_Data.xlsx` |

Your original Lottery system (`Lottery.html`), grid view, and admin tabs are all preserved.

---

## 3. Supabase setup

Your project `kykkbramlsychystjqba` ("youtube content") is currently **paused**. To use it:

1. Open the Supabase dashboard → your project → click **Restore / Resume**.
2. Go to **SQL Editor → New query**, paste the contents of `supabase/schema.sql`, run it.
3. Run `supabase/seed_channels.sql` the same way to load all 37 channels.
4. In the site, triple-click the **PUJIVERSE** logo → log in → **⚙ Supabase** tab → confirm the URL/key (already pre-filled) → Connect.

The publishable key in the code is safe for the browser (read + insert only, enforced by Row Level Security). Admin writes use it too; if you want hard server-side protection later, move writes behind an Edge Function with the service-role key.

---

## 4. The Excel pipeline (Excel → Supabase)

`PujiverseNetwork_Data.xlsx` has these tabs, each mapping 1:1 to a Supabase table:

- **Channels** — reference list (don't change the SNO codes)
- **Videos** — existing *and* upcoming videos: title, description, url, status (`published`/`upcoming`), scheduled date, views, `is_popular`
- **Subscribers** — your subscriber / member list
- **Announcements** — network-wide (blank SNO) or per-channel
- **Posts** — social post links per platform
- **Lottery** — entries and winners

To push it live:

1. Fill the tabs (dropdowns help you pick valid channels/platforms).
2. In the site: triple-click logo → admin → **📥 Import / Data** → **Choose Excel file**.
3. Each sheet is upserted (Channels, Videos — no duplicates) or appended (the rest) into Supabase.

> Videos marked `is_popular = TRUE` show under the channel's **Popular** moon. Upcoming videos appear with their scheduled date and don't need a URL yet.

---

## 5. Finding data in a huge sheet

Once data is in Supabase, use the admin **🔎 Search** tab. Pick a table (Videos, Subscribers, Lottery, Announcements, Posts), type any text, and it queries Supabase directly — fast even with tens of thousands of rows. This is the "secret login" search you asked for.

---

## 6. The AI agent

The chat widget (🤖 bottom-right) works in two modes:

- **Now (no setup):** a built-in assistant answers from your channel/lottery/social data — recommends channels by topic, shares links, explains the lottery, logs every message to the `messages` table when Supabase is connected.
- **Full OpenAI mode:** deploy the Edge Function and add your key:
  ```
  supabase functions deploy chat-agent --no-verify-jwt
  supabase secrets set OPENAI_API_KEY=sk-your-key
  ```
  The widget automatically calls it; if it's unavailable it falls back to the built-in brain. No front-end change needed.

The function grounds GPT-4o-mini on your live channel list and recent announcements, so answers stay accurate.

---

## 7. Secret admin login

Triple-click the **PUJIVERSE** wordmark (top-left of the solar system) within ~1 second. Default credentials live in `components/AdminPanel.jsx` (`ADMIN_USER` / `ADMIN_PASS`) — change them before going public.

---

## 8. Navigation map

```
Solar system (home)  ──click planet──►  Channel world (moons)
      │                                      └─ Activity, Videos, Recent, Popular, Posts, Announcements, Lottery
      ├──► 🛰 Hub  (Social accounts · Announcements · Posts)
      ├──► 📇 Grid view  (your original card layout)
      └──► triple-click logo ►  Admin (Import, Search, Channels, Videos, Lottery, Posts, Social, Supabase)
```
