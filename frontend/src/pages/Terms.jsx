import { Link } from 'react-router-dom';
import Header from '../components/Header';

export default function Terms() {
    return (
        <div className="page-terms bg-[#0A0A0B] text-on-background font-body-md min-h-screen flex flex-col selection:bg-primary-container/30 selection:text-primary-container">
            <Header />
            <main className="flex-grow w-full max-w-3xl mx-auto pt-32 px-6 pb-20">
                <span className="text-[10px] font-mono text-[#00FF41] uppercase tracking-widest bg-[#00FF41]/10 px-2 py-1 rounded border border-[#00FF41]/20">
                    Términos de Servicio
                </span>
                <h1 className="text-4xl font-black font-['Space_Grotesk'] mt-4 mb-10">
                    Términos y Condiciones
                </h1>

                <div className="prose prose-invert max-w-none font-body-md text-slate-300 space-y-6">
                    <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white border-b border-[#00FF41]/20 pb-2 mt-8">1. Naturaleza del Proyecto</h2>
                    <p>
                        PAMS es una prueba de concepto tecnológica desarrollada como Trabajo de Fin de Grado (TFG). Se proporciona tal cual, sin garantías de disponibilidad continua o mantenimiento a largo plazo. El entorno puede ser reiniciado o actualizado como parte del proceso de evaluación académica.
                    </p>

                    <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white border-b border-[#00FF41]/20 pb-2 mt-8">2. Licencia de Código Abierto</h2>
                    <p>
                        El código fuente de esta plataforma está liberado bajo la licencia <strong>AGPL-3.0</strong>. Eres libre de estudiar, modificar y distribuir el código de la infraestructura, siempre y cuando cualquier trabajo derivado mantenga la misma licencia y sea de código abierto.
                    </p>

                    <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white border-b border-[#00FF41]/20 pb-2 mt-8">3. Propiedad de las Creaciones (Comunidad)</h2>
                    <p>
                        La esencia del <em>Live Coding</em> es colaborativa. Al utilizar el "Live Editor" y pulsar "Guardar Pista", aceptas que el código de tus composiciones rítmicas sea visible en la <strong>Galería Comunitaria</strong>.
                    </p>
                    <p>
                        Otros usuarios de la academia podrán escuchar, estudiar y remezclar (fork) tus secuencias de Strudel. Mantendrás siempre la autoría de tu código original, apareciendo tu alias como creador de la pista.
                    </p>

                    <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white border-b border-[#00FF41]/20 pb-2 mt-8">4. Código de Conducta</h2>
                    <p>
                        Al tratarse de un entorno universitario, se espera un uso responsable y ético del sistema. Está estrictamente prohibido:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 marker:text-[#00FF41]">
                        <li>Saturar los servidores de la API de forma intencionada.</li>
                        <li>Utilizar nombres de usuario o títulos de proyectos que resulten ofensivos.</li>
                        <li>Intentar vulnerar la seguridad del sistema de autenticación basado en JWT.</li>
                    </ul>

                    <div className="bg-[#141416] border border-slate-800 p-6 rounded-lg mt-10">
                        <p className="text-sm font-mono text-slate-500 mb-0">
                            Al registrarte en PAMS, confirmas haber leído y aceptado estas condiciones orientadas a la experimentación musical educativa.
                        </p>
                    </div>
                </div>
            </main>
            {/* FOOTER UNIVERSAL */}
            <footer className="w-full py-8 px-6 lg:px-12 flex flex-col xl:flex-row justify-between items-center border-t border-[#00FF41]/10 bg-[#0A0A0B] relative z-40 mt-auto flex-shrink-0">
                <div className="font-['Space_Grotesk'] font-bold text-[#00FF41] text-lg mb-6 xl:mb-0 text-center xl:text-left">
                PAMS <span className="opacity-50 font-normal ml-2 block sm:inline-block mt-1 sm:mt-0">// ¿Quién dijo que programar no es divertido?</span>
                </div>
                
                <div className="flex flex-wrap justify-center gap-6 md:gap-8 font-['Space_Grotesk'] text-xs uppercase tracking-widest text-slate-600 mb-6 xl:mb-0">
                <a className="hover:text-[#00FF41] transition-colors" href="https://strudel.tidalcycles.org/tutorial/" target="_blank" rel="noopener noreferrer">Documentación</a>
                <a className="hover:text-[#00FF41] transition-colors" href="https://github.com/BZG34/tfg-music-learning-strudel" target="_blank" rel="noopener noreferrer">GitHub</a>
                <Link className="hover:text-[#00FF41] transition-colors" to="/privacy">Privacidad</Link>
                <Link className="hover:text-[#00FF41] transition-colors" to="/terms">Términos</Link>
                </div>
                
                <div className="font-['Space_Grotesk'] text-xs opacity-60 text-slate-500 font-bold text-[#00FF41] text-center xl:text-right">
                © 2026 <strong>PAMS</strong>. Código abierto bajo licencia <strong><a className="hover:underline" href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank" rel="noopener noreferrer">AGPL-3.0</a></strong>. Ver <strong><a className="hover:underline" href="https://github.com/BZG34/tfg-music-learning-strudel" target="_blank" rel="noopener noreferrer">Código Fuente</a></strong>.
                </div>
            </footer>
        </div>
    );
}