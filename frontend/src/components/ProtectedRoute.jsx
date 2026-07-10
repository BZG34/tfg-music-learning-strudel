import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
    const { authenticated, loading } = useAuth();

    // Mientras React comprueba en el localStorage si hay un token, mostramos una pantalla de carga
    if (loading) {
        return (
            <div className="h-screen bg-[#0A0A0B] flex flex-col items-center justify-center text-[#00FF41] font-mono">
                <span className="material-symbols-outlined animate-spin text-4xl mb-4">
                    autorenew
                </span>
                <p>Verificando credenciales...</p>
            </div>
        );
    }

    // Si no está autenticado, lo expulsamos al Login sin dejar rastro en el historial (replace)
    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si todo está correcto, renderizamos la página a la que quería ir
    return children;
}
