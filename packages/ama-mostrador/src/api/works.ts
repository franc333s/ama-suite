import { createCollection } from "./collection";

const works = createCollection("work", "works.json");

export const getWorks = works.getPage;
export const getWorkBySlug = works.getBySlug;
