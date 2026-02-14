import { Mail, Github, Linkedin } from "lucide-react"
import { resume } from "@/data/resume"

export function Header() {
  return (
    <header className="flex items-center gap-6">
      <div className="relative size-24 shrink-0 rounded-full overflow-hidden group">
        <img
          src="/assets/me_pixel.webp"
          alt={resume.name}
          className="absolute inset-0 size-full object-cover transition-opacity duration-300 group-hover:opacity-0"
        />
        <img
          src="/assets/me.webp"
          alt={resume.name}
          className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </div>
      <div>
        <h1 className="text-4xl font-bold tracking-tight leading-normal">{resume.name}</h1>
        <p className="mt-1 text-lg text-muted-foreground">{resume.role}</p>
        <p className="mt-0.5 text-sm text-muted-foreground/70">{resume.location}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <a href={`mailto:${resume.email}`} className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Mail className="size-4" />
            {resume.email}
          </a>
          <a href={resume.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Github className="size-4" />
            GitHub
          </a>
          <a href={resume.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Linkedin className="size-4" />
            LinkedIn
          </a>
        </div>
      </div>
    </header>
  )
}
