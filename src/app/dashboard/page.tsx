import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { daysUntil, expiryStatus, type ExpiryStatus } from "@/lib/credentials";
import { signout } from "@/app/auth/actions";
import { deleteCredential } from "./actions";
import { AddCredentialForm } from "./add-credential-form";
import { SmsSettingsForm } from "./sms-settings-form";

type CredentialRow = {
  id: string;
  credential_type: string;
  name: string;
  issue_date: string | null;
  expiration_date: string | null;
};

const STATUS_STYLES: Record<ExpiryStatus, { label: string; className: string }> = {
  expired: { label: "EXPIRED", className: "bg-red-950 text-red-300 border-red-800" },
  critical: { label: "≤ 30 days", className: "bg-red-950 text-red-300 border-red-800" },
  warning: { label: "≤ 90 days", className: "bg-amber-950 text-amber-300 border-amber-800" },
  ok: { label: "current", className: "bg-emerald-950 text-emerald-300 border-emerald-800" },
  ongoing: { label: "ongoing", className: "bg-slate-800 text-slate-300 border-slate-700" },
};

export default async function DashboardPage(props: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await props.searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: credentials } = await supabase
    .from("credentials")
    .select("id, credential_type, name, issue_date, expiration_date")
    .order("expiration_date", { ascending: true, nullsFirst: false });

  const rows = (credentials ?? []) as CredentialRow[];

  const { data: profile } = await supabase
    .from("profiles")
    .select("phone, sms_opt_in")
    .eq("id", user.id)
    .single();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
        <span className="text-xl font-bold text-sky-400">⚓ Watchkeeper</span>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-400">{user.email}</span>
          <form action={signout}>
            <button type="submit" className="text-slate-300 hover:text-white">
              Sign out
            </button>
          </form>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl space-y-8 px-6 py-8">
        {error && (
          <p className="rounded-md bg-red-950 px-3 py-2 text-sm text-red-300">{error}</p>
        )}

        <section>
          <h1 className="mb-4 text-lg font-semibold">Your credentials</h1>

          {rows.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-800 p-8 text-center text-slate-500">
              Nothing tracked yet — add your first credential below and Watchkeeper will
              email you at 90, 60, and 30 days before it expires.
            </p>
          ) : (
            <ul className="space-y-2">
              {rows.map((c) => {
                const status = expiryStatus(c.expiration_date);
                const style = STATUS_STYLES[status];
                const days = c.expiration_date ? daysUntil(c.expiration_date) : null;

                return (
                  <li
                    key={c.id}
                    className="flex items-center justify-between gap-4 rounded-lg border border-slate-800 bg-slate-900 px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-white">{c.name}</p>
                      <p className="text-sm text-slate-400">
                        {c.expiration_date
                          ? days !== null && days < 0
                            ? `Expired ${Math.abs(days)} days ago (${c.expiration_date})`
                            : `Expires in ${days} days (${c.expiration_date})`
                          : "No expiration — ongoing compliance"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${style.className}`}
                      >
                        {style.label}
                      </span>
                      <form action={deleteCredential}>
                        <input type="hidden" name="id" value={c.id} />
                        <button
                          type="submit"
                          className="text-sm text-slate-500 hover:text-red-400"
                          aria-label={`Delete ${c.name}`}
                        >
                          ✕
                        </button>
                      </form>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <AddCredentialForm />

        <SmsSettingsForm
          phone={profile?.phone ?? null}
          smsOptIn={profile?.sms_opt_in ?? false}
        />
      </div>
    </main>
  );
}
