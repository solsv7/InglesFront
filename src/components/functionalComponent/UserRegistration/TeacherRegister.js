import React, { useState } from 'react';
import { FaUser, FaIdCard, FaEnvelope, FaLock, FaChalkboardTeacher, FaSave } from 'react-icons/fa';
import './UserRegistration.css';

const CrearUsuario = () => {
    const [formData, setFormData] = useState({
        dni: '',
        nombre: '',
        mail: '',
        password: ''
    });
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');

        // Validación de campos
        if (!formData.dni || !formData.nombre || !formData.mail || !formData.password) {
            setError('Todos los campos son requeridos.');
            return;
        }

        // Validar DNI (solo números, 7-8 dígitos)
        if (!/^\d{7,8}$/.test(formData.dni)) {
            setError('El DNI debe contener entre 7 y 8 dígitos numéricos.');
            return;
        }

        // Validar email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.mail)) {
            setError('Por favor, ingresa un correo electrónico válido.');
            return;
        }

        // Validar contraseña (mínimo 6 caracteres)
        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        setIsSubmitting(true);

        // Construir los datos a enviar al backend
        const datosUsuario = {
            dni: parseInt(formData.dni),
            nombre: formData.nombre.trim(),
            password: formData.password,
            mail: formData.mail.trim(),
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/crear-profesor-nuevo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datosUsuario),
            });

            const result = await response.json();

            if (response.ok) {
                setMensaje('✅ Profesor creado correctamente.');
                setError('');
                // Reset form
                setFormData({
                    dni: '',
                    nombre: '',
                    mail: '',
                    password: ''
                });
            } else {
                setError(result.error || '❌ Hubo un error al crear el profesor.');
                setMensaje('');
            }
        } catch (error) {
            setError('❌ Error al conectar con el servidor.');
            setMensaje('');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="user-registration-form">
            <div className="form-content">
                <div className="form-section">
                    <label className="section-label">
                        <FaIdCard className="label-icon" />
                        DNI del Profesor
                    </label>
                    <div className="input-wrapper">
                        <FaIdCard className="input-icon" />
                        <input
                            name="dni"
                            type="text"
                            value={formData.dni}
                            onChange={handleChange}
                            className="modern-input"
                            required
                            placeholder="12345678"
                            maxLength={8}
                            pattern="[0-9]*"
                            inputMode="numeric"
                        />
                    </div>
                    <div className="input-hint">
                        8 dígitos sin puntos ni espacios
                    </div>
                </div>

                <div className="form-section">
                    <label className="section-label">
                        <FaUser className="label-icon" />
                        Nombre Completo
                    </label>
                    <div className="input-wrapper">
                        <FaUser className="input-icon" />
                        <input
                            name="nombre"
                            type="text"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="modern-input"
                            required
                            placeholder="Juan Carlos Pérez"
                        />
                    </div>
                </div>

                <div className="form-section">
                    <label className="section-label">
                        <FaEnvelope className="label-icon" />
                        Correo Electrónico
                    </label>
                    <div className="input-wrapper">
                        <FaEnvelope className="input-icon" />
                        <input
                            name="mail"
                            type="email"
                            value={formData.mail}
                            onChange={handleChange}
                            className="modern-input"
                            required
                            placeholder="profesor@instituto.com"
                        />
                    </div>
                </div>

                <div className="form-section">
                    <label className="section-label">
                        <FaLock className="label-icon" />
                        Contraseña
                    </label>
                    <div className="input-wrapper">
                        <FaLock className="input-icon" />
                        <input
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="modern-input"
                            required
                            placeholder="Mínimo 6 caracteres"
                            minLength={6}
                        />
                    </div>
                    <div className="input-hint">
                        La contraseña debe tener al menos 6 caracteres
                    </div>
                </div>

                {mensaje && (
                    <div className="message success">
                        <div className="message-icon">✅</div>
                        {mensaje}
                    </div>
                )}

                {error && (
                    <div className="message error">
                        <div className="message-icon">⚠️</div>
                        {error}
                    </div>
                )}

                <button 
                    type="submit" 
                    className="submit-button modern-button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    <FaChalkboardTeacher className="button-icon" />
                    {isSubmitting ? 'Creando Profesor...' : 'Crear Profesor'}
                </button>
            </div>
        </div>
    );
};

export default CrearUsuario;