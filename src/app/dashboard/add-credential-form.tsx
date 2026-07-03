"use client";

import { useMemo, useState } from "react";
import { CREDENTIAL_PRESETS, addYearsISO, getPreset } from "@/lib/credentials";
import { addCredential } from "./actions";

export function AddCredentialForm() {
  const [typeSlug, setTypeSlug] = useState("mmc");
  const [issueDate, setIssueDate] = useState("");
  const [expirationOverride, setExpirationOverride] = useState("");

  const preset = getPreset(typeSlug);

  const autoExpiration = useMemo(() => {
    if (!issueDate || !preset?.renewalYears) return "";
    return addYearsISO(issueDate, preset.renewalYears);
  }, [issueDate, preset]);

  return (
    <form
      action={addCredential}
      className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-5"
    >
      <h2 className="font-semibold text-white">Add a license</h2>

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
            value={expirationOverride || autoExpiration}
            onChange={(e) => setExpirationOverride(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-sky-500"
          />
          {autoExpiration && !expirationOverride && (
            <span className="mt-1 block text-xs text-slate-500">
              Auto-calculated: {preset?.renewalYears}-year renewal. Edit if yours differs.
            </span>
          )}
        </label>
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-500"
      >
        Add credential
      </button>
    </form>
  );
}
