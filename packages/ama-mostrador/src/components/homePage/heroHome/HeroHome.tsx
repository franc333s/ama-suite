import BgVideo from "../bgVideo/BgVideo"
import Mostrador from "../mostrador/Mostrador"
import './HeroHome.scss';



function HeroHome() {

    return (
        <>
            <section className="home-hero">
                <BgVideo />
                <Mostrador />
            </section>
        </>
    )
}

export default HeroHome;
