import Topbar from "../components/topbar/Topbar";
import ProjectsFeed from "../components/projectsFeed/ProjectsFeed";
import Footer from "../components/footer/Footer";

function Projects() {
  return (
    <>
      <Topbar isHome={true} />

      <div className="hero-intro">
        <div>
          <span className="h1 inline">
            We are a{" "}
            <h1 className="inline">
              creative studio specializing in art direction and graphic design
            </h1>
            , founded in 2020 in Valencia. Guided by creative reveries and a
            strategic mindset.
          </span>
          <p className="mt-02">
            We offer our services globally. No meetings at 3pm.
          </p>
        </div>
      </div>

      <ProjectsFeed></ProjectsFeed>

      <Footer className="mt-06" />
    </>
  );
}

export default Projects;
