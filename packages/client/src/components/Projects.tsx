import { useRef, useState } from "react"
import { m } from "framer-motion"
import { ExternalLink, Github } from "lucide-react"
import { TechIcon } from "@/components/TechIcon"
import { useLocale } from "@/hooks/useLocale"

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const card = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function Projects() {
  const { t, data } = useLocale()

  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight">{t.sections.projects}</h2>

      <m.div
        className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {data.projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </m.div>
    </section>
  )
}

function ProjectCard({ project }: { project: { name: string; description: string; tags: string[]; image: string; url?: string; repo?: string; badge?: { image: string; url: string } } }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, visible: false })

  function handleMouseMove(e: React.MouseEvent) {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true })
  }

  function handleMouseLeave() {
    setSpotlight((s) => ({ ...s, visible: false }))
  }

  return (
    <m.div
      ref={cardRef}
      variants={card}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative h-64 rounded-xl overflow-hidden border border-border transition-all duration-300 hover:border-foreground/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.08)]"
    >
      {/* Background image with hover zoom */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 ease-out group-hover:scale-110"
        style={{ backgroundImage: `url('${project.image}')` }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

      {/* Cursor spotlight */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: spotlight.visible ? 1 : 0,
          background: `radial-gradient(320px circle at ${spotlight.x}px ${spotlight.y}px, rgba(255,255,255,0.07), transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-between p-4">
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
              <ExpandableLink href={project.repo} label="GitHub">
                <Github className="size-3.5 shrink-0" />
              </ExpandableLink>
            )}
            {project.url && (
              <ExpandableLink href={project.url} label="Live">
                <ExternalLink className="size-3.5 shrink-0" />
              </ExpandableLink>
            )}
          </div>
        </div>

        {/* Bottom — title, description, tags */}
        <div className="flex flex-col gap-1.5">
          <h3 className="text-base font-semibold text-white">{project.name}</h3>
          <p className="text-xs text-gray-300 leading-relaxed transition-all duration-300 lg:max-h-0 lg:opacity-0 lg:overflow-hidden lg:group-hover:max-h-24 lg:group-hover:opacity-100">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1 pt-0.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white/80 select-none"
              >
                <TechIcon name={tag} className="size-3 shrink-0" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </m.div>
  )
}

function ExpandableLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group/link inline-flex items-center gap-0 rounded-lg bg-white/10 p-1.5 text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300"
    >
      {children}
      <span className="overflow-hidden max-w-0 group-hover/link:max-w-20 transition-all duration-300 ease-out whitespace-nowrap text-[11px] font-medium group-hover/link:ml-1.5">
        {label}
      </span>
    </a>
  )
}
