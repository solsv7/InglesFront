import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AcceptStudent.css';

const AcceptStudents = () => {
    const [newUsers, setNewUsers] = useState([]);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNewUser = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/obtenerAlumnos', {
                    params: { option: "formularios" }
                });
                setNewUsers(response.data);
                
            } catch (error) {
                console.error('Error fetching users:', error);
                
            }
        };

        fetchNewUser();
    }, []);
    const handleViewInfo = (id) => {
        navigate('/CheckForms', { state: { id } }); // ⬅️ Navegar pasando el ID
    };
    

    return (
        <div className='Contenido-Accept'>
            <h2>Aceptar Estudiantes</h2>
            <ul className="lista-Estudiantes">
                {newUsers.length > 0 ? (
                    newUsers.map(student => (
                        <li key={student.id_alumno} className="student-item">
                            {student.nombre}
                            <button
                                onClick={() => handleViewInfo(student.id_usuario)}
                                className="select-button"
                            >
                                Ver informacion
                            </button>
                        </li>
                    ))
                ) : (
                    <p>No hay estudiantes inscriptos</p>
                )}
            </ul>
            {/* ✅ Pop-up de éxito */}
            {showSuccessPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h4>✔</h4>
                        <h3>Modificacion Exitosa</h3>
                        <p>Tu perfil ha sido modificado correctamente</p>
                        <button className="popup-btn" onClick={() => location.reload()}>OK</button>

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
}

export default AcceptStudents;
