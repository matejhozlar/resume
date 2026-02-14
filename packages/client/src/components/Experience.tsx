import { resume } from "@/data/resume"
import { TechIcon } from "@/components/TechIcon"

export function Experience() {
  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight">Experience</h2>
      <div className="mt-4 space-y-6">
        {resume.experience.map((job) => (
          <div
            key={`${job.company}-${job.period}`}
            className="border-l-2 border-border pl-4 transition-colors duration-300 hover:border-foreground/30"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
              <h3 className="font-medium inline-flex items-center gap-2">
                {job.title}
                <span className="text-muted-foreground font-normal inline-flex items-center gap-1.5">
                  ·
                  {job.logo && (
                    <img
                      src={job.logo}
                      alt={job.company}
                      className="size-4 rounded-sm object-contain inline-block"
                    />
                  )}
                  {job.url ? (
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors"
                    >
                      {job.company}
                    </a>
                  ) : (
                    job.company
                  )}
                </span>
              </h3>
              <span className="text-sm text-muted-foreground shrink-0">{job.period}</span>
            </div>
            {job.bullets.length > 0 && (
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
                {job.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            )}
            {job.tags && job.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    <TechIcon name={tag} className="size-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
