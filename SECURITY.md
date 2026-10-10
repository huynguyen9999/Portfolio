# Security and production checks

This is a statically rendered public portfolio. There are no login sessions, user-submitted content, forms, server actions, database credentials, payment flows, microphone capture, or outbound application API calls. The résumé is intentionally public. External project sites have their own security boundaries.

## Browser defenses

Responses set CSP, MIME sniffing protection, frame denial, strict-origin referrer policy, restricted device permissions, and one-year HTTPS transport policy. Fonts and scripts are served locally. CSP blocks external scripts/connections, framing, plugins, base-tag changes, and form submissions. Production disallows JavaScript eval. No secrets or source maps are intentionally published. New external services must be explicitly reviewed before widening this policy.

Static Next.js hydration requires inline scripts. The current CSP permits inline scripts and styles; it therefore is **not a strict XSS-prevention policy**. React escapes the portfolio's static data, and there is no raw HTML insertion or user-content rendering. Nonces would require dynamic rendering; do not silently enable that or introduce experimental integrity tooling to make a scanner score appear better. Reevaluate this decision before accepting user content or adding third-party scripts.

`SITE_URL`, when supplied, must be a valid HTTPS origin without credentials, path, query, or fragment. Invalid values fail the build instead of publishing broken canonical and sitemap URLs.

## Dependency finding (2026-10-09)

The full development dependency audit reports **GHSA-vfj7-8cjw-p6xm / CVE-2026-93687**, a high-severity stack-exhaustion issue in `braces@3.0.3`. The installed chain is:

`eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces`.

The advisory and registry list no published patched version. This dependency processes repository lint patterns during development/builds; it is absent from the production dependency tree. The portfolio does not accept glob patterns from visitors. Do not run lint on untrusted configurations with credentials present. CI has read-only repository permission and checkout does not persist credentials.

This finding is **open**, not fixed or audit-ignored. `pnpm audit --prod --audit-level=low` passes; `pnpm audit --audit-level=low` remains a failing check until the dependency can be safely replaced or updated. Do not disable the Next.js lint rules or suppress the advisory just to turn the check green. Dependabot checks dependency and action updates weekly.

References: [advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), [upstream issue](https://github.com/micromatch/braces/issues/70), [Next.js CSP guidance](https://nextjs.org/docs/app/guides/content-security-policy).

## Verification boundaries

Automated coverage includes all published routes, keyboard tuning, download integrity, missing and malformed paths, metadata, browser security headers, asset/console/CSP errors, JavaScript-disabled browsing, narrow layouts, reduced motion, axe accessibility checks, and a small local concurrent request burst. Unit tests cover every pitch step, numerical symmetry, invalid input, URL configuration, and content/route invariants.

These checks are not a penetration test, real-device accessibility review, uptime guarantee, or proof of real-traffic capacity. Vercel platform firewalls and quotas remain account configuration, and laboratory performance is distinct from field measurements. Review Vercel request/error metrics after publication and after traffic changes. Avoid adding telemetry that collects visitor data without a concrete need.
