import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { 
  FaUserGraduate, 
  FaUsers, 
  FaExchangeAlt, 
  FaTrash, 
  FaEdit, 
  FaSave, 
  FaTimes,
  FaPlus,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaSearch
} from 'react-icons/fa';
import StudentSearch from '../functionalComponent/gradesComponent/StudentSearch/StudentSearch.js';
import './Inscripciones.css';

const Inscripciones = () => {
  const [clases, setClases] = useState([]);
  const [inscriptos, setInscriptos] = useState([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState('');
  const [nuevoAlumno, setNuevoAlumno] = useState('');
  const [editandoAlumnoId, setEditandoAlumnoId] = useState(null);
  const [claseNueva, setClaseNueva] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  useEffect(() => {
    const fetchClases = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/clases`);
        setClases(res.data);
      } catch (err) {
        console.error('Error al obtener clases:', err);
        showMessage('❌ Error al cargar las clases', 'error');
      }
    };
    fetchClases();
  }, []);

  useEffect(() => {
    if (claseSeleccionada) {
      const fetchInscriptos = async () => {
        setIsLoading(true);
        try {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/clases-alumnos/por-clase/${claseSeleccionada}`);
          setInscriptos(res.data);
        } catch (err) {
          console.error('Error al obtener inscriptos:', err);
          showMessage('❌ Error al cargar los alumnos inscriptos', 'error');
        } finally {
          setIsLoading(false);
        }
      };
      fetchInscriptos();
    } else {
      setInscriptos([]);
    }
  }, [claseSeleccionada]);

  const inscribirAlumno = async () => {
    if (!nuevoAlumno || !claseSeleccionada) {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Debes seleccionar un alumno y una clase',
        confirmButtonColor: '#d33',
        customClass: {
          popup: 'swal-custom-popup',
          title: 'swal-custom-title',
          confirmButton: 'swal-custom-confirm-btn',
        }
      });
      return;
    }

    // Verificar si el alumno ya está inscrito
    const alumnoYaInscripto = inscriptos.some(a => a.id_alumno === parseInt(nuevoAlumno));
    if (alumnoYaInscripto) {
      Swal.fire({
        icon: 'error',
        title: 'Alumno ya inscrito',
        text: 'Este alumno ya está inscrito en la clase seleccionada.',
        confirmButtonColor: '#d33',
        customClass: {
          popup: 'swal-custom-popup',
          title: 'swal-custom-title',
          confirmButton: 'swal-custom-confirm-btn',
        }
      });
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/clases-alumnos`, {
        id_alumno: parseInt(nuevoAlumno),
        id_clase: parseInt(claseSeleccionada)
      });
      
      setNuevoAlumno('');
      Swal.fire({
        icon: 'success',
        title: 'Alumno inscrito',
        text: 'El alumno fue inscrito exitosamente.',
        confirmButtonColor: '#3085d6',
        customClass: {
          popup: 'swal-custom-popup',
          title: 'swal-custom-title',
          confirmButton: 'swal-custom-confirm-btn',
        }
      });
      
      // Actualizar lista de inscriptos
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/clases-alumnos/por-clase/${claseSeleccionada}`);
      setInscriptos(res.data);
    } catch (err) {
      console.error('Error al inscribir:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error al inscribir',
        text: 'Ocurrió un problema al inscribir al alumno.',
        confirmButtonColor: '#d33',
        customClass: {
          popup: 'swal-custom-popup',
          title: 'swal-custom-title',
          confirmButton: 'swal-custom-confirm-btn',
        }
      });
    }
  };


  const cambiarAlumnoDeClase = async (id_alumno, alumnoNombre) => {
    if (!claseNueva) {
      showMessage('⚠️ Debes seleccionar una clase destino', 'error');
      return;
    }

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/clases-alumnos`, {
        id_alumno,
        id_clase_actual: parseInt(claseSeleccionada),
        id_clase_nueva: parseInt(claseNueva)
      });
      
      setClaseNueva('');
      setEditandoAlumnoId(null);
      showMessage(`✅ ${alumnoNombre} cambiado de clase exitosamente`, 'success');
      
      // Actualizar lista de inscriptos
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/clases-alumnos/por-clase/${claseSeleccionada}`);
      setInscriptos(res.data);
    } catch (err) {
      console.error('Error al cambiar alumno:', err);
      showMessage('❌ Error al cambiar al alumno de clase', 'error');
    }
  };

  const eliminarInscripcion = async (id_alumno, alumnoNombre) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar a ${alumnoNombre} de esta clase?`)) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/clases-alumnos`, {
        data: { id_alumno, id_clase: parseInt(claseSeleccionada) }
      });
      
      setInscriptos(prev => prev.filter(a => a.id_alumno !== id_alumno));
      showMessage(`✅ ${alumnoNombre} eliminado de la clase`, 'success');
    } catch (err) {
      console.error('Error al eliminar inscripción:', err);
      showMessage('❌ Error al eliminar la inscripción', 'error');
    }
  };

  const handleSelectStudent = (id) => {
    setNuevoAlumno(id);
  };

  const cancelarEdicion = () => {
    setEditandoAlumnoId(null);
    setClaseNueva('');
  };

  const claseSeleccionadaInfo = clases.find(c => c.id_clase === parseInt(claseSeleccionada));

  return (
    <div className="inscripciones-page-wrapper">
      <div className="inscripciones-container">
        <div className="inscripciones-page-header">
          <div className="inscripciones-header-icon">
            <FaUserGraduate />
          </div>
          <h1 className="inscripciones-main-title">Gestión de Inscripciones</h1>
          <p className="inscripciones-subtitle">Administra las inscripciones de alumnos a las clases</p>
        </div>

        <div className="inscripciones-main-content">
          <div className="inscripciones-form-section">
            <div className="inscripciones-section-header">
              <label className="inscripciones-section-label">
                <FaUsers className="inscripciones-label-icon" />
                Inscripción de Alumnos
              </label>
            </div>

            {message.text && (
              <div className={`inscripciones-message inscripciones-${message.type}`}>
                <div className="inscripciones-message-icon">
                  {message.type === 'success' ? '✅' : '❌'}
                </div>
                {message.text}
              </div>
            )}

            <div className="inscripciones-controls-card">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <FaChalkboardTeacher className="label-icon" />
                    Seleccionar Clase
                  </label>
                  <div className="select-wrapper">
                    <FaCalendarAlt className="select-icon" />
                    <select 
                      value={claseSeleccionada} 
                      onChange={(e) => setClaseSeleccionada(e.target.value)}
                      className="form-select"
                    >
                      <option value="">-- Seleccionar clase --</option>
                      {clases.map(clase => (
                        <option key={clase.id_clase} value={clase.id_clase}>
                          Clase {clase.id_clase} - {clase.nivel_nombre} ({clase.dia_nombre})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {claseSeleccionada && (
                  <>
                    <div className="form-group">
                      <label className="form-label">
                        <FaSearch className="label-icon" />
                        Buscar Alumno para Inscribir
                      </label>
                      <StudentSearch onSelectStudent={handleSelectStudent} />
                    </div>

                    <div className="action-buttons">
                      <button 
                        onClick={inscribirAlumno}
                        className="action-btn primary-btn"
                        disabled={!nuevoAlumno}
                      >
                        <FaPlus className="btn-icon" />
                        Inscribir Alumno
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Lista de alumnos inscriptos */}
            {claseSeleccionada && (
              <div className="inscriptos-container inscripciones-content-card">
                <div className="inscriptos-header">
                  <div className="inscriptos-title">
                    <FaUsers className="inscriptos-icon" />
                    <h3>
                      Alumnos Inscriptos - {claseSeleccionadaInfo?.nivel_nombre} ({claseSeleccionadaInfo?.dia_nombre})
                    </h3>
                  </div>
                  <span className="inscriptos-count">
                    {inscriptos.length} alumno{inscriptos.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {isLoading ? (
                  <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Cargando alumnos inscriptos...</p>
                  </div>
                ) : inscriptos.length > 0 ? (
                  <div className="alumnos-grid">
                    {inscriptos.map(alumno => (
                      <div key={alumno.id_alumno} className="alumno-card">
                        <div className="alumno-info">
                          <div className="alumno-avatar">
                            <FaUserGraduate className="avatar-icon" />
                          </div>
                          <div className="alumno-details">
                            <h4 className="alumno-name">{alumno.nombre_alumno}</h4>
                            <span className="alumno-id">ID: {alumno.id_alumno}</span>
                          </div>
                        </div>

                        <div className="alumno-actions">
                          {editandoAlumnoId === alumno.id_alumno ? (
                            <div className="edicion-container">
                              <div className="clase-select-wrapper">
                                <select 
                                  value={claseNueva} 
                                  onChange={(e) => setClaseNueva(e.target.value)}
                                  className="clase-select"
                                >
                                  <option value="">-- Seleccionar clase destino --</option>
                                  {clases
                                    .filter(c => c.id_clase !== parseInt(claseSeleccionada))
                                    .map(c => (
                                      <option key={c.id_clase} value={c.id_clase}>
                                        Clase {c.id_clase} - {c.nivel_nombre} ({c.dia_nombre})
                                      </option>
                                    ))}
                                </select>
                              </div>
                              <div className="edicion-buttons">
                                <button 
                                  onClick={() => cambiarAlumnoDeClase(alumno.id_alumno, alumno.nombre_alumno)}
                                  className="action-btn save-btn"
                                  disabled={!claseNueva}
                                >
                                  <FaSave className="btn-icon" />
                                  Guardar
                                </button>
                                <button 
                                  onClick={cancelarEdicion}
                                  className="action-btn cancel-btn"
                                >
                                  <FaTimes className="btn-icon" />
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="acciones-buttons">
                              <button 
                                onClick={() => setEditandoAlumnoId(alumno.id_alumno)}
                                className="action-btn edit-btn"
                                title="Cambiar de clase"
                              >
                                <FaExchangeAlt className="btn-icon" />
                                Cambiar
                              </button>
                              <button 
                                onClick={() => eliminarInscripcion(alumno.id_alumno, alumno.nombre_alumno)}
                                className="action-btn delete-btn"
                                title="Eliminar inscripción"
                              >
                                <FaTrash className="btn-icon" />
                                Eliminar
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <FaUsers className="empty-icon" />
                    <h4>No hay alumnos inscriptos</h4>
                    <p>Utiliza el buscador para inscribir alumnos en esta clase</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inscripciones;