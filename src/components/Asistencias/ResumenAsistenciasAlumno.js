import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ResumenAsistenciasAlumno = () => {
  const [resumen, setResumen] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const id_alumno = storedUser?.id_alumno;

    if (id_alumno) {
      axios.get(`${process.env.REACT_APP_API_URL}/api/asistencia/resumen/${id_alumno}`)
        .then(res => setResumen(res.data[0]))
        .catch(err => console.error('Error al obtener resumen:', err));
    }
  }, []);

  return (
    <div>
      <h2>Resumen General de Asistencias</h2>
      {resumen && (
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
              <td>{resumen.total_clases}</td>
              <td>{resumen.total_presentes}</td>
              <td>{resumen.total_faltas}</td>
              <td>{resumen.porcentaje_asistencia}%</td>
              <td>{resumen.porcentaje_inasistencia}%</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ResumenAsistenciasAlumno;
