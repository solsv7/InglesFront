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
        <div className="user-creation-wrapper">
            <div className="user-creation-content">
                <div className="user-creation-header">
                    <div className="user-creation-header-icon">
                        <FaUserPlus />
                    </div>
                    <h1 className="user-creation-title">Crear Nuevo Usuario</h1>
                    <p className="user-creation-subtitle">Crea nuevos usuarios en el sistema</p>
                </div>

                <div className="user-creation-form">
                    <div className="user-creation-section">
                        <label className="user-creation-label">
                            <FaUsers className="user-creation-label-icon" />
                            Tipo de Usuario
                        </label>
                        <div className="user-creation-select-wrapper">
                            {getTargetIcon()}
                            <select 
                                value={target} 
                                onChange={handleTargetChange} 
                                className="user-creation-select"
                            >
                                <option value="">Seleccione el tipo de usuario</option>
                                <option value="alumno">Nuevo Alumno</option>
                                <option value="profesor">Nuevo Profesor</option>
                            </select>
                        </div>
                    </div>

                    {/* Mostrar formularios condicionalmente */}
                    {target === "profesor" && (
                        <div className="teacher-creation-container">
                            <div className="teacher-creation-header">
                                <FaChalkboardTeacher className="teacher-creation-icon" />
                                <h2 className="teacher-creation-title">Registro de Profesor</h2>
                                <p className="teacher-creation-subtitle">Complete la información del nuevo profesor</p>
                            </div>
                            <UserRegistration />
                        </div>
                    )}

                    {target === "alumno" && (
                        <div className="user-creation-container">
                            <div className="user-creation-form-header">
                                <FaUserGraduate className="user-creation-form-icon" />
                                <h2 className="user-creation-form-title">Registro de Alumno</h2>
                                <p className="user-creation-form-subtitle">Complete la información del nuevo alumno</p>
                            </div>
                            <CrearUsuarioNuevo />
                        </div>
                    )}

                    {!target && (
                        <div className="user-creation-empty">
                            <FaUsers className="user-creation-empty-icon" />
                            <h3 className="user-creation-empty-title">Selecciona un tipo de usuario</h3>
                            <p className="user-creation-empty-text">Elige entre "Nuevo Alumno" o "Nuevo Profesor" para comenzar el registro</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default transition(UsersCreation);