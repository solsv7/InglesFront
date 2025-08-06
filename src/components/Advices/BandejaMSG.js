import React, { useState, useEffect } from "react";
import { UserContext } from "../functionalComponent/UserContext/UserContext";
import './BandejaMsg.css';
import axios from "axios";
import { GoBellFill } from "react-icons/go";

const Avisos = () => {
    const [messages, setMessages] = useState([]); // Últimos mensajes obtenidos
    const [unreadCount, setUnreadCount] = useState(0); // Contador de mensajes no leídos
    const [isOpen, setIsOpen] = useState(false); // Estado del desplegable
    const user = JSON.parse(localStorage.getItem('user'));
    const [lastSeenMessageId, setLastSeenMessageId] = useState(
        localStorage.getItem("lastSeenMessageId") || null // Recupera el último mensaje visto
    );

    useEffect(() => {
        const fetchMessages = async () => {
            const params = { id_alumno: user.id_alumno, validation : "bandeja" };

            console.log("Parámetros recolectados:", params);
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/getMsg`, { params });
                console.log("Información obtenida en el front después de la API:", response.data);
                
                const newMessages = response.data.filter(
                    (msg) => !lastSeenMessageId || msg.id_mensaje > lastSeenMessageId // Filtra mensajes no vistos
                );

                setMessages(response.data); // Actualiza los mensajes
                setUnreadCount(newMessages.length); // Solo cuenta mensajes no vistos
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();
    }, [lastSeenMessageId]);

    const handleToggle = () => {
        setIsOpen(!isOpen); // Cambiar el estado del desplegable
        if (!isOpen) {
            setUnreadCount(0); // Marca todos los mensajes como leídos al abrir
            if (messages.length > 0) {
                const maxId = Math.max(...messages.map((msg) => msg.id_mensaje)); // Encuentra el último mensaje
                setLastSeenMessageId(maxId); // Actualiza el último mensaje visto
                localStorage.setItem("lastSeenMessageId", maxId); // Guarda en localStorage
            }
        }
    };

    return (
        <div className="Contenido-Avisos">
            <button onClick={handleToggle} className="Megafono">
                <GoBellFill />
                {unreadCount > 0 && (
                    <span className="num-avisos">{unreadCount}</span>
                )}
            </button>
            {/* Desplegable de mensajes */}
            {isOpen && (
                <div className="casilla-avisos">
                    <h4>Ultimos Avisos</h4>
                    <ul>
                        {messages.length > 0 ? (
                            messages.map((msg) => (
                                <li key={msg.id_mensaje} className="Mensajes">
                                    {msg.mensaje}
                            </li>
                        ))
                    ) : (
                        <li>No hay mensajes nuevos</li>
                    )}
                </ul>
            </div>
        )}
    </div>
    );
};

export default Avisos;
