import { useState, useRef, useEffect } from "react"
import { Download, Loader2, ChevronDown } from "lucide-react"
import { useLocale } from "@/hooks/useLocale"
import { LOCALES, type Locale } from "@/i18n/types"
import { uiStrings } from "@/i18n/translations"
import { getResolvedResume } from "@/data/resume"

export function DownloadCVButton() {
  const { locale, t } = useLocale()
  const [generating, setGenerating] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!dropdownOpen) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [dropdownOpen])

  async function downloadPDF(targetLocale: Locale) {
    if (generating) return
    setGenerating(true)
    setDropdownOpen(false)

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
    <div ref={ref} className="relative inline-flex items-center">
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
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        disabled={generating}
        className="ml-0.5 px-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait"
        aria-label="Choose language for CV download"
      >
        <ChevronDown className="size-3" />
      </button>

      {dropdownOpen && (
        <div className="absolute top-full right-0 mt-1 rounded-md border border-border bg-background shadow-lg py-1 z-10">
          {LOCALES.map((l) => (
            <button
              key={l}
              onClick={() => downloadPDF(l)}
              className={`block w-full text-left px-3 py-1 text-sm cursor-pointer hover:bg-muted transition-colors ${
                l === locale
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
