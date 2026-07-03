import Link from "next/link";
import { CREDENTIAL_PRESETS } from "@/lib/credentials";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
        <span className="text-xl font-bold text-sky-400">⚓ Watchkeeper</span>
        <div className="space-x-4 text-sm">
          <Link href="/login" className="text-slate-300 hover:text-white">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-sky-600 px-4 py-2 font-medium hover:bg-sky-500"
          >
            Get started
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
          Credential tracker for mariners
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">
          An expired MMC or medical cert means you&apos;re off the schedule. Watchkeeper stands
          watch over your credentials and emails you at 90, 60, and 30 days before anything
          lapses — so you never find out at the terminal.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-block rounded-md bg-sky-600 px-6 py-3 font-medium hover:bg-sky-500"
        >
          Track your credentials — free
        </Link>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-20">
        <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-slate-500">
          Built for the credentials you actually hold
        </h2>
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {CREDENTIAL_PRESETS.filter((p) => p.slug !== "custom").map((p) => (
            <li
              key={p.slug}
              className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-300"
            >
              {p.name}
              <span className="float-right text-slate-500">
                {p.renewalYears ? `${p.renewalYears}-year renewal` : "ongoing"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="border-t border-slate-900 py-8 text-center text-sm text-slate-600">
        <p>Watchkeeper — credential tracker for mariners</p>
        <p className="mt-2">
          <Link href="/privacy" className="hover:text-slate-400">Privacy Policy</Link>
          {" · "}
          <Link href="/terms" className="hover:text-slate-400">Terms of Service</Link>
        </p>
      </footer>
    </main>
  );
}
