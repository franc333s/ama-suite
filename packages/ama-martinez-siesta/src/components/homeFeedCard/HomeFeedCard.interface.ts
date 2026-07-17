import type { Work } from "../../services/wordpressApi";

// export interface Work {
//   id: number;
//   title: { rendered: string };
//   slug: string;
//   content: { rendered: string };
//   designer?: string;
//   _embedded?: any;
//   image?: { guid: string };
//   projecttitle?: string;
//   client?: string;
//   year?: string | number;
//   taxon?: string;
// }

export interface HomeFeedCardProps {
  item: Work;
}
