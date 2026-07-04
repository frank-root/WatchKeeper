"use client";

import { useMemo, useRef, useState } from "react";
import { CREDENTIAL_PRESETS, addYearsISO, getPreset } from "@/lib/credentials";
import { addCredential } from "./actions";

export function AddCredentialForm() {
  const [typeSlug, setTypeSlug] = useState("mmc");
  const [issueDate, setIssueDate] = useState("");
  const [expirationOverride, setExpirationOverride] = useState("");
  const [flash, setFlash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const preset = getPreset(typeSlug);

  const autoExpiration = useMemo(() => {
    if (!issueDate || !preset?.renewalYears) return "";
    return addYearsISO(issueDate, preset.renewalYears);
  }, [issueDate, preset]);

  // ISO date strings compare correctly as plain strings.
  const effectiveExpiration = expirationOverride || autoExpiration;
  const invalidDates =
    issueDate !== "" && effectiveExpiration !== "" && effectiveExpiration <= issueDate;

  async function handleAction(formData: FormData) {
    const result = await addCredential(formData);

    if ("error" in result) {
      setFlash(null);
      setError(result.error);
      return;
    }

    // Success: clear the form so a second press can't double-add,
    // and confirm that reminders are armed.
    setError(null);
    setTypeSlug("mmc");
    setIssueDate("");
    setExpirationOverride("");
    setFlash(result.success);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(null), 6000);
  }

  return (
    <form
      action={handleAction}
      className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-5"
    >
      <h2 className="font-semibold text-white">Add a credential</h2>

      {flash && (
        <p className="rounded-md bg-emerald-950 px-3 py-2 text-sm text-emerald-300">
          ✓ {flash}
        </p>
      )}
      {error && (
        <p className="rounded-md bg-red-950 px-3 py-2 text-sm text-red-300">{error}</p>
      )}

      <label className="block text-sm text-slate-300">
        Credential type
        <select
          name="credential_type"
          value={typeSlug}
          onChange={(e) => setTypeSlug(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-sky-500"
        >
          {CREDENTIAL_PRESETS.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
        {preset?.note && <span className="mt-1 block text-xs text-slate-500">{preset.note}</span>}
      </label>

      {typeSlug === "custom" && (
        <label className="block text-sm text-slate-300">
          Name
          <input
            name="name"
            type="text"
            required
            placeholder="e.g. Tankerman PIC"
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-sky-500"
          />
        </label>
      )}

      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm text-slate-300">
          Issue date
          <input
            name="issue_date"
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-sky-500"
          />
        </label>

        <label className="block text-sm text-slate-300">
          Expiration date
          <input
            name="expiration_date"
            type="date"
            value={effectiveExpiration}
            onChange={(e) => setExpirationOverride(e.target.value)}
            className={`mt-1 w-full rounded-md border bg-slate-950 px-3 py-2 text-white outline-none focus:border-sky-500 ${
              invalidDates ? "border-red-700" : "border-slate-700"
            }`}
          />
          {autoExpiration && !expirationOverride && (
            <span className="mt-1 block text-xs text-slate-500">
              Auto-calculated: {preset?.renewalYears}-year renewal. Edit if yours differs.
            </span>
          )}
        </label>
      </div>

      {invalidDates && (
        <p className="rounded-md bg-red-950 px-3 py-2 text-sm text-red-300">
          Invalid dates — the expiration date must be after the issue date.
        </p>
      )}

      <button
        type="submit"
        disabled={invalidDates}
        className="w-full rounded-md bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Add credential
      </button>
    </form>
  );
}
