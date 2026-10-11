import { Arrow } from "@/components/icons";
import { experience } from "@/lib/content";

export function ExperienceStrip() {
  return <section id="experience" className="experience-section" aria-labelledby="experience-heading">
    <div className="section-heading">
      <div>
        <h2 id="experience-heading">Experience</h2>
        <p className="section-kicker">Previous work and internships.</p>
      </div>
      <a className="inline-link" href="/Huy%20Nguyen%27s%20Resume.pdf" target="_blank" rel="noreferrer">Full résumé <Arrow diagonal /></a>
    </div>
    <div className="experience-strip">{experience.map(job => <article className="experience-item" key={`${job.company}-${job.period}`}>
      <span className="experience-mark" aria-hidden="true">{job.mark}</span>
      <div>
        <h3>{job.company}{job.team ? <span> {job.team}</span> : null}</h3>
        <p className="experience-role">{job.role}</p>
        <p className="experience-period">{job.period}</p>
        <p className="experience-impact">{job.impact}</p>
      </div>
    </article>)}</div>
  </section>;
}
