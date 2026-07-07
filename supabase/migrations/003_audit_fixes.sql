-- Audit fixes (2026-07-05). Run in the Supabase SQL editor after 002.
-- (Migrations are append-only — never edit one that has run.)

-- 1. Reset sent-reminder markers when a credential's expiration date changes.
-- reminders_sent is keyed on (credential_id, window_days) with no notion of
-- WHICH expiration the reminder was for, so without this a renewed credential
-- would never remind again. A trigger (rather than app code) makes the reset
-- atomic with the update and also covers updates made directly through the
-- REST API.
create or replace function public.reset_reminders_on_expiration_change()
returns trigger
language plpgsql
-- security definer: reminders_sent has RLS enabled with no user policies
-- (service-role only), so the delete must run with the owner's rights.
security definer set search_path = ''
as $$
begin
  delete from public.reminders_sent where credential_id = new.id;
  return new;
end;
$$;

create trigger on_credential_expiration_change
  after update of expiration_date on public.credentials
  for each row
  when (old.expiration_date is distinct from new.expiration_date)
  execute procedure public.reset_reminders_on_expiration_change();

-- 2. Restrict which profile columns users can update. The UPDATE policy from
-- 002 allows ANY column through the public REST API (the anon key is public
-- by design) — including email, which would redirect reminder emails to an
-- arbitrary unverified address. Column-level grants close that: users can
-- update only the SMS settings fields; email and created_at stay
-- server-managed. The RLS policy from 002 still scopes updates to own row.
revoke update on public.profiles from authenticated;
grant update (phone, sms_opt_in, sms_opt_in_at) on public.profiles to authenticated;
