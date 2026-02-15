import { useState, useEffect, useRef, useCallback } from "react"
import { flushSync } from "react-dom"
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion"
import { Sun, Moon, Github, Linkedin, Mail, Menu, X } from "lucide-react"
import { Header } from "@/components/Header"
import { About } from "@/components/About"
import { Experience } from "@/components/Experience"
import { Projects } from "@/components/Projects"
import { Skills } from "@/components/Skills"
import { LocaleProvider } from "@/i18n/LocaleContext"
import { useLocale } from "@/hooks/useLocale"
import { LocaleSwitcher } from "@/components/LocaleSwitcher"

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

const sections = [
  { id: "intro" as const, Component: Header },
  { id: "about" as const, Component: About },
  { id: "experience" as const, Component: Experience },
  { id: "projects" as const, Component: Projects },
  { id: "skills" as const, Component: Skills },
]

function AppInner() {
  const { t, data } = useLocale()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme")
    return saved ? saved === "dark" : true
  })
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false })
  const themeToggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
    localStorage.setItem("theme", dark ? "dark" : "light")
  }, [dark])

  const handleThemeToggle = useCallback(() => {
    const button = themeToggleRef.current
    if (!button || !("startViewTransition" in document)) {
      setDark((d) => !d)
      return
    }

    const rect = button.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )

    const root = document.documentElement
    root.style.setProperty("--wipe-x", `${x}px`)
    root.style.setProperty("--wipe-y", `${y}px`)
    root.style.setProperty("--wipe-radius", `${maxRadius}px`)

    ;(document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
      flushSync(() => setDark((d) => !d))
    })
  }, [])

  // Global cursor glow
  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      setCursor({ x: e.clientX, y: e.clientY, visible: true })
    }
    function handleMouseLeave() {
      setCursor((c) => ({ ...c, visible: false }))
    }
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    document.documentElement.addEventListener("mouseleave", handleMouseLeave)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  const navLinks = sections
    .filter((s) => s.id !== "intro")
    .map((s) => ({ ...s, label: t.nav[s.id as keyof typeof t.nav] }))

  return (
    <LazyMotion features={domAnimation}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:rounded-md focus:outline-ring"
      >
        {t.actions.skipToContent}
      </a>

      {/* Cursor glow */}
      <div
        className="pointer-events-none fixed inset-0 z-[999] transition-opacity duration-300 hidden lg:block"
        style={{
          opacity: cursor.visible ? 1 : 0,
          background: `radial-gradient(600px circle at ${cursor.x}px ${cursor.y}px, rgba(255,255,255,0.03), transparent 60%)`,
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-6 flex items-center justify-between h-12">
          <a
            href="#intro"
            className="text-sm font-medium text-foreground hover:text-foreground/80 transition-colors"
          >
            MH
          </a>
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="hidden sm:block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
            <LocaleSwitcher />
            <button
              ref={themeToggleRef}
              onClick={handleThemeToggle}
              aria-label={dark ? t.aria.switchToLight : t.aria.switchToDark}
              className="cursor-pointer rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label={t.aria.openMenu}
              className="sm:hidden cursor-pointer rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Menu className="size-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm sm:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <m.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-64 border-l border-border bg-background p-6 sm:hidden"
            >
              <div className="flex items-center justify-between">
                <LocaleSwitcher />
                <button
                  onClick={() => setSidebarOpen(false)}
                  aria-label={t.aria.closeMenu}
                  className="cursor-pointer rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="mt-8 flex flex-col gap-6">
                {navLinks.map((link) => (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={() => setSidebarOpen(false)}
                    className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </m.aside>
          </>
        )}
      </AnimatePresence>

      <main id="main" className="max-w-3xl mx-auto px-6 pt-24 pb-16 space-y-12">
        {sections.map(({ id, Component }, i) => (
          <div key={id} id={id} className="scroll-mt-20">
            {i > 0 && (
              <m.hr
                className="section-separator mb-12"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            )}
            <m.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <Component />
            </m.div>
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} {data.name}</span>
          <div className="flex items-center gap-4">
            <MagneticIcon
              href={`mailto:${data.email}`}
              aria-label={t.aria.email}
            >
              <Mail className="size-4" />
            </MagneticIcon>
            <MagneticIcon
              href={data.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.aria.github}
            >
              <Github className="size-4" />
            </MagneticIcon>
            <MagneticIcon
              href={data.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.aria.linkedin}
            >
              <Linkedin className="size-4" />
            </MagneticIcon>
          </div>
        </div>
      </footer>
    </LazyMotion>
  )
}

function MagneticIcon({ children, ...props }: React.ComponentProps<"a">) {
  const ref = useRef<HTMLAnchorElement>(null)

  function handleMouseMove(e: React.MouseEvent) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    el.style.transition = "transform 0.15s ease-out"
    el.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`
  }

  function handleMouseLeave() {
    const el = ref.current
    if (!el) return
    el.style.transition = "transform 0.3s ease-out"
    el.style.transform = ""
  }

  return (
    <a
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block hover:text-foreground transition-colors"
      {...props}
    >
      {children}
    </a>
  )
}

function App() {
  return (
    <LocaleProvider>
      <AppInner />
    </LocaleProvider>
  )
}

export default App
