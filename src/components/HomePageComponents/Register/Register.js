import React, { useState } from "react";
import { Link } from "react-router-dom";
import transition from '../../../transition';
import { useNavigate } from "react-router-dom"; // ✅ Importamos useNavigate
import './Register.css';
import axios from "axios";

const Register = () => {
    const [nombre, setNombre] = useState('');
    const [dni, setDni] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false); 
    const navigate = useNavigate(); // ✅ Inicializamos useNavigate

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null); // Limpiar errores anteriores

        try {
            await axios.post('http://localhost:3001/api/auth/register', { dni, password, nombre });

            // ✅ Mostramos el popup de éxito
            setShowSuccessPopup(true);
            setNombre('');
            setDni('');
            setPassword('');

        } catch (err) {
            setShowErrorPopup(true);
            console.log(err);
        }
    };

    return (
        <div>
            <form className="formularioRegister" onSubmit={handleRegister}>
                <div className='ContentRegister'>
                    <h2>Registrarse</h2>
                    <label>Ingrese su Nombre</label>
                    <input
                        className='NameInput'
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ej: Juan Perez"
                        required
                    />
                    <label>Ingrese su DNI</label>
                    <input
                        className='DniInput'
                        type="text"
                        value={dni}
                        onChange={(e) => setDni(e.target.value)}
                        placeholder="DNI"
                        required
                    />
                    <label>Ingrese una clave</label>
                    <input
                        className='PasswordInput'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        required
                    />
                     {/* ✅ Pop-up de éxito */}
            {showSuccessPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h4>✔</h4>
                        <h3>Registro Exitoso</h3>
                        <p>Te has registrado correctamente</p>
                        <Link to={'/Login'}>
                            <button className="popup-btn">OK</button>
                        </Link>
                    </div>
                </div>
            )}

            {/* 🚨 Pop-up de error */}
            {showErrorPopup && (
                <div className="popup-overlay">
                    <div className="popup-content error-popup">
                        <h4>❌</h4>
                        <h3>Error al Registrarse</h3>
                        <p>Ocurrio un error al registrar el usuario. Intenta nuevamente.</p>
                        <button className="popup-btn" onClick={() => setShowErrorPopup(false)}>
                            OK
                        </button>
                    </div>
                </div>
            )}
                    <button type="submit" className='BTNRegister'>Registrar Usuario</button>
                </div>
            </form>

           
        </div>
    );
};

export default transition(Register);
