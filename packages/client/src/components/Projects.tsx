import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react"
import { TechIcon } from "@/components/TechIcon"
import { resume } from "@/data/resume"

export function Projects() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  ])
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on("select", onSelect)
    onSelect()
    return () => { emblaApi.off("select", onSelect) }
  }, [emblaApi])

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Projects</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={scrollPrev}
            className="cursor-pointer rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={scrollNext}
            className="cursor-pointer rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {resume.projects.map((project) => (
            <div key={project.name} className="min-w-0 flex-[0_0_100%]">
              <div className="relative h-64 rounded-xl overflow-hidden border border-border transition-all duration-300 hover:border-foreground/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.08)]">
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url('${project.image}')` }}
                />

                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

                {/* Content */}
                <div className="relative h-full flex flex-col justify-between p-5">
                  {/* Top row — badge + links */}
                  <div className="flex items-start justify-between gap-2">
                    {project.badge ? (
                      <a href={project.badge.url} target="_blank" rel="noopener noreferrer">
                        <img
                          src={project.badge.image}
                          alt="Downloads"
                          className="h-5 rounded pointer-events-auto"
                        />
                      </a>
                    ) : <div />}
                    <div className="flex gap-2">
                      {project.repo && (
                        <a
                          href={project.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg bg-white/10 p-2 text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                        >
                          <Github className="size-4" />
                        </a>
                      )}
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg bg-white/10 p-2 text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                        >
                          <ExternalLink className="size-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Bottom — title, description, tags */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                    <p className="text-sm text-gray-300 leading-relaxed max-w-lg">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80"
                        >
                          <TechIcon name={tag} className="size-3.5 shrink-0" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="mt-3 flex justify-center gap-1.5">
        {resume.projects.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`size-1.5 rounded-full transition-all duration-300 ${
              i === selectedIndex
                ? "bg-foreground w-4"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
