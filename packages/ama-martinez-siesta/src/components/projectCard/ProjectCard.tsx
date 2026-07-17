import "./ProjectCard.scss";
import type { ProjectCardProps } from "./ProjectCard.interface";

function ProjectCard({ item, className = "", ariaHidden = false }: ProjectCardProps) {
  const projectTitle = item.title.rendered?.trim();
  const taxons = Array.isArray(item.taxon)
    ? item.taxon
    : typeof item.taxon === "string"
      ? item.taxon
          .split(",")
          .map((taxon) => taxon.replaceAll('"', "").trim())
          .filter(Boolean)
      : [];

  return (
    <>
      <a
        className={`project-card ${className}`.trim()}
        href={`/project/${item.slug}`}
        aria-hidden={ariaHidden || undefined}
        tabIndex={ariaHidden ? -1 : undefined}
      >
        {item.image && (
          <img
            className="project-card__image"
            src={item.image.guid}
            alt={projectTitle || ""}
          />
        )}

        <div className="project-card__top">
          {projectTitle && <p className="project-card__title">{projectTitle}</p>}
          {item.client && (
            <h2 className="project-card__client">{item.client}</h2>
          )}

          {item.year && <p className="project-card__year">{item.year}</p>}
        </div>
        <div className="project-card__bottom">
          {taxons.length > 0 && (
            <p className="project-card__taxon">
              {taxons.map((taxon, index) => (
                <span key={`${taxon}-${index}`} className="project-card__taxon-item">
                  {taxon}
                </span>
              ))}
            </p>
          )}
        </div>
      </a>
    </>
  );
}

export default ProjectCard;
