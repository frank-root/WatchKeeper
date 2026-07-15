import Link from "next/link";

export type PublicPage = "home" | "our-story" | "privacy" | "terms";

const linkStyles =
  "rounded-md px-2 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400";

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-4 focus:z-20 focus:rounded-md focus:bg-sky-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
    >
      Skip to content
    </a>
  );
}

export function SiteNav({ current }: { current: PublicPage }) {
  return (
    <header className="sticky top-0 z-10 border-b border-white/5 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Link
          href="/"
          className="rounded-md text-xl font-bold tracking-tight text-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        >
          ⚓ Watchkeeper
        </Link>
        <div className="flex items-center gap-1 sm:gap-3">
          <Link
            href="/our-story"
            aria-current={current === "our-story" ? "page" : undefined}
            className={`${linkStyles} hidden sm:inline-block ${
              current === "our-story" ? "text-white" : "text-slate-300 hover:text-white"
            }`}
          >
            Our Story
          </Link>
          <Link href="/login" className={`${linkStyles} text-slate-300 hover:text-white`}>
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-sky-950/50 transition-colors duration-200 hover:bg-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}

const FOOTER_LINKS: { href: string; label: string; key: PublicPage }[] = [
  { href: "/", label: "Home", key: "home" },
  { href: "/our-story", label: "Our Story", key: "our-story" },
  { href: "/privacy", label: "Privacy Policy", key: "privacy" },
  { href: "/terms", label: "Terms of Service", key: "terms" },
];

export function SiteFooter({ current }: { current: PublicPage }) {
  return (
    <footer className="border-t border-white/5 px-4 py-10 text-center text-sm text-slate-400">
      <p className="font-medium text-slate-300">⚓ Watchkeeper — credential tracker for mariners</p>
      <nav aria-label="Footer" className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {FOOTER_LINKS.filter((link) => link.key !== current).map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-md underline-offset-4 transition-colors hover:text-slate-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <p className="mt-6 text-xs text-slate-600">© {new Date().getFullYear()} Watchkeeper. All rights reserved.</p>
    </footer>
  );
}
