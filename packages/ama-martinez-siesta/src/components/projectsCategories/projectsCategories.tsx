import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./projectsCategories.scss";

function ProjectsCategories() {
  const [isMobile, setIsMobile] = useState(false);
  const { category: selectedCategory } = useParams<{ category?: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const categories = [
    { slug: null, label: "All Projects" },
    { slug: "graphic-design", label: "Graphic Design" },
    { slug: "art-direction", label: "Art Direction" },
    { slug: "photography", label: "Photography" },
    { slug: "video", label: "Video" },
    { slug: "branding", label: "Branding" },
    { slug: "social-media", label: "Social Media" },
    { slug: "siesta", label: "Siesta" },
    { slug: "set-design", label: "Set Design" },
    { slug: "stants", label: "Stants" },
  ];

  const isActive = (slug: string | null) => {
    if (slug === null) return !selectedCategory;
    return selectedCategory === slug;
  };

  const handleCategoryClick = (slug: string | null, e: React.MouseEvent) => {
    e.preventDefault();
    if (slug === null) {
      navigate("/projects");
    } else {
      navigate(`/projects/${slug}`);
    }
  };

  // solo renderiza en < 768
  if (!isMobile) return null;

  return (
    <>
      <ul className="projects-categories">
        {categories.map((cat) => (
          <li key={cat.slug || "all"}>
            <a
              className={`category ${isActive(cat.slug) ? "active" : ""}`}
              href={cat.slug ? `/projects/${cat.slug}` : "/projects"}
              onClick={(e) => handleCategoryClick(cat.slug, e)}
            >
              {cat.label}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
export default ProjectsCategories;
