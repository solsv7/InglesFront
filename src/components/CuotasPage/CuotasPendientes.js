import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CuotasPendientes = () => {
  const [cuotas, setCuotas] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/cuotas/pendientes`)
      .then(res => setCuotas(res.data))
      .catch(err => console.error('Error al obtener cuotas pendientes:', err));
  }, []);

  const handleEliminar = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/cuotas/eliminar/${id}`);
      setCuotas(prev => prev.filter(c => c.id_cuota !== id));
    } catch (error) {
      console.error('Error al eliminar cuota:', error);
    }
  };

  const handleEstadoChange = async (id, nuevoEstado) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/cuotas/editar/${id}`, { estado_pago: nuevoEstado });
      setCuotas(prev =>
        prev.map(cuota =>
          cuota.id_cuota === id ? { ...cuota, estado_pago: nuevoEstado } : cuota
        )
      );
    } catch (error) {
      console.error('Error al actualizar el estado de la cuota:', error);
    }
  };

  return (
    <div>
      <h2>Cuotas Pendientes</h2>
      <table>
        <thead>
          <tr>
            <th>Alumno</th>
            <th>Plan</th>
            <th>Inicio</th>
            <th>Vencimiento</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cuotas.map((cuota) => (
            <tr key={cuota.id_cuota}>
              <td>{cuota.nombre_alumno}</td>
              <td>{cuota.nombre_plan}</td>
              <td>{cuota.fecha_inicio}</td>
              <td>{cuota.fecha_vencimiento}</td>
              <td>
                <select
                  value={cuota.estado_pago}
                  onChange={(e) => handleEstadoChange(cuota.id_cuota, e.target.value)}
                >
                  <option value="pendiente">pendiente</option>
                  <option value="paga">paga</option>
                  <option value="vencida">vencida</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleEliminar(cuota.id_cuota)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CuotasPendientes;
