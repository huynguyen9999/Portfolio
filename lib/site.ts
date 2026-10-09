// Vercel supplies the production hostname automatically. A custom domain can
// optionally override it without changing content or requiring a backend.
export const siteUrl = process.env.SITE_URL
  ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://portfolio-peach-two-97.vercel.app");

export const siteDescription = "Huy Nguyen — software and embedded systems. UCSB Electrical Engineering ’28, previously Amazon Alexa. Explore projects in real-time applications, sensing, and signal processing.";
