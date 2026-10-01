import { lazy, useEffect, useState, type JSX } from "react";
import "./Mostrador.scss"

// Import() components
const Mostrador20 = lazy(() => import("./mostrador-variations/Mostrador20"));
const Mostrador40 = lazy(() => import("./mostrador-variations/Mostrador40"));
const Mostrador60 = lazy(() => import("./mostrador-variations/Mostrador60"));
const Mostrador80 = lazy(() => import("./mostrador-variations/Mostrador80"));
const Mostrador100 = lazy(() => import("./mostrador-variations/Mostrador100"));
const Mostrador120 = lazy(() => import("./mostrador-variations/Mostrador120"));
const Mostrador140 = lazy(() => import("./mostrador-variations/Mostrador140"));
const Mostrador160 = lazy(() => import("./mostrador-variations/Mostrador160"));
const Mostrador180 = lazy(() => import("./mostrador-variations/Mostrador180"));
const Mostrador200 = lazy(() => import("./mostrador-variations/Mostrador200"));
const Mostrador220 = lazy(() => import("./mostrador-variations/Mostrador220"));
const Mostrador240 = lazy(() => import("./mostrador-variations/Mostrador240"));
const Mostrador260 = lazy(() => import("./mostrador-variations/Mostrador260"));
const Mostrador280 = lazy(() => import("./mostrador-variations/Mostrador280"));
const Mostrador300 = lazy(() => import("./mostrador-variations/Mostrador300"));

interface ScrollPosition {
    limit: number;
    component: JSX.Element;
}

const Mostrador = () => {

    const [ scrollY, setScrollY ] = useState(0);
    const [ , setAddStaticClass ] = useState(false);

    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(userAgent);

    const scrollSpeed = isMobile ? 1 : 0.66;

    useEffect(() => {

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrollY(currentScrollY);

            if (currentScrollY > (window.innerHeight * 0.69 * scrollSpeed)) {
                setAddStaticClass(true);
            } else {
                setAddStaticClass(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    });

    const scrollPositions: ScrollPosition[] = [
        { limit: 6, component: <Mostrador20 /> },
        { limit: 12, component: <Mostrador40 /> },
        { limit: 18, component: <Mostrador60 /> },
        { limit: 24, component: <Mostrador80 /> },
        { limit: 30, component: <Mostrador100 /> },
        { limit: 36, component: <Mostrador120 /> },
        { limit: 42, component: <Mostrador140 /> },
        { limit: 48, component: <Mostrador160 /> },
        { limit: 54, component: <Mostrador180 /> },
        { limit: 60, component: <Mostrador200 /> },
        { limit: 66, component: <Mostrador220 /> },
        { limit: 72, component: <Mostrador240 /> },
        { limit: 78, component: <Mostrador260 /> },
        { limit: 84, component: <Mostrador280 /> },
        { limit: Infinity, component: <Mostrador300 /> },
    ];

    const getCurrentMostradorContent = () => {
        for (const { limit, component } of scrollPositions) {
            if (scrollY < (window.innerHeight * (limit / 100) * scrollSpeed)) {
                return component;
            }
        }

        return scrollPositions[scrollPositions.length -1].component;
    };

    const mostradorContent = getCurrentMostradorContent();


    return (
            <>
                <div className="mostrador">

                    {mostradorContent}

                </div>
            </>
          )
}
export default Mostrador;
