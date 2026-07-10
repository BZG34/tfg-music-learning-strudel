import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Importamos el proveedor de autenticación
import ProtectedRoute from './components/ProtectedRoute'; // Importamos el componente de ruta protegida

// Importamos las páginas
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import LiveEditor from './pages/LiveEditor';
import CommunityGallery from './pages/CommunityGallery';
import Lessons from './pages/Lessons';

export default function App() {
  return (
    <AuthProvider> {/* Para que envuelva toda la aplicación */}
      <BrowserRouter>
        <Routes>
          {/* Ruta raíz: Página de inicio */}
          <Route path="/" element={<LandingPage />} />

          {/* Ruta de inicio de sesión */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Ruta del Panel de Control */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          
          {/* Ruta del Editor Interactivo */}
          <Route path="/editor" element={<ProtectedRoute><LiveEditor /></ProtectedRoute>} />
          <Route path="/editor/:lessonId" element={<ProtectedRoute><LiveEditor /></ProtectedRoute>} />
          
          {/* Ruta de la Galería de la Comunidad */}
          <Route path="/gallery" element={<ProtectedRoute><CommunityGallery /></ProtectedRoute>} />
          
          {/* Ruta de las Lecciones */}
          <Route path="/lessons" element={<ProtectedRoute><Lessons /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}