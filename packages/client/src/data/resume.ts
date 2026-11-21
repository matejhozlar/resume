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
      company: "ICNET",
      period: "Jun 2026 – Present",
      logo: "/assets/companies/icnet.webp",
      url: "https://www.icnet.eu",
      tags: [".NET", "C#", "React", "tvOS"],
    },
    {
      company: "BLAUHILL CAPITAL",
      period: "Apr 2024 – Present",
      logo: "/assets/companies/altfins.webp",
      url: "https://altfins.com",
      tags: ["Python"],
    },
    {
      company: "Honeywell",
      period: "Mar 2025 – May 2026",
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
      name: "Createrington Refactored",
      tags: ["React", "TypeScript", "PostgreSQL"],
      image: "/assets/projects/createrington_new.webp",
      url: "https://createrington.com",
      repo: "https://github.com/matejhozlar/createrington",
    },
    {
      name: "Climbable Ropes for Create Aeronautics",
      tags: ["Java"],
      image: "/assets/projects/climbable_ropes.webp",
      badge: {
        image:
          "https://img.shields.io/curseforge/dt/1528764?logo=curseforge&label=Downloads&color=F16436&labelColor=2D2D2D&style=flat-square",
        url: "https://www.curseforge.com/minecraft/mc-mods/create-aeronautics-climbable-ropes",
      },
      repo: "https://github.com/matejhozlar/Create-Aeronautics-Climbable-Ropes",
    },
    {
      name: "Createrington Currency",
      tags: ["Java"],
      image: "/assets/projects/createrington_currency.webp",
      badge: {
        image:
          "https://img.shields.io/curseforge/dt/1277058?logo=curseforge&label=Downloads&color=F16436&labelColor=2D2D2D&style=flat-square",
        url: "https://www.curseforge.com/minecraft/mc-mods/create-rington-currency",
      },
      repo: "https://github.com/matejhozlar/createrington-currency",
    },
    {
      name: "Createrington Skin API",
      tags: ["TypeScript", "three.js", "Fastify", "PostgreSQL", "Redis"],
      image: "/assets/projects/skin-api.webp",
      url: "https://api.createrington.com",
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
      title: "Full-stack Developer",
      bullets: [
        "Building full-stack applications end to end, from backend services and databases to frontends",
        "Developing .NET backends and React frontends for client projects",
        "Building an Apple tvOS app",
      ],
    },
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
        "NeoForge addon for Create: Aeronautics that lets players grab vertical ropes with an empty hand and climb them, something the base mod doesn't support. Adds climbing animations, controls for jumping off and letting go, and zipline riding on plunger ropes.",
    },
    {
      description:
        "NeoForge economy mod that syncs player balances in real time across multiple Minecraft servers through the Createrington REST API. Features physical currency items in eight denominations, JWT-authenticated bank accounts, ATM blocks and a full command suite for deposits, withdrawals and player-to-player transactions.",
    },
    {
      description:
        "High-performance REST API that renders Minecraft player skins into named poses and streams them back as PNG images. Built on Fastify with a three.js and headless-gl pipeline running across a multi-process worker pool, fronted by two-tier in-memory and Redis caching that keeps warm responses in the tens of milliseconds. PostgreSQL-backed accounts add API keys, SSO login, usage quotas and rate limiting, with a React dashboard and a published TypeScript SDK.",
    },
    {
      description:
        "Cross-platform automation suite combining Python scripts with an Electron desktop app to keep cryptocurrency portfolio spreadsheets current. Fetches live token prices and TVL data via CoinGecko and DefiLlama APIs, generates performance tables and supports both CLI and GUI workflows.",
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
      title: "Full-stack vývojár",
      bullets: [
        "Vývoj full-stack aplikácií od backendových služieb a databáz až po frontend",
        "Vývoj .NET backendov a React frontendov pre klientske projekty",
        "Vývoj aplikácie pre Apple tvOS",
      ],
    },
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
        "NeoForge doplnok pre Create: Aeronautics, ktorý hráčom umožňuje chytiť sa vertikálnych lán prázdnou rukou a šplhať po nich, čo základný mod nepodporuje. Pridáva animácie šplhania, ovládanie na zoskočenie a pustenie sa a jazdu po lanách ako na zipline.",
    },
    {
      description:
        "NeoForge ekonomický mod synchronizujúci zostatky hráčov v reálnom čase naprieč viacerými Minecraft servermi cez Createrington REST API. Obsahuje fyzické menové predmety v ôsmich nominálnych hodnotách, bankové účty s JWT autentifikáciou, ATM bloky a kompletnú sadu príkazov na vklady, výbery a transakcie medzi hráčmi.",
    },
    {
      description:
        "Vysokovýkonné REST API, ktoré renderuje Minecraft skiny hráčov do pomenovaných póz a vracia ich ako PNG obrázky. Postavené na Fastify s three.js a headless-gl renderovacím pipeline bežiacim naprieč multiprocesovým poolom workerov, s dvojúrovňovou in-memory a Redis cache, ktorá udržiava teplé odpovede v desiatkach milisekúnd. Účty postavené na PostgreSQL pridávajú API kľúče, SSO prihlásenie, kvóty využitia a rate limiting, spolu s React dashboardom a publikovaným TypeScript SDK.",
    },
    {
      description:
        "Multiplatformová automatizačná sada kombinujúca Python skripty s Electron desktopovou aplikáciou na udržiavanie kryptomenových portfóliových tabuliek aktuálnych. Získava živé ceny tokenov a TVL dáta cez CoinGecko a DefiLlama API, generuje výkonnostné tabuľky a podporuje CLI aj GUI pracovné postupy.",
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
      title: "Full-stack vývojář",
      bullets: [
        "Vývoj full-stack aplikací od backendových služeb a databází až po frontend",
        "Vývoj .NET backendů a React frontendů pro klientské projekty",
        "Vývoj aplikace pro Apple tvOS",
      ],
    },
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
        "NeoForge doplněk pro Create: Aeronautics, který hráčům umožňuje chytit se vertikálních lan prázdnou rukou a šplhat po nich, což základní mod nepodporuje. Přidává animace šplhání, ovládání pro seskok a puštění a jízdu po lanech jako na zipline.",
    },
    {
      description:
        "NeoForge ekonomický mod synchronizující zůstatky hráčů v reálném čase napříč více Minecraft servery přes Createrington REST API. Obsahuje fyzické měnové předměty v osmi nominálních hodnotách, bankovní účty s JWT autentifikací, ATM bloky a kompletní sadu příkazů pro vklady, výběry a transakce mezi hráči.",
    },
    {
      description:
        "Vysoce výkonné REST API, které renderuje Minecraft skiny hráčů do pojmenovaných póz a vrací je jako PNG obrázky. Postaveno na Fastify s three.js a headless-gl renderovacím pipeline běžícím napříč multiprocesovým poolem workerů, s dvouúrovňovou in-memory a Redis cache, která udržuje teplé odpovědi v desítkách milisekund. Účty postavené na PostgreSQL přidávají API klíče, SSO přihlášení, kvóty využití a rate limiting, spolu s React dashboardem a publikovaným TypeScript SDK.",
    },
    {
      description:
        "Multiplatformní automatizační sada kombinující Python skripty s Electron desktopovou aplikací pro udržování kryptoměnových portfoliových tabulek aktuálních. Získává živé ceny tokenů a TVL data přes CoinGecko a DefiLlama API, generuje výkonnostní tabulky a podporuje CLI i GUI pracovní postupy.",
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
