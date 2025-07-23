import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AsistenciasAlumnoPorFecha = () => {
  const [fecha, setFecha] = useState('');
  const [asistencias, setAsistencias] = useState([]);
  const [idAlumno, setIdAlumno] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setIdAlumno(storedUser?.id_alumno);
  }, []);

  const buscar = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/asistencia/fecha`, {
        params: { id_alumno: idAlumno, fecha }
      });
      setAsistencias(res.data);
    } catch (error) {
      console.error('Error al obtener asistencias:', error);
    }
  };

  return (
    <div>
      <h2>Asistencias por Fecha</h2>
      <div className="form-busqueda">
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
        <button onClick={buscar}>Buscar</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Clase</th>
            <th>Día</th>
            <th>Hora Inicio</th>
            <th>Hora Fin</th>
            <th>Presente</th>
          </tr>
        </thead>
        <tbody>
          {asistencias.map((a, i) => (
            <tr key={i}>
              <td>{a.nivel}</td>
              <td>{a.dia}</td>
              <td>{a.hora_inicio?.slice(0, 5)}</td>
              <td>{a.hora_fin?.slice(0, 5)}</td>
              <td>{a.presente ? '✔️' : '❌'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AsistenciasAlumnoPorFecha;
