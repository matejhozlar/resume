import { m } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { TechIcon } from "@/components/TechIcon"
import { useLocale } from "@/hooks/useLocale"

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
}

export function Skills() {
  const { t, data } = useLocale()

  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight">{t.sections.skills}</h2>
      <div className="mt-3 grid grid-cols-2 max-[550px]:grid-cols-1 gap-3">
        {Object.entries(data.skills).map(([category, items]) => (
          <div key={category} className="rounded-lg border border-border/50 bg-muted/30 p-3">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">{category}</h3>
            <m.div
              className="flex flex-wrap gap-1.5"
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {items.map((skill) => (
                <m.span key={skill} variants={item}>
                  <Badge variant="secondary" className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs hover:bg-secondary/80 transition-colors select-none">
                    <TechIcon name={skill} className="size-3.5 shrink-0" />
                    {skill}
                  </Badge>
                </m.span>
              ))}
            </m.div>
          </div>
        ))}
      </div>
    </section>
  )
}
