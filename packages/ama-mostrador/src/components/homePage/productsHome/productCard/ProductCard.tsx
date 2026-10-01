import { Link } from "react-router-dom";
import type { ProductCardProps } from "./ProductCard.interface";
import "./ProductCard.scss";



function ProductCard({ url, index, productImg, productImgAltText, productName, designer }: ProductCardProps) {

    return (
        <>
            <Link to={url} className="one-product">

                <article className="one-product__item">
                        <div className="one-product__item__front">
                            <p className="one-product__id">/ {index}</p>
                            <img className="one-product__img" src={productImg} alt={productImgAltText} />
                        </div>

                        <div className="one-product__item__back">
                            <div className="one-product__item__back--flex">
                                <h2 className="one-product__info"><span className="text-trans--uppercase">{productName}</span></h2>
                                <h3 className="one-product__info">{designer}</h3>
                            </div>
                            <p className="one-product__inq">[Inquire]</p>
                        </div>

                </article>
            </Link>
        </>
    )
}

export default ProductCard;
