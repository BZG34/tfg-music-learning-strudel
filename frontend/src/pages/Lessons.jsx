import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Lessons() {
    const [lessons, setLessons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/lessons/`);
                if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
                const data = await response.json();
                // Ordenamos las lecciones numéricamente
                setLessons(
                    data.sort(
                        (a, b) => Number(a.lesson_number) - Number(b.lesson_number),
                    ),
                );
            } catch (error) {
                console.error("Error cargando el mapa de lecciones:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLessons();
    }, []);

    return (
        <div className="page-lessons bg-[#0A0A0B] text-white min-h-screen selection:bg-[#00FF41]/30">
            {/* HEADER ESTANDARIZADO */}
            <header className="fixed top-0 z-50 w-full bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-[#00FF41]/20 shadow-[0_0_15px_rgba(0,255,65,0.1)] flex-shrink-0">
                <nav className="flex items-center w-full px-6 py-4 max-w-[1920px] mx-auto">
                {/* IZQUIERDA: Logo */}
                <div className="flex-1 flex items-center">
                    <Link to="/" className="text-2xl font-black text-[#00FF41] tracking-widest font-['Space_Grotesk'] uppercase">PAMS</Link>
                </div>
                
                {/* CENTRO: Barra de navegación centrada */}
                <div className="flex-1 hidden md:flex items-center justify-center gap-8 font-['Space_Grotesk'] tracking-tighter uppercase font-bold text-sm">
                    <Link className="text-slate-500 hover:text-slate-300 transition-colors" to="/">Inicio</Link>
                    <Link className="text-slate-500 hover:text-slate-300 transition-colors" to="/dashboard">Panel</Link>
                    <Link className="text-slate-500 hover:text-slate-300 transition-colors" to="/editor">Editor en vivo</Link>
                    <Link className="text-slate-500 hover:text-slate-300 transition-colors" to="/gallery">Galería</Link>
                    <Link className="text-[#00FF41] border-b-2 border-[#00FF41] pb-1" to="/lessons">Lecciones</Link>
                </div>

                {/* DERECHA: Iconos y Perfil */}
                <div className="flex-1 flex items-center justify-end gap-4">
                    {/*
                    <button type="button" aria-label="Terminal" className="material-symbols-outlined text-[#00FF41] hover:bg-[#00FF41]/5 p-2 rounded transition-all active:scale-95">terminal</button>
                    */}
                    <Link to="/editor" className="bg-[#00FF41] text-[#003907] font-bold py-1.5 px-4 rounded uppercase text-[10px] tracking-widest hover:brightness-110 active:scale-95 transition-all whitespace-nowrap">Nueva Pista</Link>
                    <button type="button" aria-label="Notifications" className="material-symbols-outlined text-[#00FF41] hover:bg-[#00FF41]/5 p-2 rounded transition-all active:scale-95">notifications</button>
                    <div className="w-8 h-8 rounded-full border border-[#00FF41]/30 overflow-hidden flex-shrink-0">
                    <img alt="User profile avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrwr2NOkbueflO9JZhP7HCLdgrd0O-jDMGaCUf5HLfwPwcnn5toY3w7B8ABtj7YHePaFaIt4VamW79iS7UMHCwtjRQEttszG25C36uTjGiZL_Ho33F272VBdvbm0DsZ28y5rfbpbAUQTyajY3bo2spV9L56V5kpXu3cy0jHMLdf8MUSbBQAzhvr9qAl8M2-c_Kqs1wsTLyxv5jWHu9G88lrwRQUd6cEAAT3HH8DCPZxNIMSkQSUdPPjoBAMtpvryqOtnAsJf5-yIo" />
                    </div>
                </div>
                </nav>
            </header>

            {/* CONTENIDO PRINCIPAL */}
            <main className="max-w-4xl mx-auto pt-32 px-6 pb-20">
                <div className="space-y-4 mb-12">
                    <span className="text-xs font-bold text-[#00FF41] tracking-widest uppercase font-mono">
            // Academia de código sonoro
                    </span>
                    <h1 className="text-4xl font-black font-['Space_Grotesk'] uppercase tracking-tight">
                        Plan de Estudios Musical
                    </h1>
                    <p className="text-slate-400 max-w-xl">
                        Aprende teoría musical, ritmo y síntesis dominando los algoritmos de
                        Strudel paso a paso.
                    </p>
                </div>

                {isLoading ? (
                    <div className="py-12 flex flex-col items-center font-mono text-slate-500">
                        <span className="material-symbols-outlined animate-spin text-4xl mb-4 text-[#00FF41]">
                            autorenew
                        </span>
                        <p>Cargando mapa de conocimiento...</p>
                    </div>
                ) : (
                    <div className="relative border-l border-[#00FF41]/20 pl-6 ml-4 space-y-12">
                        {lessons.map((lesson) => (
                            <div key={lesson.id} className="relative group">
                                {/* Nodo de la línea de tiempo */}
                                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-black border-2 border-[#00FF41] group-hover:bg-[#00FF41] transition-colors shadow-[0_0_10px_rgba(0,255,65,0.4)]"></div>

                                <div className="bg-[#141416] border border-[#00FF41]/10 p-6 rounded-xl hover:border-[#00FF41]/40 transition-all shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                    <div>
                                        <span className="text-[10px] font-mono text-[#00FF41] uppercase bg-[#00FF41]/5 px-2 py-0.5 rounded border border-[#00FF41]/10">
                                            Módulo 0{lesson.lesson_number}
                                        </span>
                                        <h3 className="text-xl font-bold font-['Space_Grotesk'] mt-2 text-white group-hover:text-[#00FF41] transition-colors">
                                            {lesson.title}
                                        </h3>
                                        <pre className="mt-3 text-[11px] font-mono text-slate-500 max-w-md truncate">
                                            {lesson.hint_code}
                                        </pre>
                                    </div>

                                    <Link
                                        to={`/editor/${lesson.lesson_number}`}
                                        className="sm:self-center text-center bg-[#00FF41]/10 border border-[#00FF41]/30 text-[#00FF41] px-5 py-3 rounded font-['Space_Grotesk'] text-xs font-bold uppercase tracking-widest hover:bg-[#00FF41] hover:text-[#003907] transition-all whitespace-nowrap"
                                    >
                                        Iniciar Lección
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* FOOTER UNIVERSAL */}
            <footer className="w-full py-8 px-6 lg:px-12 flex flex-col xl:flex-row justify-between items-center border-t border-[#00FF41]/10 bg-[#0A0A0B] relative z-40 mt-auto flex-shrink-0">
                <div className="font-['Space_Grotesk'] font-bold text-[#00FF41] text-lg mb-6 xl:mb-0 text-center xl:text-left">
                PAMS <span className="opacity-50 font-normal ml-2 block sm:inline-block mt-1 sm:mt-0">// ¿Quién dijo que programar no es divertido?</span>
                </div>
                
                <div className="flex flex-wrap justify-center gap-6 md:gap-8 font-['Space_Grotesk'] text-xs uppercase tracking-widest text-slate-600 mb-6 xl:mb-0">
                <a className="hover:text-[#00FF41] transition-colors" href="https://strudel.tidalcycles.org/tutorial/" target="_blank" rel="noopener noreferrer">Documentación</a>
                <a className="hover:text-[#00FF41] transition-colors" href="https://github.com/BZG34/tfg-music-learning-strudel" target="_blank" rel="noopener noreferrer">GitHub</a>
                <Link className="hover:text-[#00FF41] transition-colors" to="/">Privacidad</Link>
                <Link className="hover:text-[#00FF41] transition-colors" to="/">Términos</Link>
                </div>
                
                <div className="font-['Space_Grotesk'] text-xs opacity-60 text-slate-500 font-bold text-[#00FF41] text-center xl:text-right">
                © 2026 <strong>PAMS</strong>. Código abierto bajo licencia <strong><a className="hover:underline" href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank" rel="noopener noreferrer">AGPL-3.0</a></strong>. Ver <strong><a className="hover:underline" href="https://github.com/BZG34/tfg-music-learning-strudel" target="_blank" rel="noopener noreferrer">Código Fuente</a></strong>.
                </div>
            </footer>

        </div>
    );
}
