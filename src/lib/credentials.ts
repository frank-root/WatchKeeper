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

// Dates are stored and compared as plain YYYY-MM-DD strings (Postgres `date`),
// evaluated in UTC so server and DB agree on "today".
export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addYearsISO(dateISO: string, years: number): string {
  const d = new Date(dateISO + "T00:00:00Z");
  d.setUTCFullYear(d.getUTCFullYear() + years);
  return d.toISOString().slice(0, 10);
}

export function daysUntil(dateISO: string): number {
  const target = new Date(dateISO + "T00:00:00Z").getTime();
  const today = new Date(todayISO() + "T00:00:00Z").getTime();
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

export type ExpiryStatus = "expired" | "critical" | "warning" | "ok" | "ongoing";

export function expiryStatus(expirationISO: string | null): ExpiryStatus {
  if (!expirationISO) return "ongoing";
  const days = daysUntil(expirationISO);
  if (days < 0) return "expired";
  if (days <= 30) return "critical";
  if (days <= 90) return "warning";
  return "ok";
}
