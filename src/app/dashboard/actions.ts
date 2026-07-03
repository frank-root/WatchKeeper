"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { addYearsISO, getPreset, normalizePhone } from "@/lib/credentials";

export async function addCredential(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const typeSlug = String(formData.get("credential_type") ?? "custom");
  const preset = getPreset(typeSlug);
  const name = String(formData.get("name") ?? "").trim() || preset?.name || "Credential";
  const issueDate = String(formData.get("issue_date") ?? "") || null;
  let expirationDate = String(formData.get("expiration_date") ?? "") || null;

  // Auto-calculate expiration from the preset's renewal window when not given.
  if (!expirationDate && issueDate && preset?.renewalYears) {
    expirationDate = addYearsISO(issueDate, preset.renewalYears);
  }

  const { error } = await supabase.from("credentials").insert({
    user_id: user.id,
    credential_type: typeSlug,
    name,
    issue_date: issueDate,
    expiration_date: expirationDate,
  });

  if (error) {
    redirect(`/dashboard?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard");
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
}

export async function deleteCredential(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const id = String(formData.get("id") ?? "");

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
