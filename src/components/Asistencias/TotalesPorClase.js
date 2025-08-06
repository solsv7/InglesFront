import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div>
      <h2>Totales de Asistencia por Clase</h2>
      <div className="form-busqueda">
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
  );
};

export default TotalesPorClase;
