import { LOCALES, type Locale } from "@/i18n/types"
import { useLocale } from "@/hooks/useLocale"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocale()

  return (
    <ToggleGroup
      type="single"
      value={locale}
      onValueChange={(value) => {
        if (value) setLocale(value as Locale)
      }}
      className="rounded-full border border-border overflow-hidden"
    >
      {LOCALES.map((l) => (
        <ToggleGroupItem
          key={l}
          value={l}
          className="h-auto rounded-none px-2 py-0.5 text-xs uppercase cursor-pointer border-0 shadow-none data-[state=on]:bg-foreground data-[state=on]:text-background data-[state=on]:font-medium data-[state=off]:text-muted-foreground data-[state=off]:hover:text-foreground"
        >
          {l}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
