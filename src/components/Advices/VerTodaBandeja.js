import React, { useState, useEffect } from "react";
import { UserContext } from "../functionalComponent/UserContext/UserContext";
import './VerTodaBandeja.css';
import axios from "axios";

const Avisos = () => {
    const [messages, setMessages] = useState([]); // Últimos mensajes obtenidos
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchMessages = async () => {
            const params = { id_alumno: user.id_alumno, validation : "todos" };

            console.log("Parámetros recolectados:", params);
            try {
                const response = await axios.get("http://localhost:3001/api/getMsg", { params });
                console.log("Información obtenida en el front después de la API:", response.data);


                setMessages(response.data); // Actualiza los mensajes
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();
    }, );


    return (
        <div className="ContenidoAvisos">
                <div className="casillaMensajes" >
                    <h4>Todos los Avisos</h4>
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
        </div>
    );
};

export default Avisos;
