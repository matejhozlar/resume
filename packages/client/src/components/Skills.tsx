import { Badge } from "@/components/ui/badge"
import { resume } from "@/data/resume"

export function Skills() {
  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight">Skills</h2>
      <div className="mt-3 space-y-3">
        {Object.entries(resume.skills).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-sm font-medium text-muted-foreground mb-1.5">{category}</h3>
            <div className="flex flex-wrap gap-1.5">
              {items.map((skill) => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
