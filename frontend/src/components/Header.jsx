import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header({ isEditor = false }) {
    const { user, authenticated, logout } = useAuth();
    const location = useLocation();

    // Función auxiliar para marcar en verde la página donde estamos metidos
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
                    {/* Prueba, quitar. Si estamos en el editor, metemos sus widgets extra
                    {isEditor && (
                        <>
                            <div className="hidden xl:flex items-center bg-[#141416] border border-[#00FF41]/20 px-3 py-1.5 rounded-lg">
                                <span className="material-symbols-outlined text-[#00FF41] mr-2 text-sm">
                                    terminal
                                </span>
                                <span className="font-mono text-slate-400 text-xs">
                                    res_kernel_v1.0.4
                                </span>
                            </div>
                            <div className="hidden 2xl:flex items-center gap-1 text-[10px] font-mono text-slate-600 mr-2">
                                <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-500">
                                    Ctrl
                                </kbd>
                                <span>+</span>
                                <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-500">
                                    Enter
                                </kbd>
                            </div>
                        </>
                    )}
                    */}

                    {/* Icono de acceso rápido a Composición Libre */}
                    {/*
                    <Link
                        to="/editor"
                        aria-label="Nueva Pista"
                        className="material-symbols-outlined text-[#00FF41] hover:bg-[#00FF41]/5 p-2 rounded transition-all active:scale-95"
                    >
                        terminal
                    </Link>
                    */}
                    <Link to="/editor" className="bg-[#00FF41] text-[#003907] font-bold py-1.5 px-4 rounded uppercase text-[10px] tracking-widest hover:brightness-110 active:scale-95 transition-all whitespace-nowrap">
                    Nueva Pista
                    </Link>

                    {/* BOTÓN INTELIGENTE: Iniciar o Cerrar Sesión */}
                    {authenticated ? (
                        <button
                            type="button"
                            onClick={logout}
                            className="text-[10px] font-mono text-red-400 border border-red-500/30 px-3 py-1.5 rounded hover:bg-red-500/10 transition-colors uppercase tracking-widest"
                        >
                            Cerrar Sesión
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="text-[10px] font-mono text-[#00FF41] border border-[#00FF41]/30 px-3 py-1.5 rounded hover:bg-[#00FF41]/10 transition-colors uppercase tracking-widest"
                        >
                            Iniciar Sesión
                        </Link>
                    )}

                    {/* Avatar dinámico: Muestra las primeras letras del usuario si está logueado */}
                    <div className="w-8 h-8 rounded-full border border-[#00FF41]/30 bg-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center font-mono text-xs text-[#00FF41] uppercase font-bold">
                        {authenticated ? user?.username?.slice(0, 2) : "??"}
                    </div>
                </div>
            </nav>
        </header>
    );
}
