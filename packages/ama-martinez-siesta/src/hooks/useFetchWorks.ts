import { useEffect, useState } from "react";
import { fetchWorks, type Work } from "../services/wordpressApi";

export const useFetchWorks = (postType = "homeprojects", category?: string) => {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchWorks(postType, category)
      .then(setWorks)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [postType, category]);

  return { works, loading, error };
};
