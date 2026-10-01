import type { ProductHeroProps } from "./ProductHero.interface"
import "./ProductHero.scss"

function ProductHero({ heroImg, heroImgAltText }: ProductHeroProps) {

    return (
        <>
        <section className="product-hero">
            <img className="product-hero__img" src={heroImg} alt={heroImgAltText} />
        </section>
        </>
    )
}

export default ProductHero
