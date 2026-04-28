import { useState } from 'react';
// Importamos las funciones directamente de @strudel/core
import { note, s } from '@strudel/core';
import { getContext } from '@strudel/web';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async () => {
    // 1. Despertar el audio
    const ctx = getContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    // 2. Usar la API funcional en lugar de strings
    note("C3 E3 G3 B3 C4")
      .s("triangle")
      .decay(0.2)
      .play(); // .play() inicia la secuencia inmediatamente

    setIsPlaying(true);
    console.log("Reproduciendo escala funcional...");
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif', color: '#333' }}>
      <h1>🎹 Strudel + Raspberry Pi 5</h1>
      <p>Estado del audio: <strong>{isPlaying ? '✅ Sonando' : '🤫 Silencio'}</strong></p>
      
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
        {isPlaying ? '🎶 Reproduciendo...' : 'Lanzar Escala'}
      </button>

      <div style={{ marginTop: '30px' }}>
        <small>Arquitectura: React -> Strudel Core -> Web Audio API</small>
      </div>
    </div>
  );
}

export default App;