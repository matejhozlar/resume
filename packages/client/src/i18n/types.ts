export type Locale = "en" | "sk" | "cs"

export const LOCALES: Locale[] = ["en", "sk", "cs"]

export interface UiStrings {
  nav: {
    about: string
    experience: string
    projects: string
    skills: string
  }
  sections: {
    about: string
    experience: string
    projects: string
    skills: string
    education: string
  }
  actions: {
    downloadCV: string
    skipToContent: string
    previewCV: string
    generatingPDF: string
    download: string
    close: string
    pdfPreviewUnavailable: string
    downloadInstead: string
  }
  aria: {
    switchToLight: string
    switchToDark: string
    openMenu: string
    closeMenu: string
    email: string
    github: string
    linkedin: string
  }
}

export interface TranslatedResumeFields {
  role: string
  location: string
  about: string
  experience: {
    title: string
    bullets: string[]
  }[]
  education: {
    degree: string
    description?: string
  }[]
  projects: {
    description: string
  }[]
  skills: Record<string, string[]>
}
