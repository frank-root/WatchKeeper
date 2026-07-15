import { SiteNav, SiteFooter } from "@/components/site-chrome";

export const metadata = { title: "Our Story — Watchkeeper" };

export default function OurStoryPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-4 focus:z-20 focus:rounded-md focus:bg-sky-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>
      <SiteNav current="our-story" />

      <article id="main-content" className="mx-auto max-w-3xl space-y-10 px-6 py-16 text-slate-300 sm:py-20">
        <header className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-400">
            Placeholder copy
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Our Story</h1>
          <p className="text-sm text-slate-500">
            This page is a placeholder — the captain will write the real story soon.
          </p>
          <p className="leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Why Watchkeeper</h2>
          <p className="leading-relaxed">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
            qui officia deserunt mollit anim id est laborum.
          </p>
          <p className="leading-relaxed">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
            doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
            veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Where We&apos;re Headed</h2>
          <p className="leading-relaxed">
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
            consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro
            quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
          </p>
        </section>
      </article>

      <SiteFooter current="our-story" />
    </main>
  );
}
