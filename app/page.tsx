import Link from "next/link";
import Image from "next/image";
import { Arrow } from "@/components/icons";
import { Contact } from "@/components/chrome";
import { ProjectVisual } from "@/components/project-visual";
import { projects, experience } from "@/lib/content";

export const metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return <main id="main" className="wrap">
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy"><p className="eyebrow"><span className="small-cross" aria-hidden="true">✳</span> Software + embedded systems</p>
      <h1 id="hero-title">Huy Nguyen<span>.</span></h1>
      <p className="hero-statement">I build software and embedded systems—from real-time applications to sensing hardware.</p>
      <p className="hero-context">Electrical Engineering at UCSB ’28 <span aria-hidden="true">/</span> Previously Amazon Alexa</p>
      <div className="hero-actions"><a className="button-primary" href="#work">View work <Arrow /></a><a className="button-text" href="/resume.pdf" target="_blank" rel="noreferrer">Résumé <Arrow diagonal /></a></div>
      <div className="social-links"><a href="mailto:dominichuyn@gmail.com">Email <Arrow diagonal /></a><a href="https://github.com/huynguyen9999" target="_blank" rel="noreferrer">GitHub <Arrow diagonal /></a><a href="https://www.linkedin.com/in/huynguyen06/" target="_blank" rel="noreferrer">LinkedIn <Arrow diagonal /></a></div></div>
      <div className="hero-portrait"><Image src="/huy-nguyen.jpg" alt="Huy Nguyen at the beach in Santa Barbara" width={2844} height={3793} sizes="(max-width: 640px) 560px, 720px" preload /></div>
    </section>

    <section id="work" className="work-section" aria-labelledby="work-heading"><div className="section-heading"><div><p className="eyebrow">Projects</p><h2 id="work-heading">Built to make a difference.</h2></div><p>Software, hardware,<br />and the interesting space between.</p></div>
      <div className="project-grid">{projects.map(project => <article className="project-card" key={project.slug}>
        <div className="project-visual"><ProjectVisual slug={project.slug} /></div>
        <div className="project-meta"><span>{project.category}</span><span>{project.year}</span></div>
        <h3>{project.liveUrl || project.posterUrl
          ? <a href={project.liveUrl ?? project.posterUrl} target="_blank" rel="noreferrer">{project.title}<Arrow diagonal /></a>
          : <Link href={`/projects/${project.slug}`}>{project.title}<Arrow diagonal /></Link>}</h3>
        <p className="project-summary">{project.summary}</p>
        <div className="project-bottom"><p className="project-metric"><strong>{project.metric}</strong> {project.metricLabel}</p><Link className="project-more" href={`/projects/${project.slug}`} aria-label={`Read ${project.title} case study`}>Case study <Arrow /></Link></div>
        <ul className="tags" aria-label={`${project.title} technologies`}>{project.tags.slice(0, 3).map(tag => <li key={tag}>{tag}</li>)}</ul>
      </article>)}</div>
    </section>

    <section id="experience" className="experience-section" aria-labelledby="experience-heading"><div className="section-heading"><div><p className="eyebrow">Experience</p><h2 id="experience-heading">Learning by building.</h2></div><a className="inline-link" href="/resume.pdf" target="_blank" rel="noreferrer">Full résumé <Arrow diagonal /></a></div>
      <div className="experience-list">{experience.map(job => <article className="experience-row" key={`${job.company}-${job.period}`}><div className="experience-company"><h3>{job.company}</h3><p>{job.period}</p></div><div className="experience-detail"><h4>{job.role}</h4><p>{job.summary}</p></div></article>)}</div>
    </section>

    <section id="about" className="about-section" aria-labelledby="about-heading"><div><p className="eyebrow">About me</p><h2 id="about-heading">Curious by default.<br />Hands-on by nature.</h2><p>I’m studying Electrical Engineering at UC Santa Barbara, graduating in June 2028. I like projects that make me think across disciplines: the code, the signal, and the person on the other end.</p><p>Outside of engineering, you’ll find me speed cubing, rock crawling, or behind a camera shooting sports.</p></div><aside className="about-notes" aria-label="Education and leadership"><div><span className="eyebrow">Education</span><h3>University of California,<br />Santa Barbara</h3><p>B.S. Electrical Engineering · 2028</p></div><div><span className="eyebrow">Beyond the classroom</span><p>Amazon Future Engineer scholar<br />UCSB Promise Scholar<br />Autodesk Design & Make Ambassador<br />Former Vice President, Sigma Eta Pi</p></div><span className="location"><span aria-hidden="true">↗</span> Based in Santa Barbara, CA</span></aside></section>
    <Contact />
  </main>;
}
