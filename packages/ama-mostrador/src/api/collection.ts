import type { Product } from "../types/product";

const API_URL = import.meta.env.VITE_API_URL || "https://mostradorgallery.com";

const ITEMS_PER_PAGE = 12;

export interface CollectionPage {
  items: Product[];
  totalPages: number;
}

async function request(url: string): Promise<Response> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status} al llamar a ${url}`);
  return res;
}

// Lectura de un tipo de contenido de WordPress (works, exhibitions...).
// - wpPostType: nombre del post type en WordPress, para el fallback a la API
// - jsonFile: JSON estático que genera el plugin de WordPress (wordpress/mostrador-works-json.php)
export function createCollection(wpPostType: string, jsonFile: string) {
  const endpoint = `${API_URL}/wp-json/wp/v2/${wpPostType}`;
  const jsonUrl = `${API_URL}/wp-content/uploads/mostrador/${jsonFile}`;

  async function loadAll(): Promise<Product[]> {
    try {
      const res = await request(jsonUrl);
      return await res.json();
    } catch (err) {
      console.warn("No se pudo leer el JSON estático, se usa la API de WordPress:", err);
      const res = await request(`${endpoint}?_embed&per_page=100`);
      return res.json();
    }
  }

  // Se guarda la promesa para que el listado y la ficha compartan una sola descarga por visita
  let allPromise: Promise<Product[]> | null = null;

  function getAll(): Promise<Product[]> {
    if (!allPromise) {
      allPromise = loadAll().catch((err) => {
        allPromise = null;
        throw err;
      });
    }
    return allPromise;
  }

  async function getPage(page = 1, perPage = ITEMS_PER_PAGE): Promise<CollectionPage> {
    const all = await getAll();
    const start = (page - 1) * perPage;
    return {
      items: all.slice(start, start + perPage),
      totalPages: Math.max(1, Math.ceil(all.length / perPage)),
    };
  }

  async function getBySlug(slug: string): Promise<Product | null> {
    const all = await getAll();
    return all.find((item) => item.slug === slug) ?? null;
  }

  return { getPage, getBySlug };
}
