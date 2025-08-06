import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AsistenciasAlumnoPorRango = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [resultado, setResultado] = useState(null);
  const [idAlumno, setIdAlumno] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setIdAlumno(storedUser?.id_alumno);
  }, []);

  const buscar = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/asistencia/rango`, {
        params: { id_alumno: idAlumno, fecha_inicio: fechaInicio, fecha_fin: fechaFin }
      });
      setResultado(res.data[0]);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };

  return (
    <div>
      <h2>Asistencias por Rango de Fechas</h2>
      <div className="form-busqueda">
        <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
        <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
        <button onClick={buscar}>Buscar</button>
      </div>

      {resultado && (
        <table>
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
              <td>{resultado.total_clases}</td>
              <td>{resultado.total_presentes}</td>
              <td>{resultado.total_faltas}</td>
              <td>{resultado.porcentaje_asistencia}%</td>
              <td>{resultado.porcentaje_inasistencia}%</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AsistenciasAlumnoPorRango;
