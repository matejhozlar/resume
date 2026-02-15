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
      const [QRCode, photoUrl] = await Promise.all([
        import("qrcode"),
        Promise.resolve(new URL("/assets/me.png", window.location.origin).href),
      ])
      const qrDataUrl = await QRCode.toDataURL("https://matejhoz.com", {
        width: 80,
        margin: 0,
        color: { dark: "#111111", light: "#ffffff" },
      })
      const blob = await pdf(
        ResumePDF({ data, sectionTitles, photoDataUrl: photoUrl, qrDataUrl }),
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
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          disabled={generating}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait"
        >
          {generating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Download className="size-4" />
          )}
          {t.actions.downloadCV}
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
  )
}
