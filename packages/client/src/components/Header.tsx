import { useState } from "react"
import { Mail, Github, Linkedin, Check } from "lucide-react"
import { useLocale } from "@/hooks/useLocale"
import { DownloadCVButton } from "@/components/DownloadCVButton"

export function Header() {
  const { data } = useLocale()
  const [copied, setCopied] = useState(false)

  function handleCopyEmail() {
    navigator.clipboard.writeText(data.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <header className="flex items-center gap-6">
      <div className="relative size-24 shrink-0 rounded-full overflow-hidden group">
        <img
          src="/assets/me_pixel.webp"
          alt={data.name}
          className="absolute inset-0 size-full object-cover transition-opacity duration-300 group-hover:opacity-0"
        />
        <img
          src="/assets/me.webp"
          alt={data.name}
          className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight leading-normal">
          {data.name} <span className="max-[550px]:hidden text-lg text-muted-foreground font-normal">| {data.role}</span>
        </h1>
        <p className="min-[551px]:hidden text-lg text-muted-foreground font-normal">{data.role}</p>
        <p className="mt-0.5 text-sm text-muted-foreground/70">{data.location}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <button
            onClick={handleCopyEmail}
            className="inline-flex items-center hover:text-foreground transition-colors cursor-pointer"
          >
            <span className="min-[551px]:hidden">
              {copied ? <Check className="size-4" /> : <Mail className="size-4" />}
            </span>
            <span className="max-[550px]:hidden relative">
              <span className="invisible inline-flex items-center gap-1.5">
                <Mail className="size-4 shrink-0" />
                {data.email}
              </span>
              <span className={`absolute inset-0 flex items-center gap-1.5 ${copied ? "justify-center" : ""}`}>
                {copied ? <Check className="size-4 shrink-0" /> : <Mail className="size-4 shrink-0" />}
                {copied ? "Copied!" : data.email}
              </span>
            </span>
          </button>
          <a href={data.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Github className="size-4" />
            <span className="max-[550px]:hidden">GitHub</span>
          </a>
          <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Linkedin className="size-4" />
            <span className="max-[550px]:hidden">LinkedIn</span>
          </a>
          <DownloadCVButton />
        </div>
      </div>
    </header>
  )
}
