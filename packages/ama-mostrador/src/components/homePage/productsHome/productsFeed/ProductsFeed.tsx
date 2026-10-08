import { useEffect, useRef, useState } from 'react';
import ProductCard from "../productCard/ProductCard";
import type { Product } from "../../../../types/product";
import type { CollectionPage } from "../../../../api/collection";
import './ProductsFeed.scss'

interface ProductsFeedProps {
  // Carga una página del listado (works, exhibitions...)
  loadPage: (page: number) => Promise<CollectionPage>;
  // Ruta base de las fichas: cada tarjeta enlaza a `${basePath}/${slug}`
  basePath: string;
  emptyMessage?: string;
  // Clase extra para el <main> (por ejemplo para que ocupe el alto disponible)
  className?: string;
  // Enseña el mensaje de vacío desde el primer momento, sin esperar a que cargue el listado
  showEmptyWhileLoading?: boolean;
}

function ProductsFeed({ loadPage, basePath, emptyMessage = 'No hay trabajos aún.', className = '', showEmptyWhileLoading = false }: ProductsFeedProps) {
  const [works, setWorks] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadedPage, setLoadedPage] = useState(0);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loading = loadedPage < page;
  const hasMore = page < totalPages;
  const isEmpty = works.length === 0 && (!loading || showEmptyWhileLoading);

  useEffect(() => {
    let cancelled = false;

    loadPage(page)
      .then(({ items: newWorks, totalPages }) => {
        if (cancelled) return;
        setWorks((prev) => [...prev, ...newWorks]);
        setTotalPages(totalPages);
      })
      .catch((err) => {
        console.error('Error al cargar el listado:', err);
        if (!cancelled) setTotalPages(page);
      })
      .finally(() => {
        if (!cancelled) setLoadedPage(page);
      });

    return () => {
      cancelled = true;
    };
  }, [page, loadPage]);

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
    <main className={`products-feed ${isEmpty ? 'products-feed--empty' : ''} ${className}`.trim()}>
      {works.length === 0 ? (
        isEmpty && <p className="products-feed__empty">{emptyMessage}</p>
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
                url={`${basePath}/${item.slug}`}
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
