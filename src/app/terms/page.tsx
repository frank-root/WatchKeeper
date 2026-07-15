import { SiteNav, SiteFooter, SkipToContent } from "@/components/site-chrome";

export const metadata = { title: "Terms of Service — Watchkeeper" };

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <SkipToContent />
      <SiteNav current="terms" />

      <article id="main-content" tabIndex={-1} className="mx-auto max-w-3xl space-y-10 px-6 py-16 text-slate-300 sm:py-20">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Terms of Service</h1>
          <p className="text-sm text-slate-500">Last updated: July 2, 2026</p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">What Watchkeeper is</h2>
          <p className="leading-relaxed">
            Watchkeeper is a reminder tool for maritime credential expiration dates. You enter
            your credentials and their dates; we remind you before they expire. By creating an
            account, you agree to these terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">The important one: reminders are a backup, not a guarantee</h2>
          <p className="leading-relaxed">
            <strong className="text-white">
              You are solely responsible for keeping your credentials current.
            </strong>{" "}
            Watchkeeper sends reminders on a best-effort basis. Emails get filtered to spam,
            texts fail to deliver, servers have outages, and renewal windows entered
            incorrectly produce incorrect reminders. Do not rely on Watchkeeper as your only
            system for tracking credentials that your job, license, or legal compliance
            depends on. Watchkeeper is not liable for lost wages, missed work, fines, or any
            other consequence of an expired credential — whether or not a reminder was sent.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Not affiliated with any authority</h2>
          <p className="leading-relaxed">
            Watchkeeper is an independent tool. It is not affiliated with, endorsed by, or
            connected to the U.S. Coast Guard, TSA, Washington State Ferries, WSDOT, or any
            government agency, employer, or union. Renewal windows shown in the app are
            general guidance — always verify requirements with the issuing authority.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Your account</h2>
          <ul className="list-disc space-y-1 pl-6 leading-relaxed">
            <li>You must provide accurate information and keep your password secure.</li>
            <li>One account per person; you&apos;re responsible for activity under your account.</li>
            <li>Don&apos;t use Watchkeeper to store other people&apos;s data without their permission.</li>
            <li>Don&apos;t attempt to probe, disrupt, or reverse-engineer the service.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">The service today</h2>
          <p className="leading-relaxed">
            Watchkeeper is currently free while in beta. Features may change, and paid tiers
            may be introduced later — existing data will never be held hostage behind a
            paywall. We may suspend accounts that abuse the service. You can stop using
            Watchkeeper anytime; email{" "}
            <a
              href="mailto:support@watchkeeper.boats"
              className="rounded-sm text-sky-400 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              support@watchkeeper.boats
            </a>{" "}
            to delete your account entirely.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Disclaimers and liability</h2>
          <p className="leading-relaxed">
            The service is provided &quot;as is&quot; without warranties of any kind, express or
            implied, including fitness for a particular purpose. To the maximum extent
            permitted by law, Watchkeeper&apos;s total liability for any claim related to the
            service is limited to the amount you paid us in the twelve months before the claim
            — which, during the free beta, is zero.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Governing law</h2>
          <p className="leading-relaxed">These terms are governed by the laws of the State of Washington, USA.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Changes</h2>
          <p className="leading-relaxed">
            If these terms materially change, we&apos;ll email account holders before the
            change takes effect. Continued use after that means you accept the new terms.
          </p>
        </section>
      </article>

      <SiteFooter current="terms" />
    </main>
  );
}
