"use client";

import Link from "next/link";
import { useState } from "react";
import { signup } from "@/app/auth/actions";

export function SignupForm(props: { error?: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // Instant feedback once both fields have input; the server action
  // re-checks the match as the authoritative validation.
  const mismatch = confirm.length > 0 && password !== confirm;

  return (
    <form action={signup} className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h1 className="text-lg font-semibold text-white">Create your account</h1>
      <p className="text-sm text-slate-400">
        Free while in beta. Track every credential, get reminded before anything lapses.
      </p>

      {props.error && (
        <p className="rounded-md bg-red-950 px-3 py-2 text-sm text-red-300">{props.error}</p>
      )}

      <label className="block text-sm text-slate-300">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-sky-500"
        />
      </label>

      <label className="block text-sm text-slate-300">
        Password
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-sky-500"
        />
      </label>

      <label className="block text-sm text-slate-300">
        Retype password
        <input
          name="confirm_password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={`mt-1 w-full rounded-md border bg-slate-950 px-3 py-2 text-white outline-none focus:border-sky-500 ${
            mismatch ? "border-red-700" : "border-slate-700"
          }`}
        />
        {mismatch && (
          <span className="mt-1 block text-xs text-red-400">Passwords don&apos;t match yet.</span>
        )}
      </label>

      <button
        type="submit"
        disabled={mismatch}
        className="w-full rounded-md bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Create account
      </button>

      <p className="text-center text-xs text-slate-500">
        By creating an account you agree to the{" "}
        <Link href="/terms" className="text-sky-400 hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-sky-400 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>

      <p className="text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="text-sky-400 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
