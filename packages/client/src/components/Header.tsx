import { Mail, Github, Linkedin } from "lucide-react"
import { useLocale } from "@/hooks/useLocale"
import { DownloadCVButton } from "@/components/DownloadCVButton"

export function Header() {
  const { data } = useLocale()

  return (
    <header className="flex items-center gap-6">
      <div className="relative size-24 shrink-0 rounded-full overflow-hidden group">
        <img
          src="/assets/me_pixel.webp"
          alt={data.name}
          className="absolute inset-0 size-full object-cover transition-opacity duration-300 group-hover:opacity-0"
        />
        <img
          src="/assets/me.webp"
          alt={data.name}
          className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight leading-normal">
          {data.name} <span className="text-lg text-muted-foreground font-normal">| {data.role}</span>
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground/70">{data.location}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <a href={`mailto:${data.email}`} className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Mail className="size-4" />
            {data.email}
          </a>
          <a href={data.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Github className="size-4" />
            GitHub
          </a>
          <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Linkedin className="size-4" />
            LinkedIn
          </a>
          <DownloadCVButton />
        </div>
      </div>
    </header>
  )
}
