import { ExternalLink, Github } from "lucide-react"
import { TechIcon } from "@/components/TechIcon"
import { useLocale } from "@/hooks/useLocale"

export function Projects() {
  const { t, data } = useLocale()

  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight">{t.sections.projects}</h2>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.projects.map((project) => (
          <div
            key={project.name}
            className="relative h-64 rounded-xl overflow-hidden border border-border transition-all duration-300 hover:border-foreground/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.08)]"
          >
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${project.image}')` }}
            />

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

            {/* Content */}
            <div className="relative h-full flex flex-col justify-between p-4">
              {/* Top row — badge + links */}
              <div className="flex items-start justify-between gap-2">
                {project.badge ? (
                  <a href={project.badge.url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={project.badge.image}
                      alt="Downloads"
                      loading="lazy"
                      className="h-5 rounded pointer-events-auto"
                    />
                  </a>
                ) : <div />}
                <div className="flex gap-1.5">
                  {project.repo && (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-white/10 p-1.5 text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                    >
                      <Github className="size-3.5" />
                    </a>
                  )}
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-white/10 p-1.5 text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Bottom — title, description, tags */}
              <div className="flex flex-col gap-1.5">
                <h3 className="text-base font-semibold text-white">{project.name}</h3>
                <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white/80"
                    >
                      <TechIcon name={tag} className="size-3 shrink-0" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
