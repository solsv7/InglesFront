import React, { useEffect, useState } from "react";
import transition from "../../transition";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import './Modificar.css';
import axios from "axios";
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
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false); 
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const [showOptions, setShowOptions] = useState(false);
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
            const params = { id_rol: user.rol, id: user.id };

            try {
                const response = await axios.get("http://localhost:3001/api/perf-info", { params });
                console.log("Información recopilada de perfil:", response.data);
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
    }, [user.id_alumno, user.id_profesor]);

    const handleImageClick = () => {
        setShowOptions(!showOptions);
    };

    const handlePhotoSelect = (index) => {
        setPhotoIndex(index);
        setShowOptions(false);
    };

    const handleSave = async () => {
        const updatedData = {
            id_alumno: user.id_alumno || null,
            id_profesor: user.id_profesor || null,
            id_foto: photoIndex,
            mail,
            whatsapp: contactNumber,
            whatsapp_adulto: parentContact,
            id_perfil: profileData?.id_perfil || null,
        };

        try {
            console.log('la información que viaja es esta: ', updatedData);
            await axios.put("http://localhost:3001/api/actualizar-perfil", updatedData);
            alert("Información actualizada exitosamente");
            navigate("/home-student");
        } catch (error) {
            console.error("Error al actualizar la información:", error);
            setShowErrorPopup(true);// 🚨 
        }
    };

    return (
        <div className="Contenido-Modificar">
            <h1>Modificar Perfil</h1>

            {/* 📝 Formulario arriba */}
            <div className="info-extra">
                <h2>Perfil de {profileData?.nombre}</h2>
                <h4>Correo :
                    <input type="text" value={mail} onChange={(e) => setMail(e.target.value)} required />
                </h4>
                <h4>Num. Contacto :
                    <input type="text" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} required />
                </h4>
                <h4>Num. Contacto Adulto :
                    <input type="text" value={parentContact} onChange={(e) => setParentContact(e.target.value)} />
                </h4>
            </div>

            <h2>Selecciona una foto de perfil</h2>
            <div className="pics-container">
                {photoMap.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt={`Foto ${index + 1}`}
                        className={`photo-option ${index === photoIndex ? 'selected' : ''}`}
                        onClick={() => handlePhotoSelect(index)}
                    />
                ))}
            </div>

            {/* Botón de guardar */}
            <div className="noce">
                <button className="saveBTN" onClick={handleSave}>
                    Guardar Cambios
                </button>
            </div>

            {/* ✅ Pop-up de éxito */}
            {showSuccessPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h4>✔</h4>
                        <h3>Modificación Exitosa</h3>
                        <p>¡Tu perfil ha sido modificado correctamente!</p>
                        <Link to={redirectPath}>
                            <button className="popup-btn">OK</button>
                        </Link>
                    </div>
                </div>
            )}

            {/* 🚨 Pop-up de error */}
            {showErrorPopup && (
                <div className="popup-overlay">
                    <div className="popup-content error-popup">
                        <h4>❌</h4>
                        <h3>Error al Modificar</h3>
                        <p>Ocurrio un error al actualizar tu perfil. Intenta nuevamente.</p>
                        <button className="popup-btn" onClick={() => setShowErrorPopup(false)}>
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default transition(ModificarProfile);
