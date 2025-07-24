import React, { useEffect, useState } from "react";
import transition from "../../transition";
import { Link } from "react-router-dom";
import axios from "axios";
import './Profile.css';
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
    const [photo, setPhoto] = useState(Imagen1); // Imagen por defecto
    const user = JSON.parse(localStorage.getItem('user')) || {}; // Si es null, asigna un objeto vacío

    const saveChanges = async () => {
        try {
            const response = await axios.post("https://inglesback-stx6.onrender.com/api/update-profile", profileData);
            alert('Cambios guardados con éxito');
            setProfileData(response.data); // Actualiza el estado con los nuevos datos
        } catch (error) {
            alert('Error al guardar los cambios');
        }
    };
    
    useEffect(() => {
        const fetchProfileInfo = async () => {
            const params = { id_rol: user.rol, id: user.id };
    
            try {
                const response = await axios.get("https://inglesback-stx6.onrender.com/api/perf-info", { params });
                console.log('La informacion de perfil es:', response.data);
    
                if (response.data[0].id_perfil !== null) {
                    setProfileData(response.data[0]); // Solo asignar si hay datos
                    console.log('los parametros que se envian son:', params);
                    console.log('La informacion de perfil es:', response.data);
                } else {
                    console.warn('El usuario con rol 4 no tiene perfil disponible.');
                }
            } catch (error) {
                console.error('Error al obtener la información:', error);
            }
        };
    
        fetchProfileInfo();
    }, [user.rol, user.id]);    

    useEffect(() => {
        const fetchPhoto = () => {
            const photoMap = [
                Imagen1, Imagen2, Imagen3,
                Imagen4, Imagen5, Imagen6,
                Imagen7, Imagen8,
            ];
            setPhoto(photoMap[profileData?.id_foto] || Imagen1); // Asigna la imagen según `id_foto`
        };

        if (profileData?.id_foto !== undefined) {
            fetchPhoto();
        }
    }, [profileData?.id_foto]);
    let content;
    let UserType = "Usuario";

    if (user.rol === 1) {
        UserType = "Administrador";
        content = (
            <div className="Contenido-Perfil">
                <h2>Mi Perfil</h2>
                <div className="userData">
                <div className="user-w-pic">
                        <div className="user">
                            <h2>{user.nombre}</h2>
                            <h4 className="Rol">{UserType}</h4>
                        </div>
                        <div className="pic">
                            <img src={photo} alt="Foto de perfil" />
                        </div>
                    </div>
                    <div className="extra-info">
                        <h1>Informacion adicional</h1>
                        <h4>Correo: {profileData?.mail || 'Sin informacion'}</h4>
                        <h4>Num. Contacto: {profileData?.whatsapp || 'Sin informacion'}</h4>
                    </div>
                    <div className="noce">
                        <button><Link to='/Modificar' className="modifyBTN">Modificar Informacion</Link></button>
                    </div>
                </div>
            </div>
        );
    } else if (user.rol === 2) {
        UserType = "Profesor";
        content = (
            <div className="Contenido-Perfil">
                <h2>Mi Perfil</h2>
                <div className="userData">
                <div className="user-w-pic">
                        <div className="user">
                            <h2>{user.nombre}</h2>
                            <h4 className="Rol">{UserType}</h4>
                        </div>
                        <div className="pic">
                            <img src={photo} alt="Foto de perfil" />
                        </div>
                    </div>
                    <div className="extra-info">
                        <h1>Informacion adicional</h1>
                        <h4>Correo: {profileData?.mail || 'Sin informacion'}</h4>
                        <h4>Num. Contacto: {profileData?.whatsapp || 'Sin informacion'}</h4>
                    </div>
                    <div className="noce">
                        <button><Link to='/Modificar' className="modifyBTN">Modificar Informacion</Link></button>
                    </div>
                </div>
            </div>
        );
    } else if (user.rol === 3) {
        UserType = "Alumno";
        content = (
            <div className="Contenido-Perfil">
                <h2>Mi Perfil</h2>
                <div className="userData">
                    <div className="user-w-pic">
                        <div className="user">
                            <h2>{user.nombre}</h2>
                            <h4 className="Rol">{UserType}</h4>
                        </div>
                        <div className="pic">
                            <img src={photo} alt="Foto de perfil" />
                        </div>
                    </div>
                    <div className="extra-info">
                        <h1>Informacion adicional</h1>
                        <h4>Correo: {profileData?.mail || 'Sin informacion'}</h4>
                        <h4>Num. Contacto: {profileData?.whatsapp || 'Sin informacion'}</h4>
                        <h4>Num. Contacto Adulto: {profileData?.whatsapp_adulto || 'Sin informacion'}</h4>
                    </div>
                    <div className="noce">
                        <button><Link to='/Modificar' className="modifyBTN">Modificar Informacion</Link></button>
                    </div>
                </div>
            </div>
        );
    }

    return <div className="contenidoProfile">{content}</div>;
};

export default transition(Profile);
