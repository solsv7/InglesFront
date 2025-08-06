import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StudentSearch from '../../components/functionalComponent/gradesComponent/StudentSearch/StudentSearch';

const RegistrarCuota = () => {
  const [idAlumno, setIdAlumno] = useState(null);
  const [planes, setPlanes] = useState([]);
  const [idPlan, setIdPlan] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/planes`)
      .then(res => {
        // Si el backend devuelve un solo plan como objeto, lo convertimos en array
        const planesRecibidos = Array.isArray(res.data) ? res.data : [res.data];
        setPlanes(planesRecibidos);
      })
      .catch(err => {
        console.error('Error al obtener planes:', err);
        setPlanes([]);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idAlumno || !idPlan || !fechaInicio || !fechaVencimiento) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/cuotas`, {
        id_alumno: idAlumno,
        id_plan: idPlan,
        fecha_inicio: fechaInicio,
        fecha_vencimiento: fechaVencimiento
      });

      alert('Cuota registrada con éxito');
      // Reiniciar formulario
      setIdPlan('');
      setFechaInicio('');
      setFechaVencimiento('');
    } catch (error) {
      console.error('Error al registrar cuota:', error);
      alert('Error al registrar cuota');
    }
  };

  return (
    <div>
      <h2>Registrar Cuota</h2>

      <StudentSearch onSelectStudent={setIdAlumno} />

      <form onSubmit={handleSubmit} className="form-cuota">
        <label>Plan:</label>
        <select value={idPlan} onChange={e => setIdPlan(e.target.value)}>
          <option value="">Seleccionar plan</option>
          {planes.map(plan => (
            <option key={plan.id_plan} value={plan.id_plan}>
              {plan.nombre}
            </option>
          ))}
        </select>

        <label>Fecha de inicio:</label>
        <input
          type="date"
          value={fechaInicio}
          onChange={e => setFechaInicio(e.target.value)}
        />

        <label>Fecha de vencimiento:</label>
        <input
          type="date"
          value={fechaVencimiento}
          onChange={e => setFechaVencimiento(e.target.value)}
        />

        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default RegistrarCuota;
