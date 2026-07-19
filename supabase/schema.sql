-- Crowkis blog (The Roost) — Supabase schema.
-- Run once in the Supabase SQL editor (or I'll run it via the MCP).

create table if not exists public.posts (
  id            bigint generated always as identity primary key,
  slug          text        not null unique,
  title         text        not null,
  summary       text        not null,
  tag           text        not null,
  body          jsonb       not null,            -- the RoostBlock[] array
  keywords      text[]      default '{}',
  read_minutes  int         default 3,
  status        text        not null default 'published',  -- draft | published
  published_at  date        not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Full-text search over title + summary.
alter table public.posts
  add column if not exists search tsvector
  generated always as (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(summary, ''))
  ) stored;

create index if not exists posts_tag_idx          on public.posts (tag);
create index if not exists posts_published_at_idx  on public.posts (published_at desc);
create index if not exists posts_status_idx        on public.posts (status);
create index if not exists posts_search_idx        on public.posts using gin (search);

-- keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists posts_touch_updated_at on public.posts;
create trigger posts_touch_updated_at
  before update on public.posts
  for each row execute function public.touch_updated_at();

-- Row Level Security: public can read published posts; writes require the service role.
alter table public.posts enable row level security;

drop policy if exists "public reads published posts" on public.posts;
create policy "public reads published posts"
  on public.posts for select
  using (status = 'published');
-- (No insert/update/delete policy → only the service_role key can write.)
