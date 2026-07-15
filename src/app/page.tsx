import Link from "next/link";
import { CREDENTIAL_PRESETS } from "@/lib/credentials";
import { SiteNav, SiteFooter, SkipToContent } from "@/components/site-chrome";

export default function Home() {
  return (
    <main className="maritime-page min-h-screen text-[#143141]">
      <SkipToContent />
      <SiteNav current="home" />

      <div id="main-content" tabIndex={-1}>
        <section className="border-b border-[#c9d6d2] bg-[#f7fbf9]">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#007f68]">
              For working mariners
            </p>
            <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[1.02] tracking-tight text-[#050f18] sm:text-6xl lg:text-7xl">
              Credential tracker for mariners
            </h1>
          </div>
          <div className="maritime-photo" aria-hidden="true" />
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-start lg:py-10">
            <p className="max-w-3xl text-xl font-medium leading-relaxed text-[#2e4b56]">
              An expired MMC or medical cert means you&apos;re off the schedule. Watchkeeper stands
              watch over your credentials and emails you at 90, 60, and 30 days before anything
              lapses — so you never find out at the terminal.
            </p>
            <div className="lg:text-right">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-sm bg-[#0088a8] px-7 py-3.5 text-base font-black text-white shadow-sm transition-colors duration-200 hover:bg-[#006f8b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93c01f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7fbf9]"
              >
                Track your credentials — free
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="maritime-panel border-l-8 border-l-[#007f68] p-5 sm:p-7">
            <h2 className="text-2xl font-black tracking-tight text-[#050f18]">
              Built for the credentials you actually hold
            </h2>
          </div>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CREDENTIAL_PRESETS.filter((p) => p.slug !== "custom").map((p) => (
              <li
                key={p.slug}
                className="maritime-panel flex min-h-28 flex-col justify-between border-t-4 border-t-[#93c01f] p-5 text-sm transition-colors hover:border-[#8fb2ad] hover:bg-white"
              >
                <span className="text-lg font-black leading-snug text-[#143141]">{p.name}</span>
                <span className="mt-4 font-semibold text-[#557077]">
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
