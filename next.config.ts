import type { NextConfig } from "next";

// Security response headers applied to every route. HSTS is intentionally
// omitted — Vercel already serves Strict-Transport-Security on the custom
// domain, and duplicating it here risks conflicting max-age/subdomain policy.
//
// No script-src/default-src CSP yet: Next injects inline hydration scripts, so
// a strict CSP without per-request nonces (wired through proxy.ts) would break
// the app. `frame-ancestors 'none'` is safe because it governs framing only,
// not resource loading — it stops clickjacking without touching scripts/styles.
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
