import React, { useEffect, useState } from "react";
import transition from "../../transition";
import { Link } from "react-router-dom";
import axios from "axios";
import './Profile.css';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaUserShield, 
  FaCreditCard, 
  FaCalendarAlt,
  FaEdit,
  FaKey,
  FaCog,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaUserTie
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

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [photo, setPhoto] = useState(Imagen1);
    const [cuotaInfo, setCuotaInfo] = useState(null);
    const [loadingCuota, setLoadingCuota] = useState(false);
    const [errorCuota, setErrorCuota] = useState(null);
    const user = JSON.parse(localStorage.getItem('user')) || {};

    useEffect(() => {
        const fetchProfileInfo = async () => {
            const params = { id_usuario: user.id };

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/perf-info`, { params });
                if (response.data[0]) {
                    setProfileData(response.data[0]);
                }
            } catch (error) {
                console.error('Error al obtener la información:', error);
            }
        };

        fetchProfileInfo();
    }, [user.id]);

    useEffect(() => {
        const fetchPhoto = () => {
            const photoMap = [
                Imagen1, Imagen2, Imagen3,
                Imagen4, Imagen5, Imagen6,
                Imagen7, Imagen8,
            ];
            setPhoto(photoMap[profileData?.id_foto] || Imagen1);
        };

        if (profileData?.id_foto !== undefined) {
            fetchPhoto();
        }
    }, [profileData?.id_foto]);

    // Efecto para obtener información de la cuota
    useEffect(() => {
        if (user.rol === 3 && user.id_alumno) {
            const fetchCuotaInfo = async () => {
                setLoadingCuota(true);
                setErrorCuota(null);
                try {
                    const today = new Date().toISOString().split('T')[0];
                    const response = await axios.get(
                        `${process.env.REACT_APP_API_URL}/api/cuotas/vigentes?id_alumno=${user.id_alumno}&fecha=${today}`
                    );
                    
                    if (response.data && response.data.length > 0) {
                        setCuotaInfo(response.data[0]);
                    } else {
                        setCuotaInfo({ 
                            mensaje: 'No tienes cuotas activas en este momento' 
                        });
                    }
                } catch (error) {
                    console.error('Error al obtener información de la cuota:', error);
                    setErrorCuota('Error al cargar información de la cuota');
                    setCuotaInfo({ 
                        mensaje: 'Error al obtener información de tu cuota' 
                    });
                } finally {
                    setLoadingCuota(false);
                }
            };
            fetchCuotaInfo();
        }
    }, [user.rol, user.id_alumno]);

    // Componente de información de cuota
    const CuotaInfoCard = () => {
        if (loadingCuota) {
            return (
                <div className="profile-loading">
                    <div className="loading-spinner"></div>
                    <p>Cargando información de cuota...</p>
                </div>
            );
        }
        
        if (errorCuota) {
            return (
                <div className="profile-card profile-error">
                    <div className="card-header">
                        <FaCreditCard className="card-icon" />
                        <h3>Estado de Cuota</h3>
                    </div>
                    <div className="card-content">
                        <p>{errorCuota}</p>
                    </div>
                </div>
            );
        }

        if (!cuotaInfo) {
            return null;
        }

        // Si hay un mensaje (no hay cuotas vigentes)
        if (cuotaInfo.mensaje) {
            return (
                <div className="profile-card profile-warning">
                    <div className="card-header">
                        <FaCreditCard className="card-icon" />
                        <h3>Estado de Cuota</h3>
                    </div>
                    <div className="card-content">
                        <p className="warning-message">No tienes cuotas activas</p>
                        <p className="warning-subtitle">Acércate a renovarla</p>
                    </div>
                </div>
            );
        }

        // Si hay datos de cuota
        const fechaVencimiento = new Date(cuotaInfo.fecha_vencimiento);
        const fechaFormateada = isNaN(fechaVencimiento.getTime()) 
            ? 'Fecha no disponible' 
            : fechaVencimiento.toLocaleDateString('es-ES');
        
        const diasRestantes = cuotaInfo.dias_restantes;
        const isUrgent = diasRestantes <= 7 || cuotaInfo.estado_pago === 'pendiente';

        return (
            <div className={`profile-card ${isUrgent ? 'profile-urgent' : 'profile-success'}`}>
                <div className="card-header">
                    <FaCreditCard className="card-icon" />
                    <h3>Tu Cuota Actual</h3>
                </div>
                <div className="card-content">
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Plan:</span>
                            <span className="info-value">{cuotaInfo.nombre_plan || 'No especificado'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Monto:</span>
                            <span className="info-value">${cuotaInfo.monto?.toLocaleString() || '0'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Estado:</span>
                            <span className={`status-badge status-${cuotaInfo.estado_pago?.toLowerCase() || 'unknown'}`}>
                                {cuotaInfo.estado_pago || 'No especificado'}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Vencimiento:</span>
                            <span className="info-value">{fechaFormateada}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Días restantes:</span>
                            <span className={`days-count ${diasRestantes <= 7 ? 'urgent' : ''}`}>
                                {diasRestantes}
                            </span>
                        </div>
                    </div>
                    {isUrgent && (
                        <Link to="/pagos" className="action-btn primary-btn">
                            {cuotaInfo.estado_pago === 'pendiente' ? 'Pagar Ahora' : 'Renovar Antes del Vencimiento'}
                        </Link>
                    )}
                </div>
            </div>
        );
    };

    // Obtener icono y título según el rol
    const getRoleInfo = () => {
        switch(user.rol) {
            case 1:
                return { icon: <FaUserShield />, title: "Administrador", color: "#dc2626" };
            case 2:
                return { icon: <FaChalkboardTeacher />, title: "Profesor", color: "#2563eb" };
            case 3:
                return { icon: <FaGraduationCap />, title: "Alumno", color: "#059669" };
            default:
                return { icon: <FaUser />, title: "Usuario", color: "#6b7280" };
        }
    };

    const roleInfo = getRoleInfo();

    return (
        <div className="profile-page-wrapper">
            <div className="profile-container">

                <div className="profile-layout">
                    {/* Sidebar */}
                    <aside className="profile-sidebar">
                        <div className="profile-card sidebar-card">
                            <div className="profile-avatar">
                                <img src={photo} alt="Perfil" className="avatar-image" />
                                <div className="avatar-overlay">
                                    <FaUser className="avatar-icon" />
                                </div>
                            </div>
                            
                            <div className="profile-info">
                                <h2 className="profile-name">{user.nombre}</h2>
                                <div className="profile-role">
                                    {roleInfo.icon}
                                    <span>{roleInfo.title}</span>
                                </div>
                            </div>

                            <nav className="profile-nav">
                                <Link to="/modificar" className="nav-link">
                                    <FaEdit className="nav-icon" />
                                    <span>Actualizar Datos</span>
                                </Link>
                                <Link to="/cambiar-clave" className="nav-link">
                                    <FaKey className="nav-icon" />
                                    <span>Cambiar Contraseña</span>
                                </Link>
                                <Link to="/configuracion" className="nav-link">
                                    <FaCog className="nav-icon" />
                                    <span>Configuración</span>
                                </Link>
                            </nav>
                        </div>
                    </aside>

                    {/* Contenido principal */}
                    <main className="profile-content">
                        <div className="profile-card main-card">
                            <div className="card-header">
                                <FaUser className="card-icon" />
                                <h3>Información Personal</h3>
                            </div>
                            <div className="card-content">
                                <div className="info-grid">
                                    <div className="info-item">
                                        <FaEnvelope className="info-icon" />
                                        <div className="info-content">
                                            <span className="info-label">Correo Electrónico</span>
                                            <span className="info-value">{profileData?.mail || 'Sin información'}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="info-item">
                                        <FaPhone className="info-icon" />
                                        <div className="info-content">
                                            <span className="info-label">WhatsApp</span>
                                            <span className="info-value">{profileData?.whatsapp || 'Sin información'}</span>
                                        </div>
                                    </div>
                                    
                                    {user.rol === 3 && (
                                        <div className="info-item">
                                            <FaUserTie className="info-icon" />
                                            <div className="info-content">
                                                <span className="info-label">Adulto Responsable</span>
                                                <span className="info-value">{profileData?.whatsapp_adulto || 'Sin información'}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Información de cuota solo para alumnos */}
                        {user.rol === 3 && <CuotaInfoCard />}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default transition(Profile);