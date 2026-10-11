// Vercel supplies the production hostname automatically. A custom domain can
// optionally override it without changing content or requiring a backend.
import { resolveSiteUrl } from "./site-url";

export const siteUrl = resolveSiteUrl(process.env.SITE_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL);

export const siteDescription = "Huy Nguyen — software and embedded systems. UCSB Electrical Engineering ’28, previously @ Amazon, Polymarket. Explore projects in real-time applications, sensing, and signal processing.";
