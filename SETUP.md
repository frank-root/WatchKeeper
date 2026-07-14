# Watchkeeper — Setup

The code is complete; it needs two free accounts (Supabase, Resend) and their keys.
About 20 minutes, no code changes.

## 1. Supabase (auth + database)

1. Go to [supabase.com](https://supabase.com) → New project. Name it `watchkeeper`,
   pick a strong DB password (save it, you rarely need it again), region: US West.
2. When the project is ready, open **SQL Editor** → New query → paste the entire
   contents of `supabase/migrations/001_init.sql` → Run. You should see "Success".
3. Go to **Authentication → Sign In / Up → Email** and turn **OFF** "Confirm email".
   (Why: v1 skips the confirmation-email flow so signup works instantly. Turn it
   back on before public launch and add a confirm route.)
4. Go to **Project Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server-only; never ship to the browser)

## 2. Resend (reminder emails)

1. Go to [resend.com](https://resend.com) → sign up → **API Keys** → Create.
   Copy it → `RESEND_API_KEY`.
2. Domain verified: `watchkeeper.boats` is set up in Resend (2026-07-06).
   `RESEND_FROM=Watchkeeper <reminders@watchkeeper.boats>` is live in Vercel.
   Update your local `.env.local` to match if running locally.

## 3. Local environment

```powershell
cd projects/watchkeeper/app
copy .env.example .env.local
# fill in .env.local with the values from steps 1–2
# CRON_SECRET: any long random string, e.g. from PowerShell:
#   -join ((48..57)+(97..122) | Get-Random -Count 40 | % {[char]$_})
npm run dev
```

Open http://localhost:3000 → create an account → add a credential → it appears
on the dashboard with a days-until-expiry badge.

## 4. Test the reminder email locally

Add a credential whose expiration date is within 90 days, then:

```powershell
curl.exe -H "Authorization: Bearer YOUR_CRON_SECRET" http://localhost:3000/api/cron/reminders
```

Expected: JSON like `{"checked":1,"emailed":1,"failures":[]}` and an email in your
inbox. Running it again returns `"emailed":0` — each reminder window only fires once
(that's the `reminders_sent` table doing its job).

## 5. Deploy (Vercel)

1. Push `app/` to a GitHub repo, import it in Vercel.
2. Add all six env vars from `.env.local` in Vercel → Settings → Environment
   Variables (set `NEXT_PUBLIC_SITE_URL` to the production URL).
3. `vercel.json` already schedules the cron: daily at 15:00 UTC (~7–8am Pacific).
   Vercel automatically sends `CRON_SECRET` as the Bearer token.

## SMS reminders (optional, added 2026-07-02)

1. Run `supabase/migrations/002_sms_opt_in.sql` in the Supabase SQL editor
   (adds `phone` / `sms_opt_in` to profiles + the update policy).
2. The dashboard now has a "Text message reminders" card — users add a phone
   number and check the consent box. This works immediately; opt-ins are
   collected even before Twilio is configured.
3. To actually send texts: create a [twilio.com](https://twilio.com) account,
   buy a number (~$1.15/mo), and set `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`,
   and `TWILIO_FROM` (the number, E.164 like `+12065550100`) in `.env.local`
   and Vercel. Unset = email-only, no errors.

**Heads up — US carrier rules (A2P 10DLC):** to text US numbers from a regular
Twilio number in production you must register a "campaign" (business info +
sample messages) inside Twilio. Approval takes days and unregistered traffic
gets filtered. For solo testing, Twilio trial mode can text *your own verified
number* without registration — do that first. The consent checkbox + stored
`sms_opt_in_at` timestamp in the dashboard is exactly what campaign
registration asks you to demonstrate.

## How the pieces fit (teaching notes)

- **Auth**: `src/proxy.ts` runs before every page (Next 16's rename of
  `middleware.ts`). It refreshes the Supabase session cookie and bounces
  logged-out visitors from `/dashboard` to `/login`.
- **Server actions** (`src/app/*/actions.ts` with `"use server"`): form posts go
  straight to server functions — no API endpoints needed for CRUD.
- **RLS** (in the migration): Postgres itself refuses to return another user's
  rows, even if app code has a bug. The cron job uses the `service_role` key,
  which bypasses RLS on purpose — that's why it must stay server-only.
- **Reminder dedupe**: `reminders_sent` records one row per (credential, window).
  The cron can run every day — or be re-run manually — without double-emailing.
