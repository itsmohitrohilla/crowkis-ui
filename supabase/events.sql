-- Site events shown on the admin dashboard: page views, Arcade plays, code copies, demo-booking clicks.
create table if not exists public.events (
  id bigint generated always as identity primary key,
  name text not null,
  path text,
  meta text,
  created_at timestamptz not null default now()
);
create index if not exists events_name_created_idx on public.events (name, created_at desc);
alter table public.events enable row level security;
-- No public policies: writes go through the server (owner role), never the browser.

-- Which form a message came from: 'feedback' (/feedback) or 'contact' (/about#contact).
alter table public.feedback add column if not exists source text not null default 'feedback';
