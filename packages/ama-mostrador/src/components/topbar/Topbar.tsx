import { Link, useLocation } from "react-router-dom";

import { useAbout } from "../../hooks/useAbout";

import "./Topbar.scss";

function Topbar() {

    const location = useLocation();
    const about = useAbout();
    const isHome = location.pathname === "/";

    // En la home el menú va después del hero (sticky) y el título es el h1 de la página;
    // en el resto de páginas va fijo arriba y el título es un párrafo
    const Title = isHome ? "h1" : "p";

    return (
        <>
        <nav className={isHome ? "topbar--home" : "topbar"}>
            <Title className="topbar__title text-trans--uppercase">
                <Link to="/">Mostrador / Gallery</Link>
            </Title>
            <ul className="topbar__inner">
                <span className="topbar__inner__item__arrow">→&nbsp;</span><li className="topbar__inner__item text-trans--uppercase">
                    <Link to="/">Works</Link>
                </li>

                <li className="topbar__inner__item text-trans--uppercase">
                    &nbsp;<Link to="/exhibitions">Exhibitions</Link>
                </li>

                <li className="topbar__inner__item text-trans--uppercase">
                    &nbsp;<Link to="/about">About</Link>
                </li>

                {about?.mailinfo && (
                    <li className="topbar__inner__item text-trans--uppercase">
                        &nbsp;<Link to={`mailto:${about.mailinfo}`}>Contact</Link>
                    </li>
                )}

                {about?.instagram && (
                    <li className="topbar__inner__item text-trans--uppercase">
                        &nbsp;<Link to={about.instagram} target="_blank">Instagram</Link>
                    </li>
                )}
            </ul>
        </nav>
        </>
    )
}

export default Topbar;
