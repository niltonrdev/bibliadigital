-- Rode isto no SQL Editor do novo projeto no Supabase.
-- Depois: Database > Replication e ative as tabelas abaixo.

create table if not exists public.chapter_reads (
  id uuid primary key default gen_random_uuid(),
  reader text not null check (reader in ('nilton', 'tamires')),
  book_id int not null,
  chapter int not null,
  read_at timestamptz not null default now(),
  unique (reader, book_id, chapter)
);

create table if not exists public.highlights (
  id uuid primary key default gen_random_uuid(),
  reader text not null check (reader in ('nilton', 'tamires')),
  book_id int not null,
  chapter int not null,
  verse int not null,
  color text not null default 'gold',
  note text,
  created_at timestamptz not null default now(),
  unique (reader, book_id, chapter, verse)
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  reader text not null check (reader in ('nilton', 'tamires')),
  book_id int not null,
  chapter int not null,
  verse int,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.presence (
  reader text primary key check (reader in ('nilton', 'tamires')),
  book_id int not null,
  chapter int not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.reading_days (
  reader text not null check (reader in ('nilton', 'tamires')),
  day date not null,
  primary key (reader, day)
);

create table if not exists public.settings (
  key text primary key,
  value text not null
);

insert into public.settings (key, value)
values ('plan_start', current_date::text)
on conflict (key) do nothing;

alter table public.chapter_reads enable row level security;
alter table public.highlights enable row level security;
alter table public.comments enable row level security;
alter table public.presence enable row level security;
alter table public.reading_days enable row level security;
alter table public.settings enable row level security;

create or replace function public.is_couple()
returns boolean
language sql
stable
as $$
  select coalesce(
    current_setting('request.headers', true)::json ->> 'x-couple-code',
    ''
  ) = '2508';
$$;

drop policy if exists couple_all on public.chapter_reads;
drop policy if exists couple_all on public.highlights;
drop policy if exists couple_all on public.comments;
drop policy if exists couple_all on public.presence;
drop policy if exists couple_all on public.reading_days;
drop policy if exists couple_all on public.settings;

create policy couple_all on public.chapter_reads for all using (public.is_couple()) with check (public.is_couple());
create policy couple_all on public.highlights for all using (public.is_couple()) with check (public.is_couple());
create policy couple_all on public.comments for all using (public.is_couple()) with check (public.is_couple());
create policy couple_all on public.presence for all using (public.is_couple()) with check (public.is_couple());
create policy couple_all on public.reading_days for all using (public.is_couple()) with check (public.is_couple());
create policy couple_all on public.settings for all using (public.is_couple()) with check (public.is_couple());

alter publication supabase_realtime add table public.chapter_reads;
alter publication supabase_realtime add table public.highlights;
alter publication supabase_realtime add table public.comments;
alter publication supabase_realtime add table public.presence;
alter publication supabase_realtime add table public.reading_days;
