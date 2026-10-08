import Topbar from "../components/topbar/Topbar";
import Footer from "../components/footer/Footer";
import ProductsFeed from "../components/homePage/productsHome/productsFeed/ProductsFeed";
import { getWorks } from "../api/works";
import CollectToday from "../components/collectToday/CollectToday";
import HeroHome from "../components/homePage/heroHome/HeroHome";

function Home() {

    return (
        <>
            <HeroHome />
            <Topbar />
            <CollectToday className="collect-today--home" />
            <ProductsFeed loadPage={getWorks} basePath="/works" />
            <Footer />
        </>
    );
}

export default Home;
