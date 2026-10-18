import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="wrap not-found">
      <p className="eyebrow">404 / Not found</p>
      <h1>A little off the map.</h1>
      <p>
        This page doesn’t exist. There’s plenty to explore back at the
        portfolio.
      </p>
      <Link className="button-primary" href="/">
        Back to home <span aria-hidden="true">↗</span>
      </Link>
    </main>
  );
}
