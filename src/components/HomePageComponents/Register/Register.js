import React, { useState } from "react";
import { Link } from "react-router-dom";
import transition from '../../../transition';
import { useNavigate } from "react-router-dom";
import './Register.css';
import axios from "axios";
import { FaUser, FaIdCard, FaLock, FaCheckCircle, FaExclamationTriangle, FaUserPlus } from "react-icons/fa";

const Register = () => {
    const [nombre, setNombre] = useState('');
    const [dni, setDni] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false); 
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, { dni, password, nombre });
            
            setShowSuccessPopup(true);
            setNombre('');
            setDni('');
            setPassword('');

        } catch (err) {
            setShowErrorPopup(true);
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-background">
                <div className="register-content">
                    <form className="register-form" onSubmit={handleRegister}>
                        <div className='register-header'>
                            <div className='register-icon'>
                                <FaUserPlus />
                            </div>
                            <h2>Crear Cuenta</h2>
                            <p>Regístrate para comenzar a usar la plataforma</p>
                        </div>

                        <div className='form-inputs'>
                            <div className='input-group'>
                                <label htmlFor="nombre">
                                    Nombre Completo
                                </label>
                                <input
                                    id="nombre"
                                    className='register-input'
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    placeholder="Ej: Juan Pérez"
                                    required
                                />
                            </div>

                            <div className='input-group'>
                                <label htmlFor="dni">
                                    DNI
                                </label>
                                <input
                                    id="dni"
                                    className='register-input'
                                    type="text"
                                    value={dni}
                                    onChange={(e) => setDni(e.target.value)}
                                    placeholder="Ingresa tu DNI"
                                    required
                                />
                            </div>

                            <div className='input-group'>
                                <label htmlFor="password">
                                    Contraseña
                                </label>
                                <input
                                    id="password"
                                    className='register-input'
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Crea una contraseña segura"
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className='register-btn'
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    Creando cuenta...
                                </>
                            ) : (
                                <>
                                    <FaUserPlus className='btn-icon' />
                                    Registrar Usuario
                                </>
                            )}
                        </button>

                        <div className='register-footer'>
                            <p>¿Ya tienes una cuenta?</p>
                            <Link to="/Login" className='login-link'>
                                Inicia sesión aquí
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* Popup de Éxito */}
            {showSuccessPopup && (
                <div className="success-popup-overlay">
                    <div className="success-popup-content">
                        <div className="success-popup-icon">
                            <FaCheckCircle />
                        </div>
                        <h3>¡Registro Exitoso!</h3>
                        <p>Tu cuenta ha sido creada correctamente</p>
                        <Link to="/Login">
                            <button className="success-popup-btn">
                                Ir al Login
                            </button>
                        </Link>
                    </div>
                </div>
            )}

            {/* Popup de Error */}
            {showErrorPopup && (
                <div className="error-popup-overlay">
                    <div className="error-popup-content">
                        <div className="error-popup-icon">
                            <FaExclamationTriangle />
                        </div>
                        <h3>Error al Registrarse</h3>
                        <p>Ocurrió un error al registrar el usuario. Intenta nuevamente.</p>
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

export default transition(Register);