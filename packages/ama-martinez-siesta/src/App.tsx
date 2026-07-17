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
            content="Mostrador is a collectible design gallery showcasing works at the intersection of art and design from contemporary designers and emerging talents."
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
