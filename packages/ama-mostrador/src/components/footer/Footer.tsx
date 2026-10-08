import { Link } from "react-router-dom"
import CollectToday from "../collectToday/CollectToday"
import { useAbout } from "../../hooks/useAbout"
import "./Footer.scss"

function Footer() {

    const about = useAbout()

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
            {about?.mailinfo && (
                <div className="footer__inner footer__inner--jc--end">
                    <p className="footer__index">5</p>
                    <p className="footer__item text-trans--uppercase"><Link to={`mailto:${about.mailinfo}`}>Contact</Link></p>
                </div>
            )}
            {about?.instagram && (
                <div className="footer__inner footer__inner--jc--end">
                    <p className="footer__index">6</p>
                    <p className="footer__item text-trans--uppercase"><Link to={about.instagram} target="_blank">Instagram</Link></p>
                </div>
            )}
        </footer>
        </>
    )
}

export default Footer
