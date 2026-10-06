import { Link } from "react-router-dom"
import Footer from "../components/footer/Footer"
import Topbar from "../components/topbar/Topbar"

function NotFound() {

    return (
        <div className="not-found">
        <meta name="robots" content="noindex" />
        <Topbar />
        <main className="about not-found__main">

            <section className="about__sect">
                <div>
                    <p className="about__title">Error</p>
                    <h1 className="about__text">404</h1>
                </div>
                <div>
                    <p className="about__title">Page not found</p>
                    <h2 className="about__text"><Link to="/">← Back to works</Link></h2>
                </div>
            </section>

        </main>

        <Footer />
        </div>
    )
}

export default NotFound
