import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StudentSearch from '../../components/functionalComponent/gradesComponent/StudentSearch/StudentSearch';
import { 
  FaMoneyBillWave, 
  FaCalendarAlt, 
  FaCalendarCheck, 
  FaPaperPlane,
  FaUserGraduate,
  FaExclamationTriangle
} from 'react-icons/fa';
import './RegistrarCuota.css';

const RegistrarCuota = () => {
  const [idAlumno, setIdAlumno] = useState(null);
  const [planes, setPlanes] = useState([]);
  const [idPlan, setIdPlan] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/planes`)
      .then(res => {
        const planesRecibidos = Array.isArray(res.data) ? res.data : [res.data];
        setPlanes(planesRecibidos);
      })
      .catch(err => {
        console.error('Error al obtener planes:', err);
        setPlanes([]);
        setError('Error al cargar los planes disponibles');
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!idAlumno || !idPlan || !fechaInicio || !fechaVencimiento) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    if (new Date(fechaInicio) > new Date(fechaVencimiento)) {
      setError('La fecha de inicio no puede ser posterior a la fecha de vencimiento.');
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/cuotas`, {
        id_alumno: idAlumno,
        id_plan: idPlan,
        fecha_inicio: fechaInicio,
        fecha_vencimiento: fechaVencimiento
      });

      setSuccess(true);
      setIdPlan('');
      setFechaInicio('');
      setFechaVencimiento('');
      setIdAlumno(null);
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error al registrar cuota:', error);
      setError('Error al registrar la cuota. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const estaHoy = new Date().toISOString().split('T')[0];

  return (
    <div className="registrar-cuota-container">

      {/* Búsqueda de Alumno */}
      <div className="search-section">
        <div className="section-header">
          <FaUserGraduate className="section-icon" />
          <h3>Seleccionar Alumno</h3>
        </div>
        <div className="student-search-wrapper">
          <StudentSearch onSelectStudent={setIdAlumno} />
        </div>
        {idAlumno && (
          <div className="selected-student-indicator">
            <FaUserGraduate className="indicator-icon" />
            <span>Alumno seleccionado</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="cuota-form">
        {/* Plan Selection */}
        <div className="form-section">
          <div className="section-header">
            <FaMoneyBillWave className="section-icon" />
            <h3>Información de cuota</h3>
          </div>
          
          <div className="input-group">
            <label htmlFor="plan">
              Plan de Pago
            </label>
            <div className="select-wrapper">
              <select 
                id="plan"
                value={idPlan} 
                onChange={e => setIdPlan(e.target.value)}
                className="modern-select"
                required
              >
                <option value="">Seleccionar plan de pago</option>
                {planes.map(plan => (
                  <option key={plan.id_plan} value={plan.id_plan}>
                    {plan.nombre} - ${plan.monto}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Fechas Section */}
        <div className="form-section">
          <div className="section-header">
            <FaCalendarAlt className="section-icon" />
            <h3>Período de la Cuota</h3>
          </div>

          <div className="fechas-grid">
            <div className="input-group">
              <label htmlFor="fechaInicio">
                Fecha de Inicio
              </label>
              <div className="input-wrapper">
                <input
                  id="fechaInicio"
                  type="date"
                  value={fechaInicio}
                  onChange={e => setFechaInicio(e.target.value)}
                  min={estaHoy}
                  className="modern-input"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="fechaVencimiento">
                Fecha de Vencimiento
              </label>
              <div className="input-wrapper">
                <input
                  id="fechaVencimiento"
                  type="date"
                  value={fechaVencimiento}
                  onChange={e => setFechaVencimiento(e.target.value)}
                  min={fechaInicio || estaHoy}
                  className="modern-input"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mensajes de Estado */}
        {error && (
          <div className="error-message">
            <FaExclamationTriangle className="error-icon" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="success-message">
            <FaPaperPlane className="success-icon" />
            <span>¡Cuota registrada con éxito!</span>
          </div>
        )}

        {/* Submit Button */}
        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading || !idAlumno}
        >
          {loading ? (
            <>
              <div className="loading-spinner"></div>
              Registrando Cuota...
            </>
          ) : (
            <>
              <FaPaperPlane className="btn-icon" />
              Registrar Cuota
            </>
          )}
        </button>
      </form>

    </div>
  );
};

export default RegistrarCuota;