import type { ProductIntroProps } from "./ProductIntro.interface"
import "./ProductIntro.scss"

function ProductIntro({ productName, productType, designer, year, material, dimensions, nameSecondary }: ProductIntroProps) {

    return (
        <>
        <section className="product-intro">
                <div>
                    <p className="product-intro__title">Name</p>
                    <h1 className="product-intro__text"><span className="text-trans--uppercase">{productName}</span>, {productType}</h1>
                </div>

                <div>
                    <p className="product-intro__title">By</p>
                    <h2 className="product-intro__text">{designer}</h2>
                </div>

                <div>
                    <p className="product-intro__title">Year</p>
                    <p className="product-intro__text">{year}</p>
                </div>

                <div className="product-intro__mat-dim">
                    <div>
                        <p className="product-intro__title">Material</p>
                        <p className="product-intro__text">{material}</p>
                    </div>

                    <div>
                        <p className="product-intro__title">Dimensions</p>
                        <p className="product-intro__text">{dimensions}</p>
                    </div>
                </div>

                <p className="product-intro__text--variation">{nameSecondary}</p>

            </section>
        </>
    )

}

export default ProductIntro
