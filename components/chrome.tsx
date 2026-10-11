import Link from "next/link";
import { Arrow } from "./icons";

export function Header() {
  return <header className="site-header wrap">
    <Link className="monogram" href="/" aria-label="hn. — Huy Nguyen home">hn<span>.</span></Link>
    <nav aria-label="Main navigation">
      <Link href="/#work">Work</Link><Link href="/#experience">Experience</Link><Link href="/#about">About</Link>
      <a className="nav-resume" href="/Huy%20Nguyen%27s%20Resume.pdf" target="_blank" rel="noreferrer">Résumé <Arrow diagonal /></a>
    </nav>
  </header>;
}

export function Footer() {
  return <footer className="site-footer wrap"><p>© {new Date().getFullYear()} Huy Nguyen</p><p>Made with intention, in Santa Barbara.</p><a href="https://github.com/huynguyen9999/Portfolio" target="_blank" rel="noreferrer">View source <Arrow diagonal /></a></footer>;
}

export function Contact() {
  return <section className="contact" id="contact" aria-labelledby="contact-heading">
    <div><h2 id="contact-heading">Let’s connect</h2></div>
    <div className="contact-links"><a className="contact-email" href="mailto:dominichuyn@gmail.com">dominichuyn@gmail.com <Arrow diagonal /></a><a href="https://www.linkedin.com/in/huynguyen06/" target="_blank" rel="noreferrer">Find me on LinkedIn <Arrow diagonal /></a></div>
  </section>;
}
