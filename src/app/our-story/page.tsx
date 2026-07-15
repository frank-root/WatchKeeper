import { SiteNav, SiteFooter, SkipToContent } from "@/components/site-chrome";

export const metadata = { title: "Our Story — Watchkeeper" };

export default function OurStoryPage() {
  return (
    <main className="maritime-page min-h-screen text-[#143141]">
      <SkipToContent />
      <SiteNav current="our-story" />

      <article id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <h1 className="text-5xl font-black tracking-tight text-[#050f18] sm:text-6xl">Our Story</h1>
          </div>
          <p className="maritime-panel border-l-8 border-l-[#93c01f] p-5 text-lg font-medium leading-relaxed text-[#2e4b56]">
            Watchkeeper started with my dad. He&apos;s spent his life doing hard, honest work on the
            water — the kind of job where showing up is everything. Then one week, he couldn&apos;t.
            His TWIC card had expired and no one had told him: no warning, no reminder, just a
            card that quietly ran out and a week of work he never got back.
          </p>
        </header>

        <div className="maritime-photo mt-10 min-h-64" aria-hidden="true" />

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="maritime-panel space-y-3 border-t-4 border-t-[#007f68] p-6">
            <h2 className="text-2xl font-black text-[#050f18]">Why Watchkeeper</h2>
            <p className="leading-relaxed text-[#2e4b56]">
              That week shouldn&apos;t have happened. My dad didn&apos;t cut a corner — he was just never
              given a heads-up. A credential&apos;s expiration date sits buried in a wallet or a drawer,
              and for most mariners the first reminder comes too late: at the gate, at the terminal,
              at the start of a hitch they can no longer take.
            </p>
            <p className="leading-relaxed text-[#2e4b56]">
              I built Watchkeeper so that never happens to him again — or to anyone who works as
              hard as he does. You add your credentials once, and Watchkeeper keeps watch, sending a
              reminder by email and text at 90, 60, and 30 days before anything expires. Plenty of
              warning, every time. No lost weeks, no surprises at the gate.
            </p>
          </section>

          <section className="maritime-panel space-y-3 border-t-4 border-t-[#0088a8] p-6">
            <h2 className="text-2xl font-black text-[#050f18]">Where we&apos;re headed</h2>
            <p className="leading-relaxed text-[#2e4b56]">
              Watchkeeper will always be built for the people who keep this industry moving — not
              for spreadsheets, and not for data brokers. It stays simple, private, and honest: we
              track your dates, we warn you before they pass, and we never sell your information.
              Every decision we make comes back to the question that started it all — does this make
              a hardworking mariner&apos;s life a little easier?
            </p>
          </section>
        </div>
      </article>

      <SiteFooter current="our-story" />
    </main>
  );
}
