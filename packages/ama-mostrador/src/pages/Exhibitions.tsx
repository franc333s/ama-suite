import Topbar from "../components/topbar/Topbar";
import Footer from "../components/footer/Footer";
import ProductsFeed from "../components/homePage/productsHome/productsFeed/ProductsFeed";
import { getExhibitions } from "../api/exhibitions";

function Exhibitions() {

    return (
        <div className="page-fill">
            <Topbar />
            <ProductsFeed
                className="page-fill__main"
                loadPage={getExhibitions}
                basePath="/exhibitions"
                emptyMessage="[Coming soon]"
                showEmptyWhileLoading
            />
            <Footer />
        </div>
    );
}

export default Exhibitions;
