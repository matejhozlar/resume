import { LOCALES } from "@/i18n/types"
import { useLocale } from "@/hooks/useLocale"

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocale()

  return (
    <div className="inline-flex rounded-full border border-border text-xs overflow-hidden">
      {LOCALES.map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={`px-2 py-0.5 cursor-pointer uppercase transition-colors ${
            l === locale
              ? "bg-foreground text-background font-medium"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
