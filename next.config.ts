import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";
// Static App Router pages contain inline hydration scripts. Nonces would require
// rendering every request; retain static delivery and disallow eval in production.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  `connect-src 'self'${isDevelopment ? " ws: wss:" : ""}`,
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "Content-Security-Policy", value: contentSecurityPolicy },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        { key: "Strict-Transport-Security", value: "max-age=31536000" },
      ],
    }, {
      source: "/Huy%20Nguyen%27s%20Resume.pdf",
      headers: [{ key: "Content-Disposition", value: "inline; filename=\"Huy Nguyen's Resume.pdf\"; filename*=UTF-8''Huy%20Nguyen%27s%20Resume.pdf" }],
    }, {
      source: "/lidar-poster.pdf",
      headers: [{ key: "Content-Disposition", value: 'inline; filename="Huy-Nguyen-LiDAR-Poster.pdf"' }],
    }];
  },
};

export default nextConfig;
