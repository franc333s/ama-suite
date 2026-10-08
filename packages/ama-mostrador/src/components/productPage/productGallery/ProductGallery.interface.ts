import type { Product } from "../../../types/product";

export interface ProductGalleryProps {
  product?: Product;
  // Imágenes más grandes: hasta 2 columnas en vez de 4
  wide?: boolean;
}
