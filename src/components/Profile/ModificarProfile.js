import React, { useEffect, useState } from "react";
import transition from "../../transition";
import { useNavigate } from "react-router-dom";
import './Modificar.css';
import axios from "axios";
import Swal from 'sweetalert2';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaUserFriends, 
  FaSave, 
  FaArrowLeft,
  FaCheck,
  FaPalette
} from 'react-icons/fa';

// Importar imágenes
import Imagen1 from '../../images/imgsPerfil/first-pic.png';
import Imagen2 from '../../images/imgsPerfil/second-pic.png';
import Imagen3 from '../../images/imgsPerfil/third-pic.png';
import Imagen4 from '../../images/imgsPerfil/fourth-pic.png';
import Imagen5 from '../../images/imgsPerfil/fifth-pic.png';
import Imagen6 from '../../images/imgsPerfil/sixth-pic.png';
import Imagen7 from '../../images/imgsPerfil/seventh-pic.png';
import Imagen8 from '../../images/imgsPerfil/eighth-pic.png';

const ModificarProfile = () => {
    const [profileData, setProfileData] = useState(null);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [mail, setMail] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [parentContact, setParentContact] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const navigate = useNavigate();

    let redirectPath = "/";
    if (user.rol === 1) redirectPath = "/home-admin";
    if (user.rol === 2) redirectPath = "/home-teacher";
    if (user.rol === 3) redirectPath = "/home-student";

    const photoMap = [
        Imagen1, Imagen2, Imagen3,
        Imagen4, Imagen5, Imagen6,
        Imagen7, Imagen8,
    ];

    useEffect(() => {
        const fetchProfileInfo = async () => {
            const params = { 
                id_rol: user.rol, 
                id: user.rol === 1 ? user.id : user.rol === 2 ? user.id_profesor : user.id_alumno 
            };

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/perf-info`, { params });
                const profile = response.data[0];
                setProfileData(profile);
                setPhotoIndex(profile?.id_foto || 0);
                setMail(profile?.mail || "");
                setContactNumber(profile?.whatsapp || "");
                setParentContact(profile?.whatsapp_adulto || "");
            } catch (error) {
                console.error("Error al obtener la información en modificar:", error);
            }
        };

        fetchProfileInfo();
    }, [user.id_alumno, user.id_profesor, user.rol, user.id]);

    const handlePhotoSelect = (index) => {
        setPhotoIndex(index);
    };

    const handleSave = async () => {
        if (!mail.trim() || !contactNumber.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos requeridos',
                text: 'El correo y número de contacto son obligatorios.',
                confirmButtonColor: '#667eea'
            });
            return;
        }

        setIsLoading(true);
        const updatedData = {
            id_usuario: user.id,
            id_foto: photoIndex,
            mail: mail.trim(),
            whatsapp: contactNumber.trim(),
            whatsapp_adulto: parentContact?.trim() || null,     
        };

        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/api/actualizar-perfil`, updatedData);

            Swal.fire({
                icon: 'success',
                title: '¡Perfil actualizado!',
                text: 'Tu perfil fue modificado correctamente.',
                confirmButtonColor: '#667eea',
                confirmButtonText: 'Continuar',
                background: '#fff',
                color: '#2d3748'
            }).then(() => navigate(redirectPath));

        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el perfil. Intenta más tarde.',
                confirmButtonColor: '#e53e3e',
                background: '#fff',
                color: '#2d3748'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(redirectPath);
    };

    return (
        <div className="modificar-page-wrapper">
            <div className="modificar-container">
                <div className="modificar-header">
                    <h1 className="modificar-main-title">Actualizar Perfil</h1>
                    <p className="modificar-subtitle">Modifica tu información personal y foto de perfil</p>
                </div>

                <div className="modificar-content">
                    <div className="modificar-card">
                        <div className="card-header">
                            <FaUser className="card-icon" />
                            <h3>Información Personal</h3>
                        </div>

                        <div className="card-content">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">
                                        <FaEnvelope className="label-icon" />
                                        Correo Electrónico
                                    </label>
                                    <div className="input-wrapper">
                                        <FaEnvelope className="input-icon" />
                                        <input
                                            type="email"
                                            value={mail}
                                            onChange={(e) => setMail(e.target.value)}
                                            className="form-input"
                                            placeholder="ejemplo@correo.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <FaPhone className="label-icon" />
                                        Número de Contacto (WhatsApp)
                                    </label>
                                    <div className="input-wrapper">
                                        <FaPhone className="input-icon" />
                                        <input
                                            type="text"
                                            value={contactNumber}
                                            onChange={(e) => setContactNumber(e.target.value)}
                                            className="form-input"
                                            placeholder="+54 9 11 1234-5678"
                                            required
                                        />
                                    </div>
                                </div>

                                {user.rol === 3 && (
                                    <div className="form-group">
                                        <label className="form-label">
                                            <FaUserFriends className="label-icon" />
                                            Número del Adulto Responsable
                                        </label>
                                        <div className="input-wrapper">
                                            <FaUserFriends className="input-icon" />
                                            <input
                                                type="text"
                                                value={parentContact}
                                                onChange={(e) => setParentContact(e.target.value)}
                                                className="form-input"
                                                placeholder="+54 9 11 1234-5678 (opcional)"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="modificar-card">
                        <div className="card-header">
                            <FaPalette className="card-icon" />
                            <h3>Foto de Perfil</h3>
                        </div>

                        <div className="card-content">
                            <p className="photo-instruction">Selecciona una foto para tu perfil:</p>
                            <div className="photos-grid">
                                {photoMap.map((img, index) => (
                                    <div 
                                        key={index}
                                        className={`photo-card ${index === photoIndex ? 'selected' : ''}`}
                                        onClick={() => handlePhotoSelect(index)}
                                    >
                                        <img
                                            src={img}
                                            alt={`Foto de perfil ${index + 1}`}
                                            className="photo-image"
                                        />
                                        {index === photoIndex && (
                                            <div className="photo-selected">
                                                <FaCheck className="check-icon" />
                                            </div>
                                        )}
                                        <div className="photo-overlay">
                                            <FaUser className="overlay-icon" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button 
                            onClick={handleCancel}
                            className="action-btn cancel-btn"
                            disabled={isLoading}
                        >
                            <FaArrowLeft className="btn-icon" />
                            Cancelar
                        </button>
                        <button 
                            onClick={handleSave}
                            className="action-btn save-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="loading-spinner-small"></div>
                            ) : (
                                <FaSave className="btn-icon" />
                            )}
                            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default transition(ModificarProfile);