export interface Job {
  title: string;
  company: string;
  period: string;
  bullets: string[];
  tags?: string[];
  logo?: string;
  url?: string;
}

export interface Project {
  name: string;
  description: string;
  tags: string[];
  image: string;
  url?: string;
  repo?: string;
  badge?: {
    image: string;
    url: string;
  };
}

export interface ResumeData {
  name: string;
  role: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  about: string;
  projects: Project[];
  experience: Job[];
  skills: Record<string, string[]>;
}

export const resume: ResumeData = {
  name: "Matej Hozlár",
  role: "Full-Stack Developer",
  location: "Prague, Czech Republic",
  email: "hozlarmatej0@gmail.com",
  github: "https://github.com/matejhozlar",
  linkedin: "https://www.linkedin.com/in/matej-hozl%C3%A1r-6175b5353/",
  about:
    "Hi, I'm Matej, a full-stack developer based in Prague, Czech Republic. I enjoy building tools and platforms that people genuinely find useful. My side project Createrington has grown into a small community of users who actively help shape its direction and keep me motivated to improve.",
  projects: [
    {
      name: "AFKStatus",
      description:
        "Lightweight server-side Minecraft mod for NeoForge that automatically tracks player activity and marks users as AFK. Features configurable timeouts, auto-kicking, scoreboard integration and a blacklist system.",
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
      description:
        "Full-stack community portal that unifies a Minecraft server, Discord and a web client into one seamless experience. Includes real-time cross-platform chat, playtime tracking with automatic role assignment and a simulated memecoin market.",
      tags: ["React", "JavaScript", "PostgreSQL", "WebSockets"],
      image: "/assets/projects/createrington.webp",
      url: "https://create-rington.com",
      repo: "https://github.com/matejhozlar/mc-page",
    },
    {
      name: "Createrington Refactored",
      description:
        "Ongoing ground-up rewrite of the original Createrington portal. Migrated to TypeScript with a tRPC API layer, cleaner architecture and a more polished, production-ready codebase.",
      tags: ["React", "TypeScript", "PostgreSQL", "WebSockets"],
      image: "/assets/projects/createrington_new.webp",
      repo: "https://github.com/matejhozlar/createrington",
    },
    {
      name: "Crypto Docs",
      description:
        "Automatic updates to crypto/stock investor portfolios. Available for all platforms.",
      tags: ["Python", "JavaScript", "HTML", "Electron"],
      image: "/assets/projects/crypto.webp",
      repo: "https://github.com/matejhozlar/crypto-auto-docs",
    },
  ],
  experience: [
{
      title: "Crypto Research Analyst",
      company: "BLAUHILL CAPITAL j.s.a.",
      period: "Apr 2024 – Present",
      logo: "/assets/companies/altfins.webp",
      url: "https://altfins.com",
      bullets: [
        "Authored in-depth cryptocurrency research and market analysis published on altfins.com",
      ],
      tags: ["Python"],
    },
    {
      title: "Full-stack Developer",
      company: "Honeywell",
      period: "Mar 2025 – Jan 2026",
      logo: "/assets/companies/honeywell.webp",
      bullets: [
        "Developed multiple full-stack applications for both internal teams and external clients",
        "Built a manuals management platform enabling clients to organize and access technical documentation",
        "Created vehicle configuration tools used to streamline fleet setup and maintenance workflows",
      ],
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
      title: "Network Administrator",
      company: "Recount-edit s.r.o.",
      period: "2022 – 2025",
      logo: "/assets/companies/recountedit.webp",
      bullets: [
        "Configured and maintained the company's IT network infrastructure",
      ],
      tags: ["Python"],
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
};
