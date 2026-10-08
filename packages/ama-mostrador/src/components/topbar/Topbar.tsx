import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import "./Topbar.scss";

function Topbar() {

    const location = useLocation();
    const [, setScrollY] = useState(0);
    const [addStaticClass, setAddStaticClass] = useState(false);
    const isHome = location.pathname === "/";

    useEffect(() => {

        const handleScroll = () => {
            setScrollY(window.scrollY);

            if (isHome) {
                if (window.scrollY > 950) {
                setAddStaticClass(true);
                } else {
                setAddStaticClass(false);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [isHome]);

    if (isHome) {
        return (
            <>
            <nav className={`topbar--home ${addStaticClass ? 'topbar--fixed' : ''}`}>
                <h1 className="topbar__title text-trans--uppercase">
                    <Link to="/">Mostrador / Gallery</Link>
                </h1>
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

                    <li className="topbar__inner__item text-trans--uppercase">
                        &nbsp;<Link to="mailto:info@mostradorgallery.com">Contact</Link>
                    </li>

                    <li className="topbar__inner__item text-trans--uppercase">
                        &nbsp;<Link to="https://www.instagram.com/mostradorgallery/" target="_blank">Instagram</Link>
                    </li>
                </ul>
            </nav>
            </>
        )

    } else {
        return (
            <>
            <nav className="topbar">
                <p className="topbar__title text-trans--uppercase">
                    <Link to="/">Mostador / Gallery</Link>
                </p>
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

                    <li className="topbar__inner__item text-trans--uppercase">
                        &nbsp;<Link to="mailto:info@mostradorgallery.com">Contact</Link>
                    </li>

                    <li className="topbar__inner__item text-trans--uppercase">
                        &nbsp;<Link to="https://www.instagram.com/mostradorgallery/" target="_blank">Instagram</Link>
                    </li>
                </ul>
            </nav>

            </>
        )
    }


}

export default Topbar;
