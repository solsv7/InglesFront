import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VerAsistenciasPorFecha = () => {
  const [fecha, setFecha] = useState('');
  const [idClase, setIdClase] = useState('');
  const [asistencias, setAsistencias] = useState([]);
  const [clases, setClases] = useState([]);

  useEffect(() => {
    const fetchClases = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/clases');
        setClases(res.data);
      } catch (error) {
        console.error('Error al obtener clases:', error);
      }
    };
    fetchClases();
  }, []);

  const buscar = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/asistencia/por-clase-fecha?id_clase=${idClase}&fecha=${fecha}`);
      setAsistencias(res.data);
    } catch (error) {
      console.error('Error al obtener asistencias:', error);
    }
  };

  return (
    <div>
      <h2>Asistencias por Clase y Fecha</h2>
      <div className="form-busqueda">
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
        <select value={idClase} onChange={e => setIdClase(e.target.value)}>
  <option value="">Seleccionar clase</option>
  {clases.map(clase => (
    <option key={clase.id_clase} value={clase.id_clase}>
      {clase.nivel_nombre} - {clase.dia_nombre} - {clase.hora_inicio.slice(0, 5)}
    </option>
  ))}
</select>

        <button onClick={buscar}>Buscar</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Alumno</th>
            <th>Presente</th>
          </tr>
        </thead>
        <tbody>
          {asistencias.map(a => (
            <tr key={a.id_alumno}>
              <td>{a.nombre_alumno}</td>
              <td>{a.presente ? '✔️' : '❌'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VerAsistenciasPorFecha;
