import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaUser, FaCheck, FaTimes, FaCalendarAlt, FaChalkboardTeacher, FaUsers } from 'react-icons/fa';
import './VerAsistenciasPorFecha.css';

const VerAsistenciasPorFecha = () => {
  const [fecha, setFecha] = useState('');
  const [idClase, setIdClase] = useState('');
  const [asistencias, setAsistencias] = useState([]);
  const [clases, setClases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const fetchClases = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/clases`);
        setClases(res.data);
      } catch (error) {
        console.error('Error al obtener clases:', error);
      }
    };
    fetchClases();
  }, []);

  const buscar = async () => {
    if (!fecha || !idClase) return;
    
    setIsLoading(true);
    setHasSearched(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/asistencia/por-clase-fecha?id_clase=${idClase}&fecha=${fecha}`);
      setAsistencias(res.data);
    } catch (error) {
      console.error('Error al obtener asistencias:', error);
      setAsistencias([]);
    } finally {
      setIsLoading(false);
    }
  };

  const claseSeleccionada = clases.find(c => c.id_clase === parseInt(idClase));
  const totalPresentes = asistencias.filter(a => a.presente).length;
  const totalAlumnos = asistencias.length;

  return (
    <div className="ver-asistencias-container">
      <div className="ver-asistencias-header">
        <h2 className="ver-asistencias-title">Asistencias por Clase y Fecha</h2>
        <p className="ver-asistencias-subtitle">Consulta las asistencias registradas para una clase específica</p>
      </div>

      <div className="busqueda-card">
        <div className="busqueda-form">
          <div className="form-group">
            <label className="form-label">
              <FaCalendarAlt className="label-icon" />
              Fecha
            </label>
            <div className="input-wrapper">
              <input 
                type="date" 
                value={fecha} 
                onChange={e => setFecha(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <FaChalkboardTeacher className="label-icon" />
              Clase
            </label>
            <div className="select-wrapper">
              <select 
                value={idClase} 
                onChange={e => setIdClase(e.target.value)}
                className="form-select"
              >
                <option value="">Seleccionar clase</option>
                {clases.map(clase => (
                  <option key={clase.id_clase} value={clase.id_clase}>
                    {clase.nivel_nombre} - {clase.dia_nombre} - {clase.hora_inicio?.slice(0, 5)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button 
            onClick={buscar} 
            className="buscar-btn"
            disabled={!fecha || !idClase || isLoading}
          >
            <FaSearch className="btn-icon" />
            {isLoading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </div>

      {hasSearched && (
        <div className={`resultados-container ${asistencias.length > 0 ? 'has-data' : ''}`}>
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Cargando asistencias...</p>
            </div>
          ) : asistencias.length > 0 ? (
            <>
              <div className="resultados-header">
                <h3 className="resultados-title">Resultados de la Búsqueda</h3>
                <span className="resultados-count">
                  {totalPresentes}/{totalAlumnos} presentes
                </span>
              </div>

              {claseSeleccionada && (
                <div className="consulta-info">
                  <FaUsers className="consulta-icon" />
                  <div className="consulta-details">
                    <h4 className="consulta-title">
                      {claseSeleccionada.nivel_nombre} - {claseSeleccionada.dia_nombre}
                    </h4>
                    <p className="consulta-subtitle">
                      Fecha: {new Date(fecha).toLocaleDateString('es-ES')} | 
                      Hora: {claseSeleccionada.hora_inicio?.slice(0, 5)}
                    </p>
                  </div>
                </div>
              )}

              <table className="asistencias-table">
                <thead>
                  <tr>
                    <th>Alumno</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {asistencias.map(a => (
                    <tr key={a.id_alumno}>
                      <td>
                        <div className="alumno-info">
                          <div className="alumno-avatar">
                            <FaUser />
                          </div>
                          <span className="alumno-nombre">{a.nombre_alumno}</span>
                        </div>
                      </td>
                      <td>
                        <div className={`estado-asistencia ${a.presente ? 'estado-presente' : 'estado-ausente'}`}>
                          {a.presente ? (
                            <>
                              <FaCheck className="estado-icon" />
                              <span>Presente</span>
                            </>
                          ) : (
                            <>
                              <FaTimes className="estado-icon" />
                              <span>Ausente</span>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <div className="empty-state">
              <FaSearch className="empty-icon" />
              <h3>No se encontraron asistencias</h3>
              <p>No hay registros de asistencia para la fecha y clase seleccionadas</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VerAsistenciasPorFecha;