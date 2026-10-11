import Link from "next/link";
import Image from "next/image";
import { Arrow } from "@/components/icons";
import { Contact } from "@/components/chrome";
import { ProjectVisual } from "@/components/project-visual";
import { SignatureSystem } from "@/components/signature-system/signature-system";
import { projects, experience } from "@/lib/content";

export const metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return <main id="main" className="wrap">
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy"><p className="eyebrow"><span className="hero-mark" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3.2 1.6H1.6V3.2M12.8 1.6h1.6V3.2M3.2 14.4H1.6V12.8M12.8 14.4h1.6V12.8" /><circle cx="8" cy="8" r="1.25" fill="currentColor" stroke="none" /></svg></span><span>Embedded software systems</span><span className="eyebrow-sep" aria-hidden="true">·</span><span>RFIC</span><span className="eyebrow-sep" aria-hidden="true">·</span><span>IC design</span></p>
      <h1 id="hero-title">Huy Nguyen<span>.</span></h1>
      <p className="hero-statement">I build systems across software, signals, and the physical world.</p>
      <p className="hero-context">Electrical Engineering at UCSB ’28 <span aria-hidden="true">/</span> Previously Amazon Alexa</p>
      <div className="hero-actions"><a className="button-primary" href="#work">View work <Arrow /></a><a className="button-text" href="/Huy%20Nguyen%27s%20Resume.pdf" target="_blank" rel="noreferrer">Résumé <Arrow diagonal /></a></div>
      <div className="social-links"><a href="mailto:dominichuyn@gmail.com">Email <Arrow diagonal /></a><a href="https://github.com/huynguyen9999" target="_blank" rel="noreferrer">GitHub <Arrow diagonal /></a><a href="https://www.linkedin.com/in/huynguyen06/" target="_blank" rel="noreferrer">LinkedIn <Arrow diagonal /></a></div></div>
      <div className="hero-portrait"><Image src="/huy-nguyen.jpg" alt="Huy Nguyen at the beach in Santa Barbara" width={2844} height={3793} sizes="(max-width: 640px) 560px, 720px" preload /></div>
    </section>
    <SignatureSystem />

    <section id="work" className="work-section" aria-labelledby="work-heading"><div className="section-heading"><h2 id="work-heading">Projects</h2></div>
      <div className="project-grid">{projects.map(project => <article className="project-card" key={project.slug}>
        <div className="project-visual"><ProjectVisual slug={project.slug} /></div>
        <div className="project-meta"><span>{project.category}</span><span>{project.year}</span></div>
        <h3><Link href={`/projects/${project.slug}`}>{project.title}<Arrow /></Link></h3>
        <p className="project-summary">{project.summary}</p>
        <div className="project-bottom"><p className="project-metric"><strong>{project.metric}</strong> {project.metricLabel}</p><div className="project-links"><Link className="project-more" href={`/projects/${project.slug}`} aria-label={`Project breakdown: ${project.title}`}>How it was built <Arrow /></Link>{(project.liveUrl || project.posterUrl) && <a className="project-more" href={project.liveUrl ?? project.posterUrl} target="_blank" rel="noreferrer" aria-label={`${project.liveUrl ? "Open live project" : "View poster"}: ${project.title}`}>{project.liveUrl ? "Live project" : "View poster"} <Arrow diagonal /></a>}</div></div>
        <ul className="tags" aria-label={`${project.title} technologies`}>{project.tags.slice(0, 3).map(tag => <li key={tag}>{tag}</li>)}</ul>
      </article>)}</div>
    </section>

    <section id="experience" className="experience-section" aria-labelledby="experience-heading"><div className="section-heading"><h2 id="experience-heading">Experience</h2><a className="inline-link" href="/Huy%20Nguyen%27s%20Resume.pdf" target="_blank" rel="noreferrer">Full résumé <Arrow diagonal /></a></div>
      <div className="experience-list">{experience.map(job => <article className="experience-row" key={`${job.company}-${job.period}`}><div className="experience-company"><h3>{job.company}</h3><p>{job.period}</p></div><div className="experience-detail"><h4>{job.role}</h4><p>{job.summary}</p></div></article>)}</div>
    </section>

    <section id="about" className="about-section" aria-labelledby="about-heading"><div><h2 id="about-heading">About me</h2><p>I’m studying Electrical Engineering at UC Santa Barbara, graduating in June 2028. I like projects that make me think across disciplines: the code, the signal, and the person on the other end.</p><p>Outside of engineering, you’ll find me speed cubing, rock crawling, or behind a camera shooting sports.</p></div><aside className="about-notes" aria-label="Education and leadership"><div><span className="eyebrow">Education</span><h3>University of California,<br />Santa Barbara</h3><p>B.S. Electrical Engineering · 2028</p></div><div><span className="eyebrow">Beyond the classroom</span><p>Amazon Future Engineer scholar<br />UCSB Promise Scholar<br />Autodesk Design & Make Ambassador<br />Former Vice President, Sigma Eta Pi</p></div><span className="location"><span aria-hidden="true">↗</span> Based in Santa Barbara, CA</span></aside></section>
    <Contact />
  </main>;
}
