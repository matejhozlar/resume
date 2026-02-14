/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from "react"
import type { Locale, UiStrings } from "./types"
import { uiStrings } from "./translations"
import { getResolvedResume, type ResumeData } from "@/data/resume"

export interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: UiStrings
  data: ResumeData
}

export const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    const saved = localStorage.getItem("locale")
    if (saved === "en" || saved === "sk" || saved === "cs") return saved
    return "en"
  })

  useEffect(() => {
    localStorage.setItem("locale", locale)
  }, [locale])

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t: uiStrings[locale],
      data: getResolvedResume(locale),
    }),
    [locale],
  )

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  )
}
