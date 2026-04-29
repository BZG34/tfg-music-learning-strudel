import { useState, useEffect } from 'react';
import { note, initStrudel, stopAll } from '@strudel/web';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Inicializar Strudel al montar el componente
  useEffect(() => {
    initStrudel().then(() => {
      setIsInitialized(true);
      console.log("🎵 Strudel inicializado correctamente");
    });
  }, []);

  const handlePlay = async () => {
    if (!isInitialized) {
      console.warn("Strudel aún no está inicializado");
      return;
    }

    try {
      // Reproducir la escala usando triangle synth
      await note("C3 E3 G3 B3 C4").s("triangle").play();

      setIsPlaying(true);
      console.log("Motor de audio Strudel iniciado con éxito");
    } catch (error) {
      console.error("Error al iniciar el audio:", error);
    }
  };

  const handleStop = () => {
    try {
      stopAll();
      setIsPlaying(false);
      console.log("Audio detenido");
    } catch (error) {
      console.error("Error al detener el audio:", error);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif', color: '#333' }}>
      <h1>🎹 TFG: Strudel + Raspberry Pi 5</h1>
      <p>Estado del audio: <strong>{isPlaying ? '✅ Funcionando' : '🤫 En espera'}</strong></p>
      
      <button 
        onClick={handlePlay}
        style={{
          padding: '20px 40px',
          fontSize: '1.5rem',
          backgroundColor: '#00cc66',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        {isPlaying ? '🎶 ¡Sonando!' : 'Activar Sonido'}
      </button>

      <div style={{ marginTop: '30px' }}>
        <small>Infraestructura: React | Strudel | Nginx</small>
      </div>
    </div>
  );
}

export default App;