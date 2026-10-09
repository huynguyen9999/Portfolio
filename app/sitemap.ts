import type { MetadataRoute } from "next";
import { projects } from "@/lib/content";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteUrl, priority: 1 }, ...projects.map(project => ({ url: `${siteUrl}/projects/${project.slug}`, priority: 0.8 }))];
}
