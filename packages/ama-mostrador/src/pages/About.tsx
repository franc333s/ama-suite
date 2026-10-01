import { Link } from "react-router-dom"
import Footer from "../components/footer/Footer"
import Topbar from "../components/topbar/Topbar"

function About() {

    return (
        <>
        <Topbar />
        <main className="about">

            <section className="about__sect">
                <div className="about__sect__flex">
                    <div>
                        <p className="about__title">Email</p>
                        <h1 className="about__text"><Link to="mailto:info@mostradorgallery.com" target="_blank">info@mostradorgallery.com</Link></h1>
                    </div>
                    <div>
                        <p className="about__title">Based</p>
                        <h2 className="about__text">Valencia, Spain</h2>
                    </div>
                </div>


                <div>
                    <p className="about__title">About</p>
                    <p className="about__text--variation">Founded in 2023, Mostrador is dedicated to showcasing works at the interection of art and design, where the utility of an object meets its aesthetic potential. Mostrador provides a platform for artists and designers to expertiment with the boundaries of function and form, showcasing both established and emerging talents, at Mostrador we believe that the process of creation is just as imoprtant as the finished product, and our curatorial program highlights the unique narratives behind each piece. We are committed to promoting access to the arts, advocating for diversity in design, and exploring the intersections of disciplines. Through our works and publications, we strive to inspire and challenge the perceptions of what is posible in design.</p>
                </div>
            </section>

            <div className="about__div">
                <p className="about__title--variation">[em] [ou] [es] [ti] [ar] [ei] [di] [ou] [ar]</p>
                <img className="about__img" src="/EU-plan/mostrador-logos.webp" alt="Mostrador proyecto subvencionado por la UE" />
            </div>

        </main>

        <Footer />
        </>
    )
}

export default About
