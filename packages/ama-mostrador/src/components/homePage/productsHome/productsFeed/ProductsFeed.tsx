import { useEffect, useState } from 'react';
import ProductCard from "../productCard/ProductCard";
import type { Product } from "../../../../types/product";
import './ProductsFeed.scss'

function ProductsFeed() {
  const [works, setWorks] = useState<Product[]>([]);

  useEffect(() => {
    fetch('https://crudecrude.com/wp-json/wp/v2/work?_embed')
      .then((res) => res.json())
      .then((data) => setWorks(data))
      .catch((err) => console.error('Error al cargar trabajos:', err));
  }, []);

  return (

    <main className="products-feed">
      {works.length === 0 ? (
        <p>No hay trabajos aún.</p>
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

  );
}

export default ProductsFeed;
