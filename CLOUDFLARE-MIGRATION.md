# Cloudflare migration checklist — GrowthKavach v3

This branch is an isolated migration candidate. Do not merge to main or disable GitHub Pages until Cloudflare preview passes. No paid services or other repositories are required.

## 1. Provision the free project

In Cloudflare Workers & Pages, create a **Pages** project named growthkavach (or available equivalent), connect the existing GitHub repository, and initially select branch **cloudflare-ready**. Build command: npm run build. Output directory: dist. Root directory: repository root. Use Node 22. Cloudflare discovers the root functions directory. Do not use dashboard Direct Upload, which does not support Functions. Do not enable a paid plan.

## 2. Database and environment configuration

Create a new D1 database named growthkavach-db on the Free plan. Run migrations/0001_initial.sql in the D1 console or using Wrangler with the correct account and database. In Pages project Settings / Bindings, bind the database as DB, for the intended environment. Add a secret QUOTA_SALT containing at least 32 random characters, generated locally (never commit it). Set AUDIT_HOSTS to moneykavach.in initially. Only add explicitly approved, controlled public HTTPS hostnames after verifying ownership, DNS and expected endpoints. No wildcards, IP addresses, user-supplied arbitrary hosts, query strings, encoded paths or redirects are supported. The pilot is not a general-purpose crawler; DNS rebinding and arbitrary-domain crawling require separate security review.

Optional AI (disabled by default): set GEMINI_API_KEY as a server secret, GEMINI_MODEL to a model verified to be available on a dedicated free-tier project, AI_ENABLED=true and AI_DAILY_CAP to a conservative value (default 20, maximum 100). Do not share keys or assume quotas are independent if the same Google project is used elsewhere. Leave paid billing disabled. Do not enter personal information in prompts. Set bindings/secrets in the correct environment and redeploy. No secrets should be added to GitHub or frontend HTML.

## 3. Validate before moving

- Run GitHub Actions Cloudflare migration validation (npm test and npm run build).
- Check the Pages deployment build logs and open its actual assigned preview URL.
- GET /api/health: configured true only means bindings are detected, not that D1 or external requests work.
- Open Site audit & reports and audit https://moneykavach.in/ with 1 page, then 5 pages; inspect HTTP states and metadata. Test robots-denied behavior and explicit failed/unverified states. The runtime is not yet verified; Workers Free CPU and subrequest limits may require a smaller page budget.
- Reject off-host, http, credential-bearing, query-string and custom-port URLs.
- Check five per-IP daily requests per operation kind (audits and server file checks share the audit bucket), six audit requests/minute globally, 100 audits/day globally, and cached results (24-hour TTL). IP hashes are HMACed; this is not account-level authentication. Limits apply per UTC day. Cache results contain approved public URLs and metadata; audit events retained approximately 7 days with request-driven cleanup. Preview and production bindings must be planned so their usage is not accidentally doubled.
- Verify 11 existing tools, new social metadata, mobile layout, downloaded reports, local saved audits, and optional AI only after quota/key verification. Test no secrets are exposed.
- Check actual Cloudflare Free usage and disable endpoints if limits are reached. Free quotas are account-wide; other projects may share usage. No claim of guaranteed zero cost on a paid account.

## 4. Cutover together

When the preview works, merge the validated branch into main after reviewing any intervening changes. Switch Pages production branch to main and verify the public homepage and API on the actual Pages URL. Keep the old GitHub Pages URL working until Cloudflare is verified; optionally use a clearly labeled link there afterward. No custom domain or DNS change needed for initial pages.dev deployment. Never touch MoneyKavach, Career-Ops, GharWatt or EnquiryFlow configuration. Rollback: redeploy the last known-good Pages deployment, leave GitHub Pages available, disable AI and remove database binding if necessary.

## Scope

14 tools in v3: 11 v2 tools, approved-host server-side SEO audits, optional AI suggestions and device-local saved reports. Server audits sample up to 10 HTML pages with robots checks, HTTP status, metadata, headings, image alt, duplicate titles within sample and noindex. Reports export as text. The sitemap and robots checker also has a backend option limited to root sitemap.xml and robots.txt on approved hosts. No JavaScript rendering, all-page crawl, verified Google index status, Search Console OAuth, live competitor ranks, keyword volumes, backlinks, automatic monitoring, cloud-synced accounts or payments in this release. These are future work, not fake results.

References: https://developers.cloudflare.com/pages/functions/get-started/ ; https://developers.cloudflare.com/pages/functions/bindings/ ; https://developers.cloudflare.com/pages/functions/pricing/ ; https://developers.cloudflare.com/d1/platform/limits/ ; https://ai.google.dev/gemini-api/docs/get-started

Server file smoke test: use the sitemap and robots panel's Fetch via backend button; verify correct XML and text, explicit HTTP errors, disallowed paths, and quota sharing. Robots pattern matching is bounded and conservatively rejects unsupported patterns. A public-site allowlist is not a substitute for an SSRF security review before arbitrary-domain access.

## Visual dashboard and audit-based AI

The dashboard counts analyzed pages, no-findings pages, pages needing review, and unverified pages separately. The priority list is a deterministic heuristic, not a ranking score. The AI button sends the report identity to the server; the server retrieves the matching unexpired D1 cached audit before sending bounded metadata and findings to Gemini. AI remains disabled until explicitly configured. Test the dashboard with mixed results; then, after AI setup, verify the audit explanation matches the displayed report and the general AI assistant still works. AI requests share the existing daily and per-minute limits. A missing or changed cached report is rejected rather than silently substituted.
