import { useLocale } from "@/hooks/useLocale"

export function About() {
  const { t, data } = useLocale()

  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight">{t.sections.about}</h2>
      <p className="mt-2 text-muted-foreground leading-relaxed">{data.about}</p>
    </section>
  )
}
