"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Fixed site origin for auth redirect URLs. Never derived from the request's
// Origin header — trusting that would let an attacker point a victim's reset
// link at their own domain and capture the one-time code (account takeover).
function siteOrigin(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://watchkeeper.boats";
}

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm_password") ?? "");

  // The form checks this client-side too; this is the authoritative check.
  if (password !== confirm) {
    redirect(`/signup?error=${encodeURIComponent("Passwords don't match — please retype them.")}`);
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  // If email confirmation is enabled in Supabase, there's no session yet.
  if (!data.session) {
    redirect(`/login?message=${encodeURIComponent("Check your email to confirm your account, then sign in.")}`);
  }

  redirect("/dashboard");
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "").trim();
  const origin = siteOrigin();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=/reset-password`,
  });

  if (error) {
    redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`);
  }

  // Same message whether or not the email exists — don't leak which
  // addresses have accounts.
  redirect(`/forgot-password?message=${encodeURIComponent("If that email has an account, a reset link is on its way. Check your inbox.")}`);
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();

  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm_password") ?? "");

  if (password !== confirm) {
    redirect(`/reset-password?error=${encodeURIComponent("Passwords don't match — please retype them.")}`);
  }
  if (password.length < 8) {
    redirect(`/reset-password?error=${encodeURIComponent("Password must be at least 8 characters.")}`);
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/reset-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}
