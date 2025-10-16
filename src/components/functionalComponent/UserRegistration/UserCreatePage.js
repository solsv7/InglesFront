import React, { useState } from "react";
import transition from '../../../transition';
import CrearUsuarioNuevo from "./StudentRegister";
import UserRegistration from "./TeacherRegister";
import { FaUserPlus, FaUserGraduate, FaChalkboardTeacher, FaUsers } from "react-icons/fa";
import './UserCreatePage.css';

const UsersCreation = () => {
    const [target, setTarget] = useState("");

    const handleTargetChange = (event) => {
        setTarget(event.target.value);
    };

    const getTargetIcon = () => {
        switch (target) {
            case "alumno": return <FaUserGraduate />;
            case "profesor": return <FaChalkboardTeacher />;
            default: return <FaUsers />;
        }
    };

    return (
        <div className="AnimatedUsersCreationWrapper">
            <div className="UsersCreationContent">
                <div className="users-creation-header">
                    <div className="header-icon">
                        <FaUserPlus />
                    </div>
                    <h1>Crear Nuevo Usuario</h1>
                    <p>Crea nuevos usuarios en el sistema</p>
                </div>

                <div className="users-creation-form">
                    <div className="form-section">
                        <label className="section-label">
                            <FaUsers className="label-icon" />
                            Tipo de Usuario
                        </label>
                        <div className="select-wrapper">
                            {getTargetIcon()}
                            <select 
                                value={target} 
                                onChange={handleTargetChange} 
                                className="modern-select"
                            >
                                <option value="">Seleccione el tipo de usuario</option>
                                <option value="alumno">Nuevo Alumno</option>
                                <option value="profesor">Nuevo Profesor</option>
                            </select>
                        </div>
                    </div>

                    {/* Mostrar formularios condicionalmente */}
                    {target === "profesor" && (
                        <div className="form-container">
                            <div className="form-header">
                                <FaChalkboardTeacher className="form-type-icon" />
                                <h2>Registro de Profesor</h2>
                                <p>Complete la información del nuevo profesor</p>
                            </div>
                            <UserRegistration />
                        </div>
                    )}

                    {target === "alumno" && (
                        <div className="form-container">
                            <div className="form-header">
                                <FaUserGraduate className="form-type-icon" />
                                <h2>Registro de Alumno</h2>
                                <p>Complete la información del nuevo alumno</p>
                            </div>
                            <CrearUsuarioNuevo />
                        </div>
                    )}

                    {!target && (
                        <div className="empty-selection">
                            <FaUsers className="empty-icon" />
                            <h3>Selecciona un tipo de usuario</h3>
                            <p>Elige entre "Nuevo Alumno" o "Nuevo Profesor" para comenzar el registro</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default transition(UsersCreation);