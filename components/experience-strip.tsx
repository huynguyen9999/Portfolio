import { resume } from "@/lib/links";
import Image from "next/image";
import { Arrow } from "@/components/icons";
import { experience, research } from "@/lib/content";

export function ExperienceStrip() {
  return (
    <section
      id="experience"
      className="experience-section"
      aria-labelledby="experience-heading"
    >
      <div className="section-heading">
        <h2 id="experience-heading">Experience</h2>
        <a
          className="inline-link"
          href={resume.href}
          target="_blank"
          rel="noreferrer"
        >
          Full résumé <Arrow diagonal />
        </a>
      </div>
      <div className="experience-strip">
        {experience.map((job) => (
          <article
            className="experience-item"
            key={`${job.company}-${job.period}`}
          >
            <h3>
              <Image
                className="experience-logo"
                src={`/logos/${job.logo}.svg`}
                alt=""
                width={22}
                height={22}
              />
              {job.company}
              {job.team ? <span> {job.team}</span> : null}
            </h3>
            <p className="experience-role">{job.role}</p>
            <p className="experience-period">{job.period}</p>
            <p className="experience-impact">{job.impact}</p>
          </article>
        ))}
      </div>
      <div className="research-block">
        <h3 id="research-heading">Research</h3>
        <article aria-labelledby="research-project">
          <h4 id="research-project">{research.project}</h4>
          <p className="experience-role">{research.role}</p>
          {research.period ? (
            <p className="experience-period">{research.period}</p>
          ) : null}
          <p className="experience-impact">{research.summary}</p>
          <p className="research-meta">
            {research.advisor}
            <span aria-hidden="true"> · </span>
            {research.school}
          </p>
          <a
            className="inline-link"
            href={research.href}
            target="_blank"
            rel="noreferrer"
          >
            {research.lab} <Arrow diagonal />
          </a>
        </article>
      </div>
    </section>
  );
}
