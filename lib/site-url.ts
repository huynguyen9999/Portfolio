const fallbackOrigin = "https://huythedev.vercel.app";

/** Fail the build for unsafe metadata configuration; normalize trailing slashes. */
export function resolveSiteUrl(
  siteUrl?: string,
  productionHostname?: string,
): string {
  const candidate =
    siteUrl?.trim() ||
    (productionHostname?.trim()
      ? `https://${productionHostname.trim()}`
      : fallbackOrigin);
  const url = new URL(candidate);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "SITE_URL must be an HTTPS origin without credentials, a path, query, or fragment.",
    );
  }
  return url.origin;
}
