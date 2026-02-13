import { resume } from "@/data/resume"

export function Experience() {
  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight">Experience</h2>
      <div className="mt-4 space-y-6">
        {resume.experience.map((job) => (
          <div key={`${job.company}-${job.period}`}>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
              <h3 className="font-medium">
                {job.title} <span className="text-muted-foreground font-normal">· {job.company}</span>
              </h3>
              <span className="text-sm text-muted-foreground shrink-0">{job.period}</span>
            </div>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
              {job.bullets.map((bullet, i) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
