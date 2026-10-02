import { useEffect, useRef, useState } from 'react';
import ProductCard from "../productCard/ProductCard";
import type { Product } from "../../../../types/product";
import { getWorks } from "../../../../api/works";
import './ProductsFeed.scss'

function ProductsFeed() {
  const [works, setWorks] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadedPage, setLoadedPage] = useState(0);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loading = loadedPage < page;
  const hasMore = page < totalPages;

  useEffect(() => {
    let cancelled = false;

    getWorks(page)
      .then(({ works: newWorks, totalPages }) => {
        if (cancelled) return;
        setWorks((prev) => [...prev, ...newWorks]);
        setTotalPages(totalPages);
      })
      .catch((err) => {
        console.error('Error al cargar trabajos:', err);
        if (!cancelled) setTotalPages(page);
      })
      .finally(() => {
        if (!cancelled) setLoadedPage(page);
      });

    return () => {
      cancelled = true;
    };
  }, [page]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setPage((p) => p + 1);
      },
      { rootMargin: '600px' }
    );
    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMore, loading]);

  return (
    <>
    <main className="products-feed">
      {works.length === 0 ? (
        !loading && <p>No hay trabajos aún.</p>
      ) : (
        works.map((item, index) => {
            const imageUrl =
            item._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.medium?.source_url ||
            item._embedded?.['wp:featuredmedia']?.[0]?.source_url;
            const formattedId = (index + 1).toString().padStart(2, '0');

        return (
            <ProductCard
                key={item.id}
                index={formattedId}
                url={`/works/${item.slug}`}
                productImg={imageUrl}
                productImgAltText={item.title.rendered}
                productName={item.title.rendered}
                designer={item.designer}
            />
        )
        })
      )}
    </main>
    <div ref={sentinelRef} />
    </>
  );
}

export default ProductsFeed;
