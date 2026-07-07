"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { addYearsISO, getPreset, normalizePhone } from "@/lib/credentials";

export type AddCredentialResult = { error: string } | { success: string };

// True only for a real YYYY-MM-DD calendar date. Rejects both malformed
// strings and impossible dates like 2026-02-30 (which would otherwise reach
// the Postgres `date` column and surface a raw driver error to the user).
function isValidDateISO(s: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dt = new Date(y, mo - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === mo - 1 && dt.getDate() === d;
}

// Normalizes the credential fields from a form and validates them. Returns the
// cleaned values, or an error string. Shared by add and update.
function parseCredentialForm(
  formData: FormData
): { error: string } | { typeSlug: string; name: string; issueDate: string | null; expirationDate: string | null } {
  // Only trust known preset slugs; anything else collapses to "custom".
  const rawType = String(formData.get("credential_type") ?? "custom");
  const typeSlug = getPreset(rawType) ? rawType : "custom";
  const preset = getPreset(typeSlug);
  const name = String(formData.get("name") ?? "").trim() || preset?.name || "Credential";
  const issueDate = String(formData.get("issue_date") ?? "") || null;
  let expirationDate = String(formData.get("expiration_date") ?? "") || null;

  // Auto-calculate expiration from the preset's renewal window when not given.
  if (!expirationDate && issueDate && preset?.renewalYears) {
    expirationDate = addYearsISO(issueDate, preset.renewalYears);
  }

  if (issueDate && !isValidDateISO(issueDate)) {
    return { error: "Please enter a valid issue date." };
  }
  if (expirationDate && !isValidDateISO(expirationDate)) {
    return { error: "Please enter a valid expiration date." };
  }
  // ISO date strings (YYYY-MM-DD) compare correctly as plain strings.
  if (issueDate && expirationDate && expirationDate <= issueDate) {
    return { error: "Invalid dates — the expiration date must be after the issue date." };
  }

  return { typeSlug, name, issueDate, expirationDate };
}

// Returns a result instead of redirecting so the form can clear itself and
// show a success flash without a page round trip.
export async function addCredential(formData: FormData): Promise<AddCredentialResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = parseCredentialForm(formData);
  if ("error" in parsed) return parsed;
  const { typeSlug, name, issueDate, expirationDate } = parsed;

  const { error } = await supabase.from("credentials").insert({
    user_id: user.id,
    credential_type: typeSlug,
    name,
    issue_date: issueDate,
    expiration_date: expirationDate,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");

  return {
    success: expirationDate
      ? `${name} added — we'll email you 90, 60, and 30 days before ${expirationDate}.`
      : `${name} added — ongoing compliance, no expiration to track.`,
  };
}

// Edit an existing credential. RLS + the explicit user_id filter both scope
// the update to the owner.
export async function updateCredential(formData: FormData): Promise<AddCredentialResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing credential id." };

  const parsed = parseCredentialForm(formData);
  if ("error" in parsed) return parsed;
  const { typeSlug, name, issueDate, expirationDate } = parsed;

  const { error } = await supabase
    .from("credentials")
    .update({
      credential_type: typeSlug,
      name,
      issue_date: issueDate,
      expiration_date: expirationDate,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: `${name} updated.` };
}

export async function updateSmsSettings(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const optIn = formData.get("sms_opt_in") === "on";
  const rawPhone = String(formData.get("phone") ?? "");
  const phone = rawPhone.trim() ? normalizePhone(rawPhone) : null;

  if (rawPhone.trim() && !phone) {
    redirect(`/dashboard?error=${encodeURIComponent("That phone number doesn't look valid — use a 10-digit US number or full +country format.")}`);
  }
  if (optIn && !phone) {
    redirect(`/dashboard?error=${encodeURIComponent("Add a phone number to turn on SMS reminders.")}`);
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      phone,
      sms_opt_in: optIn,
      // Record when consent was given; clear it when they opt out.
      sms_opt_in_at: optIn ? new Date().toISOString() : null,
    })
    .eq("id", user.id);

  if (error) {
    redirect(`/dashboard?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard");
  // Redirect to a clean URL — otherwise a stale ?error= from an earlier
  // failed save stays visible after a successful one.
  redirect("/dashboard");
}

// Called directly from the client (optimistic delete), so it takes the id
// as a plain argument instead of FormData.
export async function deleteCredential(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // RLS also enforces ownership; the user_id filter is belt-and-suspenders.
  const { error } = await supabase
    .from("credentials")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    redirect(`/dashboard?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard");
}
