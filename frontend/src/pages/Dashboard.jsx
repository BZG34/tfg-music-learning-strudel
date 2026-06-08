import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  // Rellenar estos estados con un fetch() a la FastAPI
  const [studentName] = useState("Developer");
  const [progress] = useState(30); // 30% de progreso
  const [completedLessons] = useState(3);
  const [totalLessons] = useState(10);

  return (
    <div className="page-dashboard bg-[#0A0A0B] text-white min-h-screen selection:bg-[#00FF41]/30 selection:text-[#00FF41]">
      
      {/* TopAppBar Shell */}
      <header className="fixed top-0 z-50 w-full bg-[#0A0A0B] backdrop-blur-xl bg-opacity-80 border-b border-[#00FF41]/20 shadow-[0_0_15px_rgba(0,255,65,0.1)]">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-[1920px] mx-auto">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-black text-[#00FF41] tracking-widest font-['Space_Grotesk'] uppercase">PAMS</Link>
            <nav className="hidden md:flex gap-6 items-center font-['Space_Grotesk'] tracking-tighter uppercase font-bold text-sm">
              <Link className="text-[#00FF41] border-b-2 border-[#00FF41] pb-1" to="/dashboard">Dashboard</Link>
              <Link className="text-slate-500 hover:text-slate-300 transition-colors" to="/editor">Live Editor</Link>
              <Link className="text-slate-500 hover:text-slate-300 transition-colors" to="/gallery">Gallery</Link>
              <span className="text-slate-500 opacity-40 cursor-not-allowed">Lessons</span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-[#00FF41] hover:bg-[#00FF41]/5 p-2 rounded transition-all">terminal</button>
            <button className="material-symbols-outlined text-[#00FF41] hover:bg-[#00FF41]/5 p-2 rounded transition-all">notifications</button>
            <div className="w-8 h-8 rounded-full border border-[#00FF41]/30 overflow-hidden">
              <img alt="User profile avatar" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" />
            </div>
          </div>
        </div>
      </header>

      {/* SideNavBar Shell */}
      <aside className="fixed left-0 top-0 h-full flex flex-col z-40 bg-[#141416] border-r border-[#00FF41]/10 w-64 pt-20">
        <div className="p-6 border-b border-[#00FF41]/10 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00FF41]/10 flex items-center justify-center rounded">
              <span className="material-symbols-outlined text-[#00FF41]">graphic_eq</span>
            </div>
            <div>
              <h3 className="font-['Space_Grotesk'] text-sm font-bold text-white">Studio Session</h3>
              <p className="font-['Space_Grotesk'] text-[10px] text-[#00FF41] opacity-70">BPM: 128</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-2 space-y-1 font-['Space_Grotesk'] text-sm">
          <Link className="bg-[#00FF41]/10 text-[#00FF41] border-l-4 border-[#00FF41] shadow-[0_0_10px_rgba(0,255,65,0.2)] py-3 px-4 flex items-center gap-3 active:translate-x-1 duration-200" to="/dashboard">
            <span className="material-symbols-outlined">grid_view</span> Home
          </Link>
          <span className="text-slate-600 py-3 px-4 flex items-center gap-3 opacity-40 cursor-not-allowed">
            <span className="material-symbols-outlined">folder_open</span> Projects
          </span>
          <Link className="text-slate-500 py-3 px-4 flex items-center gap-3 hover:bg-slate-800/50 hover:text-white transition-all active:translate-x-1 duration-200" to="/editor">
            <span className="material-symbols-outlined">graphic_eq</span> Sequencer
          </Link>
          <Link className="text-slate-500 py-3 px-4 flex items-center gap-3 hover:bg-slate-800/50 hover:text-white transition-all active:translate-x-1 duration-200" to="/gallery">
            <span className="material-symbols-outlined">forum</span> Community
          </Link>
        </nav>
        <div className="mt-auto p-4 space-y-4 font-['Space_Grotesk']">
          <Link to="/editor" className="w-full block text-center bg-[#00FF41] text-[#003907] font-bold py-2 rounded uppercase text-xs tracking-widest hover:brightness-110 active:scale-95 transition-all">New Track</Link>
          <div className="border-t border-[#00FF41]/10 pt-4">
            <a className="text-slate-600 hover:text-[#00FF41] transition-colors py-2 flex items-center gap-3 text-xs uppercase" href="#docs">
              <span className="material-symbols-outlined text-sm">menu_book</span> Documentation
            </a>
            <a className="text-slate-600 hover:text-[#00FF41] transition-colors py-2 flex items-center gap-3 text-xs uppercase" href="#status">
              <span className="material-symbols-outlined text-sm">developer_board</span> System Status
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="ml-64 pt-24 px-8 pb-12">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header Section */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-bold text-[#00FF41] uppercase mb-2 block tracking-widest font-['Space_Grotesk']">Student Workspace</span>
              <h1 className="text-4xl font-black font-['Space_Grotesk']">Welcome back, {studentName}.</h1>
            </div>
            <div className="bg-[#141416] p-6 border border-[#00FF41]/10 rounded-xl min-w-[280px]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-400 font-['Space_Grotesk'] uppercase">Total Progress</span>
                <span className="text-[#00FF41] font-bold font-mono">{progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#1A1A1C] rounded-full overflow-hidden">
                <div className="h-full bg-[#00FF41]" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="mt-3 text-xs text-slate-500 font-mono italic">// {completedLessons}/{totalLessons} Lessons Completed</p>
            </div>
          </section>

          {/* Bento Grid Dashboard */}
          <div className="grid grid-cols-12 gap-6">
            
            {/* Continue Learning Card */}
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

            {/* Recent Activity */}
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
                <div className="pt-6 border-t border-[#00FF41]/5 mt-6">
                  <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                    <span>Current Streak</span>
                    <span className="text-[#00FF41]">4 Days</span>
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
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Terminal Input UI Footer Overlay */}
      <div className="fixed bottom-0 left-64 right-0 h-10 bg-black border-t border-[#00FF41]/20 px-6 flex items-center gap-3 z-30">
        <span className="material-symbols-outlined text-[#00FF41] text-sm">terminal</span>
        <span className="text-xs font-mono text-[#00FF41]">&gt;</span>
        <span className="text-xs font-mono text-slate-400">await resonance.initialize_session()</span>
        <span className="w-2 h-4 bg-[#00FF41] animate-pulse"></span>
      </div>
    </div>
  );
}