<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Public marketing pages

The public-facing pages (`src/app/page.tsx`, `src/app/privacy`, `src/app/terms`, `src/app/our-story`) share
nav/footer chrome via `src/components/site-chrome.tsx` (`SiteNav`/`SiteFooter`, keyed by a `PublicPage`
union). Add new public pages to that union and to `FOOTER_LINKS` rather than duplicating nav/footer markup.

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
