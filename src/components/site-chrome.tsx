import Link from "next/link";

export type PublicPage = "home" | "our-story" | "privacy" | "terms";

const linkStyles =
  "rounded-sm px-2 py-1 text-sm font-semibold underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93c01f] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-[#93c01f] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-[#143141] focus:outline-none"
    >
      Skip to content
    </a>
  );
}

export function SiteNav({ current }: { current: PublicPage }) {
  return (
    <header className="sticky top-0 z-20 border-b border-[#c9d6d2] bg-white shadow-sm">
      <div className="bg-[#007f68] text-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="rounded-sm text-xl font-black tracking-tight text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93c01f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#007f68]"
          >
            ⚓ Watchkeeper
          </Link>
          <div className="flex items-center gap-1 sm:gap-3">
            <Link href="/login" className={`${linkStyles} text-white hover:bg-white/10 hover:underline`}>
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-sm bg-[#93c01f] px-4 py-2 text-sm font-black text-[#173241] shadow-sm transition-colors duration-200 hover:bg-[#a7d633] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#007f68]"
            >
              Get started
            </Link>
          </div>
        </nav>
      </div>
      <nav aria-label="Public" className="mx-auto flex max-w-6xl items-center gap-5 px-4 py-3 sm:px-6">
        <Link
          href="/"
          aria-current={current === "home" ? "page" : undefined}
          className={`${linkStyles} relative text-[#143141] hover:text-[#007f68] hover:underline ${
            current === "home"
              ? "after:absolute after:-bottom-3 after:left-1/2 after:h-0 after:w-0 after:-translate-x-1/2 after:border-x-[7px] after:border-t-[7px] after:border-x-transparent after:border-t-[#93c01f]"
              : ""
          }`}
        >
          Home
        </Link>
        <div className="flex items-center gap-5">
          <Link
            href="/our-story"
            aria-current={current === "our-story" ? "page" : undefined}
            className={`${linkStyles} relative text-[#143141] hover:text-[#007f68] hover:underline ${
              current === "our-story"
                ? "after:absolute after:-bottom-3 after:left-1/2 after:h-0 after:w-0 after:-translate-x-1/2 after:border-x-[7px] after:border-t-[7px] after:border-x-transparent after:border-t-[#93c01f]"
                : ""
            }`}
          >
            Our Story
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
    <footer className="border-t-4 border-[#93c01f] bg-[#143141] px-4 py-10 text-sm text-[#d8e4e0]">
      <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-[1fr_auto] sm:items-start">
        <div>
          <p className="text-lg font-black text-white">⚓ Watchkeeper</p>
          <p className="mt-2 font-semibold text-[#d8e4e0]">credential tracker for mariners</p>
          <p className="mt-6 text-xs text-[#9fb1ad]">© {new Date().getFullYear()} Watchkeeper. All rights reserved.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 sm:justify-end">
          {FOOTER_LINKS.filter((link) => link.key !== current).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-sm font-semibold underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93c01f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#143141]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
