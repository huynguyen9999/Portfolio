import { resume, contactLinks } from "@/lib/links";
import Image from "next/image";
import { AboutMe } from "@/components/about/about-me";
import { Arrow } from "@/components/icons";
import { Contact } from "@/components/chrome";
import { ExperienceStrip } from "@/components/experience-strip";
import { FeaturedWork } from "@/components/featured-work";
import { SignatureSystem } from "@/components/signature-system/signature-system";

export const metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <main id="main" className="wrap">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="hero-mark" aria-hidden="true">
              <svg
                width="15"
                height="15"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              >
                <path d="M3.2 1.6H1.6V3.2M12.8 1.6h1.6V3.2M3.2 14.4H1.6V12.8M12.8 14.4h1.6V12.8" />
                <circle
                  cx="8"
                  cy="8"
                  r="1.25"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </span>
            <span>Embedded software systems</span>
            <span className="eyebrow-sep" aria-hidden="true">
              ·
            </span>
            <span>RFIC</span>
            <span className="eyebrow-sep" aria-hidden="true">
              ·
            </span>
            <span>IC design</span>
          </p>
          <h1 id="hero-title">
            Huy Nguyen<span>.</span>
          </h1>
          <p className="hero-statement">
            Building things people want to use, understand, and be part of.
          </p>
          <p className="hero-context">
            Electrical Engineering at UCSB ’28 <span aria-hidden="true">/</span>{" "}
            Previously @ Amazon, Polymarket
          </p>
          <div className="hero-actions">
            <a className="button-primary" href="#work">
              View work <Arrow />
            </a>
            <a
              className="button-text"
              href={resume.href}
              target="_blank"
              rel="noreferrer"
            >
              Résumé <Arrow diagonal />
            </a>
          </div>
          <div className="social-links">
            <a href={contactLinks.email}>
              Email <Arrow diagonal />
            </a>
            <a href={contactLinks.github} target="_blank" rel="noreferrer">
              GitHub <Arrow diagonal />
            </a>
            <a href={contactLinks.linkedin} target="_blank" rel="noreferrer">
              LinkedIn <Arrow diagonal />
            </a>
          </div>
        </div>
        <div className="hero-portrait">
          <Image
            src="/huy-nguyen.jpg"
            alt="Huy Nguyen at the beach in Santa Barbara"
            width={2844}
            height={3793}
            sizes="(max-width: 640px) 560px, 720px"
            preload
          />
        </div>
      </section>
      <SignatureSystem />

      <FeaturedWork />
      <ExperienceStrip />

      <AboutMe />
      <Contact />
    </main>
  );
}
