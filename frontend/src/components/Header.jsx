import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header({ isEditor = false }) {
    const { user, authenticated, logout, token } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // Estados y Referencias para el menú desplegable del Avatar
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Cierra el menú automáticamente si el usuario hace clic fuera de él
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Lógica para eliminar la cuenta del usuario
    const handleDeleteAccount = async () => {
        const confirm1 = window.confirm("⚠️ ATENCIÓN: ¿Estás seguro de que quieres eliminar tu cuenta?");
        if (!confirm1) return;
        
        const confirm2 = window.confirm("Esta acción es IRREVERSIBLE. Se borrarán todas tus pistas y tu progreso académico para siempre. ¿Confirmas la destrucción?");
        if (!confirm2) return;

        try {
            const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const response = await fetch(`${API_BASE_URL}/api/users/me`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                logout(); // Limpiamos la sesión del navegador
                navigate('/'); // Expulsamos al usuario a la Landing Page
                alert("Tu cuenta y todos tus datos han sido eliminados correctamente de la plataforma.");
            } else {
                alert("Error al intentar borrar la cuenta. Contacte con un administrador.");
            }
        } catch (error) {
            console.error("Fallo de red:", error);
            alert("Error de conexión al intentar borrar la cuenta.");
        }
    };

    // Función auxiliar para marcar en verde la página donde el usuario se encuentra
    const linkClass = (path) => {
        return location.pathname === path
            ? "text-[#00FF41] border-b-2 border-[#00FF41] pb-1 font-['Space_Grotesk'] tracking-tighter uppercase font-bold text-sm"
            : "text-slate-500 hover:text-slate-300 transition-colors font-['Space_Grotesk'] tracking-tighter uppercase font-bold text-sm";
    };

    return (
        <header className="fixed top-0 z-50 w-full bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-[#00FF41]/20 shadow-[0_0_15px_rgba(0,255,65,0.1)] flex-shrink-0">
            <nav className="flex items-center w-full px-6 py-4 max-w-[1920px] mx-auto">
                {/* IZQUIERDA: Logo */}
                <div className="flex-1 flex items-center">
                    <Link
                        to="/"
                        className="text-2xl font-black text-[#00FF41] tracking-widest font-['Space_Grotesk'] uppercase"
                    >
                        PAMS
                    </Link>
                </div>

                {/* CENTRO: Menú universal centrado */}
                <div className="flex-1 hidden md:flex items-center justify-center gap-8">
                    <Link className={linkClass("/")} to="/">
                        Inicio
                    </Link>
                    <Link className={linkClass("/dashboard")} to="/dashboard">
                        Panel
                    </Link>
                    <Link className={linkClass("/editor")} to="/editor">
                        Editor en vivo
                    </Link>
                    <Link className={linkClass("/gallery")} to="/gallery">
                        Galería
                    </Link>
                    <Link className={linkClass("/lessons")} to="/lessons">
                        Lecciones
                    </Link>
                </div>

                {/* DERECHA: Botones de estado e Inicio/Cierre de Sesión */}
                <div className="flex-1 flex items-center justify-end gap-4">
                    
                    <Link to="/editor" className="bg-[#00FF41] text-[#003907] font-bold py-1.5 px-4 rounded uppercase text-[10px] tracking-widest hover:brightness-110 active:scale-95 transition-all whitespace-nowrap">
                        Nueva Pista
                    </Link>

                    {/* Botones de usuario (Borrar Cuenta + Cerrar Sesión) */}
                    {authenticated ? (
                        // Contenido del menú desplegable del Avatar
                        <div className="relative" ref={menuRef}>
                            {/* El Avatar ahora es un botón que abre/cierra el menú */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="w-8 h-8 rounded-full border border-[#00FF41]/50 bg-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center font-mono text-xs text-[#00FF41] uppercase font-bold hover:bg-[#00FF41]/10 hover:shadow-[0_0_10px_rgba(0,255,65,0.3)] transition-all cursor-pointer"
                            >
                                {user?.username?.slice(0, 2)}
                            </button>

                            {/* Menu desplegable */}
                            {isMenuOpen && (
                                <div className="absolute right-0 mt-3 w-56 bg-[#0F0F11] border border-[#00FF41]/20 rounded-lg shadow-2xl overflow-hidden flex flex-col z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    
                                    {/* Información del usuario */}
                                    <div className="px-4 py-3 border-b border-[#00FF41]/10 bg-[#141416]">
                                        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">Conectado como</p>
                                        <p className="text-sm font-bold text-[#00FF41] font-['Space_Grotesk'] truncate">@{user?.username}</p>
                                    </div>
                                    
                                    {/* Botón Cerrar Sesión */}
                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            logout();
                                        }}
                                        className="flex items-center gap-3 px-4 py-3 text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 transition-colors uppercase tracking-widest text-left"
                                    >
                                        <span className="material-symbols-outlined text-base">logout</span>
                                        Cerrar Sesión
                                    </button>
                                    
                                    {/* Botón Borrar Cuenta */}
                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            handleDeleteAccount();
                                        }}
                                        className="flex items-center gap-3 px-4 py-3 text-xs font-mono text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors uppercase tracking-widest text-left border-t border-red-500/10"
                                    >
                                        <span className="material-symbols-outlined text-base">delete_forever</span>
                                        Borrar Cuenta
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="text-[10px] font-mono text-[#00FF41] border border-[#00FF41]/30 px-3 py-1.5 rounded hover:bg-[#00FF41]/10 transition-colors uppercase tracking-widest"
                        >
                            Iniciar Sesión
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
}
