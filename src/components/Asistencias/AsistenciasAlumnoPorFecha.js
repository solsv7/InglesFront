import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaCalendarDay, 
  FaSearch, 
  FaUserCheck, 
  FaUserTimes, 
  FaClock,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaChalkboardTeacher
} from 'react-icons/fa';
import './AsistenciasAlumnoPorFecha.css';

const AsistenciasAlumnoPorFecha = () => {
  const [fecha, setFecha] = useState('');
  const [asistencias, setAsistencias] = useState([]);
  const [idAlumno, setIdAlumno] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setIdAlumno(storedUser?.id_alumno);
  }, []);

  const buscar = async () => {
    if (!fecha) {
      setError('Por favor selecciona una fecha');
      return;
    }

    setLoading(true);
    setError(null);
    setAsistencias([]);

    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/asistencia/fecha`, {
        params: { id_alumno: idAlumno, fecha }
      });
      setAsistencias(res.data);
    } catch (error) {
      console.error('Error al obtener asistencias:', error);
      setError('Error al cargar las asistencias. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const limpiarBusqueda = () => {
    setFecha('');
    setAsistencias([]);
    setError(null);
  };

  const getEstadoAsistencia = (presente) => {
    return presente ? 'presente' : 'ausente';
  };

  const getIconoAsistencia = (presente) => {
    return presente ? <FaUserCheck /> : <FaUserTimes />;
  };

  const getTextoAsistencia = (presente) => {
    return presente ? 'Presente' : 'Ausente';
  };

  const getColorAsistencia = (presente) => {
    return presente ? '#48bb78' : '#e53e3e';
  };

  const estaHoy = new Date().toISOString().split('T')[0];
  const fechaSeleccionada = new Date(fecha);
  const hoy = new Date();

  return (
    <div className="fecha-asistencias-container">
      {/* Header */}
      <div className="fecha-header">
        <FaCalendarDay className="fecha-header-icon" />
        <div className="fecha-header-content">
          <h2>Asistencias por Fecha</h2>
          <p>Consulta tu asistencia para una fecha específica</p>
        </div>
      </div>

      {/* Formulario de Búsqueda */}
      <div className="formulario-fecha">
        <div className="form-header">
          <FaSearch className="form-icon" />
          <h3>Selecciona una Fecha</h3>
        </div>
        
        <div className="fecha-input-container">
          <div className="fecha-input-group">
            <label htmlFor="fechaBusqueda">Fecha a Consultar</label>
            <div className="input-wrapper">
              <input 
                type="date" 
                id="fechaBusqueda"
                value={fecha} 
                onChange={e => setFecha(e.target.value)}
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
            disabled={loading || !fecha}
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

      {/* Resumen Rápido */}
      {asistencias.length > 0 && (
        <div className="resumen-fecha">
          <div className="resumen-header">
            <FaCalendarAlt className="resumen-icon" />
            <h3>Resumen del {new Date(fecha).toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</h3>
          </div>
          <div className="resumen-stats">
            <div className="stat-item">
              <span className="stat-number">{asistencias.length}</span>
              <span className="stat-label">Total Clases</span>
            </div>
            <div className="stat-item">
              <span className="stat-number" style={{ color: '#48bb78' }}>
                {asistencias.filter(a => a.presente).length}
              </span>
              <span className="stat-label">Asistencias</span>
            </div>
            <div className="stat-item">
              <span className="stat-number" style={{ color: '#e53e3e' }}>
                {asistencias.filter(a => !a.presente).length}
              </span>
              <span className="stat-label">Faltas</span>
            </div>
            <div className="stat-item">
              <span className="stat-number" style={{ color: '#48bb78' }}>
                {Math.round((asistencias.filter(a => a.presente).length / asistencias.length) * 100)}%
              </span>
              <span className="stat-label">Asistencia</span>
            </div>
          </div>
        </div>
      )}

      {/* Resultados */}
      {asistencias.length > 0 ? (
        <div className="resultados-fecha-container">
          <div className="resultados-header">
            <FaChalkboardTeacher className="resultados-icon" />
            <h3>Detalle de Clases</h3>
            <span className="total-clases">{asistencias.length} clase{asistencias.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="clases-grid">
            {asistencias.map((asistencia, index) => (
              <div 
                key={index} 
                className={`clase-card ${getEstadoAsistencia(asistencia.presente)}`}
              >
                <div className="clase-header">
                  <div className="clase-info">
                    <h4 className="clase-nombre">{asistencia.nivel || 'Clase'}</h4>
                    <span className="clase-dia">{asistencia.dia}</span>
                  </div>
                  <div 
                    className="estado-asistencia"
                    style={{ backgroundColor: getColorAsistencia(asistencia.presente) }}
                  >
                    {getIconoAsistencia(asistencia.presente)}
                    <span>{getTextoAsistencia(asistencia.presente)}</span>
                  </div>
                </div>

                <div className="clase-horario">
                  <div className="horario-item">
                    <FaClock className="horario-icon" />
                    <div className="horario-info">
                      <span className="horario-label">Inicio</span>
                      <span className="horario-hora">
                        {asistencia.hora_inicio?.slice(0, 5) || '--:--'}
                      </span>
                    </div>
                  </div>
                  <div className="horario-separator"></div>
                  <div className="horario-item">
                    <FaClock className="horario-icon" />
                    <div className="horario-info">
                      <span className="horario-label">Fin</span>
                      <span className="horario-hora">
                        {asistencia.hora_fin?.slice(0, 5) || '--:--'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="clase-footer">
                  <div className="clase-fecha">
                    {new Date(fecha).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabla Alternativa para Vista Detallada */}
          
        </div>
      ) : !loading && !error && fecha && (
        <div className="estado-sin-resultados">
          <FaCalendarDay className="sin-resultados-icon" />
          <h3>No hay clases registradas</h3>
          <p>No se encontraron clases para la fecha seleccionada</p>
        </div>
      )}

      {/* Estado Vacío */}
      {!asistencias.length && !loading && !error && !fecha && (
        <div className="estado-vacio">
          <FaCalendarDay className="vacio-icon" />
          <h3>Selecciona una fecha</h3>
          <p>Elige una fecha específica para ver tu asistencia</p>
        </div>
      )}
    </div>
  );
};

export default AsistenciasAlumnoPorFecha;