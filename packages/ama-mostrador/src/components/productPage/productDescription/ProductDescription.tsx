import ButtonPrimary from "../../buttons/ButtonPrimary"
import type { ProductDescriptionProps } from "./ProductDescription.interface"
import "./ProductDescription.scss"
import { splitParagraphs } from "../../../utils/richText"


function ProductDescription({ productDescription, editionType }: ProductDescriptionProps) {

    const paragraphs = splitParagraphs(productDescription)

    return (
        <>
        <section className="product-desc aux-padding">
            <div>
                <p className="product-desc__title">About</p>
                {paragraphs.map((paragraph, index) => (
                    <p key={index} className="product-desc__text product-desc__text--width" dangerouslySetInnerHTML={{ __html: paragraph }} />
                ))}
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
