import React, { useState } from "react";
import transition from "../../transition";
import axios from "axios";
import { FaUpload, FaYoutube, FaGlobeAmericas, FaHeading } from "react-icons/fa";
import './UploadVids.css';

const UploadVids = () => {
    const [formData, setFormData] = useState({
        titulo: "",
        idioma: "",
        url: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const showMessage = (text, type = "success") => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validaciones
        if (!formData.titulo.trim()) {
            showMessage("Por favor, ingresa un título para el video", "error");
            return;
        }
        
        if (!formData.idioma) {
            showMessage("Por favor, selecciona un idioma", "error");
            return;
        }
        
        if (!formData.url.trim()) {
            showMessage("Por favor, ingresa la URL del video", "error");
            return;
        }

        // Validar que sea una URL de YouTube
        if (!formData.url.includes('youtube.com') && !formData.url.includes('youtu.be')) {
            showMessage("Por favor, ingresa una URL válida de YouTube", "error");
            return;
        }

        setIsSubmitting(true);
        console.log('Datos enviados al backend:', formData);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/upload-vids`, formData);
            console.log("Información de video enviado con éxito:", response.data);
            
            // Reset form
            setFormData({
                titulo: "",
                idioma: "",
                url: "",
            });
            
            showMessage("¡Video subido exitosamente!", "success");
        } catch (error) {
            console.error("Error al enviar la información del video:", error);
            showMessage("Hubo un error al subir el video. Intenta nuevamente.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Extraer ID de YouTube para previsualización
    const getYouTubeId = (url) => {
        if (!url) return null;
        
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    const youtubeId = getYouTubeId(formData.url);

    return (
        <div className="AnimatedUploadWrapper">
            <div className="UploadContent">
                <div className="upload-header">
                    <div className="header-icon">
                        <FaUpload />
                    </div>
                    <h1>Subir Videos</h1>
                    <p>Agrega nuevos recursos de aprendizaje para los estudiantes</p>
                </div>

                <form className="upload-form" onSubmit={handleSubmit}>
                    <div className="form-section">
                        <label className="section-label">
                            <FaHeading className="label-icon" />
                            Título del Video
                        </label>
                        <div className="input-wrapper">
                            <input 
                                name="titulo" 
                                value={formData.titulo} 
                                onChange={handleChange} 
                                type="text" 
                                className="modern-input"
                                placeholder="Ej: Práctica verbo to be - ejercicios completos" 
                                maxLength={100}
                            />
                            <div className="character-count">
                                {formData.titulo.length}/100 caracteres
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <label className="section-label">
                            <FaGlobeAmericas className="label-icon" />
                            Idioma del Video
                        </label>
                        <div className="select-wrapper">
                            <FaGlobeAmericas />
                            <select 
                                name="idioma" 
                                value={formData.idioma} 
                                onChange={handleChange} 
                                className="modern-select"
                            >
                                <option value="">Seleccione un idioma</option>
                                <option value="Ingles">Inglés</option>
                                <option value="Portugues">Portugués</option>
                                <option value="Italiano">Italiano</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-section">
                        <label className="section-label">
                            <FaYoutube className="label-icon" />
                            URL del Video (YouTube)
                        </label>
                        <div className="input-wrapper">
                            <input 
                                name="url" 
                                value={formData.url} 
                                onChange={handleChange} 
                                type="text" 
                                className="modern-input"
                                placeholder="Ej: https://www.youtube.com/watch?v=AbCdeFghiJk" 
                            />
                        </div>
                        {formData.url && !youtubeId && (
                            <div className="url-warning">
                                ⚠️ La URL no parece ser de YouTube
                            </div>
                        )}
                    </div>

                    {/* Previsualización del video */}
                    {youtubeId && (
                        <div className="form-section">
                            <label className="section-label">
                                <FaYoutube className="label-icon" />
                                Vista Previa del Video
                            </label>
                            <div className="video-preview">
                                <iframe
                                    width="100%"
                                    height="315"
                                    src={`https://www.youtube.com/embed/${youtubeId}`}
                                    title="Vista previa del video"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    )}

                    {message.text && (
                        <div className={`message ${message.type}`}>
                            <div className="message-icon">
                                {message.type === "success" ? "✅" : "⚠️"}
                            </div>
                            {message.text}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="submit-video-button modern-button"
                        disabled={isSubmitting}
                    >
                        <FaUpload className="button-icon" />
                        {isSubmitting ? "Subiendo..." : "Subir Video"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default transition(UploadVids);