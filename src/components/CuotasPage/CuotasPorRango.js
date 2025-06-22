import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CuotasPorRango = () => {
  const [cuotas, setCuotas] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [desde, setDesde] = useState(null);
  const [hasta, setHasta] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({});

  const fetchPlanes = () => {
    axios.get('http://localhost:3001/api/planes')
      .then(res => setPlanes(Array.isArray(res.data) ? res.data : [res.data]))
      .catch(err => console.error('Error al obtener planes:', err));
  };

  const fetchCuotas = () => {
    if (desde && hasta) {
      const d = desde.toISOString().split('T')[0];
      const h = hasta.toISOString().split('T')[0];
      axios.get(`http://localhost:3001/api/cuotas/rango?desde=${d}&hasta=${h}`)
        .then(res => setCuotas(res.data))
        .catch(err => console.error('Error al obtener cuotas por rango:', err));
    }
  };

  useEffect(() => {
    fetchPlanes();
  }, []);

  const handleEliminar = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/cuotas/eliminar/${id}`);
      setCuotas(prev => prev.filter(c => c.id_cuota !== id));
      alert('Cuota eliminada');
    } catch (error) {
      console.error('Error al eliminar cuota:', error);
    }
  };

  const handleEditarClick = (cuota) => {
    setEditandoId(cuota.id_cuota);
    setFormData({
      id_plan: cuota.id_plan,
      fecha_inicio: cuota.fecha_inicio,
      fecha_vencimiento: cuota.fecha_vencimiento,
      estado_pago: cuota.estado_pago
    });
  };

  const handleGuardar = async (id) => {
    try {
      await axios.put(`http://localhost:3001/api/cuotas/editar/${id}`, formData);
      alert('Cuota editada con éxito');
      setEditandoId(null);
      setCuotas(prev =>
        prev.map(c => c.id_cuota === id ? { ...c, ...formData } : c)
      );
    } catch (error) {
      console.error('Error al editar cuota:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h2>Cuotas por Rango de Fechas</h2>
      <label>Fecha inicio:</label>
      <input type="date" onChange={e => setDesde(new Date(e.target.value))} />
      <label>Fecha fin:</label>
      <input type="date" onChange={e => setHasta(new Date(e.target.value))} />
      <button onClick={fetchCuotas}>Buscar</button>
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
              <td>
                {editandoId === cuota.id_cuota ? (
                  <select name="id_plan" value={formData.id_plan} onChange={handleInputChange}>
                    {planes.map(p => (
                      <option key={p.id_plan} value={p.id_plan}>{p.nombre}</option>
                    ))}
                  </select>
                ) : cuota.nombre_plan}
              </td>
              <td>
                {editandoId === cuota.id_cuota ? (
                  <input type="date" name="fecha_inicio" value={formData.fecha_inicio} onChange={handleInputChange} />
                ) : cuota.fecha_inicio}
              </td>
              <td>
                {editandoId === cuota.id_cuota ? (
                  <input type="date" name="fecha_vencimiento" value={formData.fecha_vencimiento} onChange={handleInputChange} />
                ) : cuota.fecha_vencimiento}
              </td>
              <td>
                {editandoId === cuota.id_cuota ? (
                  <select name="estado_pago" value={formData.estado_pago} onChange={handleInputChange}>
                    <option value="pendiente">pendiente</option>
                    <option value="paga">paga</option>
                    <option value="vencida">vencida</option>
                  </select>
                ) : cuota.estado_pago}
              </td>
              <td>
                {editandoId === cuota.id_cuota ? (
                  <>
                    <button onClick={() => handleGuardar(cuota.id_cuota)}>Guardar</button>
                    <button onClick={() => setEditandoId(null)}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditarClick(cuota)}>✏️</button>
                    <button onClick={() => handleEliminar(cuota.id_cuota)}>🗑️</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CuotasPorRango;
