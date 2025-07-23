import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RegistroAsistencias = () => {
  const [fecha, setFecha] = useState(() => new Date().toISOString().split('T')[0]);
  const [clases, setClases] = useState([]);
  const [idClaseSeleccionada, setIdClaseSeleccionada] = useState('');
  const [alumnos, setAlumnos] = useState([]);
  const [totales, setTotales] = useState([]);
  const [asistenciasCargadas, setAsistenciasCargadas] = useState([]);

    useEffect(() => {
    const fetchClases = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/clases-alumnos/clases-por-fecha?fecha=${fecha}`);
        setClases(res.data);
        setIdClaseSeleccionada(''); // Reiniciar clase seleccionada al cambiar la fecha
      } catch (error) {
        console.error('Error al obtener clases por fecha:', error);
      }
    };
    fetchClases();
  }, [fecha]);


  const handleSeleccionClase = async (idClase) => {
    setIdClaseSeleccionada(idClase);
    try {
      const resAsistencias = await axios.get(`http://localhost:3001/api/asistencia/por-clase-fecha?id_clase=${idClase}&fecha=${fecha}`);
      const asistencias = resAsistencias.data;

      if (asistencias.length > 0) {
        setAsistenciasCargadas(asistencias);
        setAlumnos([]);
      } else {
        const resAlumnos = await axios.get(`http://localhost:3001/api/clases-alumnos/por-clase/${idClase}`);
        const alumnosConEstado = resAlumnos.data.map(alumno => ({
          ...alumno,
          presente: false
        }));
        setAlumnos(alumnosConEstado);
        setAsistenciasCargadas([]);
      }

      const resTotales = await axios.get(`http://localhost:3001/api/asistencia/totales/${idClase}`);
      setTotales(resTotales.data);
    } catch (error) {
      console.error('Error al obtener datos:', error);
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
      await axios.post('http://localhost:3001/api/asistencia/registrar', payload);
      alert('Asistencias registradas correctamente');
      handleSeleccionClase(idClaseSeleccionada);
    } catch (error) {
      console.error('Error al registrar asistencias:', error);
      alert('Error al registrar asistencias');
    }
  };

  return (
    <div className="registro-asistencias">
      <h2>Registro de Asistencias</h2>

      <div className="form-busqueda">
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
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

      {idClaseSeleccionada && (
        <>
          {alumnos.length > 0 && (
            <div className="tabla-asistencias">
              <h3>Registrar asistencia</h3>
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Presente</th>
                    <th>Ausente</th>
                  </tr>
                </thead>
                <tbody>
                  {alumnos.map(alumno => (
                    <tr key={alumno.id_alumno}>
                      <td>{alumno.nombre_alumno}</td>
                      <td>
                        <input
                          type="radio"
                          checked={alumno.presente === true}
                          onChange={() => toggleAsistencia(alumno.id_alumno, true)}
                        />
                      </td>
                      <td>
                        <input
                          type="radio"
                          checked={alumno.presente === false}
                          onChange={() => toggleAsistencia(alumno.id_alumno, false)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="btn-registrar" onClick={handleRegistrar}>
                Registrar asistencias
              </button>
            </div>
          )}

          {asistenciasCargadas.length > 0 && (
            <div className="tabla-asistencias">
              <h3>Asistencias ya registradas</h3>
              <table>
                <thead>
                  <tr>
                    <th>Alumno</th>
                    <th>Presente</th>
                  </tr>
                </thead>
                <tbody>
                  {asistenciasCargadas.map(a => (
                    <tr key={a.id_alumno}>
                      <td>{a.nombre_alumno}</td>
                      <td>{a.presente ? '✔️' : '❌'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="tabla-totales">
            <h3>Totales de asistencia por alumno</h3>
            <table>
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
                    <td>{a.porcentaje_asistencia}%</td>
                    <td>{a.porcentaje_inasistencia}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default RegistroAsistencias;
