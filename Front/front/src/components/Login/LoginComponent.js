import React, { useState } from 'react';
import axios from 'axios';
import './login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => { 
    const [dni, setDni] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate(); 

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            const response = await axios.post('http://localhost:3001/api/auth/login', { dni, password });
            const { token } = response.data;

            localStorage.setItem('token', token);

            setSuccessMessage('Inicio de sesión exitoso');

            navigate('/welcome'); 
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || 'Error en el inicio de sesión');
            } else {
                setError('Error en el servidor');
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>DNI:</label>
                    <input type="text" value={dni} onChange={(e) => setDni(e.target.value)} required />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Iniciar Sesión</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </div>
    );
};

export default Login;
