-- SMS reminder opt-in. Run in the Supabase SQL editor (001 is already applied;
-- migrations are append-only — never edit a migration that has run).

alter table public.profiles
  add column phone text,                       -- E.164 format, e.g. +12065551234
  add column sms_opt_in boolean not null default false,
  add column sms_opt_in_at timestamptz;        -- consent timestamp (TCPA paper trail)

-- 001 only created a SELECT policy on profiles; users now need to update
-- their own row to manage SMS settings.
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
