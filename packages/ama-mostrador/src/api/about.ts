const API_URL = import.meta.env.VITE_API_URL || "https://mostradorgallery.com";
const ABOUT_ENDPOINT = `${API_URL}/wp-json/mostrador/v1/about`;
// JSON estático que genera el plugin de WordPress (wordpress/mostrador-works-json.php)
const ABOUT_JSON_URL = `${API_URL}/wp-content/uploads/mostrador/about.json`;

// Cualquier campo vacío en WordPress llega como "" (o lista vacía) y la web no lo pinta
export interface AboutData {
  mailinfo: string; // contacto general (menú, footer y página About)
  mailcontact: string; // consultas de compra (botón Inquire)
  instagram: string; // URL del perfil de Instagram
  based: string;
  about: string[];
  image: string;
  image_alt: string;
}

async function request(url: string): Promise<AboutData> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status} al llamar a ${url}`);
  return res.json();
}

async function loadAbout(): Promise<AboutData> {
  try {
    return await request(ABOUT_JSON_URL);
  } catch (err) {
    console.warn("No se pudo leer el JSON estático, se usa la API de WordPress:", err);
    return request(ABOUT_ENDPOINT);
  }
}

// Se guarda la promesa para no repetir la descarga al volver a la página
let aboutPromise: Promise<AboutData> | null = null;

export function getAbout(): Promise<AboutData> {
  if (!aboutPromise) {
    aboutPromise = loadAbout().catch((err) => {
      aboutPromise = null;
      throw err;
    });
  }
  return aboutPromise;
}
