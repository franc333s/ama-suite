import { useEffect, useState } from "react";
import {
  fetchWorkBySlug,
  extractImagesFromWork,
  type Work,
} from "../services/wordpressApi";

export const useFetchProjectImages = (
  slug: string,
  postType = "imagegallery",
) => {
  const [images, setImages] = useState<string[]>([]);
  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    fetchWorkBySlug(slug, postType)
      .then((fetchedWork) => {
        if (fetchedWork) {
          setWork(fetchedWork);
          const extractedImages = extractImagesFromWork(fetchedWork);
          setImages(extractedImages);
        }
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [slug, postType]);

  return { images, work, loading, error };
};
