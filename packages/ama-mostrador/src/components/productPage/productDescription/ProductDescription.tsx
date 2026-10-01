import ButtonPrimary from "../../buttons/ButtonPrimary"
import type { ProductDescriptionProps } from "./ProductDescription.interface"
import "./ProductDescription.scss"


function ProductDescription({ productDescription, editionType }: ProductDescriptionProps) {

    return (
        <>
        <section className="product-desc aux-padding">
            <div>
                <p className="product-desc__title">About</p>
                <p className="product-desc__text product-desc__text--width">{productDescription}</p>
            </div>

            <aside className="product-desc__aside">
                <div>
                    <p className="product-desc__title">Edition</p>
                    <p className="product-desc__text">{editionType}</p>
                </div>

                <div>
                    <p className="product-desc__title">Purchase</p>
                    <ButtonPrimary to="mailto:contact@mostradorgallery.com" text="Inquire" openInNewTab />
                </div>
            </aside>
        </section>

        </>
    )

}

export default ProductDescription
