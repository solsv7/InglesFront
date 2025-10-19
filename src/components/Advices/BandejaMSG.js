import React, { useState, useEffect, useCallback } from "react";
import './BandejaMsg.css';
import axios from "axios";
import Swal from 'sweetalert2';
import { 
  GoBellFill, 
  GoChevronDown, 
  GoChevronUp,
  GoMail,
} from "react-icons/go";
import { FaComments } from "react-icons/fa";
import { IoIosMailOpen } from "react-icons/io";

const Avisos = () => {
    const [messages, setMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('dropdown');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    
    const getUser = useCallback(() => {
        try {
            const userData = localStorage.getItem('user');
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error("Error parsing user data:", error);
            return null;
        }
    }, []);

    const user = getUser();
    const [lastSeenMessageId, setLastSeenMessageId] = useState(
        localStorage.getItem("lastSeenMessageId") || null
    );

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            
            if (mobile && isOpen) {
                setViewMode('modal');
            } else if (!mobile && isOpen) {
                setViewMode('dropdown');
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isOpen]);

    const getMaxMessageId = useCallback((messagesArray) => {
        if (!messagesArray.length) return null;
        return Math.max(...messagesArray.map(msg => msg.id_mensaje));
    }, []);

    const countUnreadMessages = useCallback((allMessages, lastSeenId) => {
        if (!lastSeenId) return allMessages.length;
        return allMessages.filter(msg => msg.id_mensaje > lastSeenId).length;
    }, []);

    const fetchMessages = useCallback(async () => {
        if (!user?.id_alumno) {
            setError("Usuario no identificado");
            return;
        }

        setIsLoading(true);
        setError(null);
        
        const params = { 
            id_alumno: user.id_alumno, 
            validation: "bandeja" 
        };

        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/getMsg`, 
                { 
                    params,
                    timeout: 10000
                }
            );
            
            const messagesData = Array.isArray(response.data) ? response.data : [];
            setMessages(messagesData);
            
            const unreadCount = countUnreadMessages(messagesData, lastSeenMessageId);
            setUnreadCount(unreadCount);
            
        } catch (error) {
            console.error("Error fetching messages:", error);
            if (error.code === 'ECONNABORTED') {
                setError("Tiempo de espera agotado");
            } else {
                setError("Error al cargar los mensajes");
            }
        } finally {
            setIsLoading(false);
        }
    }, [user?.id_alumno, lastSeenMessageId, countUnreadMessages]);

    useEffect(() => {
        fetchMessages();
        
        const interval = setInterval(fetchMessages, 120000);
        return () => clearInterval(interval);
    }, [fetchMessages]);

    const markAsRead = useCallback(() => {
        if (messages.length > 0) {
            const maxId = getMaxMessageId(messages);
            if (maxId) {
                setUnreadCount(0);
                setLastSeenMessageId(maxId);
                localStorage.setItem("lastSeenMessageId", maxId.toString());
            }
        }
    }, [messages, getMaxMessageId]);

    // Función para mostrar el modal de SweetAlert con todos los mensajes
    const showMobileModal = useCallback(() => {
        if (messages.length === 0) {
            Swal.fire({
                title: 'Bandeja de Mensajes',
                html: `
                    <div style="text-align: center; padding: 20px;">
                        <div style="font-size: 3rem; color: #a0aec0; margin-bottom: 15px;">
                            <i class="fas fa-inbox"></i>
                        </div>
                        <p style="color: #718096; font-size: 1.1rem;">No hay mensajes nuevos</p>
                    </div>
                `,
                showConfirmButton: true,
                confirmButtonText: 'Cerrar',
                confirmButtonColor: '#1a296b',
                width: '90%',
                background: 'white',
                borderRadius: '20px',
                customClass: {
                    popup: 'swal-mobile-modal'
                }
            });
            return;
        }

        const messagesHtml = messages.map(msg => `
            <div class="mobile-message-item ${msg.id_mensaje > lastSeenMessageId ? 'unread' : 'read'}" 
                 onclick="handleMobileMessageClick(${msg.id_mensaje})"
                 style="border-bottom: 1px solid #e2e8f0; padding: 15px; cursor: pointer; transition: background 0.3s; border-left: 4px solid ${msg.id_mensaje > lastSeenMessageId ? '#48bb78' : 'transparent'}; background: ${msg.id_mensaje > lastSeenMessageId ? '#f0fff4' : 'white'};">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                    <span style="flex: 1; font-size: 0.95rem; color: #2d3748; line-height: 1.4;">
                        ${msg.mensaje.length > 80 ? `${msg.mensaje.substring(0, 80)}...` : msg.mensaje}
                    </span>
                </div>
                ${msg.fecha ? `
                    <div style="text-align: right;">
                        <span style="font-size: 0.8rem; color: #a0aec0;">
                            ${new Date(msg.fecha).toLocaleDateString()}
                        </span>
                    </div>
                ` : ''}
            </div>
        `).join('');

        Swal.fire({
            title: `
                <div style="display: flex; align-items: center; gap: 12px; justify-content: center; height: 10px !important;" className="swal2-title-custom">
                    <div>
                        <div style="font-size: 1.3rem; font-weight: 600; color: white; height: 10px !important;">Bandeja de Mensajes</div>
                        ${unreadCount > 0 ? `
                            <div style="background: #48bb78; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; margin-top: 5px;">
                                ${unreadCount} nuevo${unreadCount !== 1 ? 's' : ''}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `,
            html: `
                <div style="max-height: 60vh; overflow-y: auto;">
                    ${messagesHtml}
                </div>
            `,
            showConfirmButton: true,
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#1a296b',
            width: '95%',
            background: 'white',
            borderRadius: '20px',
            showCloseButton: true,
            customClass: {
                popup: 'swal-mobile-modal',
                closeButton: 'swal-mobile-close'
            },
            didOpen: () => {
                // Marcar como leídos al abrir el modal
                if (unreadCount > 0) {
                    markAsRead();
                }

                // Agregar función global para manejar clics en mensajes
                window.handleMobileMessageClick = (messageId) => {
                    const message = messages.find(msg => msg.id_mensaje === messageId);
                    if (message) {
                        showMessageDetail(message);
                    }
                };
            },
            willClose: () => {
                // Limpiar función global
                delete window.handleMobileMessageClick;
            }
        });
    }, [messages, unreadCount, lastSeenMessageId, markAsRead]);

    // Función para mostrar el detalle de un mensaje en SweetAlert
    const showMessageDetail = (message) => {
        Swal.fire({
            title: message.titulo || 'Mensaje',
            html: `
                <div style="text-align: left; padding: 10px;">
                    <div style="font-size: 1rem; line-height: 1.6; color: #4a5568; margin-bottom: 20px; background: #f8f9fa; padding: 15px; border-radius: 8px;">
                        ${message.mensaje}
                    </div>
                    ${message.fecha ? `
                        <div style="text-align: right;">
                            <span style="font-size: 0.85rem; color: #a0aec0; font-style: italic;">
                                ${new Date(message.fecha).toLocaleDateString()}
                            </span>
                        </div>
                    ` : ''}
                </div>
            `,
            showConfirmButton: true,
            confirmButtonText: 'Volver a la lista',
            confirmButtonColor: '#1a296b',
            showCancelButton: true,
            cancelButtonText: 'Cerrar',
            cancelButtonColor: '#a0aec0',
            width: '95%',
            background: 'white',
            borderRadius: '20px',
            customClass: {
                popup: 'swal-message-detail'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Volver a la lista de mensajes
                showMobileModal();
            }
        });
    };

    const handleToggle = () => {
        const newIsOpen = !isOpen;
        
        if (isMobile && newIsOpen) {
            // En móvil, usar SweetAlert modal
            showMobileModal();
            setIsOpen(false);
        } else {
            // En desktop, usar el dropdown normal
            setIsOpen(newIsOpen);
            if (newIsOpen && unreadCount > 0) {
                markAsRead();
            }
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            const avisosContainer = document.querySelector('.AvisosContainer');
            if (avisosContainer && !avisosContainer.contains(event.target)) {
                setIsOpen(false);
                setSelectedMessage(null);
            }
        };

        if (isOpen && !isMobile) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, isMobile]);

    const handleViewMessage = (message) => {
        setSelectedMessage(message);
    };

    const handleBackToList = () => {
        setSelectedMessage(null);
    };

    const displayedMessages = messages.slice(0, 3);
    const hasMoreMessages = messages.length > 3;

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="avisos-loading">
                    <div className="loading-spinner"></div>
                    <span>Cargando mensajes...</span>
                </div>
            );
        }

        if (error) {
            return (
                <div className="avisos-error">
                    <span className="error-icon">⚠️</span>
                    <span>{error}</span>
                    <button 
                        onClick={fetchMessages} 
                        className="retry-btn modern-button"
                    >
                        Reintentar
                    </button>
                </div>
            );
        }

        if (selectedMessage) {
            return (
                <div className="message-detail">
                    <button 
                        onClick={handleBackToList}
                        className="back-button modern-button"
                    >
                        <GoChevronDown /> Volver
                    </button>
                    <div className="message-content">
                        <h5>{selectedMessage.titulo || 'Sin título'}</h5>
                        <p className="message-text">{selectedMessage.mensaje}</p>
                        {selectedMessage.fecha && (
                            <span className="message-date">
                                {new Date(selectedMessage.fecha).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <>
                <div className="avisos-header">
                    <div className="header-icon">
                        <FaComments />
                    </div>
                    <h4>Bandeja de Mensajes</h4>
                    {unreadCount > 0 && (
                        <span className="unread-badge">{unreadCount} nuevo{unreadCount !== 1 ? 's' : ''}</span>
                    )}
                </div>
                
                <ul className="messages-list">
                    {displayedMessages.length > 0 ? (
                        displayedMessages.map((msg) => (
                            <li 
                                key={msg.id_mensaje} 
                                className={`message-item ${msg.id_mensaje > lastSeenMessageId ? 'unread' : 'read'}`}
                                onClick={() => handleViewMessage(msg)}
                            >
                                <div className="message-preview">
                                    <span className="message-icon">
                                        {msg.id_mensaje > lastSeenMessageId ? 
                                            <GoMail /> : <IoIosMailOpen />
                                        }
                                    </span>
                                    <span className="message-text">
                                        {msg.mensaje.length > 60 
                                            ? `${msg.mensaje.substring(0, 60)}...` 
                                            : msg.mensaje
                                        }
                                    </span>
                                </div>
                                {msg.fecha && (
                                    <span className="message-time">
                                        {new Date(msg.fecha).toLocaleDateString()}
                                    </span>
                                )}
                            </li>
                        ))
                    ) : (
                        <li className="no-messages">
                            <IoIosMailOpen className="empty-icon" />
                            <span>No hay mensajes nuevos</span>
                        </li>
                    )}
                    
                    {hasMoreMessages && (
                        <li 
                            className="more-messages"
                            onClick={showMobileModal}
                        >
                            <span>+{messages.length - 3} mensajes más</span>
                            <GoChevronDown className="more-icon" />
                        </li>
                    )}
                </ul>
            </>
        );
    };

    return (
        <div className={`AvisosContainer ${isOpen ? 'open' : ''} ${viewMode} ${isMobile ? 'mobile' : 'desktop'}`}>
            <button 
                onClick={handleToggle} 
                className={`bell-button ${unreadCount > 0 ? 'has-notifications' : ''}`}
                aria-label={`Avisos ${unreadCount > 0 ? `(${unreadCount} no leídos)` : ''}`}
                disabled={isLoading}
            >
                <GoBellFill className="bell-icon" />
                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
                <span className="toggle-arrow">
                    {isOpen ? <GoChevronUp /> : <GoChevronDown />}
                </span>
            </button>

            {isOpen && !isMobile && (
                <div className={`avisos-content ${viewMode}`}>
                    {renderContent()}
                    
                    <div className="avisos-footer">
                        <button 
                            onClick={fetchMessages}
                            className="refresh-btn modern-button"
                            disabled={isLoading}
                        >
                            Actualizar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Avisos;