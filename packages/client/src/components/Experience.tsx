import { m } from "framer-motion"
import { useLocale } from "@/hooks/useLocale"
import { TechIcon } from "@/components/TechIcon"

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const item = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
}

export function Experience() {
  const { t, data } = useLocale()

  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight">{t.sections.experience}</h2>

      <div className="relative mt-6">
        {/* Timeline line */}
        <m.div
          className="absolute left-[15px] top-4 bottom-4 w-px bg-border origin-top"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        <m.div
          className="space-y-8"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          {data.experience.map((job) => (
            <m.div
              key={`${job.company}-${job.period}`}
              variants={item}
              className="relative flex gap-5 group"
            >
              {/* Timeline marker */}
              <div className="relative z-10 flex-none pt-0.5">
                {job.logo ? (
                  <div className="size-8 rounded-full bg-background border-2 border-border flex items-center justify-center overflow-hidden transition-colors duration-300 group-hover:border-foreground/40">
                    <img
                      src={job.logo}
                      alt={job.company}
                      loading="lazy"
                      className="size-5 object-contain"
                    />
                  </div>
                ) : (
                  <div className="size-8 rounded-full bg-background border-2 border-border transition-colors duration-300 group-hover:border-foreground/40" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
                  <h3 className="font-medium">
                    {job.title}
                    <span className="text-muted-foreground font-normal">
                      {" · "}
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
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  )
}
