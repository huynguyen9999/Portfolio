import { resume, contactLinks } from "@/lib/links";
import Link from "next/link";
import { Arrow } from "./icons";
import { MagneticWord } from "./magnetic-word";

export function Header() {
  return (
    <header className="site-header wrap">
      <Link className="monogram" href="/" aria-label="hn. — Huy Nguyen home">
        hn<span>.</span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/#work">Work</Link>
        <Link href="/#experience">Experience</Link>
        <Link href="/#about">About</Link>
        <a
          className="nav-resume"
          href={resume.href}
          target="_blank"
          rel="noreferrer"
        >
          Résumé <Arrow diagonal />
        </a>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer wrap">
      <p>© {new Date().getFullYear()} Huy Nguyen</p>
      <p>Santa Barbara, CA</p>
      <div className="footer-links">
        <a href={contactLinks.linkedin} target="_blank" rel="noreferrer">
          LinkedIn <Arrow diagonal />
        </a>
        <a href={contactLinks.github} target="_blank" rel="noreferrer">
          GitHub <Arrow diagonal />
        </a>
      </div>
    </footer>
  );
}

export function Contact() {
  return (
    <section className="contact" id="contact" aria-labelledby="contact-heading">
      <div>
        <h2 id="contact-heading">
          Let&apos;s build something <MagneticWord>cool</MagneticWord>
        </h2>
      </div>
      <div className="contact-links">
        <a className="contact-email" href={contactLinks.email}>
          dominichuyn@gmail.com <Arrow diagonal />
        </a>
        <a href={contactLinks.linkedin} target="_blank" rel="noreferrer">
          LinkedIn <Arrow diagonal />
        </a>
        <a href={contactLinks.github} target="_blank" rel="noreferrer">
          GitHub <Arrow diagonal />
        </a>
        <a href={contactLinks.strava} target="_blank" rel="noreferrer">
          Strava <Arrow diagonal />
        </a>
        <a href={contactLinks.tiktok} target="_blank" rel="noreferrer">
          TikTok <Arrow diagonal />
        </a>
        <a href={contactLinks.instagram} target="_blank" rel="noreferrer">
          Instagram <Arrow diagonal />
        </a>
      </div>
    </section>
  );
}
