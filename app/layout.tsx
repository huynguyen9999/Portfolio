import type { Metadata } from "next";
import "@fontsource-variable/dm-sans";
import "@fontsource-variable/newsreader";
import "./globals.css";
import { Header, Footer } from "@/components/chrome";
import { siteDescription, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Huy Nguyen — Software & Embedded Systems", template: "%s — Huy Nguyen" },
  description: siteDescription,
  authors: [{ name: "Huy Nguyen" }],
  openGraph: { title: "Huy Nguyen — Software & Embedded Systems", description: siteDescription, type: "website", locale: "en_US", siteName: "Huy Nguyen" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a href="#main" className="skip-link">Skip to content</a><Header />{children}<Footer /></body></html>;
}
