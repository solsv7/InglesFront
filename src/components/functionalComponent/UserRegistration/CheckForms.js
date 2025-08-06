import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CheckForms.css";
import axios from "axios";

const CheckForms = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = location.state || {}; 

    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmationAccessPopup, setShowConfirmationAccessPopup] = useState(false);
    const [showConfirmationDenyPopup, setShowConfirmationDenyPopup] = useState(false); 

    useEffect(() => {
        if (!id) return; // Evita llamadas si no hay ID

        const fetchFormData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/obtenerFormularios/${id}`);
                setFormData(response.data); // Guarda la info en el estado
            } catch (err) {
                setError("Error al obtener el formulario.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFormData();
    }, [id]);

    // ✅ Nueva función con opción 'aceptar' o 'rechazar'
    const handleInfoOption = async (id, opcion) => {  // 📌 Ahora recibe `opcion`
        console.log(`Usuario seleccionado con ID: ${id}, Opción: ${opcion}`);
    
        try {
            // 1️⃣ Primero, procesa la opción de aceptación/rechazo
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/aceptarUsuario`, { id, opcion });
            const email = response.data.email; 
            console.log("Respuesta del servidor:", response.data);
        
                if (!response.data || !response.data.email) {
                    throw new Error("El servidor no devolvió un email válido.");
                }

            // 2️⃣ Luego, envía el correo con la decisión
            await axios.post(`${process.env.REACT_APP_API_URL}/api/mailIngresoUsuario`, { opcion, email });

            console.log("Usuario procesado y correo enviado correctamente.");
            navigate('/Accept');
        } catch (error) {
            if (error.response) {
                console.error("Error del servidor:", error.response.data);
                alert(`Error del servidor: ${error.response.data.error}`);
            } else if (error.request) {
                console.error("No se recibió respuesta del servidor.");
                alert("No se recibió respuesta del servidor.");
            } else {
                console.error("Error desconocido:", error.message);
                alert("Error inesperado.");
            }
        }
        
    };
    

    const formatKey = (key) => {
        const keyMap = {
            afeccion: "Afeccion medica",
            barrio: "Barrio",
            calle: "Calle",
            ciudad: "Ciudad",
            codigo_postal: "Codigo Postal",
            conoce_por: "Conoce el instituto por",
            dni: "DNI",
            estado_provincia: "Estado / Provincia",
            fecha_nacimiento: "Fecha de nacimiento",
            horarios_disponibles: "Horarios disponibles",
            mail: "Correo Electrónico",
            nivel_estudio: "Nivel de estudio",
            nombre: "Nombre del estudiante",
            nombre_adulto: "Nombre del adulto a cargo",
            ocupacion: "Ocupacion",
            pago: "Metodo de pago",
            programa: "Programa",
            whatsapp: "Numero de WhatsApp",
            whatsapp_adulto: "Numero de WhatsApp del adulto a cargo",
        };
        return keyMap[key] || key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    };

    return (
        <div className="check-forms-container">
            {loading && <p className="loading-message">Cargando formulario...</p>}
            {error && <p className="error-message">{error}</p>}

            {formData && (
                <div className="form-data">
                    <h2 className="form-title">Datos del formulario</h2>
                    <div className="form-content">
                        {Object.entries(formData).map(([key, value]) => (
                            <p key={key} className="form-item">
                                <strong className="form-key">{formatKey(key)}:</strong> {value || "No Aplica"}
                            </p>
                        ))}
                    </div>
                </div>
            )}
            <div className="Boton-Options">
                <button onClick={() => setShowConfirmationAccessPopup(true)} className="select-button">
                    Aceptar
                </button>
                <button onClick={() => setShowConfirmationDenyPopup(true)} className="select-button">
                    Rechazar
                </button>
            </div>

            {/* ✅ Popup de Confirmación de Aceptar */}
            {showConfirmationAccessPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h4>✔</h4>
                        <h3>Aceptar Usuario</h3>
                        <p>Si presionas confirmar, este usuario será aceptado en el campus.</p>
                        <button className="popup-btn" onClick={() => handleInfoOption(id, 'aceptar')}>Confirmar</button>
                        <button className="popup-btn" onClick={() => setShowConfirmationAccessPopup(false)}>Cancelar</button>
                    </div>
                </div>
            )}

            {/* 🚨 Popup de Confirmación de Rechazo */}
            {showConfirmationDenyPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h4>🚨</h4>
                        <h3>Rechazar Usuario</h3>
                        <p>¿Realmente deseas rechazar este usuario del campus?</p>
                        <button className="popup-btn" onClick={() => handleInfoOption(id, "rechazar")}>Confirmar</button>
                        <button className="popup-btn" onClick={() => setShowConfirmationDenyPopup(false)}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckForms;
