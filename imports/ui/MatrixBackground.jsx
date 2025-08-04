import React, { useEffect, useRef } from 'react';

// Componente de fondo con efecto de matriz de código
const MatrixBackground = () => {
  const canvasRef = useRef(null); // Referencia al elemento canvas

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // Asegurarse de que el canvas existe

    const ctx = canvas.getContext('2d'); // Contexto de renderizado 2D

    // Ajustar el tamaño del canvas al tamaño de la ventana
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Caracteres que se mostrarán en la lluvia de código
    const katakana = 'アァカサタナハマヤラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const chars = katakana + latin + nums; // Combinación de caracteres

    const fontSize = 16; // Tamaño de la fuente de los caracteres
    // Calcular el número de columnas basado en el ancho del canvas y el tamaño de la fuente
    const columns = canvas.width / fontSize;

    // Un array para cada columna, representando la posición 'y' de cada gota
    const drops = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = 1; // Inicializar cada gota en la parte superior
    }

    // Función principal de dibujo y animación
    const draw = () => {
      // Fondo semi-transparente para el efecto de rastro
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Color de los caracteres (verde Matrix)
      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`; // Fuente de los caracteres

      // Dibujar cada "gota" de la lluvia
      for (let i = 0; i < drops.length; i++) {
        // Seleccionar un carácter aleatorio
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        // Dibujar el carácter en la posición (x, y)
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Mover la gota hacia abajo
        // Si la gota ha llegado al final del canvas y un número aleatorio es < 0.975,
        // reiniciarla en la parte superior para crear un efecto continuo.
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        // Incrementar la posición 'y' de la gota
        drops[i]++;
      }
    };

    // Función para manejar el redimensionamiento de la ventana
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Recalcular columnas y reiniciar gotas para adaptarse al nuevo tamaño
      const newColumns = canvas.width / fontSize;
      const newDrops = [];
      for (let x = 0; x < newColumns; x++) {
        newDrops[x] = 1;
      }
      drops.length = 0; // Vaciar el array existente
      drops.push(...newDrops); // Llenar con las nuevas gotas
    };

    // Iniciar el bucle de animación
    const animationInterval = setInterval(draw, 33); // Aproximadamente 30 FPS

    // Escuchar el evento de redimensionamiento de la ventana
    window.addEventListener('resize', handleResize);

    // Función de limpieza al desmontar el componente
    return () => {
      clearInterval(animationInterval); // Detener la animación
      window.removeEventListener('resize', handleResize); // Eliminar el listener
    };
  }, []); // El array vacío asegura que el efecto se ejecute solo una vez al montar

  return (
    <canvas
      ref={canvasRef} // Asignar la referencia al elemento canvas
      className="absolute inset-0 z-0" // Posicionar el canvas como fondo
      style={{ backgroundColor: 'black' }} // Asegurar un fondo negro inicial
    ></canvas>
  );
};

export default MatrixBackground;
