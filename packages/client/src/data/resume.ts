import type { Locale, TranslatedResumeFields } from "@/i18n/types"

export interface Job {
  title: string
  company: string
  period: string
  bullets: string[]
  tags?: string[]
  logo?: string
  url?: string
}

export interface Education {
  degree: string
  school: string
  period: string
  description?: string
}

export interface Project {
  name: string
  description: string
  tags: string[]
  image: string
  url?: string
  repo?: string
  badge?: {
    image: string
    url: string
  }
}

export interface ResumeData {
  name: string
  role: string
  location: string
  email: string
  github: string
  linkedin: string
  about: string
  education: Education[]
  projects: Project[]
  experience: Job[]
  skills: Record<string, string[]>
}

/* ── Shared (locale-independent) data ── */

const resumeShared = {
  name: "Matej Hozlár",
  email: "hozlarmatej0@gmail.com",
  github: "https://github.com/matejhozlar",
  linkedin: "https://www.linkedin.com/in/matej-hozl%C3%A1r-6175b5353/",
  experience: [
    {
      company: "BLAUHILL CAPITAL j.s.a.",
      period: "Apr 2024 – Present",
      logo: "/assets/companies/altfins.webp",
      url: "https://altfins.com",
      tags: ["Python"],
    },
    {
      company: "Honeywell",
      period: "Mar 2025 – Jan 2026",
      logo: "/assets/companies/honeywell.webp",
      tags: [
        "React",
        "TypeScript",
        "Node.js",
        "PostgreSQL",
        "Azure",
        "Git",
        "Jira",
        "Figma",
      ],
    },
    {
      company: "Recount-edit s.r.o.",
      period: "2022 – 2025",
      logo: "/assets/companies/recountedit.webp",
      tags: ["Python"],
    },
  ],
  education: [
    {
      school: "Gymnázium, Párovská 1, Nitra",
      period: "2014 – 2022",
    },
  ],
  projects: [
    {
      name: "AFKStatus",
      tags: ["Java"],
      image: "/assets/projects/afkstatus.webp",
      badge: {
        image:
          "https://img.shields.io/curseforge/dt/1318335?logo=curseforge&label=Downloads&color=F16436&labelColor=2D2D2D&style=flat-square",
        url: "https://www.curseforge.com/minecraft/mc-mods/afkstatus",
      },
      repo: "https://github.com/matejhozlar/afk-status",
    },
    {
      name: "Createrington",
      tags: ["React", "JavaScript", "PostgreSQL", "WebSockets"],
      image: "/assets/projects/createrington.webp",
      url: "https://create-rington.com",
      repo: "https://github.com/matejhozlar/mc-page",
    },
    {
      name: "Createrington Refactored",
      tags: ["React", "TypeScript", "PostgreSQL", "WebSockets"],
      image: "/assets/projects/createrington_new.webp",
      repo: "https://github.com/matejhozlar/createrington",
    },
    {
      name: "Crypto Docs",
      tags: ["Python", "JavaScript", "HTML", "Electron"],
      image: "/assets/projects/crypto.webp",
      repo: "https://github.com/matejhozlar/crypto-auto-docs",
    },
  ],
}

/* ── Per-locale translated fields ── */

const enResume: TranslatedResumeFields = {
  role: "Full-Stack Developer",
  location: "Prague, Czech Republic",
  about:
    "Hi, I'm Matej, a full-stack developer based in Prague, Czech Republic. I enjoy building tools and platforms that people genuinely find useful. My side project Createrington has grown into a small community of users who actively help shape its direction and keep me motivated to improve.",
  experience: [
    {
      title: "Crypto Research Analyst",
      bullets: [
        "Authored in-depth cryptocurrency research and market analysis published on altfins.com",
      ],
    },
    {
      title: "Full-stack Developer",
      bullets: [
        "Developed multiple full-stack applications for both internal teams and external clients",
        "Built a manuals management platform enabling clients to organize and access technical documentation",
        "Created vehicle configuration tools used to streamline fleet setup and maintenance workflows",
      ],
    },
    {
      title: "Network Administrator",
      bullets: [
        "Configured and maintained the company's IT network infrastructure",
      ],
    },
  ],
  education: [
    {
      degree: "Secondary School Diploma — Informatics & Mathematics",
      description:
        "8-year programme with a focus on Informatics and Mathematics.",
    },
  ],
  projects: [
    {
      description:
        "Lightweight server-side Minecraft mod for NeoForge that automatically tracks player activity and marks users as AFK. Features configurable timeouts, auto-kicking, scoreboard integration and a blacklist system.",
    },
    {
      description:
        "Full-stack community portal that unifies a Minecraft server, Discord and a web client into one seamless experience. Includes real-time cross-platform chat, playtime tracking with automatic role assignment and a simulated memecoin market.",
    },
    {
      description:
        "Ongoing ground-up rewrite of the original Createrington portal. Migrated to TypeScript with a tRPC API layer, cleaner architecture and a more polished, production-ready codebase.",
    },
    {
      description:
        "Automatic updates to crypto/stock investor portfolios. Available for all platforms.",
    },
  ],
  skills: {
    Languages: [
      "TypeScript",
      "JavaScript",
      "Python",
      "Java",
      "C",
      "C++",
      "HTML",
      "CSS",
    ],
    Frameworks: [
      "React",
      "Node.js",
      "Express",
      "tRPC",
      "Tailwind CSS",
      "PostgreSQL",
      "MySQL",
      "MQTT",
    ],
    Tools: ["Git", "Docker", "Azure", "Oracle", "Jira", "Figma", "Vite"],
  },
}

// SK and CS scaffolded as English copies — fill in real translations later
const skResume: TranslatedResumeFields = { ...enResume, experience: [...enResume.experience], education: [...enResume.education], projects: [...enResume.projects] }
const csResume: TranslatedResumeFields = { ...enResume, experience: [...enResume.experience], education: [...enResume.education], projects: [...enResume.projects] }

const translatedResume: Record<Locale, TranslatedResumeFields> = {
  en: enResume,
  sk: skResume,
  cs: csResume,
}

/* ── Merge shared + translated → ResumeData ── */

export function getResolvedResume(locale: Locale): ResumeData {
  const t = translatedResume[locale]

  if (
    t.experience.length !== resumeShared.experience.length ||
    t.education.length !== resumeShared.education.length ||
    t.projects.length !== resumeShared.projects.length
  ) {
    throw new Error(
      `Resume array length mismatch for locale "${locale}"`,
    )
  }

  return {
    name: resumeShared.name,
    role: t.role,
    location: t.location,
    email: resumeShared.email,
    github: resumeShared.github,
    linkedin: resumeShared.linkedin,
    about: t.about,
    experience: resumeShared.experience.map((job, i) => ({
      ...job,
      title: t.experience[i].title,
      bullets: t.experience[i].bullets,
    })),
    education: resumeShared.education.map((edu, i) => ({
      ...edu,
      degree: t.education[i].degree,
      description: t.education[i].description,
    })),
    projects: resumeShared.projects.map((proj, i) => ({
      ...proj,
      description: t.projects[i].description,
    })),
    skills: t.skills,
  }
}
