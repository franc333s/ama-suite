import { useParams } from "react-router-dom";
import Topbar from "../components/topbar/Topbar";
import ImageGallery from "../components/imageGallery/ImageGallery";
import Footer from "../components/footer/Footer";
import { useFetchProjectImages } from "../hooks/useFetchProjectImages";

function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  // Usar el slug directamente (sin prefijo)
  const { images, work, loading, error } = useFetchProjectImages(slug || "");

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
  const categories = Array.isArray(work.taxon)
    ? work.taxon
    : work.taxon
      ? [work.taxon]
      : [];

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
        <section className="hero-intro">
          <div>
            <div>
              <h1>{title}</h1>
              <p>{year}</p>
            </div>
            <div>
              {categories.map((category: string, index: number) => (
                <p key={index}>{category}</p>
              ))}
            </div>
          </div>
          <div>
            <button className="button">+info</button>
          </div>
        </section>
        <ImageGallery images={displayImages} />
      </main>

      <Footer className="mt-06" />
    </>
  );
}

export default ProjectDetail;
