import Link from "next/link";
import { CREDENTIAL_PRESETS } from "@/lib/credentials";
import { SiteNav, SiteFooter } from "@/components/site-chrome";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-4 focus:z-20 focus:rounded-md focus:bg-sky-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>
      <SiteNav current="home" />

      <div id="main-content">
        <section className="mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-400">
            For working mariners
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Credential tracker for mariners
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
            An expired MMC or medical cert means you&apos;re off the schedule. Watchkeeper stands
            watch over your credentials and emails you at 90, 60, and 30 days before anything
            lapses — so you never find out at the terminal.
          </p>
          <Link
            href="/signup"
            className="mt-10 inline-flex items-center justify-center rounded-lg bg-sky-600 px-7 py-3.5 text-base font-semibold text-white shadow-sm shadow-sky-950/50 transition-colors duration-200 hover:bg-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Track your credentials — free
          </Link>
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-24 sm:pb-32">
          <h2 className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Built for the credentials you actually hold
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {CREDENTIAL_PRESETS.filter((p) => p.slug !== "custom").map((p) => (
              <li
                key={p.slug}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-5 py-4 text-sm text-slate-300 transition-colors hover:border-slate-700 hover:bg-slate-900"
              >
                <span className="font-medium text-slate-200">{p.name}</span>
                <span className="text-slate-500">
                  {p.renewalYears ? `${p.renewalYears}-year renewal` : "ongoing"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <SiteFooter current="home" />
    </main>
  );
}
