import { Link } from "react-router-dom"
import CollectToday from "../collectToday/CollectToday"
import "./Footer.scss"

function Footer() {

    return (
        <>
        <footer className="footer">
            <div className="footer__inner">
                <p className="footer__index">1</p>
                <p className="footer__item text-trans--uppercase"><Link to="/">Mostrador</Link></p>
            </div>
            <div className="footer__inner">
                <p className="footer__index">2</p>
                <p className="footer__item text-trans--uppercase">Collectible Design</p>
            </div>
            <div className="footer__inner footer__inner--jc--center">
                <p className="footer__index">3</p>
                <CollectToday className="footer__item" />
            </div>
            <div className="footer__inner footer__inner--jc--end">
                <p className="footer__index">4</p>
                <p className="footer__item text-trans--uppercase">Newsletter</p>
            </div>
            <div className="footer__inner footer__inner--jc--end">
                <p className="footer__index">5</p>
                <p className="footer__item text-trans--uppercase"><Link to="mailto:info@mostradorgallery.com">Contact</Link></p>
            </div>
            <div className="footer__inner footer__inner--jc--end">
                <p className="footer__index">6</p>
                <p className="footer__item text-trans--uppercase"><Link to="https://www.instagram.com/mostradorgallery/" target="_blank">Instagram</Link></p>
            </div>
        </footer>
        </>
    )
}

export default Footer
