import type { IconType } from "react-icons";
import {
  SiReact,
  SiJavascript,
  SiTypescript,
  SiPostgresql,
  SiMysql,
  SiNodedotjs,
  SiTailwindcss,
  SiNextdotjs,
  SiFramer,
  SiRedis,
  SiGraphql,
  SiGit,
  SiDocker,
  SiGithubactions,
  SiVite,
  SiFigma,
  SiGradle,
  SiPython,
  SiHtml5,
  SiCss3,
  SiExpress,
  SiTrpc,
  SiJira,
  SiOracle,
  SiCplusplus,
  SiC,
  SiMqtt,
  SiElectron,
} from "react-icons/si";
import { TbApi, TbWebhook } from "react-icons/tb";
import { FaJava, FaMicrosoft } from "react-icons/fa";
import { GiCube } from "react-icons/gi";

const iconMap: Record<string, { icon: IconType; color: string }> = {
  React: { icon: SiReact, color: "#61DAFB" },
  JavaScript: { icon: SiJavascript, color: "#F7DF1E" },
  TypeScript: { icon: SiTypescript, color: "#3178C6" },
  Python: { icon: SiPython, color: "#3776AB" },
  PostgreSQL: { icon: SiPostgresql, color: "#4169E1" },
  MySQL: { icon: SiMysql, color: "#4479A1" },
  WebSockets: { icon: TbWebhook, color: "#E535AB" },
  "Node.js": { icon: SiNodedotjs, color: "#5FA04E" },
  "Tailwind CSS": { icon: SiTailwindcss, color: "#06B6D4" },
  "Next.js": { icon: SiNextdotjs, color: "#FFFFFF" },
  "Framer Motion": { icon: SiFramer, color: "#0055FF" },
  Redis: { icon: SiRedis, color: "#FF4438" },
  GraphQL: { icon: SiGraphql, color: "#E10098" },
  "REST APIs": { icon: TbApi, color: "#68BC71" },
  Git: { icon: SiGit, color: "#F05032" },
  Docker: { icon: SiDocker, color: "#2496ED" },
  "GitHub Actions": { icon: SiGithubactions, color: "#2088FF" },
  Vite: { icon: SiVite, color: "#646CFF" },
  Figma: { icon: SiFigma, color: "#F24E1E" },
  Java: { icon: FaJava, color: "#ED8B00" },
  Gradle: { icon: SiGradle, color: "#02303A" },
  Minecraft: { icon: GiCube, color: "#62B47A" },
  HTML: { icon: SiHtml5, color: "#E34F26" },
  CSS: { icon: SiCss3, color: "#1572B6" },
  Express: { icon: SiExpress, color: "#FFFFFF" },
  tRPC: { icon: SiTrpc, color: "#2596BE" },
  C: { icon: SiC, color: "#A8B9CC" },
  "C++": { icon: SiCplusplus, color: "#00599C" },
  MQTT: { icon: SiMqtt, color: "#660066" },
  Jira: { icon: SiJira, color: "#0052CC" },
  Azure: { icon: FaMicrosoft, color: "#0078D4" },
  Oracle: { icon: SiOracle, color: "#F80000" },
  Electron: { icon: SiElectron, color: "#47848F" },
};

export function TechIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const entry = iconMap[name];
  if (!entry) return null;
  const { icon: Icon, color } = entry;
  return <Icon className={className} style={{ color, userSelect: "none" }} />;
}
