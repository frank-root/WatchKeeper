"use client";

import { useOptimistic, useTransition } from "react";
import { daysUntil, expiryStatus, type ExpiryStatus } from "@/lib/credentials";
import { deleteCredential } from "./actions";

export type CredentialRow = {
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

export function CredentialList({ rows }: { rows: CredentialRow[] }) {
  const [, startTransition] = useTransition();
  // Optimistic UI: the row disappears immediately; the server delete and
  // revalidation catch up in the background. If the delete fails, the
  // revalidated server data brings the row back.
  const [optimisticRows, removeOptimistic] = useOptimistic(
    rows,
    (state, id: string) => state.filter((r) => r.id !== id)
  );

  function handleDelete(id: string) {
    startTransition(async () => {
      removeOptimistic(id);
      await deleteCredential(id);
    });
  }

  if (optimisticRows.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-800 p-8 text-center text-slate-500">
        Nothing tracked yet — add your first credential below and Watchkeeper will email
        you at 90, 60, and 30 days before it expires.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {optimisticRows.map((c) => {
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
              <button
                type="button"
                onClick={() => handleDelete(c.id)}
                className="text-sm text-slate-500 hover:text-red-400"
                aria-label={`Delete ${c.name}`}
              >
                ✕
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
