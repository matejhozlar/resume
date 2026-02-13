import { resume } from "@/data/resume"

export function About() {
  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight">About</h2>
      <p className="mt-2 text-muted-foreground leading-relaxed">{resume.about}</p>
    </section>
  )
}
