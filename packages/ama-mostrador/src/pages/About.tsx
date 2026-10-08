import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Footer from "../components/footer/Footer"
import Topbar from "../components/topbar/Topbar"
import { getAbout, type AboutData } from "../api/about"
import { splitParagraphs } from "../utils/richText"

function About() {

    // Todo el contenido viene de WordPress: lo que esté vacío allí no se pinta
    const [ content, setContent ] = useState<AboutData | null>(null);

    useEffect(() => {
        getAbout()
          .then(setContent)
          .catch((err) => console.error('Error al cargar la página About:', err));
      }, []);

    const paragraphs = splitParagraphs(content?.about);

    return (
        <>
        <Topbar />
        <main className="about">

            <section className="about__sect">
                <div className="about__sect__flex">
                    <div>
                        <p className="about__title">Email</p>
                        <h1 className="about__text">
                            {content?.email && <Link to={`mailto:${content.email}`} target="_blank">{content.email}</Link>}
                        </h1>
                    </div>
                    <div>
                        <p className="about__title">Based</p>
                        <h2 className="about__text">{content?.based}</h2>
                    </div>
                </div>


                <div>
                    <p className="about__title">About</p>
                    {paragraphs.map((paragraph, index) => (
                        <p key={index} className="about__text--variation" dangerouslySetInnerHTML={{ __html: paragraph }} />
                    ))}
                </div>
            </section>

            <div className="about__div">
                <p className="about__title--variation">[em] [ou] [es] [ti] [ar] [ei] [di] [ou] [ar]</p>
                {content?.image && <img className="about__img" src={content.image} alt={content.image_alt} />}
            </div>

        </main>

        <Footer />
        </>
    )
}

export default About
