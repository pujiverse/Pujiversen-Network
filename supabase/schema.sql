-- ============================================================
-- PUJIVERSE NETWORK — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query)
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE.
-- ============================================================

create extension if not exists "pgcrypto";

-- ============================================================
-- 1. CHANNELS  (the 38 planets)
-- ============================================================
create table if not exists public.channels (
  id          uuid primary key default gen_random_uuid(),
  sno         text unique not null,
  name        text not null,
  handle      text,
  category    text,
  url         text,
  score       int default 0,
  cpm         text,
  team        int default 1,
  status      text default 'LIVE',
  subscribers bigint default 0,
  total_views bigint default 0,
  playlists   jsonb default '[]'::jsonb,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
create index if not exists idx_channels_sno on public.channels(sno);

-- ============================================================
-- 2. VIDEOS  (existing + upcoming) — maps 1:1 to Excel "Videos" tab
-- ============================================================
create table if not exists public.videos (
  id            uuid primary key default gen_random_uuid(),
  channel_sno   text references public.channels(sno) on delete set null,
  playlist      text,
  title         text not null,
  description   text,
  url           text,
  status        text default 'upcoming',
  scheduled_at  timestamptz,
  views         bigint default 0,
  likes         bigint default 0,
  comments      bigint default 0,
  is_popular    boolean default false,
  thumbnail_url text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
create index if not exists idx_videos_channel on public.videos(channel_sno);
create index if not exists idx_videos_status  on public.videos(status);
create index if not exists idx_videos_popular on public.videos(is_popular);

-- ============================================================
-- 3. SUBSCRIBERS  (subscriber list, pushed from Excel)
-- ============================================================
create table if not exists public.subscribers (
  id            uuid primary key default gen_random_uuid(),
  channel_sno   text references public.channels(sno) on delete set null,
  name          text,
  email         text,
  source        text,
  joined_at     timestamptz default now(),
  is_member     boolean default false,
  notes         text,
  created_at    timestamptz default now()
);
create index if not exists idx_subscribers_channel on public.subscribers(channel_sno);
create index if not exists idx_subscribers_email   on public.subscribers(email);

-- ============================================================
-- 4. ANNOUNCEMENTS
-- ============================================================
create table if not exists public.announcements (
  id           uuid primary key default gen_random_uuid(),
  channel_sno  text,
  title        text not null,
  body         text,
  link         text,
  pinned       boolean default false,
  published_at timestamptz default now(),
  created_at   timestamptz default now()
);
create index if not exists idx_ann_channel on public.announcements(channel_sno);

-- ============================================================
-- 5. POSTS  (social-media posts / links)
-- ============================================================
create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  channel_sno  text,
  platform     text,
  title        text,
  body         text,
  link         text not null,
  posted_at    timestamptz default now(),
  created_at   timestamptz default now()
);
create index if not exists idx_posts_platform on public.posts(platform);

-- ============================================================
-- 6. MESSAGES  (AI chat agent log)
-- ============================================================
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  session_id  text,
  role        text not null,
  content     text not null,
  handled_by  text default 'ai',
  created_at  timestamptz default now()
);
create index if not exists idx_messages_session on public.messages(session_id);

-- ============================================================
-- 7. LOTTERY  (entries + draws)
-- ============================================================
create table if not exists public.lottery_entries (
  id          uuid primary key default gen_random_uuid(),
  channel_sno text,
  name        text,
  email       text,
  ticket      text,
  numbers     text,
  entered_at  timestamptz default now(),
  is_winner   boolean default false,
  prize       text,
  created_at  timestamptz default now()
);
create index if not exists idx_lottery_channel on public.lottery_entries(channel_sno);

create table if not exists public.lottery_draws (
  id           uuid primary key default gen_random_uuid(),
  draw_date    date,
  winning_nums text,
  prize_pool   text,
  notes        text,
  created_at   timestamptz default now()
);

-- ============================================================
-- updated_at trigger
-- ============================================================
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists trg_channels_touch on public.channels;
create trigger trg_channels_touch before update on public.channels
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_videos_touch on public.videos;
create trigger trg_videos_touch before update on public.videos
  for each row execute function public.touch_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.channels        enable row level security;
alter table public.videos          enable row level security;
alter table public.subscribers     enable row level security;
alter table public.announcements   enable row level security;
alter table public.posts           enable row level security;
alter table public.messages        enable row level security;
alter table public.lottery_entries enable row level security;
alter table public.lottery_draws   enable row level security;

do $$
declare t text;
begin
  foreach t in array array['channels','videos','announcements','posts','lottery_draws']
  loop
    execute format('drop policy if exists "%s_read" on public.%I;', t, t);
    execute format('create policy "%s_read" on public.%I for select using (true);', t, t);
  end loop;
end $$;

do $$
declare t text;
begin
  foreach t in array array['messages','subscribers','lottery_entries']
  loop
    execute format('drop policy if exists "%s_insert" on public.%I;', t, t);
    execute format('create policy "%s_insert" on public.%I for insert with check (true);', t, t);
    execute format('drop policy if exists "%s_read" on public.%I;', t, t);
    execute format('create policy "%s_read" on public.%I for select using (true);', t, t);
  end loop;
end $$;
