// Preset maritime credential types and their standard renewal windows.
// Renewal windows sourced from the vault build plan (verify against USCG/TSA
// before public launch — see projects/watchkeeper/README.md Phase 2).

export type CredentialPreset = {
  slug: string;
  name: string;
  renewalYears: number | null; // null = ongoing / no fixed expiration
  note?: string;
};

export const CREDENTIAL_PRESETS: CredentialPreset[] = [
  { slug: "mmc", name: "USCG Merchant Mariner Credential (MMC)", renewalYears: 5 },
  { slug: "stcw", name: "STCW Basic Safety Training", renewalYears: 5 },
  { slug: "twic", name: "TWIC Card", renewalYears: 5 },
  { slug: "medical", name: "Medical Certificate", renewalYears: 2, note: "Renewal window varies by age" },
  { slug: "radar", name: "Radar Observer", renewalYears: 5 },
  { slug: "drug", name: "Drug Test Enrollment", renewalYears: null, note: "Ongoing compliance — no fixed expiration" },
  { slug: "cpr", name: "First Aid / CPR", renewalYears: 2 },
  { slug: "custom", name: "Other / Custom", renewalYears: null },
];

export function getPreset(slug: string): CredentialPreset | undefined {
  return CREDENTIAL_PRESETS.find((p) => p.slug === slug);
}

// Dates are stored as plain YYYY-MM-DD strings (Postgres `date`) and compared
// on the LOCAL calendar day. On the client this is the user's own timezone, so
// a Pacific mariner's "today" doesn't flip to tomorrow at 5pm the way a UTC
// comparison would. On the server (cron) the local zone is UTC, unchanged.

// Parse a YYYY-MM-DD string into a local-midnight timestamp, or NaN if malformed.
function localMidnight(dateISO: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateISO.trim());
  if (!m) return NaN;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])).getTime();
}

export function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${mo}-${day}`;
}

export function addYearsISO(dateISO: string, years: number): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateISO.trim());
  if (!m) return dateISO; // malformed input — leave it for the caller to reject
  const year = Number(m[1]) + years;
  const month = Number(m[2]); // 1-based
  // Clamp to the last valid day of the target month so Feb 29 + N years
  // lands on Feb 28 rather than silently rolling to Mar 1.
  const lastDay = new Date(year, month, 0).getDate();
  const day = Math.min(Number(m[3]), lastDay);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// Returns NaN for a malformed date so callers can distinguish "unknown" from
// a real day count. Never silently treats bad input as valid.
export function daysUntil(dateISO: string): number {
  const target = localMidnight(dateISO);
  const today = localMidnight(todayISO());
  if (Number.isNaN(target) || Number.isNaN(today)) return NaN;
  return Math.round((target - today) / 86_400_000);
}

// Normalize a US phone number to E.164 (+1XXXXXXXXXX). Returns null if it
// can't be made valid. International numbers must already start with "+".
export function normalizePhone(input: string): string | null {
  const trimmed = input.trim();
  if (trimmed.startsWith("+")) {
    const digits = trimmed.slice(1).replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15 ? `+${digits}` : null;
  }
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

export type ExpiryStatus =
  | "expired"
  | "critical"
  | "warning"
  | "ok"
  | "ongoing"
  | "unknown";

export function expiryStatus(expirationISO: string | null): ExpiryStatus {
  if (!expirationISO) return "ongoing";
  const days = daysUntil(expirationISO);
  // A malformed date must never fall through to a safe-looking "ok" — that
  // would tell a mariner their credential is current when we can't tell.
  if (Number.isNaN(days)) return "unknown";
  if (days < 0) return "expired";
  if (days <= 30) return "critical";
  if (days <= 90) return "warning";
  return "ok";
}
