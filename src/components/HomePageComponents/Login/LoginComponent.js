import React, { useState, useContext } from 'react';
import transition from '../../../transition';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { UserContext } from '../../functionalComponent/UserContext/UserContext';
import { Link } from 'react-router-dom';
import { FaUser, FaLock, FaExclamationTriangle, FaSignInAlt } from 'react-icons/fa';

const LoginComponent = () => {
    const [dni, setDni] = useState('');
    const [password, setPassword] = useState('');
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUserName } = useContext(UserContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { dni, password });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            console.log('datos que obtiene: ', user)

            setUserName(user.nombre);

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
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='login-container'>
            <div className='login-background'>
                <div className='login-content'>
                    <form onSubmit={handleLogin} className="login-form">
                        <div className='login-header'>
                            <div className='login-icon'>
                                <FaSignInAlt />
                            </div>
                            <h2>Iniciar Sesión</h2>
                            <p>Ingresa a tu cuenta para continuar</p>
                        </div>

                        <div className='form-inputs'>
                            <div className='input-group'>
                                <label htmlFor="dni">
                                    DNI
                                </label>
                                <input
                                    id="dni"
                                    type="text"
                                    value={dni}
                                    onChange={(e) => {setDni(e.target.value); setShowErrorPopup(false); }}
                                    placeholder="Ingresa tu DNI"
                                    required
                                    className='login-input'
                                />
                            </div>

                            <div className='input-group'>
                                <label htmlFor="password">
                                    Contraseña
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => {setPassword(e.target.value); setShowErrorPopup(false); }}
                                    placeholder="Ingresa tu contraseña"
                                    required
                                    className='login-input'
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className='login-btn'
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className='loading-spinner'></div>
                                    Iniciando sesión...
                                </>
                            ) : (
                                <>
                                    <FaSignInAlt className='btn-icon' />
                                    Iniciar sesión
                                </>
                            )}
                        </button>

                        <div className='login-footer'>
                            <p>¿No posees una cuenta?</p>
                            <Link to="/Register" className='register-link'>
                                Regístrate aquí
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* Popup de Error */}
            {showErrorPopup && (
                <div className="error-popup-overlay">
                    <div className="error-popup-content">
                        <div className="error-popup-icon">
                            <FaExclamationTriangle />
                        </div>
                        <h3>Error al Ingresar</h3>
                        <p>El DNI o contraseña son incorrectos. Intenta nuevamente.</p>
                        <button 
                            className="error-popup-btn" 
                            onClick={() => setShowErrorPopup(false)}
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default transition(LoginComponent);