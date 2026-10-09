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

The browser suite uses installed Google Chrome and starts the production build on port 3001 if needed. It checks desktop/mobile layouts, all case-study routes, the PDF download, keyboard tuning, reset behavior, reduced motion, metadata, missing pages, and axe accessibility rules. Install Chrome before running it. Production performance can be checked with `pnpm audit:performance` while `pnpm start` is serving on port 3000. Lighthouse scores are laboratory measurements, not real-user Core Web Vitals.

## Content and assets

- `lib/content.ts`: project descriptions and experience. Keep outcomes factual and distinguish architecture capacity from observed traffic.
- `components/project-visual.tsx`: labeled conceptual diagrams, not project screenshots or recorded measurements.
- `components/tuner.tsx`: a silent synthesized A4 demo, not the original Python microphone tuner. The range is −50 to +50 cents; zero alone is labeled Target pitch.
- `public/resume.pdf`: downloadable résumé.
- `app/globals.css`: the editorial design and responsive layouts.

Only the two verified public project demos are linked. There are no guessed source repository links. Real hardware photos and product recordings can replace the conceptual diagrams when available.

## Deploy to Vercel

This repository is linked to the `portfolio` project under `huynguyen67`. Pushes to `main` trigger production deployments; branch deployments provide previews. `vercel.json` explicitly selects Next.js, including if the repository was imported before it contained application code.

For a fresh import: choose **New Project → Import Git Repository → huynguyen9999/Portfolio**. Keep the repository root and standard Next.js build settings. No environment variables are needed.

Metadata uses Vercel's automatically supplied production hostname, falling back to `https://portfolio-peach-two-97.vercel.app`. When using a custom domain, set the optional `SITE_URL` to its full HTTPS origin and redeploy so canonical URLs, robots, and sitemap use it.

Before sharing, verify the production URL opens without a Vercel login and that all project routes and the résumé work.
