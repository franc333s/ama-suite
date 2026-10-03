import type { Product } from "../types/product";

const API_URL = import.meta.env.VITE_API_URL || "https://mostradorgallery.com";
const WORKS_ENDPOINT = `${API_URL}/wp-json/wp/v2/work`;
// JSON estático que genera el plugin de WordPress (wordpress/mostrador-works-json.php)
const WORKS_JSON_URL = `${API_URL}/wp-content/uploads/mostrador/works.json`;

const WORKS_PER_PAGE = 12;

async function request(url: string): Promise<Response> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status} al llamar a ${url}`);
  return res;
}

async function loadAllWorks(): Promise<Product[]> {
  try {
    const res = await request(WORKS_JSON_URL);
    return await res.json();
  } catch (err) {
    console.warn("No se pudo leer el JSON estático, se usa la API de WordPress:", err);
    const res = await request(`${WORKS_ENDPOINT}?_embed&per_page=100`);
    return res.json();
  }
}

// Se guarda la promesa para que home y producto compartan una sola descarga por visita
let allWorksPromise: Promise<Product[]> | null = null;

function getAllWorks(): Promise<Product[]> {
  if (!allWorksPromise) {
    allWorksPromise = loadAllWorks().catch((err) => {
      allWorksPromise = null;
      throw err;
    });
  }
  return allWorksPromise;
}

export interface WorksPage {
  works: Product[];
  totalPages: number;
}

export async function getWorks(page = 1, perPage = WORKS_PER_PAGE): Promise<WorksPage> {
  const all = await getAllWorks();
  const start = (page - 1) * perPage;
  return {
    works: all.slice(start, start + perPage),
    totalPages: Math.max(1, Math.ceil(all.length / perPage)),
  };
}

export async function getWorkBySlug(slug: string): Promise<Product | null> {
  const all = await getAllWorks();
  return all.find((work) => work.slug === slug) ?? null;
}
