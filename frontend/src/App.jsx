import { useState } from 'react';
// Importamos las funciones directamente desde @strudel/web para evitar duplicados
import { note, webaudio } from '@strudel/web';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async () => {
    try {
      // 1. Inicializamos el audio lo que despierta el AudioContext internamente)
      await webaudio.init();

      // 2. Ejecutamos la escala
      // Usamos .s("triangle") porque no requiere descargar archivos de internet
      note("C3 E3 G3 B3 C4").s("triangle").play();

      setIsPlaying(true);
      console.log("🚀 Motor de audio Strudel iniciado con éxito");
    } catch (error) {
      console.error("❌ Error al iniciar el audio:", error);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif', color: '#333' }}>
      <h1>🎹 TFG: Strudel en Raspberry Pi 5</h1>
      <p>Estado: <strong>{isPlaying ? '✅ Sonando' : '🤫 Silencio'}</strong></p>
      
      <button 
        onClick={handlePlay}
        style={{
          padding: '20px 40px',
          fontSize: '1.5rem',
          backgroundColor: '#6200ee',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        {isPlaying ? '🎶 ¡A tope!' : 'Lanzar Música'}
      </button>

      <div style={{ marginTop: '30px' }}>
        <small>Arquitectura: React - Strudel Web - Nginx</small>
      </div>
    </div>
  );
}

export default App;