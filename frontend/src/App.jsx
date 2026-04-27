import { useState } from 'react';
import { evaluate } from '@strudel.js/core';
import '@strudel.js/web'; // Inicializamos el motor de audio en el navegador

function App() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    // En el patrón de Strudel: Una escala simple con un sintetizador tipo piano
    const code = 'note("C3 E3 G3 B3 C4").s("triangle").decay(0.2).jux(rev)';
    
    evaluate(code);
    setIsPlaying(true);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
      <h1>🎓 TFG: Aprendizaje Musical</h1>
      <p>Pulsa el botón para probar el motor de <strong>Strudel.js</strong></p>
      
      <button 
        onClick={handlePlay}
        style={{
          padding: '15px 30px',
          fontSize: '1.2rem',
          backgroundColor: isPlaying ? '#4CAF50' : '#008CBA',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        {isPlaying ? '¡Sonando! 🎵' : 'Reproducir Escala'}
      </button>

      <div style={{ marginTop: '20px', color: '#666' }}>
        <small>Código ejecutado: <code>note("C3 E3 G3 B3 C4").s("triangle")</code></small>
      </div>
    </div>
  );
}

export default App;