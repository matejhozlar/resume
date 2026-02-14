import type { Locale, UiStrings } from "./types"

const en: UiStrings = {
  nav: {
    about: "About",
    experience: "Experience",
    projects: "Projects",
    skills: "Skills",
  },
  sections: {
    about: "About",
    experience: "Experience",
    projects: "Projects",
    skills: "Skills",
    education: "Education",
  },
  actions: {
    downloadCV: "Download CV",
    skipToContent: "Skip to content",
  },
  aria: {
    switchToLight: "Switch to light mode",
    switchToDark: "Switch to dark mode",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    email: "Email",
    github: "GitHub",
    linkedin: "LinkedIn",
  },
}

// SK and CS scaffolded as English copies — fill in real translations later
const sk: UiStrings = {
  nav: {
    about: "About",
    experience: "Experience",
    projects: "Projects",
    skills: "Skills",
  },
  sections: {
    about: "About",
    experience: "Experience",
    projects: "Projects",
    skills: "Skills",
    education: "Education",
  },
  actions: {
    downloadCV: "Download CV",
    skipToContent: "Skip to content",
  },
  aria: {
    switchToLight: "Switch to light mode",
    switchToDark: "Switch to dark mode",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    email: "Email",
    github: "GitHub",
    linkedin: "LinkedIn",
  },
}

const cs: UiStrings = {
  nav: {
    about: "About",
    experience: "Experience",
    projects: "Projects",
    skills: "Skills",
  },
  sections: {
    about: "About",
    experience: "Experience",
    projects: "Projects",
    skills: "Skills",
    education: "Education",
  },
  actions: {
    downloadCV: "Download CV",
    skipToContent: "Skip to content",
  },
  aria: {
    switchToLight: "Switch to light mode",
    switchToDark: "Switch to dark mode",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    email: "Email",
    github: "GitHub",
    linkedin: "LinkedIn",
  },
}

export const uiStrings: Record<Locale, UiStrings> = { en, sk, cs }
