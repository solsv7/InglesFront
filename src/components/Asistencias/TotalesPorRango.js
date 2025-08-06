import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TotalesPorRango = () => {
  const [idClase, setIdClase] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [resultados, setResultados] = useState([]);
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
      setResultados(res.data);
    } catch (error) {
      console.error('Error al obtener totales por rango:', error);
    }
  };

  return (
    <div>
      <h2>Totales por Rango de Fechas</h2>
      <div className="form-busqueda">
        <select value={idClase} onChange={e => setIdClase(e.target.value)}>
  <option value="">Seleccionar clase</option>
  {clases.map(clase => (
    <option key={clase.id_clase} value={clase.id_clase}>
      {clase.nivel_nombre} - {clase.dia_nombre} - {clase.hora_inicio.slice(0, 5)}
    </option>
  ))}
</select>

        <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
        <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
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
          {resultados.map(a => (
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

export default TotalesPorRango;
