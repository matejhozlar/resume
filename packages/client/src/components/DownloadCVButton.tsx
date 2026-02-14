import { useState } from "react"
import { Download, Loader2, ChevronDown } from "lucide-react"
import { useLocale } from "@/hooks/useLocale"
import { LOCALES, type Locale } from "@/i18n/types"
import { uiStrings } from "@/i18n/translations"
import { getResolvedResume } from "@/data/resume"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DownloadCVButton() {
  const { locale, t } = useLocale()
  const [generating, setGenerating] = useState(false)

  async function downloadPDF(targetLocale: Locale) {
    if (generating) return
    setGenerating(true)

    try {
      const [{ pdf }, { ResumePDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/ResumePDF"),
      ])

      const data = getResolvedResume(targetLocale)
      const sectionTitles = uiStrings[targetLocale].sections
      const photoUrl = new URL("/assets/me.png", window.location.origin).href
      const blob = await pdf(
        ResumePDF({ data, sectionTitles, photoDataUrl: photoUrl }),
      ).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `Matej_Hozlar_CV_${targetLocale.toUpperCase()}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("PDF generation failed:", err)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="inline-flex items-center">
      <button
        onClick={() => downloadPDF(locale)}
        disabled={generating}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait"
      >
        {generating ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Download className="size-4" />
        )}
        {t.actions.downloadCV}
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            disabled={generating}
            className="ml-0.5 px-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait"
            aria-label="Choose language for CV download"
          >
            <ChevronDown className="size-3" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {LOCALES.map((l) => (
            <DropdownMenuItem
              key={l}
              onClick={() => downloadPDF(l)}
              className={
                l === locale ? "font-medium" : "text-muted-foreground"
              }
            >
              {l.toUpperCase()}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
