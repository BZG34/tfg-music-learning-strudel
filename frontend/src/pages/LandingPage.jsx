import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="page-landing selection:bg-primary-container selection:text-on-primary-container">
      {/* HEADER ESTANDARIZADO */}
      <header className="fixed top-0 z-50 w-full bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-[#00FF41]/20 shadow-[0_0_15px_rgba(0,255,65,0.1)] flex-shrink-0">
        <nav className="flex items-center w-full px-6 py-4 max-w-[1920px] mx-auto">
          {/* IZQUIERDA: Logo */}
          <div className="flex-1 flex items-center">
            <Link to="/" className="text-2xl font-black text-[#00FF41] tracking-widest font-['Space_Grotesk'] uppercase">PAMS</Link>
          </div>
          
          {/* CENTRO: Barra de navegación centrada */}
          <div className="flex-1 hidden md:flex items-center justify-center gap-8 font-['Space_Grotesk'] tracking-tighter uppercase font-bold text-sm">
            <Link className="text-[#00FF41] border-b-2 border-[#00FF41] pb-1" to="/">Inicio</Link>
            <Link className="text-slate-500 hover:text-slate-300 transition-colors" to="/dashboard">Panel</Link>
            <Link className="text-slate-500 hover:text-slate-300 transition-colors" to="/editor">Editor en vivo</Link>
            <Link className="text-slate-500 hover:text-slate-300 transition-colors" to="/gallery">Galería</Link>
            <Link className="text-slate-500 hover:text-slate-300 transition-colors" to="/lessons">Lecciones</Link>
          </div>

          {/* DERECHA: Iconos y Perfil */}
          <div className="flex-1 flex items-center justify-end gap-4">
            <button type="button" aria-label="Terminal" className="material-symbols-outlined text-[#00FF41] hover:bg-[#00FF41]/5 p-2 rounded transition-all active:scale-95">terminal</button>
            <button type="button" aria-label="Notifications" className="material-symbols-outlined text-[#00FF41] hover:bg-[#00FF41]/5 p-2 rounded transition-all active:scale-95">notifications</button>
            <div className="w-8 h-8 rounded-full border border-[#00FF41]/30 overflow-hidden flex-shrink-0">
              <img alt="User profile avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrwr2NOkbueflO9JZhP7HCLdgrd0O-jDMGaCUf5HLfwPwcnn5toY3w7B8ABtj7YHePaFaIt4VamW79iS7UMHCwtjRQEttszG25C36uTjGiZL_Ho33F272VBdvbm0DsZ28y5rfbpbAUQTyajY3bo2spV9L56V5kpXu3cy0jHMLdf8MUSbBQAzhvr9qAl8M2-c_Kqs1wsTLyxv5jWHu9G88lrwRQUd6cEAAT3HH8DCPZxNIMSkQSUdPPjoBAMtpvryqOtnAsJf5-yIo" />
            </div>
          </div>
        </nav>
      </header>

      <main className="pt-24">
        <section className="relative px-6 md:px-12 py-20 flex flex-col items-center justify-center min-h-[819px] overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#00FF41_0%,_transparent_50%)]"></div>
          </div>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <span className="font-['Space_Grotesk'] text-label-caps text-[#00FF41] mb-4 block tracking-[0.3em] uppercase">Proyecto PAMS // Vol 1.0</span>
            <h1 className="font-display-lg text-display-lg text-on-background mb-6 leading-none">Transforma <span className="text-primary-container">Código</span> en <span className="text-secondary-container">Música</span></h1>
            <p className="font-body-md text-on-surface-variant max-w-2xl mx-auto mb-10 text-lg">
              Domina la lógica de la música. PAMS te enseña a programar a través de la composición algorítmica utilizando Strudel. No se necesitan conocimientos teóricos, solo ritmo.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/dashboard" className="playhead-pulse bg-primary-container text-on-primary-container px-8 py-4 font-['Space_Grotesk'] font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all">Empieza a programar música</Link>
              <Link to="/editor" className="border border-outline-variant px-8 py-4 font-['Space_Grotesk'] font-bold uppercase tracking-widest text-on-surface hover:bg-surface-container transition-all">Ver pista de ejemplo</Link>
            </div>
          </div>
        </section>

        <section className="px-6 md:px-12 py-20 bg-surface-container-lowest">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-beat-gap items-center">
              <div className="w-full lg:w-1/2">
                <div className="syntax-aware-border bg-[#141416] p-6 rounded-lg shadow-2xl relative">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                    <span className="ml-4 font-code-block text-xs text-slate-500">main.strudel</span>
                  </div>
                  <pre className="font-code-block text-code-block text-primary-fixed leading-relaxed">
                    <span className="text-secondary-fixed">stack</span>(
                    {'\n'}  <span className="text-[#ffabf3]">s</span>(<span className="text-primary-container">"bd sd [~ bd] sd"</span>).<span className="text-secondary-fixed-dim">room</span>(<span className="text-primary-container">0.8</span>),
                    {'\n'}  <span className="text-[#ffabf3]">s</span>(<span className="text-primary-container">"hh*8"</span>).<span className="text-secondary-fixed-dim">gain</span>(<span className="text-primary-container">"0.4 0.8"</span>),
                    {'\n'}  <span className="text-[#ffabf3]">n</span>(<span className="text-primary-container">"c3(3,8)"</span>).<span className="text-secondary-fixed-dim">s</span>(<span className="text-primary-container">"saw"</span>).<span className="text-secondary-fixed-dim">lp</span>(<span className="text-primary-container">1200</span>)
                    {'\n'})<span className="text-secondary-fixed-dim">jux</span>(<span className="text-secondary-fixed">rev</span>)
                  </pre>
                  <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                    <span className="text-xs font-code-block text-slate-500">LINE 04 // BEAT 02</span>
                    <div className="flex gap-2">
                      <span className="bg-[#00FF41]/10 text-[#00FF41] px-2 py-1 text-[10px] font-bold rounded uppercase">Polyrhythm</span>
                      <span className="bg-[#00dbe9]/10 text-[#00dbe9] px-2 py-1 text-[10px] font-bold rounded uppercase">Filter Sweep</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 flex flex-col gap-6">
                <div className="p-8 syntax-aware-border bg-surface border-primary-container/20 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(0,255,65,0.05)_50%,transparent_100%)] group-hover:translate-x-full transition-transform duration-1000"></div>
                  <h2 className="font-headline-md text-headline-md mb-4 text-on-surface">Feedback inmediato</h2>
                  <p className="font-body-md text-on-surface-variant mb-6">
                    Escribe una línea de código y escucha cómo cambia el ritmo al instante. El compilador en tiempo real conecta tu sintaxis directamente con un motor de audio basado en la web, convirtiendo lo abstracto en algo orgánico y tangible.
                  </p>
                  <div className="h-32 flex items-end gap-1 px-2 border-b border-primary-container/10">
                    <div className="w-full bg-primary-container h-1/2 opacity-30"></div>
                    <div className="w-full bg-primary-container h-3/4 opacity-50"></div>
                    <div className="w-full bg-primary-container h-1/4 opacity-20"></div>
                    <div className="w-full bg-primary-container h-full opacity-80"></div>
                    <div className="w-full bg-primary-container h-1/2 opacity-40"></div>
                    <div className="w-full bg-secondary-container h-3/4 opacity-60"></div>
                    <div className="w-full bg-secondary-container h-2/3 opacity-40"></div>
                    <div className="w-full bg-primary-container h-5/6 pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 md:px-12 py-20">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div className="md:col-span-2 p-10 syntax-aware-border bg-[#141416] hover:border-primary-container/40 transition-all group">
              <span className="material-symbols-outlined text-4xl text-primary-container mb-6 group-hover:scale-110 transition-transform">code_blocks</span>
              <h3 className="font-headline-md text-headline-md mb-4 uppercase tracking-tighter">Aprende haciendo</h3>
              <p className="font-body-md text-on-surface-variant text-lg">
                Olvídate de los tutoriales aburridos. Crearás cajas de ritmos, paisajes sonoros ambientales y éxitos de discoteca mientras aprendes sobre variables, matrices y lógica condicional. Es programación que vale la pena.
              </p>
            </div>
            <div className="p-10 syntax-aware-border bg-surface-container-high relative overflow-hidden">
              <img alt="Sound visualizer on screen" className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCci1CP_QzeiR8suiHZs0eBzEM53_dFp7-SJd7aMfSZGwvv1JV3WkxF812EDcecsRJAtbrdV406Chti1bbt-CG220C2toxRbhtDEXawMocxHIGpoIytPq4aUWrYegHmddzgDxCalBpUHIQvBisXlfygEA0bDNAxXHZEp9V-Uhr4EKRyCCrBSCueMfmaDb9-BVeiFe6iUItdYXrN1zqJalYv6jfkcU5Wd4AS8V_OqkgvjrnJ4wBCJ1PfwR7lYo7NyCacuoaeBBGNuJQ" />
              <div className="relative z-10">
                <span className="material-symbols-outlined text-4xl text-secondary-container mb-6">music_note</span>
                <h3 className="font-headline-md text-headline-md mb-4 uppercase tracking-tighter">No hace falta teoría</h3>
                <p className="font-body-md text-on-surface-variant">
                  Empieza por el ritmo. Convertirás los conceptos musicales en patrones lógicos que puedes visualizar de verdad.
                </p>
              </div>
            </div>
            <div className="p-10 syntax-aware-border bg-surface-container-high md:col-span-1">
              <span className="material-symbols-outlined text-4xl text-[#ffabf3] mb-6">groups</span>
              <h3 className="font-headline-md text-headline-md mb-4 uppercase tracking-tighter">Impulsado por la comunidad</h3>
              <p className="font-body-md text-on-surface-variant">
                Comparte tus «code-tracks» con una comunidad global. Haz un fork de los patrones de otros y remezclalos en tiempo real.
              </p>
            </div>
            <div className="md:col-span-2 flex items-center p-10 syntax-aware-border bg-[#0A0A0B] border-dashed border-primary-container/20">
              <div className="flex-1">
                <h3 className="font-headline-md text-headline-md mb-2 uppercase tracking-tighter">Experimenta con una herramienta profesional</h3>
                <p className="font-body-md text-on-surface-variant">
                  Tendrás acceso a un motor de audio de baja latencia basado en la web, construido con tecnologías de vanguardia. Es el mismo motor que impulsa nuestro editor en vivo, optimizado para una experiencia fluida.
                </p>
              </div>
              <div className="hidden sm:block">
                <div className="w-32 h-32 rounded-full border-2 border-primary-container/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary-container text-5xl">graphic_eq</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 md:px-12 py-32 text-center bg-[linear-gradient(to_bottom,#0A0A0B,#141416)]">
          <div className="max-w-3xl mx-auto border-t border-b border-primary-container/20 py-20 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0A0A0B] px-4 font-code-block text-[#00FF41] text-xs">¿LIST@ PARA EMPERZAR?</div>
            <h2 className="font-display-lg text-display-lg mb-8 tracking-tighter">Fluye con la <span className="text-primary-container underline decoration-wavy">Sintaxis</span></h2>
            <p className="font-body-md text-on-surface-variant mb-12 text-xl italic opacity-80">"Nunca me lo había pasado tan bien aprendiendo programación." — Estudiante Beta</p>
            <div className="flex justify-center">
              <Link to="/editor" className="group relative px-12 py-6 bg-transparent overflow-hidden">
                <div className="absolute inset-0 border-2 border-[#00FF41] group-hover:scale-105 transition-transform duration-300"></div>
                <div className="absolute inset-0 bg-[#00FF41] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative z-10 font-['Space_Grotesk'] font-black uppercase text-xl tracking-widest text-[#00FF41] group-hover:text-[#0A0A0B]">Empieza a programar música</span>
              </Link>
            </div>
          </div>
        </section>
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

      <div className="fixed left-0 top-0 h-full flex flex-col z-40 bg-[#141416] border-r border-[#00FF41]/10 w-64 -translate-x-full lg:translate-x-0 transition-transform lg:hidden">
        <div className="p-6 border-b border-[#00FF41]/10">
          <h4 className="font-['Space_Grotesk'] text-xs font-bold text-[#00FF41] uppercase tracking-widest">Studio Session</h4>
          <p className="text-[10px] text-slate-500 font-mono">BPM: 128</p>
        </div>
        <nav className="flex-1 py-4 font-['Space_Grotesk'] text-sm">
          <Link className="bg-[#00FF41]/10 text-[#00FF41] border-l-4 border-[#00FF41] shadow-[0_0_10px_rgba(0,255,65,0.2)] py-3 px-4 flex items-center gap-3" to="/">
            <span className="material-symbols-outlined">grid_view</span> Inicio
          </Link>
          <Link className="text-slate-500 py-3 px-4 flex items-center gap-3 hover:bg-slate-800/50 hover:text-white transition-all active:translate-x-1 duration-200" to="/dashboard">
            <span className="material-symbols-outlined">folder_open</span> Proyectos
          </Link>
          <Link className="text-slate-500 py-3 px-4 flex items-center gap-3 hover:bg-slate-800/50 hover:text-white transition-all active:translate-x-1 duration-200" to="/editor">
            <span className="material-symbols-outlined">graphic_eq</span> Sequenciador
          </Link>
          <Link className="text-slate-500 py-3 px-4 flex items-center gap-3 hover:bg-slate-800/50 hover:text-white transition-all active:translate-x-1 duration-200" to="/gallery">
            <span className="material-symbols-outlined">forum</span> Comunidad
          </Link>
          <Link className="text-slate-500 py-3 px-4 flex items-center gap-3 hover:bg-slate-800/50 hover:text-white transition-all active:translate-x-1 duration-200" to="/dashboard">
            <span className="material-symbols-outlined">settings</span> Ajustes
          </Link>
        </nav>
        <div className="p-4 border-t border-[#00FF41]/10 flex flex-col gap-2">
          <a className="text-slate-600 text-[10px] flex items-center gap-2 hover:text-[#00FF41] transition-colors uppercase font-bold tracking-widest" href="#">
            <span className="material-symbols-outlined text-sm">menu_book</span> Documentación
          </a>
          <a className="text-slate-600 text-[10px] flex items-center gap-2 hover:text-[#00FF41] transition-colors uppercase font-bold tracking-widest" href="#">
            <span className="material-symbols-outlined text-sm">developer_board</span> Estado del sistema
          </a>
        </div>
      </div>
    </div>
  );
}