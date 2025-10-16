import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaCalendarAlt, 
  FaSearch, 
  FaChartBar, 
  FaUserCheck, 
  FaUserTimes, 
  FaPercentage,
  FaExclamationTriangle 
} from 'react-icons/fa';
import './AsistenciasAlumnoPorRango.css';

const AsistenciasAlumnoPorRango = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [resultado, setResultado] = useState(null);
  const [idAlumno, setIdAlumno] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setIdAlumno(storedUser?.id_alumno);
  }, []);

  const buscar = async () => {
    if (!fechaInicio || !fechaFin) {
      setError('Por favor selecciona ambas fechas');
      return;
    }

    if (new Date(fechaInicio) > new Date(fechaFin)) {
      setError('La fecha de inicio no puede ser mayor a la fecha final');
      return;
    }

    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/asistencia/rango`, {
        params: { 
          id_alumno: idAlumno, 
          fecha_inicio: fechaInicio, 
          fecha_fin: fechaFin 
        }
      });
      setResultado(res.data[0]);
    } catch (error) {
      console.error('Error al obtener datos:', error);
      setError('Error al cargar los datos. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const limpiarBusqueda = () => {
    setFechaInicio('');
    setFechaFin('');
    setResultado(null);
    setError(null);
  };

  const getAsistenciaColor = (porcentaje) => {
    if (porcentaje >= 90) return '#48bb78';
    if (porcentaje >= 75) return '#ed8936';
    return '#e53e3e';
  };

  const getInasistenciaColor = (porcentaje) => {
    if (porcentaje <= 10) return '#48bb78';
    if (porcentaje <= 25) return '#ed8936';
    return '#e53e3e';
  };

  const estaHoy = new Date().toISOString().split('T')[0];

  return (
    <div className="rango-asistencias-container">
      {/* Header */}
      <div className="rango-header">
        <FaCalendarAlt className="rango-header-icon" />
        <div className="rango-header-content">
          <h2>Asistencias por Rango de Fechas</h2>
          <p>Consulta tu asistencia en un período específico de tiempo</p>
        </div>
      </div>

      {/* Formulario de Búsqueda */}
      <div className="formulario-rango">
        <div className="form-header">
          <FaSearch className="form-icon" />
          <h3>Selecciona el Rango</h3>
        </div>
        
        <div className="fechas-container">
          <div className="fecha-input-group">
            <label htmlFor="fechaInicio">Fecha Inicio</label>
            <div className="input-wrapper">
              <input 
                type="date" 
                id="fechaInicio"
                value={fechaInicio} 
                onChange={e => setFechaInicio(e.target.value)}
                max={fechaFin || estaHoy}
                className="fecha-input"
              />
            </div>
          </div>

          <div className="fecha-separator">-</div>

          <div className="fecha-input-group">
            <label htmlFor="fechaFin">Fecha Fin</label>
            <div className="input-wrapper">
              <input 
                type="date" 
                id="fechaFin"
                value={fechaFin} 
                onChange={e => setFechaFin(e.target.value)}
                min={fechaInicio}
                max={estaHoy}
                className="fecha-input"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            onClick={buscar} 
            className="btn-buscar"
            disabled={loading || !fechaInicio || !fechaFin}
          >
            <FaSearch className="btn-icon" />
            {loading ? 'Buscando...' : 'Buscar Asistencias'}
          </button>
          
          <button 
            onClick={limpiarBusqueda} 
            className="btn-limpiar"
            disabled={loading}
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Mensaje de Error */}
      {error && (
        <div className="error-message">
          <FaExclamationTriangle className="error-icon" />
          <span>{error}</span>
        </div>
      )}

      {/* Resultados */}
      {resultado && (
        <div className="resultados-container">
          <div className="resultados-header">
            <FaChartBar className="resultados-icon" />
            <h3>Resultados del Período</h3>
            <span className="rango-fechas">
              {new Date(fechaInicio).toLocaleDateString()} - {new Date(fechaFin).toLocaleDateString()}
            </span>
          </div>

          {/* Tarjetas de Métricas */}
          <div className="metricas-rango-grid">
            <div className="metrica-rango-card">
              <div className="metrica-rango-icon total">
                <FaCalendarAlt />
              </div>
              <div className="metrica-rango-content">
                <h4>{resultado.total_clases || 0}</h4>
                <p>Total Clases</p>
              </div>
            </div>

            <div className="metrica-rango-card">
              <div className="metrica-rango-icon presentes">
                <FaUserCheck />
              </div>
              <div className="metrica-rango-content">
                <h4>{resultado.total_presentes || 0}</h4>
                <p>Asistencias</p>
              </div>
            </div>

            <div className="metrica-rango-card">
              <div className="metrica-rango-icon faltas">
                <FaUserTimes />
              </div>
              <div className="metrica-rango-content">
                <h4>{resultado.total_faltas || 0}</h4>
                <p>Faltas</p>
              </div>
            </div>

            <div className="metrica-rango-card">
              <div className="metrica-rango-icon porcentaje">
                <FaPercentage />
              </div>
              <div className="metrica-rango-content">
                <h4 style={{ color: getAsistenciaColor(resultado.porcentaje_asistencia || 0) }}>
                  {resultado.porcentaje_asistencia || 0}%
                </h4>
                <p>Asistencia</p>
              </div>
            </div>

            <div className="metrica-rango-card">
              <div className="metrica-rango-icon porcentaje">
                <FaPercentage />
              </div>
              <div className="metrica-rango-content">
                <h4 style={{ color: getInasistenciaColor(resultado.porcentaje_inasistencia || 0) }}>
                  {resultado.porcentaje_inasistencia || 0}%
                </h4>
                <p>Inasistencia</p>
              </div>
            </div>
          </div>

          {/* Tabla de Resultados */}
          <div className="tabla-rango-container">
            <table className="rango-table">
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
                  <td data-label="Total Clases">{resultado.total_clases || 0}</td>
                  <td data-label="Presentes">{resultado.total_presentes || 0}</td>
                  <td data-label="Faltas">{resultado.total_faltas || 0}</td>
                  <td 
                    data-label="% Asistencia"
                    style={{ color: getAsistenciaColor(resultado.porcentaje_asistencia || 0) }}
                  >
                    {resultado.porcentaje_asistencia || 0}%
                  </td>
                  <td 
                    data-label="% Inasistencia"
                    style={{ color: getInasistenciaColor(resultado.porcentaje_inasistencia || 0) }}
                  >
                    {resultado.porcentaje_inasistencia || 0}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Análisis del Resultado */}
          <div className="analisis-resultado">
            <div className="analisis-header">
              <FaChartBar className="analisis-icon" />
              <h4>Análisis del Período</h4>
            </div>
            <div className="analisis-content">
              <p>
                En el período del <strong>{new Date(fechaInicio).toLocaleDateString()}</strong> al{' '}
                <strong>{new Date(fechaFin).toLocaleDateString()}</strong>, asististe a{' '}
                <strong>{resultado.total_presentes || 0}</strong> de{' '}
                <strong>{resultado.total_clases || 0}</strong> clases, lo que representa un{' '}
                <strong>{resultado.porcentaje_asistencia || 0}%</strong> de asistencia.
              </p>
              
            </div>
          </div>
        </div>
      )}

      {/* Estado Vacío */}
      {!resultado && !loading && !error && (
        <div className="estado-vacio">
          <FaCalendarAlt className="vacio-icon" />
          <h3>Selecciona un rango de fechas</h3>
          <p>Elige las fechas de inicio y fin para ver tu asistencia en ese período</p>
        </div>
      )}
    </div>
  );
};

export default AsistenciasAlumnoPorRango;