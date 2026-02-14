import { m } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { TechIcon } from "@/components/TechIcon"
import { resume } from "@/data/resume"

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
  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight">Skills</h2>
      <div className="mt-3 space-y-3">
        {Object.entries(resume.skills).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-sm font-medium text-muted-foreground mb-1.5">{category}</h3>
            <m.div
              className="flex flex-wrap gap-2"
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {items.map((skill) => (
                <m.span key={skill} variants={item}>
                  <Badge variant="secondary" className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs">
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
