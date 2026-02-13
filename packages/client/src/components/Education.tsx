import { resume } from "@/data/resume"

export function Education() {
  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight">Education</h2>
      <div className="mt-2 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
        <p>
          <span className="font-medium">{resume.education.degree}</span>{" "}
          <span className="text-muted-foreground">· {resume.education.school}</span>
        </p>
        <span className="text-sm text-muted-foreground">{resume.education.period}</span>
      </div>
    </section>
  )
}
