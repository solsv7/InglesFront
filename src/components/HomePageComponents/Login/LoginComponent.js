import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { UserContext } from '../../functionalComponent/UserContext/UserContext';
import { Link } from 'react-router-dom';

const LoginComponent = () => {
    const [dni, setDni] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { setUserName } = useContext(UserContext); // Usar el contexto

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/auth/login', { dni, password });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            console.log('datos que obtiene: ', user)

            setUserName(user.nombre); // Actualizar el nombre del usuario en el contexto

            // Redirigir según el rol del usuario
            if (user.rol === 1) {
                navigate('/');
            } else if (user.rol === 2) {
                navigate('/');
            } else if (user.rol === 3) {
                navigate('/');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError('Usuario o Contraseña incorrectos');
            console.log(err);
        }
    };

    return (
        <div className='ContenidoLogin'>
            <form onSubmit={handleLogin} className="formularioLogin">
                <div className='ContentLogin'>
                <h2>Iniciar Sesion</h2>
                <label>Ingrese su DNI</label>
                <input
                className='DniInput'
                    type="text"
                    value={dni}
                    onChange={(e) => {setDni(e.target.value);setError(''); }}
                    placeholder="DNI"
                    required
                />
                <label>Ingrese su contraseña</label>
                <input
                className='PasswordInput'
                    type="password"
                    value={password}
                    onChange={(e) => {setPassword(e.target.value);setError(''); }}
                    placeholder="Contraseña"
                    required
                />
                {error && <div className="msgError">{error}</div>}
                <button type="submit" className='BTNSignIn'>Iniciar sesion</button>
                </div>
                <div className='register-part'>
                    <h4>¿No posees una cuenta? </h4><h4><Link to="/Register" id='link-register'>Registrate</Link></h4>
                </div>
            </form>
        </div>
    );
};

export default LoginComponent;