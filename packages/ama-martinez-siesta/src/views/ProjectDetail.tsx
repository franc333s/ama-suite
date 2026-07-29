import { useParams, useNavigate } from "react-router-dom";
import Topbar from "../components/topbar/Topbar";
import ImageGallery from "../components/imageGallery/ImageGallery";
import Footer from "../components/footer/Footer";
import { useFetchProjectImages } from "../hooks/useFetchProjectImages";

function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  // Usar el slug directamente (sin prefijo)
  const { images, work, loading, error } = useFetchProjectImages(slug || "");

  // Al cerrar volvemos a la página de proyectos. Si venimos de ella,
  // navegamos hacia atrás para conservar el filtro (que vive en la URL,
  // p. ej. /projects/graphic-design) y la posición de scroll. Si se llegó
  // directamente o desde fuera, caemos en /projects.
  const handleClose = () => {
    let cameFromProjects = false;
    try {
      if (document.referrer) {
        const referrer = new URL(document.referrer);
        cameFromProjects =
          referrer.origin === window.location.origin &&
          /^\/projects(\/|$)/.test(referrer.pathname);
      }
    } catch {
      cameFromProjects = false;
    }

    if (cameFromProjects) {
      navigate(-1);
    } else {
      navigate("/projects");
    }
  };

  if (loading) {
    return (
      <>
        <Topbar isHome={true} />
        <main>
          <p>Cargando proyecto...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !work) {
    return (
      <>
        <Topbar isHome={true} />
        <main>
          <p>Error al cargar el proyecto</p>
        </main>
        <Footer />
      </>
    );
  }

  // Usar imágenes de WordPress
  const displayImages = images;
  const title = work.projecttitle || work.title?.rendered || "Proyecto";
  const year = work.year || "2024";
  // Taxonomías hardcodeadas de momento; cuando se reactive el .map en el JSX,
  // descomentar esto para usar los datos reales de WordPress.
  // const categories = Array.isArray(work.taxon)
  //   ? work.taxon
  //   : work.taxon
  //     ? [work.taxon]
  //     : [];

  if (!displayImages || displayImages.length === 0) {
    return (
      <>
        <Topbar isHome={true} />
        <main>
          <p>No hay imágenes disponibles para este proyecto</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Topbar isHome={true} />
      <main className="">
        <section className="hero-intro project-detail">

          <div className="project-detail__info">
            <div className="project-detail__heading">
              <h1>{title}.</h1>
              <p>{year}</p>
            </div>

            <div  className="project-detail__taxonomies">
              {/* {categories.map((category: string, index: number) => (
                <p key={index}>{category}</p>
              ))} */}
              <p>Graphic Design</p>
              <p>Branding</p>
              <p>Photography</p>
            </div>

          </div>

    
          <div className="project-detail__description"> 
            {/* <button className="button">+info</button> */}
            <p>Cuatro Cuatros blends a research-driven approach with a commitment to functionality. Their versatile approach allows them to create innovative and functional designs for both, production and collectible design. Cuatro Cuatros blends a research-driven approach with a commitment to functionality. Their versatile approach allows them to create innovative and functional designs for both, production and collectible design.</p>
          </div>

          <button className="project-detail__close" onClick={handleClose}>
            X
          </button>
        
        </section>

        <ImageGallery images={displayImages} />
      </main>

      <Footer className="mt-06" />
    </>
  );
}

export default ProjectDetail;
