import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TotalesPorRango.css';

const TotalesPorRango = () => {
  const [idClase, setIdClase] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [totales, setTotales] = useState([]);
  const [clases, setClases] = useState([]);

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
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/asistencia/totales-rango`, {
        params: {
          id_clase: idClase,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin
        }
      });
      setTotales(res.data);
    } catch (error) {
      console.error('Error al obtener totales por rango:', error);
    }
  };

  const limpiarFiltros = () => {
    setIdClase('');
    setFechaInicio('');
    setFechaFin('');
    setTotales([]);
  };

  const claseSeleccionada = clases.find(clase => clase.id_clase === parseInt(idClase));
  const totalAlumnos = totales.length;
  const totalAsistencias = totales.reduce((sum, a) => sum + a.total_asistencias, 0);
  const totalInasistencias = totales.reduce((sum, a) => sum + a.total_inasistencias, 0);

  return (
    <div className="totales-clase-container">
      {/* Header */}
      <div className="totales-header">
        <div className="totales-header-icon"></div>
        <div className="totales-header-content">
          <h2>Totales por Rango de Fechas</h2>
          <p>Consulta los totales de asistencia en un período específico</p>
        </div>
      </div>

      {/* Formulario de búsqueda */}
      <div className="formulario-totales">
        <div className="form-header-asistencias-clases">
          <h3>Configurar Rango de Fechas</h3>
        </div>
        
        <div className="clase-select-container">
          <div className="rango-inputs-container">
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
                      {clase.nivel_nombre} - {clase.dia_nombre} - {clase.hora_inicio.slice(0, 5)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="fecha-input-group">
              <label htmlFor="fecha-inicio">Fecha Inicio</label>
              <div className="input-wrapper">
                <input 
                  id="fecha-inicio"
                  type="date" 
                  className="fecha-input"
                  value={fechaInicio} 
                  onChange={e => setFechaInicio(e.target.value)} 
                />
              </div>
            </div>

            <div className="fecha-input-group">
              <label htmlFor="fecha-fin">Fecha Fin</label>
              <div className="input-wrapper">
                <input 
                  id="fecha-fin"
                  type="date" 
                  className="fecha-input"
                  value={fechaFin} 
                  onChange={e => setFechaFin(e.target.value)} 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            className="btn-buscar" 
            onClick={buscar}
            disabled={!idClase || !fechaInicio || !fechaFin}
          >
            Generar Reporte
          </button>
          <button 
            className="btn-limpiar" 
            onClick={limpiarFiltros}
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Resumen del rango */}
      {totales.length > 0 && (
        <div className="resumen-rango">
          <div className="resultados-asistencias-header">
            <div className="resultados-asistencias-icon">📊</div>
            <h3>Resumen del Período</h3>
          </div>
          <div className="resumen-info">
            <div className="info-item">
              <span className="info-label">Clase Seleccionada</span>
              <span className="info-value">
                {claseSeleccionada ? 
                  `${claseSeleccionada.nivel_nombre} - ${claseSeleccionada.dia_nombre} - ${claseSeleccionada.hora_inicio.slice(0, 5)}` 
                  : 'N/A'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Período</span>
              <span className="info-value">
                {fechaInicio} a {fechaFin}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Total Alumnos</span>
              <span className="info-value">{totalAlumnos}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Total Asistencias</span>
              <span className="info-value">{totalAsistencias}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Total Inasistencias</span>
              <span className="info-value">{totalInasistencias}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de resultados */}
      {totales.length > 0 && (
        <div className="resultados-totales-container">
          <div className="resultados-asistencias-header">
            <div className="resultados-asistencias-icon">📋</div>
            <h3>Resultados del Reporte</h3>
            <div className="total-registros">
              {totales.length} alumno{totales.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="totales-table-container">
            <table className="totales-table">
              <thead>
                <tr>
                  <th>Alumno</th>
                  <th>Total Asistencias</th>
                  <th>Total Inasistencias</th>
                  <th>% Asistencia</th>
                  <th>% Inasistencia</th>
                </tr>
              </thead>
              <tbody>
                {totales.map(a => (
                  <tr key={a.id_alumno}>
                    <td>{a.nombre_alumno}</td>
                    <td>{a.total_asistencias}</td>
                    <td>{a.total_inasistencias}</td>
                    <td className={a.porcentaje_asistencia >= 70 ? 'porcentaje-alto' : 'porcentaje-bajo'}>
                      {a.porcentaje_asistencia}%
                    </td>
                    <td className={a.porcentaje_inasistencia <= 30 ? 'porcentaje-bajo' : 'porcentaje-alto'}>
                      {a.porcentaje_inasistencia}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Estado sin resultados */}
      {idClase && fechaInicio && fechaFin && totales.length === 0 && (
        <div className="estado-sin-resultados">
          <div className="sin-resultados-icon">📭</div>
          <h3>No se encontraron resultados</h3>
          <p>No hay registros de asistencia para el rango de fechas seleccionado</p>
        </div>
      )}

      {/* Estado inicial */}
      {!idClase && !fechaInicio && !fechaFin && (
        <div className="estado-vacio">
          <div className="vacio-icon">👆</div>
          <h3>Configura tu búsqueda</h3>
          <p>Selecciona una clase y define un rango de fechas para generar el reporte</p>
        </div>
      )}
    </div>
  );
};

export default TotalesPorRango;