import React, { useState, useContext } from 'react';
import transition from '../../../transition';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { UserContext } from '../../functionalComponent/UserContext/UserContext';
import { Link } from 'react-router-dom';

const LoginComponent = () => {
    const [dni, setDni] = useState('');
    const [password, setPassword] = useState('');
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const navigate = useNavigate();
    const { setUserName } = useContext(UserContext); // Usar el contexto

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://inglesback-stx6.onrender.com/api/auth/login', { dni, password });
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
            setShowErrorPopup(true);
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
                    onChange={(e) => {setDni(e.target.value);setShowErrorPopup(''); }}
                    placeholder="DNI"
                    required
                />
                <label>Ingrese su contraseña</label>
                <input
                className='PasswordInput'
                    type="password"
                    value={password}
                    onChange={(e) => {setPassword(e.target.value);setShowErrorPopup(''); }}
                    placeholder="Contraseña"
                    required
                />
                {showErrorPopup && (
                <div className="popup-overlay">
                    <div className="popup-content error-popup">
                        <h4>❌</h4>
                        <h3>Error al Ingresar</h3>
                        <p>El DNI o clave son incorrectos. Intenta nuevamente.</p>
                        <button className="popup-btn" onClick={() => setShowErrorPopup(false)}>
                            OK
                        </button>
                    </div>
                </div>
            )}
                <button type="submit" className='BTNSignIn'>Iniciar sesion</button>
                </div>
                <div className='register-part'>
                    <h4>¿No posees una cuenta? </h4><h4><Link to="/Register" id='link-register'>Registrate</Link></h4>
                </div>
            </form>
        </div>
    );
};

export default transition(LoginComponent);