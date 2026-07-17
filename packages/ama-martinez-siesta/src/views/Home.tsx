import Topbar from "../components/topbar/Topbar";
import HomeFeed from "../components/homeFeed/HomeFeed";
import Footer from "../components/footer/Footer";

import Signature from "../assets/img/fdo-mtnz-zzz-ng1.png";

function Home() {
  return (
    <>
      <Topbar isHome={true} />
      <section className="hero-home">
        <div className="hero-intro">
          <div>
            <span className="h1 inline">
              We are a{" "}
              <h1 className="inline">
                creative studio specializing in art direction and graphic design
              </h1>
              , founded in 2020 in Valencia. Guided by creative reveries and a
              strategic mindset, we shape our involvement to fit each project's
              unique needs — whether it's building a visual identity, crafting
              compelling narratives, or developing conceptual frameworks.
              Balancing intuition and precision, we create work that resonates.
            </span>
            <p className="mt-02">
              We offer our services globally. No meetings at 3pm.
            </p>
          </div>
        </div>
        <img
          className="hero-img"
          src={Signature}
          alt="Firmado Martínez Siesta"
        />
      </section>
      <HomeFeed />
      <Footer />
    </>
  );
}

export default Home;
