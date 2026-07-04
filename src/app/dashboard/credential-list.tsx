"use client";

import { useRef, useState, useTransition } from "react";
import {
  CREDENTIAL_PRESETS,
  daysUntil,
  expiryStatus,
  getPreset,
  type ExpiryStatus,
} from "@/lib/credentials";
import { deleteCredential, updateCredential } from "./actions";

export type CredentialRow = {
  id: string;
  credential_type: string;
  name: string;
  issue_date: string | null;
  expiration_date: string | null;
};

const STATUS_STYLES: Record<ExpiryStatus, { label: string; className: string }> = {
  expired: { label: "Expired", className: "bg-red-950 text-red-300 border-red-800" },
  critical: { label: "Renew now", className: "bg-red-950 text-red-300 border-red-800" },
  warning: { label: "Expiring soon", className: "bg-amber-950 text-amber-300 border-amber-800" },
  ok: { label: "Current", className: "bg-emerald-950 text-emerald-300 border-emerald-800" },
  ongoing: { label: "No expiry", className: "bg-slate-800 text-slate-300 border-slate-700" },
  unknown: { label: "Check date", className: "bg-amber-950 text-amber-300 border-amber-800" },
};

// Undo window before a delete actually hits the server.
const UNDO_MS = 5000;

// Format a stored YYYY-MM-DD as a locale date (e.g. "May 14, 2027").
function formatDate(dateISO: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateISO);
  if (!m) return dateISO;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function expiryText(expiration: string | null): string {
  if (!expiration) return "Doesn't expire — ongoing";
  const days = daysUntil(expiration);
  if (Number.isNaN(days)) return "Expiration date looks invalid — please edit it";
  if (days < 0) return `Expired ${Math.abs(days)} days ago (${formatDate(expiration)})`;
  if (days === 0) return `Expires today (${formatDate(expiration)})`;
  return `Expires in ${days} days (${formatDate(expiration)})`;
}

export function CredentialList({ rows }: { rows: CredentialRow[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, setPending] = useState<{ id: string; name: string }[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const [, startTransition] = useTransition();

  const pendingIds = new Set(pending.map((p) => p.id));
  const visibleRows = rows.filter((r) => !pendingIds.has(r.id));

  function commitDelete(id: string) {
    const t = timers.current.get(id);
    if (t) clearTimeout(t);
    timers.current.delete(id);
    setPending((prev) => prev.filter((p) => p.id !== id));
    startTransition(() => {
      deleteCredential(id);
    });
  }

  // Hide the row immediately but defer the server delete, so "Undo" is a true
  // cancel (no re-insert needed) rather than a best-effort restore.
  function scheduleDelete(row: CredentialRow) {
    if (editingId === row.id) setEditingId(null);
    setPending((prev) => [...prev, { id: row.id, name: row.name }]);
    timers.current.set(row.id, setTimeout(() => commitDelete(row.id), UNDO_MS));
  }

  function undoDelete(id: string) {
    const t = timers.current.get(id);
    if (t) clearTimeout(t);
    timers.current.delete(id);
    setPending((prev) => prev.filter((p) => p.id !== id));
  }

  if (visibleRows.length === 0 && pending.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-800 p-8 text-center text-slate-500">
        Nothing tracked yet — add your first credential below and Watchkeeper will email
        you at 90, 60, and 30 days before it expires.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {pending.map((p) => (
        <div
          key={p.id}
          className="flex items-center justify-between gap-4 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-300"
        >
          <span>
            Deleted <span className="font-medium text-white">{p.name}</span>.
          </span>
          <button
            type="button"
            onClick={() => undoDelete(p.id)}
            className="font-medium text-sky-400 hover:text-sky-300"
          >
            Undo
          </button>
        </div>
      ))}

      <ul className="space-y-2">
        {visibleRows.map((c) =>
          editingId === c.id ? (
            <li key={c.id}>
              <EditRow
                credential={c}
                onDone={() => setEditingId(null)}
                onCancel={() => setEditingId(null)}
              />
            </li>
          ) : (
            <li
              key={c.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-slate-800 bg-slate-900 px-4 py-3"
            >
              <div>
                <p className="font-medium text-white">{c.name}</p>
                <p className="text-sm text-slate-400">{expiryText(c.expiration_date)}</p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${
                    STATUS_STYLES[expiryStatus(c.expiration_date)].className
                  }`}
                >
                  {STATUS_STYLES[expiryStatus(c.expiration_date)].label}
                </span>
                <button
                  type="button"
                  onClick={() => setEditingId(c.id)}
                  className="text-sm text-slate-400 hover:text-sky-400"
                  aria-label={`Edit ${c.name}`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => scheduleDelete(c)}
                  className="text-sm text-slate-500 hover:text-red-400"
                  aria-label={`Delete ${c.name}`}
                >
                  Delete
                </button>
              </div>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

function EditRow({
  credential,
  onDone,
  onCancel,
}: {
  credential: CredentialRow;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [typeSlug, setTypeSlug] = useState(
    getPreset(credential.credential_type) ? credential.credential_type : "custom"
  );
  const [name, setName] = useState(credential.name);
  const [issueDate, setIssueDate] = useState(credential.issue_date ?? "");
  const [expiration, setExpiration] = useState(credential.expiration_date ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const invalidDates = issueDate !== "" && expiration !== "" && expiration <= issueDate;

  async function save() {
    if (invalidDates) return;
    setSaving(true);
    setError(null);
    const fd = new FormData();
    fd.set("id", credential.id);
    fd.set("credential_type", typeSlug);
    fd.set("name", typeSlug === "custom" ? name : "");
    fd.set("issue_date", issueDate);
    fd.set("expiration_date", expiration);
    const res = await updateCredential(fd);
    setSaving(false);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    onDone();
  }

  return (
    <div className="space-y-3 rounded-lg border border-sky-800 bg-slate-900 px-4 py-3">
      {error && (
        <p className="rounded-md bg-red-950 px-3 py-2 text-sm text-red-300">{error}</p>
      )}

      <label className="block text-sm text-slate-300">
        Credential type
        <select
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
      </label>

      {typeSlug === "custom" && (
        <label className="block text-sm text-slate-300">
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-sky-500"
          />
        </label>
      )}

      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm text-slate-300">
          Issue date
          <input
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-sky-500"
          />
        </label>
        <label className="block text-sm text-slate-300">
          Expiration date
          <input
            type="date"
            value={expiration}
            onChange={(e) => setExpiration(e.target.value)}
            className={`mt-1 w-full rounded-md border bg-slate-950 px-3 py-2 text-white outline-none focus:border-sky-500 ${
              invalidDates ? "border-red-700" : "border-slate-700"
            }`}
          />
        </label>
      </div>

      {invalidDates && (
        <p className="text-xs text-red-400">
          Invalid dates — the expiration date must be after the issue date.
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={save}
          disabled={invalidDates || saving}
          className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
