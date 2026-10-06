import { Route, Routes } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import "./scss/global.scss";

import "./App.scss";

import Home from "./views/Home";
import Projects from "./views/Projects";
import ProjectDetail from "./views/ProjectDetail";
import CookieConsent from "./components/cookieConsent/CookieConsent";

function App() {
  return (
    <>
      <HelmetProvider>
        <Helmet prioritizeSeoTags>
          <meta
            name="description"
            content="Martínez Siesta is a creative studio specializing in art direction and graphic design, founded in 2020 in Valencia."
          />
        </Helmet>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:category" element={<Projects />} />
          <Route path="/project/:slug" element={<ProjectDetail />} />
        </Routes>
        <CookieConsent />
      </HelmetProvider>
    </>
  );
}

export default App;
