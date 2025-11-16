import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RegistroAsistencias.css';

const RegistroAsistencias = () => {
  const [fecha, setFecha] = useState(() => new Date().toISOString().split('T')[0]);
  const [clases, setClases] = useState([]);
  const [idClase, setIdClase] = useState('');
  const [alumnos, setAlumnos] = useState([]);
  const [totales, setTotales] = useState([]);
  const [asistenciasCargadas, setAsistenciasCargadas] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const fetchClases = async () => {
      try {
        setCargando(true);
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/clases-alumnos/clases-por-fecha?fecha=${fecha}`);
        setClases(res.data);
        setIdClase('');
      } catch (error) {
        console.error('Error al obtener clases por fecha:', error);
      } finally {
        setCargando(false);
      }
    };
    fetchClases();
  }, [fecha]);

  const buscar = async (idClaseSeleccionada) => {
    if (!idClaseSeleccionada) return;
    
    setIdClase(idClaseSeleccionada);
    setCargando(true);
    
    try {
      const [resAsistencias, resAlumnos, resTotales] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/asistencia/por-clase-fecha?id_clase=${idClaseSeleccionada}&fecha=${fecha}`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/clases-alumnos/por-clase/${idClaseSeleccionada}`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/asistencia/totales/${idClaseSeleccionada}`)
      ]);

      const asistencias = resAsistencias.data;
      
      if (asistencias.length > 0) {
        setAsistenciasCargadas(asistencias);
        setAlumnos([]);
      } else {
        const alumnosConEstado = resAlumnos.data.map(alumno => ({
          ...alumno,
          presente: true
        }));
        setAlumnos(alumnosConEstado);
        setAsistenciasCargadas([]);
      }
      
      setTotales(resTotales.data);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    } finally {
      setCargando(false);
    }
  };

  const toggleAsistencia = (id_alumno, presente) => {
    setAlumnos(prev =>
      prev.map(al =>
        al.id_alumno === id_alumno ? { ...al, presente } : al
      )
    );
  };

  const handleRegistrar = async () => {
    try {
      const payload = {
        id_clase: idClase,
        fecha,
        asistencias: alumnos.map(a => ({
          id_alumno: a.id_alumno,
          presente: a.presente ? 1 : 0
        }))
      };
      await axios.post(`${process.env.REACT_APP_API_URL}/api/asistencia/registrar`, payload);
      alert('Asistencias registradas correctamente');
      buscar(idClase);
    } catch (error) {
      console.error('Error al registrar asistencias:', error);
      alert('Error al registrar asistencias');
    }
  };

  const claseSeleccionada = clases.find(clase => clase.id_clase === parseInt(idClase));

  return (
    <div className="totales-clase-container">
      {/* Header */}
      <div className="totales-header">
        <div className="totales-header-icon"></div>
        <div className="totales-header-content">
          <h2>Registro de Asistencias</h2>
          <p>Registra y consulta las asistencias por clase y fecha</p>
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
              <label htmlFor="fecha-registro">Fecha</label>
              <div className="input-wrapper">
                <input 
                  id="fecha-registro"
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
                  onChange={(e) => buscar(e.target.value)}
                  disabled={cargando}
                >
                  <option value="">Seleccionar clase</option>
                  {clases.map(clase => (
                    <option key={clase.id_clase} value={clase.id_clase}>
                      {clase.nivel} - {clase.dia} - {clase.hora_inicio?.slice(0, 5)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estado de carga */}
      {cargando && (
        <div className="estado-cargando">
          <div className="cargando-icon">⏳</div>
          <h3>Cargando datos...</h3>
          <p>Obteniendo información de la clase seleccionada</p>
        </div>
      )}

      {/* Tabla para registrar nuevas asistencias */}
      {idClase && !cargando && alumnos.length > 0 && (
        <div className="resultados-totales-container">
          <div className="resultados-asistencias-header">
            <div className="resultados-asistencias-icon">📝</div>
            <h3>Registrar Asistencia</h3>
            <div className="total-registros">
              {alumnos.length} alumno{alumnos.length !== 1 ? 's' : ''}
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
                {alumnos.map(alumno => (
                  <tr key={alumno.id_alumno}>
                    <td>{alumno.nombre_alumno}</td>
                    <td>
                      <div className="radio-group">
                        <label className={`radio-label ${alumno.presente ? 'radio-selected' : ''}`}>
                          <input
                            type="radio"
                            name={`asistencia-${alumno.id_alumno}`}
                            checked={alumno.presente === true}
                            onChange={() => toggleAsistencia(alumno.id_alumno, true)}
                          />
                          <span className="radio-text presente">Presente</span>
                        </label>
                        <label className={`radio-label ${!alumno.presente ? 'radio-selected' : ''}`}>
                          <input
                            type="radio"
                            name={`asistencia-${alumno.id_alumno}`}
                            checked={alumno.presente === false}
                            onChange={() => toggleAsistencia(alumno.id_alumno, false)}
                          />
                          <span className="radio-text ausente">Ausente</span>
                        </label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="form-actions">
            <button className="btn-buscar" onClick={handleRegistrar}>
              Registrar Asistencias
            </button>
          </div>
        </div>
      )}

      {/* Tabla de asistencias ya registradas */}
      {idClase && !cargando && asistenciasCargadas.length > 0 && (
        <div className="resultados-totales-container">
          <div className="resultados-asistencias-header">
            <div className="resultados-asistencias-icon">✅</div>
            <h3>Asistencias Registradas</h3>
            <div className="total-registros">
              {asistenciasCargadas.length} alumno{asistenciasCargadas.length !== 1 ? 's' : ''}
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
                {asistenciasCargadas.map(a => (
                  <tr key={a.id_alumno}>
                    <td>{a.nombre_alumno}</td>
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

      {/* Tabla de totales */}
      {idClase && !cargando && totales.length > 0 && (
        <div className="resultados-totales-container">
          <div className="resultados-asistencias-header">
            <div className="resultados-asistencias-icon">📊</div>
            <h3>Estadísticas de Asistencia</h3>
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
      {idClase && !cargando && alumnos.length === 0 && asistenciasCargadas.length === 0 && totales.length === 0 && (
        <div className="estado-sin-resultados">
          <div className="sin-resultados-icon">📭</div>
          <h3>No se encontraron datos</h3>
          <p>No hay información disponible para la clase seleccionada</p>
        </div>
      )}

      {/* Estado inicial */}
      {!idClase && !cargando && (
        <div className="estado-vacio">
          <div className="vacio-icon">👆</div>
          <h3>Selecciona una clase</h3>
          <p>Elige una fecha y una clase del menú desplegable para gestionar las asistencias</p>
        </div>
      )}
    </div>
  );
};

export default RegistroAsistencias;