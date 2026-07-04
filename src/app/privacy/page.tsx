import Link from "next/link";

export const metadata = { title: "Privacy Policy — Watchkeeper" };

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-xl font-bold text-sky-400">
          ⚓ Watchkeeper
        </Link>
        <Link href="/terms" className="text-sm text-slate-400 hover:text-white">
          Terms of Service
        </Link>
      </nav>

      <article className="prose-invert mx-auto max-w-3xl space-y-6 px-6 py-10 text-slate-300">
        <header>
          <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
          <p className="mt-2 text-sm text-slate-400">Last updated: July 2, 2026</p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">What we collect</h2>
          <p>Watchkeeper stores only what the service needs to work:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li><strong className="text-white">Your email address</strong> — to sign you in and send expiration reminders.</li>
            <li><strong className="text-white">Your phone number</strong> — only if you opt in to SMS reminders, along with the date and time you gave consent.</li>
            <li><strong className="text-white">Credential details you enter</strong> — credential type, issue date, and expiration date. We never ask for credential numbers, document scans, or other identifying details, and you shouldn&apos;t enter them.</li>
          </ul>
          <p>We do not collect payment information, location data, or analytics profiles, and we do not use advertising trackers.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">How we use it</h2>
          <p>
            One purpose: telling you before your maritime credentials expire. We email you at
            90, 60, and 30 days before an expiration date, and text you the same reminders if
            you opted in. That&apos;s it — no marketing lists, no selling or renting your data,
            no sharing with data brokers, ever.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Who processes your data</h2>
          <p>Watchkeeper runs on a small set of service providers, each handling only what their role requires:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li><strong className="text-white">Supabase</strong> — database and authentication (stores your account and credential entries).</li>
            <li><strong className="text-white">Resend</strong> — sends reminder emails.</li>
            <li><strong className="text-white">Twilio</strong> — sends SMS reminders, if you opted in.</li>
            <li><strong className="text-white">Vercel</strong> — hosts the website.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Cookies</h2>
          <p>
            We use only the cookies required to keep you signed in. There are no third-party,
            advertising, or analytics cookies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">SMS consent</h2>
          <p>
            SMS reminders are strictly opt-in. You can stop them anytime by unchecking the SMS
            box on your dashboard or replying STOP to any message. Message and data rates may
            apply. Your phone number is never used for anything except credential reminders.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Your data, your call</h2>
          <p>
            You can delete any credential from your dashboard instantly. To delete your entire
            account and all associated data, email{" "}
            <a href="mailto:support@watchkeeper.boats" className="text-sky-400 hover:underline">
              support@watchkeeper.boats
            </a>{" "}
            and it will be removed within 30 days.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Changes</h2>
          <p>
            If this policy changes in a way that matters, we&apos;ll email you before the change
            takes effect.
          </p>
        </section>
      </article>

      <footer className="border-t border-slate-900 py-8 text-center text-sm text-slate-400">
        <Link href="/" className="underline hover:text-slate-200">Home</Link>
        {" · "}
        <Link href="/terms" className="underline hover:text-slate-200">Terms of Service</Link>
      </footer>
    </main>
  );
}
