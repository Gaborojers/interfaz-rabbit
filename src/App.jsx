import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

function App() {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Establecer conexión WebSocket
    const newSocket = io('http://localhost:3004');
    setSocket(newSocket);

    return () => {
      // Limpiar suscripciones cuando el componente se desmonte
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Suscribirse al evento "mensajeServidor"
    socket.on('mensajeServidor', (message) => {
      console.log('Mensaje recibido del servidor:', message);
      setNotifications((prevNotifications) => [...prevNotifications, message]);
    });

    return () => {
      // Limpiar suscripciones cuando el componente se desmonte
      socket.off('mensajeServidor');
    };
  }, [socket]);

  const handleClick = async () => {
    const name = 'Takis';
    const description = 'Sabrita';
    const price = 15;

    try {
      await axios.post("http://localhost:3000/productos", {
        name,
        description,
        price
      });
    } catch (error) {
      console.error('Error al crear el producto:', error);
    }
  };

  return (
    <div>
      <h1>Crear Nuevo Producto</h1>
      <button onClick={handleClick}>Crear Producto</button>
      <div>
        <h2>Notificaciones recibidas:</h2>
        <ul>
          {notifications.map((message, index) => (
            <div key={index}> 
              <li>Producto creado exitosamente. Costo del producto: ${message.price}</li>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
