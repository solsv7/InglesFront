import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VerAsistenciasPorFecha.css';

const VerAsistenciasPorFecha = () => {
  const [fecha, setFecha] = useState('');
  const [idClase, setIdClase] = useState('');
  const [asistencias, setAsistencias] = useState([]);
  const [clases, setClases] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [haBuscado, setHaBuscado] = useState(false);

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
    
    setCargando(true);
    setHaBuscado(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/asistencia/por-clase-fecha?id_clase=${idClase}&fecha=${fecha}`);
      setAsistencias(res.data);
    } catch (error) {
      console.error('Error al obtener asistencias:', error);
      setAsistencias([]);
    } finally {
      setCargando(false);
    }
  };

  const claseSeleccionada = clases.find(c => c.id_clase === parseInt(idClase));
  const totalPresentes = asistencias.filter(a => a.presente).length;
  const totalAlumnos = asistencias.length;

  return (
    <div className="totales-clase-container">
      {/* Header */}
      <div className="totales-header">
        <div className="totales-header-icon"></div>
        <div className="totales-header-content">
          <h2>Asistencias por Clase y Fecha</h2>
          <p>Consulta las asistencias registradas para una clase específica</p>
        </div>
      </div>

      {/* Formulario de búsqueda */}
      <div className="formulario-totales">
        <div className="form-header-asistencias-clases">
          <h3>Seleccionar Fecha y Clase</h3>
        </div>
        
        <div className="clase-select-container">
          <div className="rango-inputs-container">
            <div className="fecha-input-group">
              <label htmlFor="fecha-consulta">Fecha</label>
              <div className="input-wrapper">
                <input 
                  id="fecha-consulta"
                  type="date" 
                  className="fecha-input"
                  value={fecha} 
                  onChange={e => setFecha(e.target.value)}
                />
              </div>
            </div>

            <div className="clase-select-group">
              <label htmlFor="clase-select">Seleccionar Clase</label>
              <div className="select-wrapper">
                <select 
                  id="clase-select"
                  className="clase-select"
                  value={idClase} 
                  onChange={e => setIdClase(e.target.value)}
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
          </div>
        </div>

        <div className="form-actions">
          <button 
            className="btn-buscar" 
            onClick={buscar}
            disabled={!fecha || !idClase || cargando}
          >
            {cargando ? 'Buscando...' : 'Buscar Asistencias'}
          </button>
        </div>
      </div>

      {/* Información de la consulta */}
      {haBuscado && asistencias.length > 0 && claseSeleccionada && (
        <div className="resumen-rango">
          <div className="resultados-asistencias-header">
            <div className="resultados-asistencias-icon">📅</div>
            <h3>Información de la Consulta</h3>
          </div>
          <div className="resumen-info">
            <div className="info-item">
              <span className="info-label">Clase</span>
              <span className="info-value">
                {claseSeleccionada.nivel_nombre} - {claseSeleccionada.dia_nombre}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Fecha</span>
              <span className="info-value">
                {new Date(fecha).toLocaleDateString('es-ES')}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Hora</span>
              <span className="info-value">
                {claseSeleccionada.hora_inicio?.slice(0, 5)}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Asistencia</span>
              <span className="info-value">
                {totalPresentes}/{totalAlumnos} presentes
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de resultados */}
      {haBuscado && asistencias.length > 0 && (
        <div className="resultados-totales-container">
          <div className="resultados-asistencias-header">
            <div className="resultados-asistencias-icon">✅</div>
            <h3>Asistencias Registradas</h3>
            <div className="total-registros">
              {asistencias.length} alumno{asistencias.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="totales-table-container">
            <table className="totales-table">
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
                        <span className="alumno-nombre">{a.nombre_alumno}</span>
                      </div>
                    </td>
                    <td className={a.presente ? 'estado-presente' : 'estado-ausente'}>
                      {a.presente ? 'Presente' : 'Ausente'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Estado de carga */}
      {cargando && (
        <div className="estado-cargando">
          <div className="cargando-icon">⏳</div>
          <h3>Cargando asistencias...</h3>
          <p>Buscando registros para la fecha y clase seleccionadas</p>
        </div>
      )}

      {/* Estado sin resultados */}
      {haBuscado && !cargando && asistencias.length === 0 && (
        <div className="estado-sin-resultados">
          <div className="sin-resultados-icon">📭</div>
          <h3>No se encontraron asistencias</h3>
          <p>No hay registros de asistencia para la fecha y clase seleccionadas</p>
        </div>
      )}

      {/* Estado inicial */}
      {!haBuscado && !cargando && (
        <div className="estado-vacio">
          <div className="vacio-icon">👆</div>
          <h3>Configura tu búsqueda</h3>
          <p>Selecciona una fecha y una clase para consultar las asistencias</p>
        </div>
      )}
    </div>
  );
};

export default VerAsistenciasPorFecha;