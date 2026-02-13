import { ExternalLink, Github } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { resume } from "@/data/resume"

export function Projects() {
  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight">Projects</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {resume.projects.map((project) => (
          <div
            key={project.name}
            className="rounded-lg border border-border p-4 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{project.name}</h3>
              <div className="flex gap-2">
                {project.repo && (
                  <a href={project.repo} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Github className="size-4" />
                  </a>
                )}
                {project.url && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                    <ExternalLink className="size-4" />
                  </a>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
