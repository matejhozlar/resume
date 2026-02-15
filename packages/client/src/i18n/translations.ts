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
    previewCV: "CV Preview",
    generatingPDF: "Generating PDF…",
    download: "Download",
    close: "Close",
    pdfPreviewUnavailable: "PDF preview is not available in your browser.",
    downloadInstead: "Download PDF",
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
    previewCV: "Náhľad CV",
    generatingPDF: "Generujem PDF…",
    download: "Stiahnuť",
    close: "Zavrieť",
    pdfPreviewUnavailable: "Náhľad PDF nie je vo vašom prehliadači dostupný.",
    downloadInstead: "Stiahnuť PDF",
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
    previewCV: "Náhled CV",
    generatingPDF: "Generuji PDF…",
    download: "Stáhnout",
    close: "Zavřít",
    pdfPreviewUnavailable: "Náhled PDF není ve vašem prohlížeči dostupný.",
    downloadInstead: "Stáhnout PDF",
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
