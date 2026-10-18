# Security and production checks

This is a statically rendered public portfolio. There are no login sessions, user-submitted content, forms, server actions, database credentials, payment flows, microphone capture, or outbound application API calls. The résumé is intentionally public. External project sites have their own security boundaries.

## Browser defenses

Responses set CSP, MIME sniffing protection, frame denial, strict-origin referrer policy, restricted device permissions, and one-year HTTPS transport policy. Fonts and scripts are served locally. CSP blocks external scripts/connections, framing, plugins, base-tag changes, and form submissions. Production disallows JavaScript eval. No secrets or source maps are intentionally published. New external services must be explicitly reviewed before widening this policy.

Static Next.js hydration requires inline scripts. The current CSP permits inline scripts and styles; it therefore is **not a strict XSS-prevention policy**. React escapes the portfolio's static data, and there is no raw HTML insertion or user-content rendering. Nonces would require dynamic rendering; do not silently enable that or introduce experimental integrity tooling to make a scanner score appear better. Reevaluate this decision before accepting user content or adding third-party scripts.

`SITE_URL`, when supplied, must be a valid HTTPS origin without credentials, path, query, or fragment. Invalid values fail the build instead of publishing broken canonical and sitemap URLs.

## Dependency remediation (2026-10-10)

The full audit previously reported **GHSA-vfj7-8cjw-p6xm / CVE-2026-93687**, a high-severity stack-exhaustion issue in `braces@3.0.3`, through:

`eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces`.

There is no published fixed `braces` release. This repository instead removes that dependency chain. A version-scoped pnpm override replaces only `@next/eslint-plugin-next@16.4.0`'s `fast-glob` dependency with the existing toolchain package `tinyglobby@0.2.17`. The plugin's only use of fast-glob is `globSync` with `onlyDirectories` in root-directory discovery. A tracked pnpm patch adds `expandDirectories: false`, preserving the meaning of literal project roots when using tinyglobby. Relative versus absolute strings and trailing slashes may differ, but they resolve to the same directories; tests check resolved paths and a real lint rule against custom roots.

No lint rules, audit thresholds, or security advisories are disabled. Both production and full dependency audits pass. Regression tests cover literal/glob/brace/array roots, missing directories, file exclusion, backslash normalization, a real Next.js lint error, and 4,000-level nested patterns in a child process with a timeout. A lockfile assertion prevents the removed packages from silently returning.

This is a local compatibility adaptation, not an upstream fix. When upgrading `eslint-config-next` or its plugin, review and remove the scoped override and patch if upstream has removed the vulnerable chain. Otherwise update the adaptation and rerun the compatibility tests before merging. Both the override and patch are pinned to version 16.4.0 so they cannot silently affect an unreviewed plugin version. Dependabot checks dependency and action updates weekly.

References: [advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), [tinyglobby migration guide](https://superchupu.dev/tinyglobby/migration), [Next.js CSP guidance](https://nextjs.org/docs/app/guides/content-security-policy).

## Verification boundaries

Automated coverage includes all published routes, keyboard tuning and radio navigation, pointer release on focus loss, PDF integrity and new-tab navigation, missing and malformed paths, metadata, browser security headers, asset/console/CSP errors, JavaScript-disabled browsing, narrow layouts, reduced motion, and axe accessibility checks. Unit tests cover every pitch step, numerical symmetry, invalid input, frame-rate-independent spring motion, URL configuration, and content/route invariants.

The full dependency audit was rerun on 2026-10-17 and reported no known vulnerabilities. This result reflects the advisory database at that time, not a guarantee against undiscovered issues.

These checks are not a penetration test, real-device accessibility review, uptime guarantee, or proof of real-traffic capacity. Vercel platform firewalls and quotas remain account configuration, and laboratory performance is distinct from field measurements. Review Vercel request/error metrics after publication and after traffic changes. Avoid adding telemetry that collects visitor data without a concrete need.
