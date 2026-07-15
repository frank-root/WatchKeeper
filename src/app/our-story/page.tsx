import { SiteNav, SiteFooter, SkipToContent } from "@/components/site-chrome";

export const metadata = { title: "Our Story — Watchkeeper" };

export default function OurStoryPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <SkipToContent />
      <SiteNav current="our-story" />

      <article id="main-content" tabIndex={-1} className="mx-auto max-w-3xl space-y-10 px-6 py-16 text-slate-300 sm:py-20">
        <header className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Our Story</h1>
          <p className="leading-relaxed">
            Watchkeeper started with my dad. He&apos;s spent his life doing hard, honest work on the
            water — the kind of job where showing up is everything. Then one week, he couldn&apos;t.
            His TWIC card had expired and no one had told him: no warning, no reminder, just a
            card that quietly ran out and a week of work he never got back.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Why Watchkeeper</h2>
          <p className="leading-relaxed">
            That week shouldn&apos;t have happened. My dad didn&apos;t cut a corner — he was just never
            given a heads-up. A credential&apos;s expiration date sits buried in a wallet or a drawer,
            and for most mariners the first reminder comes too late: at the gate, at the terminal,
            at the start of a hitch they can no longer take.
          </p>
          <p className="leading-relaxed">
            I built Watchkeeper so that never happens to him again — or to anyone who works as
            hard as he does. You add your credentials once, and Watchkeeper keeps watch, sending a
            reminder by email and text at 90, 60, and 30 days before anything expires. Plenty of
            warning, every time. No lost weeks, no surprises at the gate.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Where we&apos;re headed</h2>
          <p className="leading-relaxed">
            Watchkeeper will always be built for the people who keep this industry moving — not
            for spreadsheets, and not for data brokers. It stays simple, private, and honest: we
            track your dates, we warn you before they pass, and we never sell your information.
            Every decision we make comes back to the question that started it all — does this make
            a hardworking mariner&apos;s life a little easier?
          </p>
        </section>
      </article>

      <SiteFooter current="our-story" />
    </main>
  );
}
