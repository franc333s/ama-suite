import { useEffect, useState } from "react";
import { getAbout, type AboutData } from "../api/about";

// Contenido del item "about" de WordPress. Es null mientras carga o si falla la carga;
// la descarga es una sola por visita aunque lo usen varios componentes a la vez
export function useAbout(): AboutData | null {
  const [about, setAbout] = useState<AboutData | null>(null);

  useEffect(() => {
    let cancelled = false;

    getAbout()
      .then((data) => {
        if (!cancelled) setAbout(data);
      })
      .catch((err) => console.error("Error al cargar los datos de About:", err));

    return () => {
      cancelled = true;
    };
  }, []);

  return about;
}
