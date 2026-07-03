-- Watchkeeper initial schema.
-- Run this in the Supabase SQL editor (or `supabase db push` if using the CLI).

-- Profiles mirror auth.users so the cron job can join credentials -> email.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

-- Auto-create a profile row on signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table public.credentials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  credential_type text not null,          -- preset slug from src/lib/credentials.ts, or 'custom'
  name text not null,
  issue_date date,
  expiration_date date,                   -- null = ongoing compliance (e.g. drug enrollment)
  created_at timestamptz not null default now()
);

create index credentials_expiration_idx on public.credentials (expiration_date);

-- One row per (credential, reminder window) so each email fires exactly once.
create table public.reminders_sent (
  id uuid primary key default gen_random_uuid(),
  credential_id uuid not null references public.credentials (id) on delete cascade,
  window_days int not null,
  sent_at timestamptz not null default now(),
  unique (credential_id, window_days)
);

-- Row Level Security: users only see their own rows. The cron job uses the
-- service-role key, which bypasses RLS.
alter table public.profiles enable row level security;
alter table public.credentials enable row level security;
alter table public.reminders_sent enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can view own credentials"
  on public.credentials for select
  using (auth.uid() = user_id);

create policy "Users can add own credentials"
  on public.credentials for insert
  with check (auth.uid() = user_id);

create policy "Users can update own credentials"
  on public.credentials for update
  using (auth.uid() = user_id);

create policy "Users can delete own credentials"
  on public.credentials for delete
  using (auth.uid() = user_id);
