import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importamos las páginas
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import LiveEditor from './pages/LiveEditor';
import CommunityGallery from './pages/CommunityGallery';
import Lessons from './pages/Lessons';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta raíz: Página de inicio */}
        <Route path="/" element={<LandingPage />} />

        {/* Ruta de inicio de sesión */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Ruta del Panel de Control */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Ruta del Editor Interactivo */}
        <Route path="/editor" element={<LiveEditor />} />
        <Route path="/editor/:lessonId" element={<LiveEditor />} />
        
        {/* Ruta de la Galería de la Comunidad */}
        <Route path="/gallery" element={<CommunityGallery />} />
        
        {/* Ruta de las Lecciones */}
        <Route path="/lessons" element={<Lessons />} />
      </Routes>
    </Router>
  );
}

export default App;