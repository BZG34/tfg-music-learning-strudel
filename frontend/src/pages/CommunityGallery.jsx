import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';



export default function CommunityGallery() {
    const [tracks, setTracks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

	// ESTADO PARA LA BÚSQUEDA
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/projects/`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setTracks(data);
            } catch (error) {
                console.error("Error al cargar la galería:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTracks();
    }, []);

	// LÓGICA DE FILTRADO
    // Filtramos las pistas comprobando si la búsqueda coincide con el título o el username
    const filteredTracks = tracks.filter((track) => {
        const query = searchQuery.toLowerCase();
        const titleMatch = track.title?.toLowerCase().includes(query);
        const userMatch = track.owner?.username?.toLowerCase().includes(query);
        return titleMatch || userMatch;
    });

	return (
		<div className="page-community bg-[#0A0A0B] text-on-surface font-body-md selection:bg-primary-container selection:text-on-primary-container">
			{/* HEADER ESTANDARIZADO */}
			<Header />
			<main className="pt-24 min-h-screen cyber-grid relative pb-20">
				<div className="max-w-7xl mx-auto px-6 lg:px-beat-gap py-beat-gap">
					<section className="mb-12">
						<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
							<div className="space-y-2">
								<h1 className="font-display-lg text-display-lg text-[#00FF41] tracking-tighter uppercase">Galería de la comunidad</h1>
								<p className="text-slate-400 font-body-md max-w-lg">Descubre las últimas composiciones algorítmicas de la comunidad PAMS. Crea tu propia versión, aprende y remezcla el sonido.</p>
							</div>
						</div>
					</section>

					<section className="mb-gutter glass-panel border border-[#00FF41]/10 p-4 rounded-xl shadow-2xl">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="relative flex-grow">
								<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">search</span>
								{/* ENLAZAMOS EL INPUT AL ESTADO */}
                                <input 
                                    className="w-full bg-[#0A0A0B] border-none text-on-surface placeholder:text-slate-600 pl-10 focus:ring-1 focus:ring-[#00FF41] font-mono text-sm h-12 rounded outline-none" 
                                    placeholder="Buscar por título o usuario..." 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
							</div>
						</div>
					</section>

					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
                        {isLoading ? (
                            <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-500 font-mono">
                                <span className="material-symbols-outlined animate-spin text-4xl mb-4 text-[#00FF41]">autorenew</span>
                                <p>Descargando secuencias de la red...</p>
                            </div>
                        ) : tracks.length === 0 ? (
                            <div className="col-span-full py-12 text-center text-slate-500 font-mono border border-dashed border-[#00FF41]/20 rounded-xl">
                                <p>No hay pistas en la comunidad todavía. ¡Sé el primero en publicar desde el Live Editor!</p>
                            </div>
                        ) : filteredTracks.length === 0 ? (
                            // Mensaje por si la búsqueda no encuentra nada
                            <div className="col-span-full py-12 text-center text-slate-500 font-mono border border-dashed border-[#00FF41]/20 rounded-xl">
                                <p>No se han encontrado pistas que coincidan con "{searchQuery}".</p>
                                <button onClick={() => setSearchQuery('')} className="mt-4 text-[#00FF41] hover:underline">Limpiar búsqueda</button>
                            </div>
                        ) : (
							// Renderizamos filteredTracks en lugar de tracks
                            filteredTracks.map((track) => (
                                <article key={track.id} className="group bg-[#141416] border border-[#00FF41]/10 rounded-xl overflow-hidden glow-hover transition-all duration-300 flex flex-col h-full">
                                    <div className="h-40 bg-[#0A0A0B] relative overflow-hidden waveform-thumb flex items-center justify-center border-b border-[#00FF41]/10">
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#141416] to-transparent z-10"></div>
                                        <span className="material-symbols-outlined text-6xl text-[#00FF41]/20 group-hover:scale-110 transition-transform duration-500">graphic_eq</span>
                                        {/* <div className="absolute top-3 left-3 px-2 py-1 bg-[#00FF41]/20 backdrop-blur-md rounded border border-[#00FF41]/30 z-20">
                                            <span className="text-[10px] font-mono text-[#00FF41] uppercase tracking-widest">BPM: {track.bpm}</span>
                                        </div> */}
                                    </div>
                                    <div className="p-6 flex-grow flex flex-col">
                                        <h3 className="font-headline-md text-xl text-on-surface mb-1 group-hover:text-[#00FF41] transition-colors line-clamp-1">{track.title}</h3>
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center"><span className="material-symbols-outlined text-[12px]">person</span></div>
                                            <span className="font-mono text-[#00FF41]">@{track.owner?.username || 'desconocido'}</span>
                                        </div>
                                        
                                        {/* Preview del código Strudel guardado en vez de tags */}
                                        <div className="mb-6 bg-black/50 p-3 rounded border border-slate-800 h-20 overflow-hidden relative">
                                            <pre className="text-[10px] font-mono text-[#00FF41]/70 whitespace-pre-wrap">
                                                {track.strudel_code}
                                            </pre>
                                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#141416] to-transparent"></div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 mt-auto">
                                            <Link to={`/editor/p-${track.id}`} className="flex items-center justify-center gap-2 py-3 bg-[#00FF41]/10 border border-[#00FF41]/20 text-[#00FF41] rounded font-['Space_Grotesk'] text-sm font-bold uppercase hover:bg-[#00FF41] hover:text-[#003907] transition-all">
                                                <span className="material-symbols-outlined text-lg">play_arrow</span> Remix / Escuchar
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))
                        )}

						{/* Tarjeta para crear nueva pista */}
						<div className="group bg-[#141416] border border-[#00FF41]/10 rounded-xl overflow-hidden glow-hover transition-all duration-300 flex flex-col h-full">
							<div className="h-40 bg-[#0A0A0B] relative overflow-hidden waveform-thumb">
								<div className="absolute inset-0 bg-gradient-to-t from-[#141416] to-transparent"></div>
								<div className="absolute top-3 left-3 px-2 py-1 bg-[#00FF41]/20 backdrop-blur-md rounded border border-[#00FF41]/30">
									<span className="text-[10px] font-mono text-[#00FF41] uppercase tracking-widest">Experimenta</span>
								</div>
							</div>
							<div className="p-6 flex-grow flex flex-col items-center justify-center text-center gap-3">
								<div className="w-14 h-14 rounded-full border border-[#00FF41]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
									<span className="material-symbols-outlined text-[#00FF41] text-2xl">add</span>
								</div>
								<h3 className="font-headline-md text-xl text-on-surface">Nueva Pista</h3>
								<p className="text-sm text-slate-500 max-w-56">Crea una nueva publicación y compártela en el feed de la comunidad.</p>
								<Link to="/editor" className="mt-2 inline-flex items-center justify-center gap-2 py-3 px-5 bg-[#00FF41]/10 border border-[#00FF41]/20 text-[#00FF41] rounded font-['Space_Grotesk'] text-sm font-bold uppercase hover:bg-[#00FF41] hover:text-[#003907] transition-all">
									<span className="material-symbols-outlined text-lg">play_arrow</span> Abrir Editor
								</Link>
							</div>
						</div>
					</div>

					<div className="mt-beat-gap flex justify-center">
						<nav className="flex items-center gap-2">
							<button type="button" className="p-2 border border-[#00FF41]/10 text-slate-500 hover:text-[#00FF41] transition-colors"><span className="material-symbols-outlined">chevron_left</span></button>
							<button type="button" className="w-10 h-10 border border-[#00FF41] bg-[#00FF41]/10 text-[#00FF41] font-mono text-sm">01</button>
							<button type="button" className="w-10 h-10 border border-[#00FF41]/10 text-slate-500 hover:text-[#00FF41] transition-colors font-mono text-sm">02</button>
							<button type="button" className="w-10 h-10 border border-[#00FF41]/10 text-slate-500 hover:text-[#00FF41] transition-colors font-mono text-sm">03</button>
							<span className="text-slate-700 font-mono">...</span>
							<button type="button" className="w-10 h-10 border border-[#00FF41]/10 text-slate-500 hover:text-[#00FF41] transition-colors font-mono text-sm">12</button>
							<button type="button" className="p-2 border border-[#00FF41]/10 text-slate-500 hover:text-[#00FF41] transition-colors"><span className="material-symbols-outlined">chevron_right</span></button>
						</nav>
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

			<div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0B]/90 backdrop-blur-xl border-t border-[#00FF41]/20 px-6 py-3 flex justify-between items-center">
				<button type="button" className="flex flex-col items-center gap-1 text-slate-500"><span className="material-symbols-outlined">grid_view</span><span className="text-[10px] font-['Space_Grotesk'] uppercase">Home</span></button>
				<button type="button" className="flex flex-col items-center gap-1 text-[#00FF41]"><span className="material-symbols-outlined">forum</span><span className="text-[10px] font-['Space_Grotesk'] uppercase">Gallery</span></button>
				<div className="relative -top-6">
					<button type="button" className="w-12 h-12 bg-[#00FF41] rounded-full flex items-center justify-center text-[#003907] shadow-[0_0_15px_rgba(0,255,65,0.4)]"><span className="material-symbols-outlined">add</span></button>
				</div>
				<button type="button" className="flex flex-col items-center gap-1 text-slate-500"><span className="material-symbols-outlined">graphic_eq</span><span className="text-[10px] font-['Space_Grotesk'] uppercase">Studio</span></button>
				<button type="button" className="flex flex-col items-center gap-1 text-slate-500"><span className="material-symbols-outlined">settings</span><span className="text-[10px] font-['Space_Grotesk'] uppercase">Profile</span></button>
			</div>
		</div>
	);
}