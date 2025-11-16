import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TotalesPorClase.css';

const TotalesPorClase = () => {
  const [idClase, setIdClase] = useState('');
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
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/asistencia/totales/${idClase}`);
      setTotales(res.data);
    } catch (error) {
      console.error('Error al obtener totales:', error);
    }
  };

  return (
    <div className="totales-clase-container">
      {/* Header */}
      <div className="totales-header">
        <div className="totales-header-icon"></div>
        <div className="totales-header-content">
          <h2>Asistencia por Clase</h2>
          <p>Consulta los totales de asistencia e inasistencia por alumno</p>
        </div>
      </div>

      {/* Formulario de búsqueda */}
      <div className="formulario-totales">
        <div className="form-header-asistencias-clases">
          <h3>Buscar Totales por Clase</h3>
        </div>
        
        <div className="clase-select-container">
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
        </div>

        <div className="form-actions">
          <button 
            className="btn-buscar" 
            onClick={buscar}
            disabled={!idClase}
          >
            Buscar asistencias
          </button>
        </div>
      </div>

      {/* Tabla de resultados */}
      {totales.length > 0 && (
        <div className="resultados-totales-container">
          <div className="resultados-asistencias-header">
            <div className="resultados-asistencias-icon">📋</div>
            <h3>Asistencia en la clase</h3>
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

      {/* Estado vacío */}
      {idClase && totales.length === 0 && (
        <div className="estado-sin-resultados">
          <div className="sin-resultados-icon">📭</div>
          <h3>No se encontraron resultados</h3>
          <p>No hay registros de asistencia para la clase seleccionada</p>
        </div>
      )}

      {/* Estado inicial */}
      {!idClase && (
        <div className="estado-vacio">
          <div className="vacio-icon">👆</div>
          <h3>Selecciona una clase</h3>
          <p>Elige una clase del menú desplegable para generar el reporte de totales</p>
        </div>
      )}
    </div>
  );
};

export default TotalesPorClase;