import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { daysUntil } from "@/lib/credentials";

// Daily reminder job (see vercel.json). Vercel Cron calls this with
// `Authorization: Bearer ${CRON_SECRET}` automatically when CRON_SECRET is set.
//
// Windows: a credential gets one email per window (90/60/30 days out).
// If a credential is added late (e.g. 25 days left), only the tightest
// applicable window emails — but all applicable windows are marked sent,
// so the user never gets three reminders at once.

const REMINDER_WINDOWS = [90, 60, 30] as const;

type ExpiringCredential = {
  id: string;
  name: string;
  expiration_date: string;
  profiles: { email: string; phone: string | null; sms_opt_in: boolean } | null;
};

// Sends via Twilio's REST API directly — no SDK dependency. Returns an error
// string or null on success. Skips silently if Twilio env vars aren't set.
async function sendSms(to: string, body: string): Promise<string | null> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM;
  if (!sid || !token || !from) return null; // SMS not configured yet — email-only mode

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: to, From: from, Body: body }),
    }
  );

  if (!res.ok) {
    const detail = await res.text().catch(() => res.statusText);
    return `Twilio ${res.status}: ${detail.slice(0, 200)}`;
  }
  return null;
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Service-role client: bypasses RLS to see all users' credentials.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const resend = new Resend(process.env.RESEND_API_KEY!);
  const from = process.env.RESEND_FROM ?? "Watchkeeper <onboarding@resend.dev>";

  const today = new Date().toISOString().slice(0, 10);
  const horizon = new Date(Date.now() + 90 * 86_400_000).toISOString().slice(0, 10);

  const { data: expiring, error: queryError } = await supabase
    .from("credentials")
    .select("id, name, expiration_date, profiles(email, phone, sms_opt_in)")
    .gte("expiration_date", today)
    .lte("expiration_date", horizon)
    .returns<ExpiringCredential[]>();

  if (queryError) {
    return NextResponse.json({ error: queryError.message }, { status: 500 });
  }

  const credentialIds = (expiring ?? []).map((c) => c.id);
  const { data: alreadySent } = credentialIds.length
    ? await supabase
        .from("reminders_sent")
        .select("credential_id, window_days")
        .in("credential_id", credentialIds)
    : { data: [] };

  const sentSet = new Set((alreadySent ?? []).map((r) => `${r.credential_id}:${r.window_days}`));

  let emailed = 0;
  const failures: string[] = [];

  for (const cred of expiring ?? []) {
    const email = cred.profiles?.email;
    if (!email) continue;

    const daysLeft = daysUntil(cred.expiration_date);
    const applicable = REMINDER_WINDOWS.filter((w) => daysLeft <= w);
    const unsent = applicable.filter((w) => !sentSet.has(`${cred.id}:${w}`));
    if (unsent.length === 0) continue;

    const window = Math.min(...unsent);

    const { error: sendError } = await resend.emails.send({
      from,
      to: email,
      subject: `⚓ ${cred.name} expires in ${daysLeft} days`,
      text: [
        `Your ${cred.name} expires on ${cred.expiration_date} — ${daysLeft} days from now.`,
        ``,
        `Renewals can take weeks to process. Start yours now so you stay on the schedule.`,
        ``,
        `— Watchkeeper, standing watch over your credentials`,
        `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://watchkeeper.app"}/dashboard`,
      ].join("\n"),
    });

    if (sendError) {
      failures.push(`${cred.id} (${window}d): ${sendError.message}`);
      continue;
    }

    // SMS rides along with the email when the user opted in. An SMS failure
    // is logged but doesn't block the reminder from being marked sent —
    // the email is the reminder of record.
    if (cred.profiles?.sms_opt_in && cred.profiles.phone) {
      const smsError = await sendSms(
        cred.profiles.phone,
        `Watchkeeper: your ${cred.name} expires ${cred.expiration_date} (${daysLeft} days). Start your renewal now.`
      );
      if (smsError) failures.push(`${cred.id} sms: ${smsError}`);
    }

    // Mark every applicable window sent so late-added credentials don't
    // trigger a backlog of emails on subsequent days.
    const { error: markError } = await supabase.from("reminders_sent").insert(
      unsent.map((w) => ({ credential_id: cred.id, window_days: w }))
    );
    if (markError) failures.push(`${cred.id} mark-sent: ${markError.message}`);

    emailed++;
  }

  return NextResponse.json({ checked: expiring?.length ?? 0, emailed, failures });
}
