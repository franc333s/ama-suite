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
  productdescription?: string;
  editiontype?: string;
  productgallery?: ProductGalleryImage[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _embedded?: any;
}
