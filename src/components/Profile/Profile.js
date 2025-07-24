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
    const [photo, setPhoto] = useState(Imagen1);
    const [cuotaInfo, setCuotaInfo] = useState(null);
    const [loadingCuota, setLoadingCuota] = useState(false);
    const [errorCuota, setErrorCuota] = useState(null);
    const user = JSON.parse(localStorage.getItem('user')) || {};

    const saveChanges = async () => {
        try {
            const response = await axios.post("https://inglesback-stx6.onrender.com/api/update-profile", profileData);
            alert('Cambios guardados con éxito');
            setProfileData(response.data);
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
            setPhoto(photoMap[profileData?.id_foto] || Imagen1);
        };

        if (profileData?.id_foto !== undefined) {
            fetchPhoto();
        }
    }, [profileData?.id_foto]);

    // Nuevo efecto para obtener información de la cuota
    useEffect(() => {
        if (user.rol === 3 && user.id_alumno) { // Solo para alumnos
            const fetchCuotaInfo = async () => {
                setLoadingCuota(true);
                setErrorCuota(null);
                try {
                    const today = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD
                    const response = await axios.get(
                        `http://localhost:3001/api/cuotas/vigentes?id_alumno=${user.id_alumno}&fecha=${today}`
                    );
                    
                    // La API ahora devuelve un array, tomamos el primer elemento si existe
                    if (response.data && response.data.length > 0) {
                        setCuotaInfo(response.data[0]);
                    } else {
                        setCuotaInfo({ 
                            mensaje: 'No tienes cuotas activas en este momento' 
                        });
                    }
                } catch (error) {
                    console.error('Error al obtener información de la cuota:', error);
                    setErrorCuota('Error al cargar información de la cuota');
                    setCuotaInfo({ 
                        mensaje: 'Error al obtener información de tu cuota' 
                    });
                } finally {
                    setLoadingCuota(false);
                }
            };
            fetchCuotaInfo();
        }
    }, [user.rol, user.id_alumno]);

    // Componente de información de cuota
    const CuotaInfoCard = () => {
        if (loadingCuota) {
            return <div className="cuota-loading">Cargando información de cuota...</div>;
        }
        
        if (errorCuota) {
            return (
                <div className="cuota-info error">
                    <h3>Estado de cuota</h3>
                    <p>{errorCuota}</p>
                </div>
            );
        }

        if (!cuotaInfo) {
            return null;
        }

        // Si hay un mensaje (no hay cuotas vigentes)
        if (cuotaInfo.mensaje) {
            return (
                <div className="cuota-info warning">
                    <h3>No tienes cuotas activas.</h3>
                    <p>Acercate a renovarla.</p>
                </div>
            );
        }

        // Si hay datos de cuota
        const fechaVencimiento = new Date(cuotaInfo.fecha_vencimiento);
        const fechaFormateada = isNaN(fechaVencimiento.getTime()) 
            ? 'Fecha no disponible' 
            : fechaVencimiento.toLocaleDateString('es-ES');
        
        const diasRestantes = cuotaInfo.dias_restantes;

        return (
            <div className={`cuota-info ${cuotaInfo.status === 'success' ? 'success' : 'warning'}`}>
                <h3>Tu cuota actual</h3>
                <div className="cuota-details">
                    <p><strong>Plan:</strong> {cuotaInfo.nombre_plan || 'No especificado'}</p>
                    <p><strong>Monto:</strong> ${cuotaInfo.monto?.toLocaleString() || '0'}</p>
                    <p><strong>Estado:</strong> 
                        <span className={`estado-${cuotaInfo.estado_pago}`}>
                            {cuotaInfo.estado_pago || 'No especificado'}
                        </span>
                    </p>
                    <p><strong>Vencimiento:</strong> {fechaFormateada}</p>
                    <p><strong>Días restantes:</strong> {diasRestantes}</p>
                </div>
                {(diasRestantes <= 7 || cuotaInfo.estado_pago === 'pendiente') && (
                    <Link to="/pagos" className="renovar-btn">
                        {cuotaInfo.estado_pago === 'pendiente' ? 'Pagar ahora' : 'Renovar antes del vencimiento'}
                    </Link>
                )}
            </div>
        );
    };

    // Resto del componente permanece igual
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
                    <CuotaInfoCard />
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
