import type { Product } from "../types/product";

const API_URL = import.meta.env.VITE_API_URL || "https://mostradorgallery.com";
const WORKS_ENDPOINT = `${API_URL}/wp-json/wp/v2/work`;

const WORKS_PER_PAGE = 12;

async function request(url: string): Promise<Response> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status} al llamar a ${url}`);
  return res;
}

export interface WorksPage {
  works: Product[];
  totalPages: number;
}

export async function getWorks(page = 1, perPage = WORKS_PER_PAGE): Promise<WorksPage> {
  const res = await request(`${WORKS_ENDPOINT}?_embed&per_page=${perPage}&page=${page}`);
  const works: Product[] = await res.json();
  const totalPages = Number(res.headers.get("X-WP-TotalPages")) || (works.length < perPage ? page : page + 1);
  return { works, totalPages };
}

export async function getWorkBySlug(slug: string): Promise<Product | null> {
  const res = await request(`${WORKS_ENDPOINT}?slug=${encodeURIComponent(slug)}&_embed`);
  const works: Product[] = await res.json();
  return works[0] ?? null;
}
