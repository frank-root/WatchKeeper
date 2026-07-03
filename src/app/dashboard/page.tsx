import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signout } from "@/app/auth/actions";
import { AddCredentialForm } from "./add-credential-form";
import { CredentialList, type CredentialRow } from "./credential-list";
import { SmsSettingsForm } from "./sms-settings-form";

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
          <CredentialList rows={rows} />
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
