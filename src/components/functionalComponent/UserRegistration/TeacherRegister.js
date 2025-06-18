import React, { useState } from 'react';
import './UserRegistration.css';


const CrearUsuario = () => {
    const [dni, setDni] = useState('');
    const [nombre, setNombre] = useState('');
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación de campos
        if (!dni || !nombre || !mail || !password) {
            setError('Todos los campos son requeridos.');
            return;
        }

        // Construir los datos a enviar al backend
        const datosUsuario = {
            dni: parseInt(dni),
            nombre,
            password,
            mail,
        };


        try {
            const response = await fetch('http://localhost:3001/api/crear-profesor-nuevo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datosUsuario),
            });

            const result = await response.json();

            if (response.ok) {
                setMensaje('Usuario creado correctamente.');
                setError('');
            } else {
                setError(result.error || 'Hubo un error al crear el usuario.');
                setMensaje('');
            }
        } catch (error) {
            setError('Error al conectar con el servidor.');
            setMensaje('');
        }
    };

    return (
        <div className="user-registration">
            <form onSubmit={handleSubmit}>
                <div className='MarcoFormulario'>
                    <div>
                        <label>Dni:</label>
                        <input
                            type="text"
                            value={dni}
                            onChange={(e) => setDni(e.target.value)}
                            required
                            placeholder='12345678'
                            maxLength={8}
                        />
                    </div>
                    <div>
                        <label>Nombre:</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            placeholder='Juan Perez'
                        />
                    </div>
                    <div>
                    <label>Correo:</label>
                        <input
                            type="mail"
                            value={mail}
                            onChange={(e) => setMail(e.target.value)}
                            required
                            placeholder='correo@example.com'
                        />
                    </div>
                    <div>
                        <label>Contraseña:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder='Ingrese una nueva clave'
                        />
                    </div>
                </div>
                <button type="submit" className='BotonCrearUser'>Crear Usuario</button>
            </form>

            {mensaje && <p className="success">{mensaje}</p>}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default CrearUsuario;
