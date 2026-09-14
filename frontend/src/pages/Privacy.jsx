import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function Privacy() {
    return (
        <div className="page-privacy bg-[#0A0A0B] text-on-background font-body-md min-h-screen flex flex-col selection:bg-primary-container/30 selection:text-primary-container">
            <Header />
            <main className="flex-grow w-full max-w-3xl mx-auto pt-32 px-6 pb-20">
                <span className="text-[10px] font-mono text-[#00FF41] uppercase tracking-widest bg-[#00FF41]/10 px-2 py-1 rounded border border-[#00FF41]/20">
                    Política de Privacidad
                </span>
                <h1 className="text-4xl font-black font-['Space_Grotesk'] mt-4 mb-10">
                    Tratamiento de Datos en PAMS
                </h1>

                <div className="prose prose-invert max-w-none font-body-md text-slate-300 space-y-6">
                    <p>
                        Bienvenido a{" "}
                        <strong>
                            PAMS (Plataforma de Aprendizaje Musical con Strudel)
                        </strong>
                        . Esta plataforma ha sido desarrollada como Trabajo de Fin de Grado
                        (TFG) para la Ingeniería en Sistemas de Información de la{" "}
                        <strong>Universidad de Alcalá (UAH)</strong>. La privacidad y
                        transparencia son pilares fundamentales de este proyecto académico.
                    </p>

                    <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white border-b border-[#00FF41]/20 pb-2 mt-8">
                        1. Datos que recopilamos
                    </h2>
                    <p>
                        Al registrarte y utilizar la plataforma, el sistema únicamente
                        almacena la información estrictamente necesaria para su
                        funcionamiento:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 marker:text-[#00FF41]">
                        <li>
                            <strong>Datos de cuenta:</strong> Tu nombre de usuario (alias) y
                            dirección de correo electrónico. La contraseña se almacena de
                            forma encriptada (hash bcrypt) y es inaccesible incluso para los
                            administradores.
                        </li>
                        <li>
                            <strong>Datos académicos:</strong> Tu progreso en las lecciones
                            interactivas para mostrar tu evolución en el panel de control.
                        </li>
                        <li>
                            <strong>Creaciones musicales:</strong> El código fuente (Strudel)
                            de los proyectos que decidas guardar, así como sus parámetros
                            asociados (BPM).
                        </li>
                    </ul>

                    <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white border-b border-[#00FF41]/20 pb-2 mt-8">
                        2. Finalidad del tratamiento
                    </h2>
                    <p>
                        Los datos recopilados tienen un fin única y exclusivamente{" "}
                        <strong>educativo, académico y funcional</strong>. No existe ningún
                        tipo de monetización, perfilado publicitario ni cesión de datos a
                        terceros. Tu correo electrónico solo se utiliza como identificador
                        único para el inicio de sesión.
                    </p>

                    <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white border-b border-[#00FF41]/20 pb-2 mt-8">
                        3. Uso de Cookies
                    </h2>
                    <p>
                        PAMS{" "}
                        <strong>
                            no utiliza cookies de rastreo ni de analítica de terceros
                        </strong>
                        . Únicamente empleamos el almacenamiento local de tu navegador
                        (Local Storage) para guardar tu Token de sesión (JWT) de forma
                        temporal, permitiéndote navegar por la plataforma sin tener que
                        iniciar sesión en cada página.
                    </p>

                    <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white border-b border-[#00FF41]/20 pb-2 mt-8">
                        4. Tus derechos sobre los datos
                    </h2>
                    <p>
                        Tienes control total sobre tu información. Desde tu Panel de Control
                        (Dashboard), puedes eliminar de forma permanente e irreversible
                        cualquier composición musical que hayas guardado en el servidor
                        pulsando el icono de la papelera.
                    </p>

                    <div className="bg-[#141416] border border-slate-800 p-6 rounded-lg mt-10">
                        <p className="text-sm font-mono text-slate-500 mb-0">
                            Última actualización: Septiembre de 2026
                            <br />
                            Desarrollado por Borja Zaragoza Gil para la Universidad de Alcalá.
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
