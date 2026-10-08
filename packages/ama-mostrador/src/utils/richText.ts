import DOMPurify from "dompurify"

// Solo se admiten estas etiquetas de texto en línea; el resto se elimina (conservando su contenido)
const SANITIZE_CONFIG = {
    ALLOWED_TAGS: ["a", "strong", "b", "em", "i", "u", "br"],
    ALLOWED_ATTR: ["href", "target", "rel"],
}

// Un campo de WordPress puede llegar como texto o como lista de textos (campo repetible), y puede
// llevar HTML en línea (enlaces, negritas...). Cada elemento de la lista y cada salto de línea es
// un párrafo nuevo, y cada uno se devuelve ya saneado, listo para dangerouslySetInnerHTML.
export function splitParagraphs(text?: string | string[]): string[] {
    const items = Array.isArray(text) ? text : [text]
    return items
        .flatMap((item) => (typeof item === "string" ? DOMPurify.sanitize(item, SANITIZE_CONFIG).split(/\r?\n/) : []))
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
}
