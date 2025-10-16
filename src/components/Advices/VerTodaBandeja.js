import React, { useState, useEffect } from "react";
import { 
  FaEnvelope, 
  FaUser, 
  FaUsers, 
  FaChalkboardTeacher, 
  FaCalendarAlt,
  FaBell,
  FaInfoCircle
} from 'react-icons/fa';
import './VerTodaBandeja.css';
import axios from "axios";

const Avisos = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchMessages = async () => {
            setIsLoading(true);
            setError(null);
            const params = { id_alumno: user.id_alumno, validation: "todos" };

            console.log("Parámetros recolectados:", params);
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/getMsg`, { params });
                console.log("Información obtenida en el front después de la API:", response.data);

                // Ordenar mensajes por fecha (más recientes primero)
                const sortedMessages = response.data.sort((a, b) => 
                    new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
                );
                
                setMessages(sortedMessages);
            } catch (error) {
                console.error("Error fetching messages:", error);
                setError("Error al cargar los mensajes");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();
    }, [user.id_alumno]);

    const getRecipientInfo = (msg) => {
        if (msg.para_todos) {
            return {
                type: 'todos',
                text: 'Para: Todos',
                icon: FaUsers,
                color: '#667eea',
                bgColor: '#667eea20'
            };
        } else if (msg.id_clase && msg.nombre_clase) {
            return {
                type: 'clase',
                text: `Para: ${msg.nombre_clase}`,
                icon: FaChalkboardTeacher,
                color: '#ed8936',
                bgColor: '#ed893620'
            };
        } else {
            return {
                type: 'personal',
                text: 'Para: Tí',
                icon: FaUser,
                color: '#48bb78',
                bgColor: '#48bb7820'
            };
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            return 'Ayer';
        } else if (diffDays <= 7) {
            return `Hace ${diffDays} días`;
        } else {
            return date.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        }
    };

    return (
        <div className="avisos-page-wrapper">
            <div className="avisos-container">
                <div className="avisos-page-header">
                    <div className="avisos-header-icon">
                        <FaEnvelope />
                    </div>
                    <h1 className="avisos-main-title">Bandeja de Mensajes</h1>
                    <p className="avisos-subtitle">
                        Todos los avisos y comunicados importantes
                    </p>
                </div>

                <div className="avisos-main-content">
                    <div className="avisos-stats-card">
                        <div className="stats-grid">
                            <div className="stat-item">
                                <div className="stat-icon personal">
                                    <FaUser />
                                </div>
                                <div className="stat-info">
                                    <span className="stat-count">
                                        {messages.filter(msg => !msg.para_todos && !msg.id_clase).length}
                                    </span>
                                    <span className="stat-label">Personales</span>
                                </div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-icon clase">
                                    <FaChalkboardTeacher />
                                </div>
                                <div className="stat-info">
                                    <span className="stat-count">
                                        {messages.filter(msg => msg.id_clase).length}
                                    </span>
                                    <span className="stat-label">De Clase</span>
                                </div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-icon todos">
                                    <FaUsers />
                                </div>
                                <div className="stat-info">
                                    <span className="stat-count">
                                        {messages.filter(msg => msg.para_todos).length}
                                    </span>
                                    <span className="stat-label">Para Todos</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="avisos-error-message">
                            <FaInfoCircle className="error-icon" />
                            <div className="error-content">
                                <h3>Error de carga</h3>
                                <p>{error}</p>
                            </div>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="avisos-loading-state">
                            <div className="loading-spinner"></div>
                            <p>Cargando mensajes...</p>
                        </div>
                    ) : messages.length > 0 ? (
                        <div className="mensajes-container">
                            <div className="mensajes-header">
                                <h3 className="mensajes-title">
                                    <FaBell className="title-icon" />
                                    Todos los Avisos ({messages.length})
                                </h3>
                            </div>

                            <div className="mensajes-list">
                                {messages.map((msg) => {
                                    const recipient = getRecipientInfo(msg);
                                    const IconComponent = recipient.icon;
                                    
                                    return (
                                        <div 
                                            key={msg.id_mensaje} 
                                            className="mensaje-card"
                                            style={{ borderLeftColor: recipient.color }}
                                        >
                                            <div className="mensaje-header">
                                                <div 
                                                    className="recipient-badge"
                                                    style={{ 
                                                        backgroundColor: recipient.bgColor,
                                                        color: recipient.color
                                                    }}
                                                >
                                                    <IconComponent className="badge-icon" />
                                                    <span>{recipient.text}</span>
                                                </div>
                                                <div className="mensaje-date">
                                                    <FaCalendarAlt className="date-icon" />
                                                    {formatDate(msg.createdAt)}
                                                </div>
                                            </div>

                                            <div className="mensaje-content">
                                                <p className="mensaje-text">{msg.mensaje}</p>
                                            </div>

                                            {msg.nombre_clase && recipient.type === 'clase' && (
                                                <div className="mensaje-meta">
                                                    <span className="clase-info">
                                                        Clase: {msg.nombre_clase}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="avisos-empty-state">
                            <FaEnvelope className="empty-icon" />
                            <h3>No hay mensajes</h3>
                            <p>No se han encontrado mensajes en tu bandeja</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Avisos;