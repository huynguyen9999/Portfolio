import Image from "next/image";
import { leadership } from "@/lib/content";

export function LeadershipSection() {
  return (
    <section
      id="leadership"
      className="leadership-section"
      aria-labelledby="leadership-heading"
    >
      <div className="section-heading">
        <h2 id="leadership-heading">Leadership &amp; community</h2>
      </div>
      <div className="leadership-list">
        {leadership.map((entry) => (
          <article
            className="leadership-card"
            key={`${entry.organization}-${entry.period}`}
          >
            <div className="leadership-identity">
              <span className="leadership-mark" aria-hidden="true">
                {entry.logo ? (
                  <Image
                    src={entry.logo}
                    alt=""
                    width={62}
                    height={62}
                    sizes="62px"
                  />
                ) : (
                  entry.mark
                )}
              </span>
              <p className="leadership-period">{entry.period}</p>
            </div>
            <div className="leadership-details">
              <h3>{entry.role}</h3>
              <p className="leadership-organization">{entry.organization}</p>
              <ul className="leadership-highlights">
                {entry.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              <ul
                className="leadership-tags"
                aria-label={`${entry.organization} focus areas`}
              >
                {entry.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
