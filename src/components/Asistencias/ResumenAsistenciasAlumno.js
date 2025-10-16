import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaChartBar, FaUsers, FaUserCheck, FaUserTimes, FaPercentage, FaCalendarAlt } from 'react-icons/fa';
import './ResumenAsistenciasAlumno.css';

const ResumenAsistenciasAlumno = () => {
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const id_alumno = storedUser?.id_alumno;

    if (id_alumno) {
      setLoading(true);
      axios.get(`${process.env.REACT_APP_API_URL}/api/asistencia/resumen/${id_alumno}`)
        .then(res => {
          setResumen(res.data[0]);
          setError(null);
        })
        .catch(err => {
          console.error('Error al obtener resumen:', err);
          setError('Error al cargar el resumen de asistencias');
        })
        .finally(() => setLoading(false));
    } else {
      setError('No se pudo identificar al usuario');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="resumen-loading">
        <div className="loading-spinner"></div>
        <p>Cargando resumen de asistencias...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="resumen-error">
        <FaUserTimes className="error-icon" />
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!resumen) {
    return (
      <div className="resumen-empty">
        <FaChartBar className="empty-icon" />
        <h3>No hay datos disponibles</h3>
        <p>No se encontró información de asistencias</p>
      </div>
    );
  }

  const getAsistenciaColor = (porcentaje) => {
    if (porcentaje >= 90) return '#48bb78'; // Verde - Excelente
    if (porcentaje >= 75) return '#ed8936'; // Naranja - Bueno
    return '#e53e3e'; // Rojo - Necesita mejorar
  };

  const getInasistenciaColor = (porcentaje) => {
    if (porcentaje <= 10) return '#48bb78'; // Verde - Excelente
    if (porcentaje <= 25) return '#ed8936'; // Naranja - Aceptable
    return '#e53e3e'; // Rojo - Preocupante
  };

  return (
    <div className="resumen-asistencias-container">
      {/* Tarjetas de Métricas */}
      <div className="metricas-grid">
        <div className="metrica-card total-clases">
          <div className="metrica-icon">
            <FaCalendarAlt />
          </div>
          <div className="metrica-content">
            <h3 className="metrica-valor">{resumen.total_clases || 0}</h3>
            <p className="metrica-label">Total de Clases</p>
          </div>
        </div>

        <div className="metrica-card presentes">
          <div className="metrica-icon">
            <FaUserCheck />
          </div>
          <div className="metrica-content">
            <h3 className="metrica-valor">{resumen.total_presentes || 0}</h3>
            <p className="metrica-label">Asistencias</p>
          </div>
        </div>

        <div className="metrica-card faltas">
          <div className="metrica-icon">
            <FaUserTimes />
          </div>
          <div className="metrica-content">
            <h3 className="metrica-valor">{resumen.total_faltas || 0}</h3>
            <p className="metrica-label">Faltas</p>
          </div>
        </div>

        <div 
          className="metrica-card porcentaje-asistencia"
          style={{ '--color-indicator': getAsistenciaColor(resumen.porcentaje_asistencia || 0) }}
        >
          <div className="metrica-icon">
            <FaPercentage />
          </div>
          <div className="metrica-content">
            <h3 className="metrica-valor">{resumen.porcentaje_asistencia || 0}%</h3>
            <p className="metrica-label">Asistencia</p>
          </div>
        </div>

        <div 
          className="metrica-card porcentaje-inasistencia"
          style={{ '--color-indicator': getInasistenciaColor(resumen.porcentaje_inasistencia || 0) }}
        >
          <div className="metrica-icon">
            <FaPercentage />
          </div>
          <div className="metrica-content">
            <h3 className="metrica-valor">{resumen.porcentaje_inasistencia || 0}%</h3>
            <p className="metrica-label">Inasistencia</p>
          </div>
        </div>
      </div>

      {/* Tabla Resumen */}
      <div className="tabla-resumen-container">
        <div className="tabla-header">
          <FaChartBar className="tabla-icon" />
          <h3>Resumen Detallado</h3>
        </div>
        <div className="tabla-content">
          <table className="resumen-table">
            <thead>
              <tr>
                <th>Total Clases</th>
                <th>Presentes</th>
                <th>Faltas</th>
                <th>% Asistencia</th>
                <th>% Inasistencia</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td data-label="Total Clases">{resumen.total_clases || 0}</td>
                <td data-label="Presentes">{resumen.total_presentes || 0}</td>
                <td data-label="Faltas">{resumen.total_faltas || 0}</td>
                <td 
                  data-label="% Asistencia"
                  style={{ color: getAsistenciaColor(resumen.porcentaje_asistencia || 0) }}
                >
                  {resumen.porcentaje_asistencia || 0}%
                </td>
                <td 
                  data-label="% Inasistencia"
                  style={{ color: getInasistenciaColor(resumen.porcentaje_inasistencia || 0) }}
                >
                  {resumen.porcentaje_inasistencia || 0}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      
    </div>
  );
};

export default ResumenAsistenciasAlumno;