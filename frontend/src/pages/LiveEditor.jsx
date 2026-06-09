import { useState } from 'react';
import { Link } from 'react-router-dom';
import { evaluate, hush, initStrudel } from '@strudel/web';
import '@strudel/webaudio';

export default function LiveEditor() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo] = useState(128);
  const [code] = useState('stack(\n  s("bd*4"),\n  s("hh27*8").gain(0.8),\n  s("~ [cp, snare]").room(0.4)\n).slow(2)');

  const handlePlay = async () => {
    try {
      await initStrudel();
      evaluate('note("C3 E3 G3 B3 C4").s("triangle").play()');
      setIsPlaying(true);
    } catch (error) {
      console.error('Error al inicializar el motor de audio:', error);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    hush();
    setIsPlaying(false);
  };

  return (
    <div className="page-live-editor bg-[#0A0A0B] text-on-surface font-body-md overflow-hidden h-screen flex flex-col selection:bg-primary-container/30 selection:text-primary-container">
      <header className="bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-[#00FF41]/20 shadow-[0_0_15px_rgba(0,255,65,0.1)] flex justify-between items-center w-full px-6 py-4 z-50">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-black text-[#00FF41] tracking-widest font-['Space_Grotesk'] uppercase">PAMS</Link>
          <nav className="hidden md:flex gap-6 items-center font-['Space_Grotesk'] tracking-tighter uppercase font-bold text-sm">
            <Link className="text-slate-500 hover:text-slate-300 transition-colors" to="/dashboard">Dashboard</Link>
            <Link className="text-[#00FF41] border-b-2 border-[#00FF41] pb-1" to="/editor">Live Editor</Link>
            <Link className="text-slate-500 hover:text-slate-300 transition-colors" to="/gallery">Gallery</Link>
            <Link className="text-slate-500 hover:text-slate-300 transition-colors" to="/">Lessons</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-surface-container-low border border-outline-variant/30 px-3 py-1.5 rounded-lg">
            <span className="material-symbols-outlined text-primary-container mr-2 text-sm">terminal</span>
            <span className="font-code-block text-code-block text-on-surface-variant">res_kernel_v1.0.4</span>
          </div>
          <button type="button" className="material-symbols-outlined text-slate-500 hover:bg-[#00FF41]/5 transition-all p-2 rounded active:scale-95 cursor-pointer">notifications</button>
          <img alt="User profile avatar" className="w-8 h-8 rounded-full border border-[#00FF41]/40" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <section className="w-80 bg-[#141416] border-r border-[#00FF41]/10 flex flex-col overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="px-2 py-1 bg-primary-container/10 text-primary-container font-label-caps text-label-caps border border-primary-container/20">Lesson 04</span>
              <h2 className="font-headline-md text-xl text-on-surface">Polyphonic Cycles</h2>
            </div>
            <div className="space-y-6">
              <div className="prose prose-invert prose-sm">
                <p className="text-on-surface-variant font-body-md leading-relaxed">
                  Now we'll dive into <span className="bg-magenta-500/10 text-magenta-400 px-1 font-code-block">layering</span> multiple patterns. In Strudel, you can combine signals using the <code className="text-primary-container font-code-block">stack()</code> function.
                </p>
                <p className="text-on-surface-variant font-body-md mt-4">
                  This creates a vertical harmonic relationship, allowing your logic to resonate across the frequency spectrum.
                </p>
              </div>
              <div className="space-y-3 mt-8">
                <h3 className="font-label-caps text-label-caps text-[#00FF41] uppercase tracking-widest border-b border-[#00FF41]/10 pb-2">Objective</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 group">
                    <div className="mt-1 flex-shrink-0 w-4 h-4 border border-[#00FF41] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[12px] text-[#00FF41]" style={{ fontVariationSettings: "'wght' 700" }}>check</span>
                    </div>
                    <span className="text-sm text-on-surface font-body-md">Define a base 4/4 kick drum pattern</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <div className="mt-1 flex-shrink-0 w-4 h-4 border border-outline flex items-center justify-center"></div>
                    <span className="text-sm text-on-surface-variant font-body-md">Layer a polyrhythmic hi-hat pattern using <code className="text-secondary font-code-block text-[12px]">"8th"</code> notation</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <div className="mt-1 flex-shrink-0 w-4 h-4 border border-outline flex items-center justify-center"></div>
                    <span className="text-sm text-on-surface-variant font-body-md">Apply a low-pass filter to the second layer</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-auto p-6 bg-surface-container-lowest/50 border-t border-[#00FF41]/5">
            <button type="button" className="w-full py-3 bg-[#00FF41]/10 border border-[#00FF41]/30 text-[#00FF41] font-label-caps tracking-widest hover:bg-[#00FF41]/20 transition-all flex items-center justify-center gap-2">
              <span>NEXT LESSON</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </section>

        <section className="flex-1 bg-[#0A0A0B] flex flex-col relative border-r border-[#00FF41]/10">
          <div className="h-12 border-b border-[#00FF41]/10 flex items-center px-4 justify-between bg-[#0F0F11]">
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <span className="material-symbols-outlined text-sm">description</span>
              <span>MAIN_SEQUENCE.STRUDEL</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-[#00FF41] animate-pulse' : 'bg-amber-500'}`}></span>
              <span className="text-[10px] text-slate-400 uppercase">{isPlaying ? 'Engine Active' : 'Engine Ready'}</span>
            </div>
          </div>

          <div className="flex-1 p-6 flex font-mono text-sm overflow-y-auto leading-relaxed">
            <div className="w-12 text-right pr-4 text-slate-700 select-none border-r border-[#00FF41]/5">
              <div>01</div><div className="text-[#00FF41]/50 font-bold">02</div><div>03</div><div>04</div><div>05</div>
            </div>
            <div className="flex-1 pl-6 text-slate-300 space-y-1">
              <div><span className="text-magenta-400">stack</span>(</div>
              <div className="pl-6"><span className="text-cyan-400">s</span>(<span className="text-amber-400">"bd*4"</span>),</div>
              <div className="pl-6 bg-[#00FF41]/5 border-l-2 border-[#00FF41] -ml-6 pl-10"><span className="text-cyan-400">s</span>(<span className="text-amber-400">"hh27*8"</span>).<span className="text-magenta-400">gain</span>(<span className="text-orange-400">0.8</span>),</div>
              <div className="pl-6"><span className="text-cyan-400">s</span>(<span className="text-amber-400">"~ [cp, snare]"</span>).<span className="text-magenta-400">room</span>(<span className="text-orange-400">0.4</span>)</div>
              <div>)</div>
            </div>
          </div>

          <div className="absolute bottom-4 left-6 right-6 bg-[#141416] border border-[#00FF41]/20 p-2 flex items-center gap-3 rounded shadow-2xl">
            <span className="material-symbols-outlined text-[#00FF41] text-sm">terminal</span>
            <input className="bg-transparent border-none text-xs w-full text-slate-300 placeholder:text-slate-600 focus:outline-none" placeholder="Quick command (e.g. /bpm 140)" type="text" value={code} readOnly />
          </div>
        </section>

        <section className="w-96 bg-[#141416] flex flex-col">
          <div className="p-6 h-1/2 flex flex-col border-b border-[#00FF41]/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-['Space_Grotesk']">Spectral Output</h3>
              <span className="text-[10px] text-[#00FF41]">STEREO // 44.1kHz</span>
            </div>
            <div className="flex-1 bg-black rounded-lg border border-[#00FF41]/10 overflow-hidden relative flex items-center justify-around px-8">
              <div className={`w-1 bg-[#00FF41] rounded-full transition-all duration-300 ${isPlaying ? 'h-24 animate-pulse' : 'h-4'}`}></div>
              <div className={`w-1 bg-[#00FF41] rounded-full transition-all duration-300 ${isPlaying ? 'h-32 animate-bounce' : 'h-6'}`}></div>
              <div className={`w-1 bg-[#00FF41] rounded-full transition-all duration-300 ${isPlaying ? 'h-16 animate-pulse' : 'h-3'}`}></div>
              <div className={`w-1 bg-[#00FF41] rounded-full transition-all duration-300 ${isPlaying ? 'h-28 animate-bounce' : 'h-5'}`}></div>
            </div>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handlePlay}
                  className={`w-12 h-12 flex items-center justify-center rounded-full transition-all active:scale-95 cursor-pointer ${isPlaying ? 'bg-emerald-500 text-black' : 'bg-[#00FF41] text-black shadow-[0_0_15px_rgba(0,255,65,0.4)]'}`}
                >
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                </button>
                <button
                  type="button"
                  onClick={handleStop}
                  className="w-12 h-12 flex items-center justify-center border border-slate-700 text-slate-300 rounded-full hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-2xl">stop</span>
                </button>
              </div>
              <div className="text-right font-['Space_Grotesk']">
                <div className="text-[10px] text-slate-500 uppercase mb-1 tracking-widest">Tempo</div>
                <div className="flex items-center gap-1 justify-end">
                  <span className="text-2xl font-bold text-white">{tempo}</span>
                  <span className="text-xs text-[#00FF41]">BPM</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="bg-[#0A0A0B] p-3 border border-slate-800 rounded">
                <div className="text-[10px] text-slate-500 uppercase mb-2 font-['Space_Grotesk']">Swing</div>
                <div className="h-1 bg-slate-800 w-full rounded-full overflow-hidden">
                  <div className="h-full bg-[#00FF41] w-1/4"></div>
                </div>
              </div>
              <div className="bg-[#0A0A0B] p-3 border border-slate-800 rounded">
                <div className="text-[10px] text-slate-500 uppercase mb-1 font-['Space_Grotesk']">Quantize</div>
                <div className="text-xs text-cyan-400 font-bold">1/16 Grid</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="bg-[#0A0A0B] border-t border-[#00FF41]/10 w-full py-4 px-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-6">
          <span className="font-['Space_Grotesk'] text-xs opacity-60 text-slate-500 font-bold text-[#00FF41]">
            © 2026 <strong>PAMS</strong>. Código abierto bajo licencia
            <strong><a href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank" rel="noopener noreferrer">AGPL-3.0</a></strong>. Ver <strong><a href="https://github.com/BZG34/tfg-music-learning-strudel" target="_blank" rel="noopener noreferrer">Código Fuente</a></strong>.
          </span>
          <div className="flex gap-4">
            <a className="text-slate-600 font-['Space_Grotesk'] text-xs hover:text-[#00FF41] transition-colors" href="#">Docs</a>
            <a className="text-slate-600 font-['Space_Grotesk'] text-xs hover:text-[#00FF41] transition-colors" href="#">GitHub</a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-[#00FF41]/5 rounded border border-[#00FF41]/20 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF41]"></span>
            <span className="text-[10px] font-code-block text-[#00FF41]">ENGINE ACTIVE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}