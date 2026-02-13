export interface Job {
  title: string
  company: string
  period: string
  bullets: string[]
}

export interface Project {
  name: string
  description: string
  tags: string[]
  url?: string
  repo?: string
}

export interface ResumeData {
  name: string
  role: string
  email: string
  github: string
  linkedin: string
  about: string
  projects: Project[]
  experience: Job[]
  education: {
    degree: string
    school: string
    period: string
  }
  skills: Record<string, string[]>
}

export const resume: ResumeData = {
  name: "Matej Doe",
  role: "Full-Stack Developer",
  email: "matej@example.com",
  github: "https://github.com/matej",
  linkedin: "https://linkedin.com/in/matej",
  about:
    "Passionate full-stack developer with experience building modern web applications. I enjoy crafting clean, performant user interfaces and designing robust backend systems. Always learning, always shipping.",
  projects: [
    {
      name: "DevBoard",
      description:
        "A real-time Kanban board for developer teams with drag-and-drop, WebSocket sync, and GitHub integration.",
      tags: ["React", "Node.js", "PostgreSQL", "WebSockets"],
      url: "https://devboard.example.com",
      repo: "https://github.com/matej/devboard",
    },
    {
      name: "PixelGen",
      description:
        "CLI tool that generates pixel art sprites from text prompts using a local diffusion model. Ships as a single binary.",
      tags: ["Rust", "Stable Diffusion", "CLI"],
      repo: "https://github.com/matej/pixelgen",
    },
    {
      name: "Cashflow",
      description:
        "Personal finance tracker with bank account syncing, budgeting, and interactive charts. Built as a progressive web app.",
      tags: ["Next.js", "Tailwind CSS", "Plaid API", "D3.js"],
      url: "https://cashflow.example.com",
    },
  ],
  experience: [
    {
      title: "Senior Frontend Engineer",
      company: "Acme Corp",
      period: "2022 – Present",
      bullets: [
        "Led migration from legacy jQuery codebase to React + TypeScript, improving developer velocity by 40%.",
        "Built a real-time dashboard serving 10k+ daily active users with WebSocket integration.",
        "Mentored a team of 4 junior engineers through code reviews and pair programming sessions.",
      ],
    },
    {
      title: "Full-Stack Developer",
      company: "StartupXYZ",
      period: "2019 – 2022",
      bullets: [
        "Designed and implemented RESTful APIs with Node.js and PostgreSQL, handling 1M+ requests/day.",
        "Developed a component library used across 3 product teams, reducing UI inconsistencies by 60%.",
        "Introduced CI/CD pipelines with GitHub Actions, cutting deployment time from hours to minutes.",
      ],
    },
    {
      title: "Junior Developer",
      company: "WebAgency",
      period: "2017 – 2019",
      bullets: [
        "Built responsive marketing sites and landing pages for clients across various industries.",
        "Implemented A/B testing infrastructure that increased client conversion rates by 25%.",
      ],
    },
  ],
  education: {
    degree: "B.Sc. Computer Science",
    school: "University of Technology",
    period: "2013 – 2017",
  },
  skills: {
    Frontend: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Framer Motion"],
    Backend: ["Node.js", "PostgreSQL", "Redis", "GraphQL", "REST APIs"],
    Tools: ["Git", "Docker", "GitHub Actions", "Vite", "Figma"],
  },
}
