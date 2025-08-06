import React, { useEffect, useState } from "react";
import transition from "../../transition";
import { Link, useNavigate } from "react-router-dom";
import './Modificar.css';
import axios from "axios";
import Swal from 'sweetalert2';

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
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const navigate = useNavigate();
    console.log("Usuario actual:", user);

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
    }, [user.id_alumno, user.id_profesor]);

    const handlePhotoSelect = (index) => {
        setPhotoIndex(index);
    };

    const handleSave = async () => {
        const updatedData = {
            id_usuario:user.id,
            id_foto: photoIndex,
            mail,
            whatsapp: contactNumber,
            whatsapp_adulto: parentContact || null,     
        };
        console.log("Datos a enviar:", updatedData);

        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/api/actualizar-perfil`, updatedData);

            Swal.fire({
                icon: 'success',
                title: '¡Perfil actualizado!',
                text: 'Tu perfil fue modificado correctamente.',
                confirmButtonColor: '#29154e',
                confirmButtonText: 'Continuar'
            }).then(() => navigate(redirectPath));

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el perfil. Intenta más tarde.',
                confirmButtonColor: '#d33'
            });
        }
    };

    return (
        <div className="Modificar-Wrapper">
            <div className="Contenido-Modificar">
                <h1>Modificar información</h1>
                <div className="info-extra">
                    
                    <h4>Correo :
                        <input type="email" value={mail} onChange={(e) => setMail(e.target.value)} required />
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

                <div className="noce">
                    <button className="saveBTN" onClick={handleSave}>
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
};

export default transition(ModificarProfile);
