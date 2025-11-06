import React, { useEffect, useState } from 'react';
import './RegistroAsistencias.css';
import axios from 'axios';

const RegistroAsistencias = () => {
  const [fecha, setFecha] = useState(() => new Date().toISOString().split('T')[0]);
  const [clases, setClases] = useState([]);
  const [idClaseSeleccionada, setIdClaseSeleccionada] = useState('');
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
        setIdClaseSeleccionada('');
      } catch (error) {
        console.error('Error al obtener clases por fecha:', error);
      } finally {
        setCargando(false);
      }
    };
    fetchClases();
  }, [fecha]);

  const handleSeleccionClase = async (idClase) => {
    if (!idClase) return;
    
    setIdClaseSeleccionada(idClase);
    setCargando(true);
    
    try {
      const [resAsistencias, resAlumnos, resTotales] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/asistencia/por-clase-fecha?id_clase=${idClase}&fecha=${fecha}`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/clases-alumnos/por-clase/${idClase}`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/asistencia/totales/${idClase}`)
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
        id_clase: idClaseSeleccionada,
        fecha,
        asistencias: alumnos.map(a => ({
          id_alumno: a.id_alumno,
          presente: a.presente ? 1 : 0
        }))
      };
      await axios.post(`${process.env.REACT_APP_API_URL}/api/asistencia/registrar`, payload);
      alert('Asistencias registradas correctamente');
      handleSeleccionClase(idClaseSeleccionada);
    } catch (error) {
      console.error('Error al registrar asistencias:', error);
      alert('Error al registrar asistencias');
    }
  };

  const getPorcentajeClase = (porcentaje) => {
    if (porcentaje >= 80) return 'ra-porcentaje-alto';
    if (porcentaje >= 60) return 'ra-porcentaje-medio';
    return 'ra-porcentaje-bajo';
  };

  return (
    <div className="registro-asistencias-container">
      <h2>Registro de Asistencias</h2>

      <div className="ra-form-busqueda">
        <input 
          type="date" 
          value={fecha} 
          onChange={e => setFecha(e.target.value)} 
        />
        <select
          value={idClaseSeleccionada}
          onChange={(e) => handleSeleccionClase(e.target.value)}
        >
          <option value="">Seleccionar clase</option>
          {clases.map(clase => (
            <option key={clase.id_clase} value={clase.id_clase}>
              {clase.nivel} - {clase.dia} - {clase.hora_inicio?.slice(0, 5)}
            </option>
          ))}
        </select>
      </div>

      {cargando && (
        <div className="ra-mensaje-cargando">Cargando datos...</div>
      )}

      {idClaseSeleccionada && !cargando && (
        <>
          {/* Tabla para registrar nuevas asistencias */}
          {alumnos.length > 0 && (
            <div className="ra-tabla-container">
              <h3>Registrar Asistencia</h3>
              <table className="ra-tabla">
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
                        <div className="ra-radio-group">
                          <label className="ra-radio-label presente">
                            <input
                              type="radio"
                              name={`asistencia-${alumno.id_alumno}`}
                              checked={alumno.presente === true}
                              onChange={() => toggleAsistencia(alumno.id_alumno, true)}
                            />
                            Presente
                          </label>
                          <label className="ra-radio-label ausente">
                            <input
                              type="radio"
                              name={`asistencia-${alumno.id_alumno}`}
                              checked={alumno.presente === false}
                              onChange={() => toggleAsistencia(alumno.id_alumno, false)}
                            />
                            Ausente
                          </label>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="ra-btn-registrar" onClick={handleRegistrar}>
                Registrar Asistencias
              </button>
            </div>
          )}

          {/* Tabla de asistencias ya registradas */}
          {asistenciasCargadas.length > 0 && (
            <div className="ra-tabla-container">
              <h3>Asistencias Registradas</h3>
              <table className="ra-tabla">
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
                      <td className={a.presente ? 'ra-estado-presente' : 'ra-estado-ausente'}>
                        {a.presente ? 'Presente' : 'Ausente'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tabla de totales */}
          {totales.length > 0 && (
            <div className="ra-tabla-container">
              <h3>Estadísticas de Asistencia</h3>
              <table className="ra-tabla">
                <thead>
                  <tr>
                    <th>Alumno</th>
                    <th>Asistencias</th>
                    <th>Inasistencias</th>
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
                      <td className={getPorcentajeClase(a.porcentaje_asistencia)}>
                        {a.porcentaje_asistencia}%
                      </td>
                      <td className={getPorcentajeClase(a.porcentaje_inasistencia)}>
                        {a.porcentaje_inasistencia}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {!idClaseSeleccionada && !cargando && (
        <div className="ra-mensaje-vacio">
          Selecciona una fecha y una clase para comenzar
        </div>
      )}
    </div>
  );
};

export default RegistroAsistencias;