import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="page-landing bg-[#0A0A0B] text-white min-h-screen selection:bg-[#00FF41]/30 selection:text-[#00FF41]">
      
      {/* TopAppBar */}
      <header className="fixed top-0 z-50 w-full bg-[#0A0A0B] backdrop-blur-xl bg-opacity-80 border-b border-[#00FF41]/20 shadow-[0_0_15px_rgba(0,255,65,0.1)]">
        <nav className="flex justify-between items-center w-full px-6 py-4 max-w-[1920px] mx-auto">
          <div className="text-2xl font-black text-[#00FF41] tracking-widest font-['Space_Grotesk'] uppercase">
            PAMS
          </div>
          <div className="hidden md:flex items-center gap-8 font-['Space_Grotesk'] tracking-tighter uppercase font-bold text-sm">
            <Link className="text-[#00FF41] border-b-2 border-[#00FF41] pb-1" to="/">Inicio</Link>
            <Link className="text-slate-500 hover:text-slate-300 transition-colors" to="/editor">Editor en vivo</Link>
            <Link className="text-slate-500 hover:text-slate-300 transition-colors" to="/gallery">Galería</Link>
            <Link className="text-slate-500 hover:text-slate-300 transition-colors" to="/dashboard">Lecciones</Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-[#00FF41] hover:bg-[#00FF41]/5 p-2 rounded transition-all active:scale-95">terminal</button>
            <button className="material-symbols-outlined text-[#00FF41] hover:bg-[#00FF41]/5 p-2 rounded transition-all active:scale-95">notifications</button>
            <div className="w-8 h-8 rounded-full border border-[#00FF41]/30 overflow-hidden">
              <img alt="User profile avatar" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" />
            </div>
          </div>
        </nav>
      </header>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative px-6 md:px-12 py-20 flex flex-col items-center justify-center min-h-[80vh] overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#00FF41_0%,_transparent_50%)]"></div>
          </div>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <span className="font-['Space_Grotesk'] text-sm text-[#00FF41] mb-4 block tracking-[0.3em] uppercase">Proyecto PAMS // Vol 1.0</span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-none font-['Space_Grotesk']">
              Transforma <span className="text-[#00FF41] drop-shadow-[0_0_10px_rgba(0,255,65,0.3)]">Código</span> en <span className="text-cyan-400">Música</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg">
              Domina la lógica de la música. PAMS te enseña a programar a través de la composición algorítmica utilizando Strudel. No se necesitan conocimientos teóricos, solo ritmo.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/dashboard" className="bg-[#00FF41] text-[#003907] px-8 py-4 font-['Space_Grotesk'] font-bold uppercase tracking-widest hover:bg-white hover:text-black active:scale-95 transition-all shadow-[0_0_20px_rgba(0,255,65,0.4)]">
                Empieza a programar música
              </Link>
              <Link to="/editor" className="border border-slate-700 px-8 py-4 font-['Space_Grotesk'] font-bold uppercase tracking-widest text-white hover:bg-slate-900 transition-all">
                Ver pista de ejemplo
              </Link>
            </div>
          </div>
        </section>

        {/* Cómo funciona / Sequencer Visualizer */}
        <section className="px-6 md:px-12 py-20 bg-[#101012]">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="w-full lg:w-1/2">
                <div className="bg-[#141416] p-6 rounded-lg border border-[#00FF41]/20 shadow-2xl relative">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                    <span className="ml-4 font-mono text-xs text-slate-500">main.strudel</span>
                  </div>
                  <pre className="font-mono text-sm text-[#00FF41] leading-relaxed overflow-x-auto">
                    <span className="text-magenta-400">stack</span>(<br />
                    {"  "}<span className="text-cyan-400">s</span>(<span className="text-amber-400">"bd sd [~ bd] sd"</span>).<span className="text-slate-400">room</span>(<span className="text-amber-400">0.8</span>),<br />
                    {"  "}<span className="text-cyan-400">s</span>(<span className="text-amber-400">"hh*8"</span>).<span className="text-slate-400">gain</span>(<span className="text-amber-400">"0.4 0.8"</span>),<br />
                    {"  "}<span className="text-cyan-400">n</span>(<span className="text-amber-400">"c3(3,8)"</span>).<span className="text-cyan-400">s</span>(<span className="text-amber-400">"saw"</span>).<span className="text-slate-400">lp</span>(<span className="text-amber-400">1200</span>)<br />
                    ).<span className="text-slate-400">jux</span>(<span className="text-magenta-400">rev</span>)
                  </pre>
                  <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                    <span className="text-xs font-mono text-slate-500">LINE 04 // BEAT 02</span>
                    <div className="flex gap-2">
                      <span className="bg-[#00FF41]/10 text-[#00FF41] px-2 py-1 text-[10px] font-bold rounded uppercase">Polyrhythm</span>
                      <span className="bg-cyan-500/10 text-cyan-400 px-2 py-1 text-[10px] font-bold rounded uppercase">Filter Sweep</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 flex flex-col gap-6">
                <div className="p-8 bg-[#141416] border border-slate-800 rounded-xl relative overflow-hidden group">
                  <h2 className="text-3xl font-bold mb-4 font-['Space_Grotesk'] text-white">Feedback inmediato</h2>
                  <p className="text-slate-400 leading-relaxed">
                    Escribe una línea de código y escucha cómo cambia el ritmo al instante. El compilador en tiempo real conecta tu sintaxis directamente con un motor de audio basado en la web, convirtiendo lo abstracto en algo orgánico y tangible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Features Section */}
        <section className="px-6 md:px-12 py-20 max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-10 bg-[#141416] border border-slate-800 rounded-xl hover:border-[#00FF41]/40 transition-all group">
            <span className="material-symbols-outlined text-4xl text-[#00FF41] mb-6 block group-hover:scale-110 transition-transform">code_blocks</span>
            <h3 className="text-2xl font-bold mb-4 font-['Space_Grotesk'] uppercase tracking-tighter">Aprende haciendo</h3>
            <p className="text-slate-400 text-lg">
              Olvídate de los tutoriales aburridos. Crearás cajas de ritmos, paisajes sonoros ambientales y éxitos de discoteca mientras aprendes sobre variables, matrices y lógica condicional. Es programación que vale la pena.
            </p>
          </div>
          <div className="p-10 bg-[#141416] border border-slate-800 rounded-xl relative overflow-hidden">
            <span className="material-symbols-outlined text-4xl text-cyan-400 mb-6 block">music_note</span>
            <h3 className="text-2xl font-bold mb-4 font-['Space_Grotesk'] uppercase tracking-tighter">No hace falta teoría</h3>
            <p className="text-slate-400">
              Empieza por el ritmo. Convertirás los conceptos musicales en patrones lógicos que puedes visualizar de verdad.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-12 flex flex-col md:flex-row justify-between items-center border-t border-[#00FF41]/10 bg-[#0A0A0B]">
        <div className="font-['Space_Grotesk'] font-bold text-[#00FF41] text-lg mb-4 md:mb-0">
          PAMS <span className="opacity-50 font-normal ml-2 text-slate-500">// ¿Quién dijo que programar no es divertido?</span>
        </div>
        <div className="font-['Space_Grotesk'] text-xs text-slate-500 font-bold">
          © 2026 <strong className="text-[#00FF41]">PAMS</strong>. Código abierto bajo licencia{" "}
          <strong><a className="hover:text-[#00FF41]" href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank" rel="noopener noreferrer">AGPL-3.0</a></strong>. 
          Ver <strong><a className="hover:text-[#00FF41]" href="https://github.com/BZG34/tfg-music-learning-strudel" target="_blank" rel="noopener noreferrer">Código Fuente</a></strong>.
        </div>
      </footer>
    </div>
  );
}