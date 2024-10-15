// Welcome.js
import React from 'react';
import { useLocation } from 'react-router-dom';

const Welcome = () => {
    const location = useLocation();
    const { userName } = location.state || {}; // Obtener el nombre del usuario desde el estado

    return (
        <div className="welcome-container">
            <h1>Bienvenido, {userName || 'Usuario'}!</h1>
            <p>¡Gracias por iniciar sesión!</p>
        </div>
    );
};

export default Welcome;
