import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';



export default function CommunityGallery() {
    const [tracks, setTracks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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
	return (
		<div className="page-community bg-[#0A0A0B] text-on-surface font-body-md selection:bg-primary-container selection:text-on-primary-container">
			<header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-[#00FF41]/20 shadow-[0_0_15px_rgba(0,255,65,0.1)]">
				<div className="flex justify-between items-center w-full px-6 py-4 max-w-[1920px] mx-auto">
					<div className="text-2xl font-black text-[#00FF41] tracking-widest font-['Space_Grotesk'] uppercase">PAMS</div>
					<nav className="hidden md:flex items-center gap-8 font-['Space_Grotesk'] tracking-tighter uppercase font-bold text-sm">
						<Link className="text-slate-500 hover:text-slate-300 transition-colors active:scale-95" to="/dashboard">Dashboard</Link>
						<Link className="text-slate-500 hover:text-slate-300 transition-colors active:scale-95" to="/editor">Live Editor</Link>
						<Link className="text-[#00FF41] border-b-2 border-[#00FF41] pb-1 active:scale-95" to="/gallery">Gallery</Link>
						<Link className="text-slate-500 hover:text-slate-300 transition-colors active:scale-95" to="/">Lessons</Link>
					</nav>
					<div className="flex items-center gap-4">
						<button type="button" className="p-2 text-[#00FF41] hover:bg-[#00FF41]/5 transition-all duration-300 active:scale-95 cursor-pointer"><span className="material-symbols-outlined">terminal</span></button>
						<button type="button" className="p-2 text-[#00FF41] hover:bg-[#00FF41]/5 transition-all duration-300 active:scale-95 cursor-pointer"><span className="material-symbols-outlined">notifications</span></button>
						<div className="w-8 h-8 rounded-full border border-[#00FF41]/30 overflow-hidden">
							<img alt="User profile avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNM4ufJkoYqyRLFceFlMZY65Bi1_meIrbo8G55T0lx8rX75Z_ixGD7R1R0KPaJBrSf_FSUAoY4-UqgRQYkPw7qE_tkbXXtWN5BZxiqOB4RaLr2oEuA_sZ_MtbVSJJ1o072vPquMLj25KNsZ7ZXrG4QbaqdH77BPq1GFWk_SgcSxtz-hYEt43oAJMFl1mXeMZLm9QhCXZuZ8UHNACW2usWfoAezm_CyXCYVQntYivpX5bOkZF6nlvY6VV4DTCRAZwSubbDXAbxI_MA" />
						</div>
					</div>
				</div>
			</header>

			<aside className="fixed left-0 top-0 h-full flex flex-col z-40 bg-[#141416] border-r border-[#00FF41]/10 w-64 pt-24 hidden lg:flex">
				<div className="px-6 mb-8">
					<div className="flex items-center gap-3 p-3 bg-[#0A0A0B] border border-[#00FF41]/10 rounded-lg">
						<img alt="User Avatar" className="w-10 h-10 rounded" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAo05kNhB4jtkCnA0ufA6wRzLZ5D7xnrbWAPXKFklohSCiDWuYJL29ZyOFi0s7tgcaRJ2xfXzpvzjk_Zfyezaf3rkFHgLknyIOjaztzI-4UIRulRb1kzBNAj4EvHeyHps6JD2ydVOqoAtW0PYw5liroMy6wb7K6CONh19NNtlGfFag3UgAXhMnDMFZY50nZXh6HSyLuo1xVohpaLHgvrpemozaBt3FjQe9YpX2BixJvaR4CIYEws8_1DAamnZOIVNtgbm0-H2bzzUI" />
						<div>
							<div className="font-['Space_Grotesk'] text-sm font-bold text-on-surface">Studio Session</div>
							<div className="text-[10px] text-primary-container font-mono uppercase tracking-widest">BPM: 128</div>
						</div>
					</div>
				</div>
				<nav className="flex-1 font-['Space_Grotesk'] text-sm monospaced">
					<Link className="text-slate-500 py-3 px-6 flex items-center gap-3 hover:bg-slate-800/50 hover:text-white transition-all active:translate-x-1 duration-200" to="/dashboard"><span className="material-symbols-outlined">grid_view</span> Home</Link>
					<Link className="text-slate-500 py-3 px-6 flex items-center gap-3 hover:bg-slate-800/50 hover:text-white transition-all active:translate-x-1 duration-200" to="/">Projects</Link>
					<Link className="text-slate-500 py-3 px-6 flex items-center gap-3 hover:bg-slate-800/50 hover:text-white transition-all active:translate-x-1 duration-200" to="/editor"><span className="material-symbols-outlined">graphic_eq</span> Sequencer</Link>
					<Link className="bg-[#00FF41]/10 text-[#00FF41] border-l-4 border-[#00FF41] py-3 px-6 flex items-center gap-3 shadow-[0_0_10px_rgba(0,255,65,0.2)] active:translate-x-1 duration-200" to="/gallery"><span className="material-symbols-outlined">forum</span> Community</Link>
					<Link className="text-slate-500 py-3 px-6 flex items-center gap-3 hover:bg-slate-800/50 hover:text-white transition-all active:translate-x-1 duration-200" to="/"><span className="material-symbols-outlined">settings</span> Settings</Link>
				</nav>
				<div className="p-6 mt-auto border-t border-[#00FF41]/10">
					<button type="button" className="w-full py-3 bg-[#00FF41] text-[#003907] font-bold uppercase tracking-tighter text-sm rounded hover:brightness-110 transition-all flex items-center justify-center gap-2">
						<span className="material-symbols-outlined text-sm">add</span> New Track
					</button>
					<div className="mt-6 flex flex-col gap-3 font-['Space_Grotesk'] text-xs opacity-60">
						<a className="flex items-center gap-2 hover:text-[#00FF41] transition-colors" href="#"><span className="material-symbols-outlined text-base">menu_book</span> Documentation</a>
						<a className="flex items-center gap-2 hover:text-[#00FF41] transition-colors" href="#"><span className="material-symbols-outlined text-base">developer_board</span> System Status</a>
					</div>
				</div>
			</aside>

			<main className="lg:ml-64 pt-24 min-h-screen cyber-grid relative pb-20">
				<div className="max-w-7xl mx-auto px-6 lg:px-beat-gap py-beat-gap">
					<section className="mb-12">
						<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
							<div className="space-y-2">
								<h1 className="font-display-lg text-display-lg text-[#00FF41] tracking-tighter uppercase">Community // Gallery</h1>
								<p className="text-slate-400 font-body-md max-w-lg">Explore the latest algorithmic compositions from the PAMS community. Fork, learn, and remix the sound.</p>
							</div>
							<div className="flex gap-4 items-center">
								<div className="text-right">
									<span className="block text-[10px] text-slate-500 font-mono uppercase tracking-widest">Active nodes</span>
									<span className="font-headline-md text-headline-md text-on-surface">1,248</span>
								</div>
							</div>
						</div>
					</section>

					<section className="mb-gutter glass-panel border border-[#00FF41]/10 p-4 rounded-xl shadow-2xl">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="relative flex-grow">
								<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">search</span>
								<input className="w-full bg-[#0A0A0B] border-none text-on-surface placeholder:text-slate-600 pl-10 focus:ring-1 focus:ring-[#00FF41] font-mono text-sm h-12 rounded" placeholder="Search tracks, users, or syntax..." type="text" />
							</div>
							<div className="flex gap-2">
								<select className="bg-[#0A0A0B] border-none text-slate-400 focus:ring-1 focus:ring-[#00FF41] font-['Space_Grotesk'] text-sm rounded h-12 px-4 appearance-none">
									<option>All Genres</option>
									<option>Glitch Hop</option>
									<option>Ambient</option>
									<option>Techno-Logic</option>
								</select>
								<select className="bg-[#0A0A0B] border-none text-slate-400 focus:ring-1 focus:ring-[#00FF41] font-['Space_Grotesk'] text-sm rounded h-12 px-4">
									<option>Difficulty</option>
									<option>Beginner</option>
									<option>Intermediate</option>
									<option>Expert</option>
								</select>
								<button type="button" className="h-12 w-12 flex items-center justify-center bg-[#00FF41]/10 border border-[#00FF41]/20 text-[#00FF41] rounded hover:bg-[#00FF41]/20 transition-all"><span className="material-symbols-outlined">tune</span></button>
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
                        ) : (
                            tracks.map((track) => (
                                <article key={track.id} className="group bg-[#141416] border border-[#00FF41]/10 rounded-xl overflow-hidden glow-hover transition-all duration-300 flex flex-col h-full">
                                    <div className="h-40 bg-[#0A0A0B] relative overflow-hidden waveform-thumb flex items-center justify-center border-b border-[#00FF41]/10">
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#141416] to-transparent z-10"></div>
                                        <span className="material-symbols-outlined text-6xl text-[#00FF41]/20 group-hover:scale-110 transition-transform duration-500">graphic_eq</span>
                                        <div className="absolute top-3 left-3 px-2 py-1 bg-[#00FF41]/20 backdrop-blur-md rounded border border-[#00FF41]/30 z-20">
                                            <span className="text-[10px] font-mono text-[#00FF41] uppercase tracking-widest">BPM: {track.bpm}</span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex-grow flex flex-col">
                                        <h3 className="font-headline-md text-xl text-on-surface mb-1 group-hover:text-[#00FF41] transition-colors line-clamp-1">{track.title}</h3>
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center"><span className="material-symbols-outlined text-[12px]">person</span></div>
                                            <span className="text-sm text-slate-500">@usuario_{track.owner_id}</span>
                                        </div>
                                        
                                        {/* Preview del código Strudel guardado en vez de tags */}
                                        <div className="mb-6 bg-black/50 p-3 rounded border border-slate-800 h-20 overflow-hidden relative">
                                            <pre className="text-[10px] font-mono text-[#00FF41]/70 whitespace-pre-wrap">
                                                {track.strudel_code}
                                            </pre>
                                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#141416] to-transparent"></div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 mt-auto">
                                            <Link to={`/editor/${track.id}`} className="flex items-center justify-center gap-2 py-3 bg-[#00FF41]/10 border border-[#00FF41]/20 text-[#00FF41] rounded font-['Space_Grotesk'] text-sm font-bold uppercase hover:bg-[#00FF41] hover:text-[#003907] transition-all">
                                                <span className="material-symbols-outlined text-lg">play_arrow</span> Remix / Escuchar
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))
                        )}

						<div className="group bg-[#141416] border border-[#00FF41]/10 rounded-xl overflow-hidden glow-hover transition-all duration-300 flex flex-col h-full">
							<div className="h-40 bg-[#0A0A0B] relative overflow-hidden waveform-thumb">
								<div className="absolute inset-0 bg-gradient-to-t from-[#141416] to-transparent"></div>
								<div className="absolute top-3 left-3 px-2 py-1 bg-[#00FF41]/20 backdrop-blur-md rounded border border-[#00FF41]/30">
									<span className="text-[10px] font-mono text-[#00FF41] uppercase tracking-widest">Experimental</span>
								</div>
							</div>
							<div className="p-6 flex-grow flex flex-col items-center justify-center text-center gap-3">
								<div className="w-14 h-14 rounded-full border border-[#00FF41]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
									<span className="material-symbols-outlined text-[#00FF41] text-2xl">add</span>
								</div>
								<h3 className="font-headline-md text-xl text-on-surface">Initialize New Track</h3>
								<p className="text-sm text-slate-500 max-w-56">Start a fresh composition and publish it to the community feed.</p>
								<Link to="/editor" className="mt-2 inline-flex items-center justify-center gap-2 py-3 px-5 bg-[#00FF41]/10 border border-[#00FF41]/20 text-[#00FF41] rounded font-['Space_Grotesk'] text-sm font-bold uppercase hover:bg-[#00FF41] hover:text-[#003907] transition-all">
									<span className="material-symbols-outlined text-lg">play_arrow</span> Open Editor
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

			<footer className="lg:ml-64 bg-[#0A0A0B] border-t border-[#00FF41]/10">
				<div className="w-full py-8 px-12 flex flex-col md:flex-row justify-between items-center gap-6">
					<div className="font-['Space_Grotesk'] text-xs opacity-60 text-slate-500 font-bold text-[#00FF41]">
						© 2026 <strong>PAMS</strong>. Código abierto bajo licencia <strong><a href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank" rel="noopener noreferrer">AGPL-3.0</a></strong>. Ver <strong><a href="https://github.com/BZG34/tfg-music-learning-strudel" target="_blank" rel="noopener noreferrer">Código Fuente</a></strong>.
					</div>
					<div className="flex gap-8 font-['Space_Grotesk'] text-xs opacity-60">
						<a className="text-slate-600 hover:text-[#00FF41] transition-colors duration-300" href="#">Docs</a>
						<a className="text-slate-600 hover:text-[#00FF41] transition-colors duration-300" href="#">GitHub</a>
						<a className="text-slate-600 hover:text-[#00FF41] transition-colors duration-300" href="#">Privacy</a>
						<a className="text-slate-600 hover:text-[#00FF41] transition-colors duration-300" href="#">Terms</a>
					</div>
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