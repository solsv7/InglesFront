import React, { useState, useEffect, useCallback } from "react";
import './BandejaMsg.css';
import axios from "axios";
import { GoBellFill } from "react-icons/go";

const Avisos = () => {
    const [messages, setMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Obtener usuario de forma segura
    const getUser = () => {
        try {
            const userData = localStorage.getItem('user');
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error("Error parsing user data:", error);
            return null;
        }
    };

    const user = getUser();
    const [lastSeenMessageId, setLastSeenMessageId] = useState(
        localStorage.getItem("lastSeenMessageId") || null
    );

    // Función para obtener el máximo ID de mensaje
    const getMaxMessageId = useCallback((messagesArray) => {
        if (!messagesArray.length) return null;
        return Math.max(...messagesArray.map(msg => msg.id_mensaje));
    }, []);

    // Función para contar mensajes no leídos
    const countUnreadMessages = useCallback((allMessages, lastSeenId) => {
        if (!lastSeenId) return allMessages.length;
        return allMessages.filter(msg => msg.id_mensaje > lastSeenId).length;
    }, []);

    // Fetch de mensajes
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
                { params }
            );
            
            const messagesData = response.data || [];
            setMessages(messagesData);
            
            // Contar mensajes no leídos
            const unreadCount = countUnreadMessages(messagesData, lastSeenMessageId);
            setUnreadCount(unreadCount);
            
        } catch (error) {
            console.error("Error fetching messages:", error);
            setError("Error al cargar los mensajes");
        } finally {
            setIsLoading(false);
        }
    }, [user?.id_alumno, lastSeenMessageId, countUnreadMessages]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    // Manejar toggle del dropdown
    const handleToggle = () => {
        const newIsOpen = !isOpen;
        setIsOpen(newIsOpen);
        
        // Si se está abriendo, marcar como leídos
        if (newIsOpen && unreadCount > 0) {
            setUnreadCount(0);
            
            if (messages.length > 0) {
                const maxId = getMaxMessageId(messages);
                if (maxId) {
                    setLastSeenMessageId(maxId);
                    localStorage.setItem("lastSeenMessageId", maxId.toString());
                }
            }
        }
    };

    // Limitar a mostrar máximo 3 mensajes
    const displayedMessages = messages.slice(0, 3);

    return (
        <div className="Contenido-Avisos">
            <button 
                onClick={handleToggle} 
                className="Megafono"
                aria-label={`Avisos ${unreadCount > 0 ? `(${unreadCount} no leídos)` : ''}`}
                disabled={isLoading}
            >
                <GoBellFill />
                {unreadCount > 0 && (
                    <span className="num-avisos">{unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="casilla-avisos">
                    <h4>Últimos Avisos</h4>
                    
                    {isLoading ? (
                        <div className="loading-state">Cargando mensajes...</div>
                    ) : error ? (
                        <div className="error-state">{error}</div>
                    ) : (
                        <ul>
                            {displayedMessages.length > 0 ? (
                                displayedMessages.map((msg) => (
                                    <li key={msg.id_mensaje} className="Mensajes">
                                        {msg.mensaje}
                                    </li>
                                ))
                            ) : (
                                <li className="no-messages">No hay mensajes nuevos</li>
                            )}
                            
                            {/* Mostrar indicador si hay más mensajes */}
                            {messages.length > 3 && (
                                <li className="more-messages">
                                    +{messages.length - 3} mensajes más
                                </li>
                            )}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default Avisos;