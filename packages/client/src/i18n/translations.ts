import type { Locale, UiStrings } from "./types";

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
};

const sk: UiStrings = {
  nav: {
    about: "O mne",
    experience: "Skúsenosti",
    projects: "Projekty",
    skills: "Zručnosti",
  },
  sections: {
    about: "O mne",
    experience: "Skúsenosti",
    projects: "Projekty",
    skills: "Zručnosti",
    education: "Vzdelanie",
  },
  actions: {
    downloadCV: "Stiahnúť CV",
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
};

const cs: UiStrings = {
  nav: {
    about: "O mně",
    experience: "Zkušenosti",
    projects: "Projekty",
    skills: "Dovednosti",
  },
  sections: {
    about: "O mně",
    experience: "Zkušenosti",
    projects: "Projekty",
    skills: "Dovednosti",
    education: "Vzdelání",
  },
  actions: {
    downloadCV: "Stáhnout CV",
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
};

export const uiStrings: Record<Locale, UiStrings> = { en, sk, cs };
