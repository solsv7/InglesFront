import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'

const LoginComponent = () => {
    const [dni, setDni] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/auth/login', { dni, password });
            const { token, studentId, studentName } = response.data; 
    
            localStorage.setItem('token', token);
            localStorage.setItem('studentId', studentId); 
            navigate('/home', { state: { studentName, studentId } }); 
        } catch (err) {
            setError('Error al iniciar sesión');
        }
    };
    
    

    return (
        <div>
            <form onSubmit={handleLogin} id='formularioLogin'>
                <input type="text" value={dni} onChange={(e) => setDni(e.target.value)} placeholder="DNI" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" required />
                {error && <div className='msgError'>{error}</div>}
                <button type="submit">Iniciar Sesión</button>
                
            </form>
        </div>
    );
};

export default LoginComponent;

