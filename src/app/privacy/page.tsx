import { SiteNav, SiteFooter, SkipToContent } from "@/components/site-chrome";

export const metadata = { title: "Privacy Policy — Watchkeeper" };

export default function PrivacyPage() {
  return (
    <main className="maritime-page min-h-screen text-[#143141]">
      <SkipToContent />
      <SiteNav current="privacy" />

      <article id="main-content" tabIndex={-1} className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="maritime-panel border-l-8 border-l-[#007f68] p-6 sm:p-8">
          <h1 className="text-4xl font-black tracking-tight text-[#050f18] sm:text-5xl">Privacy Policy</h1>
          <p className="mt-3 text-sm font-semibold text-[#557077]">Last updated: July 2, 2026</p>
        </header>

        <div className="mt-8 space-y-6">
        <section className="maritime-panel space-y-3 border-t-4 border-t-[#93c01f] p-6">
          <h2 className="text-2xl font-black text-[#050f18]">What we collect</h2>
          <p className="leading-relaxed text-[#2e4b56]">Watchkeeper stores only what the service needs to work:</p>
          <ul className="list-disc space-y-1 pl-6 leading-relaxed">
            <li><strong className="text-[#050f18]">Your email address</strong> — to sign you in and send expiration reminders.</li>
            <li><strong className="text-[#050f18]">Your phone number</strong> — only if you opt in to SMS reminders, along with the date and time you gave consent.</li>
            <li><strong className="text-[#050f18]">Credential details you enter</strong> — credential type, issue date, and expiration date. We never ask for credential numbers, document scans, or other identifying details, and you shouldn&apos;t enter them.</li>
          </ul>
          <p className="leading-relaxed text-[#2e4b56]">We do not collect payment information, location data, or analytics profiles, and we do not use advertising trackers.</p>
        </section>

        <section className="maritime-panel space-y-3 border-t-4 border-t-[#0088a8] p-6">
          <h2 className="text-2xl font-black text-[#050f18]">How we use it</h2>
          <p className="leading-relaxed text-[#2e4b56]">
            One purpose: telling you before your maritime credentials expire. We email you at
            90, 60, and 30 days before an expiration date, and text you the same reminders if
            you opted in. That&apos;s it — no marketing lists, no selling or renting your data,
            no sharing with data brokers, ever.
          </p>
        </section>

        <section className="maritime-panel space-y-3 border-t-4 border-t-[#007f68] p-6">
          <h2 className="text-2xl font-black text-[#050f18]">Who processes your data</h2>
          <p className="leading-relaxed text-[#2e4b56]">Watchkeeper runs on a small set of service providers, each handling only what their role requires:</p>
          <ul className="list-disc space-y-1 pl-6 leading-relaxed">
            <li><strong className="text-[#050f18]">Supabase</strong> — database and authentication (stores your account and credential entries).</li>
            <li><strong className="text-[#050f18]">Resend</strong> — sends reminder emails.</li>
            <li><strong className="text-[#050f18]">Twilio</strong> — sends SMS reminders, if you opted in.</li>
            <li><strong className="text-[#050f18]">Vercel</strong> — hosts the website.</li>
          </ul>
        </section>

        <section className="maritime-panel space-y-3 border-t-4 border-t-[#93c01f] p-6">
          <h2 className="text-2xl font-black text-[#050f18]">Cookies</h2>
          <p className="leading-relaxed text-[#2e4b56]">
            We use only the cookies required to keep you signed in. There are no third-party,
            advertising, or analytics cookies.
          </p>
        </section>

        <section className="maritime-panel space-y-3 border-t-4 border-t-[#0088a8] p-6">
          <h2 className="text-2xl font-black text-[#050f18]">SMS consent</h2>
          <p className="leading-relaxed text-[#2e4b56]">
            SMS reminders are strictly opt-in. You can stop them anytime by unchecking the SMS
            box on your dashboard or replying STOP to any message. Message and data rates may
            apply. Your phone number is never used for anything except credential reminders.
          </p>
        </section>

        <section className="maritime-panel space-y-3 border-t-4 border-t-[#007f68] p-6">
          <h2 className="text-2xl font-black text-[#050f18]">Your data, your call</h2>
          <p className="leading-relaxed text-[#2e4b56]">
            You can delete any credential from your dashboard instantly. To delete your entire
            account and all associated data, email{" "}
            <a
              href="mailto:support@watchkeeper.boats"
              className="maritime-link rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93c01f]"
            >
              support@watchkeeper.boats
            </a>{" "}
            and it will be removed within 30 days.
          </p>
        </section>

        <section className="maritime-panel space-y-3 border-t-4 border-t-[#93c01f] p-6">
          <h2 className="text-2xl font-black text-[#050f18]">Changes</h2>
          <p className="leading-relaxed text-[#2e4b56]">
            If this policy changes in a way that matters, we&apos;ll email you before the change
            takes effect.
          </p>
        </section>
        </div>
      </article>

      <SiteFooter current="privacy" />
    </main>
  );
}
