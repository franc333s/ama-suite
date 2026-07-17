export interface Work {
  id: number;
  title: { rendered: string };
  slug: string;
  content: { rendered: string };
  image?: { guid: string };
  projecttitle?: string;
  client?: string;
  year?: string | number;
  taxon?: string[] | string;
  _embedded?: any;
}

export interface ProjectCardProps {
  item: Work;
  className?: string;
  ariaHidden?: boolean;
}
