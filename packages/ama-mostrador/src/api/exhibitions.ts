import { createCollection } from "./collection";

const exhibitions = createCollection("exhibition", "exhibitions.json");

export const getExhibitions = exhibitions.getPage;
export const getExhibitionBySlug = exhibitions.getBySlug;
