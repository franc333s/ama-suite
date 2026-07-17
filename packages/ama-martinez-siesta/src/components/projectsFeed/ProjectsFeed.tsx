import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFetchWorks } from "../../hooks/useFetchWorks";
import ProjectsCategories from "../projectsCategories/projectsCategories";
import ProjectCard from "../projectCard/ProjectCard";
import "./ProjectsFeed.scss";

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const parseTaxons = (taxon: string[] | string | undefined): string[] => {
  if (Array.isArray(taxon)) return taxon;
  if (typeof taxon !== "string") return [];

  return taxon
    .split(",")
    .map((item) => item.replaceAll('"', "").trim())
    .filter(Boolean);
};

const hasCategoryMatch = (
  taxon: string[] | string | undefined,
  selectedCategorySlug: string | null,
) => {
  if (!selectedCategorySlug) return true;
  const taxonSlugs = parseTaxons(taxon).map(toSlug);
  return taxonSlugs.includes(selectedCategorySlug);
};

function ProjectsFeed() {
  const { category: selectedCategory } = useParams<{ category?: string }>();
  const { works, loading, error } = useFetchWorks("projectcard");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' o 'index'
  const [isOverDesktopBp, setIsOverDesktopBp] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsOverDesktopBp(window.innerWidth > 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const selectedCategorySlug = useMemo(
    () => (selectedCategory ? toSlug(selectedCategory) : null),
    [selectedCategory],
  );

  const filteredWorks = useMemo(() => {
    if (!selectedCategorySlug) return works;
    return works.filter((work) => hasCategoryMatch(work.taxon, selectedCategorySlug));
  }, [works, selectedCategorySlug]);

  const worksToRender = isOverDesktopBp ? works : filteredWorks;
  const isDesktopCategoryFilterActive = isOverDesktopBp && Boolean(selectedCategorySlug);
  const visibleCount = isDesktopCategoryFilterActive ? filteredWorks.length : worksToRender.length;
  const hiddenCount = isDesktopCategoryFilterActive
    ? works.length - filteredWorks.length
    : 0;

  if (loading)
    return (
      <>
        <div className="spinner-wrapper">
          <div className="spinner">
            <span className="item item-one"></span>
            <span className="item item-two"></span>
            <span className="item item-three"></span>
            <span className="item item-four"></span>
          </div>
        </div>
      </>
    );

  if (error) return <p>Error al cargar los proyectos</p>;

  return (
    <>
      <ProjectsCategories />

      <div className="projects-layout-controls">
        <button
          className={`button ${viewMode === "grid" ? "active" : ""}`}
          onClick={() => setViewMode("grid")}
        >
          [Grid]
        </button>
        <button
          className={`button ${viewMode === "index" ? "active" : ""}`}
          onClick={() => setViewMode("index")}
        >
          [Index]
        </button>
      </div>

      {isDesktopCategoryFilterActive && (
        <p id="projects-filter-status" className="projects-feed__sr-only" aria-live="polite">
          Categoria seleccionada: {selectedCategory}. Mostrando {visibleCount} proyectos. Hay{" "}
          {hiddenCount} proyectos ocultos porque no pertenecen a esta categoria.
        </p>
      )}

      <section
        className={`projects-feed view-${viewMode}`}
        aria-describedby={isDesktopCategoryFilterActive ? "projects-filter-status" : undefined}
      >
        {worksToRender.map((item) => {
          const isHiddenByCategory =
            isDesktopCategoryFilterActive &&
            !hasCategoryMatch(item.taxon, selectedCategorySlug);

          return (
            <ProjectCard
              key={item.id}
              item={item}
              ariaHidden={isHiddenByCategory}
              className={isHiddenByCategory ? "project-card--hidden-slot" : ""}
            />
          );
        })}
      </section>
    </>
  );
}

export default ProjectsFeed;
