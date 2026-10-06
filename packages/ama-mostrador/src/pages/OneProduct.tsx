import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"

import Topbar from "../components/topbar/Topbar";
import Footer from "../components/footer/Footer";

import ProductHero from "../components/productPage/productHero/ProductHero";
import ProductIntro from "../components/productPage/productIntro/ProductIntro";
import ProductDescription from "../components/productPage/productDescription/ProductDescription";
import ProductGallery from "../components/productPage/productGallery/ProductGallery";
import type { Product } from "../types/product";
import { getWorkBySlug } from "../api/works";
import NotFound from "./NotFound";


function OneProduct() {

    const { slug } = useParams();
    const [ product, setProduct ] = useState<Product | null>(null);
    const [ notFound, setNotFound ] = useState(false);

    useEffect(() => {
        if (!slug) return;
        getWorkBySlug(slug)
          .then((work) => {
            if (work) setProduct(work);
            else setNotFound(true);
          })
          .catch((err) => console.error('Error al cargar el producto:', err));
      }, [slug]);

    if (notFound) return <NotFound />;

    return (
        <>
            <Topbar />

            <main className="product">

                {product && (
                    <>

                    <div className="product__top">

                            <ProductHero

                                heroImg={
                                    product._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.medium_large?.source_url ||
                                    product._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.medium?.source_url ||
                                    product._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.full?.source_url ||
                                    product._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
                                    ''
                                  }


                                heroImgAltText={product.title.rendered}
                            />

                    </div>

                    <div className="product__bottom">

                            <ProductIntro
                                productName={product.title.rendered}
                                productType={product.producttype}
                                designer={product.designer}
                                year={product.year}
                                material={product.material}
                                dimensions={product.dimensions}
                                nameSecondary={product.namesecondary}
                            />

                            <ProductDescription
                                productDescription={product.productdescription}
                                editionType={product.editiontype}
                            />

                            <ProductGallery
                                product={product}
                            />



                        <Footer />

                    </div>

                    </>
                )}

            </main>

        </>
    )
}

export default OneProduct
