import ProductGalleryItem from "../productGalleryItem/ProductGalleryItem"
import type { ProductGalleryProps } from "./ProductGallery.interface"
import "./ProductGallery.scss"

function ProductGallery({ product }: ProductGalleryProps) {

    return (
        <>
        <section className="product-gallery">

            {product && product.productgallery && product.productgallery.map((item) =>
            <ProductGalleryItem
                key={item.id}
                figIndex={item.figindex}
                figText={item.figtext}
                figImg={item.figimg}
                figImgAltText={item.figimgalttext}
            />
            )}
        </section>
        </>
    )
}

export default ProductGallery
