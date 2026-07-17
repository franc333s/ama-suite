export interface Work {
  id: number;
  title: { rendered: string };
  slug: string;
  content: { rendered: string };
  designer?: string;
  image?: { guid: string };
  time?: string;
  projecttitle?: string;
  client?: string;
  year?: string | number;
  taxon?: string[] | string;
  _embedded?: any;
  [key: string]: any; // Para campos dinámicos como image1, image2, etc.
}

const WP_API_URL = "https://martnezsiesta6262.live-website.com/wp-json/wp/v2";

export const fetchWorks = async (
  postType = "homeprojects",
  category?: string,
): Promise<Work[]> => {
  try {
    let url = `${WP_API_URL}/${postType}?_embed&per_page=100`;
    if (category) {
      url += `&search=${encodeURIComponent(category)}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error al cargar trabajos");
    return await response.json();
  } catch (error) {
    console.error("Error en fetchWorks:", error);
    throw error;
  }
};

export const fetchWorkBySlug = async (
  slug: string,
  postType = "homeprojects",
): Promise<Work | null> => {
  try {
    const response = await fetch(
      `${WP_API_URL}/${postType}?slug=${slug}&_embed`,
    );
    if (!response.ok) throw new Error("Trabajo no encontrado");
    const data = await response.json();
    const work = data[0] || null;
    if (work) {
      console.log(
        "Project loaded:",
        work.slug,
        "Images found:",
        extractImagesFromWork(work).length,
      );
    }
    return work;
  } catch (error) {
    console.error("Error en fetchWorkBySlug:", error);
    throw error;
  }
};

export const extractImagesFromWork = (work: Work): string[] => {
  const images: string[] = [];

  // 1. Extraer de campos imageGallery (image1, image2, image3, ...)
  for (let i = 1; i <= 20; i++) {
    const imageField = `image${i}`;
    if (work[imageField]?.guid) {
      images.push(work[imageField].guid);
    }
  }

  // Si hay imágenes, retornar temprano
  if (images.length > 0) {
    return images;
  }

  // 2. Fallback: Agregar imagen destacada/ACF
  if (work.image?.guid) {
    images.push(work.image.guid);
  }

  // 3. Fallback: Extraer imágenes del contenido HTML (etiquetas <img>)
  if (work.content?.rendered) {
    const parser = new DOMParser();
    try {
      const htmlDoc = parser.parseFromString(
        work.content.rendered,
        "text/html",
      );
      const imgElements = htmlDoc.querySelectorAll("img");
      imgElements.forEach((img) => {
        const src = img.src || img.getAttribute("data-src");
        if (src && src.trim()) {
          images.push(src);
        }
      });
    } catch (e) {
      console.error("Error parsing HTML content:", e);
    }
  }

  // 4. Fallback: Extraer de media embebida
  if (work._embedded) {
    // Featured media
    if (work._embedded["wp:featuredmedia"]) {
      work._embedded["wp:featuredmedia"].forEach((media: any) => {
        if (media.source_url) {
          images.push(media.source_url);
        }
      });
    }
  }

  // Eliminar duplicados y URLs vacías
  return [...new Set(images.filter((img) => img.trim()))];
};
