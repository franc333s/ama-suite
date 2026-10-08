export interface ProductGalleryImage {
  id: number;
  figindex?: string | number;
  figtext?: string;
  figimg?: string;
  figimgalttext?: string;
}

export interface Product {
  id: number;
  slug: string;
  title: { rendered: string };
  designer?: string;
  producttype?: string;
  year?: string | number;
  material?: string;
  dimensions?: string;
  namesecondary?: string;
  productdescription?: string | string[];
  editiontype?: string;
  productgallery?: ProductGalleryImage[];
  // URL de la imagen del hero (campo "heroimage" de Pods); vacía si no se ha subido
  hero_image?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _embedded?: any;
}
