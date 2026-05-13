import { m } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { TechIcon } from "@/components/TechIcon";
import { useLocale } from "@/hooks/useLocale";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const card = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function Projects() {
  const { t, data } = useLocale();

  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight">
        {t.sections.projects}
      </h2>

      <m.div
        className="mt-4 grid grid-cols-1 gap-3"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {data.projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </m.div>
    </section>
  );
}

function ProjectCard({
  project,
}: {
  project: {
    name: string;
    description: string;
    tags: string[];
    image: string;
    url?: string;
    repo?: string;
    badge?: { image: string; url: string };
  };
}) {
  return (
    <m.article
      variants={card}
      className="flex gap-4 rounded-lg border border-border bg-card/30 p-4 transition-colors hover:border-foreground/20"
    >
      <img
        src={project.image}
        alt=""
        loading="lazy"
        className="hidden sm:block size-20 shrink-0 rounded-md object-cover border border-border"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-medium text-foreground">
            {project.name}
          </h3>
          <div className="flex items-center gap-2 shrink-0 text-muted-foreground">
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.name} repository`}
                className="hover:text-foreground transition-colors"
              >
                <Github className="size-4" />
              </a>
            )}
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.name} live site`}
                className="hover:text-foreground transition-colors"
              >
                <ExternalLink className="size-4" />
              </a>
            )}
          </div>
        </div>

        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          {project.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground select-none"
            >
              <TechIcon name={tag} className="size-3 shrink-0" />
              {tag}
            </span>
          ))}
          {project.badge && (
            <a
              href={project.badge.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto"
            >
              <img
                src={project.badge.image}
                alt="Downloads"
                loading="lazy"
                className="h-5 rounded"
              />
            </a>
          )}
        </div>
      </div>
    </m.article>
  );
}
