import type { Locale, TranslatedResumeFields } from "@/i18n/types";

export interface Job {
  title: string;
  company: string;
  period: string;
  bullets: string[];
  tags?: string[];
  logo?: string;
  url?: string;
}

export interface Education {
  degree: string;
  school: string;
  period: string;
  description?: string;
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
  education: Education[];
  projects: Project[];
  experience: Job[];
  skills: Record<string, string[]>;
}

const resumeShared = {
  name: "Matej Hozlár",
  email: "hozlarmatej0@gmail.com",
  github: "https://github.com/matejhozlar",
  linkedin: "https://www.linkedin.com/in/matej-hozl%C3%A1r-6175b5353/",
  experience: [
    {
      company: "BLAUHILL CAPITAL",
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
      company: "Recount-edit",
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
      tags: ["React", "JavaScript", "PostgreSQL"],
      image: "/assets/projects/createrington.webp",
      url: "https://create-rington.com",
      repo: "https://github.com/matejhozlar/mc-page",
    },
    {
      name: "Createrington Refactored",
      tags: ["React", "TypeScript", "PostgreSQL"],
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
};

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
        "Built internal apps for automated portfolio tracking and management",
        "Developed AI-driven automation tools to streamline research and reporting workflows",
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
      degree: "Secondary School Diploma",
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
    "Spoken Languages": [
      "Slovak (Native)",
      "Czech (Fluent)",
      "English (Fluent)",
      "German (Basic)",
    ],
  },
};

const skResume: TranslatedResumeFields = {
  role: "Full-Stack Developer",
  location: "Praha, Česká republika",
  about:
    "Ahoj, som Matej, full-stack developer žijúci v Prahe. Rád tvorím nástroje a platformy, ktoré ľudia skutočne využívajú. Môj vedľajší projekt Createrington prerástol do malej komunity používateľov, ktorí aktívne pomáhajú formovať jeho smerovanie a motivujú ma k zlepšovaniu.",
  experience: [
    {
      title: "Krypto analytik",
      bullets: [
        "Tvorba hĺbkových analýz kryptomien a trhov publikovaných na altfins.com",
        "Vývoj interných aplikácií na automatizované sledovanie a správu portfólií",
        "Vývoj automatizačných nástrojov poháňaných AI na zefektívnenie výskumu a reportingu",
      ],
    },
    {
      title: "Full-stack vývojár",
      bullets: [
        "Vývoj viacerých full-stack aplikácií pre interné tímy aj externých klientov",
        "Vytvorenie platformy na správu manuálov umožňujúcej klientom organizovať a pristupovať k technickej dokumentácii",
        "Tvorba nástrojov na konfiguráciu vozidiel na zefektívnenie nastavovania a údržby flotíl",
      ],
    },
    {
      title: "Správca siete",
      bullets: ["Konfigurácia a údržba sieťovej infraštruktúry spoločnosti"],
    },
  ],
  education: [
    {
      degree: "Maturitné vysvedčenie",
      description: "8-ročný program so zameraním na informatiku a matematiku.",
    },
  ],
  projects: [
    {
      description:
        "Ľahký serverový Minecraft mod pre NeoForge, ktorý automaticky sleduje aktivitu hráčov a označuje ich ako AFK. Obsahuje konfigurovateľné časové limity, automatické vyhadzovanie, integráciu so scoreboard a systém blacklistu.",
    },
    {
      description:
        "Full-stack komunitný portál spájajúci Minecraft server, Discord a webového klienta do jedného celku. Obsahuje real-time multiplatformový chat, sledovanie herného času s automatickým prideľovaním rolí a simulovaný memecoin trh.",
    },
    {
      description:
        "Prebiehajúci kompletný prepis pôvodného portálu Createrington. Migrácia na TypeScript s tRPC API vrstvou, čistejšou architektúrou a vyleštenejším kódom pripravením na produkciu.",
    },
    {
      description:
        "Automatické aktualizácie portfólií krypto/akciových investorov. Dostupné pre všetky platformy.",
    },
  ],
  skills: {
    Jazyky: [
      "TypeScript",
      "JavaScript",
      "Python",
      "Java",
      "C",
      "C++",
      "HTML",
      "CSS",
    ],
    Frameworky: [
      "React",
      "Node.js",
      "Express",
      "tRPC",
      "Tailwind CSS",
      "PostgreSQL",
      "MySQL",
      "MQTT",
    ],
    Nástroje: ["Git", "Docker", "Azure", "Oracle", "Jira", "Figma", "Vite"],
    "Hovorené jazyky": [
      "Slovenčina (Rodný)",
      "Čeština (Plynulá)",
      "Angličtina (Plynulá)",
      "Nemčina (Základy)",
    ],
  },
};

const csResume: TranslatedResumeFields = {
  role: "Full-Stack Developer",
  location: "Praha, Česká republika",
  about:
    "Ahoj, jsem Matej, full-stack developer žijící v Praze. Rád vytvářím nástroje a platformy, které lidé skutečně využívají. Můj vedlejší projekt Createrington přerostl v malou komunitu uživatelů, kteří aktivně pomáhají formovat jeho směřování a motivují mě ke zlepšování.",
  experience: [
    {
      title: "Krypto analytik",
      bullets: [
        "Tvorba hloubkových analýz kryptoměn a trhů publikovaných na altfins.com",
        "Vývoj interních aplikací pro automatizované sledování a správu portfolií",
        "Vývoj automatizačních nástrojů poháněných AI pro zefektivnění výzkumu a reportingu",
      ],
    },
    {
      title: "Full-stack vývojář",
      bullets: [
        "Vývoj více full-stack aplikací pro interní týmy i externí klienty",
        "Vytvoření platformy pro správu manuálů umožňující klientům organizovat a přistupovat k technické dokumentaci",
        "Tvorba nástrojů pro konfiguraci vozidel k zefektivnění nastavování a údržby flotil",
      ],
    },
    {
      title: "Správce sítě",
      bullets: ["Konfigurace a údržba síťové infrastruktury společnosti"],
    },
  ],
  education: [
    {
      degree: "Maturitní vysvědčení",
      description: "8letý program se zaměřením na informatiku a matematiku.",
    },
  ],
  projects: [
    {
      description:
        "Lehký serverový Minecraft mod pro NeoForge, který automaticky sleduje aktivitu hráčů a označuje je jako AFK. Obsahuje konfigurovatelné časové limity, automatické vyhazování, integraci se scoreboard a systém blacklistu.",
    },
    {
      description:
        "Full-stack komunitní portál spojující Minecraft server, Discord a webového klienta do jednoho celku. Obsahuje real-time multiplatformový chat, sledování herního času s automatickým přidělováním rolí a simulovaný memecoin trh.",
    },
    {
      description:
        "Probíhající kompletní přepis původního portálu Createrington. Migrace na TypeScript s tRPC API vrstvou, čistější architekturou a vyladěnějším kódem připraveným pro produkci.",
    },
    {
      description:
        "Automatické aktualizace portfolií krypto/akciových investorů. Dostupné pro všechny platformy.",
    },
  ],
  skills: {
    Jazyky: [
      "TypeScript",
      "JavaScript",
      "Python",
      "Java",
      "C",
      "C++",
      "HTML",
      "CSS",
    ],
    Frameworky: [
      "React",
      "Node.js",
      "Express",
      "tRPC",
      "Tailwind CSS",
      "PostgreSQL",
      "MySQL",
      "MQTT",
    ],
    Nástroje: ["Git", "Docker", "Azure", "Oracle", "Jira", "Figma", "Vite"],
    "Mluvené jazyky": [
      "Slovenština (Rodilý)",
      "Čeština (Plynulá)",
      "Angličtina (Plynulá)",
      "Němčina (Základy)",
    ],
  },
};

const translatedResume: Record<Locale, TranslatedResumeFields> = {
  en: enResume,
  sk: skResume,
  cs: csResume,
};

export function getResolvedResume(locale: Locale): ResumeData {
  const t = translatedResume[locale];

  if (
    t.experience.length !== resumeShared.experience.length ||
    t.education.length !== resumeShared.education.length ||
    t.projects.length !== resumeShared.projects.length
  ) {
    throw new Error(`Resume array length mismatch for locale "${locale}"`);
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
  };
}
