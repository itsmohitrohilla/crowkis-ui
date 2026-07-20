create table if not exists public.feedback (
  id bigint generated always as identity primary key,
  name text,
  email text,
  message text not null,
  created_at timestamptz not null default now()
);
create table if not exists public.ratings (
  id bigint generated always as identity primary key,
  stars int not null check (stars between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);
alter table public.feedback enable row level security;
alter table public.ratings enable row level security;
-- No public policies: writes go through the server (owner role), never the browser.
