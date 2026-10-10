# Huy Nguyen · Portfolio

A minimal portfolio for software, embedded systems, and signal processing. Built with Next.js App Router, TypeScript, and Tailwind CSS, with locally hosted variable fonts and a synthesized pitch demonstration.

## Run locally

Use Node.js 22.13+ or 24 and pnpm 11.25.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL printed by Next.js. No API keys, database, or application environment variables are required.

## Checks

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:browser
```

The browser suite uses installed Google Chrome and starts the production build on port 3001 if needed. It checks desktop/mobile layouts, all case-study routes, PDF integrity and new-tab navigation, keyboard tuning, reset behavior, reduced motion, metadata, missing pages, and axe accessibility rules. Install Chrome before running it. Production performance can be checked with `pnpm audit:performance` while `pnpm start` is serving on port 3000. Lighthouse scores are laboratory measurements, not real-user Core Web Vitals.

## Content and assets

- `lib/content.ts`: project descriptions and experience. Keep outcomes factual and distinguish architecture capacity from observed traffic.
- `components/project-visual.tsx`: labeled conceptual diagrams, not project screenshots or recorded measurements.
- `components/tuner.tsx`: a silent synthesized A4 demo, not the original Python microphone tuner. The range is −50 to +50 cents; zero alone is labeled Target pitch.
- `public/resume.pdf`: résumé preview, opened in a new tab.
- `public/huy-nguyen.jpg`: supplied portrait, responsively optimized by Next.js.
- `public/lidar-poster.pdf`: supplied LiDAR team poster, available through View poster links.
- `app/globals.css`: the editorial design and responsive layouts.

Project titles and Explore project links open portfolio details. Separate Live project and View poster links open the two verified demos and the supplied LiDAR poster; the same evidence links are also available within the case studies. There are no guessed source repository links. Real hardware photos and product recordings can replace the conceptual diagrams when available.

## Deploy to Vercel

This repository is linked to the `portfolio` project under `huynguyen67`. Pushes to `main` trigger production deployments; branch deployments provide previews. `vercel.json` explicitly selects Next.js, including if the repository was imported before it contained application code.

For a fresh import: choose **New Project → Import Git Repository → huynguyen9999/Portfolio**. Keep the repository root and standard Next.js build settings. No environment variables are needed.

Metadata uses Vercel's automatically supplied production hostname, falling back to `https://portfolio-peach-two-97.vercel.app`. When using a custom domain, set the optional `SITE_URL` to its full HTTPS origin and redeploy so canonical URLs, robots, and sitemap use it.

Before sharing, verify the production URL opens without a Vercel login and that all project routes and the résumé work.

## Production quality gates

`pnpm check` runs lint (zero warnings), strict TypeScript, unit/content/configuration tests, the production build, and browser integration tests. Use Node 24 for the CI-equivalent runtime. For all engines, install browsers with `pnpm exec playwright install chromium firefox webkit` and run `CROSS_BROWSER=1 pnpm test:browser`. Without `CI`, the desktop/mobile projects use local Chrome; CI uses Playwright Chromium. Tests always start a fresh production server, preventing accidental validation of a stale dev server.

GitHub Actions runs the full suite on pushes and pull requests, including Firefox and WebKit, and retains failure traces for seven days. Vercel's build command also requires lint, types, unit tests and the full dependency audit to pass before building. Browser checks run in GitHub Actions separately; this does not configure a GitHub branch-protection rule or make Vercel wait for Actions. Run `pnpm check` before pushing directly to `main`.

For read-only post-deployment checks:

```sh
PLAYWRIGHT_BASE_URL=https://portfolio-peach-two-97.vercel.app pnpm test:browser
```

The small local concurrent-request smoke test is skipped against a public URL. It is not a load-capacity benchmark.

See [SECURITY.md](SECURITY.md) for the threat model, browser policy tradeoffs, and the scoped lint-dependency replacement that removes the unpatched `braces` chain. Both dependency audits run without advisory exceptions. The pinned compatibility patch and regression tests must be reviewed when upgrading the Next.js lint plugin.

If a release breaks the site, use the Vercel project's Deployments page to promote the last known-good production deployment, then revert the faulty commit through a reviewed Git change. After any deployment or rollback, check the public homepage, all four case studies, keyboard tuner controls, and résumé without logging in. Field Core Web Vitals and long-term uptime need actual visitor measurements; local laboratory results do not establish them.
