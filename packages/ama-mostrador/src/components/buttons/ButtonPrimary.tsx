import { Link } from "react-router-dom";
import type { ButtonPrimaryProps } from "./ButtonPrimary.interface";
import "./Button.scss"


const ButtonPrimary = ({ to, text, openInNewTab, className }: ButtonPrimaryProps) => {

    const linkProps = openInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {};

    return (

        <>
        <div className={`btn--primary ${className || ""}`}>
            <Link to={to} {...linkProps}>{text}</Link>
        </div>
        </>
    )
}

export default ButtonPrimary
