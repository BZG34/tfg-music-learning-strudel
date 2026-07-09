import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { evaluate, hush, initStrudel, samples } from '@strudel/web';
import '@strudel/webaudio';

// CodeMirror 6 imports
import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { EditorState } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';

// ─── Strudel CodeMirror theme (matches PAMS palette) ────────────────────────
const strudelTheme = EditorView.theme({
  '&': {
    backgroundColor: 'transparent',
    height: '100%',
    fontSize: '14px',
    fontFamily: 'monospace',
  },
  '.cm-content': {
    padding: '16px 0',
    caretColor: '#00FF41',
  },
  '.cm-cursor': {
    borderLeftColor: '#00FF41',
    borderLeftWidth: '2px',
  },
  '.cm-activeLine': {
    backgroundColor: 'rgba(0,255,65,0.04)',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'rgba(0,255,65,0.06)',
  },
  '.cm-gutters': {
    backgroundColor: 'transparent',
    borderRight: '1px solid rgba(0,255,65,0.08)',
    color: '#3a3a3a',
  },
  '.cm-lineNumbers .cm-gutterElement': {
    color: '#3d4d3a',
    paddingRight: '12px',
    minWidth: '3em',
  },
  '.cm-selectionBackground': {
    backgroundColor: 'rgba(0,255,65,0.15) !important',
  },
  '&.cm-focused .cm-selectionBackground': {
    backgroundColor: 'rgba(0,255,65,0.2) !important',
  },
  '.cm-matchingBracket': {
    backgroundColor: 'rgba(0,255,65,0.2)',
    outline: '1px solid rgba(0,255,65,0.4)',
  },
  // Syntax token colors
  '.tok-keyword':       { color: '#ff79c6' },
  '.tok-function':      { color: '#50fa7b' },
  '.tok-string':        { color: '#f1fa8c' },
  '.tok-number':        { color: '#ff9500' },
  '.tok-comment':       { color: '#44475a', fontStyle: 'italic' },
  '.tok-variableName':  { color: '#8be9fd' },
  '.tok-propertyName':  { color: '#00dbe9' },
  '.tok-operator':      { color: '#ff79c6' },
  '.tok-punctuation':   { color: '#6272a4' },
  '.tok-typeName':      { color: '#ffabf3' },
}, { dark: true });

/*
// ─── Default starter code ────────────────────────────────────────────────────
const DEFAULT_CODE = `// Lección 04 — Polyphonic Cycles
// Usa stack() para combinar capas rítmicas

stack(
  s("bd*4"),
  s("hh*8").gain(0.8),
  s("~ [cp, sd]").room(0.4)
).slow(2)`;

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ─── Lesson data ─────────────────────────────────────────────────────────────
const LESSON = {
  number: '04',
  title: 'Polyphonic Cycles',
  objectives: [
    { done: true,  text: 'Define un patrón de kick 4/4' },
    { done: false, text: 'Añade una capa de hi-hat polirrítmica con notación "8th"' },
    { done: false, text: 'Aplica un filtro low-pass a la segunda capa' },
  ],
};
*/

const DEFAULT_CODE = `// Conectando con la base de datos...\n`;
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ─── Quick command parser ────────────────────────────────────────────────────
function parseQuickCommand(raw, currentCode, setBpm, setCode, addLog, evalCode) {
  const cmd = raw.trim();
  if (!cmd.startsWith('/')) return false;

  const [name, ...args] = cmd.slice(1).split(' ');

  switch (name.toLowerCase()) {
    case 'bpm': {
      const val = parseInt(args[0], 10);
      if (!isNaN(val) && val > 0 && val <= 300) {
        setBpm(val);
        addLog('info', `BPM ajustado a ${val}`);
      } else {
        addLog('error', 'Uso: /bpm <número entre 1-300>');
      }
      return true;
    }
    case 'hush': {
      hush();
      addLog('info', 'Audio silenciado');
      return true;
    }
    case 'eval': {
      evalCode();
      return true;
    }
    case 'clear': {
      return 'clear';
    }
    case 'help': {
      addLog('info', 'Comandos disponibles: /bpm <n>, /hush, /eval, /clear, /help');
      return true;
    }
    default: {
      addLog('error', `Comando desconocido: /${name}. Prueba /help`);
      return true;
    }
  }
}

// ─── Log entry component ─────────────────────────────────────────────────────
function LogEntry({ entry }) {
  const colors = {
    info:    'text-[#00FF41]',
    error:   'text-red-400',
    warning: 'text-amber-400',
    system:  'text-slate-500',
    success: 'text-cyan-400',
  };
  const icons = {
    info:    '>',
    error:   '✗',
    warning: '⚠',
    system:  '///',
    success: '✓',
  };
  return (
    <div className={`flex gap-2 font-mono text-xs leading-relaxed ${colors[entry.type] ?? 'text-slate-400'}`}>
      <span className="opacity-50 flex-shrink-0 select-none">{icons[entry.type] ?? '>'}</span>
      <span className="break-all">{entry.message}</span>
      <span className="ml-auto opacity-30 flex-shrink-0 pl-2">{entry.time}</span>
    </div>
  );
}

// ─── Visualizer bars ─────────────────────────────────────────────────────────
function SpectrumBar({ isPlaying, delay = 0, baseH = 4 }) {
  return (
    <div
      className={`w-1 rounded-full transition-all ${isPlaying ? 'bg-[#00FF41]' : 'bg-[#00FF41]/20'}`}
      style={{
        height: isPlaying ? `${baseH * 4}px` : `${baseH}px`,
        animation: isPlaying ? `bounce ${0.4 + delay}s ease-in-out infinite alternate` : 'none',
      }}
    />
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function LiveEditor() {
  const { lessonId } = useParams(); // <-- Captura el número de la URL
  // Estado dinámico para la lección
  const [lesson, setLesson] = useState({ number: '...', title: 'Cargando...', objectives: [], hint: '' });
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [isIniting,    setIsIniting]    = useState(false);
  const [bpm,          setBpm]          = useState(128);
  const [starterCode,  setStarterCode]   = useState(DEFAULT_CODE);
  const [logs,         setLogs]         = useState([
    { id: 0, type: 'system', message: 'PAMS kernel v1.0.4 — motor listo. Pulsa ▶ o Ctrl+Enter para evaluar.', time: now() },
  ]);
  const [quickCmd,     setQuickCmd]     = useState('');
  const [activePanel,  setActivePanel]  = useState('objectives'); // 'objectives' | 'docs'

  const editorRef    = useRef(null);   // DOM node
  const cmViewRef    = useRef(null);   // CodeMirror EditorView
  const logEndRef    = useRef(null);   // auto-scroll anchor
  const logIdRef     = useRef(1);
  const strudelInitedRef = useRef(false); // Controla si el motor ya se ha descargado

  // ── Helpers ────────────────────────────────────────────────────────────────
  function now() {
    return new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  const addLog = useCallback((type, message) => {
    setLogs(prev => [...prev, { id: logIdRef.current++, type, message, time: now() }]);
  }, []);

  // ── Auto-scroll log ────────────────────────────────────────────────────────
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // ── Load lesson or project data from PostgreSQL ─────────────────────────
  useEffect(() => {
    let isCancelled = false;

    const loadLessonOrProject = async () => {
      try {
        // ── SI NO HAY ID EN LA URL, ENCONTRAMOS EL MODO COMPOSICIÓN LIBRE ──
        if (!lessonId) {
          if (isCancelled) return;
          setLesson({
            isNewTrack: true, // Bandera lógica
            number: "LIBRE",
            title: "Nueva Composición",
            hint: "",
            objectives: []
          });
          const sandboxCode = `// ¡Estás creando tu propia música!\n// Experimenta libremente y mezcla tus capas rítmicas.\n\nstack(\n  s("bd*4"),\n  s("hh*8").gain(0.6),\n  s("~ cp").room(0.3)\n).slow(2);`;
          setStarterCode(sandboxCode);
          addLog('success', 'Entorno de composición libre listo.');
          return; // Salimos de la función aquí, no hace falta consultar a la BD
        }

        const idToLoad = lessonId;
        addLog('system', `Buscando datos del ID ${idToLoad} en PostgreSQL...`);

        // 1. PRIMER INTENTO: Buscar como Lección
        let response = await fetch(`${API_BASE_URL}/api/lessons/${idToLoad}`);
        
        if (response.ok) {
          const lessonData = await response.json();
          if (isCancelled) return;

          // Actualiza el estado con los datos reales de la BD
          setLesson({
            number: lessonData.lesson_number,
            title: lessonData.title,
            hint: lessonData.hint_code,
            objectives: [{ done: false, text: "Aplica los conceptos usando Strudel" }]
          });
          const nextCode = `// Lección ${lessonData.lesson_number} — ${lessonData.title}\n\n${lessonData.hint_code || '// Escribe tu código'}`;
          setStarterCode(nextCode);
          addLog('success', `Lección ${lessonData.lesson_number} cargada correctamente.`);
          return; // Salimos de la función con éxito
        }

        // 2. SEGUNDO INTENTO: Si no es lección (404), buscar como Proyecto de la Galería
        response = await fetch(`${API_BASE_URL}/api/projects/${idToLoad}`);
        if (response.ok) {
          const projectData = await response.json();
          if (isCancelled) return;

          // Actualiza el estado con los datos reales de la BD
          setLesson({
            isProject: true, // <-- Bandera identificadora
            number: `P-${projectData.id}`,
            title: projectData.title,
            owner_id: projectData.owner_id, // <-- Guardamos el autor del proyecto
            hint: "",
            objectives: []
          });
          setBpm(projectData.bpm || 128);
          setStarterCode(projectData.strudel_code);
          addLog('success', `Pista de la comunidad cargada y lista para remezclar.`);
          return; // Salimos con éxito
        }

        // Si tampoco es proyecto, lanzamos error
        throw new Error(`HTTP ${response.status}`);
      } catch (err) {
        if (isCancelled) return;
        addLog('warning', `No se encontró en BD (ID: ${lessonId}): ${err?.message ?? String(err)}`);
      }
    };

    loadLessonOrProject();

    return () => { isCancelled = true; };
  }, [lessonId, addLog]); // <-- Dependencias intactas, IMPORTANTE: lessonId en las dependencias

  // ── Sync fetched code into CodeMirror when it changes ───────────────────
  useEffect(() => {
    if (!cmViewRef.current) return;

    const view = cmViewRef.current;
    const currentCode = view.state.doc.toString();

    if (currentCode === starterCode) return;

    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: starterCode,
      },
    });
  }, [starterCode]);

  // ── CodeMirror setup ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!editorRef.current || cmViewRef.current) return;

    const evalKeymap = keymap.of([
      {
        key: 'Ctrl-Enter',
        mac: 'Cmd-Enter',
        run: () => { handleEval(); return true; },
      },
      {
        key: 'Ctrl-.',
        mac: 'Cmd-.',
        run: () => { handleStop(); return true; },
      },
    ]);

    const state = EditorState.create({
      doc: starterCode,
      extensions: [
        basicSetup,
        javascript(),
        oneDark,
        strudelTheme,
        evalKeymap,
        EditorView.lineWrapping,
      ],
    });

    cmViewRef.current = new EditorView({
      state,
      parent: editorRef.current,
    });

    return () => {
      cmViewRef.current?.destroy();
      cmViewRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Get current code from CodeMirror ──────────────────────────────────────
  const getCode = useCallback(() => {
    return cmViewRef.current?.state.doc.toString() ?? DEFAULT_CODE;
  }, []);

  // ── Strudel eval ──────────────────────────────────────────────────────────
  // ── Strudel eval ──────────────────────────────────────────────────────────
  const handleEval = useCallback(async () => {
    if (isIniting) return;
    const code = getCode();

    try {
      setIsIniting(true);
      
      // SOLO DESCARGAMOS DE GITHUB LA PRIMERA VEZ QUE SE PULSA PLAY
      if (!strudelInitedRef.current) {
        addLog('system', 'Iniciando motor de audio y cacheando samples...');
        await initStrudel({
          bpm,
          prebake: () => samples('github:tidalcycles/dirt-samples'),
        });
        strudelInitedRef.current = true; // Marcamos como descargado
      }

      addLog('system', `Evaluando patrón @ ${bpm} BPM…`);
      await evaluate(code);
      setIsPlaying(true);
      addLog('success', 'Patrón activo ✓');
    } catch (err) {
      setIsPlaying(false);
      addLog('error', `Error de evaluación: ${err?.message ?? String(err)}`);
    } finally {
      setIsIniting(false);
    }
  }, [isIniting, getCode, bpm, addLog]);

  const handleStop = useCallback(() => {
    hush();
    setIsPlaying(false);
    addLog('system', 'Audio detenido');
  }, [addLog]);

  // ── Quick command handler ──────────────────────────────────────────────────
  const handleQuickCmd = useCallback((e) => {
    if (e.key !== 'Enter') return;
    const raw = quickCmd.trim();
    if (!raw) return;

    const result = parseQuickCommand(raw, getCode(), setBpm, null, addLog, handleEval);
    if (result === 'clear') {
      setLogs([{ id: logIdRef.current++, type: 'system', message: 'Consola limpiada.', time: now() }]);
    }
    setQuickCmd('');
  }, [quickCmd, getCode, addLog, handleEval]);

  // ── BPM change — re-eval if playing ───────────────────────────────────────
  const handleBpmChange = useCallback((newBpm) => {
    setBpm(newBpm);
    if (isPlaying) {
      addLog('info', `BPM → ${newBpm} (re-evaluando…)`);
      // slight delay so state settles
      setTimeout(() => handleEval(), 50);
    }
  }, [isPlaying, addLog, handleEval]);

  // ── Guardar proyecto en PostgreSQL ───────────────────────────────────────
  const handleSaveTrack = async () => {
    const currentCode = getCode();
    addLog('system', 'Guardando pista en el servidor...');
    
    try {
      // Usamos el User ID 1 temporalmente hasta tener el Login
      const response = await fetch(`${API_BASE_URL}/api/users/1/projects/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Sesión_${lesson.number}_BPM${bpm}`,
          strudel_code: currentCode,
          bpm: bpm
        })
      });

      if (response.ok) {
        addLog('success', '¡Pista guardada permanentemente en PostgreSQL!');
      } else {
        addLog('error', 'Fallo al guardar: el usuario 1 no existe en la BD.');
      }
    } catch (err) {
      addLog('error', 'Error de red al intentar guardar la pista.');
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="page-live-editor bg-[#0A0A0B] text-on-surface font-body-md overflow-hidden h-screen flex flex-col selection:bg-primary-container/30 selection:text-primary-container">

      {/* HEADER DEL EDITOR EN VIVO */}
      <header className="bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-[#00FF41]/20 shadow-[0_0_15px_rgba(0,255,65,0.1)] w-full flex-shrink-0 z-50">
        <nav className="flex items-center w-full px-6 py-3 max-w-[1920px] mx-auto">
          {/* IZQUIERDA: Logo */}
          <div className="flex-1 flex items-center">
            <Link to="/" className="text-2xl font-black text-[#00FF41] tracking-widest font-['Space_Grotesk'] uppercase">PAMS</Link>
          </div>

          {/* CENTRO: Barra de navegación centrada */}
          <div className="flex-1 hidden lg:flex items-center justify-center gap-8 font-['Space_Grotesk'] tracking-tighter uppercase font-bold text-sm">
            <Link className="text-slate-500 hover:text-slate-300 transition-colors" to="/">Inicio</Link>
            <Link className="text-slate-500 hover:text-slate-300 transition-colors" to="/dashboard">Panel</Link>
            <Link className="text-[#00FF41] border-b-2 border-[#00FF41] pb-1" to="/editor">Editor en vivo</Link>
            <Link className="text-slate-500 hover:text-slate-300 transition-colors" to="/gallery">Galería</Link>
            <Link className="text-slate-500 hover:text-slate-300 transition-colors" to="/lessons">Lecciones</Link>
          </div>

          {/* DERECHA: Widgets del editor y Perfil */}
          <div className="flex-1 flex items-center justify-end gap-4">
            <div className="hidden xl:flex items-center bg-[#141416] border border-[#00FF41]/20 px-3 py-1.5 rounded-lg">
              <span className="material-symbols-outlined text-[#00FF41] mr-2 text-sm">terminal</span>
              <span className="font-mono text-slate-400 text-xs">res_kernel_v1.0.4</span>
            </div>
            <div className="hidden 2xl:flex items-center gap-1 text-[10px] font-mono text-slate-600">
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-500">Ctrl</kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-500">Enter</kbd>
            </div>
            <button type="button" aria-label="Notifications" className="material-symbols-outlined text-[#00FF41] hover:bg-[#00FF41]/5 p-2 rounded transition-all active:scale-95">notifications</button>
            <div className="w-8 h-8 rounded-full border border-[#00FF41]/30 overflow-hidden flex-shrink-0">
              <img alt="User profile avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrwr2NOkbueflO9JZhP7HCLdgrd0O-jDMGaCUf5HLfwPwcnn5toY3w7B8ABtj7YHePaFaIt4VamW79iS7UMHCwtjRQEttszG25C36uTjGiZL_Ho33F272VBdvbm0DsZ28y5rfbpbAUQTyajY3bo2spV9L56V5kpXu3cy0jHMLdf8MUSbBQAzhvr9qAl8M2-c_Kqs1wsTLyxv5jWHu9G88lrwRQUd6cEAAT3HH8DCPZxNIMSkQSUdPPjoBAMtpvryqOtnAsJf5-yIo" />
            </div>
          </div>
        </nav>
      </header>

      {/* ── BODY ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT PANEL — Lesson ─────────────────────────────────────────── */}
        <section className="w-80 bg-[#141416] border-r border-[#00FF41]/10 flex flex-col overflow-hidden flex-shrink-0">
          {/* Panel tabs */}
          <div className="flex border-b border-[#00FF41]/10 flex-shrink-0">
            {['objectives', 'docs'].map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActivePanel(tab)}
                className={`flex-1 py-3 font-['Space_Grotesk'] text-xs uppercase tracking-widest font-bold transition-colors ${
                  activePanel === tab
                    ? 'text-[#00FF41] border-b-2 border-[#00FF41]'
                    : 'text-slate-600 hover:text-slate-400'
                }`}
              >
                {tab === 'objectives' ? (lesson.isProject ? 'Proyecto' : 'Lección') : 'Referencia'}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {activePanel === 'objectives' ? (
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <span className="px-2 py-1 bg-primary-container/10 text-primary-container font-label-caps text-label-caps border border-primary-container/20">
                    Lesson {lesson.number}
                  </span>
                  <h2 className="font-headline-md text-xl text-on-surface">{lesson.title}</h2>
                </div>
                <div className="space-y-6">
                  {lesson.isProject ? (
                    <div className="mt-8 border border-[#00FF41]/20 p-6 bg-[#00FF41]/5 rounded-lg flex flex-col items-center text-center shadow-[0_0_15px_rgba(0,255,65,0.05)]">
                      <span className="material-symbols-outlined text-[#00FF41] text-4xl mb-4">public</span>
                      <h3 className="text-[#00FF41] font-bold font-['Space_Grotesk'] mb-2">Remezcla Comunitaria</h3>
                      <p className="text-sm font-body-md text-slate-300">
                        Código original publicado por <span className="font-mono text-[#00FF41] bg-[#00FF41]/10 px-2 py-0.5 rounded">@usuario_{lesson.owner_id}</span> en la comunidad.
                      </p>
                      <p className="text-xs text-slate-500 mt-6 border-t border-[#00FF41]/10 pt-4">
                        Modifica los patrones a tu gusto. Al pulsar "Guardar pista", se publicará como un nuevo fork (versión) en la base de datos bajo tu usuario.
                      </p>
                    </div>
                  ) : lesson.isNewTrack ? (
                    <div className="mt-8 border border-[#00FF41]/20 p-6 bg-[#00FF41]/5 rounded-lg flex flex-col items-center text-center shadow-[0_0_15px_rgba(0,255,65,0.05)]">
                      <span className="material-symbols-outlined text-[#00FF41] text-4xl mb-4">music_note</span>
                      <h3 className="text-[#00FF41] font-bold font-['Space_Grotesk'] mb-2">Composición Libre</h3>
                      <p className="text-sm font-body-md text-slate-300">
                        ¡Estás creando tu propia música! Tienes un lienzo en blanco para experimentar con Live Coding.
                      </p>
                      <p className="text-xs text-slate-500 mt-6 border-t border-[#00FF41]/10 pt-4">
                        Escribe tus algoritmos sonoros en el editor central. Cuando consigas un ritmo potente, pulsa "Guardar pista" para almacenarlo permanentemente en tu catálogo personal.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="prose prose-invert prose-sm">
                        <p className="text-on-surface-variant font-body-md leading-relaxed">
                          Sigue las instrucciones de esta lección para dominar Strudel. Tu código inicial se ha cargado automáticamente desde el servidor.
                        </p>
                      </div>

                      {/* Objectives */}
                      <div className="space-y-3 mt-8">
                        <h3 className="font-label-caps text-label-caps text-[#00FF41] uppercase tracking-widest border-b border-[#00FF41]/10 pb-2">
                          Objetivos
                        </h3>
                        <ul className="space-y-4">
                          {lesson.objectives.map((obj, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <div className={`mt-1 flex-shrink-0 w-4 h-4 border flex items-center justify-center transition-colors ${
                                obj.done ? 'border-[#00FF41] bg-[#00FF41]/10' : 'border-outline'
                              }`}>
                                {obj.done && (
                                  <span className="material-symbols-outlined text-[12px] text-[#00FF41]" style={{ fontVariationSettings: "'wght' 700" }}>check</span>
                                )}
                              </div>
                              <span className={`text-sm font-body-md ${obj.done ? 'text-on-surface line-through opacity-60' : 'text-on-surface-variant'}`}>
                                {obj.text}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Snippet hint */}
                      <div className="mt-6 bg-[#0A0A0B] border border-[#00FF41]/10 p-4 rounded">
                        <p className="text-[10px] font-mono text-slate-500 uppercase mb-2 tracking-widest">Pista del editor</p>
                        <pre className="text-xs font-mono text-primary-container leading-relaxed whitespace-pre-wrap">
                          {lesson.hint || '// Sin pista disponible'}
                        </pre>
                        <button
                          type="button"
                          onClick={() => {
                            if (!cmViewRef.current || !lesson.hint) return;
                            const view = cmViewRef.current;
                            view.dispatch({
                              changes: { from: view.state.doc.length, insert: `\n${lesson.hint}` },
                            });
                            addLog('info', 'Snippet insertado en el editor');
                          }}
                          className="mt-3 text-[10px] font-mono text-[#00FF41] hover:text-[#00FF41]/70 flex items-center gap-1 transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">add</span>
                          Insertar en editor
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              /* ── DOCS PANEL ─── */
              <div className="p-6 space-y-4">
                <h3 className="font-label-caps text-label-caps text-[#00FF41] uppercase tracking-widest border-b border-[#00FF41]/10 pb-2">
                  Funciones Strudel
                </h3>
                {[
                  { fn: 'stack(...patterns)', desc: 'Combina varios patrones en paralelo, como pistas de una DAW.' },
                  { fn: 's("bd sd")', desc: 'Selecciona una muestra por nombre. Admite notación de ciclos.' },
                  { fn: '.gain(0.8)', desc: 'Volumen relativo. 1 = nominal, 0 = silencio.' },
                  { fn: '.room(0.4)', desc: 'Reverb (0-1). Simula el tamaño de sala.' },
                  { fn: '.slow(2)', desc: 'Ralentiza el patrón × el factor dado.' },
                  { fn: '.fast(2)', desc: 'Acelera el patrón × el factor dado.' },
                  { fn: '.lpf(800)', desc: 'Filtro pasa-bajos a la frecuencia (Hz) indicada.' },
                  { fn: 'n("c3(3,8)")', desc: 'Secuencia de notas con ritmo euclidiano.' },
                  { fn: '.jux(rev)', desc: 'Aplica rev al canal derecho, original en el izquierdo.' },
                ].map(({ fn, desc }) => (
                  <div key={fn} className="border-b border-[#00FF41]/5 pb-3">
                    <code className="text-xs font-mono text-primary-container">{fn}</code>
                    <p className="text-xs text-slate-500 mt-1">{desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Next lesson button */}
          <div className="p-6 bg-surface-container-lowest/50 border-t border-[#00FF41]/5 flex-shrink-0">
            <button type="button" className="w-full py-3 bg-[#00FF41]/10 border border-[#00FF41]/30 text-[#00FF41] font-label-caps tracking-widest hover:bg-[#00FF41]/20 transition-all flex items-center justify-center gap-2">
              <span>SIGUIENTE LECCIÓN</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </section>

        {/* ── CENTER PANEL — Code editor ──────────────────────────────────── */}
        <section className="flex-1 bg-[#0A0A0B] flex flex-col relative border-r border-[#00FF41]/10 min-w-0">
          {/* Editor toolbar */}
          <div className="h-12 border-b border-[#00FF41]/10 flex items-center px-4 justify-between bg-[#0F0F11] flex-shrink-0">
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <span className="material-symbols-outlined text-sm">description</span>
              <span className="font-mono">MAIN_SEQUENCE.STRUDEL</span>
            </div>
            <div className="flex items-center gap-4">
              {/* Eval shortcut hint */}
              <span className="text-[10px] font-mono text-slate-600 hidden sm:block">Ctrl+Enter evalúa · Ctrl+. detiene</span>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full transition-colors ${isPlaying ? 'bg-[#00FF41] animate-pulse' : isIniting ? 'bg-amber-500 animate-pulse' : 'bg-slate-600'}`}></span>
                <span className="text-[10px] text-slate-400 uppercase font-mono">
                  {isPlaying ? 'Engine Active' : isIniting ? 'Initializing…' : 'Engine Ready'}
                </span>
              </div>
            </div>
          </div>

          {/* CodeMirror mount */}
          <div className="flex-1 overflow-hidden">
            <div
              ref={editorRef}
              className="h-full overflow-auto [&_.cm-editor]:h-full [&_.cm-scroller]:h-full"
            />
          </div>

          {/* Console / log panel */}
          <div className="h-40 border-t border-[#00FF41]/10 bg-[#0A0A0B] flex flex-col flex-shrink-0">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-[#00FF41]/5 bg-[#0F0F11] flex-shrink-0">
              <span className="material-symbols-outlined text-[#00FF41] text-sm">terminal</span>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Consola del sistema</span>
              <button
                type="button"
                onClick={() => setLogs([{ id: logIdRef.current++, type: 'system', message: 'Consola limpiada.', time: now() }])}
                className="ml-auto text-[10px] font-mono text-slate-600 hover:text-slate-400 transition-colors"
              >
                limpiar
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
              {logs.map(entry => <LogEntry key={entry.id} entry={entry} />)}
              <div ref={logEndRef} />
            </div>
          </div>

          {/* Quick command bar */}
          <div className="border-t border-[#00FF41]/10 bg-[#0F0F11] px-4 py-2 flex items-center gap-3 flex-shrink-0">
            <span className="text-[#00FF41] font-mono text-sm flex-shrink-0">$</span>
            <input
              className="bg-transparent border-none text-xs w-full text-slate-300 placeholder:text-slate-600 focus:outline-none font-mono"
              placeholder="Quick command — /bpm 140 · /hush · /eval · /help"
              type="text"
              value={quickCmd}
              onChange={e => setQuickCmd(e.target.value)}
              onKeyDown={handleQuickCmd}
              spellCheck={false}
            />
          </div>
        </section>

        {/* ── RIGHT PANEL — Controls ──────────────────────────────────────── */}
        <section className="w-80 bg-[#141416] flex flex-col flex-shrink-0">

          {/* Spectrum visualizer */}
          <div className="p-6 border-b border-[#00FF41]/10 flex-shrink-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-['Space_Grotesk']">Spectral Output</h3>
              <span className="text-[10px] text-[#00FF41] font-mono">STEREO // 44.1kHz</span>
            </div>
            <div className="h-24 bg-black rounded-lg border border-[#00FF41]/10 overflow-hidden flex items-end justify-around px-6 pb-2">
              {[20, 32, 12, 40, 28, 16, 36, 22, 30, 14, 38, 26].map((h, i) => (
                <SpectrumBar key={i} isPlaying={isPlaying} delay={i * 0.05} baseH={h / 8} />
              ))}
            </div>
            <style>{`
              @keyframes bounce {
                from { transform: scaleY(0.3); }
                to   { transform: scaleY(1); }
              }
            `}</style>
          </div>

          {/* Playback controls */}
          <div className="p-6 border-b border-[#00FF41]/10 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                {/* Play / Eval */}
                <button
                  type="button"
                  onClick={handleEval}
                  disabled={isIniting}
                  title="Evaluar (Ctrl+Enter)"
                  className={`w-12 h-12 flex items-center justify-center rounded-full transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-wait ${
                    isPlaying
                      ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(52,211,153,0.4)]'
                      : 'bg-[#00FF41] text-black shadow-[0_0_15px_rgba(0,255,65,0.4)]'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isIniting ? 'hourglass_top' : 'play_arrow'}
                  </span>
                </button>
                {/* Stop */}
                <button
                  type="button"
                  onClick={handleStop}
                  title="Detener (Ctrl+.)"
                  className="w-12 h-12 flex items-center justify-center border border-slate-700 text-slate-300 rounded-full hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-2xl">stop</span>
                </button>
              </div>

              {/* BPM display */}
              <div className="text-right font-['Space_Grotesk']">
                <div className="text-[10px] text-slate-500 uppercase mb-1 tracking-widest">Tempo</div>
                <div className="flex items-center gap-1 justify-end">
                  <button type="button" onClick={() => handleBpmChange(Math.max(40, bpm - 1))} className="text-slate-500 hover:text-white w-5 text-lg leading-none cursor-pointer select-none">−</button>
                  <span className="text-2xl font-bold text-white w-12 text-center tabular-nums">{bpm}</span>
                  <button type="button" onClick={() => handleBpmChange(Math.min(300, bpm + 1))} className="text-slate-500 hover:text-white w-5 text-lg leading-none cursor-pointer select-none">+</button>
                  <span className="text-xs text-[#00FF41] ml-1">BPM</span>
                </div>
              </div>
            </div>

            {/* BPM slider */}
            <div className="mt-4">
              <input
                type="range"
                min={40}
                max={200}
                value={bpm}
                onChange={e => handleBpmChange(Number(e.target.value))}
                className="w-full accent-[#00FF41] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-600 mt-1">
                <span>40</span><span>120</span><span>200</span>
              </div>
            </div>
          </div>

          {/* Effects grid */}
          <div className="p-6 flex-1">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 font-['Space_Grotesk']">Parámetros rápidos</h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Swing */}
              <div className="bg-[#0A0A0B] p-3 border border-slate-800 rounded col-span-2">
                <div className="flex justify-between text-[10px] text-slate-500 uppercase mb-2 font-['Space_Grotesk']">
                  <span>Swing</span><span className="text-[#00FF41]">25%</span>
                </div>
                <div className="h-1 bg-slate-800 w-full rounded-full overflow-hidden">
                  <div className="h-full bg-[#00FF41] w-1/4 transition-all"></div>
                </div>
              </div>
              <div className="bg-[#0A0A0B] p-3 border border-slate-800 rounded">
                <div className="text-[10px] text-slate-500 uppercase mb-1 font-['Space_Grotesk']">Quantize</div>
                <div className="text-xs text-cyan-400 font-bold">1/16 Grid</div>
              </div>
              <div className="bg-[#0A0A0B] p-3 border border-slate-800 rounded">
                <div className="text-[10px] text-slate-500 uppercase mb-1 font-['Space_Grotesk']">Master Vol</div>
                <div className="text-xs text-[#00FF41] font-bold">0 dB</div>
              </div>
            </div>

            {/* Save track button */}
            <button
              type="button"
              className="mt-6 w-full py-3 border border-[#00FF41]/20 text-[#00FF41] text-xs font-bold uppercase tracking-widest font-['Space_Grotesk'] hover:bg-[#00FF41]/10 transition-all flex items-center justify-center gap-2"
              onClick={handleSaveTrack}
            >
              <span className="material-symbols-outlined text-sm">save</span>
              Guardar pista
            </button>
          </div>
        </section>
      </div>

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
        {/* FOOTER EXTENDIDO */}
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded border flex items-center gap-2 transition-colors ${
            isPlaying
              ? 'bg-[#00FF41]/5 border-[#00FF41]/20'
              : 'bg-slate-800/30 border-slate-700/30'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isPlaying ? 'bg-[#00FF41]' : 'bg-slate-600'}`}></span>
            <span className={`text-[10px] font-code-block transition-colors ${isPlaying ? 'text-[#00FF41]' : 'text-slate-600'}`}>
              {isPlaying ? 'ENGINE ACTIVE' : 'ENGINE IDLE'}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
