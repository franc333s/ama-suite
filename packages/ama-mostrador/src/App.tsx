import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import OneProduct from './pages/OneProduct';
import Exhibitions from './pages/Exhibitions';
import About from './pages/About';
import NotFound from './pages/NotFound';
import { getWorkBySlug } from './api/works';
import { getExhibitionBySlug } from './api/exhibitions';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/works/:slug" element={<OneProduct key="work" loadBySlug={getWorkBySlug} />} />
        <Route path="/exhibitions" element={<Exhibitions />} />
        <Route path="/exhibitions/:slug" element={<OneProduct key="exhibition" loadBySlug={getExhibitionBySlug} wideGallery />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
