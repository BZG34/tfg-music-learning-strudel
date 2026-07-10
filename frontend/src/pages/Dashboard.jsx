import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function Dashboard() {
  const [studentName] = useState('Borja_Admin');
  const [progress] = useState(30);
  const [completedLessons] = useState(3);
  const [totalLessons] = useState(10);

  // --- ESTADOS PARA LOS PROYECTOS ---
  const [myTracks, setMyTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyTracks = async () => {
      try {
        // Usamos el ID 1 temporalmente hasta implementar el Login
        const response = await fetch(`${API_BASE_URL}/api/users/1/projects/`);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        setMyTracks(data);
      } catch (error) {
        console.error("Error al cargar los proyectos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyTracks();
  }, []);

  return (
    <div className="page-dashboard bg-[#0A0A0B] text-on-background font-body-md min-h-screen selection:bg-primary-container/30 selection:text-primary-container">
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
            <Link className="text-[#00FF41] border-b-2 border-[#00FF41] pb-1" to="/dashboard">Panel</Link>
            <Link className="text-slate-500 hover:text-slate-300 transition-colors" to="/editor">Editor en vivo</Link>
            <Link className="text-slate-500 hover:text-slate-300 transition-colors" to="/gallery">Galería</Link>
            <Link className="text-slate-500 hover:text-slate-300 transition-colors" to="/lessons">Lecciones</Link>
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

      {/*
      <aside className="fixed left-0 top-0 h-full flex flex-col z-40 bg-[#141416] border-r border-[#00FF41]/10 w-64 pt-20">
        <div className="p-6 border-b border-[#00FF41]/10 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00FF41]/10 flex items-center justify-center rounded">
              <span className="material-symbols-outlined text-[#00FF41]">graphic_eq</span>
            </div>
            <div>
              <h3 className="font-['Space_Grotesk'] text-sm font-bold text-on-surface">Studio Session</h3>
              <p className="font-['Space_Grotesk'] text-[10px] text-[#00FF41] opacity-70">BPM: 128</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-2 space-y-1 font-['Space_Grotesk'] text-sm">
          <Link className="bg-[#00FF41]/10 text-[#00FF41] border-l-4 border-[#00FF41] shadow-[0_0_10px_rgba(0,255,65,0.2)] py-3 px-4 flex items-center gap-3 active:translate-x-1 duration-200" to="/dashboard">
            <span className="material-symbols-outlined">grid_view</span> Panel
          </Link>
          <Link className="text-slate-500 py-3 px-4 flex items-center gap-3 hover:bg-slate-800/50 hover:text-white transition-all active:translate-x-1 duration-200" to="/">
            <span className="material-symbols-outlined">school</span> Lecciones
          </Link>
          <Link className="text-slate-500 py-3 px-4 flex items-center gap-3 hover:bg-slate-800/50 hover:text-white transition-all active:translate-x-1 duration-200" to="/editor">
            <span className="material-symbols-outlined">graphic_eq</span> Editor
          </Link>
          <Link className="text-slate-500 py-3 px-4 flex items-center gap-3 hover:bg-slate-800/50 hover:text-white transition-all active:translate-x-1 duration-200" to="/gallery">
            <span className="material-symbols-outlined">forum</span> Comunidad
          </Link>
        </nav>
        <div className="mt-auto p-4 space-y-4 font-['Space_Grotesk']">
          <Link to="/editor" className="w-full block text-center bg-[#00FF41] text-[#003907] font-bold py-2 rounded uppercase text-xs tracking-widest hover:brightness-110 active:scale-95 transition-all">Nueva Pista</Link>
          <div className="border-t border-[#00FF41]/10 pt-4">
            <a className="text-slate-600 hover:text-[#00FF41] transition-colors py-2 flex items-center gap-3 text-xs uppercase" href="https://strudel.tidalcycles.org/tutorial/" target="_blank" rel="noopener noreferrer">
              <span className="material-symbols-outlined text-sm">menu_book</span> Documentation
            </a>
            <a className="text-slate-600 hover:text-[#00FF41] transition-colors py-2 flex items-center gap-3 text-xs uppercase" href="#status">
              <span className="material-symbols-outlined text-sm">developer_board</span> System Status
            </a>
          </div>
        </div>
      </aside>
      */}

      <main className="pt-24 px-8 pb-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-bold text-[#00FF41] uppercase mb-2 block tracking-widest font-['Space_Grotesk']">Area de Trabajo del Estudiante</span>
              <h1 className="text-4xl font-black font-['Space_Grotesk']">Bienvenido de nuevo, {studentName}.</h1>
            </div>
            <div className="bg-[#141416] p-6 border border-[#00FF41]/10 rounded-xl min-w-[280px]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-400 font-['Space_Grotesk'] uppercase">Progreso</span>
                <span className="text-[#00FF41] font-bold font-mono">{progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#1A1A1C] rounded-full overflow-hidden">
                <div className="h-full bg-[#00FF41]" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="mt-3 text-xs text-slate-500 font-mono italic">// {completedLessons}/{totalLessons} Lecciones Completadas</p>
            </div>
          </section>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8 bg-[#141416] rounded-xl border border-[#00FF41]/10 overflow-hidden group hover:border-[#00FF41]/40 transition-all duration-300">
              <div className="relative h-64 overflow-hidden bg-black flex items-center justify-center">
                <img alt="Cyberpunk workstation" className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700" src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-8">
                  <span className="text-[10px] font-mono bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/20 px-2 py-1 uppercase mb-3 inline-block">Module 04 // Oscillators</span>
                  <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white">Additive Synthesis Fundamentals</h2>
                </div>
              </div>
              <div className="p-8 flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-slate-400 max-w-md">Learn how to layer multiple sine waves to create complex harmonic structures using the <code className="font-mono text-[#00FF41]">stack()</code> function.</p>
                  <div className="flex gap-4 items-center pt-2">
                    <span className="flex items-center gap-1 text-xs text-slate-500 font-mono"><span className="material-symbols-outlined text-sm">schedule</span> 15 mins</span>
                    <span className="flex items-center gap-1 text-xs text-slate-500 font-mono"><span className="material-symbols-outlined text-sm">equalizer</span> Intermediate</span>
                  </div>
                </div>
                <Link to="/editor" className="bg-[#00FF41] text-[#003907] h-16 w-16 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,255,65,0.3)]">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                </Link>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4">
              <div className="bg-[#141416] p-6 rounded-xl border border-[#00FF41]/10 h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase mb-6 border-b border-[#00FF41]/10 pb-2 flex items-center justify-between font-['Space_Grotesk'] tracking-widest">
                    Recent Activity <span className="material-symbols-outlined text-sm">history</span>
                  </h3>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-1 bg-[#00FF41] rounded-full"></div>
                      <div>
                        <p className="text-xs text-slate-500 font-mono">Today, 14:20</p>
                        <p className="text-sm font-medium">Completed: <span className="text-[#00FF41]">Euclidean Rhythms</span></p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-1 bg-cyan-400 rounded-full"></div>
                      <div>
                        <p className="text-xs text-slate-500 font-mono">Yesterday, 18:45</p>
                        <p className="text-sm font-medium">Saved project: <span className="text-cyan-400">Acid-Bassline-v2</span></p>
                      </div>
                    </div>
                  </div>
                </div>
                {/*
                <div className="pt-6 border-t border-[#00FF41]/5 mt-6">
                  <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                    <span>Racha Actual</span>
                    <span className="text-[#00FF41]">4 Días</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="h-1 flex-1 bg-[#00FF41]"></div>
                    <div className="h-1 flex-1 bg-[#00FF41]"></div>
                    <div className="h-1 flex-1 bg-[#00FF41]"></div>
                    <div className="h-1 flex-1 bg-[#00FF41]"></div>
                    <div className="h-1 flex-1 bg-slate-800"></div>
                    <div className="h-1 flex-1 bg-slate-800"></div>
                    <div className="h-1 flex-1 bg-slate-800"></div>
                  </div>
                </div>
                */}
              </div>
            </div>
          </div>

          {/* ─── MIS PISTAS GUARDADAS DESDE POSTGRESQL ─── */}
          <section className="pt-8">
            <div className="flex items-center justify-between mb-6 border-b border-[#00FF41]/10 pb-2">
              <h2 className="text-xl font-bold font-['Space_Grotesk'] tracking-widest uppercase">Mis Pistas Guardadas</h2>
              <span className="text-[#00FF41] font-mono text-xs">{myTracks.length} PISTAS</span>
            </div>
            
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-500 font-mono">
                <span className="material-symbols-outlined animate-spin text-4xl mb-4 text-[#00FF41]">autorenew</span>
                <p>Sincronizando con el servidor...</p>
              </div>
            ) : myTracks.length === 0 ? (
              <div className="py-12 text-center text-slate-500 font-mono border border-dashed border-[#00FF41]/20 rounded-xl bg-[#141416]">
                <p>Aún no has guardado ninguna pista. ¡Ve al Live Editor y crea tu primer beat!</p>
                <Link to="/editor" className="mt-4 inline-block bg-[#00FF41]/10 text-[#00FF41] px-4 py-2 rounded hover:bg-[#00FF41]/20 transition-colors uppercase font-bold text-xs tracking-widest">
                  Abrir Live Editor
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {myTracks.map((track) => (
                  <div key={track.id} className="bg-[#141416] border border-[#00FF41]/20 p-6 rounded-xl hover:border-[#00FF41]/60 transition-colors group flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] truncate pr-2 group-hover:text-[#00FF41] transition-colors">{track.title}</h3>
                      <span className="bg-[#00FF41]/10 text-[#00FF41] text-[10px] font-mono px-2 py-1 rounded border border-[#00FF41]/20 whitespace-nowrap">BPM {track.bpm}</span>
                    </div>
                    <div className="bg-black/50 p-3 rounded border border-slate-800 h-20 overflow-hidden relative mb-6">
                      <pre className="text-[10px] font-mono text-[#00FF41]/70 whitespace-pre-wrap">
                        {track.strudel_code}
                      </pre>
                      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#141416] to-transparent"></div>
                    </div>
                    <Link to={`/editor/${track.id}`} className="mt-auto flex items-center justify-center gap-2 w-full py-2 bg-slate-800/50 hover:bg-[#00FF41]/10 text-slate-300 hover:text-[#00FF41] rounded font-['Space_Grotesk'] text-xs font-bold uppercase transition-all border border-transparent hover:border-[#00FF41]/30">
                      <span className="material-symbols-outlined text-sm">edit</span> Editar Pista
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
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
          <Link className="hover:text-[#00FF41] transition-colors" to="/">Privacidad</Link>
          <Link className="hover:text-[#00FF41] transition-colors" to="/">Términos</Link>
        </div>
        
        <div className="font-['Space_Grotesk'] text-xs opacity-60 text-slate-500 font-bold text-[#00FF41] text-center xl:text-right">
          © 2026 <strong>PAMS</strong>. Código abierto bajo licencia <strong><a className="hover:underline" href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank" rel="noopener noreferrer">AGPL-3.0</a></strong>. Ver <strong><a className="hover:underline" href="https://github.com/BZG34/tfg-music-learning-strudel" target="_blank" rel="noopener noreferrer">Código Fuente</a></strong>.
        </div>
      </footer>

      <div className="fixed bottom-0 left-0 right-0 h-10 bg-black border-t border-[#00FF41]/20 px-6 flex items-center gap-3 z-30">
        <span className="material-symbols-outlined text-[#00FF41] text-sm">terminal</span>
        <span className="text-xs font-mono text-[#00FF41]">&gt;</span>
        <span className="text-xs font-mono text-slate-400">await resonance.initialize_session()</span>
        <span className="w-2 h-4 bg-[#00FF41] animate-pulse"></span>
      </div>
    </div>
  );
}